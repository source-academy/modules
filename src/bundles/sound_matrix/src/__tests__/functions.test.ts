import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';
import { describe, expect, test } from 'vitest';

import { drainGenerator, matrixToConductorList } from '../functions';

/** Minimal IDataHandler mock - only pair_make/pair_head/pair_tail are exercised by these tests. */
class TestDataHandler {
  readonly hasDataInterface = true as const;
  private nextId = 1;
  private readonly pairs = new Map<number, { head: TypedValue<DataType>, tail: TypedValue<DataType> }>();

  pair_make(head: TypedValue<DataType>, tail: TypedValue<DataType>): Promise<TypedValue<DataType.PAIR>> {
    const id = this.nextId++;
    this.pairs.set(id, { head, tail });
    return Promise.resolve({ type: DataType.PAIR, value: id as never });
  }

  pair_head(p: TypedValue<DataType.PAIR>): Promise<TypedValue<DataType>> {
    return Promise.resolve(this.pairs.get(p.value as never)!.head);
  }

  pair_tail(p: TypedValue<DataType.PAIR>): Promise<TypedValue<DataType>> {
    return Promise.resolve(this.pairs.get(p.value as never)!.tail);
  }
}

function makeHandler(): IDataHandler {
  return new TestDataHandler() as unknown as IDataHandler;
}

/** Walks a Conductor list (of lists, or of booleans) back into a plain nested array. */
async function toPlain(evaluator: IDataHandler, value: TypedValue<DataType>): Promise<unknown> {
  if (value.type === DataType.EMPTY_LIST) {
    return [];
  }
  if (value.type === DataType.BOOLEAN) {
    return value.value;
  }
  if (value.type === DataType.PAIR) {
    const head = await evaluator.pair_head(value);
    const tail = await evaluator.pair_tail(value);
    const headPlain = head.type === DataType.PAIR || head.type === DataType.EMPTY_LIST
      ? await toPlain(evaluator, head)
      : head.value;
    return [headPlain, ...(await toPlain(evaluator, tail) as unknown[])];
  }
  throw new Error(`Unexpected DataType in test list: ${value.type}`);
}

describe(matrixToConductorList, () => {
  test('converts an empty matrix (no rows) to the empty list', async () => {
    const evaluator = makeHandler();
    const result = await matrixToConductorList(evaluator, []);
    expect(result.type).toBe(DataType.EMPTY_LIST);
  });

  test('converts a single row of booleans into a Source list', async () => {
    const evaluator = makeHandler();
    const result = await matrixToConductorList(evaluator, [[true, false, true]]);
    expect(await toPlain(evaluator, result)).toEqual([[true, false, true]]);
  });

  test('converts a full 16x16-shaped matrix, preserving row order and per-row order', async () => {
    const evaluator = makeHandler();
    const matrix = [
      [true, false],
      [false, false],
      [true, true]
    ];
    const result = await matrixToConductorList(evaluator, matrix);
    expect(await toPlain(evaluator, result)).toEqual(matrix);
  });

  test('a row of all false values round-trips correctly (not confused with an empty row)', async () => {
    const evaluator = makeHandler();
    const result = await matrixToConductorList(evaluator, [[false, false, false]]);
    expect(await toPlain(evaluator, result)).toEqual([[false, false, false]]);
  });
});

describe(drainGenerator, () => {
  async function* generatorReturning<T>(value: T, yields = 0): AsyncGenerator<void, T, undefined> {
    for (let i = 0; i < yields; i += 1) {
      yield;
    }
    return value;
  }

  test('resolves to the generator\'s final return value', async () => {
    await expect(drainGenerator(generatorReturning(42))).resolves.toBe(42);
  });

  test('drains through any number of intermediate yields before resolving', async () => {
    await expect(drainGenerator(generatorReturning('done', 5))).resolves.toBe('done');
  });
});
