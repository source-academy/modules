import type { Rule } from 'eslint';

type RuleOptions = Record<string, string | string[]>;

const defaultImportName = {
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    fixable: 'code',
    docs: {
      description: 'Ensures that the given default/namespace imports are always named consistently'
    },
    messages: {
      singleInvalid: '{{ type }} import from {{ source }} should be named {{ value }}',
      multiInvalid: '{{ type }} import from {{ source }} should be one of {{ value }}',
      replaceName: 'Replace {{ oldId }} with {{ newId }}'
    },
    schema: [{
      type: 'object',
      additionalProperties: {
        oneOf: [
          { type: 'string' },
          {
            type: 'array',
            items: { type: 'string' }
          }
        ]
      }
    }],
  },
  create: context => ({
    ImportDeclaration(node) {
      const importSpecifiers = node.specifiers.filter(each => each.type !== 'ImportSpecifier');
      const importSource = node.source.value;
      if (importSpecifiers.length === 0 || typeof importSource !== 'string') return;

      const options = context.options[0] as RuleOptions;

      const found = Object.entries(options).find(([source]) => source === importSource);
      if (!found) return;

      for (const spec of importSpecifiers) {
        let typeStr: string;
        if (spec.type === 'ImportDefaultSpecifier') {
          typeStr = 'Default';
        } else {
          typeStr = 'Namespace';
        }

        const [, validNames] = found;

        if (typeof validNames === 'string') {
          if (spec.local.name !== validNames) {
            context.report({
              messageId: 'singleInvalid',
              data: {
                type: typeStr,
                source: importSource,
                value: validNames
              },
              node: spec,
              suggest: [{
                messageId: 'replaceName',
                data: {
                  oldId: spec.local.name,
                  newId: validNames,
                },
                fix: fixer => fixer.replaceText(spec.local, validNames)
              }]
            });
          }
        } else {
          if (!validNames.includes(spec.local.name)) {
            context.report({
              messageId: 'multiInvalid',
              data: {
                type: typeStr,
                source: importSource,
                value: validNames.join(', ')
              },
              suggest: validNames.map(validName => ({
                messageId: 'replaceName',
                data: {
                  oldId: spec.local.name,
                  newId: validName
                },
                fix: fixer => fixer.replaceText(spec.local, validName)
              })),
              node: spec,
            });
          }
        }
      }
    }
  })
} satisfies Rule.RuleModule;

export default defaultImportName;
