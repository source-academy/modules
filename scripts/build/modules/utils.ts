import { babel } from '@rollup/plugin-babel';
import commonJS from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { generate } from 'astring';
import type {
  CallExpression,
  ExpressionStatement,
  FunctionExpression,
  Identifier,
  Program,
  VariableDeclaration,
} from 'estree';
import type { Plugin, RollupOptions } from 'rollup';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { Worker } from 'worker_threads';

import { NODE_MODULES_PATTERN, SOURCE_PATH } from '../../constants';

const SUPPRESSED_WARNINGS = ['MISSING_NAME_OPTION_FOR_IIFE_EXPORT'];

/**
 * Use AST parsing to convert modules and tabs to the appropriate form\
 * For tabs, rollup outputs the following iife:
 * ```
 * (function(React, ReactDom) {
 *  // tab code
 * })(React, ReactDom)
 * ```
 * which gets converted to
 * ```
 * (function(React, ReactDom) {
 *   // tab code
 * })
 * ```
 * Rollup outputs the following for bundles that are variations of:
 * ```
 * (function(exports, moduleHelpers) {
 *   'use strict';
 *   // bundle code
 * })({}, moduleHelpers)
 * ```
 * The plugin converts them to the format below:
 * ```
 * (function(moduleHelpers){
 *   'use strict';
 *    var exports = {};
 *   // bundle code
 * })
 * ```
 */
export const converterPlugin = (type: 'bundle' | 'tab'): Plugin => ({
  name: 'Module Converter',
  async renderChunk(code) {
    const parsed = this.parse(code) as unknown as Program;
    const exprStatement = parsed.body[0] as ExpressionStatement;
    const funcExpr = (exprStatement.expression as CallExpression).callee as FunctionExpression;

    if (type === 'bundle' && funcExpr.params.length > 0) {
      const [param0, ...params] = funcExpr.params as Identifier[];

      if (param0.name === 'exports') {
        // Rollup adds an exports parameter for bundles that directly export their functions
        // This section removes that parameter
        const [useStrictExpr, ...newBody] = funcExpr.body.body;

        funcExpr.params = params;
        funcExpr.body.body = [useStrictExpr, {
          type: 'VariableDeclaration',
          kind: 'var',
          declarations: [{
            type: 'VariableDeclarator',
            id: {
              type: 'Identifier',
              name: 'exports',
            },
            init: {
              type: 'ObjectExpression',
              properties: [],
            },
          }],
        } as VariableDeclaration].concat(newBody);
      } else if (param0.name !== 'moduleHelpers') {
        // This section handles bundles that don't export all their functions directly
        // They should only have one parameter named moduleHelpers
        console.warn(`Expected the first parameter of the bundle to be called 'moduleHelpers', got ${param0.name}`);
      }
    }
    exprStatement.expression = funcExpr;

    const result = generate(exprStatement);

    // Remove trailing semicolon
    if (result.endsWith(';')) return result.substring(0, result.length - 1);

    return result;
  },

});

/**
 * Default configuration used by rollup for transpiling both tabs and bundles
 */
export const defaultConfig = (type: 'bundle' | 'tab'): RollupOptions => ({
  onwarn(warning: any, warn: any) {
    if (SUPPRESSED_WARNINGS.includes(warning.code)) return;
    warn(warning);
  },
  plugins: [
    typescript({
      tsconfig: 'src/tsconfig.json',
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx'],
      include: [`${SOURCE_PATH}/**`],
    }),
    rollupResolve({
      // Source Academy's modules run in a browser environment. The default setting (false) may
      // cause compilation issues when using some imported packages.
      // https://github.com/rollup/plugins/tree/master/packages/node-resolve#browser
      browser: true,
      // Tells rollup to look for locally installed modules instead of preferring built-in ones.
      // Node's built-in modules include `fs` and `path`, which the jsdom browser environment does
      // not have.
      // https://github.com/rollup/plugins/tree/master/packages/node-resolve#preferbuiltins
      preferBuiltins: false,
    }),
    commonJS({
      include: NODE_MODULES_PATTERN,
      sourceMap: false,
      // https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports
      // namedExports: {
      //   'react': [
      //     'Children',
      //     'cloneElement',
      //     'Component',
      //     'createContext',
      //     'createElement',
      //     'createRef',
      //     'isValidElement',
      //     'PureComponent',
      //     'useCallback',
      //     'useContext',
      //     'useEffect',
      //     'useMemo',
      //     'useReducer',
      //     'useRef',
      //     'useState',
      //   ],
      //   'react-dom': [
      //     'createPortal',
      //     'findDOMNode',
      //     'render',
      //     'unmountComponentAtNode',
      //     'unstable_renderSubtreeIntoContainer',
      //   ],
      // },
    }),
    injectProcessEnv({
      NODE_ENV: process.env.NODE_ENV,
    }),
    converterPlugin(type),
  ],
});

export const runWorker = <T>(path: string, data: any) => new Promise<T>((resolve, reject) => {
  const worker = new Worker(path, { workerData: data });
  worker.on('message', resolve);
  worker.on('error', reject);
  worker.on('exit', (code) => {
    if (code !== 0) {
      reject(new Error(`stopped with exit code ${code}`));
    }
  });
});
