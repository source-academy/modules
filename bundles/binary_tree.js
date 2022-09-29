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
  function make_empty_tree() {
    return null;
  }
  function make_tree(value, left, right) {
    return [left, value, right];
  }
  exports.make_empty_tree = make_empty_tree;
  exports.make_tree = make_tree;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
})
