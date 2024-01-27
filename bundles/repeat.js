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
  var repeat_exports = {};
  __export(repeat_exports, {
    repeat: () => repeat,
    thrice: () => thrice,
    twice: () => twice
  });
  function repeat(func, n) {
    return n === 0 ? x => x : x => func(repeat(func, n - 1)(x));
  }
  function twice(func) {
    return repeat(func, 2);
  }
  function thrice(func) {
    return repeat(func, 3);
  }
  return __toCommonJS(repeat_exports);
}