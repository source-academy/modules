import { ESLintUtils } from '@typescript-eslint/utils';
import { getParserServices } from '@typescript-eslint/utils/eslint-utils';
import { getModuleSpecifierFromDeclaration, getRhsIdentifier } from './utils';

const ruleCreator = ESLintUtils.RuleCreator.withoutDocs;

export default ruleCreator({
  meta: {
    type: 'problem',
    docs: {
      description: 'Highlights when an instanceof check against an imported type might fail.'
    },
    messages: {
      main: 'This instanceof check might fail at runtime ({{ type }} from {{ spec }})'
    },
    schema: [{
      type: 'array',
      items: {
        type: 'string'
      }
    }],
    defaultOptions: [[
      '@sourceacademy/bundle-.+',
      '@sourceacademy/modules-lib(?:/.+)?',
    ]]
  },
  create: (context, [options]) => {
    const services = getParserServices(context);
    const regexps = options.map(each => new RegExp(each));

    function matchesSpecifier(spec: string) {
      return regexps.some(each => each.test(spec));
    }

    return {
      BinaryExpression(node) {
        if (node.operator !== 'instanceof') return;

        const id = getRhsIdentifier(node.right);
        if (!id) return;

        const symbol = services.getSymbolAtLocation(id);
        if (!symbol) return;

        const decls = symbol.getDeclarations();
        if (!decls) return;

        for (const decl of decls) {
          const spec = getModuleSpecifierFromDeclaration(decl);

          if (spec === null || !matchesSpecifier(spec)) continue;

          context.report({
            node,
            messageId: 'main',
            data: {
              type: symbol.getEscapedName(),
              spec
            }
          });
          return;
        }
      }
    };
  }
});
