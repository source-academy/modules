import __Params from '../../typings/__Params';

/**
 * <Brief description of the module>
 * @author <Author Name>
 * @author <Author Name>
 */

/**
 * Increment a number by a value of 1.
 * @param x the number to be incremented
 * @returns the incremented value of the number
 */
function sample_function(x: number) {
  return x + 1;
}

export default function (_params: __Params) {
  return {
    sample_function,
  };
}
