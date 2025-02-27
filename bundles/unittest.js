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
  var unittest_exports = {};
  __export(unittest_exports, {
    default: () => unittest_default
  });
  var import_list = __require("js-slang/dist/stdlib/list");
  function assert_equals(expected, received) {
    const fail = () => {
      throw new Error(`Expected \`${expected}\`, got \`${received}\`!`);
    };
    if (typeof expected !== typeof received) {
      fail();
    }
    if (typeof expected === "number" && !Number.isInteger(expected)) {
      if (Math.abs(expected - received) > 1e-3) {
        fail();
      } else {
        return;
      }
    }
    if (expected !== received) {
      fail();
    }
  }
  function assert_not_equals(expected, received) {
    if (expected === received) {
      throw new Error(`Expected \`${expected}\` to not equal \`${received}\`!`);
    }
  }
  function assert_contains(xs, toContain) {
    const fail = () => {
      throw new Error(`Expected \`${xs}\` to contain \`${toContain}\`.`);
    };
    const member = (xs2, item) => {
      if ((0, import_list.is_null)(xs2)) return false;
      if ((0, import_list.is_list)(xs2)) {
        if ((0, import_list.head)(xs2) === item) return true;
        return member((0, import_list.tail)(xs2), item);
      }
      if ((0, import_list.is_pair)(xs2)) {
        return member((0, import_list.head)(xs2), item) || member((0, import_list.tail)(xs2), item);
      }
      throw new Error(`First argument to ${assert_contains.name} must be a list or a pair, got \`${xs2}\`.`);
    };
    if (!member(xs, toContain)) fail();
  }
  function assert_length(list2, len) {
    assert_equals((0, import_list.length)(list2), len);
  }
  function assert_greater(item, expected) {
    if (typeof item !== "number" || typeof expected !== "number") {
      throw new Error(`${assert_greater.name} should be called with numeric arguments!`);
    }
    if (item <= expected) {
      throw new Error(`Expected ${item} to be greater than ${expected}`);
    }
  }
  function assert_greater_equals(item, expected) {
    if (typeof item !== "number" || typeof expected !== "number") {
      throw new Error(`${assert_greater.name} should be called with numeric arguments!`);
    }
    if (item < expected) {
      throw new Error(`Expected ${item} to be greater than or equal to ${expected}`);
    }
  }
  var import_context = __toESM(__require("js-slang/context"), 1);
  var handleErr = err => {
    if (err.error && err.error.message) {
      return err.error.message;
    }
    if (err.message) {
      return err.message;
    }
    throw err;
  };
  var testContext = {
    called: false,
    describe(msg, suite) {
      if (this.called) {
        throw new Error(`${describe.name} can only be called once per program!`);
      }
      this.called = true;
      const starttime = performance.now();
      this.suiteResults = {
        name: msg,
        results: [],
        total: 0,
        passed: 0
      };
      suite();
      this.allResults.results.push(this.suiteResults);
      const endtime = performance.now();
      this.runtime += endtime - starttime;
      return this.allResults;
    },
    it(msg, test) {
      const name = `${msg}`;
      let error = "";
      this.suiteResults.total += 1;
      try {
        test();
        this.suiteResults.passed += 1;
      } catch (err) {
        error = handleErr(err);
      }
      this.suiteResults.results.push({
        name,
        error
      });
    },
    suiteResults: {
      name: "",
      results: [],
      total: 0,
      passed: 0
    },
    allResults: {
      results: [],
      toReplString: () => `${testContext.allResults.results.length} suites completed in ${testContext.runtime} ms.`
    },
    runtime: 0
  };
  import_context.default.moduleContexts.unittest.state = testContext;
  function it(msg, func) {
    testContext.it(msg, func);
  }
  function describe(msg, func) {
    return testContext.describe(msg, func);
  }
  var import_list2 = __require("js-slang/dist/stdlib/list");
  function mock_fn(fun) {
    function details(count2, retvals2, arglist2) {
      return (0, import_list2.list)("times called", count2, "Return values", retvals2, "Arguments", arglist2);
    }
    let count = 0;
    let retvals = null;
    let arglist = null;
    function fn(...args) {
      count += 1;
      const retval = fun.apply(fun, args);
      retvals = (0, import_list2.pair)(retval, retvals);
      arglist = (0, import_list2.pair)((0, import_list2.vector_to_list)(args), arglist);
      return retval;
    }
    return (0, import_list2.pair)(fn, () => details(count, retvals, arglist));
  }
  function sample_function(x) {
    return x + 1;
  }
  var unittest_default = {
    sample_function,
    it,
    describe,
    assert_equals,
    assert_not_equals,
    assert_contains,
    assert_greater,
    assert_greater_equals,
    assert_length,
    mock_fn
  };
  return __toCommonJS(unittest_exports);
};