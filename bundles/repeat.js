(function () {
  'use strict';
  var exports = {};
  (function () {
    const env = {};
    try {
      if (process) {
        process.env = Object.assign({}, process.env);
        Object.assign(process.env, env);
        return;
      }
    } catch (e) {}
    globalThis.process = {
      env: env
    };
  })();
  function repeat(func, n) {
    return n === 0 ? function (x) {
      return x;
    } : function (x) {
      return func(repeat(func, n - 1)(x));
    };
  }
  function twice(func) {
    return repeat(func, 2);
  }
  function thrice(func) {
    return repeat(func, 3);
  }
  exports.repeat = repeat;
  exports.thrice = thrice;
  exports.twice = twice;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
})
