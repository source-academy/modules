import { isBuiltinSymbolLikeRecurser } from '@typescript-eslint/type-utils';
import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';
import { findVariable } from '@typescript-eslint/utils/ast-utils';
import { getParserServices, nullThrows } from '@typescript-eslint/utils/eslint-utils';

const ruleCreator = ESLintUtils.RuleCreator.withoutDocs;

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
    schema: [{
      type: 'object',
      properties: {
        ignoredNames: {
          type: 'array',
          items: { type: 'string' }
        },
        allowRethrow: {
          type: 'boolean'
        }
      }
    }],
    defaultOptions: [{
      ignoredNames: [] as string[],
      allowRethrow: true
    }]
  },
  create: (context, [{ ignoredNames, allowRethrow }]) => {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    function isRethrownError(node: TSESTree.Node): boolean {
      if (node.type !== 'Identifier') return false;

      const scope = context.sourceCode.getScope(node);

      const smVariable = nullThrows(
        findVariable(scope, node),
        `Variable ${node.name} should exist in scope manager`,
      );

      const variableDefinitions = smVariable.defs.filter(
        def => def.isVariableDefinition,
      );
      if (variableDefinitions.length !== 1) {
        return false;
      }
      const def = smVariable.defs[0];

      // try { /* ... */ } catch (x) { throw x; }
      if (def.node.type === 'CatchClause') {
        return true;
      }

      return false;
    }

    function isIgnored(expr: TSESTree.Expression): boolean {
      switch (expr.type) {
        case 'Identifier':
          return ignoredNames.includes(expr.name);
        case 'MemberExpression': {
          if (expr.object.type === 'Identifier') {
            if (expr.property.type === 'Identifier') return isIgnored(expr.property);
          }
          return false;
        }
        case 'NewExpression':
          return isIgnored(expr.callee);
        default:
          return false;
      }
    }

    return {
      ThrowStatement(node) {
        if (isIgnored(node.argument)) return;

        if (allowRethrow && isRethrownError(node.argument)) return;

        const tsNode =
          services.esTreeNodeToTSNodeMap.get(node.argument);
        const thrownType = checker.getTypeAtLocation(tsNode);

        const found = isBuiltinSymbolLikeRecurser(services.program, thrownType, subType => {
          const typeString = checker.typeToString(subType);
          if (!typeString.includes('RuntimeSourceError')) return null;

          const symbol = subType.getSymbol();
          if (!symbol) return null;

          const decls = symbol.getDeclarations();
          if (!decls) return null;

          const foundDecl = decls.some(decl => {
            const sourceFile = decl.getSourceFile();
            return sourceFile.fileName.includes('js-slang/dist/errors/base');
          });

          return foundDecl ? true : null;
        });

        if (found) return;

        if (node.argument.type === 'NewExpression') {
          const newExpr = node.argument;

          if (newExpr.callee.type === 'Identifier') {
            // if (newExpr.callee.name === 'GeneralRuntimeError') {
            //   context.sourceCode.

            //   context.report({
            //     node,
            //     messageId: 'invalidThrow',
            //     suggest: [{
            //       messageId: 'throwGeneral',
            //       fix: fixer => fixer.insertTextBefore()
            //     }]
            //   })
            // }

            context.report({
              node,
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
            return;
          }
        }

        context.report({
          node,
          messageId: 'invalidThrow',
        });
      }
    };
  }
});
