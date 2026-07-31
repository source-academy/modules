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
  var __pow = Math.pow;
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
    default: () => MidiModulePlugin
  });
  function n(n3, r2) {
    const t5 = {
      args: n3,
      returnType: r2
    };
    return function (n4, r3) {
      n4.signature = t5;
    };
  }
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
  var R;
  !(function (R2) {
    (R2[R2.CALL = 0] = "CALL", R2[R2.RETURN = 1] = "RETURN", R2[R2.RETURN_ERR = 2] = "RETURN_ERR");
  })(R || (R = {}));
  var O;
  !(function (O2) {
    (O2[O2.PROTOCOL_VERSION = 0] = "PROTOCOL_VERSION", O2[O2.PROTOCOL_MIN_VERSION = 0] = "PROTOCOL_MIN_VERSION", O2[O2.SETUP_MESSAGES_BUFFER_SIZE = 10] = "SETUP_MESSAGES_BUFFER_SIZE");
  })(O || (O = {}));
  var o2 = class {
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
  __publicField(o2, "channelAttach");
  var E;
  !(function (E2) {
    (E2[E2.VOID = 0] = "VOID", E2[E2.BOOLEAN = 1] = "BOOLEAN", E2[E2.NUMBER = 2] = "NUMBER", E2[E2.CONST_STRING = 3] = "CONST_STRING", E2[E2.EMPTY_LIST = 4] = "EMPTY_LIST", E2[E2.PAIR = 5] = "PAIR", E2[E2.ARRAY = 6] = "ARRAY", E2[E2.CLOSURE = 7] = "CLOSURE", E2[E2.OPAQUE = 8] = "OPAQUE", E2[E2.LIST = 9] = "LIST", E2[E2.ANY = 10] = "ANY", E2[E2.INTEGER = 11] = "INTEGER");
  })(E || (E = {}));
  var a;
  !(function (a3) {
    (a3[a3.HELLO = 0] = "HELLO", a3[a3.ABORT = 1] = "ABORT", a3[a3.ENTRY = 2] = "ENTRY");
  })(a || (a = {}));
  var N;
  !(function (N2) {
    (N2[N2.ONLINE = 0] = "ONLINE", N2[N2.EVAL_READY = 1] = "EVAL_READY", N2[N2.RUNNING = 2] = "RUNNING", N2[N2.WAITING = 3] = "WAITING", N2[N2.BREAKPOINT = 4] = "BREAKPOINT", N2[N2.STOPPED = 5] = "STOPPED", N2[N2.ERROR = 6] = "ERROR");
  })(N || (N = {}));
  var e2 = {
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
  function t2(t5 = null) {
    return {
      type: E.EMPTY_LIST,
      value: t5
    };
  }
  function scaleToConductorList(evaluator, scale) {
    return __async(this, null, function* () {
      if (scale === null) return t2();
      const [head, tail] = scale;
      return evaluator.pair_make({
        type: E.NUMBER,
        value: head
      }, yield scaleToConductorList(evaluator, tail));
    });
  }
  var s3 = class extends o {
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
  function e4(r2) {
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
  var n2 = class extends s3 {
    constructor(r2, t5, n3, o5, u3, a3, i) {
      super(`${r2}: Expected ${n3}${t5 ? ` for ${t5}` : ""}, got ${e4(o5)}.`, u3, a3, i);
      __publicField(this, "name", "EvaluatorParameterTypeError");
      __publicField(this, "errorType", _.EVALUATOR_TYPE);
      __publicField(this, "funcName");
      __publicField(this, "paramName");
      __publicField(this, "expected");
      __publicField(this, "actual");
      (this.funcName = r2, this.paramName = t5, this.expected = n3, this.actual = o5);
    }
  };
  var u = class extends n2 {
    constructor(r2, t5, e7, n3, o5, u3, a3) {
      super(e7, n3, (function (r3) {
        if ("string" == typeof r3) return r3;
        const {min: t6, max: e8, integer: n4 = true} = r3, o6 = n4 ? "integer" : "number";
        return void 0 !== t6 && void 0 !== e8 ? `${o6} \u2208 [${t6}, ${e8}]` : void 0 !== t6 ? `${o6} \u2265 ${t6}` : void 0 !== e8 ? `${o6} \u2264 ${e8}` : o6;
      })(t5), r2, o5, u3, a3);
      __publicField(this, "name", "EvaluatorNumberRangeError");
    }
  };
  var e5 = class extends s3 {
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
  function parseNoteWithOctave(note) {
    if (typeof note !== "string") return null;
    const match = (/^([A-Ga-g])([#♮b]?)(\d*)$/).exec(note);
    if (match === null) return null;
    const [, noteName, accidental, octaveStr] = match;
    switch (accidental) {
      case "#":
        {
          if (noteName === "B" || noteName === "E") return null;
          break;
        }
      case "b":
        {
          if (noteName === "F" || noteName === "C") return null;
          break;
        }
    }
    const octave = octaveStr === "" ? 4 : parseInt(octaveStr);
    return [noteName.toUpperCase(), accidental !== "" ? accidental : "\u266E", octave];
  }
  function noteToValues(note, func_name) {
    const res = parseNoteWithOctave(note);
    if (res === null) {
      throw new e5(`${func_name}: Invalid Note with Octave: ${note}`);
    }
    return res;
  }
  function midiNoteToNoteName(midiNote, accidental, func_name) {
    if (accidental !== "#" && accidental !== "b") {
      throw new n2(func_name, "accidental", "sharp or flat", accidental);
    }
    switch (midiNote % 12) {
      case 0:
        return "C";
      case 1:
        return accidental === "#" ? `C${"#"}` : `D${"b"}`;
      case 2:
        return "D";
      case 3:
        return accidental === "#" ? `D${"#"}` : `E${"b"}`;
      case 4:
        return "E";
      case 5:
        return "F";
      case 6:
        return accidental === "#" ? `F${"#"}` : `G${"b"}`;
      case 7:
        return "G";
      case 8:
        return accidental === "#" ? `G${"#"}` : `A${"b"}`;
      case 9:
        return "A";
      case 10:
        return accidental === "#" ? `A${"#"}` : `B${"b"}`;
      case 11:
        return "B";
      default:
        throw new e5(`${func_name}: Invalid MIDI note value ${midiNote}`);
    }
  }
  var major_intervals = [2, 2, 1, 2, 2, 2, 1];
  function make_from_major_scale(root, mode) {
    let output = [root + 12, null];
    let note = root + 12;
    for (let i = major_intervals.length - 1; i >= 0; i--) {
      const interval = major_intervals[(mode - 1 + i) % major_intervals.length];
      note -= interval;
      output = [note, output];
    }
    return output;
  }
  function major_scale(key) {
    return make_from_major_scale(key, 1);
  }
  var ionian_scale = major_scale;
  function dorian_scale(key) {
    return make_from_major_scale(key, 2);
  }
  function phrygian_scale(key) {
    return make_from_major_scale(key, 3);
  }
  function lydian_scale(key) {
    return make_from_major_scale(key, 4);
  }
  function mixolydian_scale(key) {
    return make_from_major_scale(key, 5);
  }
  function minor_scale(key) {
    return make_from_major_scale(key, 6);
  }
  var aeolian_scale = minor_scale;
  function locrian_scale(key) {
    return make_from_major_scale(key, 7);
  }
  function is_note_with_octave(value) {
    return parseNoteWithOctave(value) !== null;
  }
  function letter_name_to_midi_note(note) {
    const [noteName, accidental, octave] = noteToValues(note, "letter_name_to_midi_note");
    let res = 12;
    switch (noteName) {
      case "C":
        break;
      case "D":
        res += 2;
        break;
      case "E":
        res += 4;
        break;
      case "F":
        res += 5;
        break;
      case "G":
        res += 7;
        break;
      case "A":
        res += 9;
        break;
      case "B":
        res += 11;
        break;
      default:
        break;
    }
    switch (accidental) {
      case "b":
        {
          res -= 1;
          break;
        }
      case "#":
        {
          res += 1;
          break;
        }
      case "\u266E":
        break;
    }
    return res + 12 * octave;
  }
  function midi_note_to_letter_name(midiNote, accidental) {
    const octave = Math.floor(midiNote / 12) - 1;
    const note = midiNoteToNoteName(midiNote, accidental, "midi_note_to_letter_name");
    return `${note}${octave}`;
  }
  function midi_note_to_frequency(note) {
    l(note, "midi_note_to_frequency");
    return 440 * __pow(2, (note - 69) / 12);
  }
  function letter_name_to_frequency(note) {
    return midi_note_to_frequency(letter_name_to_midi_note(note));
  }
  function add_octave_to_note(note, octave) {
    l(octave, "add_octave_to_note", 0, void 0, true, "octave");
    const match = (/^([A-Ga-g])([#♮b]?)$/).exec(note);
    if (match === null || parseNoteWithOctave(note) === null) {
      throw new n2("add_octave_to_note", "note", "a note without an octave", note);
    }
    const [, noteName, accidental] = match;
    return `${noteName.toUpperCase()}${accidental}${octave}`;
  }
  function get_octave(note) {
    const [, , octave] = noteToValues(note, "get_octave");
    return octave;
  }
  function get_note_name(note) {
    const [noteName] = noteToValues(note, "get_note_name");
    return noteName;
  }
  function get_accidental(note) {
    const [, accidental] = noteToValues(note, "get_accidental");
    return accidental;
  }
  function key_signature_to_key(accidental, numAccidentals) {
    l(numAccidentals, "key_signature_to_key", 0, 6, true, "numAccidentals");
    switch (accidental) {
      case "#":
        {
          const keys = ["C", "G", "D", "A", "E", "B", "F#"];
          return keys[numAccidentals];
        }
      case "b":
        {
          const keys = ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb"];
          return keys[numAccidentals];
        }
      default:
        throw new n2("key_signature_to_key", "accidental", "sharp or flat", accidental);
    }
  }
  var SHARP = "#";
  var FLAT = "b";
  var NATURAL = "\u266E";
  var _locrian_scale_dec, _aeolian_scale_dec, _minor_scale_dec, _mixolydian_scale_dec, _lydian_scale_dec, _phrygian_scale_dec, _dorian_scale_dec, _ionian_scale_dec, _major_scale_dec, _key_signature_to_key_dec, _get_accidental_dec, _get_note_name_dec, _get_octave_dec, _add_octave_to_note_dec, _is_note_with_octave_dec, _letter_name_to_frequency_dec, _midi_note_to_frequency_dec, _midi_note_to_letter_name_dec, _letter_name_to_midi_note_dec, _a, _init;
  var MidiModulePlugin = class extends (_a = o2, _letter_name_to_midi_note_dec = [n([E.CONST_STRING], E.NUMBER)], _midi_note_to_letter_name_dec = [n([E.NUMBER, E.CONST_STRING], E.CONST_STRING)], _midi_note_to_frequency_dec = [n([E.NUMBER], E.NUMBER)], _letter_name_to_frequency_dec = [n([E.CONST_STRING], E.NUMBER)], _is_note_with_octave_dec = [n([E.ANY], E.BOOLEAN)], _add_octave_to_note_dec = [n([E.CONST_STRING, E.NUMBER], E.CONST_STRING)], _get_octave_dec = [n([E.CONST_STRING], E.NUMBER)], _get_note_name_dec = [n([E.CONST_STRING], E.CONST_STRING)], _get_accidental_dec = [n([E.CONST_STRING], E.CONST_STRING)], _key_signature_to_key_dec = [n([E.CONST_STRING, E.NUMBER], E.CONST_STRING)], _major_scale_dec = [n([E.NUMBER], E.LIST)], _ionian_scale_dec = [n([E.NUMBER], E.LIST)], _dorian_scale_dec = [n([E.NUMBER], E.LIST)], _phrygian_scale_dec = [n([E.NUMBER], E.LIST)], _lydian_scale_dec = [n([E.NUMBER], E.LIST)], _mixolydian_scale_dec = [n([E.NUMBER], E.LIST)], _minor_scale_dec = [n([E.NUMBER], E.LIST)], _aeolian_scale_dec = [n([E.NUMBER], E.LIST)], _locrian_scale_dec = [n([E.NUMBER], E.LIST)], _a) {
    constructor(conduit, channels, evaluator) {
      super(conduit, channels, evaluator);
      __runInitializers(_init, 5, this);
      this.id = "midi";
      this.exportedNames = ["letter_name_to_midi_note", "midi_note_to_letter_name", "midi_note_to_frequency", "letter_name_to_frequency", "is_note_with_octave", "add_octave_to_note", "get_octave", "get_note_name", "get_accidental", "key_signature_to_key", "major_scale", "ionian_scale", "dorian_scale", "phrygian_scale", "lydian_scale", "mixolydian_scale", "minor_scale", "aeolian_scale", "locrian_scale"];
      this.exports.push({
        symbol: "SHARP",
        value: {
          type: E.CONST_STRING,
          value: SHARP
        }
      }, {
        symbol: "FLAT",
        value: {
          type: E.CONST_STRING,
          value: FLAT
        }
      }, {
        symbol: "NATURAL",
        value: {
          type: E.CONST_STRING,
          value: NATURAL
        }
      });
    }
    letter_name_to_midi_note(note) {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.NUMBER,
          value: letter_name_to_midi_note(note.value)
        };
      });
    }
    midi_note_to_letter_name(note, accidental) {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.CONST_STRING,
          value: midi_note_to_letter_name(note.value, accidental.value)
        };
      });
    }
    midi_note_to_frequency(note) {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.NUMBER,
          value: midi_note_to_frequency(note.value)
        };
      });
    }
    letter_name_to_frequency(note) {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.NUMBER,
          value: letter_name_to_frequency(note.value)
        };
      });
    }
    is_note_with_octave(value) {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.BOOLEAN,
          value: is_note_with_octave(value == null ? void 0 : value.value)
        };
      });
    }
    add_octave_to_note(note, octave) {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.CONST_STRING,
          value: add_octave_to_note(note.value, octave.value)
        };
      });
    }
    get_octave(note) {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.NUMBER,
          value: get_octave(note.value)
        };
      });
    }
    get_note_name(note) {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.CONST_STRING,
          value: get_note_name(note.value)
        };
      });
    }
    get_accidental(note) {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.CONST_STRING,
          value: get_accidental(note.value)
        };
      });
    }
    key_signature_to_key(accidental, numAccidentals) {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.CONST_STRING,
          value: key_signature_to_key(accidental.value, numAccidentals.value)
        };
      });
    }
    major_scale(key) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(scaleToConductorList(this.evaluator, major_scale(key.value)));
      });
    }
    ionian_scale(key) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(scaleToConductorList(this.evaluator, ionian_scale(key.value)));
      });
    }
    dorian_scale(key) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(scaleToConductorList(this.evaluator, dorian_scale(key.value)));
      });
    }
    phrygian_scale(key) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(scaleToConductorList(this.evaluator, phrygian_scale(key.value)));
      });
    }
    lydian_scale(key) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(scaleToConductorList(this.evaluator, lydian_scale(key.value)));
      });
    }
    mixolydian_scale(key) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(scaleToConductorList(this.evaluator, mixolydian_scale(key.value)));
      });
    }
    minor_scale(key) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(scaleToConductorList(this.evaluator, minor_scale(key.value)));
      });
    }
    aeolian_scale(key) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(scaleToConductorList(this.evaluator, aeolian_scale(key.value)));
      });
    }
    locrian_scale(key) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(scaleToConductorList(this.evaluator, locrian_scale(key.value)));
      });
    }
  };
  _init = __decoratorStart(_a);
  __decorateElement(_init, 1, "letter_name_to_midi_note", _letter_name_to_midi_note_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "midi_note_to_letter_name", _midi_note_to_letter_name_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "midi_note_to_frequency", _midi_note_to_frequency_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "letter_name_to_frequency", _letter_name_to_frequency_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "is_note_with_octave", _is_note_with_octave_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "add_octave_to_note", _add_octave_to_note_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "get_octave", _get_octave_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "get_note_name", _get_note_name_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "get_accidental", _get_accidental_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "key_signature_to_key", _key_signature_to_key_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "major_scale", _major_scale_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "ionian_scale", _ionian_scale_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "dorian_scale", _dorian_scale_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "phrygian_scale", _phrygian_scale_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "lydian_scale", _lydian_scale_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "mixolydian_scale", _mixolydian_scale_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "minor_scale", _minor_scale_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "aeolian_scale", _aeolian_scale_dec, MidiModulePlugin);
  __decorateElement(_init, 1, "locrian_scale", _locrian_scale_dec, MidiModulePlugin);
  __decoratorMetadata(_init, MidiModulePlugin);
  MidiModulePlugin.channelAttach = [];
  return __toCommonJS(index_exports);
};