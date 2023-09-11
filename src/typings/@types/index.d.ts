import type { LocationInfo } from '../type_helpers';

declare global {
  /**
   * Variable that will be populated with the line and column information
   * at the time the surrounding function is called.
   *
   * Use with function declarations and expressions only, will not work
   * with arrow functions
   */
  const __CALL_LOCATION__: LocationInfo;
}
