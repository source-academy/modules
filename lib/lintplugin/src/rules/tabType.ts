import type { Rule } from 'eslint';
import type es from 'estree';

const tabType = {
  meta: {
    type: 'problem',
    schema: [{
      type: 'string',
      description: 'Enforces typing for Source Academy tabs'
    }],
    messages: {
      noExport: 'Your tab should export an object using the defineTab helper',
      useHelper: 'Use the defineTab helper from {{ source }}'
    },
    defaultOptions: [
      '@sourceacademy/modules-lib/tabs/utils'
    ],
  },
  create: context => ({
    Program(program) {
      const exportNode = program.body.find((stmt): stmt is es.ExportDefaultDeclaration => stmt.type === 'ExportDefaultDeclaration');
      if (!exportNode) {
        context.report({
          messageId: 'noExport',
          node: program
        });
        return;
      }

      const { declaration: exportDeclaration } = exportNode;
      if (exportDeclaration.type !== 'CallExpression') {
        context.report({
          messageId: 'useHelper',
          data: {
            source: context.options[0]
          },
          node: exportDeclaration
        });
        return;
      }

      const importDeclarations = program.body.filter((stmt): stmt is es.ImportDeclaration => {
        return stmt.type === 'ImportDeclaration' && stmt.source.value === context.options[0];
      });

      if (importDeclarations.length === 0) {
        context.report({
          messageId: 'useHelper',
          data: {
            source: context.options[0]
          },
          node: exportDeclaration
        });
        return;
      }

      const specifiers = importDeclarations.flatMap(({ specifiers }) => specifiers)
        .filter(spec => spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier' && spec.imported.name === 'defineTab');

      const defineNames = specifiers.map(spec => spec.local.name);

      const { callee } = exportDeclaration;
      if (callee.type !== 'Identifier' || !defineNames.includes(callee.name)) {
        context.report({
          messageId: 'useHelper',
          data: {
            source: context.options[0]
          },
          node: callee
        });
        return;
      }
    }
  })
} satisfies Rule.RuleModule;

export default tabType;
