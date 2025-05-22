import { parseComment, getJSDocComment } from '@es-joy/jsdoccomment';
import type { Rule } from 'eslint';

const moduleTagPresent = {
  meta: {
    type: 'suggestion',
  },
  create: ({ sourceCode, report }) => ({
    Program(node) {
      console.log(sourceCode.getAllComments());
      let maxLines: number;

      if (node.body.length === 0) {
        maxLines = 1;
      } else {
        const firstNode = node.body[0];
        maxLines = firstNode.loc.start.line;
      }

      const comment = getJSDocComment(sourceCode, node as any, {
        maxLines,
        minLines: 1
      });

      if (comment === null) {
        report({
          node,
          message: 'Bundle requires a JSDOC comment at its top with a @module tag specified',
        });
        return;
      }

      const parsed = parseComment(comment);
      const tag = parsed.tags.find(tag => tag.tag === 'module');

      if (!tag) {
        report({
          node,
          message: 'Bundle requires a JSDOC comment at its top with a @module tag specified',
        });
        return;
      }
    }
  })
} satisfies Rule.RuleModule;

export default moduleTagPresent;
