import type { MockedFunction } from "jest-mock";
import getJsonCommand, * as jsonModule from '../json';
import * as tscModule from '../../prebuild/tsc';
import fs from 'fs/promises';
import { ReflectionKind, type DeclarationReflection } from "typedoc";

jest.spyOn(jsonModule, 'buildJsons');
jest.spyOn(tscModule, 'runTsc')
  .mockResolvedValue({
    elapsed: 0,
    result: {
      severity: 'error',
      results: [],
    }
  })

const mockBuildJson = jsonModule.buildJsons as MockedFunction<typeof jsonModule.buildJsons>;
const runCommand = (...args: string[]) => getJsonCommand().parseAsync(args, { from: 'user' });

describe('test json command', () => {
  test('normal function', async () => {
    await runCommand();

    expect(fs.mkdir)
      .toBeCalledWith('build', { recursive: true })

    expect(jsonModule.buildJsons)
      .toHaveBeenCalledTimes(1);
  })

  it('should only build the jsons for specified modules', async () => {
    await runCommand('test0', 'test1')

    expect(jsonModule.buildJsons)
      .toHaveBeenCalledTimes(1);

    const buildJsonCall = mockBuildJson.mock.calls[0];
    expect(buildJsonCall[1])
      .toMatchObject({
        outDir: 'build',
        bundles: ['test0', 'test1']
      })
  });

  it('should exit with code 1 if tsc returns with an error', async () => {
    try {
      await runCommand('--tsc'); 
    } catch (error) {
      expect(error)
        .toEqual(new Error('process.exit called with 1'));
    }

    expect(jsonModule.buildJsons)
      .toHaveBeenCalledTimes(0);

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  });

  it('should exit with code 1 if buildJsons returns with an error', async () => {
    mockBuildJson.mockResolvedValueOnce([['json', 'test0', { severity: 'error' }]])
    try {
      await runCommand();
    } catch (error) {
      expect(error)
        .toEqual(new Error('process.exit called with 1'));
    }

    expect(jsonModule.buildJsons)
      .toHaveBeenCalledTimes(1);

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  })
});

describe('test parsers', () => {
  const { [ReflectionKind.Variable]: variableParser, [ReflectionKind.Function]: functionParser } = jsonModule.parsers;

  describe('test function parser', () => {
    test('normal function with parameters', () => {
      const element = {
        name: 'foo',
        signatures: [{
          parameters: [{
            name: 'x',
            type: {
              name: 'number',
            },
          }, {
            name: 'y',
            type: {
              name: 'string',
            },
          }],
          type: {
            name: 'string',
          },
          comment: {
            summary: [{
              text: 'Test'
            }, {
              text: ' Description'
            }]
          }
        }]
      } as DeclarationReflection;

      const { header, desc } = functionParser!(element);

      expect(header)
        .toEqual(`${element.name}(x: number, y: string) → {string}`);

      expect(desc)
        .toEqual('<p>Test Description</p>');
    });

    test('normal function without parameters', () => {
      const element = {
        name: 'foo',
        signatures: [{
          type: {
            name: 'string',
          },
          comment: {
            summary: [{
              text: 'Test'
            }, {
              text: ' Description'
            }]
          }
        }]
      } as DeclarationReflection;

      const { header, desc } = functionParser!(element);

      expect(header)
        .toEqual(`${element.name}() → {string}`);

      expect(desc)
        .toEqual('<p>Test Description</p>');
    });

    test('normal function without return type', () => {
      const element = {
        name: 'foo',
        signatures: [{
          comment: {
            summary: [{
              text: 'Test'
            }, {
              text: ' Description'
            }]
          }
        }]
      } as DeclarationReflection;

      const { header, desc } = functionParser!(element);

      expect(header)
        .toEqual(`${element.name}() → {void}`);

      expect(desc)
        .toEqual('<p>Test Description</p>');
    });

    it('should provide \'No description available\' when description is missing', () => {
      const element = {
        name: 'foo',
        signatures: [{}]
      } as DeclarationReflection;

      const { header, desc } = functionParser!(element);

      expect(header)
        .toEqual(`${element.name}() → {void}`);

      expect(desc)
        .toEqual('<p>No description available</p>');
    });
  });

  describe('test variable parser', () => {
    test('normal function', () => {
      const element = {
        name: 'test_variable',
        type: {
          name: 'number'
        },
        comment: {
          summary: [{
            text: 'Test'
          }, {
            text: ' Description'
          }]
        }
      } as DeclarationReflection;

      const { header, desc } = variableParser!(element);

      expect(header)
        .toEqual(`${element.name}: number`);

      expect(desc)
        .toEqual('<p>Test Description</p>');
    })

    it('should provide \'No description available\' when description is missing', () => {
      const element = {
        name: 'test_variable',
        type: {
          name: 'number'
        },
      } as DeclarationReflection;

      const { header, desc } = variableParser!(element);

      expect(header)
        .toEqual(`${element.name}: number`);

      expect(desc)
        .toEqual('<p>No description available</p>');
    })

    it("should provide 'unknown' if type information is unavailable", () => {
      const element = {
        name: 'test_variable',
        comment: {
          summary: [{
            text: 'Test'
          }, {
            text: 'Description'
          }]
        }
      } as DeclarationReflection;

      const { header, desc } = variableParser!(element);

      expect(header)
        .toEqual(`${element.name}: unknown`);

      expect(desc)
        .toEqual('<p>TestDescription</p>');
    });
  });
});
