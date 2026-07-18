import { RuleTester } from '@typescript-eslint/rule-tester';
import tabType from '../tabType';

describe('Test collateTypeImports', () => {
  const tester = new RuleTester();
  tester.run(
    'tab-type',
    tabType,
    {
      valid: [{
        code: `
          import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
          export default defineTab({})
        `
      }, {
        code: `
          import { defineTab as definer } from '@sourceacademy/modules-lib/tabs/utils';
          export default definer({})
        `
      }, {
        code: `
          import { stuff } from 'somewhere';
          import { defineTab as definer } from '@sourceacademy/modules-lib/tabs/utils';
          export default definer({ stuff })
        `
      }],
      invalid: [{
        code: '',
        errors: [{ messageId: 'noExport' }]
      }, {
        code: `
          import { stuff } from 'somwhere';
          export default 0;
        `,
        errors: [{
          messageId: 'useHelper',
          data: {
            source: '@sourceacademy/modules-lib/tabs/utils'
          }
        }]
      }, {
        code: `
          import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
          export default 0;
        `,
        errors: [{
          messageId: 'useHelper',
          data: {
            source: '@sourceacademy/modules-lib/tabs/utils'
          }
        }]
      }]
    }
  );
});
