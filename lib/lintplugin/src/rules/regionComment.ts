import type { Rule } from 'eslint';
import type { SourceLocation } from 'estree';

const RE = /^\s*#(region|endregion)(?:$|\s+(.*)$)/;

interface CommentInfo {
  type: 'start' | 'end';
  regionName?: string;
  loc: SourceLocation;
}

const regionComment = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures that every region comment has a corresponding endregion comment'
    }
  },
  create: context => ({
    Program() {
      const lineComments = context.sourceCode
        .getAllComments()
        .reduce<CommentInfo[]>((res, comment) => {
          if (comment.type !== 'Line') return res;
          const match = RE.exec(comment.value);
          if (match == null) return res;

          const [, marker, name] = match;

          return [
            ...res,
            {
              loc: comment.loc!,
              regionName: name?.trim(),
              type: marker === 'region' ? 'start' : 'end',
            }
          ];
        }, []);

      const missingRegionNames = lineComments.filter(({ regionName }) => regionName === undefined);
      if (missingRegionNames.length > 0) {
        for (const comment of missingRegionNames) {
          context.report({
            message: `Expected region name for #${comment.type === 'start' ? '' : 'end'}region comment`,
            loc: comment.loc
          });
        }
      }

      function searchForClosing(parentComment: CommentInfo): number | null {
        let level = 1;
        for (let i = 0; i < lineComments.length; i++) {
          const commentInfo = lineComments[i];
          if (
            commentInfo.regionName !== undefined &&
            commentInfo.regionName === parentComment.regionName
          ) {
            if (commentInfo.type === 'start') level++;
            else level--;
          }

          if (level === 0) return i;
        }

        return null;
      }

      while (lineComments.length > 0) {
        const comment = lineComments.shift()!;
        if (comment.regionName === undefined) {
          continue;
        }

        if (comment.type === 'end') {
          context.report({
            message: '#endregion comment missing #region',
            loc: comment.loc
          });
          continue;
        }

        const endIndex = searchForClosing(comment);
        if (endIndex === null) {
          context.report({
            message: 'Missing #endregion for #region',
            loc: comment.loc
          });
        } else {
          lineComments.splice(endIndex, 1);
        }
      }
    }
  })
} satisfies Rule.RuleModule;

export default regionComment;
