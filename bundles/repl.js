export default require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
  var __typeError = msg => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => (key in obj) ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
  var __spreadValues = (a4, b) => {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a4, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a4, prop, b[prop]);
    }
    return a4;
  };
  var __name = (target, value) => __defProp(target, "name", {
    value,
    configurable: true
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
  var __decoratorStart = base => {
    var _a2;
    return [, , , __create((_a2 = base == null ? void 0 : base[__knownSymbol("metadata")]) != null ? _a2 : null)];
  };
  var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
  var __expectFn = fn => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
  var __decoratorContext = (kind, name, done, metadata, fns) => ({
    kind: __decoratorStrings[kind],
    name,
    metadata,
    addInitializer: fn => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null))
  });
  var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
  var __runInitializers = (array, flags, self, value) => {
    for (var i = 0, fns = array[flags >> 1], n3 = fns && fns.length; i < n3; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
    return value;
  };
  var __decorateElement = (array, flags, name, decorators, target, extra) => {
    var fn, it, done, ctx, access, k = flags & 7, s5 = !!(flags & 8), p2 = !!(flags & 16);
    var j = k > 3 ? array.length + 1 : k ? s5 ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
    var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
    var desc = k && (!p2 && !s5 && (target = target.prototype), k < 5 && (k > 3 || !p2) && __getOwnPropDesc(k < 4 ? target : {
      get [name]() {
        return __privateGet(this, extra);
      },
      set [name](x) {
        return __privateSet(this, extra, x);
      }
    }, name));
    k ? p2 && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
    for (var i = decorators.length - 1; i >= 0; i--) {
      ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
      if (k) {
        (ctx.static = s5, ctx.private = p2, access = ctx.access = {
          has: p2 ? x => __privateIn(target, x) : x => (name in x)
        });
        if (k ^ 3) access.get = p2 ? x => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : x => x[name];
        if (k > 2) access.set = p2 ? (x, y2) => __privateSet(x, target, y2, k ^ 4 ? extra : desc.set) : (x, y2) => x[name] = y2;
      }
      (it = (0, decorators[i])(k ? k < 4 ? p2 ? extra : desc[key] : k > 4 ? void 0 : {
        get: desc.get,
        set: desc.set
      } : target, ctx), done._ = 1);
      if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p2 ? extra = it : desc[key] = it : target = it); else if (typeof it !== "object" || it === null) __typeError("Object expected"); else (__expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn));
    }
    return (k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p2 ? k ^ 4 ? extra : desc : target);
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = value => {
        try {
          step(generator.next(value));
        } catch (e7) {
          reject(e7);
        }
      };
      var rejected = value => {
        try {
          step(generator.throw(value));
        } catch (e7) {
          reject(e7);
        }
      };
      var step = x => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  var __await = function (promise, isYieldStar) {
    this[0] = promise;
    this[1] = isYieldStar;
  };
  var __asyncGenerator = (__this, __arguments, generator) => {
    var resume = (k, v, yes, no) => {
      try {
        var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
        Promise.resolve(isAwait ? v[0] : v).then(y2 => isAwait ? resume(k === "return" ? k : "next", v[1] ? {
          done: y2.done,
          value: y2.value
        } : y2, yes, no) : yes({
          value: y2,
          done
        })).catch(e7 => resume("throw", e7, yes, no));
      } catch (e7) {
        no(e7);
      }
    }, method = (k, call, wait, clear) => it[k] = x => (call = new Promise((yes, no, run) => (run = () => resume(k, x, yes, no), q ? q.then(run) : run())), clear = () => q === wait && (q = 0), q = wait = call.then(clear, clear), call), q, it = {};
    return (generator = generator.apply(__this, __arguments), it[__knownSymbol("asyncIterator")] = () => it, method("next"), method("throw"), method("return"), it);
  };
  var index_exports = {};
  __export(index_exports, {
    default: () => ReplModulePlugin
  });
  var _;
  !(function (_2) {
    (_2.UNKNOWN = "__unknown", _2.INTERNAL = "__internal", _2.EVALUATOR = "__evaluator", _2.EVALUATOR_SYNTAX = "__evaluator_syntax", _2.EVALUATOR_TYPE = "__evaluator_type", _2.EVALUATOR_RUNTIME = "__evaluator_runtime");
  })(_ || (_ = {}));
  var o = class extends Error {
    constructor(r2) {
      super(r2);
      __publicField(this, "name", "ConductorError");
      __publicField(this, "errorType", _.UNKNOWN);
    }
  };
  var s = class extends o {
    constructor(r2) {
      super(r2);
      __publicField(this, "name", "ConductorInternalError");
      __publicField(this, "errorType", _.INTERNAL);
    }
  };
  var s2 = class extends o {
    constructor(r2, o5, s5, e7) {
      super(`${void 0 !== o5 ? `${e7 ? e7 + ":" : ""}${o5}${void 0 !== s5 ? ":" + s5 : ""}: ` : ""}${r2}`);
      __publicField(this, "name", "EvaluatorError");
      __publicField(this, "errorType", _.EVALUATOR);
      __publicField(this, "rawMessage");
      __publicField(this, "line");
      __publicField(this, "column");
      __publicField(this, "fileName");
      (this.rawMessage = r2, this.line = o5, this.column = s5, this.fileName = e7);
    }
  };
  function e(r2) {
    const t5 = (function (r3) {
      var _a2;
      if ("string" == typeof r3) return JSON.stringify(r3);
      if ("number" == typeof r3 || "boolean" == typeof r3) return String(r3);
      if (null === r3) return "null";
      if (void 0 === r3) return "undefined";
      if ("bigint" == typeof r3) return `${r3}n`;
      if ("symbol" == typeof r3) return r3.toString();
      if ("function" == typeof r3) return r3.name ? `function ${r3.name}` : "anonymous function";
      try {
        return (_a2 = JSON.stringify(r3)) != null ? _a2 : Object.prototype.toString.call(r3);
      } catch (e7) {
        try {
          return String(r3);
        } catch (e8) {
          return Object.prototype.toString.call(r3);
        }
      }
    })(r2);
    return t5.length > 100 ? `${t5.slice(0, 100)}...` : t5;
  }
  var n = class extends s2 {
    constructor(r2, t5, n3, o5, u3, a4, i) {
      super(`${r2}: Expected ${n3}${t5 ? ` for ${t5}` : ""}, got ${e(o5)}.`, u3, a4, i);
      __publicField(this, "name", "EvaluatorParameterTypeError");
      __publicField(this, "errorType", _.EVALUATOR_TYPE);
      __publicField(this, "funcName");
      __publicField(this, "paramName");
      __publicField(this, "expected");
      __publicField(this, "actual");
      (this.funcName = r2, this.paramName = t5, this.expected = n3, this.actual = o5);
    }
  };
  var u = class extends n {
    constructor(r2, t5, e7, n3, o5, u3, a4) {
      super(e7, n3, (function (r3) {
        if ("string" == typeof r3) return r3;
        const {min: t6, max: e8, integer: n4 = true} = r3, o6 = n4 ? "integer" : "number";
        return void 0 !== t6 && void 0 !== e8 ? `${o6} \u2208 [${t6}, ${e8}]` : void 0 !== t6 ? `${o6} \u2265 ${t6}` : void 0 !== e8 ? `${o6} \u2264 ${e8}` : o6;
      })(t5), r2, o5, u3, a4);
      __publicField(this, "name", "EvaluatorNumberRangeError");
    }
  };
  var e2 = class extends s2 {
    constructor() {
      super(...arguments);
      __publicField(this, "name", "EvaluatorRuntimeError");
      __publicField(this, "errorType", _.EVALUATOR_RUNTIME);
    }
  };
  function p(r2, o5, t5, n3 = true) {
    return "number" == typeof r2 && !Number.isNaN(r2) && (!(n3 && !Number.isInteger(r2)) && (!(void 0 !== o5 && r2 < o5) && !(void 0 !== t5 && r2 > t5)));
  }
  function l(o5, t5, n3, e7, i = true, u3) {
    if (!p(o5, n3, e7, i)) throw new u(o5, {
      min: n3,
      max: e7,
      integer: i
    }, t5, u3);
  }
  function n2(n3, r2) {
    const t5 = {
      args: n3,
      returnType: r2
    };
    return function (n4, r3) {
      n4.signature = t5;
    };
  }
  var R;
  !(function (R2) {
    (R2[R2.CALL = 0] = "CALL", R2[R2.RETURN = 1] = "RETURN", R2[R2.RETURN_ERR = 2] = "RETURN_ERR");
  })(R || (R = {}));
  var O;
  !(function (O2) {
    (O2[O2.PROTOCOL_VERSION = 0] = "PROTOCOL_VERSION", O2[O2.PROTOCOL_MIN_VERSION = 0] = "PROTOCOL_MIN_VERSION", O2[O2.SETUP_MESSAGES_BUFFER_SIZE = 10] = "SETUP_MESSAGES_BUFFER_SIZE");
  })(O || (O = {}));
  var o3 = class {
    constructor(t5, o5, s5) {
      __publicField(this, "exports", []);
      __publicField(this, "exportedNames", []);
      __publicField(this, "evaluator");
      this.evaluator = s5;
    }
    initialise() {
      return __async(this, null, function* () {
        for (const o5 of this.exportedNames) {
          const s5 = this[o5];
          if (!s5.signature || "function" != typeof s5 || "string" != typeof o5) throw new s(`'${String(o5)}' is not an exportable method`);
          const r2 = s5.bind(this);
          (r2.signature = s5.signature, s5.sync && (r2.sync = s5.sync.bind(this)));
          const i = yield this.evaluator.closure_make(s5.signature, r2);
          this.exports.push({
            symbol: o5,
            value: i,
            signature: s5.signature
          });
        }
      });
    }
  };
  __publicField(o3, "channelAttach");
  var E;
  !(function (E2) {
    (E2[E2.VOID = 0] = "VOID", E2[E2.BOOLEAN = 1] = "BOOLEAN", E2[E2.NUMBER = 2] = "NUMBER", E2[E2.CONST_STRING = 3] = "CONST_STRING", E2[E2.EMPTY_LIST = 4] = "EMPTY_LIST", E2[E2.PAIR = 5] = "PAIR", E2[E2.ARRAY = 6] = "ARRAY", E2[E2.CLOSURE = 7] = "CLOSURE", E2[E2.OPAQUE = 8] = "OPAQUE", E2[E2.LIST = 9] = "LIST", E2[E2.ANY = 10] = "ANY", E2[E2.INTEGER = 11] = "INTEGER");
  })(E || (E = {}));
  var a2;
  !(function (a4) {
    (a4[a4.HELLO = 0] = "HELLO", a4[a4.ABORT = 1] = "ABORT", a4[a4.ENTRY = 2] = "ENTRY");
  })(a2 || (a2 = {}));
  var N;
  !(function (N2) {
    (N2[N2.ONLINE = 0] = "ONLINE", N2[N2.EVAL_READY = 1] = "EVAL_READY", N2[N2.RUNNING = 2] = "RUNNING", N2[N2.WAITING = 3] = "WAITING", N2[N2.BREAKPOINT = 4] = "BREAKPOINT", N2[N2.STOPPED = 5] = "STOPPED", N2[N2.ERROR = 6] = "ERROR");
  })(N || (N = {}));
  var e5 = {
    [E.VOID]: false,
    [E.BOOLEAN]: false,
    [E.NUMBER]: false,
    [E.CONST_STRING]: false,
    [E.EMPTY_LIST]: true,
    [E.PAIR]: true,
    [E.ARRAY]: true,
    [E.CLOSURE]: true,
    [E.OPAQUE]: true,
    [E.LIST]: true,
    [E.ANY]: false,
    [E.INTEGER]: false
  };
  function a3(t5) {
    return {
      type: E.CONST_STRING,
      value: t5
    };
  }
  function y(t5 = void 0) {
    return {
      type: E.VOID,
      value: t5
    };
  }
  var COLOR_REPL_DISPLAY_DEFAULT = "cyan";
  var COLOR_RUN_CODE_RESULT = "white";
  var COLOR_ERROR_MESSAGE = "red";
  var REPL_CHANNEL_ID = "sourceacademy-repl-channel";
  var REPL_TAB_NAME = "Repl";
  var pairStyleToCssStyle = {
    bold: "font-weight:bold;",
    italic: "font-style:italic;",
    small: "font-size: 14px;",
    medium: "font-size: 20px;",
    large: "font-size: 25px;",
    gigantic: "font-size: 50px;",
    underline: "text-decoration: underline;"
  };
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
  function checkColorStringValidity(htmlColor) {
    return (/^#[0-9a-f]{6}$/u).test(htmlColor.toLowerCase());
  }
  var MAX_STYLE_DEPTH = 64;
  function processRichDisplayContent(evaluator, value, func_name, depth = 0) {
    return __async(this, null, function* () {
      if (depth > MAX_STYLE_DEPTH) {
        throw new e2(`${func_name}: rich text nesting is too deep, or the value is cyclic.`);
      }
      if (value.type === E.CONST_STRING) {
        const safeCheckResult = xssStringCheck(value.value);
        if (safeCheckResult !== "safe") {
          throw new e2(`${func_name}: For safety, the character/word ${safeCheckResult} is not allowed in rich text output. Please remove it or use plain text output mode and try again.`);
        }
        return `">${value.value}</span>`;
      }
      if (value.type !== E.PAIR) {
        throw new n(func_name, void 0, "pair or string", E[value.type]);
      }
      const pair = value;
      const head = yield evaluator.pair_head(pair);
      const tail = yield evaluator.pair_tail(pair);
      if (tail.type !== E.CONST_STRING) {
        throw new e2(`${func_name}: The tail in style pair should always be a string, but got ${E[tail.type]}.`);
      }
      const config_str = tail.value;
      let style;
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
            throw new e2(`${func_name}: Unknown colour type "${config_str.substring(0, 4)}".`);
        }
        const colorHex = config_str.substring(4);
        if (!checkColorStringValidity(colorHex)) {
          throw new e2(`${func_name}: Invalid html colour string "${colorHex}". It should start with # and followed by 6 characters representing a hex number.`);
        }
        style = `${prefix}:${colorHex};`;
      } else {
        const namedStyle = pairStyleToCssStyle[config_str];
        if (namedStyle === void 0) {
          throw new e2(`${func_name}: Found undefined style "${config_str}" while processing rich text.`);
        }
        style = namedStyle;
      }
      return style + (yield processRichDisplayContent(evaluator, head, func_name, depth + 1));
    });
  }
  var MAX_DEPTH = 64;
  var MAX_NODES = 1e4;
  function stringifyReplValue(evaluator, value) {
    return __async(this, null, function* () {
      return stringifyReplValueDepth(evaluator, value, 0, {
        remaining: MAX_NODES
      });
    });
  }
  function stringifyReplValueDepth(evaluator, value, depth, budget) {
    return __async(this, null, function* () {
      if (depth > MAX_DEPTH || budget.remaining <= 0) return "...";
      budget.remaining -= 1;
      switch (value.type) {
        case E.VOID:
          return "undefined";
        case E.BOOLEAN:
        case E.NUMBER:
        case E.INTEGER:
          return String(value.value);
        case E.CONST_STRING:
          return value.value;
        case E.EMPTY_LIST:
          return "null";
        case E.PAIR:
          {
            const pair = value;
            const head = yield evaluator.pair_head(pair);
            const tail = yield evaluator.pair_tail(pair);
            return `[${yield stringifyReplValueDepth(evaluator, head, depth + 1, budget)}, ${yield stringifyReplValueDepth(evaluator, tail, depth + 1, budget)}]`;
          }
        case E.ARRAY:
          {
            const length = yield evaluator.array_length(value);
            const parts = [];
            for (let i = 0; i < length; i += 1) {
              parts.push(yield stringifyReplValueDepth(evaluator, yield evaluator.array_get(value, i), depth + 1, budget));
            }
            return `[${parts.join(", ")}]`;
          }
        case E.CLOSURE:
          return "<function>";
        case E.OPAQUE:
          return "<value>";
        default:
          return String(value.value);
      }
    });
  }
  var _default_js_slang_dec, _set_program_text_dec, _set_font_size_dec, _set_background_image_dec, _rich_repl_display_dec, _repl_display_dec, _set_evaluator_dec, _a, _init;
  var ReplModulePlugin = class extends (_a = o3, _set_evaluator_dec = [n2([E.CLOSURE], E.VOID)], _repl_display_dec = [n2([E.ANY], E.ANY)], _rich_repl_display_dec = [n2([E.ANY], E.ANY)], _set_background_image_dec = [n2([E.CONST_STRING, E.NUMBER], E.VOID)], _set_font_size_dec = [n2([E.NUMBER], E.VOID)], _set_program_text_dec = [n2([E.CONST_STRING], E.VOID)], _default_js_slang_dec = [n2([E.CONST_STRING], E.VOID)], _a) {
    constructor(conduit, [replChannel], evaluator, tabLoader) {
      if (!replChannel) {
        throw new e2("Repl channel is required but was not provided.");
      }
      super(conduit, [replChannel], evaluator);
      __runInitializers(_init, 5, this);
      this.id = "repl";
      this.exportedNames = ["default_js_slang", "repl_display", "rich_repl_display", "set_background_image", "set_evaluator", "set_font_size", "set_program_text"];
      this.__replChannel = void 0;
      this.__tabLoader = void 0;
      this.__outputHistory = [];
      this.__latestEditorProps = void 0;
      this.__latestProgramText = void 0;
      this.__evaluator = void 0;
      this.__tabLoaded = false;
      this.__tabRequested = false;
      this.__running = false;
      this.__editorProps = {
        backgroundImageUrl: null,
        backgroundColorAlpha: 1,
        fontSize: 17
      };
      this.__replChannel = replChannel;
      this.__tabLoader = tabLoader;
      this.__replChannel.subscribe(message => {
        if (message.type === "request") {
          this.__tabRequested = true;
          this.__outputHistory.forEach(entry => this.__replChannel.send(entry));
          if (this.__latestEditorProps) this.__replChannel.send(this.__latestEditorProps);
          if (this.__latestProgramText) this.__replChannel.send(this.__latestProgramText);
          return;
        }
        if (message.type === "run") {
          this.__runCode(message.code).catch(error => {
            console.error("repl: unexpected error while running code", error);
          });
        }
      });
    }
    set_evaluator(evalFunc) {
      return __asyncGenerator(this, null, function* () {
        yield new __await(this.evaluator.closure_arity_assert(evalFunc, 1));
        this.__evaluator = evalFunc;
        return y();
      });
    }
    repl_display(content) {
      return __asyncGenerator(this, null, function* () {
        const stringified = content.type === E.CONST_STRING ? content.value : yield new __await(stringifyReplValue(this.evaluator, content));
        this.__displayOutput({
          content: stringified,
          color: COLOR_REPL_DISPLAY_DEFAULT,
          outputMethod: "plaintext"
        });
        return content;
      });
    }
    rich_repl_display(content) {
      return __asyncGenerator(this, null, function* () {
        const result = yield new __await(processRichDisplayContent(this.evaluator, content, this.rich_repl_display.name));
        this.__displayOutput({
          content: `<span style="${result}`,
          color: "",
          outputMethod: "richtext"
        });
        return content;
      });
    }
    set_background_image(img_url, background_color_alpha) {
      return __asyncGenerator(this, null, function* () {
        l(background_color_alpha.value, this.set_background_image.name, 0, 1, false, "background_color_alpha");
        this.__editorProps.backgroundImageUrl = img_url.value;
        this.__editorProps.backgroundColorAlpha = background_color_alpha.value;
        this.__displayEditorProps();
        return y();
      });
    }
    set_font_size(font_size_px) {
      return __asyncGenerator(this, null, function* () {
        l(font_size_px.value, this.set_font_size.name, 0);
        this.__editorProps.fontSize = font_size_px.value;
        this.__displayEditorProps();
        return y();
      });
    }
    set_program_text(text) {
      return __asyncGenerator(this, null, function* () {
        const message = {
          type: "set_program_text",
          text: text.value
        };
        this.__latestProgramText = message;
        this.__loadReplTab();
        if (this.__tabRequested) {
          this.__replChannel.send(message);
        }
        return y();
      });
    }
    default_js_slang(_program) {
      return __asyncGenerator(this, null, function* () {
        throw new e2(`${this.default_js_slang.name}: running Repl input directly through the Source interpreter is not supported by this module. Write your own evaluator function and register it with set_evaluator instead.`);
      });
    }
    __loadReplTab() {
      if (this.__tabLoaded || this.__tabLoader === void 0) return;
      const tabName = this.__tabLoader.tabs.find(tab => tab === REPL_TAB_NAME);
      if (tabName === void 0) return;
      this.__tabLoader.loadTab(tabName);
      this.__tabLoaded = true;
    }
    __displayOutput(entry) {
      const message = {
        type: "output",
        entry
      };
      this.__outputHistory.push(message);
      this.__loadReplTab();
      if (this.__tabRequested) {
        this.__replChannel.send(message);
      }
    }
    __displayEditorProps() {
      const message = __spreadValues({
        type: "editor_props"
      }, this.__editorProps);
      this.__latestEditorProps = message;
      this.__loadReplTab();
      if (this.__tabRequested) {
        this.__replChannel.send(message);
      }
    }
    __runCode(code) {
      return __async(this, null, function* () {
        if (!this.__evaluator) {
          this.__displayOutput({
            content: "<br>",
            color: "white",
            outputMethod: "richtext"
          });
          this.__displayOutput({
            content: "If you see this, please check whether you have called <span style='font-weight:bold;font-style:italic;'>set_evaluator</span> function with the correct parameter before using the Programmable Repl Tab.",
            color: "yellow",
            outputMethod: "richtext"
          });
          return;
        }
        if (this.__running) return;
        this.__running = true;
        try {
          const generator = this.evaluator.closure_call_unchecked(this.__evaluator, [a3(code)]);
          let step = yield generator.next();
          while (!step.done) {
            step = yield generator.next();
          }
          const result = step.value;
          const content = result.type === E.CONST_STRING ? result.value : yield stringifyReplValue(this.evaluator, result);
          this.__displayOutput({
            content,
            color: COLOR_RUN_CODE_RESULT,
            outputMethod: "plaintext"
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          this.__displayOutput({
            content: message,
            color: COLOR_ERROR_MESSAGE,
            outputMethod: "plaintext"
          });
        } finally {
          this.__running = false;
        }
      });
    }
  };
  _init = __decoratorStart(_a);
  __decorateElement(_init, 1, "set_evaluator", _set_evaluator_dec, ReplModulePlugin);
  __decorateElement(_init, 1, "repl_display", _repl_display_dec, ReplModulePlugin);
  __decorateElement(_init, 1, "rich_repl_display", _rich_repl_display_dec, ReplModulePlugin);
  __decorateElement(_init, 1, "set_background_image", _set_background_image_dec, ReplModulePlugin);
  __decorateElement(_init, 1, "set_font_size", _set_font_size_dec, ReplModulePlugin);
  __decorateElement(_init, 1, "set_program_text", _set_program_text_dec, ReplModulePlugin);
  __decorateElement(_init, 1, "default_js_slang", _default_js_slang_dec, ReplModulePlugin);
  __decoratorMetadata(_init, ReplModulePlugin);
  ReplModulePlugin.channelAttach = [REPL_CHANNEL_ID];
  return __toCommonJS(index_exports);
};