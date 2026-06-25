/* eslint-disable vitest/no-commented-out-tests */
import * as td from 'typedoc';
import { describe, expect, it, test as baseTest, vi } from 'vitest';
import { parsers } from '../json';

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

    // it('Should return an error if there are no signatures avaiable', () => {
    //   const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
    //   testFunctionEntry(decl);

    //   expect(result.error).toEqual('Function testFunction has 0 signatures!');
    // });

    // it('Should return an error when the signature has no return type', () => {
    //   const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
    //   const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);
    //   decl.signatures = [signature];

    //   const result = functionParser(decl);
    //   expectParseError(result);
    //   expect(result.error).toEqual('Signature for testFunction did not have a valid return type');
    // });

    // it('Should return a warning when parsing a function with multiple signatures', () => {
    //   const decl = new td.DeclarationReflection('testFunction', td.ReflectionKind.Function);
    //   const signature = new td.SignatureReflection('testFunction', td.ReflectionKind.CallSignature, decl);
    //   signature.type = new td.IntrinsicType('void');

    //   decl.signatures = [signature, signature];

    //   const result = functionParser(decl);
    //   expectParseSuccess(result);
    //   expect(result.warnings.length).toEqual(1);
    //   expect(result.warnings[0]).toEqual('Function testFunction has more than 1 signature; only using the first one');
    // });

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

      const result = testFunctionEntry(decl);
      expect(result).toMatchInlineSnapshot(`
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

    // it('Should return an error if the variable has no type', () => {
    //   const decl = new td.DeclarationReflection('testVar', td.ReflectionKind.Variable);
    //   const result = variableParser(decl);
    //   expectParseError(result);
    //   expect(result.error).toEqual('Variable testVar does not have a valid type');
    // });
  });
});
