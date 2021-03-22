/**
 * Test bundle for Source Academy modules repository
 * @author Loh Xian Ze, Bryan
 * @author Tang Xin Kye, Marcus
 */

// eslint-disable-next-line no-underscore-dangle
function _repeat(f: Function, n: any) {
  return n === 0 ? (x: any) => x : (x: any) => f(_repeat(f, n - 1)(x));
}

function twice(f: any) {
  return _repeat(f, 2);
}

function thrice(f: any) {
  return _repeat(f, 3);
}

export default function repeat() {
  return {
    repeat: _repeat,
    twice,
    thrice,
  };
}
