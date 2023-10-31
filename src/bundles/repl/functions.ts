/**
 * Functions for Programmable REPL
 * @module repl
 * @author Wang Zihan
 */

import context from 'js-slang/context';
import { ProgrammableRepl } from './programmable_repl';
import { COLOR_REPL_DISPLAY_DEFAULT } from './config';

const INSTANCE = new ProgrammableRepl();
context.moduleContexts.repl.state = INSTANCE;
/**
 * Setup the programmable REPL with given metacircular evaulator entrance function
 * @param {evalFunc} evalFunc - metacircular evaulator entrance function
 *
 * @category Main
 */
export function set_evaluator(evalFunc: Function) {
  if (!(evalFunc instanceof Function)) {
    const typeName = typeof (evalFunc);
    throw new Error(`Wrong parameter type "${typeName}' in function "set_evaluator". It supposed to be a function and it's the entrance function of your metacircular evaulator.`);
  }
  INSTANCE.evalFunction = evalFunc;
  return {
    toReplString: () => '<Programmable Repl Initialized>',
  };
}


/**
 * Display message in Programmable Repl Tab
 * If you give a pair as the parameter, it will use the given pair to generate rich text and use rich text display mode to display the string in Programmable Repl Tab with undefined return value (see module description for more information).
 * If you give other things as the parameter, it will simply display the toString value of the parameter in Programmable Repl Tab and returns the displayed string itself.
 *
 * **Rich Text Display**
 *  - First you need to `import { repl_display } from "repl";`
 *  - Format: pair(pair("string",style),style)...
 *  - Examples:
 *
 * ```js
 * // A large italic underlined "Hello World"
 * repl_display(pair(pair(pair(pair("Hello World", "underline"), "italic"), "bold"), "gigantic"));
 *
 * // A large italic underlined "Hello World" in blue
 * repl_display(pair(pair(pair(pair(pair("Hello World", "underline"),"italic"), "bold"), "gigantic"), "clrt#0000ff"));
 *
 * // A large italic underlined "Hello World" with orange foreground and purple background
 * repl_display(pair(pair(pair(pair(pair(pair("Hello World", "underline"), "italic"), "bold"), "gigantic"), "clrb#A000A0"),"clrt#ff9700"));
 * ```
 *
 *  - Coloring:
 *    - `clrt` stands for text color, `clrb` stands for background color. The color string are in hexadecimal begin with "#" and followed by 6 hexadecimal digits.
 *    - Example:  `pair("123","clrt#ff0000")` will produce a red "123";  `pair("456","clrb#00ff00")` will produce a green "456".
 *  - Besides coloring, the following styles are also supported:
 *    - `bold`: Make the text bold.
 *    - `italic`: Make the text italic.
 *    - `small`: Make the text in small size.
 *    - `medium`: Make the text in medium size.
 *    - `large`: Make the text in large size.
 *    - `gigantic`: Make the text in very large size.
 *    - `underline`: Underline the text.
 *  - Note that if you apply the conflicting attributes together, only one conflicted style will take effect and other conflicting styles will be discarded, like  "pair(pair(pair("123", small), medium), large) "  (Set conflicting font size for the same text)
 *  - Also note that for safety matters, certain words and characters are not allowed to appear under rich text display mode.
 *
 * @param {content} the content you want to display
 * @category Main
 */
export function repl_display(content: any) : any {
  if (INSTANCE.richDisplayInternal(content) === 'not_rich_text_pair') {
    INSTANCE.pushOutputString(content.toString(), COLOR_REPL_DISPLAY_DEFAULT, 'plaintext');// students may set the value of the parameter "str" to types other than a string (for example "repl_display(1)" ). So here I need to first convert the parameter "str" into a string before preceding.
    return content;
  }
  return undefined;
}


/**
 * Set Programmable Repl editor background image with a customized image URL
 * @param {img_url} the url to the new background image
 * @param {background_color_alpha} the alpha (transparency) of the original background color that covers on your background image [0 ~ 1]. Recommended value is 0.5 .
 *
 * @category Main
 */
export function set_background_image(img_url: string, background_color_alpha: number) : void {
  INSTANCE.customizedEditorProps.backgroundImageUrl = img_url;
  INSTANCE.customizedEditorProps.backgroundColorAlpha = background_color_alpha;
}


/**
 * Set Programmable Repl editor font size
 * @param {font_size_px} font size (in pixel)
 *
 * @category Main
 */
export function set_font_size(font_size_px: number) {
  INSTANCE.customizedEditorProps.fontSize = parseInt(font_size_px.toString());// The TypeScript type checker will throw an error as "parseInt" in TypeScript only accepts one string as parameter.
}

/**
 * When use this function as the entrance function in the parameter of "set_evaluator", the Programmable Repl will directly use the default js-slang interpreter to run your program in Programmable Repl editor. Do not directly call this function in your own code.
 * @param {program} Do not directly set this parameter in your code.
 * @param {safeKey} A parameter that is designed to prevent student from directly calling this function in Source language.
 *
 * @category Main
 */
export function default_js_slang(_program: string) : any {
  throw new Error('Invaild Call: Function "default_js_slang" can not be directly called by user\'s code in editor. You should use it as the parameter of the function "set_evaluator"');
  // When the function is normally called by set_evaluator function, safeKey is set to "document.body", which has a type "Element".
  // Students can not create objects and use HTML Elements in Source due to limitations and rules in Source, so they can't set the safeKey to a HTML Element, thus they can't use this function in Source.
}
