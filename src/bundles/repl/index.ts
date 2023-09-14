/**
 * Bundle for Source Academy Programmable REPL module
 * @module repl
 * @author Wang Zihan
 */

/*

Example on usage:
  <*> Use with metacircular evaluator:

      import { set_evaluator, module_display } from "repl";

      const primitive_functions = list(
         ......
         list("display", module_display ), // Here change this from "display" to "module_display" to let the display result goes to the repl tab.
         ......
      }

      function parse_and_evaluate(code){
        (your metacircular evaluator entry function)
      }

      set_evaluator(parse_and_evaluate); // This can invoke the repl with your metacircular evaluator's evaluation entry

  =*=*=*=*=*= I'm the deluxe split line :) =*=*=*=*=*=

  <*> Use with Source Academy's builtin js-slang
      import { set_evaluator, default_js_slang, module_display } from "repl";  // Here you also need to import "module_display" along with "set_evaluator" and "default_js_slang".

      set_evaluator(default_js_slang); // This can invoke the repl with Source Academy's builtin js-slang evaluation entry

      (Note that you can't directly call "default_js_slang" in your own code. It should only be used as the parameter of "set_evaluator")

  =*=*=*=*=*= I'm the deluxe split line :) =*=*=*=*=*=

  <*> Customize Editor Appearance
      import { set_background_image, set_font_size } from "repl";
      set_background_image("https://www.some_image_website.xyz/your_favorite_image.png");  // Set the background image of the editor in repl tab
      set_font_size(20.5);  // Set the font size of the editor in repl tab

  =*=*=*=*=*= I'm the deluxe split line :) =*=*=*=*=*=

  <*> Rich Text Display
      first import { module_display } from "repl";
      Format: pair(pair("string",style),style)...

      Examples:
          module_display(pair(pair(pair(pair("Hello World","underline"),"italic"),"bold"),"gigantic"));
          module_display(pair(pair(pair(pair(pair(pair("Hello World","underline"),"italic"),"bold"),"gigantic"),"clrb#FF00B9"),"clrt#ff9700"));
          module_display(pair(pair(pair(pair(pair("Hello World","underline"),"italic"),"bold"),"gigantic"),"clrt#0ff1ed"));

      Coloring: "clrt" stands for text color, "clrb" stands for background color. The color string are in hexadecimal begin with "#" and followed by 6 hexadecimal digits.
        Example:  pair("123","clrt#ff0000") will produce a red "123";  pair("456","clrb#00ff00") will produce a green "456".
      Besides coloring, the following styles are also supported:
        bold: Make the text bold.
        italic: Make the text italic.
        small: Make the text in small size.
        medium: Make the text in medium size.
        large: Make the text in large size.
        gigantic: Make the text in very large size.
        underline: Underline the text.
      Note that if you apply the conflicting attributes together, only one conflicted style will take effect and other conflicting styles will be discarded, like  " pair(pair(pair("123",small),medium),large) "  (Set conflicting font size for the same text)
      Also note that for safety matters, certain words and characters are not allowed to appear under rich text display mode.
*/

export {
  set_evaluator,
  module_display,
  set_background_image,
  set_font_size,
} from './functions';

export * from './evaluators';
