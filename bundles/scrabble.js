function (moduleHelpers) {
  function require(x) {
    const result = ({
      "js-slang/moduleHelpers": moduleHelpers
    })[x];
    if (result === undefined) throw new Error(`Internal Error: Unknown import "${x}"!`); else return result;
  }
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
  var scrabble_exports = {};
  __export(scrabble_exports, {
    arrayLength: () => arrayLength,
    charAt: () => charAt,
    scrabble_array: () => scrabble_array,
    scrabble_list: () => scrabble_list
  });
  var len = scrabble_array.length;
  var current_list = null;
  for (let i = len - 1; i >= 0; i -= 1) {
    current_list = [scrabble_array[i], current_list];
  }
  var scrabble_list = current_list;
  function charAt(s, i) {
    const result = s.charAt(i);
    return result === "" ? void 0 : result;
  }
  function arrayLength(x) {
    return x.length;
  }
  return __toCommonJS(scrabble_exports);
}