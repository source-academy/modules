import * as td from 'typedoc';
import { CONDUCTOR_PACKAGE, DATA_TYPE_NAMES, SERVICE_PARAMETER_TYPES, TYPED_VALUE_NAMES } from './constants.js';
import { normalizeConductorType } from './normalisation.js';

/**
 * Narrows a TypeDoc type to references, which is how Conductor transport types appear.
 */
export function isReferenceType(type: td.SomeType | undefined): type is td.ReferenceType {
  return type instanceof td.ReferenceType;
}

/**
 * Checks whether a reference points at one of the Conductor symbols this normalizer understands.
 * Matches on the canonical exported name (falling back to the local name) so that aliased
 * imports (e.g. `import { BaseModulePlugin as X }`) are still recognized.
 */
export function isConductorReference(type: td.ReferenceType, names: Set<string>) {
  const qualifiedName = type.qualifiedName ?? type.name;
  return names.has(qualifiedName) && (!type.package || type.package === CONDUCTOR_PACKAGE);
}

/**
 * Detects `DataType.X` references inside `TypedValue`/`ITypedValue` type arguments.
 */
export function isDataTypeReference(type: td.SomeType | undefined): type is td.ReferenceType {
  if (!isReferenceType(type)) return false;

  const qualifiedName = type.qualifiedName ?? type.name;
  return DATA_TYPE_NAMES.has(type.name)
    && (qualifiedName === type.name || qualifiedName === `DataType.${type.name}`);
}

/**
 * Returns the enum member name from a Conductor `DataType.X` type reference.
 */
export function getDataTypeName(type: td.SomeType | undefined) {
  return isDataTypeReference(type) ? type.name : undefined;
}

/**
 * Creates an unresolved public-facing type name that TypeDoc renders as plain text.
 */
export function namedType(name: string, project: td.ProjectReflection) {
  return td.ReferenceType.createBrokenReference(name, project, undefined);
}

/**
 * Converts a Conductor `DataType` enum member to the type shown to module users.
 */
export function dataTypeToNativeType(dataType: string | undefined, project: td.ProjectReflection): td.SomeType {
  switch (dataType) {
    case 'VOID':
      return new td.IntrinsicType('void');
    case 'BOOLEAN':
      return new td.IntrinsicType('boolean');
    case 'NUMBER':
      return new td.IntrinsicType('number');
    case 'CONST_STRING':
      return new td.IntrinsicType('string');
    case 'EMPTY_LIST':
      return new td.LiteralType(null);
    case 'PAIR':
      return namedType('Pair', project);
    case 'ARRAY':
      return new td.ArrayType(new td.UnknownType('unknown'));
    case 'CLOSURE':
      return namedType('Function', project);
    case 'OPAQUE':
      return new td.UnknownType('unknown');
    case 'LIST':
      return namedType('List', project);
    default:
      return new td.UnknownType('unknown');
  }
}

/**
 * Identifies evaluator/conduit parameters that are implementation plumbing, not public API.
 */
export function isServiceParameter(parameter: td.ParameterReflection) {
  if (!isReferenceType(parameter.type)) return false;
  return isConductorReference(parameter.type, SERVICE_PARAMETER_TYPES);
}

/**
 * Detects migrated module plugin classes without depending on the concrete base-class name.
 */
export function isConductorPluginClass(reflection: td.DeclarationReflection) {
  if (reflection.kind !== td.ReflectionKind.Class) return false;

  return reflection.extendedTypes?.some(type => {
    if (!isReferenceType(type)) return false;
    return isConductorReference(type, new Set(['BaseModulePlugin', 'IModulePlugin', 'IPlugin', 'Plugin']));
  }) ?? false;
}

/**
 * Extracts string literal values from the tuple/union TypeDoc emits for `exportedNames`.
 */
export function getStringLiterals(type: td.SomeType | undefined): string[] {
  if (type instanceof td.TypeOperatorType) {
    return getStringLiterals(type.target);
  }

  if (type instanceof td.TupleType) {
    return type.elements.flatMap(getStringLiterals);
  }

  if (type instanceof td.UnionType) {
    return type.types.flatMap(getStringLiterals);
  }

  if (type instanceof td.LiteralType && typeof type.value === 'string') {
    return [type.value];
  }

  return [];
}

/**
 * Reads the authoritative list of public module exports from a plugin class.
 */
