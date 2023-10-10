import { scrabble_words } from '../functions';

// Test functions

test('get the word in the array at index 12', () => {
  expect(scrabble_words[12])
    .toBe('aardwolves');
});

