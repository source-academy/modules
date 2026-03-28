/**
 * Source Academy Programmable REPL module
 * @module repl
 * @author Wang Zihan
 */

import { InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
import { createContext, parseError, runInContext, type Context, type IOptions, type Result } from 'js-slang';
import { head, is_pair, tail } from 'js-slang/dist/stdlib/list';
import { stringify } from 'js-slang/dist/utils/stringify';
import { COLOR_ERROR_MESSAGE, COLOR_REPL_DISPLAY_DEFAULT, COLOR_RUN_CODE_RESULT, DEFAULT_EDITOR_HEIGHT } from './config';
import { evaluatorSymbol } from './functions';

export type RichDisplayContent = string | [RichDisplayContent, string];

type OutputStringMethods = 'plaintext' | 'richtext';

interface OutputStringEntry {
  content: string;
  outputMethod: OutputStringMethods;
  color: string;
}

interface CustomEditorProps {
  backgroundImageUrl: string | null;
  backgroundColorAlpha: number;
  fontSize: number;
}

/**
 * Returns the forbidden word present in the string "str" if it contains at least one unsafe word.
 * Returns "safe" if the string is considered to be safe to output directly into innerHTML.
 */
function xssStringCheck(str: string): string {
  const tmp = str.toLowerCase();
  const forbiddenWords = ['\\', '<', '>', 'script', 'javascript', 'eval', 'document', 'window', 'console', 'location'];
  for (const word of forbiddenWords) {
    if (tmp.indexOf(word) !== -1) {
      return word;
    }
  }
  return 'safe';
}

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
 * Checks if the given string is a valid hex color identifier
 */
function checkColorStringValidity(htmlColor: string) {
  return /#[0-9a-f]{6}/.test(htmlColor.toLowerCase());
}

export function processRichDisplayContent(pair_rich_text: RichDisplayContent, func_name: string): string {
  if (typeof pair_rich_text === 'string') {
    // There MUST be a safe check on users' strings, because users may insert something that can be interpreted as executable JavaScript code when outputing rich text.
    const safeCheckResult = xssStringCheck(pair_rich_text);
    if (safeCheckResult !== 'safe') {
      throw new Error(`${func_name}: For safety, the character/word ${safeCheckResult} is not allowed in rich text output. Please remove it or use plain text output mode and try again.`);
    }
    return `">${pair_rich_text}</span>`;
  }

  if (!is_pair(pair_rich_text)) {
    throw new InvalidParameterTypeError('pair or string', pair_rich_text, func_name);
  }

  const config_str = tail(pair_rich_text);
  if (typeof config_str !== 'string') {
    throw new Error(`${func_name}: The tail in style pair should always be a string, but got ${config_str}.`);
  }
  let style = '';
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
        throw new Error(`${func_name}: Unknown colour type "${config_str.substring(0, 4)}".`);
    }

    const colorHex = config_str.substring(4);

    if (!checkColorStringValidity(colorHex)) {
      throw new Error(`${func_name}: Invalid html colour string "${colorHex}". It should start with # and followed by 6 characters representing a hex number.`);
    }

    style = `${prefix}:${colorHex};`;
  } else {
    style = pairStyleToCssStyle[config_str];
    if (style === undefined) {
      throw new Error(`${func_name}: Found undefined style "${config_str}" while processing rich text.`);
    }
  }
  return style + processRichDisplayContent(head(pair_rich_text), func_name);
}

export class ProgrammableRepl {
  public evalFunction: ((code: string) => any) | null;
  public outputStrings: OutputStringEntry[];
  public tabRerenderer?: () => void;

  /**
   * Function to call when user code is updated **after** the editor
   * has been rendered
   */
  public updateUserCode?: (newCode: string) => void;

  /**
   * Code that gets displayed when the editor is first rendered. If this is not set, the editor
   * will try and load from `localStorage`.
   */
  public defaultCode?: string;

  // I store editorHeight value separately in here although it is already stored in the module's Tab React component state because I need to keep the editor height
  // when the Tab component is re-mounted due to the user drags the area between the module's Tab and Source Academy's original REPL to resize the module's Tab height.
  public editorHeight: number;

