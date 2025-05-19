import { ESLintUtils, type TSESTree as es } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator.withoutDocs

const tabType = createRule({
  meta: {
    type: 'problem',
    schema: [{
      type: 'string',
      description: 'Import path'
    }],
    messages: {
      noExport: 'Your tab should export an object using the defineTab helper',
      useHelper: 'Use the defineTab helper from {{ source }}'
    }
  },
  defaultOptions: [
    '@sourceacademy/modules-lib/tabs/utils'
  ],
  create: (context, options) => ({
    Program(node) {
      const exportNode = node.body.find((stmt): stmt is es.ExportDefaultDeclaration => stmt.type === 'ExportDefaultDeclaration')
      if (!exportNode) {
        context.report({
          messageId: 'noExport',
          node
        })
        return
      }

      const { declaration: exportDeclaration } = exportNode
      if (exportDeclaration.type !== 'CallExpression') {
        context.report({
          messageId: 'useHelper',
          data: {
            source: options[0]
          },
          node: exportDeclaration
        })
        return
      }

      const importDeclarations = node.body.filter((stmt): stmt is es.ImportDeclaration => {
        return stmt.type === 'ImportDeclaration' && stmt.source.value === options[0]
      })

      if (importDeclarations.length === 0) {
        context.report({
          messageId: 'useHelper',
          data: {
            source: options[0]
          },
          node
        })
        return
      }

      const specifiers = importDeclarations.flatMap(({ specifiers }) => specifiers)
        .filter(spec => spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier' && spec.imported.name === 'defineTab')

      const defineNames = specifiers.map(spec => spec.local.name)

      const { callee } = exportDeclaration
      if (callee.type !== 'Identifier' || defineNames.includes(callee.name)) {
        context.report({
          messageId: 'useHelper',
          data: {
            source: options[0]
          },
          node: callee
        })
        return
      }
    }
  })
})

export default tabType