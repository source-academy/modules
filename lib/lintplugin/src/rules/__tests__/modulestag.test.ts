import { RuleTester } from 'eslint';
import moduleTagPresent from '../moduleTag';

describe('Test moduleTagPresent', () => {
  const tester = new RuleTester();

  tester.run(
    'module-tag-present',
    moduleTagPresent,
    {
      valid: [`
        /**
         * @module hi
         */
      `],
      invalid: [
        {
          code: '',
          errors: 1,
        }, {
          code: '// A comment',
          errors: 1,
        }, {
          code: '/* A comment */',
          errors: 1,
        }, {
          code: '/**\n *\n */',
          errors: 1,
        },
        {
          code: `
          /**
           * @author yo
           */
        `,
          errors: 1,
        }]
    }
  );
});
