/**
 * @author Samyukta Sounderraman
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

export default function sound_matrix() {
  return {
    ToneMatrix,
    get_matrix,
    clear_matrix,
    set_timeout,
    clear_all_timeout,
  };
}
