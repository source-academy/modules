export default require => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
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
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var index_exports = {};
  __export(index_exports, {
    entry: () => entry,
    is_empty_tree: () => is_empty_tree,
    is_tree: () => is_tree,
    left_branch: () => left_branch,
    make_empty_tree: () => make_empty_tree,
    make_tree: () => make_tree,
    right_branch: () => right_branch
  });
  var import_rttcErrors = __require("js-slang/dist/errors/rttcErrors");
  var import_base = __require("js-slang/dist/errors/base");
  var import_list = __require("js-slang/dist/stdlib/list");
  function make_empty_tree() {
    return null;
  }
  function make_tree(value, left, right) {
    if (!is_tree(left)) {
      throw new import_rttcErrors.InvalidParameterTypeError("binary tree", left, make_tree.name, "left");
    }
    if (!is_tree(right)) {
      throw new import_rttcErrors.InvalidParameterTypeError("binary tree", right, make_tree.name, "right");
    }
    return [value, [left, [right, null]]];
  }
  function is_tree(value) {
    if (is_empty_tree(value)) return true;
    if (!(0, import_list.is_pair)(value)) return false;
    const left = (0, import_list.tail)(value);
    if (!(0, import_list.is_pair)(left) || !is_tree((0, import_list.head)(left))) return false;
    const right = (0, import_list.tail)(left);
    if (!(0, import_list.is_pair)(right) || !is_tree((0, import_list.head)(right))) return false;
    return (0, import_list.is_null)((0, import_list.tail)(right));
  }
  function is_empty_tree(value) {
    return value === null;
  }
  function throwIfNotNonEmptyTree(value, func_name) {
    if (!is_tree(value)) {
      throw new import_rttcErrors.InvalidParameterTypeError("binary tree", value, func_name);
    }
    if (is_empty_tree(value)) {
      throw new import_rttcErrors.InvalidParameterTypeError("non-empty binary tree", value, func_name);
    }
  }
  function entry(t) {
    throwIfNotNonEmptyTree(t, entry.name);
    return (0, import_list.head)(t);
  }
  function left_branch(t) {
    throwIfNotNonEmptyTree(t, left_branch.name);
    return (0, import_list.head)((0, import_list.tail)(t));
  }
  function right_branch(t) {
    throwIfNotNonEmptyTree(t, right_branch.name);
    return (0, import_list.head)((0, import_list.tail)((0, import_list.tail)(t)));
  }
  return __toCommonJS(index_exports);
};