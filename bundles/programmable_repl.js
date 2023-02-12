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
  var programmable_repl_exports = {};
  __export(programmable_repl_exports, {
    default_js_slang: () => default_js_slang,
    invoke_repl: () => invoke_repl,
    module_display: () => module_display,
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
      this.evalFunction = dummy_function_as_placeholder => {
        this.OutputString("[Author (Wang Zihan)] \u2764<span style='font-weight:bold;'>I love Keqing and Ganyu.</span>\u2764", "pink");
        this.OutputString(`<span style='font-style:italic;'>Showing my love to my favorite girls through a SA module, is that the so-called "romance of a programmer"?</span>`, "gray");
        this.OutputString("\u2764\u2764\u2764\u2764\u2764", "pink");
        this.OutputString("<br>");
        this.OutputString("If you see this, please check whether you have called <span style='font-weight:bold;font-style:italic;'>invoke_repl</span> function with the correct parameter before using the Programmable REPL Tab.", "yellow");
        return "Easter Egg!";
      };
      this.userCodeInEditor = this.getSavedEditorContent();
      this.outputStrings = [];
      this._editorInstance = null;
      console.log(this);
    }
    InvokeREPL_Internal(evalFunc) {
      this.evalFunction = evalFunc;
    }
    RunCode() {
      this.outputStrings = [];
      let retVal;
      try {
        if (this.evalFunction === default_js_slang) {
          retVal = this.evalFunction(this.userCodeInEditor, document.body);
        } else {
          retVal = this.evalFunction(this.userCodeInEditor);
        }
      } catch (exception) {
        this.OutputString(`Line ${exception.location.start.line.toString()}: ${exception.error.message}`, "red");
        this.reRenderTab();
        return;
      }
      if (retVal === void 0) {
        this.OutputString("Program exit with undefined return value.", "cyan");
      } else {
        if (typeof retVal === "string") {
          retVal = `"${retVal}"`;
        }
        this.OutputString(`Program exit with return value ${retVal}`, "cyan");
      }
      this.reRenderTab();
      console.log("RunCode finished");
    }
    UpdateUserCode(code) {
      this.userCodeInEditor = code;
    }
    OutputString(str, textColor = "white") {
      const checkResult = this.OutputStringSafeCheck(str);
      if (checkResult != "safe") {
        str = `[Warning] Unsafe output string "${checkResult}" detacted. Please remove this in the output content and try again.`;
        textColor = "red";
      }
      let tmp = {
        content: str,
        color: textColor
      };
      this.outputStrings.push(tmp);
    }
    OutputStringSafeCheck(str) {
      const tmp = str.toLowerCase();
      let forbiddenWords = ["script", "javascript", "eval", "document", "window", "console", "location"];
      for (let word of forbiddenWords) {
        if (tmp.indexOf(word) != -1) {
          return word;
        }
      }
      return "safe";
    }
    SetEditorInstance(instance) {
      if (instance === void 0) {
        return;
      }
      this._editorInstance = instance;
      this._editorInstance.on("guttermousedown", e => {
        const breakpointLine = e.getDocumentPosition().row;
        console.log(breakpointLine);
      });
      this._editorInstance.setOptions({
        fontSize: `${this.customizedEditorProps.fontSize.toString()}pt`
      });
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
        console.log(preludeEvalResult);
        if (preludeEvalResult.status === "error") {
          this.OutputString(`[Warning] It seems that you havn't import the function "module_display" correctly when calling "invoke_repl". The runner will use the default js-slang builtin display function.`, "yellow");
        }
      });
      let result = import_moduleHelpers.context.sourceRunner(code, jsslangContext, true, options);
      console.log(result);
      result.then(evalResult => {
        if (evalResult.status != "error") {
          this.OutputString("js-slang program finished with value:", "cyan");
          this.OutputString(evalResult.value === void 0 ? "undefined" : evalResult.value.toString(), "cyan");
        } else {
          const errors = jsslangContext.errors;
          const errorCount = errors.length;
          for (let i = 0; i < errorCount; i++) {
            const error = errors[i];
            this.OutputString(`Line ${error.location.start.line}: ${error.type} Error: ${error.explain()}  (${error.elaborate()})`, "red");
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
      this.OutputString("Saved", "lightgreen");
      this.OutputString("<span style='font-style:italic;'>The saved code is stored locally in your browser. You may lose the saved code if you clear browser data or use another device.</span>", "gray");
      this.reRenderTab();
    }
    getSavedEditorContent() {
      let savedContent = localStorage.getItem("programmable_repl_saved_editor_code");
      if (savedContent === null) {
        return "";
      }
      return savedContent;
    }
  };
  var INSTANCE = new ProgrammableRepl();
  import_moduleHelpers2.context.moduleContexts.programmable_repl.state = INSTANCE;
  function invoke_repl(evalFunc) {
    if (!(evalFunc instanceof Function)) {
      const typeName = typeof evalFunc;
      throw new Error('Wrong parameter type "' + typeName + `' in function "invoke_repl". It supposed to be a function and it's the entrance function of your metacircular evaulator.`);
    }
    INSTANCE.evalFunction = evalFunc;
    return {
      toReplString: () => "<Programmable REPL Initialized>"
    };
  }
  function module_display(content) {
    INSTANCE.OutputString(content.toString());
    return content;
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
  return __toCommonJS(programmable_repl_exports);
}