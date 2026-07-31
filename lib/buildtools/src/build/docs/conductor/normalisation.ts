import * as td from 'typedoc';
import { TYPED_VALUE_NAMES } from './constants.js';
import { dataTypeToNativeType, getDataTypeName, isConductorPluginClass, isConductorReference, isServiceParameter, promotePluginMethods, syncGroups } from './utils.js';

/**
 * Rewrites one call signature from Conductor-facing types to public module-facing types.
 */
function normalizeSignature(signature: td.SignatureReflection, project: td.ProjectReflection) {

  const devDefinedTypeDeclaration: DevDefinedTypeDeclaration = { arguments: {}, return: undefined };
  if (signature.comment?.blockTags) {
    signature.comment.blockTags.forEach(tag => {
      if (tag.tag == '@publicType' && tag.content) {
        const [argName, argType] = tag.content[0].text.split(/:\s(.+)/).map(s => s.trim());
        devDefinedTypeDeclaration.arguments[argName] = argType;
      }
      if (tag.tag == '@publicReturnType' && tag.content) {
        devDefinedTypeDeclaration.return = tag.content[0].text;
      }
    });
    signature.comment.blockTags = signature.comment.blockTags.filter(tag => tag.tag !== '@publicType' && tag.tag !== '@publicReturnType');
  }

  if (devDefinedTypeDeclaration.return) {
    signature.type = new td.UnknownType(devDefinedTypeDeclaration.return);
  } else if (signature.type) {
    project.removeTypeReflections(signature.type);
    signature.type = normalizeConductorType(signature.type, project);
  }

  signature.parameters = signature.parameters
    ?.filter(parameter => !isServiceParameter(parameter))
    .map(parameter => {
      project.removeTypeReflections(parameter.type);
      if (devDefinedTypeDeclaration.arguments[parameter.name]) {
        parameter.type = new td.UnknownType(devDefinedTypeDeclaration.arguments[parameter.name]);
      } else if (parameter.type) {
        parameter.type = normalizeConductorType(parameter.type, project);
      }
      return parameter;
    });

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

type DevDefinedTypeDeclaration = {
  arguments: {
    [name: string]: string;
  };
  return: string | undefined;
};

/**
 * Applies signature/type normalization to a declaration and its accessors.
 */
function normalizeDeclaration(declaration: td.DeclarationReflection, project: td.ProjectReflection) {
  if (declaration.type) {
    const publicData = declaration.comment?.getTag('@publicType')?.content?.[0]?.text;
    if (declaration.comment) {
      declaration.comment.blockTags = declaration.comment.blockTags.filter(tag => tag.tag !== '@publicType' && tag.tag !== '@publicReturnType');
    }
    project.removeTypeReflections(declaration.type);
    if (publicData) {
      declaration.type = td.ReferenceType.createBrokenReference(publicData, project, undefined);
    } else {
      declaration.type = normalizeConductorType(declaration.type, project);
    }
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

/**
 * Normalizes every type argument in a reference or tuple-like TypeDoc type.
 */
function normalizeTypeList(types: td.SomeType[] | undefined, project: td.ProjectReflection) {
  return types?.map(type => normalizeConductorType(type, project));
}
