import fs from 'fs/promises';
import { bundlesDir, outDir } from '@sourceacademy/modules-repotools/getGitRoot';
import type { ResolvedBundle } from '@sourceacademy/modules-repotools/types';
import * as td from 'typedoc';
import { describe, expect, it, test as baseTest, vi } from 'vitest';
import { expectWarn } from '../../../__tests__/fixtures.js';
import { buildJson, parsers, type ParserError, type ParserResult, type ParserSuccess } from '../json.js';
import { initTypedocForJson } from '../typedoc.js';

describe('Test buildJson', () => {
  interface Fixtures {
    testBundle: ResolvedBundle
    project: td.ProjectReflection
  }

  const mockedWriteFile = vi.spyOn(fs, 'writeFile');

  const test = baseTest.extend<Fixtures>({
    testBundle: ({}, use) => use({
      type: 'bundle',
      name: 'test0',
      manifest: {},
      directory: `${bundlesDir}/test0`
    }),
    project: async ({ testBundle }, use) => {
      const app = await initTypedocForJson(testBundle, td.LogLevel.None);
      const project = await app.convert();
      use(project!);
    }
  });

  test('Regular function', async ({ testBundle, project }) => {
    const result = await buildJson(testBundle, outDir, project);
    expect(result.severity).toEqual('success');

    expect(fs.writeFile).toHaveBeenCalledOnce();
    const { calls: [[path, data]] } = mockedWriteFile.mock;
    expect(path).toEqual(`${outDir}/jsons/test0.json`);
    expect(data).toMatchInlineSnapshot(`
      "{
        "test_function": {
          "kind": "function",
          "name": "test_function",
          "description": "<p>This is just some test function</p>",
          "params": [
            [
              "_param0",
              "string"
            ]
          ],
          "retType": "number"
        }
      }"
    `);
  });

  test('Encountering an unrecognized type', async ({ testBundle, project }) => {
    project.addChild(new td.DeclarationReflection(
      'TestType',
      td.ReflectionKind.TypeAlias
    ));

    const result = await buildJson(testBundle, outDir, project);
    expectWarn(result.severity);

    expect(result.warnings.length).toEqual(1);
    expect(result.warnings[0]).toEqual('No parser found for TestType which is of type TypeAlias.');

    expect(fs.writeFile).toHaveBeenCalledOnce();
    const { calls: [[path, data]] } = mockedWriteFile.mock;
    expect(path).toEqual(`${outDir}/jsons/test0.json`);
    expect(data).toMatchInlineSnapshot(`
      "{
        "test_function": {
          "kind": "function",
          "name": "test_function",
          "description": "<p>This is just some test function</p>",
          "params": [
            [
              "_param0",
              "string"
            ]
          ],
          "retType": "number"
        },
        "TestType": {
          "kind": "unknown"
        }
      }"
    `);
  });
});

describe('Test parsers', () => {
  function expectParseSuccess(obj: ParserResult): asserts obj is ParserSuccess {
    expect('obj' in obj).toEqual(true);
  }

  function expectParseError(obj: ParserResult): asserts obj is ParserError {
    expect('error' in obj).toEqual(true);
  }

  describe('Test function parser', () => {
    const functionParser = parsers[td.ReflectionKind.Function]!;

    it('Should return the description when one is available', () => {
      const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
      const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);
      signature.type = new td.IntrinsicType('void');
      signature.comment = {
        summary: [{ kind:'text', text: 'This is a summary' }]
      } as td.Comment;
      decl.signatures = [signature];

      const result = functionParser(decl);
      expectParseSuccess(result);
      expect(result.warnings.length).toEqual(0);
      expect((result.obj).description).toEqual('<p>This is a summary</p>');
    });

    it('Should return "No description available" when none is available', () => {
      const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
      const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);
      signature.type = new td.IntrinsicType('void');
      decl.signatures = [signature];

      const result = functionParser(decl);
      expectParseSuccess(result);
      expect(result.warnings.length).toEqual(0);
      expect(result.obj.description).toEqual('<p>No description available</p>');
    });

    it('Should return an error if there are no signatures avaiable', () => {
      const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
      const result = functionParser(decl);

      expectParseError(result);
      expect(result.error).toEqual('Function testFunction has 0 signatures!');
    });

    it('Should return an error when the signature has no return type', () => {
      const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
      const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);
      decl.signatures = [signature];

      const result = functionParser(decl);
      expectParseError(result);
      expect(result.error).toEqual('Signature for testFunction did not have a valid return type');
    });

    it('Should return a warning when parsing a function with multiple signatures', () => {
      const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
      const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);
      signature.type = new td.IntrinsicType('void');

      decl.signatures = [signature, signature];

      const result = functionParser(decl);
      expectParseSuccess(result);
      expect(result.warnings.length).toEqual(1);
      expect(result.warnings[0]).toEqual('Function testFunction has more than 1 signature; only using the first one');
    });

    baseTest('Parameters and return types', () => {
      const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
      const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);

      const param0 = new td.ParameterReflection('param0', td.ReflectionKind.Parameter, signature);
      param0.type = new td.ArrayType(new td.IntrinsicType('string'));

      const param1 = new td.ParameterReflection('param1', td.ReflectionKind.Parameter, signature);
      param1.type = new td.UnionType([new td.IntrinsicType('boolean'), new td.IntrinsicType('number')]);

      signature.type = new td.IntrinsicType('void');
      signature.parameters = [param0, param1];
      decl.signatures = [signature];

      const result = functionParser(decl);
      expectParseSuccess(result);
      expect(result.obj).toMatchInlineSnapshot(`
        {
          "description": "<p>No description available</p>",
          "kind": "function",
          "name": "testFunction",
          "params": [
            [
              "param0",
              "string[]",
            ],
            [
              "param1",
              "boolean | number",
            ],
          ],
          "retType": "void",
        }
      `);
    });
  });

  describe('Test variable parser', () => {
    const variableParser = parsers[td.ReflectionKind.Variable]!;

    it('should return the description when one is present', () => {
      const decl = new td.DeclarationReflection('testVar', td.ReflectionKind.Variable);
      decl.type = new td.IntrinsicType('string');
      decl.comment = {
        summary: [{ kind: 'text', text: 'This is a summary' }]
      } as td.Comment;

      const result = variableParser(decl);
      expectParseSuccess(result);
      expect(result.obj.description).toEqual('<p>This is a summary</p>');

    });

    it('Should return "No description available" when none is available', () => {
      const decl = new td.DeclarationReflection('testVar', td.ReflectionKind.Variable);
      decl.type = new td.IntrinsicType('string');

      const result = variableParser(decl);
      expectParseSuccess(result);
      expect(result.obj.description).toEqual('<p>No description available</p>');
    });

    it('Should return an error if the variable has no type', () => {
      const decl = new td.DeclarationReflection('testVar', td.ReflectionKind.Variable);
      const result = variableParser(decl);
      expectParseError(result);
      expect(result.error).toEqual('Variable testVar does not have a valid type');
    });
  });
});
