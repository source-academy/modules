import { repeat, twice, thrice } from '../functions';

// Test functions
test('repeat works correctly and repeats function n times', () => {
  expect(repeat((x: number) => x + 1, 5)(1))
    .toBe(6);
});

test('twice works correctly and repeats function twice', () => {
  expect(twice((x: number) => x + 1)(1))
    .toBe(3);
});

test('thrice works correctly and repeats function thrice', () => {
  expect(thrice((x: number) => x + 1)(1))
    .toBe(4);
});
