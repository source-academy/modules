import { RuleTester } from '@typescript-eslint/rule-tester';
import instanceofCheck from '../typed/instanceofCheck';

describe('Test instanceofCheck', () => {
  const tester = new RuleTester({
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.ts']
        }
      }
    }
  });

  tester.run(
    'instanceof-check',
    instanceofCheck,
    {
      valid: [
        {
          name: 'Importing from node module should not error',
          code: `
            import { X } from 'fs';
            console.log(0 instanceof X);
          `
        },
        {
          name: 'Comparing against local class should not error',
          code: `
            class X {}
            console.log(0 instanceof X);
          `
        },
      ],
      invalid: [
        {
          name: 'Importing from bundle should error',
          code: `
            import { X } from '@sourceacademy/bundle-sound';
            console.log(0 instanceof X);
          `,
          errors: [{
            messageId: 'main',
            data: {
              type: 'X',
              spec: '@sourceacademy/bundle-sound'
            }
          }]
        },
        {
          name: 'Importing from modules-lib should error',
          code: `
            import { X } from '@sourceacademy/modules-lib';
            console.log(0 instanceof X);
          `,
          errors: [{
            messageId: 'main',
            data: {
              type: 'X',
              spec: '@sourceacademy/modules-lib'
            }
          }]
        },
        {
          name: 'Importing from bundle with alias is still error',
          code: `
            import { X as Y } from '@sourceacademy/bundle-sound';
            console.log(0 instanceof Y);
          `,
          errors: [{
            messageId: 'main',
            data: {
              type: 'Y',
              spec: '@sourceacademy/bundle-sound'
            }
          }]
        }
      ]
    }
  );
});
