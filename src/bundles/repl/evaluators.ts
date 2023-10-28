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
