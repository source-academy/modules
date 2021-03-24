/**
 * Test bundle for Source Academy modules repository
 * @author Loh Xian Ze, Bryan
 * @author Tang Xin Kye, Marcus
 */

// eslint-disable-next-line no-underscore-dangle
function repeat(f: Function, n: any) {
  return n === 0 ? (x: any) => x : (x: any) => f(repeat(f, n - 1)(x));
}

function twice(f: any) {
  return repeat(f, 2);
}

function thrice(f: any) {
  return repeat(f, 3);
}

export default () => ({
  repeat,
  twice,
  thrice,
});
