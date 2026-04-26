import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';
import { getParserServices } from '@typescript-eslint/utils/eslint-utils';
import ts from 'typescript';
import { getRhsIdentifier, resolveAliasedSymbol } from './utils';

const ruleCreator = ESLintUtils.RuleCreator.withoutDocs;

function getRuntimeSourceErrorSymbol(
  program: ts.Program,
  checker: ts.TypeChecker
): ts.Symbol | null {
  for (const sf of program.getSourceFiles()) {
    if (!sf.isDeclarationFile) continue;
    console.log(sf.fileName);
    if (!sf.fileName.includes('js-slang/dist/errors/base')) continue;

    const moduleSymbol = checker.getSymbolAtLocation(sf);
    if (!moduleSymbol) continue;

    const exports = checker.getExportsOfModule(moduleSymbol);
    const match = exports.find(s => s.getName() === 'RuntimeSourceError');

    if (match) return resolveAliasedSymbol(checker, match);
  }

  return null;
}

function typeIncludesRuntimeError(
  checker: ts.TypeChecker,
  type: ts.Type,
  target: ts.Symbol
): boolean {
  // unwrap unions
  if (type.isUnion()) {
    return type.types.some(t => typeIncludesRuntimeError(checker, t, target));
  }

  // unwrap intersections
  if (type.isIntersection()) {
    return type.types.some(t => typeIncludesRuntimeError(checker, t, target));
  }

  const symbol = type.getSymbol();
  if (!symbol) return false;

  const resolved = resolveAliasedSymbol(checker, symbol);

  if (resolved === target) {
    return true;
  }

  // check inheritance chain
  const bases = type.getBaseTypes?.() ?? [];
  return bases.some(base => typeIncludesRuntimeError(checker, base, target));
}

export default ruleCreator({
  meta: {
    type: 'problem',
    fixable: 'code',
    hasSuggestions: true,
    docs: {
      description: 'Enforces that errors be assignable to RuntimeSourceError'
    },
    messages: {
      invalidThrow: 'Expected an error assignable to RuntimeSourceError',
      throwGeneral: 'Throw GeneralRuntimeError',
      throwInternal: 'Throw InternalRuntimeError'
    },
    schema: []
  },
  create: context => {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();
    const runtimeErrorSymbol = getRuntimeSourceErrorSymbol(
      services.program,
      checker
    );

    function handleThrowStatement(node: TSESTree.ThrowStatement) {
      const id = getRhsIdentifier(node.argument);
      if (!id) return;

      const tsNode =
        services.esTreeNodeToTSNodeMap.get(id);
      const thrownType = checker.getTypeAtLocation(tsNode);

      if (!runtimeErrorSymbol || !typeIncludesRuntimeError(
        checker,
        thrownType,
        runtimeErrorSymbol
      )) {
        if (node.argument.type === 'NewExpression') {
          const newExpr = node.argument;

          if (newExpr.callee.type === 'Identifier') {
            // replace throw new Error('msg') with
            // throw new GeneralRuntimeError('msg')
            context.report({
              node: node.argument,
              messageId: 'invalidThrow',
              suggest: [
                {
                  messageId: 'throwGeneral',
                  fix: fixer => fixer.replaceText(newExpr.callee, 'GeneralRuntimeError')
                },
                {
                  messageId: 'throwInternal',
                  fix: fixer => fixer.replaceText(newExpr.callee, 'InternalRuntimeError')
                }
              ]
            });
          }
          return;
        }

        context.report({
          node: node.argument,
          messageId: 'invalidThrow',
        });
      }
    }

    return {
      // 'IfStatement[alternate=null]:has(ThrowStatement.consequent)'(node: TSESTree.IfStatement) {
      //   const condType = services.getTypeAtLocation(node.test);
      //   if (!condType.isLiteral()) return;

      //   const throwStmt = node.consequent as TSESTree.ThrowStatement;

      //   context.report({
      //     node,
      //     messageId: 'invalidThrow',
      //     fix: fixer => fixer.replace
      //   })
      // },
      // 'IfStatement:has(BlockStatement[body.length=1]:has(ThrowStatement))'(node: TSESTree.IfStatement) {
      //   const condType = services.getTypeAtLocation(node.test);
      //   if (!condType.isLiteral()) return;
      // },
      ThrowStatement: handleThrowStatement
    };
  }
});
