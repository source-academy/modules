import { RuleTester } from 'eslint';
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
        errors: 2
      }, {
        code: '// #region 1',
        errors: 1
      }, {
        code: '// #endregion 1',
        errors: 1
      }, {
        code: `
          // #endregion 1
          // #region 1
        `,
        errors: 2
      }, {
        code: `
          // #region 1
          // #region 2
          // #endregion 1
        `,
        errors: 1
      }]
    }
  );
});
