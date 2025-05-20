import { RuleTester } from '@typescript-eslint/rule-tester';
import collateTypeImports from '../typeimports';

describe('Test collateTypeImports', () => {
  const tester = new RuleTester();
  tester.run(
    'collate-type-imports',
    collateTypeImports,
    {
      valid: [
        'import type { a, b } from "wherever"',
        '',
        'import { type a, b } from "wherever"',
        'import { a, b } from "wherever"',
        'import a, { type b } from "wherever"',
        'import type { a as b } from "wherever"',
        'import { type a as b, c } from "wherever"',
        'import "wherever"',
      ],
      invalid: [{
        code: 'import { type a, type b } from "wherever"',
        errors: [{ messageId: 'msg' }],
        output: 'import type { a, b } from \'wherever\''
      }, {
        code: 'import { type a } from "wherever"',
        errors: [{ messageId: 'msg' }],
        output: 'import type { a } from \'wherever\''
      }, {
        code: 'import { type a as b } from "wherever"',
        errors: [{ messageId: 'msg' }],
        output: "import type { a as b } from 'wherever'"
      }]
    }
  );
});
