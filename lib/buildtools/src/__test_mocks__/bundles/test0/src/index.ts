/**
 * This is a mocked module used for testing the buildtools
 * @module test0
*/
import context from 'js-slang/context';

/**
 * This is just some test function
 * @param _param0 Test parameter
 * @returns Zero
 */
export function test_function(_param0: string) {
  return 0;
}

/**
 * @internal
 */
export function test_function2() {
  return context.moduleContexts.test0.state.data;
}
