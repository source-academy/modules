import { ESLintUtils } from '@typescript-eslint/utils';

const ruleCreator = ESLintUtils.RuleCreator.withoutDocs;

export default ruleCreator({
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Enforce the usage of individual imports instead of from barrel files'
    },
    schema: [{
      type: 'array',
      items: { type: 'string' }
    }],
    messages: {
      main: 'Use individual default imports instead of the barrel import'
    }
  },
  defaultOptions: [[] as string[]],
  create: context => ({
    ImportDeclaration(node) {
      const sources = context.options[0] as string[];
      const importSource = node.source.value;
      if (
        typeof importSource !== 'string' ||
        node.importKind === 'type' ||
        !sources?.includes(importSource)
      ) return;

      const specifiers = node.specifiers.filter(each => each.type === 'ImportSpecifier');
      if (specifiers.length === 0) return;

      context.report({
        messageId: 'main',
        node,
        fix: fixer => {
          const specText = specifiers.map(spec => {
            const importedName = spec.imported.type === 'Identifier' ? spec.imported.name : spec.imported.value;
            if (spec.importKind === 'type') {
              return `import type ${spec.local.name} from '${importSource}/${importedName}'`;
            }

            return `import ${spec.local.name} from '${importSource}/${importedName}'`;
          }).join('\n');

          if (specifiers.length === node.specifiers.length) {
            return [fixer.replaceText(node, specText)];
          }

          // This situation is only possible with a combination of default and regular specifiers
          // so there should always only be 1 default specifier here
          const defaultSpec = node.specifiers.find(each => each.type === 'ImportDefaultSpecifier')!;

          // We won't need to check for the default import because the spec forbids that a default
          // type-only import be combined with both default and regular import specifiers
          return [
            fixer.replaceText(node, `import ${defaultSpec.local.name} from '${importSource}'\n`),
            fixer.insertTextAfter(node, specText)
          ];
        }
      });
    }
  })
});
