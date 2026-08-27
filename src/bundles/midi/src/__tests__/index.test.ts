import { DataType } from '@sourceacademy/conductor/types';
import { TestDataHandler } from '@sourceacademy/modules-testplugin';
import { describe, expect, it } from 'vitest';
import { scaleToConductorList } from '../conductorAdapters';
import type { Scale } from '../scales';

describe(scaleToConductorList, () => {
  it('converts an empty scale to a Conductor empty list', async () => {
    const handler = new TestDataHandler();
    const result = await scaleToConductorList(handler, null);
    expect(result.type).toEqual(DataType.EMPTY_LIST);
  });

  it('converts a scale of MIDI notes into a real Conductor list', async () => {
    const handler = new TestDataHandler();
    const scale: Scale = [12, [14, [16, null]]];
    const conductorList = await scaleToConductorList(handler, scale);
    const values = await handler.list_to_vec(conductorList);
    expect(values.map(v => v.value)).toEqual([12, 14, 16]);
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
