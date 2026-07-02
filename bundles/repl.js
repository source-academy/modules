export default require => {
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
    throw Error('Dynamic require of "' + x + '" is not supported');
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
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = value => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = value => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = x => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  var index_exports = {};
  __export(index_exports, {
    default_js_slang: () => default_js_slang,
    repl_display: () => repl_display,
    rich_repl_display: () => rich_repl_display,
    set_background_image: () => set_background_image,
    set_evaluator: () => set_evaluator,
    set_font_size: () => set_font_size,
    set_program_text: () => set_program_text
  });
  var import_rttcErrors = __require("js-slang/dist/errors/rttcErrors");
  var import_base = __require("js-slang/dist/errors/base");
  var import_rttc = __require("js-slang/dist/utils/rttc");
  var import_operators = __require("js-slang/dist/utils/operators");
  var import_context = __toESM(__require("js-slang/context"), 1);
  var import_stringify2 = __require("js-slang/dist/utils/stringify");
  var COLOR_REPL_DISPLAY_DEFAULT = "cyan";
  var COLOR_RUN_CODE_RESULT = "white";
  var COLOR_ERROR_MESSAGE = "red";
  var DEFAULT_EDITOR_HEIGHT = 375;
  var import_js_slang = __require("js-slang");
  var import_list = __require("js-slang/dist/stdlib/list");
  var import_assert = __toESM(__require("js-slang/dist/utils/assert"), 1);
  var import_stringify = __require("js-slang/dist/utils/stringify");
  function xssStringCheck(str) {
    const tmp = str.toLowerCase();
    const forbiddenWords = ["\\", "<", ">", "script", "javascript", "eval", "document", "window", "console", "location"];
    for (const word of forbiddenWords) {
      if (tmp.indexOf(word) !== -1) {
        return word;
      }
    }
    return "safe";
  }
  var pairStyleToCssStyle = {
    bold: "font-weight:bold;",
    italic: "font-style:italic;",
    small: "font-size: 14px;",
    medium: "font-size: 20px;",
    large: "font-size: 25px;",
    gigantic: "font-size: 50px;",
    underline: "text-decoration: underline;"
  };
  function checkColorStringValidity(htmlColor) {
    return (/#[0-9a-f]{6}/).test(htmlColor.toLowerCase());
  }
  function processRichDisplayContent(pair_rich_text, func_name) {
    if (typeof pair_rich_text === "string") {
      const safeCheckResult = xssStringCheck(pair_rich_text);
      if (safeCheckResult !== "safe") {
        throw new import_base.GeneralRuntimeError(`${func_name}: For safety, the character/word ${safeCheckResult} is not allowed in rich text output. Please remove it or use plain text output mode and try again.`);
      }
      return `">${pair_rich_text}</span>`;
    }
    if (!(0, import_list.is_pair)(pair_rich_text)) {
      throw new import_rttcErrors.InvalidParameterTypeError("pair or string", pair_rich_text, func_name);
    }
    const config_str = (0, import_list.tail)(pair_rich_text);
    if (typeof config_str !== "string") {
      throw new import_base.GeneralRuntimeError(`${func_name}: The tail in style pair should always be a string, but got ${config_str}.`);
    }
    let style = "";
    if (config_str.substring(0, 3) === "clr") {
      let prefix;
      switch (config_str[3]) {
        case "t":
          {
            prefix = "color";
            break;
          }
        case "b":
          {
            prefix = "background-color";
            break;
          }
        default:
          throw new import_base.GeneralRuntimeError(`${func_name}: Unknown colour type "${config_str.substring(0, 4)}".`);
      }
      const colorHex = config_str.substring(4);
      if (!checkColorStringValidity(colorHex)) {
        throw new import_base.GeneralRuntimeError(`${func_name}: Invalid html colour string "${colorHex}". It should start with # and followed by 6 characters representing a hex number.`);
      }
      style = `${prefix}:${colorHex};`;
    } else {
      style = pairStyleToCssStyle[config_str];
      if (style === void 0) {
        throw new import_base.GeneralRuntimeError(`${func_name}: Found undefined style "${config_str}" while processing rich text.`);
      }
    }
    return style + processRichDisplayContent((0, import_list.head)(pair_rich_text), func_name);
  }
  var ProgrammableRepl = class {
    constructor() {
      this.customizedEditorProps = {
        backgroundImageUrl: null,
        backgroundColorAlpha: 1,
        fontSize: 17
      };
      this.evalFunction = null;
      this.outputStrings = [];
      this.editorHeight = DEFAULT_EDITOR_HEIGHT;
    }
    InvokeREPL_Internal(evalFunc) {
      this.evalFunction = evalFunc;
    }
    runCode(code, context2) {
      return __async(this, null, function* () {
        this.outputStrings = [];
        let retVal;
        if (this.evalFunction === null) {
          retVal = this.easterEggFunction();
        } else if ((evaluatorSymbol in this.evalFunction)) {
          const evalResult = yield this.runInJsSlang(code, context2);
          if (evalResult.status !== "finished") {
            this.reRenderTab();
            return;
          }
          retVal = evalResult.value;
        } else {
          try {
            retVal = (0, import_operators.callIfFuncAndRightArgs)(this.evalFunction.bind(this), -1, -1, null, context2.nativeStorage, code);
          } catch (exception) {
            const errorString = (0, import_js_slang.parseError)([exception]);
            this.pushOutputString(errorString, COLOR_ERROR_MESSAGE);
            this.reRenderTab();
            return;
          }
        }
        this.pushOutputString(typeof retVal === "string" ? retVal : (0, import_stringify.stringify)(retVal), COLOR_RUN_CODE_RESULT);
        this.reRenderTab();
      });
    }
    pushOutputString(content, textColor, outputMethod = "plaintext") {
      const tmp = {
        content: content === void 0 ? "undefined" : content === null ? "null" : content,
        color: textColor,
        outputMethod
      };
      this.outputStrings.push(tmp);
    }
    runInJsSlang(code, context2) {
      return __async(this, null, function* () {
        const options = {
          originalMaxExecTime: 1e3,
          stepLimit: 1e3,
          throwInfiniteLoops: true,
          useSubst: false
        };
        const evalContext = (0, import_js_slang.createContext)(context2.chapter, context2.variant, context2.languageOptions, context2.externalSymbols, context2.externalContext, {
          rawDisplay: value => {
            if ((0, import_list.is_pair)(value)) {
              try {
                const result = processRichDisplayContent(value, "display");
                const output2 = `<span style="${result}`;
                this.pushOutputString(output2, "", "richtext");
                return value;
              } catch (e) {}
            }
            const output = typeof value === "string" ? value : (0, import_stringify.stringify)(value);
            this.pushOutputString(output, COLOR_REPL_DISPLAY_DEFAULT, "plaintext");
            return value;
          }
        });
        const evalResult = yield (0, import_js_slang.runInContext)(code, evalContext, options);
        (0, import_assert.default)(evalResult.status !== "suspended-cse-eval", "Code should not have been evaluated with cse-machine");
        if (evalResult.status === "error") {
          evalContext.errors.forEach(error => {
            console.error(error);
            const explainer = (0, import_js_slang.parseError)([error]);
            this.pushOutputString(explainer, COLOR_ERROR_MESSAGE);
          });
        }
        return evalResult;
      });
    }
    reRenderTab() {
      var _a;
      (_a = this.tabRerenderer) == null ? void 0 : _a.call(this);
    }
    easterEggFunction() {
      this.pushOutputString("<br>", "white", "richtext");
      this.pushOutputString("If you see this, please check whether you have called <span style='font-weight:bold;font-style:italic;'>set_evaluator</span> function with the correct parameter before using the Programmable Repl Tab.", "yellow", "richtext");
      return "Easter Egg!";
    }
  };
  var INSTANCE = new ProgrammableRepl();
  import_context.default.moduleContexts.repl.state = INSTANCE;
  function set_evaluator(evalFunc) {
    (0, import_rttc.assertFunctionOfLength)(evalFunc, 1, set_evaluator.name);
    INSTANCE.evalFunction = evalFunc;
    return {
      toReplString: () => "<Programmable Repl Initialized>"
    };
  }
  function rich_repl_display(content) {
    const result = processRichDisplayContent(content, rich_repl_display.name);
    const output = `<span style="${result}`;
    INSTANCE.pushOutputString(output, "", "richtext");
    return content;
  }
  function repl_display(content) {
    const stringified = typeof content === "string" ? content : (0, import_stringify2.stringify)(content);
    INSTANCE.pushOutputString(stringified, COLOR_REPL_DISPLAY_DEFAULT, "plaintext");
    return content;
  }
  function set_background_image(img_url, background_color_alpha) {
    (0, import_rttc.assertNumberWithinRange)(background_color_alpha, set_background_image.name, 0, 1, false, "background_color_alpha");
    if (typeof img_url !== "string") {
      throw new import_rttcErrors.InvalidParameterTypeError("string", img_url, set_background_image.name, "img_url");
    }
    INSTANCE.customizedEditorProps.backgroundImageUrl = img_url;
    INSTANCE.customizedEditorProps.backgroundColorAlpha = background_color_alpha;
  }
  function set_font_size(font_size_px) {
    (0, import_rttc.assertNumberWithinRange)(font_size_px, set_font_size.name, 0);
    INSTANCE.customizedEditorProps.fontSize = font_size_px;
  }
  function set_program_text(text) {
    if (typeof text !== "string") {
      throw new import_rttcErrors.InvalidParameterTypeError("string", text, set_program_text.name);
    }
    if (INSTANCE.updateUserCode) {
      INSTANCE.updateUserCode(text);
    } else {
      INSTANCE.defaultCode = text;
    }
  }
  var evaluatorSymbol = Symbol("repl/js-slang");
  function default_js_slang(_program) {
    throw new import_base.GeneralRuntimeError('default_js_slang: Cannot be called directly. You should use it as the parameter of the function "set_evaluator"');
  }
  default_js_slang[evaluatorSymbol] = true;
  return __toCommonJS(index_exports);
};