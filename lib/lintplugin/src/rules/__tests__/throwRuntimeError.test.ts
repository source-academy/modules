import pathlib from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';
import throwRuntimeError from '../typed/throwRuntimeError';

describe('Test throwRuntimeError', () => {
  const tester = new RuleTester({
    languageOptions: {
      parserOptions: {
        project: pathlib.join(import.meta.dirname, 'test-tsconfig.jsonc'),
        tsconfigRootDir: import.meta.dirname
      }
    }
  });

  tester.run(
    'throw-runtime-error',
    throwRuntimeError,
    {
      valid: [
        {
          name: 'Directly throwing GeneralRuntimeError is okay',
          code: `
            import { GeneralRuntimeError } from 'js-slang/dist/errors/base';
            throw new GeneralRuntimeError();
          `,
        },
        {
          name: 'Throwing through modules-lib is okay',
          code: `
            import { GeneralRuntimeError } from '@sourceacademy/modules-lib/errors';
            throw new GeneralRuntimeError();
          `,
        },
        {
          name: 'Throwing subclass is okay',
          code: `
            import { GeneralRuntimeError } from '@sourceacademy/modules-lib/errors';
            class AnotherError extends GeneralRuntimeError {}
            class NewError extends AnotherError {}
            throw new NewError();
          `
        },
        {
          name: 'Throwing an ignored identifier is okay',
          code: 'throw new AssertError();',
          options: [{
            ignoredNames: ['AssertError'],
            allowRethrow: true
          }]
        },
        {
          name: 'Throwing an ignored member expression is okay',
          code: 'throw new errors.AssertError();',
          options: [{
            ignoredNames: ['AssertError'],
            allowRethrow: true
          }]
        },
        {
          name: 'Allow rethrown errors',
          code: `
            try {
              foo();
            } catch (err) {
              throw err; 
            }
          `
        }
      ],
      invalid: [
        {
          name: 'Throwing regular error',
          code: 'throw new Error();',
          errors: [{
            messageId: 'invalidThrow',
            suggestions: [{
              messageId: 'throwGeneral',
              output: 'throw new GeneralRuntimeError();'
            }, {
              messageId: 'throwInternal',
              output: 'throw new InternalRuntimeError();'
            }]
          }],
        },
        {
          name: 'Throwing an error object that doesn\'t inherit from RuntimeSourceError',
          code: 'class NewError extends Error {}\nthrow new NewError();',
          errors: [{
            messageId: 'invalidThrow',
            suggestions: [{
              messageId: 'throwGeneral',
              output: 'class NewError extends Error {}\nthrow new GeneralRuntimeError();'
            }, {
              messageId: 'throwInternal',
              output: 'class NewError extends Error {}\nthrow new InternalRuntimeError();'
            }]
          }],
        }
      ]
    }
  );
});
