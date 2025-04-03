import type { ESLint } from 'eslint';
import type es from 'estree';

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

const typeImportsPlugin = {
  meta: {
    name: 'Type Imports Plugin',
    version: '1.0.0'
  },
  rules: {
    'collate-type-imports': {
      meta: {
        type: 'suggestion',
        fixable: 'code'
      },
      create: context => ({
        ImportDeclaration(node) {
          if (node.importKind === 'type' || node.specifiers.length === 0) return;

          // @ts-expect-error import kind is unknown property
          if (node.specifiers.some(spec => !isImportSpecifier(spec) || spec.importKind !== 'type')) return;

          context.report({
            node,
            message: 'Use a single type specifier',
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
    }
  }
} satisfies ESLint.Plugin;

export default typeImportsPlugin;
