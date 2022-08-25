// /* [Imports] */
import fs from 'fs';
import { babel } from '@rollup/plugin-babel';
import rollupResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import chalk from 'chalk';
import commonJS from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { join } from 'path';
import { Low, JSONFile } from 'lowdb';
import {
  DATABASE_NAME,
  NODE_MODULES_PATTERN,
  SOURCE_PATH,
  SUPPRESSED_WARNINGS,
} from '../constants';
import { cjsDirname } from '../utilities';
import { generate } from 'astring';
import type { Plugin } from 'rollup';
import type {
  BinaryExpression,
  CallExpression,
  Expression,
  ExpressionStatement,
  FunctionExpression,
  Identifier,
  IfStatement,
  MemberExpression,
  NewExpression,
  ObjectExpression,
  Program,
  Property,
  ReturnStatement,
  Statement,
  ThrowStatement,
} from 'estree';

export const converterPlugin = (): Plugin => ({
  name: 'Module Converter',
  async renderChunk(code) {
    const parsed = this.parse(code) as unknown as Program;
    const exprStatement = parsed.body[0] as ExpressionStatement;
    const { callee: funcExpression } = exprStatement.expression as CallExpression;
    exprStatement.expression = funcExpression as FunctionExpression;

    return generate(exprStatement);
  },
});

/**
 * Rollup plugin to use with bundles to compile them with the proxy object
 * to build in undefined symbol checking
 */
export const bundlePlugin = (): Plugin => ({
  name: 'Bundle Parser',
  async renderChunk(code) {
    const parsed = this.parse(code) as unknown as Program;
    const originalExpr = parsed.body[0] as ExpressionStatement;
    const { callee: funcExpr } = originalExpr.expression as CallExpression;

    const statements = (funcExpr as FunctionExpression).body.body;
    const [lastReturn] = statements.slice(-1);
    if (lastReturn.type !== 'ReturnStatement') throw new Error('Idk what to do here');

    const createIdentifier = (name: string): Identifier => ({
      type: 'Identifier',
      name,
    });

    const createFunctionExpr = (params: string[], body: Statement[]): FunctionExpression => ({
      type: 'FunctionExpression',
      params: params.map(createIdentifier),
      body: {
        type: 'BlockStatement',
        body,
      },
    });

    const createProperty = (name: string, value: Expression): Property => ({
      type: 'Property',
      kind: 'init',
      computed: false,
      shorthand: false,
      method: false,
      key: createIdentifier(name),
      value,
    });

    // Need to find some way to inherit from RuntimeSourceError
    const errorProg = this.parse(`({
        type: 'Runtime',
        severity: 'Error',
        location: {
          start: {
            line: -1,
            column: -1,
          },
          end: {
            line: -1,
            column: -1,
          },
        },
        explain: function() { return "Unknown symbol '" + name + "'"; },
        elaborate: function() { return "You should check your imports and make sure the name you're importing is defined in that module"; }
      })`) as unknown as Program;

    const errorObj = (errorProg.body[0] as ExpressionStatement).expression as ObjectExpression;

    const proxyExpr = {
      type: 'NewExpression',
      callee: createIdentifier('Proxy'),
      arguments: [
        lastReturn.argument,
        {
          type: 'ObjectExpression',
          properties: [
            createProperty('get', createFunctionExpr(['target', 'name'], [{
              type: 'IfStatement',
              test: {
                type: 'BinaryExpression',
                left: createIdentifier('name'),
                right: createIdentifier('target'),
                operator: 'in',
              } as BinaryExpression,
              consequent: {
                type: 'BlockStatement',
                body: [{
                  type: 'ReturnStatement',
                  argument: {
                    type: 'MemberExpression',
                    object: createIdentifier('target'),
                    property: createIdentifier('name'),
                    computed: true,
                    optional: false,
                  } as MemberExpression,
                } as ReturnStatement],
              },
            } as IfStatement,
            {
              type: 'ThrowStatement',
              argument: errorObj,
            } as ThrowStatement])),
          ],
        } as ObjectExpression,
      ],
    } as NewExpression;

    const newFunc = {
      ...funcExpr,
      type: 'FunctionExpression',
      body: {
        type: 'BlockStatement',
        body: [
          ...statements.slice(0, -1),
          {
            type: 'ReturnStatement',
            argument: proxyExpr,
          },
        ],
      },
    } as FunctionExpression;

    parsed.body = [{
      type: 'ExpressionStatement',
      expression: newFunc,
    }];

    return generate(parsed);
  },
});

/**
 * Default configuration used by rollup for transpiling both tabs and bundles
 */
export const defaultConfig = {
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

      // https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports
      namedExports: {
        'react': [
          'Children',
          'cloneElement',
          'Component',
          'createContext',
          'createElement',
          'createRef',
          'isValidElement',
          'PureComponent',
          'useCallback',
          'useContext',
          'useEffect',
          'useMemo',
          'useReducer',
          'useRef',
          'useState',
        ],
        'react-dom': [
          'createPortal',
          'findDOMNode',
          'render',
          'unmountComponentAtNode',
          'unstable_renderSubtreeIntoContainer',
        ],
      },
    }),
    injectProcessEnv({
      NODE_ENV: process.env.NODE_ENV,
    }),

    filesize({
      showMinifiedSize: false,
      showGzippedSize: false,
    }),
    converterPlugin(),
  ],
};

// Function takes in relative paths, for cleaner logging
export function isFolderModified(relativeFolderPath: string, storedTimestamp: number) {
  function toFullPath(rootRelativePath: string) {
    return join(process.cwd(), rootRelativePath);
  }

  let fullFolderPath = toFullPath(relativeFolderPath);

  let contents = fs.readdirSync(fullFolderPath);
  for (let content of contents) {
    let relativeContentPath = join(relativeFolderPath, content);
    let fullContentPath = join(fullFolderPath, content);

    let stats = fs.statSync(fullContentPath);

    // If is folder, recurse. If found something modified, stop early
    if (
      stats.isDirectory()
      && isFolderModified(relativeContentPath, storedTimestamp)
    ) {
      return true;
    }

    // Is file. Compare timestamps to see if stop early
    if (stats.mtimeMs > storedTimestamp) {
      console.log(chalk.grey(`• File modified: ${relativeContentPath}`));
      return true;
    }
  }

  return false;
}

/**
 * Get the path to the database file
 */
export function getDbPath() {
  return join(cjsDirname(import.meta.url), DATABASE_NAME);
}

export const checkForUnknowns = <T>(inputs: T[], existing: T[]) => inputs.filter((each) => !existing.includes(each));

const DBKeys = ['jsons', 'bundles', 'tabs'] as const;

type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in (T extends ReadonlyArray<infer U> ? U : never)]: V
};

export type DBType = {
  docs: number;
} & ObjectFromList<typeof DBKeys, {
  [name: string]: number;
}>;

export type EntryWithReason = [string, string];

export type Opts = Partial<{
  force: boolean;
  verbose: boolean;
  modules: string[];
  tabs: string[];
  jsons: string[];
}>;

/**
 * Get a new Lowdb instance
 */
export async function getDb() {
  const db = new Low(new JSONFile<DBType>(getDbPath()));
  await db.read();

  if (!db.data) {
    // Set default data if database.json is missing
    db.data = {
      docs: 0,
      jsons: {},
      bundles: {},
      tabs: {},
    };
  }
  return db;
}

export type BuildTask = (db: Low<DBType>) => Promise<any>;

export function removeDuplicates<T>(arr: T[]) {
  return [...new Set<T>(arr)];
}
