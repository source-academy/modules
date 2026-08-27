import { resolve } from 'path';
import { expect } from 'vitest';

export const testMocksDir = resolve(import.meta.dirname, '../../../__test_mocks__');

export function expectError(obj: unknown): asserts obj is 'error' {
  expect(obj).toEqual('error');
}

export function expectWarn(obj: unknown): asserts obj is 'warn' {
  expect(obj).toEqual('warn');
}

export function expectSuccess(obj: unknown): asserts obj is 'success' {
  expect(obj).toEqual('success');
}
