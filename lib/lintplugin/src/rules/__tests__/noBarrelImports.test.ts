import { RuleTester } from '@typescript-eslint/rule-tester';
import noBarrelImports from '../noBarrelImports';

describe('Test noBarrelImports', () => {
  const tester = new RuleTester();
  tester.run(
    'no-barrel-imports',
    noBarrelImports,
    {
      valid: [
        {
          code: "import memoize from 'lodash/memoize';",
          options: [['lodash']]
        },
        {
          code: "import type { memoize } from 'lodash';",
          options: [['lodash']]
        },
        {
          code: "import memoize from 'lodash/memoize'\nimport cloneDeep from 'lodash/cloneDeep'",
          options: [['lodash']]
        },
        {
          code: "import something from 'lodash/memoize'",
          options: [['lodash']]
        },
        {
          code: "import * as _ from 'lodash'",
          options: [['lodash']]
        },
        {
          code: "import _ from 'lodash'",
          options: [['lodash']]
        }
      ],
      invalid: [{
        code: "import { memoize } from 'lodash';",
        errors: [{ messageId: 'main' }],
        output: "import memoize from 'lodash/memoize'",
        options: [['lodash']]
      }, {
        code: "import { memoize, cloneDeep } from 'lodash';",
        errors: [{ messageId: 'main' }],
        output: "import memoize from 'lodash/memoize'\nimport cloneDeep from 'lodash/cloneDeep'",
        options: [['lodash']]
      }, {
        code: "import { memoize as memoize2, cloneDeep } from 'lodash';",
        errors: [{ messageId: 'main' }],
        output: "import memoize2 from 'lodash/memoize'\nimport cloneDeep from 'lodash/cloneDeep'",
        options: [['lodash']]
      }, {
        code: "import _, { memoize as memoize2, cloneDeep } from 'lodash'",
        errors: [{ messageId: 'main' }],
        output: [
          "import _ from 'lodash'",
          "import memoize2 from 'lodash/memoize'",
          "import cloneDeep from 'lodash/cloneDeep'",
        ].join('\n'),
        options: [['lodash']]
      }, {
        code: "import _, { type memoize as memoize2, cloneDeep } from 'lodash'",
        errors: [{ messageId: 'main' }],
        output: [
          "import _ from 'lodash'",
          "import type memoize2 from 'lodash/memoize'",
          "import cloneDeep from 'lodash/cloneDeep'",
        ].join('\n'),
        options: [['lodash']]
      }]
    }
  );
});
