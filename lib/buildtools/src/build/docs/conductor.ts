import * as td from 'typedoc';

const CONDUCTOR_PACKAGE = '@sourceacademy/conductor';
const TYPED_VALUE_NAMES = new Set(['TypedValue', 'ITypedValue']);
const SERVICE_PARAMETER_TYPES = new Set([
  'IDataHandler',
  'IInterfacableEvaluator',
  'IChannel',
  'IConduit'
]);

const DATA_TYPE_NAMES = new Set([
  'VOID',
  'BOOLEAN',
  'NUMBER',
  'CONST_STRING',
  'EMPTY_LIST',
  'PAIR',
  'ARRAY',
  'CLOSURE',
  'OPAQUE',
  'LIST'
]);

/**
 * Narrows a TypeDoc type to references, which is how Conductor transport types appear.
 */
function isReferenceType(type: td.SomeType | undefined): type is td.ReferenceType {
  return type instanceof td.ReferenceType;
}

/**
 * Checks whether a reference points at one of the Conductor symbols this normalizer understands.
 */
function isConductorReference(type: td.ReferenceType, names: Set<string>) {
  return names.has(type.name) && (!type.package || type.package === CONDUCTOR_PACKAGE);
}

/**
 * Detects `DataType.X` references inside `TypedValue`/`ITypedValue` type arguments.
 */
function isDataTypeReference(type: td.SomeType | undefined): type is td.ReferenceType {
  if (!isReferenceType(type)) return false;

  const qualifiedName = type.qualifiedName ?? type.name;
  return DATA_TYPE_NAMES.has(type.name)
    && (qualifiedName === type.name || qualifiedName === `DataType.${type.name}`);
}

/**
 * Returns the enum member name from a Conductor `DataType.X` type reference.
 */
function getDataTypeName(type: td.SomeType | undefined) {
  return isDataTypeReference(type) ? type.name : undefined;
}

/**
 * Creates an unresolved public-facing type name that TypeDoc renders as plain text.
 */
function namedType(name: string, project: td.ProjectReflection) {
  return td.ReferenceType.createBrokenReference(name, project, undefined);
}

/**
 * Converts a Conductor `DataType` enum member to the type shown to module users.
 */
