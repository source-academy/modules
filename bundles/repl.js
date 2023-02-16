function (moduleHelpers) {
  function require(x) {
    const result = ({
      "js-slang/moduleHelpers": moduleHelpers
    })[x];
    if (result === undefined) throw new Error(`Internal Error: Unknown import "${x}"!`); else return result;
  }
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function (x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all) __defProp(target, name, {
      get: all[name],
      enumerable: true
    });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      });
    }
    return to;
  };
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var repl_exports = {};
  __export(repl_exports, {
    invoke_repl: () => invoke_repl,
    module_display: () => module_display,
    rich_display: () => rich_display,
    set_editor_background_image: () => set_editor_background_image,
    set_editor_font_size: () => set_editor_font_size
  });
  var import_moduleHelpers2 = __require("js-slang/moduleHelpers");
  var import_moduleHelpers = __require("js-slang/moduleHelpers");
  var ProgrammableRepl = class {
    constructor() {
      this.customizedEditorProps = {
        backgroundImageUrl: "no-background-image",
        backgroundColorAlpha: 1,
        fontSize: 17
      };
      this.evalFunction = _placeholder => this.easterEggFunction();
      this.userCodeInEditor = this.getSavedEditorContent();
      this.outputStrings = [];
      this._editorInstance = null;
      developmentLog(this);
    }
    InvokeREPL_Internal(evalFunc) {
      this.evalFunction = evalFunc;
    }
    runCode() {
      this.outputStrings = [];
      let retVal;
      try {
        if (this.evalFunction === default_js_slang) {
          retVal = this.evalFunction(this.userCodeInEditor, document.body);
        } else {
          retVal = this.evalFunction(this.userCodeInEditor);
        }
      } catch (exception) {
        this.pushOutputString(`Line ${exception.location.start.line.toString()}: ${exception.error.message}`, "red");
        this.reRenderTab();
        return;
      }
      if (retVal === void 0) {
        this.pushOutputString("Program exit with undefined return value.", "cyan");
      } else {
        if (typeof retVal === "string") {
          retVal = `"${retVal}"`;
        }
        this.pushOutputString(`Program exit with return value ${retVal}`, "cyan");
      }
      this.reRenderTab();
      developmentLog("RunCode finished");
    }
    updateUserCode(code) {
      this.userCodeInEditor = code;
    }
    pushOutputString(content, textColor, outputMethod = "plaintext") {
      let tmp = {
        content,
        color: textColor,
        outputMethod
      };
      this.outputStrings.push(tmp);
    }
    setEditorInstance(instance) {
      if (instance === void 0) return;
      this._editorInstance = instance;
      this._editorInstance.on("guttermousedown", e => {
        const breakpointLine = e.getDocumentPosition().row;
        developmentLog(breakpointLine);
      });
      this._editorInstance.setOptions({
        fontSize: `${this.customizedEditorProps.fontSize.toString()}pt`
      });
    }
    richDisplayInternal(pair_rich_text) {
      const head = pair => pair[0];
      const tail = pair => pair[1];
      const is_pair = obj => obj instanceof Array && obj.length === 2;
      function checkColorStringValidity(htmlColor) {
        if (htmlColor.length !== 7) return false;
        if (htmlColor[0] !== "#") return false;
        for (let i = 1; i < 7; i++) {
          const char = htmlColor[i];
          developmentLog(`   ${char}`);
          if (!(char >= "0" && char <= "9" || char >= "A" && char <= "F" || char >= "a" && char <= "f")) {
            return false;
          }
        }
        return true;
      }
      function recursiveHelper(thisInstance, param) {
        if (typeof param === "string") {
          const safeCheckResult = thisInstance.userStringSafeCheck(head(param));
          if (safeCheckResult !== "safe") {
            throw new Error(`For safety matters, the character/word ${safeCheckResult} is not allowed in rich text output. Please remove it or use plain text output mode and try again.`);
          }
          developmentLog(head(param));
          return `">${param}</span>`;
        }
        if (!is_pair(param)) {
          throw new Error(`Unexpected data type ${typeof param} when processing rich text. It should be a pair.`);
        } else {
          const pairStyleToCssStyle = {
            bold: "font-weight:bold;",
            italic: "font-style:italic;",
            small: "font-size: 14px;",
            medium: "font-size: 20px;",
            large: "font-size: 25px;",
            gigantic: "font-size: 50px;",
            underline: "text-decoration: underline;"
          };
          if (typeof tail(param) !== "string") {
            throw new Error(`The tail in style pair should always be a string, but got ${typeof tail(param)}.`);
          }
          let style = "";
          if (tail(param).substring(0, 3) === "clr") {
            let prefix = "";
            if (tail(param)[3] === "t") prefix = "color:"; else if (tail(param)[3] === "b") prefix = "background-color:"; else throw new Error("Error when decoding rich text color data");
            const colorHex = tail(param).substring(4);
            if (!checkColorStringValidity(colorHex)) {
              throw new Error(`Invalid html color string ${colorHex}. It should start with # and followed by 6 characters representing a hex number.`);
            }
            style = `${prefix + colorHex};`;
          } else {
            style = pairStyleToCssStyle[tail(param)];
            if (style === void 0) {
              throw new Error(`Found undefined style ${tail(param)} during processing rich text.`);
            }
          }
          return style + recursiveHelper(thisInstance, head(param));
        }
      }
      this.pushOutputString(`<span style="${recursiveHelper(this, pair_rich_text)}`, "", "richtext");
    }
    userStringSafeCheck(str) {
      const tmp = str.toLowerCase();
      let forbiddenWords = ["\\", "<", ">", "script", "javascript", "eval", "document", "window", "console", "location"];
      for (let word of forbiddenWords) {
        if (tmp.indexOf(word) !== -1) {
          return word;
        }
      }
      return "safe";
    }
    runInJsSlang(code) {
      const options = {
        originalMaxExecTime: 1e3,
        scheduler: "preemptive",
        stepLimit: 1e3,
        throwInfiniteLoops: true,
        useSubst: false
      };
      let jsslangContext = import_moduleHelpers.context.backupContext;
      const prelude = "const display=(x)=>module_display(x);";
      import_moduleHelpers.context.sourceRunner(prelude, jsslangContext, true, options).then(preludeEvalResult => {
        developmentLog(preludeEvalResult);
        if (preludeEvalResult.status === "error") {
          this.pushOutputString(`[Warning] It seems that you havn't import the function "module_display" correctly when calling "invoke_repl". The runner will use the default js-slang builtin display function.`, "yellow");
        }
      });
      let result = import_moduleHelpers.context.sourceRunner(code, jsslangContext, true, options);
      developmentLog(result);
      result.then(evalResult => {
        if (evalResult.status !== "error") {
          this.pushOutputString("js-slang program finished with value:", "cyan");
          this.pushOutputString(evalResult.value === void 0 ? "undefined" : evalResult.value.toString(), "cyan");
        } else {
          const errors = jsslangContext.errors;
          const errorCount = errors.length;
          for (let i = 0; i < errorCount; i++) {
            const error = errors[i];
            this.pushOutputString(`Line ${error.location.start.line}: ${error.type} Error: ${error.explain()}  (${error.elaborate()})`, "red");
          }
        }
        this.reRenderTab();
      });
      return "Async run in js-slang";
    }
    setTabReactComponentInstance(tab) {
      this._tabReactComponent = tab;
    }
    reRenderTab() {
      this._tabReactComponent.setState({});
    }
    saveEditorContent() {
      localStorage.setItem("programmable_repl_saved_editor_code", this.userCodeInEditor.toString());
      this.pushOutputString("Saved", "lightgreen");
      this.pushOutputString("<span style='font-style:italic;'>The saved code is stored locally in your browser. You may lose the saved code if you clear browser data or use another device.</span>", "gray", "richtext");
      this.reRenderTab();
    }
    getSavedEditorContent() {
      let savedContent = localStorage.getItem("programmable_repl_saved_editor_code");
      if (savedContent === null) return "";
      return savedContent;
    }
    easterEggFunction() {
      this.pushOutputString("[Author (Wang Zihan)] \u2764<span style='font-weight:bold;'>I love Keqing and Ganyu.</span>\u2764", "pink", "richtext");
      this.pushOutputString(`<span style='font-style:italic;'>Showing my love to my favorite girls through a SA module, is that the so-called "romance of a programmer"?</span>`, "gray", "richtext");
      this.pushOutputString("\u2764\u2764\u2764\u2764\u2764", "pink");
      this.pushOutputString("<br>", "white", "richtext");
      this.pushOutputString("If you see this, please check whether you have called <span style='font-weight:bold;font-style:italic;'>invoke_repl</span> function with the correct parameter before using the Programmable Repl Tab.", "yellow", "richtext");
      return "Easter Egg!";
    }
  };
  function developmentLog(_content) {}
  var INSTANCE = new ProgrammableRepl();
  import_moduleHelpers2.context.moduleContexts.repl.state = INSTANCE;
  function invoke_repl(evalFunc) {
    if (!(evalFunc instanceof Function)) {
      const typeName = typeof evalFunc;
      throw new Error(`Wrong parameter type "${typeName}' in function "invoke_repl". It supposed to be a function and it's the entrance function of your metacircular evaulator.`);
    }
    INSTANCE.evalFunction = evalFunc;
    return {
      toReplString: () => "<Programmable Repl Initialized>"
    };
  }
  function module_display(content) {
    INSTANCE.pushOutputString(content.toString(), "white", "plaintext");
    return content;
  }
  function rich_display(pair) {
    INSTANCE.richDisplayInternal(pair);
  }
  function set_editor_background_image(img_url, background_color_alpha) {
    INSTANCE.customizedEditorProps.backgroundImageUrl = img_url;
    INSTANCE.customizedEditorProps.backgroundColorAlpha = background_color_alpha;
  }
  function set_editor_font_size(font_size_px) {
    INSTANCE.customizedEditorProps.fontSize = parseInt(font_size_px.toString());
  }
  function default_js_slang(program, safeKey) {
    if (!(safeKey instanceof Element)) {
      throw new Error(`Invaild Call: Function "default_js_slang" can not be directly called by user's code in editor. You should use it as the parameter of the function "invoke_repl"`);
    }
    return INSTANCE.runInJsSlang(program);
  }
  return __toCommonJS(repl_exports);
}