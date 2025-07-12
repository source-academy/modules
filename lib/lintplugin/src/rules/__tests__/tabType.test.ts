import { RuleTester } from 'eslint';
import tabType from '../tabType';

describe('Test collateTypeImports', () => {
  const tester = new RuleTester();
  tester.run(
    'tab-type',
    tabType,
    {
      valid: [{
        code: `
          import { defineTab } from '@sourceacademy/modules-lib/tabs';
          export default defineTab({})
        `
      }, {
        code: `
          import { defineTab as definer } from '@sourceacademy/modules-lib/tabs';
          export default definer({})
        `
      }, {
        code: `
          import { stuff } from 'somewhere';
          import { defineTab as definer } from '@sourceacademy/modules-lib/tabs';
          export default definer({ stuff })
        `
      }],
      invalid: [{
        code: '',
        errors: 1
      }, {
        code: `
          import { stuff } from 'somwhere';
          export default 0;
        `,
        errors: 1
      }, {
        code: `
          import { defineTab } from '@sourceacademy/modules-lib/tabs';
          export default 0;
        `,
        errors: 1
      }]
    }
  );
});