function dataTypeToNativeType(dataType: string | undefined, project: td.ProjectReflection): td.SomeType {
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
 * Copies visibility and modifier flags when replacing TypeDoc reflection nodes.
 */
function cloneFlags(source: td.Reflection, target: td.Reflection) {
  target.flags.fromObject(source.flags.toObject());
}

/**
 * Normalizes every type argument in a reference or tuple-like TypeDoc type.
 */
function normalizeTypeList(types: td.SomeType[] | undefined, project: td.ProjectReflection) {
  return types?.map(type => normalizeConductorType(type, project));
}

/**
 * Converts Conductor transport types to the native values that module users see.
 */
export function normalizeConductorType(type: td.SomeType, project: td.ProjectReflection): td.SomeType {
  if (type instanceof td.ReferenceType) {
    if (isConductorReference(type, TYPED_VALUE_NAMES)) {
      return dataTypeToNativeType(getDataTypeName(type.typeArguments?.[0]), project);
    }

    if (type.name === 'AsyncGenerator' && type.typeArguments?.[1]) {
      return normalizeConductorType(type.typeArguments[1], project);
    }

    type.typeArguments = normalizeTypeList(type.typeArguments, project);
    return type;
  }

  if (type instanceof td.ArrayType) {
    type.elementType = normalizeConductorType(type.elementType, project);
    return type;
  }

  if (type instanceof td.ConditionalType) {
    type.checkType = normalizeConductorType(type.checkType, project);
    type.extendsType = normalizeConductorType(type.extendsType, project);
    type.trueType = normalizeConductorType(type.trueType, project);
    type.falseType = normalizeConductorType(type.falseType, project);
    return type;
  }

  if (type instanceof td.IndexedAccessType) {
    type.objectType = normalizeConductorType(type.objectType, project);
    type.indexType = normalizeConductorType(type.indexType, project);
    return type;
  }

  if (type instanceof td.InferredType) {
    if (type.constraint) {
      type.constraint = normalizeConductorType(type.constraint, project);
    }
    return type;
  }

  if (type instanceof td.IntersectionType || type instanceof td.UnionType) {
    type.types = type.types.map(each => normalizeConductorType(each, project));
    return type;
  }

  if (type instanceof td.MappedType) {
    type.parameterType = normalizeConductorType(type.parameterType, project);
    type.templateType = normalizeConductorType(type.templateType, project);
    if (type.nameType) {
      type.nameType = normalizeConductorType(type.nameType, project);
    }
    return type;
  }

  if (type instanceof td.OptionalType || type instanceof td.RestType) {
    type.elementType = normalizeConductorType(type.elementType, project);
    return type;
  }

  if (type instanceof td.PredicateType) {
    if (type.targetType) {
      type.targetType = normalizeConductorType(type.targetType, project);
    }
    return type;
  }

  if (type instanceof td.ReflectionType) {
    normalizeDeclaration(type.declaration, project);
    return type;
  }

  if (type instanceof td.TupleType) {
    type.elements = type.elements.map(each => normalizeConductorType(each, project));
    return type;
  }

  if (type instanceof td.NamedTupleMember) {
    type.element = normalizeConductorType(type.element, project);
    return type;
  }

  if (type instanceof td.TypeOperatorType) {
    type.target = normalizeConductorType(type.target, project);
    return type;
  }

  if (type instanceof td.TemplateLiteralType) {
    type.tail = type.tail.map(([tailType, text]) => [
      normalizeConductorType(tailType, project),
      text
    ]);
    return type;
  }

  return type;
}

/**
 * Identifies evaluator/conduit parameters that are implementation plumbing, not public API.
 */
function isServiceParameter(parameter: td.ParameterReflection) {
  if (!isReferenceType(parameter.type)) return false;
  return isConductorReference(parameter.type, SERVICE_PARAMETER_TYPES);
}

/**
 * Rewrites one call signature from Conductor-facing types to public module-facing types.
 */
function normalizeSignature(signature: td.SignatureReflection, project: td.ProjectReflection) {
  if (signature.type) {
    project.removeTypeReflections(signature.type);
    signature.type = normalizeConductorType(signature.type, project);
  }

  signature.parameters = signature.parameters
    ?.filter(parameter => !isServiceParameter(parameter))
    .map(parameter => {
      if (parameter.type) {
        project.removeTypeReflections(parameter.type);
        parameter.type = normalizeConductorType(parameter.type, project);
      }
      return parameter;
    });
}

/**
 * Applies signature/type normalization to a declaration and its accessors.
 */
function normalizeDeclaration(declaration: td.DeclarationReflection, project: td.ProjectReflection) {
  if (declaration.type) {
    project.removeTypeReflections(declaration.type);
    declaration.type = normalizeConductorType(declaration.type, project);
  }

  declaration.signatures?.forEach(signature => normalizeSignature(signature, project));
  declaration.indexSignatures?.forEach(signature => normalizeSignature(signature, project));

  if (declaration.getSignature) {
    normalizeSignature(declaration.getSignature, project);
  }

  if (declaration.setSignature) {
    normalizeSignature(declaration.setSignature, project);
  }
}

/**
 * Detects migrated module plugin classes without depending on the concrete base-class name.
 */
function isConductorPluginClass(reflection: td.DeclarationReflection) {
  if (reflection.kind !== td.ReflectionKind.Class) return false;

  const exportedNames = getExportedNames(reflection);
  if (exportedNames.size === 0) return false;

  return reflection.children?.some(child => isExportedConductorMethod(child, exportedNames)) ?? false;
}

/**
 * Extracts string literal values from the tuple/union TypeDoc emits for `exportedNames`.
 */
function getStringLiterals(type: td.SomeType | undefined): string[] {
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
function getExportedNames(plugin: td.DeclarationReflection) {
  const exportedNames = plugin.children?.find(child => child.name === 'exportedNames');
  return new Set(getStringLiterals(exportedNames?.type));
}

/**
 * Checks whether a type tree contains Conductor transport wrappers.
 */
function hasConductorTransportType(type: td.SomeType | undefined): boolean {
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
function isExportedConductorMethod(
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
function getSignatureComment(
  implementationSignature: td.SignatureReflection | undefined,
  pluginSignature: td.SignatureReflection
) {
  return implementationSignature?.comment ?? pluginSignature.comment;
}

/**
 * Copies a method parameter onto a public function signature with normalized type/comment data.
 */
function cloneParameter(
  parameter: td.ParameterReflection,
  parent: td.SignatureReflection,
  project: td.ProjectReflection,
  commentSource: td.ParameterReflection | undefined
) {
  const clone = new td.ParameterReflection(parameter.name, td.ReflectionKind.Parameter, parent);
  cloneFlags(parameter, clone);
  clone.comment = commentSource?.comment ?? parameter.comment;
  clone.defaultValue = parameter.defaultValue;
  clone.type = parameter.type ? normalizeConductorType(parameter.type, project) : undefined;
  project.registerReflection(clone, undefined, undefined);
  return clone;
}

/**
 * Builds the public function signature from the plugin method and matching implementation docs.
 */
function copyPluginSignature(
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
    return cloneParameter(parameter, targetSignature, project, implementationParameter);
  });
}

/**
 * Finds an existing top-level function reflection for a module export.
 */
function findPublicFunction(container: td.ContainerReflection, name: string) {
  return container.children?.find(child => {
    return child.name === name
      && child.kind === td.ReflectionKind.Function;
  });
}

/**
 * Creates a new top-level function reflection when the plugin method has no implementation twin.
 */
function createPublicFunction(
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
 * Converts exported plugin methods into top-level functions and merges their public docs.
 */
function promotePluginMethods(
  container: td.ContainerReflection,
  plugin: td.DeclarationReflection,
  project: td.ProjectReflection
) {
  const exportedNames = getExportedNames(plugin);

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
function groupNamesFor(reflection: td.DeclarationReflection | td.DocumentReflection) {
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
function syncGroups(container: td.ContainerReflection) {
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

/**
 * Normalizes one container and recursively visits nested modules/namespaces.
 */
function normalizeContainer(container: td.ContainerReflection, project: td.ProjectReflection): boolean {
  let mutated = false;
  const pluginClasses = container.children?.filter(isConductorPluginClass) ?? [];

  pluginClasses.forEach(plugin => {
    promotePluginMethods(container, plugin, project);
    project.removeReflection(plugin);
    mutated = true;
  });

  container.children?.forEach(child => {
    normalizeDeclaration(child, project);

    if (child.isContainer()) {
      const childMutated = normalizeContainer(child, project);
      mutated = mutated || childMutated;
    }
  });

  if (mutated) {
    syncGroups(container);
  }

  return mutated;
}

/**
 * Rewrites Conductor module implementation details into the public API surface.
 */
export function normalizeConductorDocs(project: td.ProjectReflection) {
  normalizeContainer(project, project);
}
