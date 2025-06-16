import scrabble_words_raw from './words.json' with { type: 'json' };

/**
 * The `scrabble` Source Module provides the allowable
 * words in Scrabble in a list and in an array, according to
 * https://github.com/benjamincrom/scrabble/blob/master/scrabble/dictionary.json
 * @module scrabble
 */

/**
 * `scrabble_words` is an array of strings, each representing
 * an allowed word in Scrabble.
 */
export const scrabble_words = scrabble_words_raw;

/**
 * `scrabble_letters` is an array of arrays of strings. Each array
 * of strings represents an allowed word in Scrabble and contains
 * the letters of that word as single-character strings in the
 * order in which the letters appear in the word.
 */

export const scrabble_letters = scrabble_words.map((w) => w.split(''));

// Sample every 100 words to generate "tiny" dataset
export const scrabble_words_tiny = scrabble_words.filter((_, i) => i % 100 === 0);

export const scrabble_letters_tiny = scrabble_words_tiny.map((w) => w.split(''));
