import { TestDataHandler } from '@sourceacademy/modules-testplugin';
import { expect, test } from 'vitest';
import {
  scrabble_letters,
  scrabble_letters_tiny,
  scrabble_words,
  scrabble_words_tiny
} from '../functions';
import ScrabbleModulePlugin from '../index';

// Test functions

test('get the word in the scrabble_words array at index 12', () => {
  expect(scrabble_words[12])
    .toBe('aardwolves');
});

test('get the word in the scrabble_letters array at index 100000', () => {
  expect(scrabble_letters[100000][0])
    .toBe('n');
});

// scrabble_words/scrabble_letters cover the full 172,820-word dictionary. Snapshotting them
// produces a multi-million-line .snap file and hangs vitest's snapshot serializer; the index
// spot-checks above already cover the full arrays cheaply. Only the ~1,728-entry _tiny variants
// get snapshotted.

test('scrabble_letters_tiny matches snapshot', () => {
  expect(scrabble_letters_tiny)
    .toMatchSnapshot();
});

test('scrabble_words_tiny matches snapshot', () => {
  expect(scrabble_words_tiny)
    .toMatchSnapshot();
});

// Test plugin

test('initialise exposes all four word lists as opaque values', async () => {
  const handler = new TestDataHandler();
  const plugin = new ScrabbleModulePlugin({} as any, [], handler);
  await plugin.initialise();

  expect(plugin.exports.map((e) => e.symbol)).toEqual([
    'scrabble_words',
    'scrabble_letters',
    'scrabble_words_tiny',
    'scrabble_letters_tiny'
  ]);

  const [words, letters, wordsTiny, lettersTiny] = await Promise.all(
    plugin.exports.map((e) => handler.opaque_get(e.value as any))
  );
  expect(words).toBe(scrabble_words);
  expect(letters).toBe(scrabble_letters);
  expect(wordsTiny).toBe(scrabble_words_tiny);
  expect(lettersTiny).toBe(scrabble_letters_tiny);
});
