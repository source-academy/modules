import tsParser from '@typescript-eslint/parser';
import { RuleTester } from 'eslint';
import typeImportsPlugin from '../typeimports';

describe('Test collateTypeImports', () => {
  const tester = new RuleTester({
    'languageOptions': {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
  });

  tester.run(
    'collate-type-imports',
    typeImportsPlugin.rules['collate-type-imports'],
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
        errors: 1,
        output: 'import type { a, b } from \'wherever\''
      }, {
        code: 'import { type a } from "wherever"',
        errors: 1,
        output: 'import type { a } from \'wherever\''
      }, {
        code: 'import { type a as b } from "wherever"',
        errors: 1,
        output: "import type { a as b } from 'wherever'"
      }]
    }
  );
});
