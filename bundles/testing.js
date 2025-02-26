export default require => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var testing_exports = {};
  __export(testing_exports, {
    default: () => testing_default
  });
  function array_test(x) {
    if (Array.isArray === void 0) {
      return x instanceof Array;
    } else {
      return Array.isArray(x);
    }
  }
  function pair(x, xs) {
    return [x, xs];
  }
  function is_pair(x) {
    return array_test(x) && x.length === 2;
  }
  function head(xs) {
    if (is_pair(xs)) {
      return xs[0];
    } else {
      throw new Error("head(xs) expects a pair as argument xs, but encountered " + xs);
    }
  }
  function tail(xs) {
    if (is_pair(xs)) {
      return xs[1];
    } else {
      throw new Error("tail(xs) expects a pair as argument xs, but encountered " + xs);
    }
  }
  function is_null(xs) {
    return xs === null;
  }
  function is_list(xs) {
    for (; ; xs = tail(xs)) {
      if (is_null(xs)) {
        return true;
      } else if (!is_pair(xs)) {
        return false;
      }
    }
  }
  function list(...args) {
    let the_list = null;
    for (let i = args.length - 1; i >= 0; i--) {
      the_list = pair(args[i], the_list);
    }
    return the_list;
  }
  function vector_to_list(vector) {
    let result = null;
    for (let i = vector.length - 1; i >= 0; i = i - 1) {
      result = pair(vector[i], result);
    }
    return result;
  }
  function length(xs) {
    let i = 0;
    while (!is_null(xs)) {
      i += 1;
      xs = tail(xs);
    }
    return i;
  }
  function member(v, xs) {
    for (; !is_null(xs); xs = tail(xs)) {
      if (head(xs) === v) {
        return xs;
      }
    }
    return null;
  }
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
    if (is_null(xs)) {
      fail();
    } else if (is_list(xs)) {
      if (is_null(member(toContain, xs))) {
        fail();
      }
    } else if (is_pair(xs)) {
      if (head(xs) === toContain || tail(xs) === toContain) {
        return;
      }
      try {
        assert_contains(head(xs), toContain);
        return;
      } catch (_) {
        try {
          assert_contains(tail(xs), toContain);
          return;
        } catch (__) {
          fail();
        }
      }
    } else {
      throw new Error(`First argument must be a list or a pair, got \`${xs}\`.`);
    }
  }
  function assert_length(list2, len) {
    assert_equals(length(list2), len);
  }
  var handleErr = err => {
    if (err.error && err.error.message) {
      return err.error.message;
    }
    if (err.message) {
      return err.message;
    }
    throw err;
  };
  var context = {
    describe: (msg, suite) => {
      const starttime = performance.now();
      context.suiteResults = {
        name: msg,
        results: [],
        total: 0,
        passed: 0
      };
      suite();
      context.allResults.results.push(context.suiteResults);
      const endtime = performance.now();
      context.runtime += endtime - starttime;
      return context.allResults;
    },
    it: (msg, test) => {
      const name = `${msg}`;
      let error = "";
      context.suiteResults.total += 1;
      try {
        test();
        context.suiteResults.passed += 1;
      } catch (err) {
        error = handleErr(err);
      }
      context.suiteResults.results.push({
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
      toReplString: () => `${context.allResults.results.length} suites completed in ${context.runtime} ms.`
    },
    runtime: 0
  };
  function it(msg, func) {
    context.it(msg, func);
  }
  function describe(msg, func) {
    return context.describe(msg, func);
  }
  function mock_fn(fun) {
    function details(count2, retvals2, arglist2) {
      return list("times called", count2, "Return values", retvals2, "Arguments", arglist2);
    }
    let count = 0;
    let retvals = null;
    let arglist = null;
    function fn(...args) {
      count += 1;
      const retval = fun.apply(fun, args);
      retvals = pair(retval, retvals);
      arglist = pair(vector_to_list(args), arglist);
      return retval;
    }
    return pair(fn, () => details(count, retvals, arglist));
  }
  function sample_function(x) {
    return x + 1;
  }
  var testing_default = () => ({
    sample_function,
    it,
    describe,
    assert_equals,
    assert_not_equals,
    assert_contains,
    assert_length,
    mock_fn
  });
  return __toCommonJS(testing_exports);
};