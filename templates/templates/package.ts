/**
 * <Insert description of module here>
 * @author <Insert your name here>
 */

/**
 * Remove the next line if your module does not require input parameters from
 * Cadet-Frontend or JS-Slang
 */
import __Params from '../../typings/__Params';

/**
 * <Insert description of function here>
 * @param parameter - <Insert description of paramtere here>
 */
function example_function(parameter: string) {
  return null;
}

/**
 * A function is exported for JS-Slang library to consume.
 */
export default function (__params: __Params) {
  return {
    example_function,
  };
}
