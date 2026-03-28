import { describe, expect, it, vi } from 'vitest';
import { convertToTypedocPath } from '../typedoc.js';

vi.mock(import('path'), async importOriginal => {
  const { win32, posix } = await importOriginal();
  return {
    default: win32,
    posix,
  };
});

describe(convertToTypedocPath, () => {
  it('works with rooted windows paths', () => {
    expect(convertToTypedocPath('C:\\source\\source_academy\\modules')).toEqual('C:/source/source_academy/modules');
  });

  it('works with unrooted windows paths', () => {
    expect(convertToTypedocPath('source\\source_academy\\modules')).toEqual('source/source_academy/modules');
  });
});
