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
  var len = scrabble_array.length;
  var current_list = null;
  for (var i = len - 1; i >= 0; i -= 1) {
    current_list = [scrabble_array[i], current_list];
  }
  var scrabble_list = current_list;
  function charAt(s, i) {
    var result = s.charAt(i);
    return result === "" ? undefined : result;
  }
  function arrayLength(x) {
    return x.length;
  }
  exports.arrayLength = arrayLength;
  exports.charAt = charAt;
  exports.scrabble_array = scrabble_array;
  exports.scrabble_list = scrabble_list;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
})