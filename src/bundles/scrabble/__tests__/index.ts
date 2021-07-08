import { scrabble_array, scrabble_list } from '../functions';

function list_ref(list, n) {
  return n === 0 ? list[0] : list_ref(list[1], n - 1);
}

// Test functions

test('get the first word in the array', () => {
  expect(scrabble_array[0]).toBe('aa');
});

test('get the first word in the list', () => {
  expect(list_ref(scrabble_list, 0)).toBe('aa');
});
