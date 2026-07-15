import * as td from 'typedoc';

/**
 * If the given declaration has call signatures, but no visible
 * properties (that weren't inherited), we can treat it as if
 * it were a function.
 */
export function fixDeclaration(decl: td.DeclarationReflection) {
  if (
    (
      // Only modify classes and interfaces
      decl.kind !== td.ReflectionKind.Class &&
      decl.kind !== td.ReflectionKind.Interface
      // And those with call signatures
    ) || !decl.signatures?.length
  ) {
    return;
  }

  if (decl.children?.length) {
    // Find a non inherited, non private child
    const nonInherited = decl.children.some(child => !child.flags.isPrivate && !child.flags.isInherited);
    if (nonInherited) return;
  }

  // Convert to TypeAlias
  const typeDecl = new td.DeclarationReflection(decl.name, td.ReflectionKind.CallSignature, decl);
  typeDecl.signatures = decl.signatures;
  decl.kind = td.ReflectionKind.TypeAlias;
  decl.type = new td.ReflectionType(typeDecl);

  decl.extendedTypes = undefined;
  decl.implementedTypes = undefined;
}

/**
 * Collects a map of types that also need to be included in the final d.ts file
 */
export async function collectTypes(project: td.ProjectReflection, tsconfig: string) {
  const output = new Map<string, td.SomeType>();

  const referencesToVisit: Map<string, Set<string>> = new Map();

  function visitTypeParameter(decl: td.TypeParameterReflection) {
    // Visit the default value
    if (decl.default) visitType(decl.default);

    // Visit the extends
    if (decl.type) visitType(decl.type);
  }

  function visitSignature(decl: td.SignatureReflection) {
    if (decl.flags.isPrivate) return;

    // Visit parameters
    decl.parameters?.forEach(param => {
      if (param.type) visitType(param.type);
    });

    // Visit each type parameter
    decl.typeParameters?.forEach(visitTypeParameter);

    // Visit the return type
    if (decl.type) visitType(decl.type);
  }

  function visitDeclaration(decl: td.DeclarationReflection) {
    if (decl.flags.isPrivate || decl.flags.isInherited || decl.flags.isExternal) return;
    if (decl.type) visitType(decl.type);

    decl.signatures?.forEach(visitSignature);
    decl.typeParameters?.forEach(visitTypeParameter);

    if (decl.getSignature) visitSignature(decl.getSignature);
    if (decl.setSignature) visitSignature(decl.setSignature);

    decl.extendedTypes?.forEach(visitType);
    decl.implementedTypes?.forEach(visitType);
    decl.indexSignatures?.forEach(visitSignature);

    decl.children?.forEach(visitDeclaration);
  }

  function visitType(someType: td.SomeType) {
    switch (someType.type) {
      case 'conditional': {
        // T extends extendsType ? trueType : falseType
        visitType(someType.trueType);
        visitType(someType.falseType);
        visitType(someType.extendsType);
        break;
      }
      case 'indexedAccess': {
        // ObjectType[IndexType]
        visitType(someType.indexType);
        visitType(someType.objectType);
        break;
      }
      case 'intersection':
      case 'union': {
        someType.types.forEach(visitType);
        break;
      }
      case 'array':
      case 'rest':
      case 'optional': {
        visitType(someType.elementType);
        break;
      }
      case 'mapped': {
        // { [K in Parameter as Name]?: Template }
        visitType(someType.parameterType);
        visitType(someType.templateType);
        if (someType.nameType) visitType(someType.nameType);
        break;
      }
      case 'namedTupleMember': {
        visitType(someType.element);
        break;
      }
      case 'predicate': {
        // x is TargetType or asserts x is TargetType
        if (someType.targetType) visitType(someType.targetType);
        break;
      }
      case 'query': {
        // typeof QueryType
        visitType(someType.queryType);
        break;
      }
      case 'reflection': {
        visitDeclaration(someType.declaration);
        break;
      }
      case 'reference': {
        if (output.has(someType.name)) break;

        if (someType.reflection) {
          output.set(someType.name, someType);

          const { reflection } = someType;
          visitDeclaration(reflection as td.DeclarationReflection);
          break;
        }

        if (someType.symbolId) {
          const { fileName, packageName, packagePath } = someType.symbolId;

          if (packageName === 'typescript') {
            // Type definitions provided by Typescript
            if (packagePath.startsWith('lib')) break;
          }

          if (project.packageName !== packageName) {
            // From a different package, need to import
            // So we leave as is
            output.set(someType.name, someType);
          } else if (fileName) {
            if (!referencesToVisit.has(fileName)) {
              referencesToVisit.set(fileName, new Set());
            }

            referencesToVisit.get(fileName)!.add(someType.name);
          }
        }
        break;
      }
      case 'templateLiteral': {
        someType.tail.forEach(([t]) => visitType(t));
        break;
      }
      case 'tuple': {
        someType.elements.forEach(visitType);
        break;
      }
      case 'typeOperator': {
        // keyof target
        visitType(someType.target);
        break;
      }
    }
  }

  project.children!.forEach(visitDeclaration);

  let prevFileNames = [...referencesToVisit.keys()];
  let app = await td.Application.bootstrap({
    alwaysCreateEntryPointModule: true,
    entryPoints: prevFileNames,
    tsconfig
  });
  let childProject = await app.convert();

  // We should only ever visit references from within the same
  // package using Typedoc
  while (referencesToVisit.size > 0) {
    const fileNames = [...referencesToVisit.keys()];
    const names = [...referencesToVisit.values().flatMap(each => [...each])];

    referencesToVisit.clear();

    if (fileNames !== prevFileNames) {
      // No need to reinitialize project unless filenames
      // have changed
      app = await td.Application.bootstrap({
        alwaysCreateEntryPointModule: true,
        entryPoints: fileNames,
        tsconfig
      });
      prevFileNames = fileNames;
      childProject = await app.convert();
    }

    names.forEach(name => {
      for (const child of childProject!.children!) {
        const decl = child.getChildByName(name);

        if (decl) {
          fixDeclaration(decl as td.DeclarationReflection);

          const type = new td.ReflectionType(decl as td.DeclarationReflection);
          output.set(name, type);
          visitDeclaration(decl as td.DeclarationReflection);
          break;
        }
      }
    });
  }

  return output;
}
