import pathlib from 'path';
import * as td from 'typedoc';
import { assert, describe, expect, it, test, vi } from 'vitest';
import plugin from '..';
import { buildJson, parsers } from '../json';

describe('Test parsers', () => {
  describe('Test function parser', () => {
    const functionParser = parsers[td.ReflectionKind.Function];

    const testFunctionEntry = vi.defineHelper((entry: td.DeclarationReflection) => {
      const result = functionParser(entry);
      expect(result.kind).toEqual('function');
      return result;
    });

    it('Should return the description when one is available', () => {
      const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
      const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);
      signature.type = new td.IntrinsicType('void');
      signature.comment = {
        summary: [{ kind: 'text', text: 'This is a summary' }],
        blockTags: [] as td.CommentTag[]
      } as td.Comment;
      decl.signatures = [signature];

      const result = testFunctionEntry(decl);
      expect(result.description).toEqual('<p>This is a summary</p>');
    });

    it('Should return "No description available" when none is available', () => {
      const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
      const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);
      signature.type = new td.IntrinsicType('void');
      decl.signatures = [signature];

      const result = testFunctionEntry(decl);
      expect(result.description).toEqual('<p>No description available</p>');
    });

    test('Parameters and return types', () => {
      const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
      const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);

      const param0 = new td.ParameterReflection('param0', td.ReflectionKind.Parameter, signature);
      param0.type = new td.ArrayType(new td.IntrinsicType('string'));

      const param1 = new td.ParameterReflection('param1', td.ReflectionKind.Parameter, signature);
      param1.type = new td.UnionType([new td.IntrinsicType('boolean'), new td.IntrinsicType('number')]);
      param1.defaultValue = 'true';

      signature.type = new td.IntrinsicType('void');
      signature.parameters = [param0, param1];
      decl.signatures = [signature];

      const result = testFunctionEntry(decl);
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "<p>No description available</p>",
          "kind": "function",
          "name": "testFunction",
          "params": [
            {
              "defaultValue": undefined,
              "name": "param0",
              "paramType": "regular",
              "type": "string[]",
            },
            {
              "defaultValue": "true",
              "name": "param1",
              "paramType": "regular",
              "type": "boolean | number",
            },
          ],
          "retType": "void",
        }
      `);
    });

    test('Rest parameters', () => {
      const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
      const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);
      signature.type = new td.IntrinsicType('void');

      const param0 = new td.ParameterReflection('param0', td.ReflectionKind.Parameter, signature);
      param0.type = new td.ArrayType(new td.IntrinsicType('string'));
      param0.setFlag(td.ReflectionFlag.Rest, true);

      signature.parameters = [param0];
      decl.signatures = [signature];

      const result = testFunctionEntry(decl);
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "<p>No description available</p>",
          "kind": "function",
          "name": "testFunction",
          "params": [
            {
              "name": "param0",
              "paramType": "rest",
              "type": "string[]",
            },
          ],
          "retType": "void",
        }
      `);
    });

    test('Optional parameters', () => {
      const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
      const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);
      signature.type = new td.IntrinsicType('void');

      const param0 = new td.ParameterReflection('param0', td.ReflectionKind.Parameter, signature);
      param0.type = new td.ArrayType(new td.IntrinsicType('string'));
      param0.setFlag(td.ReflectionFlag.Optional, true);

      signature.parameters = [param0];
      decl.signatures = [signature];

      const result = testFunctionEntry(decl);
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "<p>No description available</p>",
          "kind": "function",
          "name": "testFunction",
          "params": [
            {
              "name": "param0",
              "paramType": "optional",
              "type": "string[]",
            },
          ],
          "retType": "void",
        }
      `);
    });
  });

  describe('Test variable parser', () => {
    const variableParser = parsers[td.ReflectionKind.Variable];
    const testVariableEntry = vi.defineHelper((entry: td.DeclarationReflection) => {
      const result = variableParser(entry);
      expect(result.kind).toEqual('variable');
      return result;
    });

    it('should return the description when one is present', () => {
      const decl = new td.DeclarationReflection('testVar', td.ReflectionKind.Variable);
      decl.type = new td.IntrinsicType('string');
      decl.comment = {
        summary: [{ kind: 'text', text: 'This is a summary' }],
        blockTags: [] as td.CommentTag[]
      } as td.Comment;

      const result = testVariableEntry(decl);
      expect(result.description).toEqual('<p>This is a summary</p>');

    });

    it('Should return "No description available" when none is available', () => {
      const decl = new td.DeclarationReflection('testVar', td.ReflectionKind.Variable);
      decl.type = new td.IntrinsicType('string');

      const result = testVariableEntry(decl);
      expect(result.description).toEqual('<p>No description available</p>');
    });
  });
});

function convertToTypedocPath(p: string) {
  return p.split(pathlib.sep).join(pathlib.posix.sep);
}

describe('Project conversion and validation', async () => {
  const dirname = convertToTypedocPath(import.meta.dirname);

  const logger = new class extends td.Logger {
    readonly logs: Partial<Record<td.LogLevel, string[]>> = {};

    override log(message: string, level: td.LogLevel) {
      if (!(level in this.logs)) {
        this.logs[level] = [];
      }
      this.logs[level]!.push(message);
    }
  };

  vi.spyOn(logger, 'log');

  const app = await td.Application.bootstrapWithPlugins({
    plugin: [plugin],
    entryPoints: [
      pathlib.posix.join(dirname, 'sample.ts')
    ],
    outputs: [{
      name: 'source-json',
      path: 'jsons/sample.json'
    }],
    tsconfig: pathlib.posix.join(dirname, '..', '..', 'tsconfig.json'),
    logLevel: td.LogLevel.Warn
  });

  app.logger = logger;
  let project: td.ProjectReflection | undefined;

  test('Conversion', { timeout: 10_000 }, async () => {
    project = await app.convert();

    if (!project) {
      console.error(logger.logs);
    }

    expect(project).toBeTruthy();
  });

  test('Validation', () => {
    app.validate(project!);

    const log = vi.mocked(logger.log);
    const warningCalls = log.mock.calls.filter(([, level]) => level >= td.LogLevel.Warn);

    expect(warningCalls).toHaveLength(6);

    for (const [, level] of warningCalls) {
      expect(level).toEqual(td.LogLevel.Warn);
    }

    const messages = warningCalls.map(([each]) => each.replaceAll('\r\n', '\n'));

    // Ensure that the 5 warnings that are supposed to be there are there
    expect(messages).toContain('CustomType is a Interface, which is not supported.');
    expect(messages).toContain('funcTagMissing is typed as a Variable, but function signatures were detected. Did you forget a @function tag?');
    expect(messages).toContain('indirectFuncTagMissing is typed as a Variable, but function signatures were detected. Did you forget a @function tag?');
    expect(messages).toContain('invalidCodeExample has an example tag that did not validate:\n \n/ 10\n');
    expect(messages).toContain('Function multiSignatures has more than 1 signature; only using the first one');
    expect(messages).toContain('Detected type_map in output. Did you forget to add a @hidden tag?');
  });

  describe('Project output', () => {
    test('Regular boolean type guard return types are changed', () => {
      const child = project!.getChildByName('typeGuard');
      assert(child !== undefined, 'Could not find typeGuard declaration!');
      assert(child instanceof td.DeclarationReflection, 'typeGuard was not a DeclarationReflection!');

      expect(child.kind).toEqual(td.ReflectionKind.Function);
      assert(child.signatures?.length === 1, 'No signatures for typeGuard were found');
      const [signature] = child.signatures;

      assert(signature.type instanceof td.IntrinsicType);
      expect(signature.type.name).toEqual('boolean');
    });

    test('Funky boolean type guard return types are changed', () => {
      const child = project!.getChildByName('indirectTypeGuard');
      assert(child !== undefined, 'Could not find indirectTypeGuard declaration!');
      assert(child instanceof td.DeclarationReflection, 'indirectTypeGuard was not a DeclarationReflection!');

      expect(child.kind).toEqual(td.ReflectionKind.Function);
      assert(child.signatures?.length === 1, 'No signatures for indirectTypeGuard were found');
      const [signature] = child.signatures;

      assert(signature.type instanceof td.IntrinsicType);
      expect(signature.type.name).toEqual('boolean');
    });

    test('defaultValue is not preserved without tag', () => {
      const child = project!.getChildByName('const0');
      assert(child !== undefined, 'Could not find const0 declaration!');
      assert(child instanceof td.DeclarationReflection, 'const0 was not a DeclarationReflection!');

      assert(child.comment !== undefined, 'const0 should have a docstring');
      expect(child.comment.getTag('@defaultValue')).toBeUndefined();
      expect(child.defaultValue).toBeUndefined();
    });

    test('defaultValue is preserved with tag', () => {
      const child = project!.getChildByName('const1');
      assert(child !== undefined, 'Could not find const1 declaration!');
      assert(child instanceof td.DeclarationReflection, 'const1 was not a DeclarationReflection!');

      assert(child.comment !== undefined, 'const1 should have a docstring');
      // Tag should get removed after processing
      expect(child.comment.getTag('@defaultValue')).toBeUndefined();
      expect(child.defaultValue).toEqual('525600');
    });

    test('A class export is flattened to only its own public methods, not the constructor, private members, or inherited methods', () => {
      const json = buildJson(project!);

      expect(json.publicMethod).toEqual({
        kind: 'function',
        name: 'publicMethod',
        description: '<p>A public method on a class export.</p>',
        params: [
          {
            paramType: 'regular',
            type: 'boolean',
            name: 'flag',
            defaultValue: undefined
          }
        ],
        retType: 'number'
      });

      expect(json).not.toHaveProperty('SampleClass');
      expect(json).not.toHaveProperty('constructor');
      expect(json).not.toHaveProperty('hiddenField');
      expect(json).not.toHaveProperty('hiddenMethod');
      expect(json).not.toHaveProperty('inheritedMethod');
    });
  });
});
