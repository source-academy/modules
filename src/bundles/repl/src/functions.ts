/**
 * Functions for Programmable REPL
 * @module repl
 * @author Wang Zihan
 */

import { GeneralRuntimeError, InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
import { assertFunctionOfLength, assertNumberWithinRange } from '@sourceacademy/modules-lib/utilities';
import context from 'js-slang/context';
import type { Value } from 'js-slang/dist/types';
import { stringify } from 'js-slang/dist/utils/stringify';
import { COLOR_REPL_DISPLAY_DEFAULT } from './config';
import { ProgrammableRepl, processRichDisplayContent, type RichDisplayContent } from './programmable_repl';

/* Exported for testing */
export const INSTANCE = new ProgrammableRepl();
context.moduleContexts.repl.state = INSTANCE;

/**
 * Setup the programmable REPL with given evaulator's entrance function
 *
 * The function should take one parameter as the code from the module's editor, for example:
 * ```js
 * function parse_and_evaluate(code) {
 *   // ...
 * }
 * ```
 * @param evalFunc - evaulator entrance function
 *
 * @category Main
 */
export function set_evaluator(evalFunc: (code: string) => any) {
  assertFunctionOfLength(evalFunc, 1, set_evaluator.name);

  INSTANCE.evalFunction = evalFunc;
  return {
    toReplString: () => '<Programmable Repl Initialized>'
  };
}

/**
 * Display message in Programmable Repl Tab
 * If given a pair as the parameter, it will use the given pair to generate rich text and use rich text display mode to display
 * the string in Programmable Repl Tab
 *
 * **Rich Text Display**
 *  - First you need to `import { rich_repl_display } from "repl";`
 *  - Format: pair(pair("string",style),style)...
 *  - Examples:
 *
 * ```js
 * // A large italic underlined "Hello World"
 * rich_repl_display(pair(pair(pair(pair("Hello World", "underline"), "italic"), "bold"), "gigantic"));
 *
 * // A large italic underlined "Hello World" in blue
 * rich_repl_display(pair(pair(pair(pair(pair("Hello World", "underline"),"italic"), "bold"), "gigantic"), "clrt#0000ff"));
 *
 * // A large italic underlined "Hello World" with orange foreground and purple background
 * rich_repl_display(pair(pair(pair(pair(pair(pair("Hello World", "underline"), "italic"), "bold"), "gigantic"), "clrb#A000A0"),"clrt#ff9700"));
 * ```
 * To display rich text from within REPL code, you should use the `raw_display` function instead:
 *
 * ```js
 * raw_display(pair("Hello World", "gigantic"));
 * ```
 *
 * If the content you provided isn't valid as rich text, then it will be treated as a regular object and displayed as regular text.
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
 * @param content the content you want to display
 * @category Main
 */
export function rich_repl_display(content: RichDisplayContent): RichDisplayContent {
  const result = processRichDisplayContent(content, rich_repl_display.name);
  const output = `<span style="${result}`;
  INSTANCE.pushOutputString(output, '', 'richtext');
  return content;
}

/**
 * Functions as the regular `display` function does, writing the given output to the REPL in tab. This function won't try to
 * decode rich text pairs. For that, use {@link rich_repl_display}.
 *
 * To display content from directly within REPL code, you can use `display` directly.
 *
 * @category Main
 */
export function repl_display(content: Value): Value {
  const stringified = typeof content === 'string' ? content : stringify(content);
  INSTANCE.pushOutputString(stringified, COLOR_REPL_DISPLAY_DEFAULT, 'plaintext');
  return content;
}

/**
 * Set Programmable Repl editor background image with a customized image URL
 * @param img_url the url to the new background image
 * @param background_color_alpha the alpha (transparency) of the original background color that covers on your background image [0, 1]. Recommended value is 0.5 .
 *
 * @category Main
 */
export function set_background_image(img_url: string, background_color_alpha: number): void {
  assertNumberWithinRange(background_color_alpha, set_background_image.name, 0, 1, false, 'background_color_alpha');

  if (typeof img_url !== 'string') {
    throw new InvalidParameterTypeError('string', img_url, set_background_image.name, 'img_url');
  }

  INSTANCE.customizedEditorProps.backgroundImageUrl = img_url;
  INSTANCE.customizedEditorProps.backgroundColorAlpha = background_color_alpha;
}

/**
 * Set Programmable Repl editor font size
 * @param font_size_px font size (in pixels)
 * @category Main
 */
export function set_font_size(font_size_px: number) {
  assertNumberWithinRange(font_size_px, set_font_size.name, 0);
  INSTANCE.customizedEditorProps.fontSize = font_size_px;
}

/**
 * Set program text in the Repl editor to the given string
 * @category Main
 */
export function set_program_text(text: string) {
  if (typeof text !== 'string') {
    throw new InvalidParameterTypeError('string', text, set_program_text.name);
  }

  if (INSTANCE.updateUserCode) {
    INSTANCE.updateUserCode(text);
  } else {
    INSTANCE.defaultCode = text;
  }
}

/**
 * Unique symbol that the {@link default_js_slang} evaluator carries to allow it to be
 * distinguished from other evaluator functions.
 * @hidden
 */
export const evaluatorSymbol = Symbol('repl/js-slang');

/**
 * When use this function as the entrance function in the parameter of "set_evaluator", the Programmable Repl will directly use the default
 * js-slang interpreter to run your program in Programmable Repl editor. Do not directly call this function in your own code.
 * @category Main
 */
export function default_js_slang(_program: string): any {
  /*
    This needs to be an actual function since it needs to behave like an actual
    evaluator as far as cadets are concerned. But js-slang evaluates to a promise
    and thus needs to be handled differently from user evaluators.

    This function carries the evaluator symbol to allow it to be distinguished from other
    evaluator functions.
  */
  throw new GeneralRuntimeError('default_js_slang: Cannot be directly. You should use it as the parameter of the function "set_evaluator"');
}

default_js_slang[evaluatorSymbol] = true;
