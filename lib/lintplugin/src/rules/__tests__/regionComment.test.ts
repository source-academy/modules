import { RuleTester } from '@typescript-eslint/rule-tester';
import regionComment from '../regionComment';

describe('Test regionComment', () => {
  const tester = new RuleTester();
  tester.run(
    'region-comment',
    regionComment,
    {
      valid: [
        `
          // #region hi
          // #endregion hi
        `,
        `
          // #region 1
          // #region 2
          // #endregion 2
          // #endregion 1
        `,
        '// Some other comment',
        '// #regionnot',
        '/* #region block comment ignored */'
      ],
      invalid: [{
        code: `
          // #region
          // #endregion
        `,
        errors: [
          { messageId: 'missingStartName' },
          { messageId: 'missingEndName' }
        ]
      }, {
        code: '// #region 1',
        errors: [{ messageId: 'missingEnd' }]
      }, {
        code: '// #endregion 1',
        errors: [{ messageId: 'missingStart' }]
      }, {
        code: `
          // #endregion 1
          // #region 1
        `,
        errors: [
          { messageId: 'missingStart' },
          { messageId: 'missingEnd' }
        ]
      }, {
        code: `
          // #region 1
          // #region 2
          // #endregion 1
        `,
        errors: [{ messageId: 'missingEnd' }]
      }]
    }
  );
});
