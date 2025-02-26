import { pair, list, vector_to_list } from './list';
/* eslint-disable import/prefer-default-export */

/**
 * Mocks a function `fun`.
 * @param fun The function to mock.
 * @returns A pair whose head is the mocked function, and whose tail is another
 * function that returns a list with details about the mocked function.
 */
export function mock_fn(fun: any) {
  function details(count, retvals, arglist) {
    return list(
      'times called',
      count,
      'Return values',
      retvals,
      'Arguments',
      arglist
    );
  }
  let count = 0;
  let retvals: any = null;
  let arglist: any = null;
  function fn(...args) {
    count += 1;
    const retval = fun.apply(fun, args);
    retvals = pair(retval, retvals);
    arglist = pair(vector_to_list(args), arglist);
    return retval;
  }
  return pair(fn, () => details(count, retvals, arglist));
}
