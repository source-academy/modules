import { RuleTester } from '@typescript-eslint/rule-tester';
import noBarrelImports from '../noBarrelImports';

/*
describe('Test noBarrelImports', () => {
  const tester = new RuleTester();
  tester.run(
    'no-barrel-imports',
    noBarrelImports,
    {
      valid: [
        {
          code: "import { memoize } from 'es-toolkit';",
          options: [['es-toolkit']]
        },
        {
          code: "import type { memoize } from 'es-toolkit';",
          options: [['es-toolkit']]
        },
        {
          code: "import type * as _ from 'es-toolkit';",
          options: [['es-toolkit']]
        },
        {
          code: "import { memoize } from 'es-toolkit'\nimport { cloneDeep } from 'es-toolkit';",
          options: [['es-toolkit']]
        },
        {
          code: "import something from 'es-toolkit'",
          options: [['es-toolkit']]
        },
        {
          code: "import * as _ from 'es-toolkit'",
          options: [['es-toolkit']]
        },
        {
          code: "import _ from 'es-toolkit'",
          options: [['es-toolkit']]
        }
      ],
      invalid: [{
        code: "import { memoize } from 'es-toolkit';",
        errors: [{ messageId: 'main' }],
        output: "import { memoize } from 'es-toolkit'",
        options: [['es-toolkit']]
      }, {
        code: "import { memoize, cloneDeep } from 'es-toolkit';",
        errors: [{ messageId: 'main' }],
        output: "import { memoize } from 'es-toolkit'\nimport { cloneDeep } from 'es-toolkit';",
        options: [['es-toolkit']]
      }, {
        code: "import { memoize as memoize2, cloneDeep } from 'es-toolkit';",
        errors: [{ messageId: 'main' }],
        output: "import { memoize2 } from 'es-toolkit'\nimport { cloneDeep } from 'es-toolkit';",
        options: [['es-toolkit']]
      }, {
        code: "import _, { memoize as memoize2, cloneDeep } from 'es-toolkit';",
        errors: [{ messageId: 'main' }],
        output: [
          "import _ from 'es-toolkit'",
          "import { memoize2 } from 'es-toolkit'",
          "import { cloneDeep } from 'es-toolkit';",
        ].join('\n'),
        options: [['es-toolkit']]
      }, {
        code: "import _, { type memoize as memoize2, cloneDeep } from 'es-toolkit';",
        errors: [{ messageId: 'main' }],
        output: [
          "import _ from 'es-toolkit'",
          "import type { memoize2 } from 'es-toolkit'",
          "import { cloneDeep } from 'es-toolkit';",
        ].join('\n'),
        options: [['es-toolkit']]
      }]
    }
  );
});
*/
