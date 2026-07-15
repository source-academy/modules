import fs from 'fs/promises';
import pathlib from 'path';
import ts from 'typescript';

const formatDiagnosticsHost: ts.FormatDiagnosticsHost = {
  getNewLine: () => '\n',
  getCurrentDirectory: () => process.cwd(),
  getCanonicalFileName: name => pathlib.basename(name)
};

async function loadTsconfig(tsconfigPath: string) {
  // Step 1: Get the raw text
  const configText = await fs.readFile(tsconfigPath, 'utf-8');

  // Step 2: Parse the raw text into a json object
  const { error: configJsonError, config: configJson } = ts.parseConfigFileTextToJson(tsconfigPath, configText);

  if (configJsonError) {
    const formatted = ts.formatDiagnosticsWithColorAndContext([configJsonError], formatDiagnosticsHost);
    console.error(formatted);
    process.exit(1);
  }

  // Step 3: Parse the json object into a config object for use by tsc
  const { errors: parseErrors, options: tsconfig, fileNames } = ts.parseJsonConfigFileContent(configJson, ts.sys, pathlib.dirname(tsconfigPath));
  if (parseErrors.length > 0) {
    const formatted = ts.formatDiagnosticsWithColorAndContext(parseErrors, formatDiagnosticsHost);
    console.error(formatted);
    process.exit(1);
  }

  return { tsconfig, fileNames };
}

