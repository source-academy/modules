/**
 * Source Academy Programmable REPL module
 * @module repl
 * @author Wang Zihan
 */

import context from 'js-slang/context';
import { default_js_slang } from './evaluators';
import { runFilesInContext, type IOptions } from 'js-slang';

export class ProgrammableRepl {
  public evalFunction: Function;
  public userCodeInEditor: string;
  public outputStrings: any[];
  private _editorInstance;
  private _tabReactComponent: any;

  public customizedEditorProps = {
    backgroundImageUrl: 'no-background-image',
    backgroundColorAlpha: 1,
    fontSize: 17,
  };

  constructor() {
    this.evalFunction = (_placeholder) => this.easterEggFunction();
    this.userCodeInEditor = this.getSavedEditorContent();
    this.outputStrings = [];
    this._editorInstance = null;// To be set when calling "SetEditorInstance" in the ProgrammableRepl Tab React Component render function.
    developmentLog(this);
  }

  InvokeREPL_Internal(evalFunc: Function) {
    this.evalFunction = evalFunc;
  }

  runCode() {
    this.outputStrings = [];
    let retVal: any;
    try {
      if (Object.is(this.evalFunction, default_js_slang)) {
        retVal = this.runInJsSlang(this.userCodeInEditor);
      } else {
        retVal = this.evalFunction(this.userCodeInEditor);
      }
    } catch (exception: any) {
      console.log(exception);
      this.pushOutputString(`Line ${exception.location.start.line.toString()}: ${exception.error.message}`, 'red');
      this.reRenderTab();
      return;
    }
    if (retVal === undefined) {
      this.pushOutputString('Program exit with undefined return value.', 'cyan');
    } else {
      if (typeof (retVal) === 'string') {
        retVal = `"${retVal}"`;
      }
      // Here must use plain text output mode because retVal contains strings from the users.
      this.pushOutputString(`Program exit with return value ${retVal}`, 'cyan');
    }
    this.reRenderTab();
    developmentLog('RunCode finished');
  }

  updateUserCode(code) {
    this.userCodeInEditor = code;
  }

  // Rich text output method allow output strings to have html tags and css styles.
  pushOutputString(content : string, textColor : string, outputMethod : string = 'plaintext') {
    let tmp = {
      content,
      color: textColor,
      outputMethod,
    };
    this.outputStrings.push(tmp);
  }

  setEditorInstance(instance: any) {
    if (instance === undefined) return; // It seems that when calling this function in gui->render->ref, the React internal calls this function for multiple times (at least two times) , and in at least one call the parameter 'instance' is set to 'undefined'. If I don't add this if statement, the program will throw a runtime error when rendering tab.
    this._editorInstance = instance;
    this._editorInstance.on('guttermousedown', (e) => {
      const breakpointLine = e.getDocumentPosition().row;
      developmentLog(breakpointLine);
    });

    this._editorInstance.setOptions({ fontSize: `${this.customizedEditorProps.fontSize.toString()}pt` });
  }

  richDisplayInternal(pair_rich_text) {
    developmentLog(pair_rich_text);
    const head = (pair) => pair[0];
    const tail = (pair) => pair[1];
    const is_pair = (obj) => obj instanceof Array && obj.length === 2;
    if (!is_pair(pair_rich_text)) return 'not_rich_text_pair';
    function checkColorStringValidity(htmlColor:string) {
      if (htmlColor.length !== 7) return false;
      if (htmlColor[0] !== '#') return false;
      for (let i = 1; i < 7; i++) {
        const char = htmlColor[i];
        developmentLog(`   ${char}`);
        if (!((char >= '0' && char <= '9') || (char >= 'A' && char <= 'F') || (char >= 'a' && char <= 'f'))) {
          return false;
        }
      }
      return true;
    }
    function recursiveHelper(thisInstance, param): string {
      if (typeof (param) === 'string') {
        // There MUST be a safe check on users' strings, because users may insert something that can be interpreted as executable JavaScript code when outputing rich text.
        const safeCheckResult = thisInstance.userStringSafeCheck(param);
        if (safeCheckResult !== 'safe') {
          throw new Error(`For safety matters, the character/word ${safeCheckResult} is not allowed in rich text output. Please remove it or use plain text output mode and try again.`);
        }
        developmentLog(head(param));
        return `">${param}</span>`;
        // return param;
      }
      if (!is_pair(param)) {
        throw new Error(`Unexpected data type ${typeof (param)} when processing rich text. It should be a pair.`);
      } else {
        const pairStyleToCssStyle : { [pairStyle : string] : string } = {
          bold: 'font-weight:bold;',
          italic: 'font-style:italic;',
          small: 'font-size: 14px;',
          medium: 'font-size: 20px;',
          large: 'font-size: 25px;',
          gigantic: 'font-size: 50px;',
          underline: 'text-decoration: underline;',
        };
        if (typeof (tail(param)) !== 'string') {
          throw new Error(`The tail in style pair should always be a string, but got ${typeof (tail(param))}.`);
        }
        let style = '';
        if (tail(param)
          .substring(0, 3) === 'clr') {
          let prefix = '';
          if (tail(param)[3] === 't') prefix = 'color:';
          else if (tail(param)[3] === 'b') prefix = 'background-color:';
          else throw new Error('Error when decoding rich text color data');
          const colorHex = tail(param)
            .substring(4);
          if (!checkColorStringValidity(colorHex)) {
            throw new Error(`Invalid html color string ${colorHex}. It should start with # and followed by 6 characters representing a hex number.`);
          }
          style = `${prefix + colorHex};`;
        } else {
          style = pairStyleToCssStyle[tail(param)];
          if (style === undefined) {
            throw new Error(`Found undefined style ${tail(param)} during processing rich text.`);
          }
        }
        // return `<span style = "${style}">${recursiveHelper(thisInstance, head(param))}</span>`;
        return style + recursiveHelper(thisInstance, head(param));
      }
    }
    this.pushOutputString(`<span style="${recursiveHelper(this, pair_rich_text)}`, '', 'richtext');
    return undefined;// Add this line to pass lint check "consistent-return"
  }

