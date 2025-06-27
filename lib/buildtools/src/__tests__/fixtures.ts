import { resolve } from 'path';
import { expect } from 'vitest';

export const testMocksDir = resolve(import.meta.dirname, '..', '__test_mocks__');

export function expectIsSuccess(value: string): asserts value is 'success' {
  expect(value).toEqual('success');
}

export function expectIsError(severity: string): asserts severity is 'error' {
  expect(severity).toEqual('error');
}
