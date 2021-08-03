// Un-comment the next line if your bundle requires the use of variables
// declared in cadet-frontend or js-slang.
// import __Params from '../../typings/__Params';

/**
 * <Brief description of the module>
 * @author Samyukta Sounderraman
 * @author <Author Name>
 */

/**
 * Imported functions
 */
import {
  // Constructor/Accessors/Typecheck
  ToneMatrix,
  get_matrix,
  clear_matrix,
  set_timeout,
  clear_all_timeout,
} from './functions';

// Un-comment the next line if your bundle requires the use of variables
// declared in cadet-frontend or js-slang.
// export default (_params: __Params) => ({
export default function sound_matrix() {
  return {
    ToneMatrix,
    get_matrix,
    clear_matrix,
    set_timeout,
    clear_all_timeout,
  };
}
