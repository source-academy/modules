import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import { TestDataHandler } from '@sourceacademy/modules-testplugin';
import { list, type List } from 'js-slang/dist/stdlib/list';
import { describe, expect, it } from 'vitest';
import { assertAccidental, scaleToConductorList } from '../conductorAdapters';

describe(scaleToConductorList, () => {
  it('converts an empty js-slang list to a Conductor empty list', async () => {
    const handler = new TestDataHandler();
    const result = await scaleToConductorList(handler, null);
    expect(result.type).toEqual(DataType.EMPTY_LIST);
  });

  it('converts a js-slang list of numbers into a real Conductor list', async () => {
    const handler = new TestDataHandler();
    const jsList: List = list(12, 14, 16);
    const conductorList = await scaleToConductorList(handler, jsList);
    const values = await handler.list_to_vec(conductorList as TypedValue<DataType.LIST>);
    expect(values.map(v => v.value)).toEqual([12, 14, 16]);
  });
});

describe(assertAccidental, () => {
  it('accepts "flat" and "sharp"', () => {
    expect(() => assertAccidental('flat', 'test')).not.toThrow();
    expect(() => assertAccidental('sharp', 'test')).not.toThrow();
  });

  it('rejects anything else', () => {
    expect(() => assertAccidental('natural', 'my_func')).toThrowError("my_func expects 'flat' or 'sharp'");
  });
});

describe('exported constants shape', () => {
  it('SHARP/FLAT/NATURAL are single-character strings', async () => {
    const { SHARP, FLAT, NATURAL } = await import('../functions');
    expect(SHARP).toEqual('#');
    expect(FLAT).toEqual('b');
    expect(NATURAL).toEqual('♮');
  });
});
