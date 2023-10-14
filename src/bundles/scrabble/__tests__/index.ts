<<<<<<< HEAD
import { scrabble_array, scrabble_list } from '../functions';

function list_ref(list, n) {
  return n === 0 ? list[0] : list_ref(list[1], n - 1);
}

// Test functions

test('get the first word in the array', () => {
  expect(scrabble_array[0])
    .toBe('aardwolves');
});

test('get the first word in the list', () => {
  expect(list_ref(scrabble_list, 0))
    .toBe('aardwolves');
});
=======
import { scrabble_words } from '../functions';

// Test functions

test('get the word in the array at index 12', () => {
  expect(scrabble_words[12])
    .toBe('aardwolves');
});

>>>>>>> origin/master
