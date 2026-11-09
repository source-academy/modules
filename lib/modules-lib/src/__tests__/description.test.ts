import { describe, expect, test } from 'vitest';
import { DESCRIPTION_VERSION, checkDescription, fn, fun, opaque, parameter, validateDescription, type ModuleDescription } from '../description';

const base: ModuleDescription = {
  version: DESCRIPTION_VERSION,
  module: 'demo',
  opaqueTypes: ['Thing', { name: 'Box', typeParameters: ['A'] }],
  functions: [],
  constants: []
};

describe(validateDescription, () => {
  test('a consistent description has no problems', () => {
    expect(validateDescription({
      ...base,
      functions: [
        fn('make', [['size', 'integer'], ['label', 'string']], opaque('Thing')),
        fn('wrap', [['x', parameter('A')]], opaque('Box', parameter('A')), ['A']),
        fn('each', [['f', fun(['number'], 'boolean')], ['xs', { list: 'number' }]], { pair: [{ array: 'number' }, 'void'] }),
        fn('is_thing', [['x', 'any']], 'boolean')
      ],
      constants: [{ name: 'origin', type: opaque('Thing') }]
    })).toEqual([]);
  });

  test.each<[string, ModuleDescription, RegExp]>([
    ['an opaque type that is not declared', { ...base, functions: [fn('f', [], opaque('Other'))] }, /Other is not declared/],
    ['an opaque type with the wrong number of type parameters', { ...base, functions: [fn('f', [], opaque('Box'))] }, /Box has 1 type parameters, not 0/],
    ['a type parameter that is not declared', { ...base, functions: [fn('f', [], parameter('A'))] }, /type parameter A is not declared/],
    ['a name that is described twice', { ...base, functions: [fn('f', [], 'void'), fn('f', [], 'void')] }, /f is described twice/],
    ['an opaque type that is declared twice', { ...base, opaqueTypes: ['Thing', 'Thing'] }, /Thing is declared twice/],
    ['an unknown version', { ...base, version: 2 as 1 }, /version 2/]
  ])('reports %s', (_, description, message) => {
    expect(validateDescription(description).join('\n')).toMatch(message);
  });

  test('an integer is for a parameter: not for a result, nor for a parameter of a callback that a program passes in', () => {
    expect(validateDescription({ ...base, functions: [fn('f', [], 'integer')] }).join()).toMatch(/integer is for a parameter/);
    expect(validateDescription({ ...base, functions: [fn('f', [['g', fun(['integer'], 'void')]], 'void')] }).join()).toMatch(/integer is for a parameter/);
    // a callback that the module returns is called by the program, with a whole number
    expect(validateDescription({ ...base, functions: [fn('f', [], fun(['integer'], 'void'))] })).toEqual([]);
  });
});

describe(checkDescription, () => {
  const description: ModuleDescription = { ...base, functions: [fn('a', [], 'void')], constants: [{ name: 'b', type: 'number' }] };

  test('what is exported and what is described must be the same names', () => {
    expect(checkDescription(description, ['a', 'b'])).toEqual([]);
    expect(checkDescription(description, ['a', 'b', 'c'])).toEqual(['c is exported but not described']);
    expect(checkDescription(description, ['a'])).toEqual(['b is described but not exported']);
  });
});
