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
        if (k > 2) access.set = p2 ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
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
        Promise.resolve(isAwait ? v[0] : v).then(y => isAwait ? resume(k === "return" ? k : "next", v[1] ? {
          done: y.done,
          value: y.value
        } : y, yes, no) : yes({
          value: y,
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
    default: () => BinaryTreeModulePlugin
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
  var s3 = class extends s2 {
    constructor(r2, e7, s5, t5, o5, a3) {
      super(`${r2} (expected ${e7}, got ${s5})`, t5, o5, a3);
      __publicField(this, "name", "EvaluatorTypeError");
      __publicField(this, "errorType", _.EVALUATOR_TYPE);
      __publicField(this, "rawMessage");
      __publicField(this, "expected");
      __publicField(this, "actual");
      (this.rawMessage = r2, this.expected = e7, this.actual = s5);
    }
  };
  var e = class extends s2 {
    constructor() {
      super(...arguments);
      __publicField(this, "name", "EvaluatorRuntimeError");
      __publicField(this, "errorType", _.EVALUATOR_RUNTIME);
    }
  };
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
  !(function (a3) {
    (a3[a3.HELLO = 0] = "HELLO", a3[a3.ABORT = 1] = "ABORT", a3[a3.ENTRY = 2] = "ENTRY");
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
  function t4(t5 = null) {
    return {
      type: E.EMPTY_LIST,
      value: t5
    };
  }
  function make_empty_tree() {
    return t4();
  }
  function make_tree(evaluator, value, left, right) {
    return __async(this, null, function* () {
      if (!(yield is_tree(evaluator, left))) {
        throw new s3(`${make_tree.name} expects binary tree for left`, "binary tree", E[left.type]);
      }
      if (!(yield is_tree(evaluator, right))) {
        throw new s3(`${make_tree.name} expects binary tree for right`, "binary tree", E[right.type]);
      }
      const rightPair = yield evaluator.pair_make(right, t4());
      const leftPair = yield evaluator.pair_make(left, rightPair);
      return evaluator.pair_make(value, leftPair);
    });
  }
  function is_tree(evaluator, value) {
    return __async(this, null, function* () {
      if (!value) return false;
      if (value.type === E.EMPTY_LIST) return true;
      if (!isPairLike(value)) return false;
      const rest = yield evaluator.pair_tail(value);
      if (!isPairLike(rest)) return false;
      const left = yield evaluator.pair_head(rest);
      if (!(yield is_tree(evaluator, left))) return false;
      const rightRest = yield evaluator.pair_tail(rest);
      if (!isPairLike(rightRest)) return false;
      const right = yield evaluator.pair_head(rightRest);
      if (!(yield is_tree(evaluator, right))) return false;
      const tail = yield evaluator.pair_tail(rightRest);
      return tail.type === E.EMPTY_LIST;
    });
  }
  function isPairLike(value) {
    return value.type === E.PAIR || value.type === E.ARRAY;
  }
  function is_empty_tree(value) {
    return (value == null ? void 0 : value.type) === E.EMPTY_LIST;
  }
  function assertNonEmptyTree(evaluator, value, funcName) {
    return __async(this, null, function* () {
      if (!value || !(yield is_tree(evaluator, value))) {
        throw new s3(`${funcName} expects binary tree`, "binary tree", value ? E[value.type] : "undefined");
      }
      if (!isPairLike(value)) {
        throw new e(`${funcName} received an empty binary tree!`);
      }
      return value;
    });
  }
  function entry(evaluator, t5) {
    return __async(this, null, function* () {
      const tree = yield assertNonEmptyTree(evaluator, t5, entry.name);
      return yield evaluator.pair_head(tree);
    });
  }
  function left_branch(evaluator, t5) {
    return __async(this, null, function* () {
      const tree = yield assertNonEmptyTree(evaluator, t5, left_branch.name);
      const rest = yield evaluator.pair_tail(tree);
      return yield evaluator.pair_head(rest);
    });
  }
  function right_branch(evaluator, t5) {
    return __async(this, null, function* () {
      const tree = yield assertNonEmptyTree(evaluator, t5, right_branch.name);
      const rest = yield evaluator.pair_tail(tree);
      const rightRest = yield evaluator.pair_tail(rest);
      return yield evaluator.pair_head(rightRest);
    });
  }
  var _right_branch_dec, _left_branch_dec, _entry_dec, _is_empty_tree_dec, _is_tree_dec, _make_tree_dec, _make_empty_tree_dec, _a, _init;
  var BinaryTreeModulePlugin = class extends (_a = o3, _make_empty_tree_dec = [n2([], E.EMPTY_LIST)], _make_tree_dec = [n2([E.OPAQUE, E.LIST, E.LIST], E.PAIR)], _is_tree_dec = [n2([E.ANY], E.BOOLEAN)], _is_empty_tree_dec = [n2([E.ANY], E.BOOLEAN)], _entry_dec = [n2([E.LIST], E.OPAQUE)], _left_branch_dec = [n2([E.LIST], E.LIST)], _right_branch_dec = [n2([E.LIST], E.LIST)], _a) {
    constructor() {
      super(...arguments);
      __runInitializers(_init, 5, this);
      this.id = "binary_tree";
      this.exportedNames = ["entry", "is_empty_tree", "is_tree", "left_branch", "make_empty_tree", "make_tree", "right_branch"];
    }
    make_empty_tree() {
      return __asyncGenerator(this, null, function* () {
        return make_empty_tree();
      });
    }
    make_tree(value, left, right) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(make_tree(this.evaluator, value, left, right));
      });
    }
    is_tree(value) {
      return __asyncGenerator(this, null, function* () {
        if (!value) throw new e("is_tree expects 1 argument, received 0");
        return {
          type: E.BOOLEAN,
          value: yield new __await(is_tree(this.evaluator, value))
        };
      });
    }
    is_empty_tree(value) {
      return __asyncGenerator(this, null, function* () {
        if (!value) throw new e("is_empty_tree expects 1 argument, received 0");
        return {
          type: E.BOOLEAN,
          value: is_empty_tree(value)
        };
      });
    }
    entry(t5) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(entry(this.evaluator, t5));
      });
    }
    left_branch(t5) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(left_branch(this.evaluator, t5));
      });
    }
    right_branch(t5) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(right_branch(this.evaluator, t5));
      });
    }
  };
  _init = __decoratorStart(_a);
  __decorateElement(_init, 1, "make_empty_tree", _make_empty_tree_dec, BinaryTreeModulePlugin);
  __decorateElement(_init, 1, "make_tree", _make_tree_dec, BinaryTreeModulePlugin);
  __decorateElement(_init, 1, "is_tree", _is_tree_dec, BinaryTreeModulePlugin);
  __decorateElement(_init, 1, "is_empty_tree", _is_empty_tree_dec, BinaryTreeModulePlugin);
  __decorateElement(_init, 1, "entry", _entry_dec, BinaryTreeModulePlugin);
  __decorateElement(_init, 1, "left_branch", _left_branch_dec, BinaryTreeModulePlugin);
  __decorateElement(_init, 1, "right_branch", _right_branch_dec, BinaryTreeModulePlugin);
  __decoratorMetadata(_init, BinaryTreeModulePlugin);
  BinaryTreeModulePlugin.channelAttach = [];
  return __toCommonJS(index_exports);
};