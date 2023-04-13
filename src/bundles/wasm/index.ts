/**
 * WebAssembly Module for Source Academy, for developing with WebAssembly Text and Binaries.
 *
 * Examples:
 * Simple 'add' library:
 * ```wat
 * import {wcompile, wrun} from "wasm";
 *
 * const program = `
 * (module
 *     (func (param f64) (param f64) (result f64)
 *       local.get 0
 *       local.get 1
 *       f64.add)
 *     (export "add" (func 0))
 *   )
 * `;
 *
 *
 * const binary = wcompile(program);
 * const exports = wrun(binary);
 *
 * display(binary);
 * display_list(exports);
 *
 * const add_fn = head(tail(exports));
 *
 * display(add_fn(10, 35));
 * ```
 *
 * 'Calculator Language':
 * ```wat
 * // Type your program in here!
 * import {wcompile, wrun} from "wasm";
 *
 * const program = `
 * (module
 *     (func (param f64) (param f64) (result f64)
 *         local.get 0
 *         local.get 1
 *         f64.add)
 *     (func (param f64) (param f64) (result f64)
 *         local.get 0
 *         local.get 1
 *         f64.sub)
 *     (func (param f64) (param f64) (result f64)
 *         local.get 0
 *         local.get 1
 *         f64.mul)
 *     (func (param f64) (param f64) (result f64)
 *         local.get 0
 *         local.get 1
 *         f64.div)
 *     (export "add" (func 0))
 *     (export "sub" (func 1))
 *     (export "mul" (func 2))
 *     (export "div" (func 3))
 * )`;
 *
 *
 * const encoding = wcompile(program);
 * let exports = wrun(encoding);
 *
 * display_list(exports);
 *
 * const div = head(tail(exports));
 * exports = tail(tail(exports));
 * const mul = head(tail(exports));
 * exports = tail(tail(exports));
 * const sub = head(tail(exports));
 * exports = tail(tail(exports));
 * const add = head(tail(exports));
 *
 * display(div(10, -35));
 * display(mul(10, 12347));
 * display(sub(12347, 12347));
 * display(add(10, 0));
 * ```
 *
 *
 * @module wasm
 * @author Kim Yongbeom
 */
export {
  wcompile,
  wrun,
} from './wabt';
