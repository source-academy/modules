/**
 * A single sentence summarising the module (this sentence is displayed larger).
 *
 * Sentences describing the module. More sentences about the module.
 *
 * @module module_name
 * @author Author Name
 * @author Author Name
 */

import {
  ModuleContexts,
  ModuleParams,
} from '../../../src/typings/type_helpers.js';

/**
 * Sample function. Increments a number by 1.
 *
 * @param x The number to be incremented.
 * @returns The incremented value of the number.
 */
function sample_function(x: number): number {
  return ++x;
}

//NOTE Remove the underscores before the parameter names if you will be using
// them. These parameters are passed in over on the frontend, and can later be
// accessed again in your module's tab via the DebuggerContext it gets passed
export default (
  _moduleParams: ModuleParams,
  _moduleContexts: ModuleContexts
) => ({
  sample_function,
});