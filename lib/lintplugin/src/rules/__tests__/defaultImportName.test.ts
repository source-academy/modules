import { RuleTester } from 'eslint';
import defaultImportName from '../defaultImportName';

describe('Test defaultImportName', () => {
  const tester = new RuleTester();
  tester.run(
    'default-import-name',
    defaultImportName,
    {
      valid: [
        {
          code: 'import pathlib from \'path\';',
          options: [{ path: 'pathlib' }]
        },
        {
          code: 'import fs from \'fs\';',
          options: [{ path: 'pathlib' }]
        },
        {
          code: 'import path from \'notPath\';',
          options: [{ path: 'pathlib' }]
        },
        {
          code: `
            import pathlib from 'path';
            import fs from 'fs/promises';
          `,
          options: [{ path: 'pathlib' }]
        },
        {
          code: 'import * as pathlib from \'path\';',
          options: [{ path: 'pathlib' }]
        },
        {
          code: 'import pathlib2 from \'path\';',
          options: [{ path: 'pathlib2' }]
        },
        {
          code: `
            import pathlib from 'path';
            import pathlib2 from 'path';
          `,
          options: [{ path: ['pathlib', 'pathlib2'] }]
        },
        {
          code: `
            import pathlib from 'path';
            import fslib from 'fs/promises';
          `,
          options: [{
            path: 'pathlib',
            'fs/promises': 'fslib'
          }]
        }
      ],
      invalid: [
        // #region 1
        // Invalid TestCases for when there is only one alternative
        {
          code: 'import path from \'path\';',
          options: [{ path: 'pathlib' }],
          errors: [{
            messageId: 'singleInvalid',
            suggestions: [{
              messageId: 'replaceName',
              output: 'import pathlib from \'path\';',
            }]
          }]
        },
        {
          code: 'import * as path from \'path\';',
          options: [{ path: 'pathlib' }],
          errors: [{
            messageId: 'singleInvalid',
            suggestions: [{
              messageId: 'replaceName',
              output: 'import * as pathlib from \'path\';',
            }]
          }]
        },
        {
          code: 'import path from \'path\';\nimport fs from \'fs/promises\';',
          options: [{ path: 'pathlib' }],
          errors: [{
            messageId: 'singleInvalid',
            suggestions: [{
              messageId: 'replaceName',
              output: 'import pathlib from \'path\';\nimport fs from \'fs/promises\';',
            }]
          }]
        },
        // #endregion 1
        // #region 2
        // Test cases for when there are multiple alternatives
        {
          code: 'import path from \'path\';',
          options: [{ path: ['pathlib', 'pathlib2'] } ],
          errors: [{
            messageId: 'multiInvalid',
            suggestions: [{
              messageId: 'replaceName',
              output: 'import pathlib from \'path\';'
            }, {
              messageId: 'replaceName',
              output: 'import pathlib2 from \'path\';'
            }]
          }]
        },
        {
          code: 'import path from \'path\';\nimport fs from \'fs/promises\';',
          options: [{
            path: ['pathlib', 'pathlib2'],
            'fs/promises': 'fslib'
          }],
          errors: [{
            messageId: 'multiInvalid',
            suggestions: [{
              messageId: 'replaceName',
              output: 'import pathlib from \'path\';\nimport fs from \'fs/promises\';'
            }, {
              messageId: 'replaceName',
              output: 'import pathlib2 from \'path\';\nimport fs from \'fs/promises\';'
            }]
          }, {
            messageId: 'singleInvalid',
            suggestions: [{
              messageId: 'replaceName',
              output: 'import path from \'path\';\nimport fslib from \'fs/promises\';'
            }]
          }]
        }
        // #endregion 2
      ]
    }
  );
});
