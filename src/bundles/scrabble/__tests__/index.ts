import {
  scrabble_letters,
  scrabble_letters_tiny,
  scrabble_words,
  scrabble_words_tiny
} from '../functions';

// Test functions

test('get the word in the scrabble_words array at index 12', () => {
  expect(scrabble_words[12]).toBe('aardwolves');
});

test('get the word in the scrabble_letters array at index 100000', () => {
  expect(scrabble_letters[100000][0]).toBe('n');
});

test('scrabble_letters matches snapshot', () => {
  expect(scrabble_letters).toMatchSnapshot();
});

test('scrabble_words matches snapshot', () => {
  expect(scrabble_words).toMatchSnapshot();
});

test('scrabble_letters_tiny matches snapshot', () => {
  expect(scrabble_letters_tiny).toMatchSnapshot();
});

test('scrabble_words_tiny matches snapshot', () => {
  expect(scrabble_words_tiny).toMatchSnapshot();
});