export function getExportedNames(plugin: td.DeclarationReflection) {
  const exportedNames = plugin.children?.find(child => child.name === 'exportedNames');
  return new Set(getStringLiterals(exportedNames?.type));
}

/**
 * Checks whether a type tree contains Conductor transport wrappers.
 */
export function hasConductorTransportType(type: td.SomeType | undefined): boolean {
  if (!type) return false;

  if (type instanceof td.ReferenceType) {
    if (isConductorReference(type, TYPED_VALUE_NAMES)) {
      return true;
    }

    return type.typeArguments?.some(hasConductorTransportType) ?? false;
  }

  if (type instanceof td.ArrayType) {
    return hasConductorTransportType(type.elementType);
  }

  if (type instanceof td.UnionType || type instanceof td.IntersectionType) {
    return type.types.some(hasConductorTransportType);
  }

  if (type instanceof td.TypeOperatorType) {
    return hasConductorTransportType(type.target);
  }

  if (type instanceof td.TupleType) {
    return type.elements.some(hasConductorTransportType);
  }

  return false;
}

/**
 * Determines whether a class method is both publicly exported and Conductor-shaped.
 */
export function isExportedConductorMethod(
  child: td.DeclarationReflection,
  exportedNames: Set<string>
) {
  if (child.kind !== td.ReflectionKind.Method || !exportedNames.has(child.name)) {
    return false;
  }

  return child.signatures?.some(signature => {
    return hasConductorTransportType(signature.type)
      || signature.parameters?.some(parameter => hasConductorTransportType(parameter.type));
  }) ?? false;
}

/**
 * Prefers implementation JSDoc over wrapper-method JSDoc when both are available.
 */
export function getSignatureComment(
  implementationSignature: td.SignatureReflection | undefined,
  pluginSignature: td.SignatureReflection
) {
  return implementationSignature?.comment ?? pluginSignature.comment;
}

/**
 * Copies a method parameter onto a public export function  signature with normalized type/comment data.
 */
export function cloneParameter(
  parameter: td.ParameterReflection,
  parent: td.SignatureReflection,
  project: td.ProjectReflection,
  commentSource: td.ParameterReflection | undefined,
) {
  const clone = new td.ParameterReflection(
    parameter.name,
    td.ReflectionKind.Parameter,
    parent
  );
  cloneFlags(parameter, clone);
  clone.comment = commentSource?.comment ?? parameter.comment;
  clone.defaultValue = parameter.defaultValue;
  clone.type = parameter.type ? normalizeConductorType(parameter.type, project) : undefined;
  project.registerReflection(clone, undefined, undefined);
  return clone;
}

/**
 * Copies visibility and modifier flags when replacing TypeDoc reflection nodes.
 */
export function cloneFlags(source: td.Reflection, target: td.Reflection) {
  target.flags.fromObject(source.flags.toObject());
}

/**
 * Builds the public export function signature from the plugin method and matching implementation docs.
 */
export function copyPluginSignature(
  target: td.DeclarationReflection,
  pluginSignature: td.SignatureReflection,
  project: td.ProjectReflection,
  implementationSignature: td.SignatureReflection | undefined
) {
  const targetSignature = target.signatures?.[0]
    ?? new td.SignatureReflection(target.name, td.ReflectionKind.CallSignature, target);

  if (!target.signatures?.includes(targetSignature)) {
    target.signatures = [targetSignature];
    project.registerReflection(targetSignature, undefined, undefined);
  }

  cloneFlags(pluginSignature, targetSignature);
  targetSignature.comment = getSignatureComment(implementationSignature, pluginSignature);
  targetSignature.type = pluginSignature.type
    ? normalizeConductorType(pluginSignature.type, project)
    : undefined;

  targetSignature.parameters = pluginSignature.parameters?.map(parameter => {
    const implementationParameter = implementationSignature?.parameters
      ?.find(each => each.name === parameter.name);
    return cloneParameter(
      parameter,
      targetSignature,
      project,
      implementationParameter
    );
  });
}

/**
 * Finds an existing top-level export function reflection for a module export.
 */
export function findPublicFunction(container: td.ContainerReflection, name: string) {
  return container.children?.find(child => {
    return child.name === name
      && child.kind === td.ReflectionKind.Function;
  });
}

/**
 * Creates a new top-level export function reflection when the plugin method has no implementation twin.
 */
