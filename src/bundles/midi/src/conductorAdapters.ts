/**
 * Plain helpers used by the Conductor plugin in index.ts, kept in their own undecorated file so
 * they stay importable from vitest — a test file that imports index.ts directly hits a decorator
 * syntax error there (vitest's transform doesn't apply the same decorator settings tsc does).
 */
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';
import { mEmptyList } from '@sourceacademy/conductor/util';
import type { Scale } from './scales';

export async function scaleToConductorList(evaluator: IDataHandler, scale: Scale): Promise<TypedValue<DataType.LIST>> {
  if (scale === null) return mEmptyList();
  const [head, tail] = scale;
  return evaluator.pair_make({ type: DataType.NUMBER, value: head }, await scaleToConductorList(evaluator, tail));
}
