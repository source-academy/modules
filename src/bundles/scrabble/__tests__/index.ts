import { scrabble_words, scrabble_letters } from '../functions';

// Test functions

test('get the word in the scrabble_words array at index 12', () => {
  expect(scrabble_words[12])
    .toBe('aardwolves');
});

test('get the word in the scrabble_letters array at index 100000', () => {
  expect(scrabble_letters[100000][0])
    .toBe('n');
});