export function createPublicFunction(
  container: td.ContainerReflection,
  name: string,
  project: td.ProjectReflection
) {
  const reflection = new td.DeclarationReflection(name, td.ReflectionKind.Function, container);
  container.addChild(reflection);
  project.registerReflection(reflection, undefined, undefined);
  return reflection;
}

/**
 * Finds an existing top-level export variable reflection for a module export.
 */
export function findPublicVariable(container: td.ContainerReflection, name: string) {
  return container.children?.find(child => {
    return child.name === name
      && child.kind === td.ReflectionKind.Variable;
  });
}

/**
 * Creates a new top-level export variable reflection for a decorated plugin constant.
 */
export function createPublicVariable(
  container: td.ContainerReflection,
  name: string,
  project: td.ProjectReflection
) {
  const reflection = new td.DeclarationReflection(name, td.ReflectionKind.Variable, container);
  container.addChild(reflection);
  project.registerReflection(reflection, undefined, undefined);
  return reflection;
}

/**
 * Copies a decorated plugin property onto a public variable reflection.
 */
export function copyPluginVariable(
  target: td.DeclarationReflection,
  property: td.DeclarationReflection,
  project: td.ProjectReflection
) {
  cloneFlags(property, target);
  target.comment = target.comment ?? property.comment;
  target.defaultValue = property.defaultValue;
  target.type = property.type
    ? normalizeConductorType(property.type, project)
    : undefined;
}

export function isExportedVariable(reflection: td.DeclarationReflection) {
  return reflection.comment?.blockTags?.some(tag => tag.tag === '@publicType');
}

/**
 * Converts exported plugin methods into top-level functions and merges their public docs.
 */
export function promotePluginMethods(
  container: td.ContainerReflection,
  plugin: td.DeclarationReflection,
  project: td.ProjectReflection
) {
  const exportedNames = getExportedNames(plugin);

  plugin.children
    ?.filter(child => child.kind === td.ReflectionKind.Property && isExportedVariable(child))
    .forEach(property => {
      const publicVariable = findPublicVariable(container, property.name)
        ?? createPublicVariable(container, property.name, project);
      copyPluginVariable(publicVariable, property, project);
    });

  plugin.children
    ?.filter(child => child.kind === td.ReflectionKind.Method && exportedNames.has(child.name))
    .forEach(method => {
      const pluginSignature = method.signatures?.[0];
      if (!pluginSignature) return;

      const publicFunction = findPublicFunction(container, method.name)
        ?? createPublicFunction(container, method.name, project);
      const implementationSignature = publicFunction.signatures?.[0];

      copyPluginSignature(publicFunction, pluginSignature, project, implementationSignature);
    });
}

/**
 * Preserves explicit `@group` tags, otherwise derives the default TypeDoc group title.
 */
export function groupNamesFor(reflection: td.DeclarationReflection | td.DocumentReflection) {
  const explicitGroups = reflection.comment?.blockTags
    ?.filter(tag => tag.tag === '@group')
    ?.map(tag => td.Comment.combineDisplayParts(tag.content).trim())
    ?.filter(Boolean);

  return explicitGroups?.length
    ? explicitGroups
    : [td.ReflectionKind.pluralString(reflection.kind)];
}

/**
 * Reconciles TypeDoc groups after removing plugin classes and adding promoted functions.
 */
export function syncGroups(container: td.ContainerReflection) {
  const children = container.childrenIncludingDocuments ?? [];
  const childSet = new Set(children);
  const groupedChildren = new Set<td.DeclarationReflection | td.DocumentReflection>();

  container.groups = container.groups
    ?.map(group => {
      group.children = group.children.filter(child => childSet.has(child));
      group.children.forEach(child => groupedChildren.add(child));
      delete group.categories;
      return group;
    })
    .filter(group => group.children.length > 0);

  children
    .filter(child => !groupedChildren.has(child))
    .forEach(child => {
      groupNamesFor(child).forEach(groupName => {
        let group = container.groups?.find(each => each.title === groupName);
        if (!group) {
          group = new td.ReflectionGroup(groupName, container);
          const groups = container.groups ?? [];
          container.groups = [...groups, group];
        }

        group.children.push(child);
      });
    });

  if (container.groups?.length === 0) {
    delete container.groups;
  }

  delete container.categories;
}
