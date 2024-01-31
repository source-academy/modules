/**
 * ## Example of usage:
 * ### Use with metacircular evaluator:
 * ```js
 * import { set_evaluator, repl_display } from "repl";
 *
 * const primitive_functions = list(
 *     // (omitted other primitive functions)
 *     list("display", repl_display), // Here change this from "display" to "repl_display" to let the display result goes to the repl tab.
 *     // (omitted other primitive functions)
 * }
 *
 * function parse_and_evaluate(code){
 *     // (your metacircular evaluator entry function)
 * }
 *
 * set_evaluator(parse_and_evaluate); // This can invoke the repl with your metacircular evaluator's evaluation entry
 * ```
 *
 * ### Use with Source Academy's builtin js-slang
 * ```js
 * import { set_evaluator, default_js_slang, repl_display } from "repl";  // Here you also need to import "repl_display" along with "set_evaluator" and "default_js_slang".
 *
 * set_evaluator(default_js_slang); // This can invoke the repl with Source Academy's builtin js-slang evaluation entry
 * ```
 *  (Note that you can't directly call "default_js_slang" in your own code. It should only be used as the parameter of "set_evaluator")
 *
 *
 * ### Customize Editor Appearance
 * ```js
 * import { set_background_image, set_font_size } from "repl";
 * set_background_image("https://www.some_image_website.xyz/your_favorite_image.png");  // Set the background image of the editor in repl tab
 * set_font_size(20.5);  // Set the font size of the editor in repl tab
 * ```
 *
 * @module repl
 * @author Wang Zihan
*/

export {
  set_evaluator,
  repl_display,
  set_background_image,
  set_font_size,
  default_js_slang,
} from './functions';
