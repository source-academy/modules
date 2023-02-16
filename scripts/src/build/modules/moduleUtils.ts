import type { BuildOptions as ESBuildOptions } from 'esbuild';
import type {
  BinaryExpression,
  FunctionDeclaration,
  Identifier,
  IfStatement,
  Literal,
  MemberExpression,
  NewExpression,
  ObjectExpression,
  Property,
  ReturnStatement,
  TemplateLiteral,
  ThrowStatement,
  VariableDeclaration,
} from 'estree';

/**
 * Build the AST representation of a `require` function to use with the transpiled IIFEs
 */
export const requireCreator = (createObj: Record<string, string>) => ({
  type: 'FunctionDeclaration',
  id: {
    type: 'Identifier',
    name: 'require',
  } as Identifier,
  params: [
    {
      type: 'Identifier',
      name: 'x',
    } as Identifier,
  ],
  body: {
    type: 'BlockStatement',
    body: [
      {
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: {
              type: 'Identifier',
              name: 'result',
            } as Identifier,
            init: {
              type: 'MemberExpression',
              computed: true,
              property: {
                type: 'Identifier',
                name: 'x',
              } as Identifier,
              object: {
                type: 'ObjectExpression',
                properties: Object.entries(createObj)
                  .map(([key, value]) => ({
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Literal',
                      value: key,
                    } as Literal,
                    value: {
                      type: 'Identifier',
                      name: value,
                    } as Identifier,
                  })) as Property[],
              } as ObjectExpression,
            } as MemberExpression,
          },
        ],
      } as VariableDeclaration,
      {
        type: 'IfStatement',
        test: {
          type: 'BinaryExpression',
          left: {
            type: 'Identifier',
            name: 'result',
          } as Identifier,
          operator: '===',
          right: {
            type: 'Identifier',
            name: 'undefined',
          } as Identifier,
        } as BinaryExpression,
        consequent: {
          type: 'ThrowStatement',
          argument: {
            type: 'NewExpression',
            callee: {
              type: 'Identifier',
              name: 'Error',
            } as Identifier,
            arguments: [
              {
                type: 'TemplateLiteral',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'x',
                  },
                ],
                quasis: [
                  {
                    type: 'TemplateElement',
                    value: {
                      raw: 'Internal Error: Unknown import "',
                    },
                    tail: false,
                  },
                  {
                    type: 'TemplateElement',
                    value: {
                      raw: '"!',
                    },
                    tail: true,
                  },
                ],
              } as TemplateLiteral,
            ],
          } as NewExpression,
        } as ThrowStatement,
        alternate: {
          type: 'ReturnStatement',
          argument: {
            type: 'Identifier',
            name: 'result',
          } as Identifier,
        } as ReturnStatement,
      } as IfStatement,
    ],
  },
}) as FunctionDeclaration;

export const esbuildOptions: ESBuildOptions = {
  bundle: true,
  format: 'iife',
  globalName: 'module',
  define: {
    process: JSON.stringify({
      env: {
        NODE_ENV: 'production',
      },
    }),
  },
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
  },
  // minify: true,
  platform: 'browser',
  target: 'es6',
  write: false,
};
