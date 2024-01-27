require => {
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
  var binary_tree_exports = {};
  __export(binary_tree_exports, {
    entry: () => entry,
    is_empty_tree: () => is_empty_tree,
    is_tree: () => is_tree,
    left_branch: () => left_branch,
    make_empty_tree: () => make_empty_tree,
    make_tree: () => make_tree,
    right_branch: () => right_branch
  });
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
    throw new Error(`function entry expects binary tree, received: ${t}`);
  }
  function left_branch(t) {
    if (Array.isArray(t) && t.length === 2 && Array.isArray(t[1]) && t[1].length === 2) {
      return t[1][0];
    }
    throw new Error(`function left_branch expects binary tree, received: ${t}`);
  }
  function right_branch(t) {
    if (Array.isArray(t) && t.length === 2 && Array.isArray(t[1]) && t[1].length === 2 && Array.isArray(t[1][1]) && t[1][1].length === 2) {
      return t[1][1][0];
    }
    throw new Error(`function right_branch expects binary tree, received: ${t}`);
  }
  return __toCommonJS(binary_tree_exports);
}