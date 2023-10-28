/**
 * Functions for Programmable REPL
 * @module repl
 * @author Wang Zihan
 */

import context from 'js-slang/context';
import { ProgrammableRepl } from './programmable_repl';

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
 * Redirects the display message into Programmable Repl Tab
 * If you give a pair as the parameter, it will use the given pair to generate rich text and use rich text display mode to display the string in Programmable Repl Tab with undefined return value (see module description for more information).
 * If you give other things as the parameter, it will simply display the toString value of the parameter in Programmable Repl Tab and returns the displayed string itself.
 * @param {content} the content you want to display
 *
 * @category Main
 */
export function module_display(content: any) : any {
  if (INSTANCE.richDisplayInternal(content) === 'not_rich_text_pair') {
    INSTANCE.pushOutputString(content.toString(), 'white', 'plaintext');// students may set the value of the parameter "str" to types other than a string (for example "module_display(1)" ). So here I need to first convert the parameter "str" into a string before preceding.
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
