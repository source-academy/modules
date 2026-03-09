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
  var index_exports = {};
  __export(index_exports, {
    assert_contains: () => assert_contains,
    assert_equals: () => assert_equals,
    assert_greater: () => assert_greater,
    assert_greater_equals: () => assert_greater_equals,
    assert_length: () => assert_length,
    assert_not_equals: () => assert_not_equals,
    describe: () => describe,
    get_arg_list: () => get_arg_list,
    get_num_calls: () => get_num_calls,
    get_ret_vals: () => get_ret_vals,
    it: () => it,
    mock_function: () => mock_function,
    sample_function: () => sample_function,
    test: () => test
  });
  function getSymbols(object) {
    return Object.getOwnPropertySymbols(object).filter(symbol => Object.prototype.propertyIsEnumerable.call(object, symbol));
  }
  function getTag(value) {
    if (value == null) {
      return value === void 0 ? "[object Undefined]" : "[object Null]";
    }
    return Object.prototype.toString.call(value);
  }
  var regexpTag = "[object RegExp]";
  var stringTag = "[object String]";
  var numberTag = "[object Number]";
  var booleanTag = "[object Boolean]";
  var argumentsTag = "[object Arguments]";
  var symbolTag = "[object Symbol]";
  var dateTag = "[object Date]";
  var mapTag = "[object Map]";
  var setTag = "[object Set]";
  var arrayTag = "[object Array]";
  var functionTag = "[object Function]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var objectTag = "[object Object]";
  var errorTag = "[object Error]";
  var dataViewTag = "[object DataView]";
  var uint8ArrayTag = "[object Uint8Array]";
  var uint8ClampedArrayTag = "[object Uint8ClampedArray]";
  var uint16ArrayTag = "[object Uint16Array]";
  var uint32ArrayTag = "[object Uint32Array]";
  var bigUint64ArrayTag = "[object BigUint64Array]";
  var int8ArrayTag = "[object Int8Array]";
  var int16ArrayTag = "[object Int16Array]";
  var int32ArrayTag = "[object Int32Array]";
  var bigInt64ArrayTag = "[object BigInt64Array]";
  var float32ArrayTag = "[object Float32Array]";
  var float64ArrayTag = "[object Float64Array]";
  function isPlainObject(value) {
    if (!value || typeof value !== "object") {
      return false;
    }
    const proto = Object.getPrototypeOf(value);
    const hasObjectPrototype = proto === null || proto === Object.prototype || Object.getPrototypeOf(proto) === null;
    if (!hasObjectPrototype) {
      return false;
    }
    return Object.prototype.toString.call(value) === "[object Object]";
  }
  function isEqualsSameValueZero(value, other) {
    return value === other || Number.isNaN(value) && Number.isNaN(other);
  }
  function isEqualWith(a, b, areValuesEqual) {
    return isEqualWithImpl(a, b, void 0, void 0, void 0, void 0, areValuesEqual);
  }
  function isEqualWithImpl(a, b, property, aParent, bParent, stack, areValuesEqual) {
    const result = areValuesEqual(a, b, property, aParent, bParent, stack);
    if (result !== void 0) {
      return result;
    }
    if (typeof a === typeof b) {
      switch (typeof a) {
        case "bigint":
        case "string":
        case "boolean":
        case "symbol":
        case "undefined":
          {
            return a === b;
          }
        case "number":
          {
            return a === b || Object.is(a, b);
          }
        case "function":
          {
            return a === b;
          }
        case "object":
          {
            return areObjectsEqual(a, b, stack, areValuesEqual);
          }
      }
    }
    return areObjectsEqual(a, b, stack, areValuesEqual);
  }
  function areObjectsEqual(a, b, stack, areValuesEqual) {
    if (Object.is(a, b)) {
      return true;
    }
    let aTag = getTag(a);
    let bTag = getTag(b);
    if (aTag === argumentsTag) {
      aTag = objectTag;
    }
    if (bTag === argumentsTag) {
      bTag = objectTag;
    }
    if (aTag !== bTag) {
      return false;
    }
    switch (aTag) {
      case stringTag:
        return a.toString() === b.toString();
      case numberTag:
        {
          const x = a.valueOf();
          const y = b.valueOf();
          return isEqualsSameValueZero(x, y);
        }
      case booleanTag:
      case dateTag:
      case symbolTag:
        return Object.is(a.valueOf(), b.valueOf());
      case regexpTag:
        {
          return a.source === b.source && a.flags === b.flags;
        }
      case functionTag:
        {
          return a === b;
        }
    }
    stack = stack != null ? stack : new Map();
    const aStack = stack.get(a);
    const bStack = stack.get(b);
    if (aStack != null && bStack != null) {
      return aStack === b;
    }
    stack.set(a, b);
    stack.set(b, a);
    try {
      switch (aTag) {
        case mapTag:
          {
            if (a.size !== b.size) {
              return false;
            }
            for (const [key, value] of a.entries()) {
              if (!b.has(key) || !isEqualWithImpl(value, b.get(key), key, a, b, stack, areValuesEqual)) {
                return false;
              }
            }
            return true;
          }
        case setTag:
          {
            if (a.size !== b.size) {
              return false;
            }
            const aValues = Array.from(a.values());
            const bValues = Array.from(b.values());
            for (let i = 0; i < aValues.length; i++) {
              const aValue = aValues[i];
              const index = bValues.findIndex(bValue => {
                return isEqualWithImpl(aValue, bValue, void 0, a, b, stack, areValuesEqual);
              });
              if (index === -1) {
                return false;
              }
              bValues.splice(index, 1);
            }
            return true;
          }
        case arrayTag:
        case uint8ArrayTag:
        case uint8ClampedArrayTag:
        case uint16ArrayTag:
        case uint32ArrayTag:
        case bigUint64ArrayTag:
        case int8ArrayTag:
        case int16ArrayTag:
        case int32ArrayTag:
        case bigInt64ArrayTag:
        case float32ArrayTag:
        case float64ArrayTag:
          {
            if (typeof Buffer !== "undefined" && Buffer.isBuffer(a) !== Buffer.isBuffer(b)) {
              return false;
            }
            if (a.length !== b.length) {
              return false;
            }
            for (let i = 0; i < a.length; i++) {
              if (!isEqualWithImpl(a[i], b[i], i, a, b, stack, areValuesEqual)) {
                return false;
              }
            }
            return true;
          }
        case arrayBufferTag:
          {
            if (a.byteLength !== b.byteLength) {
              return false;
            }
            return areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
          }
        case dataViewTag:
          {
            if (a.byteLength !== b.byteLength || a.byteOffset !== b.byteOffset) {
              return false;
            }
            return areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
          }
        case errorTag:
          {
            return a.name === b.name && a.message === b.message;
          }
        case objectTag:
          {
            const areEqualInstances = areObjectsEqual(a.constructor, b.constructor, stack, areValuesEqual) || isPlainObject(a) && isPlainObject(b);
            if (!areEqualInstances) {
              return false;
            }
            const aKeys = [...Object.keys(a), ...getSymbols(a)];
            const bKeys = [...Object.keys(b), ...getSymbols(b)];
            if (aKeys.length !== bKeys.length) {
              return false;
            }
            for (let i = 0; i < aKeys.length; i++) {
              const propKey = aKeys[i];
              const aProp = a[propKey];
              if (!Object.hasOwn(b, propKey)) {
                return false;
              }
              const bProp = b[propKey];
              if (!isEqualWithImpl(aProp, bProp, propKey, a, b, stack, areValuesEqual)) {
                return false;
              }
            }
            return true;
          }
        default:
          {
            return false;
          }
      }
    } finally {
      stack.delete(a);
      stack.delete(b);
    }
  }
  var list = __toESM(__require("js-slang/dist/stdlib/list"), 1);
  var import_stringify = __require("js-slang/dist/utils/stringify");
  function equalityComparer(expected, received) {
    if (typeof expected === "number") {
      if (!Number.isInteger(expected) || !Number.isInteger(received)) {
        return Math.abs(expected - received) <= 1e-3;
      }
      return expected === received;
    }
    if (list.is_list(expected)) {
      if (!list.is_list(received)) return false;
      let list0 = expected;
      let list1 = received;
      while (true) {
        if (list.is_null(list0) || list.is_null(list1)) {
          if (list.is_null(list0) !== list.is_null(list1)) {
            return false;
          }
          return true;
        }
        if (!isEqualWith(list.head(list0), list.head(list1), equalityComparer)) {
          return false;
        }
        list0 = list.tail(list0);
        list1 = list.tail(list1);
      }
    }
    if (list.is_pair(expected)) {
      if (!list.is_pair(received)) return false;
      if (!isEqualWith(list.head(expected), list.head(received), equalityComparer)) return false;
      if (!isEqualWith(list.tail(expected), list.tail(received), equalityComparer)) return false;
      return true;
    }
    return void 0;
  }
  function assert_equals(expected, received) {
    if (!isEqualWith(expected, received, equalityComparer)) {
      throw new Error(`Expected \`${expected}\`, got \`${received}\`!`);
    }
  }
  function assert_not_equals(expected, received) {
    if (!isEqualWith(expected, received, equalityComparer)) {
      throw new Error(`Expected \`${expected}\` to not equal \`${received}\`!`);
    }
  }
  function assert_contains(xs, toContain) {
    const fail = () => {
      throw new Error(`Expected \`${(0, import_stringify.stringify)(xs)}\` to contain \`${toContain}\`.`);
    };
    function member(xs2, item) {
      if (list.is_null(xs2)) return false;
      if (list.is_list(xs2)) {
        if (isEqualWith(list.head(xs2), item, equalityComparer)) return true;
        return member(list.tail(xs2), item);
      }
      if (list.is_pair(xs2)) {
        if (isEqualWith(list.head(xs2), item, equalityComparer) || isEqualWith(list.tail(xs2), item, equalityComparer)) return true;
        if (list.is_pair(list.head(xs2)) && member(list.head(xs2), item)) {
          return true;
        }
        return list.is_pair(list.tail(xs2)) && member(list.tail(xs2), item);
      }
      throw new Error(`First argument to ${assert_contains.name} must be a list or a pair, got \`${(0, import_stringify.stringify)(xs2)}\`.`);
    }
    if (!member(xs, toContain)) fail();
  }
  function assert_length(xs, len) {
    if (!list.is_list(xs)) throw new Error(`First argument to ${assert_length.name} must be a list.`);
    if (!Number.isInteger(len)) throw new Error(`Second argument to ${assert_length.name} must be an integer.`);
    assert_equals(list.length(xs), len);
  }
  function assert_greater(item, expected) {
    if (typeof expected !== "number") {
      throw new Error(`${assert_greater.name}: Expected value should be a number!`);
    }
    if (typeof item !== "number") {
      throw new Error(`Expected ${item} to be a number!`);
    }
    if (item <= expected) {
      throw new Error(`Expected ${item} to be greater than ${expected}`);
    }
  }
  function assert_greater_equals(item, expected) {
    if (typeof expected !== "number") {
      throw new Error(`${assert_greater_equals.name}: Expected value should be a number!`);
    }
    if (typeof item !== "number") {
      throw new Error(`Expected ${item} to be a number!`);
    }
    if (item < expected) {
      throw new Error(`Expected ${item} to be greater than or equal to ${expected}`);
    }
  }
  var import_context = __toESM(__require("js-slang/context"), 1);
  var UnitestBundleInternalError = class extends Error {};
  function getNewSuite(name) {
    return {
      name,
      results: []
    };
  }
  var suiteResults = [];
  var currentSuite = null;
  var currentTest = null;
  function handleErr(err) {
    if (err.error && err.error.message) {
      return err.error.message;
    }
    if (err.message) {
      return err.message;
    }
    throw err;
  }
  function runTest(name, funcName, func) {
    if (currentSuite === null) {
      throw new UnitestBundleInternalError(`${funcName} must be called from within a test suite!`);
    }
    if (currentTest !== null) {
      throw new UnitestBundleInternalError(`${funcName} cannot be called from within another test!`);
    }
    try {
      currentTest = name;
      func();
      currentSuite.results.push({
        name,
        passed: true
      });
    } catch (err) {
      if (err instanceof UnitestBundleInternalError) {
        throw err;
      }
      const error = handleErr(err);
      currentSuite.results.push({
        name,
        passed: false,
        error
      });
    } finally {
      currentTest = null;
    }
  }
  function it(name, func) {
    runTest(name, it.name, func);
  }
  function test(msg, func) {
    runTest(msg, test.name, func);
  }
  function determinePassCount(results) {
    const passedItems = results.filter(each => {
      if (("results" in each)) {
        const passCount = determinePassCount(each.results);
        each.passed = passCount === each.results.length;
      }
      return each.passed;
    });
    return passedItems.length;
  }
  function describe(msg, func) {
    const oldSuite = currentSuite;
    const newSuite = getNewSuite(msg);
    currentSuite = newSuite;
    newSuite.startTime = performance.now();
    func();
    currentSuite = oldSuite;
    const passCount = determinePassCount(newSuite.results);
    const suiteResult = {
      name: msg,
      results: newSuite.results,
      passCount,
      passed: passCount === newSuite.results.length,
      runtime: performance.now() - newSuite.startTime
    };
    if (oldSuite !== null) {
      oldSuite.results.push(suiteResult);
    } else {
      suiteResults.push(suiteResult);
    }
  }
  import_context.default.moduleContexts.unittest.state = {
    suiteResults
  };
  var import_list = __require("js-slang/dist/stdlib/list");
  var mockSymbol = Symbol();
  function throwIfNotMockedFunction(obj, func_name) {
    if (!((mockSymbol in obj))) {
      throw new Error(`${func_name} expects a mocked function as argument`);
    }
  }
  function mock_function(fn) {
    if (typeof fn !== "function") {
      throw new Error(`${mock_function.name} expects a function as argument`);
    }
    const arglist = [];
    const retVals = [];
    function func(...args) {
      arglist.push(args);
      const retVal = fn.apply(fn, args);
      if (retVal !== void 0) {
        retVals.push(retVal);
      }
      return retVal;
    }
    func[mockSymbol] = {
      arglist,
      retVals
    };
    func.toString = () => fn.toString();
    return func;
  }
  function get_num_calls(fn) {
    throwIfNotMockedFunction(fn, get_num_calls.name);
    return fn[mockSymbol].arglist.length;
  }
  function get_arg_list(fn) {
    throwIfNotMockedFunction(fn, get_arg_list.name);
    const {arglist} = fn[mockSymbol];
    return arglist.reduceRight((res, args) => {
      const argsAsList = (0, import_list.vector_to_list)(args);
      return (0, import_list.pair)(argsAsList, res);
    }, null);
  }
  function get_ret_vals(fn) {
    throwIfNotMockedFunction(fn, get_ret_vals.name);
    const {retVals} = fn[mockSymbol];
    return (0, import_list.vector_to_list)(retVals);
  }
  function sample_function(x) {
    return x + 1;
  }
  return __toCommonJS(index_exports);
};