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
    return [value, [left, [right, null]]];
  }
  function is_tree(value) {
    return value === null || Array.isArray(value) && value.length === 2 && Array.isArray(value[1]) && value[1].length === 2 && is_tree(value[1][0]) && value[1][1].length === 2 && is_tree(value[1][1][0]) && value[1][1][1] === null;
  }
  function is_empty_tree(value) {
    return value === null;
  }
  function entry(t) {
    if (Array.isArray(t) && t.length === 2) {
      return t[0];
    }
    throw new Error(("function entry expects binary tree, received: ").concat(t));
  }
  function left_branch(t) {
    if (Array.isArray(t) && t.length === 2 && Array.isArray(t[1]) && t[1].length === 2) {
      return t[1][0];
    }
    throw new Error(("function left_branch expects binary tree, received: ").concat(t));
  }
  function right_branch(t) {
    if (Array.isArray(t) && t.length === 2 && Array.isArray(t[1]) && t[1].length === 2 && Array.isArray(t[1][1]) && t[1][1].length === 2) {
      return t[1][1][0];
    }
    throw new Error(("function right_branch expects binary tree, received: ").concat(t));
  }
  exports.entry = entry;
  exports.is_empty_tree = is_empty_tree;
  exports.is_tree = is_tree;
  exports.left_branch = left_branch;
  exports.make_empty_tree = make_empty_tree;
  exports.make_tree = make_tree;
  exports.right_branch = right_branch;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
})
