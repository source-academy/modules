import fs from 'fs';
import * as td from 'typedoc';
import ts from 'typescript';

export interface FunctionDeclarationParameter {
  name: string;
  type: string;
}

export interface FunctionDeclarationMetadata {
  parameters: FunctionDeclarationParameter[];
  returnType: string;
}

interface SourceDeclarationMetadata {
  classDeclaration?: string;
  functionDeclaration?: FunctionDeclarationMetadata;
  line: number;
  name: string;
  variableDeclaration?: string;
}

const sourceMetadataCache = new Map<string, SourceDeclarationMetadata[]>();

/**
 * Finds a `@functionDeclaration(...)` decorator attached to a TypeDoc reflection.
 */
export function getFunctionDeclarationMetadata(reflection: td.DeclarationReflection) {
  return findSourceDeclaration(reflection)?.functionDeclaration;
}

/**
 * Finds a `@classDeclaration(...)` decorator attached to a TypeDoc reflection.
 */
export function getClassDeclarationMetadata(reflection: td.DeclarationReflection) {
  return findSourceDeclaration(reflection)?.classDeclaration;
}

/**
 * Finds a `@variableDeclaration(...)` decorator attached to a TypeDoc reflection.
 */
export function getVariableDeclarationMetadata(reflection: td.DeclarationReflection) {
  return findSourceDeclaration(reflection)?.variableDeclaration;
}

function findSourceDeclaration(reflection: td.DeclarationReflection) {
  const source = reflection.sources?.[0];
  if (!source) return undefined;

  const sourcePath = source.fullFileName ?? source.fileName;
  const declarations = readSourceMetadata(sourcePath);
  return declarations
    .filter(declaration => declaration.name === reflection.name)
    .sort((a, b) => Math.abs(a.line - source.line) - Math.abs(b.line - source.line))[0];
}

function readSourceMetadata(sourcePath: string) {
  let cached = sourceMetadataCache.get(sourcePath);
  if (cached) return cached;

  try {
    const sourceText = fs.readFileSync(sourcePath, 'utf8');
    cached = parseSourceMetadata(sourcePath, sourceText);
  } catch {
    cached = [];
  }

  sourceMetadataCache.set(sourcePath, cached);
  return cached;
}

function parseSourceMetadata(sourcePath: string, sourceText: string) {
  const sourceFile = ts.createSourceFile(sourcePath, sourceText, ts.ScriptTarget.Latest, true);
  const declarations: SourceDeclarationMetadata[] = [];

  function visit(node: ts.Node) {
    const name = getNodeName(node);
    const decorators = getDecorators(node);

    if (name && decorators.length > 0) {
      const metadata = getDecoratorMetadata(decorators, sourceFile);
      if (metadata.classDeclaration || metadata.functionDeclaration || metadata.variableDeclaration) {
        declarations.push({
          ...metadata,
          line: getNodeLine(node, sourceFile),
          name
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return declarations;
}

function getDecorators(node: ts.Node) {
  return ts.canHaveDecorators(node) ? ts.getDecorators(node) ?? [] : [];
}

function getDecoratorMetadata(decorators: readonly ts.Decorator[], sourceFile: ts.SourceFile) {
  const metadata: Pick<SourceDeclarationMetadata, 'classDeclaration' | 'functionDeclaration' | 'variableDeclaration'> = {};

  decorators.forEach(decorator => {
    const call = ts.isCallExpression(decorator.expression) ? decorator.expression : undefined;
    if (!call) return;

    const decoratorName = getExpressionName(call.expression);
    if (decoratorName === 'classDeclaration') {
      metadata.classDeclaration = getStringArgument(call, 0);
    }

    if (decoratorName === 'functionDeclaration') {
      const paramTypes = getStringArgument(call, 0);
      const returnType = getStringArgument(call, 1);
      if (paramTypes !== undefined && returnType !== undefined) {
        metadata.functionDeclaration = parseFunctionDeclaration(paramTypes, returnType, sourceFile.fileName);
      }
    }

    if (decoratorName === 'variableDeclaration') {
      metadata.variableDeclaration = getStringArgument(call, 0);
    }
  });

  return metadata;
}

function parseFunctionDeclaration(paramTypes: string, returnType: string, sourceName: string): FunctionDeclarationMetadata {
  const declarationSource = `function __sourceAcademyDocs__(${paramTypes}): ${returnType} {}`;
  const sourceFile = ts.createSourceFile(`${sourceName}.functionDeclaration.ts`, declarationSource, ts.ScriptTarget.Latest, true);
  const declaration = sourceFile.statements.find(ts.isFunctionDeclaration);

  return {
    parameters: declaration?.parameters.map(parameter => ({
      name: parameter.name.getText(sourceFile),
      type: parameter.type?.getText(sourceFile) ?? 'unknown'
    })) ?? [],
    returnType: declaration?.type?.getText(sourceFile) ?? returnType
  };
}

function getNodeName(node: ts.Node) {
  if (ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node)) {
    return node.name?.text;
  }

  if (
    ts.isMethodDeclaration(node)
    || ts.isPropertyDeclaration(node)
    || ts.isGetAccessorDeclaration(node)
    || ts.isSetAccessorDeclaration(node)
  ) {
    return getPropertyName(node.name);
  }

  return undefined;
}

function getPropertyName(name: ts.PropertyName) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return undefined;
}

function getNodeLine(node: ts.Node, sourceFile: ts.SourceFile) {
  const namedNode = getNamedNode(node);
  const position = namedNode?.getStart(sourceFile) ?? node.getStart(sourceFile);
  return sourceFile.getLineAndCharacterOfPosition(position).line + 1;
}

function getNamedNode(node: ts.Node): ts.Node | undefined {
  if (ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node)) {
    return node.name;
  }

  if (
    ts.isMethodDeclaration(node)
    || ts.isPropertyDeclaration(node)
    || ts.isGetAccessorDeclaration(node)
    || ts.isSetAccessorDeclaration(node)
  ) {
    return node.name;
  }

  return undefined;
}

function getExpressionName(expression: ts.Expression): string | undefined {
  if (ts.isIdentifier(expression)) {
    return expression.text;
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return expression.name.text;
  }

  return undefined;
}

function getStringArgument(call: ts.CallExpression, index: number) {
  const argument = call.arguments[index];
  return argument !== undefined && ts.isStringLiteralLike(argument)
    ? argument.text
    : undefined;
}