  // Returns the forbidden word present in the string "str" if it contains at least one unsafe word. Returns "safe" if the string is considered to be safe to output directly into innerHTML.
  userStringSafeCheck(str) {
    developmentLog(`Safe check on ${str}`);
    const tmp = str.toLowerCase();
    let forbiddenWords = ['\\', '<', '>', 'script', 'javascript', 'eval', 'document', 'window', 'console', 'location'];
    for (let word of forbiddenWords) {
      if (tmp.indexOf(word) !== -1) {
        return word;
      }
    }
    return 'safe';
  }

  /*
    Directly invoking Source Academy's builtin js-slang runner.
    Needs hard-coded support from js-slang part for the "sourceRunner" function and "backupContext" property in the content object for this to work.
  */
  runInJsSlang(code: string): string {
    developmentLog('js-slang context:');
    // console.log(context);
    const options : Partial<IOptions> = {
      originalMaxExecTime: 1000,
      scheduler: 'preemptive',
      stepLimit: 1000,
      throwInfiniteLoops: true,
      useSubst: false,
    };
    context.prelude = 'const display=(x)=>module_display(x);';
    context.errors = []; // Here if I don't manually clear the "errors" array in context, the remaining errors from the last evaluation will stop the function "preprocessFileImports" in preprocessor.ts of js-slang thus stop the whole evaluation.
    const sourceFile : Record<string, string> = {
      '/ReplModuleUserCode.js': code,
    };

    runFilesInContext(sourceFile, '/ReplModuleUserCode.js', context, options)
      .then((evalResult) => {
        if (evalResult.status === 'suspended' || evalResult.status === 'suspended-ec-eval') {
          throw new Error('This should not happen');
        }
        if (evalResult.status !== 'error') {
          this.pushOutputString('js-slang program finished with value:', 'cyan');
          // Here must use plain text output mode because evalResult.value contains strings from the users.
          this.pushOutputString(evalResult.value === undefined ? 'undefined' : evalResult.value.toString(), 'cyan');
        } else {
          const errors = context.errors;
          console.log(errors);
          const errorCount = errors.length;
          for (let i = 0; i < errorCount; i++) {
            const error = errors[i];
            if (error.explain()
              .indexOf('Name module_display not declared.') !== -1) {
              this.pushOutputString('[Error] It seems that you haven\'t import the function "module_display" correctly when calling "set_evaluator" in Source Academy\'s main editor.', 'red');
            } else this.pushOutputString(`Line ${error.location.start.line}: ${error.type} Error: ${error.explain()}  (${error.elaborate()})`, 'red');
          }
        }
        this.reRenderTab();
      });

    return 'Async run in js-slang';
  }

  setTabReactComponentInstance(tab : any) {
    this._tabReactComponent = tab;
  }

  private reRenderTab() {
    this._tabReactComponent.setState({});// Forces the tab React Component to re-render using setState
  }

  saveEditorContent() {
    localStorage.setItem('programmable_repl_saved_editor_code', this.userCodeInEditor.toString());
    this.pushOutputString('Saved', 'lightgreen');
    this.pushOutputString('<span style=\'font-style:italic;\'>The saved code is stored locally in your browser. You may lose the saved code if you clear browser data or use another device.</span>', 'gray', 'richtext');
    this.reRenderTab();
  }

  private getSavedEditorContent() {
    let savedContent = localStorage.getItem('programmable_repl_saved_editor_code');
    if (savedContent === null) return '';
    return savedContent;
  }

  // Small Easter Egg that doesn't affect module functionality and normal user experience :)
  // Please don't modify these text! Thanks!  :)
  private easterEggFunction() {
    this.pushOutputString('[Author (Wang Zihan)] ❤<span style=\'font-weight:bold;\'>I love Keqing and Ganyu.</span>❤', 'pink', 'richtext');
    this.pushOutputString('<span style=\'font-style:italic;\'>Showing my love to my favorite girls through a SA module, is that the so-called "romance of a programmer"?</span>', 'gray', 'richtext');
    this.pushOutputString('❤❤❤❤❤', 'pink');
    this.pushOutputString('<br>', 'white', 'richtext');
    this.pushOutputString('If you see this, please check whether you have called <span style=\'font-weight:bold;font-style:italic;\'>invoke_repl</span> function with the correct parameter before using the Programmable Repl Tab.', 'yellow', 'richtext');
    return 'Easter Egg!';
  }
}

// Comment all the codes inside this function before merging the code to github as production version.
// Because console.log() can expose the sandboxed VM location to students thus may cause security concerns.
function developmentLog(_content) {
  // console.log(`[Programmable Repl Log] ${_content}`);
}
