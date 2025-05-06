// list.js: Supporting lists in the Scheme style, using pairs made
//          up of two-element JavaScript array (vector)

// Author: Martin Henz

// Note: this library is used in the externalLibs of cadet-frontend.
// It is distinct from the LISTS library of Source §2, which contains
// primitive and predeclared functions from Chapter 2 of SICP JS.

// The version of the list library in sound_fft contains a different
// implementation of vector_to_list, which is required for sound_fft
// to function.

// pair constructs a pair using a two-element array
// LOW-LEVEL FUNCTION, NOT SOURCE
export function pair(x, xs): [any, any] {
  return [x, xs];
}

// vector_to_list returns a list that contains the elements of the argument vector
// in the given order.
// vector_to_list throws an exception if the argument is not a vector
// LOW-LEVEL FUNCTION, NOT SOURCE
export function vector_to_list(vector) {
  let result: any = null;
  for (let i = vector.length - 1; i >= 0; i = i - 1) {
    result = pair(vector[i], result);
  }
  return result;
}
