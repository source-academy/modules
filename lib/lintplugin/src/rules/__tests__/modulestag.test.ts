import { RuleTester } from 'eslint';
import moduleTagPresent from '../moduleTag'

describe('Test moduleTagPresent', () => {
  const tester = new RuleTester({
    'languageOptions': {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
  });

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
      // {
      //   code: '',
      //   errors: 1,
      //   output: '/**\n * @module module_name\n */\n'
      // }, {
      //   code: '// A comment',
      //   errors: 1,
      //   output: '/**\n * @module module_name\n */\n// A comment'
      // }, {
      //   code: '/* A comment */',
      //   errors: 1,
      //   output: '/**\n * @module module_name\n */\n/* A comment */'
      // }, {
      //   code: '/**\n *\n */', 
      //   errors: 1,
      //   output: '/**\n * @module module_name\n */\n/**\n *\n */'
      // },
      {
        code: `
          /**
           * @author yo
           */
        `,
        errors: 1,
        output: '/**\n * @author yo\n * @module module_name\n */'
      }]
    }
  )
})