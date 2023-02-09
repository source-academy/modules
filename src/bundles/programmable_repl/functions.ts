/**
 * functions for Programmable REPL
 * @module programmable_repl
 * @author Wang Zihan
 */


import { context } from 'js-slang/moduleHelpers';
import { ProgrammableRepl } from './programmable_repl';
//import { runInContext, IOptions } from 'js-slang';
//import { sourceRunner } from 'js-slang';

const INSTANCE = new ProgrammableRepl();
context.moduleContexts.programmable_repl.state = INSTANCE;
/**
 * Setup the programmable REPL with given metacircular evaulator entrance function
 * @param {evalFunc} evalFunc - metacircular evaulator entrance function
 *
 * @category Main
 */
export function invoke_repl( evalFunc: Function ) {
  if (!(evalFunc instanceof Function)) {
    const typeName = typeof(evalFunc);
    //INSTANCE.OutputString('<span style=\'font-style:italic;\'>You know what? One day, a ' + typeName + ' told me that it has a dream of being evaulated as a function one day! Is its dream coming true today?</span>', 'cyan');//Small Easter Egg  :)
    throw new Error('Wrong parameter type "' + typeName + "' in function \"invoke_repl\". It supposed to be a function and it's the entrance function of your metacircular evaulator.");
  }
  INSTANCE.evalFunction = evalFunc;
  return {
    toReplString: () => '<Programmable REPL Initialized>',
  };
}


/**
 * Redirects the display message into Programmable REPL Tab and returns the string parameter
 * @param {content} the content you want to display
 *
 * @category Main
 */
export function module_display( content : any ) : any {
  INSTANCE.OutputString( content.toString() );//students may set the value of the parameter "str" to types other than a string (for example "module_display(1)" ). So here I need to first convert the parameter "str" into a string before preceding.
  return content;
}


/**
 * Set Programmable Repl editor background image with a customized image URL
 * @param {img_url} the url to the new background image
 * @param {background_color_alpha} the alpha (transparency) of the original background color that covers on your background image [0 ~ 1]. Recommended value is 0.5 .
 *
 * @category Main
 */
export function set_editor_background_image( img_url : string, background_color_alpha : number ) : void {
  INSTANCE.customizedEditorProps.backgroundImageUrl = img_url;
  INSTANCE.customizedEditorProps.backgroundColorAlpha = background_color_alpha;
}


/**
 * Set Programmable Repl editor font size
 * @param {font_size_px} font size (in pixel)
 *
 * @category Main
 */
export function set_editor_font_size(font_size_px : number){
  INSTANCE.customizedEditorProps.fontSize = parseInt( font_size_px.toString() );//The TypeScript type checker will throw an error as "parseInt" in TypeScript only accepts one string as parameter.
  //INSTANCE.setFontSize(parseInt( font_size_px.toString() ) ); //The TypeScript type checker will throw an error as "parseInt" in TypeScript only accepts one string as parameter.
}


/**
 * When use this function as the entrance function in the parameter of "invoke_repl", the Programmable Repl will directly use the default js-slang interpreter to run your program in Programmable Repl editor. Do not directly call this function in your own code.
 * @param {program} Do not directly set this parameter in your code.
 * @param {safeKey} A parameter that is designed to prevent student from directly calling this function in Source language.
 *
 * @category Main
 */
export function default_js_slang(program : string, safeKey : any) : any{
  //When the function is normally called by invoke_repl function, safeKey is set to "document.body", which has a type "Element".
  //Students can not create objects and use HTML Elements in Source due to limitations and rules in Source, so they can't set the safeKey to a HTML Element, thus they can't use this function in Source.
  if( ! ( safeKey instanceof Element ) ){
    throw new Error('Invaild Call: Function "default_js_slang" can not be directly called by user\'s code in editor. You should use it as the parameter of the function "invoke_repl"');
  }
  return INSTANCE.runInJsSlang(program);
}