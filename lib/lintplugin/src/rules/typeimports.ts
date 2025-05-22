import { ESLintUtils, type TSESTree as es } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator.withoutDocs;

function isImportSpecifier(spec: es.ImportDeclaration['specifiers'][number]): spec is es.ImportSpecifier {
  return spec.type === 'ImportSpecifier';
}

function specToString(spec: es.ImportSpecifier) {
  if (spec.imported.type === 'Identifier') {
    if (spec.imported.name === spec.local.name) {
      return spec.imported.name;
    }
    return `${spec.imported.name} as ${spec.local.name}`;
  }
  return '';
}

const collateTypeImports = createRule({
  meta: {
    type: 'suggestion',
    messages: {
      msg: 'Use a single type specifier',
    },
    schema: [],
    hasSuggestions: true,
    fixable: 'code'
  },
  defaultOptions: [],
  create: context => ({
    ImportDeclaration(node) {
      if (node.importKind === 'type' || node.specifiers.length === 0) return;

      if (node.specifiers.some(spec => !isImportSpecifier(spec) || spec.importKind !== 'type')) return;

      context.report({
        node,
        messageId: 'msg',
        fix(fixer) {
          const regularSpecs = (node.specifiers as es.ImportSpecifier[]).map(specToString);

          return [
            fixer.remove(node),
            fixer.insertTextAfter(
              node,
              `import type { ${regularSpecs.join(', ')} } from '${node.source.value}'`
            )
          ];
        }
      });
    }
  })
});

export default collateTypeImports;
