require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
    value: mod,
    enumerable: true
  }) : target, mod));
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var repl_exports = {};
  __export(repl_exports, {
    default_js_slang: () => default_js_slang,
    module_display: () => module_display,
    set_background_image: () => set_background_image,
    set_evaluator: () => set_evaluator,
    set_font_size: () => set_font_size
  });
  var import_context2 = __toESM(__require("js-slang/context"), 1);
  var import_context = __toESM(__require("js-slang/context"), 1);
  var import_js_slang = __require("js-slang");
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
        if (Object.is(this.evalFunction, default_js_slang)) {
          retVal = this.runInJsSlang(this.userCodeInEditor);
        } else {
          retVal = this.evalFunction(this.userCodeInEditor);
        }
      } catch (exception) {
        console.log(exception);
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
      developmentLog(pair_rich_text);
      const head = pair => pair[0];
      const tail = pair => pair[1];
      const is_pair = obj => obj instanceof Array && obj.length === 2;
      if (!is_pair(pair_rich_text)) return "not_rich_text_pair";
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
          const safeCheckResult = thisInstance.userStringSafeCheck(param);
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
      return void 0;
    }
    userStringSafeCheck(str) {
      developmentLog(`Safe check on ${str}`);
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
      developmentLog("js-slang context:");
      const options = {
        originalMaxExecTime: 1e3,
        scheduler: "preemptive",
        stepLimit: 1e3,
        throwInfiniteLoops: true,
        useSubst: false
      };
      import_context.default.prelude = "const display=(x)=>module_display(x);";
      import_context.default.errors = [];
      const sourceFile = {
        "/ReplModuleUserCode.js": code
      };
      (0, import_js_slang.runFilesInContext)(sourceFile, "/ReplModuleUserCode.js", import_context.default, options).then(evalResult => {
        if (evalResult.status === "suspended" || evalResult.status === "suspended-ec-eval") {
          throw new Error("This should not happen");
        }
        if (evalResult.status !== "error") {
          this.pushOutputString("js-slang program finished with value:", "cyan");
          this.pushOutputString(evalResult.value === void 0 ? "undefined" : evalResult.value.toString(), "cyan");
        } else {
          const errors = import_context.default.errors;
          console.log(errors);
          const errorCount = errors.length;
          for (let i = 0; i < errorCount; i++) {
            const error = errors[i];
            if (error.explain().indexOf("Name module_display not declared.") !== -1) {
              this.pushOutputString(`[Error] It seems that you haven't import the function "module_display" correctly when calling "set_evaluator" in Source Academy's main editor.`, "red");
            } else this.pushOutputString(`Line ${error.location.start.line}: ${error.type} Error: ${error.explain()}  (${error.elaborate()})`, "red");
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
  import_context2.default.moduleContexts.repl.state = INSTANCE;
  function set_evaluator(evalFunc) {
    if (!(evalFunc instanceof Function)) {
      const typeName = typeof evalFunc;
      throw new Error(`Wrong parameter type "${typeName}' in function "set_evaluator". It supposed to be a function and it's the entrance function of your metacircular evaulator.`);
    }
    INSTANCE.evalFunction = evalFunc;
    return {
      toReplString: () => "<Programmable Repl Initialized>"
    };
  }
  function module_display(content) {
    if (INSTANCE.richDisplayInternal(content) === "not_rich_text_pair") {
      INSTANCE.pushOutputString(content.toString(), "white", "plaintext");
      return content;
    }
    return void 0;
  }
  function set_background_image(img_url, background_color_alpha) {
    INSTANCE.customizedEditorProps.backgroundImageUrl = img_url;
    INSTANCE.customizedEditorProps.backgroundColorAlpha = background_color_alpha;
  }
  function set_font_size(font_size_px) {
    INSTANCE.customizedEditorProps.fontSize = parseInt(font_size_px.toString());
  }
  function default_js_slang(_program) {
    throw new Error(`Invaild Call: Function "default_js_slang" can not be directly called by user's code in editor. You should use it as the parameter of the function "set_evaluator"`);
  }
  return __toCommonJS(repl_exports);
}