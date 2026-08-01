import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import { TestDataHandler, booleanValue, emptyListValue, numberValue, stringValue, voidValue } from '@sourceacademy/modules-testplugin';
import { describe, expect, test } from 'vitest';
import { stringifyReplValue } from '../stringify_value';

describe(stringifyReplValue, () => {
  test('VOID stringifies as "undefined"', async () => {
    const evaluator = new TestDataHandler();
    expect(await stringifyReplValue(evaluator, voidValue())).toBe('undefined');
  });

  test.each([true, false])('BOOLEAN %s stringifies via String()', async bool => {
    const evaluator = new TestDataHandler();
    expect(await stringifyReplValue(evaluator, booleanValue(bool))).toBe(String(bool));
  });

  test('NUMBER stringifies via String()', async () => {
    const evaluator = new TestDataHandler();
    expect(await stringifyReplValue(evaluator, numberValue(3.5))).toBe('3.5');
  });

  test('INTEGER stringifies via String()', async () => {
    const evaluator = new TestDataHandler();
    const integer: TypedValue<DataType.INTEGER> = { type: DataType.INTEGER, value: BigInt(42) };
    expect(await stringifyReplValue(evaluator, integer)).toBe('42');
  });

  test('CONST_STRING is returned unchanged', async () => {
    const evaluator = new TestDataHandler();
    expect(await stringifyReplValue(evaluator, stringValue('hi'))).toBe('hi');
  });

  test('EMPTY_LIST stringifies as "null"', async () => {
    const evaluator = new TestDataHandler();
    expect(await stringifyReplValue(evaluator, emptyListValue())).toBe('null');
  });

  test('PAIR stringifies both members recursively, bracketed', async () => {
    const evaluator = new TestDataHandler();
    const pair = await evaluator.pair_make(numberValue(1), stringValue('two'));
    expect(await stringifyReplValue(evaluator, pair)).toBe('[1, two]');
  });

  test('nested PAIRs recurse all the way down', async () => {
    const evaluator = new TestDataHandler();
    const inner = await evaluator.pair_make(numberValue(2), emptyListValue());
    const outer = await evaluator.pair_make(numberValue(1), inner);
    expect(await stringifyReplValue(evaluator, outer)).toBe('[1, [2, null]]');
  });

  test('ARRAY stringifies each element in order, bracketed', async () => {
    const evaluator = new TestDataHandler();
    const array = await evaluator.array_make(DataType.NUMBER, 3, numberValue(0));
    await evaluator.array_set(array, 0, numberValue(1));
    await evaluator.array_set(array, 1, numberValue(2));
    await evaluator.array_set(array, 2, numberValue(3));
    expect(await stringifyReplValue(evaluator, array)).toBe('[1, 2, 3]');
  });

  test('an empty ARRAY stringifies as "[]"', async () => {
    const evaluator = new TestDataHandler();
    const array = await evaluator.array_make(DataType.NUMBER, 0, numberValue(0));
    expect(await stringifyReplValue(evaluator, array)).toBe('[]');
  });

  test('CLOSURE stringifies as a fixed placeholder, hiding the implementation', async () => {
    const evaluator = new TestDataHandler();
    const closure = await evaluator.closure_make(
      { args: [], returnType: DataType.VOID },
      async function* () { return voidValue(); }
    );
    expect(await stringifyReplValue(evaluator, closure)).toBe('<function>');
  });

  test('OPAQUE stringifies as a fixed placeholder', async () => {
    const evaluator = new TestDataHandler();
    const opaque = await evaluator.opaque_make({ some: 'internal state' });
    expect(await stringifyReplValue(evaluator, opaque)).toBe('<value>');
  });

  test('recursion is bounded on a self-referential PAIR, falling back to "..." rather than looping forever', async () => {
    const evaluator = new TestDataHandler();
    const pair = await evaluator.pair_make(numberValue(0), emptyListValue());
    // Point the pair's own tail back at itself - stringifyReplValue must not recurse forever.
    await evaluator.pair_settail(pair, pair);

    const result = await stringifyReplValue(evaluator, pair);
    expect(result).toContain('...');
  });
});
