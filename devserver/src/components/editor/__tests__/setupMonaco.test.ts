import * as monaco from 'monaco-editor';
import { describe, expect, test } from 'vitest';
import '../setupMonaco';

describe('Monaco setup', () => {
  test('registers the scheme language for Monaco', () => {
    expect(monaco.languages.getLanguages().some(language => language.id === 'scheme')).toBe(true);
  });
});
