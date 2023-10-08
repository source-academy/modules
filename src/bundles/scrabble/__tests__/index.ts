import { scrabble_words } from '../functions';

// Test functions

test('get the first word in the array', () => {
  expect(scrabble_words[12])
    .toBe('aardwolves');
});

