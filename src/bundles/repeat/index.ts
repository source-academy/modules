/**
 * Test bundle for Source Academy modules repository
 * @author Loh Xian Ze, Bryan
 * @author Tang Xin Kye, Marcus
 */

/**
 * Repeats function n times
 *
 * @param f - function to be repeated
 * @param n - number of times to be repeated
 * @return a function repeated n times
 */
function repeat(f: Function, n: any): Function {
  return n === 0 ? (x: any) => x : (x: any) => f(repeat(f, n - 1)(x));
}

/**
 * Repeats function twice
 *
 * @param f - function to be repeated
 * @return a function repeated twice
 */
function twice(f: Function): Function {
  return repeat(f, 2);
}

/**
 * Repeats function thrice
 *
 * @param f - function to be repeated
 * @return a function repeated thrice
 */
function thrice(f: Function): Function {
  return repeat(f, 3);
}

// exported functions from the bundle
export default () => ({
  repeat,
  twice,
  thrice,
});
