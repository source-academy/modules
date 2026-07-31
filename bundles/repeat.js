export default require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __name = (target, value) => __defProp(target, "name", {
    value,
    configurable: true
  });
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a2, b) => (typeof require !== "undefined" ? require : a2)[b]
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
    for (var i = 0, fns = array[flags >> 1], n2 = fns && fns.length; i < n2; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
    return value;
  };
  var __decorateElement = (array, flags, name, decorators, target, extra) => {
    var fn, it, done, ctx, access, k = flags & 7, s3 = !!(flags & 8), p = !!(flags & 16);
    var j = k > 3 ? array.length + 1 : k ? s3 ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
    var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
    var desc = k && (!p && !s3 && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : {
      get [name]() {
        return __privateGet(this, extra);
      },
      set [name](x) {
        return __privateSet(this, extra, x);
      }
    }, name));
    k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
    for (var i = decorators.length - 1; i >= 0; i--) {
      ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
      if (k) {
        (ctx.static = s3, ctx.private = p, access = ctx.access = {
          has: p ? x => __privateIn(target, x) : x => (name in x)
        });
        if (k ^ 3) access.get = p ? x => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : x => x[name];
        if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
      }
      (it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : {
        get: desc.get,
        set: desc.set
      } : target, ctx), done._ = 1);
      if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it); else if (typeof it !== "object" || it === null) __typeError("Object expected"); else (__expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn));
    }
    return (k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target);
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
        } catch (e2) {
          reject(e2);
        }
      };
      var rejected = value => {
        try {
          step(generator.throw(value));
        } catch (e2) {
          reject(e2);
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
        Promise.resolve(isAwait ? v[0] : v).then(y => isAwait ? resume(k === "return" ? k : "next", v[1] ? {
          done: y.done,
          value: y.value
        } : y, yes, no) : yes({
          value: y,
          done
        })).catch(e2 => resume("throw", e2, yes, no));
      } catch (e2) {
        no(e2);
      }
    }, method = (k, call, wait, clear) => it[k] = x => (call = new Promise((yes, no, run) => (run = () => resume(k, x, yes, no), q ? q.then(run) : run())), clear = () => q === wait && (q = 0), q = wait = call.then(clear, clear), call), q, it = {};
    return (generator = generator.apply(__this, __arguments), it[__knownSymbol("asyncIterator")] = () => it, method("next"), method("throw"), method("return"), it);
  };
  var __yieldStar = value => {
    var obj = value[__knownSymbol("asyncIterator")], isAwait = false, method, it = {};
    if (obj == null) {
      obj = value[__knownSymbol("iterator")]();
      method = k => it[k] = x => obj[k](x);
    } else {
      obj = obj.call(value);
      method = k => it[k] = v => {
        if (isAwait) {
          isAwait = false;
          if (k === "throw") throw v;
          return v;
        }
        isAwait = true;
        return {
          done: false,
          value: new __await(new Promise(resolve => {
            var x = obj[k](v);
            if (!(x instanceof Object)) __typeError("Object expected");
            resolve(x);
          }), 1)
        };
      };
    }
    return (it[__knownSymbol("iterator")] = () => it, method("next"), ("throw" in obj) ? method("throw") : it.throw = x => {
      throw x;
    }, ("return" in obj) && method("return"), it);
  };
  var index_exports = {};
  __export(index_exports, {
    default: () => RepeatModulePlugin
  });
  function n(n2, r) {
    const t2 = {
      args: n2,
      returnType: r
    };
    return function (n3, r2) {
      n3.signature = t2;
    };
  }
  var _;
  !(function (_2) {
    (_2.UNKNOWN = "__unknown", _2.INTERNAL = "__internal", _2.EVALUATOR = "__evaluator", _2.EVALUATOR_SYNTAX = "__evaluator_syntax", _2.EVALUATOR_TYPE = "__evaluator_type", _2.EVALUATOR_RUNTIME = "__evaluator_runtime");
  })(_ || (_ = {}));
  var o = class extends Error {
    constructor(r) {
      super(r);
      __publicField(this, "name", "ConductorError");
      __publicField(this, "errorType", _.UNKNOWN);
    }
  };
  var s = class extends o {
    constructor(r) {
      super(r);
      __publicField(this, "name", "ConductorInternalError");
      __publicField(this, "errorType", _.INTERNAL);
    }
  };
  var R;
  !(function (R2) {
    (R2[R2.CALL = 0] = "CALL", R2[R2.RETURN = 1] = "RETURN", R2[R2.RETURN_ERR = 2] = "RETURN_ERR");
  })(R || (R = {}));
  var O;
  !(function (O2) {
    (O2[O2.PROTOCOL_VERSION = 0] = "PROTOCOL_VERSION", O2[O2.PROTOCOL_MIN_VERSION = 0] = "PROTOCOL_MIN_VERSION", O2[O2.SETUP_MESSAGES_BUFFER_SIZE = 10] = "SETUP_MESSAGES_BUFFER_SIZE");
  })(O || (O = {}));
  var o2 = class {
    constructor(t2, o3, s3) {
      __publicField(this, "exports", []);
      __publicField(this, "exportedNames", []);
      __publicField(this, "evaluator");
      this.evaluator = s3;
    }
    initialise() {
      return __async(this, null, function* () {
        for (const o3 of this.exportedNames) {
          const s3 = this[o3];
          if (!s3.signature || "function" != typeof s3 || "string" != typeof o3) throw new s(`'${String(o3)}' is not an exportable method`);
          const r = s3.bind(this);
          (r.signature = s3.signature, s3.sync && (r.sync = s3.sync.bind(this)));
          const i = yield this.evaluator.closure_make(s3.signature, r);
          this.exports.push({
            symbol: o3,
            value: i,
            signature: s3.signature
          });
        }
      });
    }
  };
  __publicField(o2, "channelAttach");
  var E;
  !(function (E2) {
    (E2[E2.VOID = 0] = "VOID", E2[E2.BOOLEAN = 1] = "BOOLEAN", E2[E2.NUMBER = 2] = "NUMBER", E2[E2.CONST_STRING = 3] = "CONST_STRING", E2[E2.EMPTY_LIST = 4] = "EMPTY_LIST", E2[E2.PAIR = 5] = "PAIR", E2[E2.ARRAY = 6] = "ARRAY", E2[E2.CLOSURE = 7] = "CLOSURE", E2[E2.OPAQUE = 8] = "OPAQUE", E2[E2.LIST = 9] = "LIST", E2[E2.ANY = 10] = "ANY", E2[E2.INTEGER = 11] = "INTEGER");
  })(E || (E = {}));
  var a;
  !(function (a2) {
    (a2[a2.HELLO = 0] = "HELLO", a2[a2.ABORT = 1] = "ABORT", a2[a2.ENTRY = 2] = "ENTRY");
  })(a || (a = {}));
  var N;
  !(function (N2) {
    (N2[N2.ONLINE = 0] = "ONLINE", N2[N2.EVAL_READY = 1] = "EVAL_READY", N2[N2.RUNNING = 2] = "RUNNING", N2[N2.WAITING = 3] = "WAITING", N2[N2.BREAKPOINT = 4] = "BREAKPOINT", N2[N2.STOPPED = 5] = "STOPPED", N2[N2.ERROR = 6] = "ERROR");
  })(N || (N = {}));
  var import_rttcErrors = __require("js-slang/dist/errors/rttcErrors");
  var import_base = __require("js-slang/dist/errors/base");
  var import_rttc = __require("js-slang/dist/utils/rttc");
  var import_operators = __require("js-slang/dist/utils/operators");
  function repeat(evaluator, func, n2) {
    return __asyncGenerator(this, null, function* () {
      if (!Number.isInteger(n2.value) || n2.value < 0) {
        throw new import_base.GeneralRuntimeError(`repeat: Expected integer \u2265 0, got ${n2.value}.`);
      }
      function identity(x) {
        return __asyncGenerator(this, null, function* () {
          return x;
        });
      }
      function composition(x) {
        return __asyncGenerator(this, null, function* () {
          const recursiveFunc = yield* __yieldStar(repeat(evaluator, func, {
            type: E.NUMBER,
            value: n2.value - 1
          }));
          return yield* __yieldStar(evaluator.closure_call_unchecked(func, [yield* __yieldStar(evaluator.closure_call_unchecked(recursiveFunc, [x]))]));
        });
      }
      return yield new __await(evaluator.closure_make({
        name: "function",
        args: [E.VOID],
        returnType: E.VOID
      }, n2.value === 0 ? identity : composition));
    });
  }
  function twice(evaluator, func) {
    return __asyncGenerator(this, null, function* () {
      return yield* __yieldStar(repeat(evaluator, func, {
        type: E.NUMBER,
        value: 2
      }));
    });
  }
  function thrice(evaluator, func) {
    return __asyncGenerator(this, null, function* () {
      return yield* __yieldStar(repeat(evaluator, func, {
        type: E.NUMBER,
        value: 3
      }));
    });
  }
  var _thrice_dec, _twice_dec, _repeat_dec, _a, _init;
  var RepeatModulePlugin = class extends (_a = o2, _repeat_dec = [n([E.CLOSURE, E.NUMBER], E.CLOSURE)], _twice_dec = [n([E.CLOSURE], E.CLOSURE)], _thrice_dec = [n([E.CLOSURE], E.CLOSURE)], _a) {
    constructor(conduit, channels, evaluator) {
      super(conduit, channels, evaluator);
      __runInitializers(_init, 5, this);
      this.id = "repeat";
      this.exportedNames = ["repeat", "twice", "thrice"];
    }
    repeat(func, n2) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(repeat(this.evaluator, func, n2));
      });
    }
    twice(func) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(twice(this.evaluator, func));
      });
    }
    thrice(func) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(thrice(this.evaluator, func));
      });
    }
  };
  _init = __decoratorStart(_a);
  __decorateElement(_init, 1, "repeat", _repeat_dec, RepeatModulePlugin);
  __decorateElement(_init, 1, "twice", _twice_dec, RepeatModulePlugin);
  __decorateElement(_init, 1, "thrice", _thrice_dec, RepeatModulePlugin);
  __decoratorMetadata(_init, RepeatModulePlugin);
  RepeatModulePlugin.channelAttach = [];
  return __toCommonJS(index_exports);
};