async function main() {
  const dirname = pathlib.join(import.meta.dirname, '../../../src/bundles/curve');
  const entryPointPath = pathlib.join(dirname, 'src/index.ts');
  const { tsconfig, fileNames } = await loadTsconfig(pathlib.join(dirname, 'tsconfig.json'));

  const program = ts.createProgram({
    options: {
      ...tsconfig,
      removeComments: false
    }, rootNames: fileNames
  });
  const checker = program.getTypeChecker();

  const sourceFile = program.getSourceFile(entryPointPath);

  if (!sourceFile) throw new Error('Could not find entry point SourceFile!');
  const { exports: exportedSymbols } = checker.getSymbolAtLocation(sourceFile)!;
  const fullText = sourceFile.getFullText();

  if (!exportedSymbols) {
    console.log(`${sourceFile.fileName} does not export any symbols.`);
    return;
  }

  function collectTypes(type: ts.Type) {
    if (type.isUnionOrIntersection()) {
      type.types.forEach(collectTypes);
      return;
    }

    const stringIndexType = type.getStringIndexType();
    if (stringIndexType) collectTypes(stringIndexType);

    const numberIndexType = type.getStringIndexType();
    if (numberIndexType) collectTypes(numberIndexType);

    if (checker.isArrayLikeType(type)) {
      collectTypes((type as ts.EvolvingArrayType).elementType);
    }

    if (type.flags & ts.TypeFlags.Conditional) {
      // checkType extends extendsType ? trueType : falseType
      const condType = type as ts.ConditionalType;
      collectTypes(condType.checkType);
      collectTypes(condType.extendsType);
      collectTypes(condType.resolvedFalseType!);
      collectTypes(condType.resolvedTrueType!);
      return;
    }

    if (type.flags & ts.TypeFlags.IndexedAccess) {
      // objectType[indexType]
      collectTypes((type as ts.IndexedAccessType).objectType);
      collectTypes((type as ts.IndexedAccessType).indexType);
    }
  }

  function getCommentNode(node: ts.Node) {
    const fullText = node.getSourceFile().getFullText();
    const ranges = ts.getLeadingCommentRanges(fullText, node.pos);
    if (ranges?.length) return ranges[ranges.length - 1];
    return undefined;
  }

  /**
   * Finds the declaration of the provided symbol
   */
  function findDeclarations(symbol: ts.Symbol): ts.Declaration[] {
    if (!symbol.declarations) {
      if (!symbol.valueDeclaration) {
        throw new Error(`No declarations found for symbol ${symbol.name}`);
      }

      return [symbol.valueDeclaration];
    }

    if (symbol.declarations.length === 1) {
      const [declaration] = symbol.declarations;

      if (ts.isExportSpecifier(declaration)) {
        // If the export was declared by an export specifier, find the
        // local symbol that the specifier refers to
        const localSymbol = checker.getExportSpecifierLocalTargetSymbol(declaration)!;
        return findDeclarations(localSymbol);
      }
    }

    return symbol.declarations;
  }

  function declarationHasHiddenOrInternalTag(decl: ts.Declaration): boolean {
    const tags = ts.getJSDocTags(decl);
    return tags.some(({ tagName: { escapedText } }) => {
      return escapedText === 'hidden' || escapedText === 'internal';
    });
  }

  /**
   * Checks if the given symbol has a hidden or internal tag
   * attached to it
   */
  function symbolHasHiddenOrInternalTag(symbol: ts.Symbol): boolean {
    if (!symbol.declarations) return false;

    return symbol.declarations.some(declarationHasHiddenOrInternalTag);
  }

  /**
   * Given an interface type, find if the interface contains any hidden or internal
   * properties
   */
  function findNonHiddenProperties(inputType: ts.InterfaceType): [string, ts.Symbol][] {
    function recurser(type: ts.Type): [string, ts.Symbol][] {
      // If this type is considered hidden or internal
      // we consider the whole type hidden
      if (symbolHasHiddenOrInternalTag(type.symbol)) return [];

      if (type.isClassOrInterface()) {
        if (!type.symbol.members) return [];

        const output: [string, ts.Symbol][] = [];

        for (const [memberName, memberSymbol] of type.symbol.members.entries()) {
          // Declaration doesn't contain the hidden or internal tag
          if (!symbolHasHiddenOrInternalTag(memberSymbol)) {
            output.push([memberName.toString(), memberSymbol]);
          }
        }

        const baseTypes = type.getBaseTypes();
        if (baseTypes) {
          // If it has base types, check the inherited properties too
          output.push(...baseTypes.flatMap(recurser));
        }
        return output;
      }
      if (type.isUnionOrIntersection()) {
        return type.types.flatMap(recurser);
      }

      return [];
    }

    return recurser(inputType);
  }

  /**
   * Convert the declaration to its exported form
   */
  function processDeclaration(decl: ts.Declaration, exportedName: string): ts.DeclarationStatement[] {
    const typeOfDecl = checker.getTypeAtLocation(decl);
    // Filter out signatures that aren't marked internal or hidden
    const callSignatures = typeOfDecl.getCallSignatures().filter(
      each => !each.declaration || !declarationHasHiddenOrInternalTag(each.declaration)
    );

    /**
     * Convert a SignatureDeclaration into a FunctionDeclaration
     */
    function processSignatureDeclaration(signature: ts.Signature): ts.DeclarationStatement {
      const declaration = signature.declaration;

      if (ts.isJSDocSignature(declaration!)) {
        throw new Error('JSDoc signature not supported!');
      }

      const returnType =
        declaration!.type ??
        checker.typeToTypeNode(
          signature.getReturnType(),
          decl,
          ts.NodeBuilderFlags.None
        )!;

      const outputNode = ts.factory.createFunctionDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        undefined,
        exportedName,
        declaration!.typeParameters,
        declaration!.parameters,
        returnType,
        undefined
      );

      return outputNode;
    }

    if (ts.isFunctionDeclaration(decl)) {
      // Should only have exactly 1 call signature
      const signature = callSignatures[0];
      const returnType =
        decl.type ??
        checker.typeToTypeNode(
          signature.getReturnType(),
          decl,
          ts.NodeBuilderFlags.None
        )!;

      const outputNode = ts.factory.updateFunctionDeclaration(
        decl,
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        decl.asteriskToken,
        ts.factory.createIdentifier(exportedName),
        decl.typeParameters,
        decl.parameters,
        returnType,
        undefined
      );

      return [outputNode];
    }

    if (ts.isVariableDeclaration(decl)) {
      if (callSignatures.length > 0) {
        const tags = ts.getJSDocTags(decl);
        if (tags.some(tag => tag.tagName.text === 'function')) {
          // Variable declaration should be treated as function
          return callSignatures.map(processSignatureDeclaration);
        }
      }

      const comment = getCommentNode(decl);

      const typeLiteral =
        decl.type ?? checker.typeToTypeNode(
          typeOfDecl,
          decl,
          ts.NodeBuilderFlags.None
        );

      // Treat as regular variable declaration, but need to
      // 1. Add declare and export keywords
      // 2. Remove initializing expression
      // 3. Add const modifier
      // 4. Add type literal
      let innerVar = ts.factory.updateVariableDeclaration(
        decl,
        ts.factory.createIdentifier(exportedName),
        decl.exclamationToken,
        typeLiteral,
        undefined
      );

      if (comment !== undefined) {
        console.log('found comment for', exportedName);
        const { pos, end, hasTrailingNewLine } = comment;
        const text = fullText.substring(pos, end);
        innerVar = ts.addSyntheticLeadingComment(innerVar, ts.SyntaxKind.MultiLineCommentTrivia, text, hasTrailingNewLine);
      }

      const output = ts.factory.createVariableStatement(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createVariableDeclarationList(
          [innerVar],
          ts.NodeFlags.Const
        )
      );

      return [output];
    }

    if (ts.isInterfaceDeclaration(decl)) {
      const nonHiddenProperties = findNonHiddenProperties(typeOfDecl as ts.InterfaceType);
      // If the interface type has no public facing properties
      // except for call signatures, convert it into a type alias?
      if (callSignatures.length > 0 && nonHiddenProperties.length === callSignatures.length) {
        function signatureToTypeNode(signature: ts.Signature): ts.TypeNode {
          const { declaration } = signature;
          if (ts.isJSDocSignature(declaration!)) {
            throw new Error('JSDOC signatures not supported');
          }

          const returnTypeNode =
            declaration!.type ??
            checker.typeToTypeNode(signature.getReturnType(), decl, ts.NodeBuilderFlags.None);

          return ts.factory.createFunctionTypeNode(
            declaration!.typeParameters,
            declaration!.parameters,
            returnTypeNode!
          );
        }

        const typeNode = callSignatures.length === 1
          ? signatureToTypeNode(callSignatures[0])
          : ts.factory.createUnionTypeNode(
            callSignatures.map(signatureToTypeNode)
          );

        const processedNode = ts.factory.createTypeAliasDeclaration(
          [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
          exportedName,
          undefined,
          typeNode
        );

        return [processedNode];
      }
      return [decl];
    }

    return [decl];
  }

  const printer = ts.createPrinter({
    removeComments: false,
  });

  const output: ts.DeclarationStatement[] = [];

  exportedSymbols.forEach(symbol => {
    const decls = findDeclarations(symbol);

    decls.forEach(decl => {
      if (declarationHasHiddenOrInternalTag(decl)) {
        // The hidden or internal tag is tagged to the specific declaration, don't emit
        return;
      }

      output.push(...processDeclaration(decl, symbol.name));
    });
  });

  const contents = printer.printNode(
    ts.EmitHint.Unspecified,
    ts.factory.createModuleDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)],
      ts.factory.createStringLiteral('curve'),
      ts.factory.createModuleBlock(output),
    ),
    sourceFile
  );

  await fs.writeFile(
    pathlib.join(import.meta.dirname, 'test.d.ts'),
    contents,
    'utf-8'
  );
}

await main();
