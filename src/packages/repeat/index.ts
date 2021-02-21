import __Params from '../../typings/__Params';

function repeat(f: Function, n: any) {
  return n === 0 ? (x: any) => x : (x: any) => f(repeat(f, n - 1)(x));
}

function twice(f: any) {
  return repeat(f, 2);
}

function thrice(f: any) {
  return repeat(f, 3);
}

export default function (_params: __Params) {
  return {
    repeat,
    twice,
    thrice,
  };
}