  public customizedEditorProps: CustomEditorProps = {
    backgroundImageUrl: null,
    backgroundColorAlpha: 1,
    fontSize: 17
  };

  constructor() {
    this.evalFunction = null;
    this.outputStrings = [];
    this.editorHeight = DEFAULT_EDITOR_HEIGHT;
  }

  InvokeREPL_Internal(evalFunc: (code: string) => any) {
    this.evalFunction = evalFunc;
  }

  async runCode(code: string, context: Context) {
    this.outputStrings = [];
    let retVal: any;

    if (this.evalFunction === null) {
      retVal = this.easterEggFunction();
    } else if (evaluatorSymbol in this.evalFunction) {
      const evalResult = await this.runInJsSlang(code, context);

      if (evalResult.status !== 'finished') {
        this.reRenderTab();
        return;
      }

      retVal = evalResult.value;
    } else {
      try {
        retVal = this.evalFunction(code);
      } catch (exception: any) {
        console.error(exception);
        this.pushOutputString(`Line ${exception.location.start.line.toString()}: ${exception.error?.message}`, COLOR_ERROR_MESSAGE);
        this.reRenderTab();
        return;
      }
    }

    // Here must use plain text output mode because retVal contains strings from the users.
    this.pushOutputString(typeof retVal === 'string' ? retVal: stringify(retVal), COLOR_RUN_CODE_RESULT);
    this.reRenderTab();
  }

  /**
   * Method for outputting to the REPL instance's own REPL output area.
   * Rich text output method allow output strings to have html tags and css styles.
   */
  pushOutputString(content: string, textColor: string, outputMethod: OutputStringMethods = 'plaintext') {
    const tmp = {
      content: content === undefined ? 'undefined' : content === null ? 'null' : content,
      color: textColor,
      outputMethod
    };
    this.outputStrings.push(tmp);
  }

  /*
    Directly invoking Source Academy's builtin js-slang runner.
    Needs hard-coded support from js-slang part for the "sourceRunner" function and "backupContext" property in the content object for this to work.
  */
  async runInJsSlang(code: string, context: Context): Promise<Result> {
    const options: Partial<IOptions> = {
      originalMaxExecTime: 1000,
      stepLimit: 1000,
      throwInfiniteLoops: true,
      useSubst: false
    };

    const evalContext = createContext(
      context.chapter,
      context.variant,
      context.languageOptions,
      context.externalSymbols,
      context.externalContext,
      {
        rawDisplay: value => {
          if (is_pair(value)) {
            try {
              // Try to decode the value as rich display content
              const result = processRichDisplayContent(value as any, 'display');
              const output = `<span style="${result}`;
              this.pushOutputString(output, '', 'richtext');
              return value;
            } catch {
            }
          }

          // If that fails just use regular stringify
          const output = typeof value === 'string' ? value : stringify(value);
          this.pushOutputString(output, COLOR_REPL_DISPLAY_DEFAULT, 'plaintext');
          return value;
        }
      }
    );

    evalContext.moduleContexts = context.moduleContexts;

    const evalResult = await runInContext(code, evalContext, options);
    if (evalResult.status === 'suspended-cse-eval') {
      throw new Error('This should not happen');
    }

    if (evalResult.status === 'error') {
      evalContext.errors.forEach(error => {
        console.error(error);

        const explainer = parseError([error]);
        this.pushOutputString(explainer, COLOR_ERROR_MESSAGE);
      });
    }
    return evalResult;
  }

  private reRenderTab() {
    this.tabRerenderer?.();
  }

  easterEggFunction() {
    this.pushOutputString('<br>', 'white', 'richtext');
    this.pushOutputString(
      'If you see this, please check whether you have called <span style=\'font-weight:bold;font-style:italic;\'>set_evaluator</span> function with the correct parameter before using the Programmable Repl Tab.',
      'yellow',
      'richtext'
    );
    return 'Easter Egg!';
  }
}
