import { parseComment, getJSDocComment } from '@es-joy/jsdoccomment'
import type { Rule } from "eslint";

const moduleTagPresent = {
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    fixable: 'code'
  },
  create: ({ sourceCode, report }) => ({
    Program(node) {
      let maxLines: number

      if (node.body.length === 0) {
        maxLines = 1
      } else {
        const firstNode = node.body[0]
        maxLines = firstNode.loc.start.line
      }

      const comment = getJSDocComment(sourceCode, node as any, {
        maxLines,
        minLines: 1
      })

      if (comment === null) {
        report({
          node,
          message: 'Bundle requires a JSDOC comment at its top with a @module tag specified',
          fix: fixer => [
            fixer.insertTextBeforeRange([0, 0], '/**\n * @module module_name\n */\n')
          ]
        })
        return;
      }

      const parsed = parseComment(comment)
      const tag = parsed.tags.find(tag => tag.tag === 'module')

      if (!tag) {
        console.log(comment.loc.end)
        const commentEndLine = (comment as any).loc.end.line
        report({
          node,
          message: 'Bundle requires a JSDOC comment at its top with a @module tag specified',
          fix: fixer => [
            fixer.insertTextAfterRange([commentEndLine, commentEndLine], '\n * @module module_name\n')
          ]
        })
        return
      }
    }
  })
} satisfies Rule.RuleModule

export default moduleTagPresent