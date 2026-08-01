/**
 * Rich-text formatting for `rich_repl_display`. Ported from the pre-Conductor
 * `processRichDisplayContent` (previously in programmable_repl.ts) - the pure string/CSS logic is
 * unchanged, but pair traversal now goes through IDataHandler's `pair_head`/`pair_tail` instead of
 * js-slang's `is_pair`/`head`/`tail`, since js-slang imports resolve to `undefined` at runtime for
 * a Conductor bundle (see index.ts's module doc comment).
 * @module repl
 */
import { EvaluatorParameterTypeError, EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';

const pairStyleToCssStyle: { [pairStyle: string]: string } = {
  bold: 'font-weight:bold;',
  italic: 'font-style:italic;',
  small: 'font-size: 14px;',
  medium: 'font-size: 20px;',
  large: 'font-size: 25px;',
  gigantic: 'font-size: 50px;',
  underline: 'text-decoration: underline;'
};

/**
 * Returns the forbidden word present in the string "str" if it contains at least one unsafe word.
 * Returns "safe" if the string is considered to be safe to output directly into innerHTML.
 */
export function xssStringCheck(str: string): string {
  const tmp = str.toLowerCase();
  const forbiddenWords = ['\\', '<', '>', 'script', 'javascript', 'eval', 'document', 'window', 'console', 'location'];
  for (const word of forbiddenWords) {
    if (tmp.indexOf(word) !== -1) {
      return word;
    }
  }
  return 'safe';
}

/**
 * Checks if the given string is a valid hex color identifier
 */
export function checkColorStringValidity(htmlColor: string): boolean {
  return /#[0-9a-f]{6}/u.test(htmlColor.toLowerCase());
}

/**
 * Recursively turns a `pair(pair(pair("text", style1), style2), style3)`-shaped Source value into
 * an HTML `<span style="...">` fragment. `value` is either a CONST_STRING (the base text) or a
 * PAIR whose tail names a style/colour and whose head is itself processed the same way.
 */
export async function processRichDisplayContent(
  evaluator: IDataHandler,
  value: TypedValue<DataType>,
  func_name: string
): Promise<string> {
  if (value.type === DataType.CONST_STRING) {
    // There MUST be a safe check on users' strings, because users may insert something that can be interpreted as executable JavaScript code when outputing rich text.
    const safeCheckResult = xssStringCheck(value.value);
    if (safeCheckResult !== 'safe') {
      throw new EvaluatorRuntimeError(`${func_name}: For safety, the character/word ${safeCheckResult} is not allowed in rich text output. Please remove it or use plain text output mode and try again.`);
    }
    return `">${value.value}</span>`;
  }

  if (value.type !== DataType.PAIR) {
    throw new EvaluatorParameterTypeError(func_name, undefined, 'pair or string', DataType[value.type]);
  }

  const pair = value as TypedValue<DataType.PAIR>;
  const head = await evaluator.pair_head(pair);
  const tail = await evaluator.pair_tail(pair);

  if (tail.type !== DataType.CONST_STRING) {
    throw new EvaluatorRuntimeError(`${func_name}: The tail in style pair should always be a string, but got ${DataType[tail.type]}.`);
  }
  const config_str = tail.value;

  let style: string;
  if (config_str.substring(0, 3) === 'clr') {
    let prefix: string;
    switch (config_str[3]) {
      case 't': {
        prefix = 'color';
        break;
      }
      case 'b': {
        prefix = 'background-color';
        break;
      }
      default:
        throw new EvaluatorRuntimeError(`${func_name}: Unknown colour type "${config_str.substring(0, 4)}".`);
    }

    const colorHex = config_str.substring(4);

    if (!checkColorStringValidity(colorHex)) {
      throw new EvaluatorRuntimeError(`${func_name}: Invalid html colour string "${colorHex}". It should start with # and followed by 6 characters representing a hex number.`);
    }

    style = `${prefix}:${colorHex};`;
  } else {
    const namedStyle = pairStyleToCssStyle[config_str];
    if (namedStyle === undefined) {
      throw new EvaluatorRuntimeError(`${func_name}: Found undefined style "${config_str}" while processing rich text.`);
    }
    style = namedStyle;
  }
  return style + await processRichDisplayContent(evaluator, head, func_name);
}
