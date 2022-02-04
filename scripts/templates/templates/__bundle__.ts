// Un-comment the next line if your bundle requires the use of variables
// declared in frontend or js-slang.
// import __Params from '../../typings/__Params';

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

// Un-comment the next line if your bundle requires the use of variables
// declared in frontend or js-slang.
// export default (_params: __Params) => ({
export default () => ({
  sample_function,
});
