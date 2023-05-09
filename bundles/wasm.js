require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return (fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res);
  };
  var __commonJS = (cb, mod) => function __require() {
    return (mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
      exports: {}
    }).exports, mod), mod.exports);
  };
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
  var define_process_default;
  var init_define_process = __esm({
    "<define:process>"() {
      define_process_default = {
        env: {
          NODE_ENV: "production"
        }
      };
    }
  });
  var require_source_academy_wabt = __commonJS({
    "node_modules/source-academy-wabt/index.js"(exports, module) {
      "use strict";
      init_define_process();
      var __create2 = Object.create;
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf2 = Object.getPrototypeOf;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __commonJS2 = (cb, mod) => function __require() {
        return (mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = {
          exports: {}
        }).exports, mod), mod.exports);
      };
      var __export2 = (target, all) => {
        for (var name in all) __defProp2(target, name, {
          get: all[name],
          enumerable: true
        });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
            get: () => from[key],
            enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
          });
        }
        return to;
      };
      var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", {
        value: mod,
        enumerable: true
      }) : target, mod));
      var __toCommonJS2 = mod => __copyProps2(__defProp2({}, "__esModule", {
        value: true
      }), mod);
      var require_lodash = __commonJS2({
        "node_modules/lodash/lodash.js"(exports2, module2) {
          (function () {
            var undefined2;
            var VERSION = "4.17.21";
            var LARGE_ARRAY_SIZE = 200;
            var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
            var HASH_UNDEFINED = "__lodash_hash_undefined__";
            var MAX_MEMOIZE_SIZE = 500;
            var PLACEHOLDER = "__lodash_placeholder__";
            var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
            var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
            var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
            var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
            var HOT_COUNT = 800, HOT_SPAN = 16;
            var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
            var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
            var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
            var wrapFlags = [["ary", WRAP_ARY_FLAG], ["bind", WRAP_BIND_FLAG], ["bindKey", WRAP_BIND_KEY_FLAG], ["curry", WRAP_CURRY_FLAG], ["curryRight", WRAP_CURRY_RIGHT_FLAG], ["flip", WRAP_FLIP_FLAG], ["partial", WRAP_PARTIAL_FLAG], ["partialRight", WRAP_PARTIAL_RIGHT_FLAG], ["rearg", WRAP_REARG_FLAG]];
            var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
            var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
            var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
            var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
            var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
            var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
            var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
            var reTrimStart = /^\s+/;
            var reWhitespace = /\s/;
            var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
            var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
            var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
            var reEscapeChar = /\\(\\)?/g;
            var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
            var reFlags = /\w*$/;
            var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
            var reIsBinary = /^0b[01]+$/i;
            var reIsHostCtor = /^\[object .+?Constructor\]$/;
            var reIsOctal = /^0o[0-7]+$/i;
            var reIsUint = /^(?:0|[1-9]\d*)$/;
            var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
            var reNoMatch = /($^)/;
            var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
            var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
            var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
            var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
            var reApos = RegExp(rsApos, "g");
            var reComboMark = RegExp(rsCombo, "g");
            var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
            var reUnicodeWord = RegExp([rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")", rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")", rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower, rsUpper + "+" + rsOptContrUpper, rsOrdUpper, rsOrdLower, rsDigits, rsEmoji].join("|"), "g");
            var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
            var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
            var contextProps = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"];
            var templateCounter = -1;
            var typedArrayTags = {};
            typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
            typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
            var cloneableTags = {};
            cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
            cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
            var deburredLetters = {
              "\xC0": "A",
              "\xC1": "A",
              "\xC2": "A",
              "\xC3": "A",
              "\xC4": "A",
              "\xC5": "A",
              "\xE0": "a",
              "\xE1": "a",
              "\xE2": "a",
              "\xE3": "a",
              "\xE4": "a",
              "\xE5": "a",
              "\xC7": "C",
              "\xE7": "c",
              "\xD0": "D",
              "\xF0": "d",
              "\xC8": "E",
              "\xC9": "E",
              "\xCA": "E",
              "\xCB": "E",
              "\xE8": "e",
              "\xE9": "e",
              "\xEA": "e",
              "\xEB": "e",
              "\xCC": "I",
              "\xCD": "I",
              "\xCE": "I",
              "\xCF": "I",
              "\xEC": "i",
              "\xED": "i",
              "\xEE": "i",
              "\xEF": "i",
              "\xD1": "N",
              "\xF1": "n",
              "\xD2": "O",
              "\xD3": "O",
              "\xD4": "O",
              "\xD5": "O",
              "\xD6": "O",
              "\xD8": "O",
              "\xF2": "o",
              "\xF3": "o",
              "\xF4": "o",
              "\xF5": "o",
              "\xF6": "o",
              "\xF8": "o",
              "\xD9": "U",
              "\xDA": "U",
              "\xDB": "U",
              "\xDC": "U",
              "\xF9": "u",
              "\xFA": "u",
              "\xFB": "u",
              "\xFC": "u",
              "\xDD": "Y",
              "\xFD": "y",
              "\xFF": "y",
              "\xC6": "Ae",
              "\xE6": "ae",
              "\xDE": "Th",
              "\xFE": "th",
              "\xDF": "ss",
              "\u0100": "A",
              "\u0102": "A",
              "\u0104": "A",
              "\u0101": "a",
              "\u0103": "a",
              "\u0105": "a",
              "\u0106": "C",
              "\u0108": "C",
              "\u010A": "C",
              "\u010C": "C",
              "\u0107": "c",
              "\u0109": "c",
              "\u010B": "c",
              "\u010D": "c",
              "\u010E": "D",
              "\u0110": "D",
              "\u010F": "d",
              "\u0111": "d",
              "\u0112": "E",
              "\u0114": "E",
              "\u0116": "E",
              "\u0118": "E",
              "\u011A": "E",
              "\u0113": "e",
              "\u0115": "e",
              "\u0117": "e",
              "\u0119": "e",
              "\u011B": "e",
              "\u011C": "G",
              "\u011E": "G",
              "\u0120": "G",
              "\u0122": "G",
              "\u011D": "g",
              "\u011F": "g",
              "\u0121": "g",
              "\u0123": "g",
              "\u0124": "H",
              "\u0126": "H",
              "\u0125": "h",
              "\u0127": "h",
              "\u0128": "I",
              "\u012A": "I",
              "\u012C": "I",
              "\u012E": "I",
              "\u0130": "I",
              "\u0129": "i",
              "\u012B": "i",
              "\u012D": "i",
              "\u012F": "i",
              "\u0131": "i",
              "\u0134": "J",
              "\u0135": "j",
              "\u0136": "K",
              "\u0137": "k",
              "\u0138": "k",
              "\u0139": "L",
              "\u013B": "L",
              "\u013D": "L",
              "\u013F": "L",
              "\u0141": "L",
              "\u013A": "l",
              "\u013C": "l",
              "\u013E": "l",
              "\u0140": "l",
              "\u0142": "l",
              "\u0143": "N",
              "\u0145": "N",
              "\u0147": "N",
              "\u014A": "N",
              "\u0144": "n",
              "\u0146": "n",
              "\u0148": "n",
              "\u014B": "n",
              "\u014C": "O",
              "\u014E": "O",
              "\u0150": "O",
              "\u014D": "o",
              "\u014F": "o",
              "\u0151": "o",
              "\u0154": "R",
              "\u0156": "R",
              "\u0158": "R",
              "\u0155": "r",
              "\u0157": "r",
              "\u0159": "r",
              "\u015A": "S",
              "\u015C": "S",
              "\u015E": "S",
              "\u0160": "S",
              "\u015B": "s",
              "\u015D": "s",
              "\u015F": "s",
              "\u0161": "s",
              "\u0162": "T",
              "\u0164": "T",
              "\u0166": "T",
              "\u0163": "t",
              "\u0165": "t",
              "\u0167": "t",
              "\u0168": "U",
              "\u016A": "U",
              "\u016C": "U",
              "\u016E": "U",
              "\u0170": "U",
              "\u0172": "U",
              "\u0169": "u",
              "\u016B": "u",
              "\u016D": "u",
              "\u016F": "u",
              "\u0171": "u",
              "\u0173": "u",
              "\u0174": "W",
              "\u0175": "w",
              "\u0176": "Y",
              "\u0177": "y",
              "\u0178": "Y",
              "\u0179": "Z",
              "\u017B": "Z",
              "\u017D": "Z",
              "\u017A": "z",
              "\u017C": "z",
              "\u017E": "z",
              "\u0132": "IJ",
              "\u0133": "ij",
              "\u0152": "Oe",
              "\u0153": "oe",
              "\u0149": "'n",
              "\u017F": "s"
            };
            var htmlEscapes = {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;"
            };
            var htmlUnescapes = {
              "&amp;": "&",
              "&lt;": "<",
              "&gt;": ">",
              "&quot;": '"',
              "&#39;": "'"
            };
            var stringEscapes = {
              "\\": "\\",
              "'": "'",
              "\n": "n",
              "\r": "r",
              "\u2028": "u2028",
              "\u2029": "u2029"
            };
            var freeParseFloat = parseFloat, freeParseInt = parseInt;
            var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
            var freeSelf = typeof self == "object" && self && self.Object === Object && self;
            var root = freeGlobal || freeSelf || Function("return this")();
            var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
            var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
            var moduleExports = freeModule && freeModule.exports === freeExports;
            var freeProcess = moduleExports && freeGlobal.process;
            var nodeUtil = (function () {
              try {
                var types = freeModule && freeModule.require && freeModule.require("util").types;
                if (types) {
                  return types;
                }
                return freeProcess && freeProcess.binding && freeProcess.binding("util");
              } catch (e) {}
            })();
            var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
            function apply(func, thisArg, args) {
              switch (args.length) {
                case 0:
                  return func.call(thisArg);
                case 1:
                  return func.call(thisArg, args[0]);
                case 2:
                  return func.call(thisArg, args[0], args[1]);
                case 3:
                  return func.call(thisArg, args[0], args[1], args[2]);
              }
              return func.apply(thisArg, args);
            }
            function arrayAggregator(array, setter, iteratee, accumulator) {
              var index = -1, length = array == null ? 0 : array.length;
              while (++index < length) {
                var value = array[index];
                setter(accumulator, value, iteratee(value), array);
              }
              return accumulator;
            }
            function arrayEach(array, iteratee) {
              var index = -1, length = array == null ? 0 : array.length;
              while (++index < length) {
                if (iteratee(array[index], index, array) === false) {
                  break;
                }
              }
              return array;
            }
            function arrayEachRight(array, iteratee) {
              var length = array == null ? 0 : array.length;
              while (length--) {
                if (iteratee(array[length], length, array) === false) {
                  break;
                }
              }
              return array;
            }
            function arrayEvery(array, predicate) {
              var index = -1, length = array == null ? 0 : array.length;
              while (++index < length) {
                if (!predicate(array[index], index, array)) {
                  return false;
                }
              }
              return true;
            }
            function arrayFilter(array, predicate) {
              var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
              while (++index < length) {
                var value = array[index];
                if (predicate(value, index, array)) {
                  result[resIndex++] = value;
                }
              }
              return result;
            }
            function arrayIncludes(array, value) {
              var length = array == null ? 0 : array.length;
              return !!length && baseIndexOf(array, value, 0) > -1;
            }
            function arrayIncludesWith(array, value, comparator) {
              var index = -1, length = array == null ? 0 : array.length;
              while (++index < length) {
                if (comparator(value, array[index])) {
                  return true;
                }
              }
              return false;
            }
            function arrayMap(array, iteratee) {
              var index = -1, length = array == null ? 0 : array.length, result = Array(length);
              while (++index < length) {
                result[index] = iteratee(array[index], index, array);
              }
              return result;
            }
            function arrayPush(array, values) {
              var index = -1, length = values.length, offset = array.length;
              while (++index < length) {
                array[offset + index] = values[index];
              }
              return array;
            }
            function arrayReduce(array, iteratee, accumulator, initAccum) {
              var index = -1, length = array == null ? 0 : array.length;
              if (initAccum && length) {
                accumulator = array[++index];
              }
              while (++index < length) {
                accumulator = iteratee(accumulator, array[index], index, array);
              }
              return accumulator;
            }
            function arrayReduceRight(array, iteratee, accumulator, initAccum) {
              var length = array == null ? 0 : array.length;
              if (initAccum && length) {
                accumulator = array[--length];
              }
              while (length--) {
                accumulator = iteratee(accumulator, array[length], length, array);
              }
              return accumulator;
            }
            function arraySome(array, predicate) {
              var index = -1, length = array == null ? 0 : array.length;
              while (++index < length) {
                if (predicate(array[index], index, array)) {
                  return true;
                }
              }
              return false;
            }
            var asciiSize = baseProperty("length");
            function asciiToArray(string) {
              return string.split("");
            }
            function asciiWords(string) {
              return string.match(reAsciiWord) || [];
            }
            function baseFindKey(collection, predicate, eachFunc) {
              var result;
              eachFunc(collection, function (value, key, collection2) {
                if (predicate(value, key, collection2)) {
                  result = key;
                  return false;
                }
              });
              return result;
            }
            function baseFindIndex(array, predicate, fromIndex, fromRight) {
              var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
              while (fromRight ? index-- : ++index < length) {
                if (predicate(array[index], index, array)) {
                  return index;
                }
              }
              return -1;
            }
            function baseIndexOf(array, value, fromIndex) {
              return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
            }
            function baseIndexOfWith(array, value, fromIndex, comparator) {
              var index = fromIndex - 1, length = array.length;
              while (++index < length) {
                if (comparator(array[index], value)) {
                  return index;
                }
              }
              return -1;
            }
            function baseIsNaN(value) {
              return value !== value;
            }
            function baseMean(array, iteratee) {
              var length = array == null ? 0 : array.length;
              return length ? baseSum(array, iteratee) / length : NAN;
            }
            function baseProperty(key) {
              return function (object) {
                return object == null ? undefined2 : object[key];
              };
            }
            function basePropertyOf(object) {
              return function (key) {
                return object == null ? undefined2 : object[key];
              };
            }
            function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
              eachFunc(collection, function (value, index, collection2) {
                accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
              });
              return accumulator;
            }
            function baseSortBy(array, comparer) {
              var length = array.length;
              array.sort(comparer);
              while (length--) {
                array[length] = array[length].value;
              }
              return array;
            }
            function baseSum(array, iteratee) {
              var result, index = -1, length = array.length;
              while (++index < length) {
                var current = iteratee(array[index]);
                if (current !== undefined2) {
                  result = result === undefined2 ? current : result + current;
                }
              }
              return result;
            }
            function baseTimes(n, iteratee) {
              var index = -1, result = Array(n);
              while (++index < n) {
                result[index] = iteratee(index);
              }
              return result;
            }
            function baseToPairs(object, props) {
              return arrayMap(props, function (key) {
                return [key, object[key]];
              });
            }
            function baseTrim(string) {
              return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
            }
            function baseUnary(func) {
              return function (value) {
                return func(value);
              };
            }
            function baseValues(object, props) {
              return arrayMap(props, function (key) {
                return object[key];
              });
            }
            function cacheHas(cache, key) {
              return cache.has(key);
            }
            function charsStartIndex(strSymbols, chrSymbols) {
              var index = -1, length = strSymbols.length;
              while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
              return index;
            }
            function charsEndIndex(strSymbols, chrSymbols) {
              var index = strSymbols.length;
              while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
              return index;
            }
            function countHolders(array, placeholder) {
              var length = array.length, result = 0;
              while (length--) {
                if (array[length] === placeholder) {
                  ++result;
                }
              }
              return result;
            }
            var deburrLetter = basePropertyOf(deburredLetters);
            var escapeHtmlChar = basePropertyOf(htmlEscapes);
            function escapeStringChar(chr) {
              return "\\" + stringEscapes[chr];
            }
            function getValue(object, key) {
              return object == null ? undefined2 : object[key];
            }
            function hasUnicode(string) {
              return reHasUnicode.test(string);
            }
            function hasUnicodeWord(string) {
              return reHasUnicodeWord.test(string);
            }
            function iteratorToArray(iterator) {
              var data, result = [];
              while (!(data = iterator.next()).done) {
                result.push(data.value);
              }
              return result;
            }
            function mapToArray(map) {
              var index = -1, result = Array(map.size);
              map.forEach(function (value, key) {
                result[++index] = [key, value];
              });
              return result;
            }
            function overArg(func, transform) {
              return function (arg) {
                return func(transform(arg));
              };
            }
            function replaceHolders(array, placeholder) {
              var index = -1, length = array.length, resIndex = 0, result = [];
              while (++index < length) {
                var value = array[index];
                if (value === placeholder || value === PLACEHOLDER) {
                  array[index] = PLACEHOLDER;
                  result[resIndex++] = index;
                }
              }
              return result;
            }
            function setToArray(set) {
              var index = -1, result = Array(set.size);
              set.forEach(function (value) {
                result[++index] = value;
              });
              return result;
            }
            function setToPairs(set) {
              var index = -1, result = Array(set.size);
              set.forEach(function (value) {
                result[++index] = [value, value];
              });
              return result;
            }
            function strictIndexOf(array, value, fromIndex) {
              var index = fromIndex - 1, length = array.length;
              while (++index < length) {
                if (array[index] === value) {
                  return index;
                }
              }
              return -1;
            }
            function strictLastIndexOf(array, value, fromIndex) {
              var index = fromIndex + 1;
              while (index--) {
                if (array[index] === value) {
                  return index;
                }
              }
              return index;
            }
            function stringSize(string) {
              return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
            }
            function stringToArray(string) {
              return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
            }
            function trimmedEndIndex(string) {
              var index = string.length;
              while (index-- && reWhitespace.test(string.charAt(index))) {}
              return index;
            }
            var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
            function unicodeSize(string) {
              var result = reUnicode.lastIndex = 0;
              while (reUnicode.test(string)) {
                ++result;
              }
              return result;
            }
            function unicodeToArray(string) {
              return string.match(reUnicode) || [];
            }
            function unicodeWords(string) {
              return string.match(reUnicodeWord) || [];
            }
            var runInContext = function runInContext2(context) {
              context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
              var Array2 = context.Array, Date = context.Date, Error2 = context.Error, Function2 = context.Function, Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String = context.String, TypeError2 = context.TypeError;
              var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
              var coreJsData = context["__core-js_shared__"];
              var funcToString = funcProto.toString;
              var hasOwnProperty = objectProto.hasOwnProperty;
              var idCounter = 0;
              var maskSrcKey = (function () {
                var uid = (/[^.]+$/).exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
                return uid ? "Symbol(src)_1." + uid : "";
              })();
              var nativeObjectToString = objectProto.toString;
              var objectCtorString = funcToString.call(Object2);
              var oldDash = root._;
              var reIsNative = RegExp2("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
              var Buffer2 = moduleExports ? context.Buffer : undefined2, Symbol2 = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined2, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined2, symIterator = Symbol2 ? Symbol2.iterator : undefined2, symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined2;
              var defineProperty = (function () {
                try {
                  var func = getNative(Object2, "defineProperty");
                  func({}, "", {});
                  return func;
                } catch (e) {}
              })();
              var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date && Date.now !== root.Date.now && Date.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
              var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined2, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
              var DataView2 = getNative(context, "DataView"), Map2 = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set2 = getNative(context, "Set"), WeakMap2 = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
              var metaMap = WeakMap2 && new WeakMap2();
              var realNames = {};
              var dataViewCtorString = toSource(DataView2), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap2);
              var symbolProto = Symbol2 ? Symbol2.prototype : undefined2, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined2, symbolToString = symbolProto ? symbolProto.toString : undefined2;
              function lodash(value) {
                if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
                  if (value instanceof LodashWrapper) {
                    return value;
                  }
                  if (hasOwnProperty.call(value, "__wrapped__")) {
                    return wrapperClone(value);
                  }
                }
                return new LodashWrapper(value);
              }
              var baseCreate = (function () {
                function object() {}
                return function (proto) {
                  if (!isObject(proto)) {
                    return {};
                  }
                  if (objectCreate) {
                    return objectCreate(proto);
                  }
                  object.prototype = proto;
                  var result2 = new object();
                  object.prototype = undefined2;
                  return result2;
                };
              })();
              function baseLodash() {}
              function LodashWrapper(value, chainAll) {
                this.__wrapped__ = value;
                this.__actions__ = [];
                this.__chain__ = !!chainAll;
                this.__index__ = 0;
                this.__values__ = undefined2;
              }
              lodash.templateSettings = {
                "escape": reEscape,
                "evaluate": reEvaluate,
                "interpolate": reInterpolate,
                "variable": "",
                "imports": {
                  "_": lodash
                }
              };
              lodash.prototype = baseLodash.prototype;
              lodash.prototype.constructor = lodash;
              LodashWrapper.prototype = baseCreate(baseLodash.prototype);
              LodashWrapper.prototype.constructor = LodashWrapper;
              function LazyWrapper(value) {
                this.__wrapped__ = value;
                this.__actions__ = [];
                this.__dir__ = 1;
                this.__filtered__ = false;
                this.__iteratees__ = [];
                this.__takeCount__ = MAX_ARRAY_LENGTH;
                this.__views__ = [];
              }
              function lazyClone() {
                var result2 = new LazyWrapper(this.__wrapped__);
                result2.__actions__ = copyArray(this.__actions__);
                result2.__dir__ = this.__dir__;
                result2.__filtered__ = this.__filtered__;
                result2.__iteratees__ = copyArray(this.__iteratees__);
                result2.__takeCount__ = this.__takeCount__;
                result2.__views__ = copyArray(this.__views__);
                return result2;
              }
              function lazyReverse() {
                if (this.__filtered__) {
                  var result2 = new LazyWrapper(this);
                  result2.__dir__ = -1;
                  result2.__filtered__ = true;
                } else {
                  result2 = this.clone();
                  result2.__dir__ *= -1;
                }
                return result2;
              }
              function lazyValue() {
                var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
                if (!isArr || !isRight && arrLength == length && takeCount == length) {
                  return baseWrapperValue(array, this.__actions__);
                }
                var result2 = [];
                outer: while (length-- && resIndex < takeCount) {
                  index += dir;
                  var iterIndex = -1, value = array[index];
                  while (++iterIndex < iterLength) {
                    var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
                    if (type == LAZY_MAP_FLAG) {
                      value = computed;
                    } else if (!computed) {
                      if (type == LAZY_FILTER_FLAG) {
                        continue outer;
                      } else {
                        break outer;
                      }
                    }
                  }
                  result2[resIndex++] = value;
                }
                return result2;
              }
              LazyWrapper.prototype = baseCreate(baseLodash.prototype);
              LazyWrapper.prototype.constructor = LazyWrapper;
              function Hash(entries) {
                var index = -1, length = entries == null ? 0 : entries.length;
                this.clear();
                while (++index < length) {
                  var entry = entries[index];
                  this.set(entry[0], entry[1]);
                }
              }
              function hashClear() {
                this.__data__ = nativeCreate ? nativeCreate(null) : {};
                this.size = 0;
              }
              function hashDelete(key) {
                var result2 = this.has(key) && delete this.__data__[key];
                this.size -= result2 ? 1 : 0;
                return result2;
              }
              function hashGet(key) {
                var data = this.__data__;
                if (nativeCreate) {
                  var result2 = data[key];
                  return result2 === HASH_UNDEFINED ? undefined2 : result2;
                }
                return hasOwnProperty.call(data, key) ? data[key] : undefined2;
              }
              function hashHas(key) {
                var data = this.__data__;
                return nativeCreate ? data[key] !== undefined2 : hasOwnProperty.call(data, key);
              }
              function hashSet(key, value) {
                var data = this.__data__;
                this.size += this.has(key) ? 0 : 1;
                data[key] = nativeCreate && value === undefined2 ? HASH_UNDEFINED : value;
                return this;
              }
              Hash.prototype.clear = hashClear;
              Hash.prototype["delete"] = hashDelete;
              Hash.prototype.get = hashGet;
              Hash.prototype.has = hashHas;
              Hash.prototype.set = hashSet;
              function ListCache(entries) {
                var index = -1, length = entries == null ? 0 : entries.length;
                this.clear();
                while (++index < length) {
                  var entry = entries[index];
                  this.set(entry[0], entry[1]);
                }
              }
              function listCacheClear() {
                this.__data__ = [];
                this.size = 0;
              }
              function listCacheDelete(key) {
                var data = this.__data__, index = assocIndexOf(data, key);
                if (index < 0) {
                  return false;
                }
                var lastIndex = data.length - 1;
                if (index == lastIndex) {
                  data.pop();
                } else {
                  splice.call(data, index, 1);
                }
                --this.size;
                return true;
              }
              function listCacheGet(key) {
                var data = this.__data__, index = assocIndexOf(data, key);
                return index < 0 ? undefined2 : data[index][1];
              }
              function listCacheHas(key) {
                return assocIndexOf(this.__data__, key) > -1;
              }
              function listCacheSet(key, value) {
                var data = this.__data__, index = assocIndexOf(data, key);
                if (index < 0) {
                  ++this.size;
                  data.push([key, value]);
                } else {
                  data[index][1] = value;
                }
                return this;
              }
              ListCache.prototype.clear = listCacheClear;
              ListCache.prototype["delete"] = listCacheDelete;
              ListCache.prototype.get = listCacheGet;
              ListCache.prototype.has = listCacheHas;
              ListCache.prototype.set = listCacheSet;
              function MapCache(entries) {
                var index = -1, length = entries == null ? 0 : entries.length;
                this.clear();
                while (++index < length) {
                  var entry = entries[index];
                  this.set(entry[0], entry[1]);
                }
              }
              function mapCacheClear() {
                this.size = 0;
                this.__data__ = {
                  "hash": new Hash(),
                  "map": new (Map2 || ListCache)(),
                  "string": new Hash()
                };
              }
              function mapCacheDelete(key) {
                var result2 = getMapData(this, key)["delete"](key);
                this.size -= result2 ? 1 : 0;
                return result2;
              }
              function mapCacheGet(key) {
                return getMapData(this, key).get(key);
              }
              function mapCacheHas(key) {
                return getMapData(this, key).has(key);
              }
              function mapCacheSet(key, value) {
                var data = getMapData(this, key), size2 = data.size;
                data.set(key, value);
                this.size += data.size == size2 ? 0 : 1;
                return this;
              }
              MapCache.prototype.clear = mapCacheClear;
              MapCache.prototype["delete"] = mapCacheDelete;
              MapCache.prototype.get = mapCacheGet;
              MapCache.prototype.has = mapCacheHas;
              MapCache.prototype.set = mapCacheSet;
              function SetCache(values2) {
                var index = -1, length = values2 == null ? 0 : values2.length;
                this.__data__ = new MapCache();
                while (++index < length) {
                  this.add(values2[index]);
                }
              }
              function setCacheAdd(value) {
                this.__data__.set(value, HASH_UNDEFINED);
                return this;
              }
              function setCacheHas(value) {
                return this.__data__.has(value);
              }
              SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
              SetCache.prototype.has = setCacheHas;
              function Stack(entries) {
                var data = this.__data__ = new ListCache(entries);
                this.size = data.size;
              }
              function stackClear() {
                this.__data__ = new ListCache();
                this.size = 0;
              }
              function stackDelete(key) {
                var data = this.__data__, result2 = data["delete"](key);
                this.size = data.size;
                return result2;
              }
              function stackGet(key) {
                return this.__data__.get(key);
              }
              function stackHas(key) {
                return this.__data__.has(key);
              }
              function stackSet(key, value) {
                var data = this.__data__;
                if (data instanceof ListCache) {
                  var pairs = data.__data__;
                  if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
                    pairs.push([key, value]);
                    this.size = ++data.size;
                    return this;
                  }
                  data = this.__data__ = new MapCache(pairs);
                }
                data.set(key, value);
                this.size = data.size;
                return this;
              }
              Stack.prototype.clear = stackClear;
              Stack.prototype["delete"] = stackDelete;
              Stack.prototype.get = stackGet;
              Stack.prototype.has = stackHas;
              Stack.prototype.set = stackSet;
              function arrayLikeKeys(value, inherited) {
                var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String) : [], length = result2.length;
                for (var key in value) {
                  if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
                    result2.push(key);
                  }
                }
                return result2;
              }
              function arraySample(array) {
                var length = array.length;
                return length ? array[baseRandom(0, length - 1)] : undefined2;
              }
              function arraySampleSize(array, n) {
                return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
              }
              function arrayShuffle(array) {
                return shuffleSelf(copyArray(array));
              }
              function assignMergeValue(object, key, value) {
                if (value !== undefined2 && !eq(object[key], value) || value === undefined2 && !((key in object))) {
                  baseAssignValue(object, key, value);
                }
              }
              function assignValue(object, key, value) {
                var objValue = object[key];
                if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined2 && !((key in object))) {
                  baseAssignValue(object, key, value);
                }
              }
              function assocIndexOf(array, key) {
                var length = array.length;
                while (length--) {
                  if (eq(array[length][0], key)) {
                    return length;
                  }
                }
                return -1;
              }
              function baseAggregator(collection, setter, iteratee2, accumulator) {
                baseEach(collection, function (value, key, collection2) {
                  setter(accumulator, value, iteratee2(value), collection2);
                });
                return accumulator;
              }
              function baseAssign(object, source) {
                return object && copyObject(source, keys(source), object);
              }
              function baseAssignIn(object, source) {
                return object && copyObject(source, keysIn(source), object);
              }
              function baseAssignValue(object, key, value) {
                if (key == "__proto__" && defineProperty) {
                  defineProperty(object, key, {
                    "configurable": true,
                    "enumerable": true,
                    "value": value,
                    "writable": true
                  });
                } else {
                  object[key] = value;
                }
              }
              function baseAt(object, paths) {
                var index = -1, length = paths.length, result2 = Array2(length), skip = object == null;
                while (++index < length) {
                  result2[index] = skip ? undefined2 : get(object, paths[index]);
                }
                return result2;
              }
              function baseClamp(number, lower, upper) {
                if (number === number) {
                  if (upper !== undefined2) {
                    number = number <= upper ? number : upper;
                  }
                  if (lower !== undefined2) {
                    number = number >= lower ? number : lower;
                  }
                }
                return number;
              }
              function baseClone(value, bitmask, customizer, key, object, stack) {
                var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
                if (customizer) {
                  result2 = object ? customizer(value, key, object, stack) : customizer(value);
                }
                if (result2 !== undefined2) {
                  return result2;
                }
                if (!isObject(value)) {
                  return value;
                }
                var isArr = isArray(value);
                if (isArr) {
                  result2 = initCloneArray(value);
                  if (!isDeep) {
                    return copyArray(value, result2);
                  }
                } else {
                  var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
                  if (isBuffer(value)) {
                    return cloneBuffer(value, isDeep);
                  }
                  if (tag == objectTag || tag == argsTag || isFunc && !object) {
                    result2 = isFlat || isFunc ? {} : initCloneObject(value);
                    if (!isDeep) {
                      return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
                    }
                  } else {
                    if (!cloneableTags[tag]) {
                      return object ? value : {};
                    }
                    result2 = initCloneByTag(value, tag, isDeep);
                  }
                }
                stack || (stack = new Stack());
                var stacked = stack.get(value);
                if (stacked) {
                  return stacked;
                }
                stack.set(value, result2);
                if (isSet(value)) {
                  value.forEach(function (subValue) {
                    result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
                  });
                } else if (isMap(value)) {
                  value.forEach(function (subValue, key2) {
                    result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
                  });
                }
                var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
                var props = isArr ? undefined2 : keysFunc(value);
                arrayEach(props || value, function (subValue, key2) {
                  if (props) {
                    key2 = subValue;
                    subValue = value[key2];
                  }
                  assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
                });
                return result2;
              }
              function baseConforms(source) {
                var props = keys(source);
                return function (object) {
                  return baseConformsTo(object, source, props);
                };
              }
              function baseConformsTo(object, source, props) {
                var length = props.length;
                if (object == null) {
                  return !length;
                }
                object = Object2(object);
                while (length--) {
                  var key = props[length], predicate = source[key], value = object[key];
                  if (value === undefined2 && !((key in object)) || !predicate(value)) {
                    return false;
                  }
                }
                return true;
              }
              function baseDelay(func, wait, args) {
                if (typeof func != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                return setTimeout(function () {
                  func.apply(undefined2, args);
                }, wait);
              }
              function baseDifference(array, values2, iteratee2, comparator) {
                var index = -1, includes2 = arrayIncludes, isCommon = true, length = array.length, result2 = [], valuesLength = values2.length;
                if (!length) {
                  return result2;
                }
                if (iteratee2) {
                  values2 = arrayMap(values2, baseUnary(iteratee2));
                }
                if (comparator) {
                  includes2 = arrayIncludesWith;
                  isCommon = false;
                } else if (values2.length >= LARGE_ARRAY_SIZE) {
                  includes2 = cacheHas;
                  isCommon = false;
                  values2 = new SetCache(values2);
                }
                outer: while (++index < length) {
                  var value = array[index], computed = iteratee2 == null ? value : iteratee2(value);
                  value = comparator || value !== 0 ? value : 0;
                  if (isCommon && computed === computed) {
                    var valuesIndex = valuesLength;
                    while (valuesIndex--) {
                      if (values2[valuesIndex] === computed) {
                        continue outer;
                      }
                    }
                    result2.push(value);
                  } else if (!includes2(values2, computed, comparator)) {
                    result2.push(value);
                  }
                }
                return result2;
              }
              var baseEach = createBaseEach(baseForOwn);
              var baseEachRight = createBaseEach(baseForOwnRight, true);
              function baseEvery(collection, predicate) {
                var result2 = true;
                baseEach(collection, function (value, index, collection2) {
                  result2 = !!predicate(value, index, collection2);
                  return result2;
                });
                return result2;
              }
              function baseExtremum(array, iteratee2, comparator) {
                var index = -1, length = array.length;
                while (++index < length) {
                  var value = array[index], current = iteratee2(value);
                  if (current != null && (computed === undefined2 ? current === current && !isSymbol(current) : comparator(current, computed))) {
                    var computed = current, result2 = value;
                  }
                }
                return result2;
              }
              function baseFill(array, value, start, end) {
                var length = array.length;
                start = toInteger(start);
                if (start < 0) {
                  start = -start > length ? 0 : length + start;
                }
                end = end === undefined2 || end > length ? length : toInteger(end);
                if (end < 0) {
                  end += length;
                }
                end = start > end ? 0 : toLength(end);
                while (start < end) {
                  array[start++] = value;
                }
                return array;
              }
              function baseFilter(collection, predicate) {
                var result2 = [];
                baseEach(collection, function (value, index, collection2) {
                  if (predicate(value, index, collection2)) {
                    result2.push(value);
                  }
                });
                return result2;
              }
              function baseFlatten(array, depth, predicate, isStrict, result2) {
                var index = -1, length = array.length;
                predicate || (predicate = isFlattenable);
                result2 || (result2 = []);
                while (++index < length) {
                  var value = array[index];
                  if (depth > 0 && predicate(value)) {
                    if (depth > 1) {
                      baseFlatten(value, depth - 1, predicate, isStrict, result2);
                    } else {
                      arrayPush(result2, value);
                    }
                  } else if (!isStrict) {
                    result2[result2.length] = value;
                  }
                }
                return result2;
              }
              var baseFor = createBaseFor();
              var baseForRight = createBaseFor(true);
              function baseForOwn(object, iteratee2) {
                return object && baseFor(object, iteratee2, keys);
              }
              function baseForOwnRight(object, iteratee2) {
                return object && baseForRight(object, iteratee2, keys);
              }
              function baseFunctions(object, props) {
                return arrayFilter(props, function (key) {
                  return isFunction(object[key]);
                });
              }
              function baseGet(object, path) {
                path = castPath(path, object);
                var index = 0, length = path.length;
                while (object != null && index < length) {
                  object = object[toKey(path[index++])];
                }
                return index && index == length ? object : undefined2;
              }
              function baseGetAllKeys(object, keysFunc, symbolsFunc) {
                var result2 = keysFunc(object);
                return isArray(object) ? result2 : arrayPush(result2, symbolsFunc(object));
              }
              function baseGetTag(value) {
                if (value == null) {
                  return value === undefined2 ? undefinedTag : nullTag;
                }
                return symToStringTag && (symToStringTag in Object2(value)) ? getRawTag(value) : objectToString(value);
              }
              function baseGt(value, other) {
                return value > other;
              }
              function baseHas(object, key) {
                return object != null && hasOwnProperty.call(object, key);
              }
              function baseHasIn(object, key) {
                return object != null && (key in Object2(object));
              }
              function baseInRange(number, start, end) {
                return number >= nativeMin(start, end) && number < nativeMax(start, end);
              }
              function baseIntersection(arrays, iteratee2, comparator) {
                var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
                while (othIndex--) {
                  var array = arrays[othIndex];
                  if (othIndex && iteratee2) {
                    array = arrayMap(array, baseUnary(iteratee2));
                  }
                  maxLength = nativeMin(array.length, maxLength);
                  caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined2;
                }
                array = arrays[0];
                var index = -1, seen = caches[0];
                outer: while (++index < length && result2.length < maxLength) {
                  var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
                  value = comparator || value !== 0 ? value : 0;
                  if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
                    othIndex = othLength;
                    while (--othIndex) {
                      var cache = caches[othIndex];
                      if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                        continue outer;
                      }
                    }
                    if (seen) {
                      seen.push(computed);
                    }
                    result2.push(value);
                  }
                }
                return result2;
              }
              function baseInverter(object, setter, iteratee2, accumulator) {
                baseForOwn(object, function (value, key, object2) {
                  setter(accumulator, iteratee2(value), key, object2);
                });
                return accumulator;
              }
              function baseInvoke(object, path, args) {
                path = castPath(path, object);
                object = parent(object, path);
                var func = object == null ? object : object[toKey(last(path))];
                return func == null ? undefined2 : apply(func, object, args);
              }
              function baseIsArguments(value) {
                return isObjectLike(value) && baseGetTag(value) == argsTag;
              }
              function baseIsArrayBuffer(value) {
                return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
              }
              function baseIsDate(value) {
                return isObjectLike(value) && baseGetTag(value) == dateTag;
              }
              function baseIsEqual(value, other, bitmask, customizer, stack) {
                if (value === other) {
                  return true;
                }
                if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
                  return value !== value && other !== other;
                }
                return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
              }
              function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
                var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
                objTag = objTag == argsTag ? objectTag : objTag;
                othTag = othTag == argsTag ? objectTag : othTag;
                var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
                if (isSameTag && isBuffer(object)) {
                  if (!isBuffer(other)) {
                    return false;
                  }
                  objIsArr = true;
                  objIsObj = false;
                }
                if (isSameTag && !objIsObj) {
                  stack || (stack = new Stack());
                  return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
                }
                if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
                  var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
                  if (objIsWrapped || othIsWrapped) {
                    var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
                    stack || (stack = new Stack());
                    return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
                  }
                }
                if (!isSameTag) {
                  return false;
                }
                stack || (stack = new Stack());
                return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
              }
              function baseIsMap(value) {
                return isObjectLike(value) && getTag(value) == mapTag;
              }
              function baseIsMatch(object, source, matchData, customizer) {
                var index = matchData.length, length = index, noCustomizer = !customizer;
                if (object == null) {
                  return !length;
                }
                object = Object2(object);
                while (index--) {
                  var data = matchData[index];
                  if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !((data[0] in object))) {
                    return false;
                  }
                }
                while (++index < length) {
                  data = matchData[index];
                  var key = data[0], objValue = object[key], srcValue = data[1];
                  if (noCustomizer && data[2]) {
                    if (objValue === undefined2 && !((key in object))) {
                      return false;
                    }
                  } else {
                    var stack = new Stack();
                    if (customizer) {
                      var result2 = customizer(objValue, srcValue, key, object, source, stack);
                    }
                    if (!(result2 === undefined2 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
                      return false;
                    }
                  }
                }
                return true;
              }
              function baseIsNative(value) {
                if (!isObject(value) || isMasked(value)) {
                  return false;
                }
                var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
                return pattern.test(toSource(value));
              }
              function baseIsRegExp(value) {
                return isObjectLike(value) && baseGetTag(value) == regexpTag;
              }
              function baseIsSet(value) {
                return isObjectLike(value) && getTag(value) == setTag;
              }
              function baseIsTypedArray(value) {
                return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
              }
              function baseIteratee(value) {
                if (typeof value == "function") {
                  return value;
                }
                if (value == null) {
                  return identity;
                }
                if (typeof value == "object") {
                  return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
                }
                return property(value);
              }
              function baseKeys(object) {
                if (!isPrototype(object)) {
                  return nativeKeys(object);
                }
                var result2 = [];
                for (var key in Object2(object)) {
                  if (hasOwnProperty.call(object, key) && key != "constructor") {
                    result2.push(key);
                  }
                }
                return result2;
              }
              function baseKeysIn(object) {
                if (!isObject(object)) {
                  return nativeKeysIn(object);
                }
                var isProto = isPrototype(object), result2 = [];
                for (var key in object) {
                  if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
                    result2.push(key);
                  }
                }
                return result2;
              }
              function baseLt(value, other) {
                return value < other;
              }
              function baseMap(collection, iteratee2) {
                var index = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
                baseEach(collection, function (value, key, collection2) {
                  result2[++index] = iteratee2(value, key, collection2);
                });
                return result2;
              }
              function baseMatches(source) {
                var matchData = getMatchData(source);
                if (matchData.length == 1 && matchData[0][2]) {
                  return matchesStrictComparable(matchData[0][0], matchData[0][1]);
                }
                return function (object) {
                  return object === source || baseIsMatch(object, source, matchData);
                };
              }
              function baseMatchesProperty(path, srcValue) {
                if (isKey(path) && isStrictComparable(srcValue)) {
                  return matchesStrictComparable(toKey(path), srcValue);
                }
                return function (object) {
                  var objValue = get(object, path);
                  return objValue === undefined2 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
                };
              }
              function baseMerge(object, source, srcIndex, customizer, stack) {
                if (object === source) {
                  return;
                }
                baseFor(source, function (srcValue, key) {
                  stack || (stack = new Stack());
                  if (isObject(srcValue)) {
                    baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
                  } else {
                    var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined2;
                    if (newValue === undefined2) {
                      newValue = srcValue;
                    }
                    assignMergeValue(object, key, newValue);
                  }
                }, keysIn);
              }
              function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
                var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
                if (stacked) {
                  assignMergeValue(object, key, stacked);
                  return;
                }
                var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined2;
                var isCommon = newValue === undefined2;
                if (isCommon) {
                  var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
                  newValue = srcValue;
                  if (isArr || isBuff || isTyped) {
                    if (isArray(objValue)) {
                      newValue = objValue;
                    } else if (isArrayLikeObject(objValue)) {
                      newValue = copyArray(objValue);
                    } else if (isBuff) {
                      isCommon = false;
                      newValue = cloneBuffer(srcValue, true);
                    } else if (isTyped) {
                      isCommon = false;
                      newValue = cloneTypedArray(srcValue, true);
                    } else {
                      newValue = [];
                    }
                  } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
                    newValue = objValue;
                    if (isArguments(objValue)) {
                      newValue = toPlainObject(objValue);
                    } else if (!isObject(objValue) || isFunction(objValue)) {
                      newValue = initCloneObject(srcValue);
                    }
                  } else {
                    isCommon = false;
                  }
                }
                if (isCommon) {
                  stack.set(srcValue, newValue);
                  mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
                  stack["delete"](srcValue);
                }
                assignMergeValue(object, key, newValue);
              }
              function baseNth(array, n) {
                var length = array.length;
                if (!length) {
                  return;
                }
                n += n < 0 ? length : 0;
                return isIndex(n, length) ? array[n] : undefined2;
              }
              function baseOrderBy(collection, iteratees, orders) {
                if (iteratees.length) {
                  iteratees = arrayMap(iteratees, function (iteratee2) {
                    if (isArray(iteratee2)) {
                      return function (value) {
                        return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
                      };
                    }
                    return iteratee2;
                  });
                } else {
                  iteratees = [identity];
                }
                var index = -1;
                iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
                var result2 = baseMap(collection, function (value, key, collection2) {
                  var criteria = arrayMap(iteratees, function (iteratee2) {
                    return iteratee2(value);
                  });
                  return {
                    "criteria": criteria,
                    "index": ++index,
                    "value": value
                  };
                });
                return baseSortBy(result2, function (object, other) {
                  return compareMultiple(object, other, orders);
                });
              }
              function basePick(object, paths) {
                return basePickBy(object, paths, function (value, path) {
                  return hasIn(object, path);
                });
              }
              function basePickBy(object, paths, predicate) {
                var index = -1, length = paths.length, result2 = {};
                while (++index < length) {
                  var path = paths[index], value = baseGet(object, path);
                  if (predicate(value, path)) {
                    baseSet(result2, castPath(path, object), value);
                  }
                }
                return result2;
              }
              function basePropertyDeep(path) {
                return function (object) {
                  return baseGet(object, path);
                };
              }
              function basePullAll(array, values2, iteratee2, comparator) {
                var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values2.length, seen = array;
                if (array === values2) {
                  values2 = copyArray(values2);
                }
                if (iteratee2) {
                  seen = arrayMap(array, baseUnary(iteratee2));
                }
                while (++index < length) {
                  var fromIndex = 0, value = values2[index], computed = iteratee2 ? iteratee2(value) : value;
                  while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
                    if (seen !== array) {
                      splice.call(seen, fromIndex, 1);
                    }
                    splice.call(array, fromIndex, 1);
                  }
                }
                return array;
              }
              function basePullAt(array, indexes) {
                var length = array ? indexes.length : 0, lastIndex = length - 1;
                while (length--) {
                  var index = indexes[length];
                  if (length == lastIndex || index !== previous) {
                    var previous = index;
                    if (isIndex(index)) {
                      splice.call(array, index, 1);
                    } else {
                      baseUnset(array, index);
                    }
                  }
                }
                return array;
              }
              function baseRandom(lower, upper) {
                return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
              }
              function baseRange(start, end, step, fromRight) {
                var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result2 = Array2(length);
                while (length--) {
                  result2[fromRight ? length : ++index] = start;
                  start += step;
                }
                return result2;
              }
              function baseRepeat(string, n) {
                var result2 = "";
                if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
                  return result2;
                }
                do {
                  if (n % 2) {
                    result2 += string;
                  }
                  n = nativeFloor(n / 2);
                  if (n) {
                    string += string;
                  }
                } while (n);
                return result2;
              }
              function baseRest(func, start) {
                return setToString(overRest(func, start, identity), func + "");
              }
              function baseSample(collection) {
                return arraySample(values(collection));
              }
              function baseSampleSize(collection, n) {
                var array = values(collection);
                return shuffleSelf(array, baseClamp(n, 0, array.length));
              }
              function baseSet(object, path, value, customizer) {
                if (!isObject(object)) {
                  return object;
                }
                path = castPath(path, object);
                var index = -1, length = path.length, lastIndex = length - 1, nested = object;
                while (nested != null && ++index < length) {
                  var key = toKey(path[index]), newValue = value;
                  if (key === "__proto__" || key === "constructor" || key === "prototype") {
                    return object;
                  }
                  if (index != lastIndex) {
                    var objValue = nested[key];
                    newValue = customizer ? customizer(objValue, key, nested) : undefined2;
                    if (newValue === undefined2) {
                      newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
                    }
                  }
                  assignValue(nested, key, newValue);
                  nested = nested[key];
                }
                return object;
              }
              var baseSetData = !metaMap ? identity : function (func, data) {
                metaMap.set(func, data);
                return func;
              };
              var baseSetToString = !defineProperty ? identity : function (func, string) {
                return defineProperty(func, "toString", {
                  "configurable": true,
                  "enumerable": false,
                  "value": constant(string),
                  "writable": true
                });
              };
              function baseShuffle(collection) {
                return shuffleSelf(values(collection));
              }
              function baseSlice(array, start, end) {
                var index = -1, length = array.length;
                if (start < 0) {
                  start = -start > length ? 0 : length + start;
                }
                end = end > length ? length : end;
                if (end < 0) {
                  end += length;
                }
                length = start > end ? 0 : end - start >>> 0;
                start >>>= 0;
                var result2 = Array2(length);
                while (++index < length) {
                  result2[index] = array[index + start];
                }
                return result2;
              }
              function baseSome(collection, predicate) {
                var result2;
                baseEach(collection, function (value, index, collection2) {
                  result2 = predicate(value, index, collection2);
                  return !result2;
                });
                return !!result2;
              }
              function baseSortedIndex(array, value, retHighest) {
                var low = 0, high = array == null ? low : array.length;
                if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
                  while (low < high) {
                    var mid = low + high >>> 1, computed = array[mid];
                    if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
                      low = mid + 1;
                    } else {
                      high = mid;
                    }
                  }
                  return high;
                }
                return baseSortedIndexBy(array, value, identity, retHighest);
              }
              function baseSortedIndexBy(array, value, iteratee2, retHighest) {
                var low = 0, high = array == null ? 0 : array.length;
                if (high === 0) {
                  return 0;
                }
                value = iteratee2(value);
                var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined2;
                while (low < high) {
                  var mid = nativeFloor((low + high) / 2), computed = iteratee2(array[mid]), othIsDefined = computed !== undefined2, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
                  if (valIsNaN) {
                    var setLow = retHighest || othIsReflexive;
                  } else if (valIsUndefined) {
                    setLow = othIsReflexive && (retHighest || othIsDefined);
                  } else if (valIsNull) {
                    setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
                  } else if (valIsSymbol) {
                    setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
                  } else if (othIsNull || othIsSymbol) {
                    setLow = false;
                  } else {
                    setLow = retHighest ? computed <= value : computed < value;
                  }
                  if (setLow) {
                    low = mid + 1;
                  } else {
                    high = mid;
                  }
                }
                return nativeMin(high, MAX_ARRAY_INDEX);
              }
              function baseSortedUniq(array, iteratee2) {
                var index = -1, length = array.length, resIndex = 0, result2 = [];
                while (++index < length) {
                  var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
                  if (!index || !eq(computed, seen)) {
                    var seen = computed;
                    result2[resIndex++] = value === 0 ? 0 : value;
                  }
                }
                return result2;
              }
              function baseToNumber(value) {
                if (typeof value == "number") {
                  return value;
                }
                if (isSymbol(value)) {
                  return NAN;
                }
                return +value;
              }
              function baseToString(value) {
                if (typeof value == "string") {
                  return value;
                }
                if (isArray(value)) {
                  return arrayMap(value, baseToString) + "";
                }
                if (isSymbol(value)) {
                  return symbolToString ? symbolToString.call(value) : "";
                }
                var result2 = value + "";
                return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
              }
              function baseUniq(array, iteratee2, comparator) {
                var index = -1, includes2 = arrayIncludes, length = array.length, isCommon = true, result2 = [], seen = result2;
                if (comparator) {
                  isCommon = false;
                  includes2 = arrayIncludesWith;
                } else if (length >= LARGE_ARRAY_SIZE) {
                  var set2 = iteratee2 ? null : createSet(array);
                  if (set2) {
                    return setToArray(set2);
                  }
                  isCommon = false;
                  includes2 = cacheHas;
                  seen = new SetCache();
                } else {
                  seen = iteratee2 ? [] : result2;
                }
                outer: while (++index < length) {
                  var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
                  value = comparator || value !== 0 ? value : 0;
                  if (isCommon && computed === computed) {
                    var seenIndex = seen.length;
                    while (seenIndex--) {
                      if (seen[seenIndex] === computed) {
                        continue outer;
                      }
                    }
                    if (iteratee2) {
                      seen.push(computed);
                    }
                    result2.push(value);
                  } else if (!includes2(seen, computed, comparator)) {
                    if (seen !== result2) {
                      seen.push(computed);
                    }
                    result2.push(value);
                  }
                }
                return result2;
              }
              function baseUnset(object, path) {
                path = castPath(path, object);
                object = parent(object, path);
                return object == null || delete object[toKey(last(path))];
              }
              function baseUpdate(object, path, updater, customizer) {
                return baseSet(object, path, updater(baseGet(object, path)), customizer);
              }
              function baseWhile(array, predicate, isDrop, fromRight) {
                var length = array.length, index = fromRight ? length : -1;
                while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
                return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
              }
              function baseWrapperValue(value, actions) {
                var result2 = value;
                if (result2 instanceof LazyWrapper) {
                  result2 = result2.value();
                }
                return arrayReduce(actions, function (result3, action) {
                  return action.func.apply(action.thisArg, arrayPush([result3], action.args));
                }, result2);
              }
              function baseXor(arrays, iteratee2, comparator) {
                var length = arrays.length;
                if (length < 2) {
                  return length ? baseUniq(arrays[0]) : [];
                }
                var index = -1, result2 = Array2(length);
                while (++index < length) {
                  var array = arrays[index], othIndex = -1;
                  while (++othIndex < length) {
                    if (othIndex != index) {
                      result2[index] = baseDifference(result2[index] || array, arrays[othIndex], iteratee2, comparator);
                    }
                  }
                }
                return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
              }
              function baseZipObject(props, values2, assignFunc) {
                var index = -1, length = props.length, valsLength = values2.length, result2 = {};
                while (++index < length) {
                  var value = index < valsLength ? values2[index] : undefined2;
                  assignFunc(result2, props[index], value);
                }
                return result2;
              }
              function castArrayLikeObject(value) {
                return isArrayLikeObject(value) ? value : [];
              }
              function castFunction(value) {
                return typeof value == "function" ? value : identity;
              }
              function castPath(value, object) {
                if (isArray(value)) {
                  return value;
                }
                return isKey(value, object) ? [value] : stringToPath(toString(value));
              }
              var castRest = baseRest;
              function castSlice(array, start, end) {
                var length = array.length;
                end = end === undefined2 ? length : end;
                return !start && end >= length ? array : baseSlice(array, start, end);
              }
              var clearTimeout = ctxClearTimeout || (function (id) {
                return root.clearTimeout(id);
              });
              function cloneBuffer(buffer, isDeep) {
                if (isDeep) {
                  return buffer.slice();
                }
                var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
                buffer.copy(result2);
                return result2;
              }
              function cloneArrayBuffer(arrayBuffer) {
                var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
                new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
                return result2;
              }
              function cloneDataView(dataView, isDeep) {
                var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
                return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
              }
              function cloneRegExp(regexp) {
                var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
                result2.lastIndex = regexp.lastIndex;
                return result2;
              }
              function cloneSymbol(symbol) {
                return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
              }
              function cloneTypedArray(typedArray, isDeep) {
                var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
                return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
              }
              function compareAscending(value, other) {
                if (value !== other) {
                  var valIsDefined = value !== undefined2, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
                  var othIsDefined = other !== undefined2, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
                  if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
                    return 1;
                  }
                  if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
                    return -1;
                  }
                }
                return 0;
              }
              function compareMultiple(object, other, orders) {
                var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
                while (++index < length) {
                  var result2 = compareAscending(objCriteria[index], othCriteria[index]);
                  if (result2) {
                    if (index >= ordersLength) {
                      return result2;
                    }
                    var order = orders[index];
                    return result2 * (order == "desc" ? -1 : 1);
                  }
                }
                return object.index - other.index;
              }
              function composeArgs(args, partials, holders, isCurried) {
                var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
                while (++leftIndex < leftLength) {
                  result2[leftIndex] = partials[leftIndex];
                }
                while (++argsIndex < holdersLength) {
                  if (isUncurried || argsIndex < argsLength) {
                    result2[holders[argsIndex]] = args[argsIndex];
                  }
                }
                while (rangeLength--) {
                  result2[leftIndex++] = args[argsIndex++];
                }
                return result2;
              }
              function composeArgsRight(args, partials, holders, isCurried) {
                var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
                while (++argsIndex < rangeLength) {
                  result2[argsIndex] = args[argsIndex];
                }
                var offset = argsIndex;
                while (++rightIndex < rightLength) {
                  result2[offset + rightIndex] = partials[rightIndex];
                }
                while (++holdersIndex < holdersLength) {
                  if (isUncurried || argsIndex < argsLength) {
                    result2[offset + holders[holdersIndex]] = args[argsIndex++];
                  }
                }
                return result2;
              }
              function copyArray(source, array) {
                var index = -1, length = source.length;
                array || (array = Array2(length));
                while (++index < length) {
                  array[index] = source[index];
                }
                return array;
              }
              function copyObject(source, props, object, customizer) {
                var isNew = !object;
                object || (object = {});
                var index = -1, length = props.length;
                while (++index < length) {
                  var key = props[index];
                  var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined2;
                  if (newValue === undefined2) {
                    newValue = source[key];
                  }
                  if (isNew) {
                    baseAssignValue(object, key, newValue);
                  } else {
                    assignValue(object, key, newValue);
                  }
                }
                return object;
              }
              function copySymbols(source, object) {
                return copyObject(source, getSymbols(source), object);
              }
              function copySymbolsIn(source, object) {
                return copyObject(source, getSymbolsIn(source), object);
              }
              function createAggregator(setter, initializer) {
                return function (collection, iteratee2) {
                  var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
                  return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
                };
              }
              function createAssigner(assigner) {
                return baseRest(function (object, sources) {
                  var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined2, guard = length > 2 ? sources[2] : undefined2;
                  customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined2;
                  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                    customizer = length < 3 ? undefined2 : customizer;
                    length = 1;
                  }
                  object = Object2(object);
                  while (++index < length) {
                    var source = sources[index];
                    if (source) {
                      assigner(object, source, index, customizer);
                    }
                  }
                  return object;
                });
              }
              function createBaseEach(eachFunc, fromRight) {
                return function (collection, iteratee2) {
                  if (collection == null) {
                    return collection;
                  }
                  if (!isArrayLike(collection)) {
                    return eachFunc(collection, iteratee2);
                  }
                  var length = collection.length, index = fromRight ? length : -1, iterable = Object2(collection);
                  while (fromRight ? index-- : ++index < length) {
                    if (iteratee2(iterable[index], index, iterable) === false) {
                      break;
                    }
                  }
                  return collection;
                };
              }
              function createBaseFor(fromRight) {
                return function (object, iteratee2, keysFunc) {
                  var index = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
                  while (length--) {
                    var key = props[fromRight ? length : ++index];
                    if (iteratee2(iterable[key], key, iterable) === false) {
                      break;
                    }
                  }
                  return object;
                };
              }
              function createBind(func, bitmask, thisArg) {
                var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
                function wrapper() {
                  var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
                  return fn.apply(isBind ? thisArg : this, arguments);
                }
                return wrapper;
              }
              function createCaseFirst(methodName) {
                return function (string) {
                  string = toString(string);
                  var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined2;
                  var chr = strSymbols ? strSymbols[0] : string.charAt(0);
                  var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
                  return chr[methodName]() + trailing;
                };
              }
              function createCompounder(callback) {
                return function (string) {
                  return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
                };
              }
              function createCtor(Ctor) {
                return function () {
                  var args = arguments;
                  switch (args.length) {
                    case 0:
                      return new Ctor();
                    case 1:
                      return new Ctor(args[0]);
                    case 2:
                      return new Ctor(args[0], args[1]);
                    case 3:
                      return new Ctor(args[0], args[1], args[2]);
                    case 4:
                      return new Ctor(args[0], args[1], args[2], args[3]);
                    case 5:
                      return new Ctor(args[0], args[1], args[2], args[3], args[4]);
                    case 6:
                      return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
                    case 7:
                      return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                  }
                  var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
                  return isObject(result2) ? result2 : thisBinding;
                };
              }
              function createCurry(func, bitmask, arity) {
                var Ctor = createCtor(func);
                function wrapper() {
                  var length = arguments.length, args = Array2(length), index = length, placeholder = getHolder(wrapper);
                  while (index--) {
                    args[index] = arguments[index];
                  }
                  var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
                  length -= holders.length;
                  if (length < arity) {
                    return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined2, args, holders, undefined2, undefined2, arity - length);
                  }
                  var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
                  return apply(fn, this, args);
                }
                return wrapper;
              }
              function createFind(findIndexFunc) {
                return function (collection, predicate, fromIndex) {
                  var iterable = Object2(collection);
                  if (!isArrayLike(collection)) {
                    var iteratee2 = getIteratee(predicate, 3);
                    collection = keys(collection);
                    predicate = function (key) {
                      return iteratee2(iterable[key], key, iterable);
                    };
                  }
                  var index = findIndexFunc(collection, predicate, fromIndex);
                  return index > -1 ? iterable[iteratee2 ? collection[index] : index] : undefined2;
                };
              }
              function createFlow(fromRight) {
                return flatRest(function (funcs) {
                  var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
                  if (fromRight) {
                    funcs.reverse();
                  }
                  while (index--) {
                    var func = funcs[index];
                    if (typeof func != "function") {
                      throw new TypeError2(FUNC_ERROR_TEXT);
                    }
                    if (prereq && !wrapper && getFuncName(func) == "wrapper") {
                      var wrapper = new LodashWrapper([], true);
                    }
                  }
                  index = wrapper ? index : length;
                  while (++index < length) {
                    func = funcs[index];
                    var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined2;
                    if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
                      wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
                    } else {
                      wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
                    }
                  }
                  return function () {
                    var args = arguments, value = args[0];
                    if (wrapper && args.length == 1 && isArray(value)) {
                      return wrapper.plant(value).value();
                    }
                    var index2 = 0, result2 = length ? funcs[index2].apply(this, args) : value;
                    while (++index2 < length) {
                      result2 = funcs[index2].call(this, result2);
                    }
                    return result2;
                  };
                });
              }
              function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
                var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined2 : createCtor(func);
                function wrapper() {
                  var length = arguments.length, args = Array2(length), index = length;
                  while (index--) {
                    args[index] = arguments[index];
                  }
                  if (isCurried) {
                    var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
                  }
                  if (partials) {
                    args = composeArgs(args, partials, holders, isCurried);
                  }
                  if (partialsRight) {
                    args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
                  }
                  length -= holdersCount;
                  if (isCurried && length < arity) {
                    var newHolders = replaceHolders(args, placeholder);
                    return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary2, arity - length);
                  }
                  var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
                  length = args.length;
                  if (argPos) {
                    args = reorder(args, argPos);
                  } else if (isFlip && length > 1) {
                    args.reverse();
                  }
                  if (isAry && ary2 < length) {
                    args.length = ary2;
                  }
                  if (this && this !== root && this instanceof wrapper) {
                    fn = Ctor || createCtor(fn);
                  }
                  return fn.apply(thisBinding, args);
                }
                return wrapper;
              }
              function createInverter(setter, toIteratee) {
                return function (object, iteratee2) {
                  return baseInverter(object, setter, toIteratee(iteratee2), {});
                };
              }
              function createMathOperation(operator, defaultValue) {
                return function (value, other) {
                  var result2;
                  if (value === undefined2 && other === undefined2) {
                    return defaultValue;
                  }
                  if (value !== undefined2) {
                    result2 = value;
                  }
                  if (other !== undefined2) {
                    if (result2 === undefined2) {
                      return other;
                    }
                    if (typeof value == "string" || typeof other == "string") {
                      value = baseToString(value);
                      other = baseToString(other);
                    } else {
                      value = baseToNumber(value);
                      other = baseToNumber(other);
                    }
                    result2 = operator(value, other);
                  }
                  return result2;
                };
              }
              function createOver(arrayFunc) {
                return flatRest(function (iteratees) {
                  iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
                  return baseRest(function (args) {
                    var thisArg = this;
                    return arrayFunc(iteratees, function (iteratee2) {
                      return apply(iteratee2, thisArg, args);
                    });
                  });
                });
              }
              function createPadding(length, chars) {
                chars = chars === undefined2 ? " " : baseToString(chars);
                var charsLength = chars.length;
                if (charsLength < 2) {
                  return charsLength ? baseRepeat(chars, length) : chars;
                }
                var result2 = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
                return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
              }
              function createPartial(func, bitmask, thisArg, partials) {
                var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
                function wrapper() {
                  var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
                  while (++leftIndex < leftLength) {
                    args[leftIndex] = partials[leftIndex];
                  }
                  while (argsLength--) {
                    args[leftIndex++] = arguments[++argsIndex];
                  }
                  return apply(fn, isBind ? thisArg : this, args);
                }
                return wrapper;
              }
              function createRange(fromRight) {
                return function (start, end, step) {
                  if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
                    end = step = undefined2;
                  }
                  start = toFinite(start);
                  if (end === undefined2) {
                    end = start;
                    start = 0;
                  } else {
                    end = toFinite(end);
                  }
                  step = step === undefined2 ? start < end ? 1 : -1 : toFinite(step);
                  return baseRange(start, end, step, fromRight);
                };
              }
              function createRelationalOperation(operator) {
                return function (value, other) {
                  if (!(typeof value == "string" && typeof other == "string")) {
                    value = toNumber(value);
                    other = toNumber(other);
                  }
                  return operator(value, other);
                };
              }
              function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
                var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined2, newHoldersRight = isCurry ? undefined2 : holders, newPartials = isCurry ? partials : undefined2, newPartialsRight = isCurry ? undefined2 : partials;
                bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
                bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
                if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
                  bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
                }
                var newData = [func, bitmask, thisArg, newPartials, newHolders, newPartialsRight, newHoldersRight, argPos, ary2, arity];
                var result2 = wrapFunc.apply(undefined2, newData);
                if (isLaziable(func)) {
                  setData(result2, newData);
                }
                result2.placeholder = placeholder;
                return setWrapToString(result2, func, bitmask);
              }
              function createRound(methodName) {
                var func = Math2[methodName];
                return function (number, precision) {
                  number = toNumber(number);
                  precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
                  if (precision && nativeIsFinite(number)) {
                    var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
                    pair = (toString(value) + "e").split("e");
                    return +(pair[0] + "e" + (+pair[1] - precision));
                  }
                  return func(number);
                };
              }
              var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function (values2) {
                return new Set2(values2);
              };
              function createToPairs(keysFunc) {
                return function (object) {
                  var tag = getTag(object);
                  if (tag == mapTag) {
                    return mapToArray(object);
                  }
                  if (tag == setTag) {
                    return setToPairs(object);
                  }
                  return baseToPairs(object, keysFunc(object));
                };
              }
              function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
                var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
                if (!isBindKey && typeof func != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                var length = partials ? partials.length : 0;
                if (!length) {
                  bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
                  partials = holders = undefined2;
                }
                ary2 = ary2 === undefined2 ? ary2 : nativeMax(toInteger(ary2), 0);
                arity = arity === undefined2 ? arity : toInteger(arity);
                length -= holders ? holders.length : 0;
                if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
                  var partialsRight = partials, holdersRight = holders;
                  partials = holders = undefined2;
                }
                var data = isBindKey ? undefined2 : getData(func);
                var newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity];
                if (data) {
                  mergeData(newData, data);
                }
                func = newData[0];
                bitmask = newData[1];
                thisArg = newData[2];
                partials = newData[3];
                holders = newData[4];
                arity = newData[9] = newData[9] === undefined2 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
                if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
                  bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
                }
                if (!bitmask || bitmask == WRAP_BIND_FLAG) {
                  var result2 = createBind(func, bitmask, thisArg);
                } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
                  result2 = createCurry(func, bitmask, arity);
                } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
                  result2 = createPartial(func, bitmask, thisArg, partials);
                } else {
                  result2 = createHybrid.apply(undefined2, newData);
                }
                var setter = data ? baseSetData : setData;
                return setWrapToString(setter(result2, newData), func, bitmask);
              }
              function customDefaultsAssignIn(objValue, srcValue, key, object) {
                if (objValue === undefined2 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
                  return srcValue;
                }
                return objValue;
              }
              function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
                if (isObject(objValue) && isObject(srcValue)) {
                  stack.set(srcValue, objValue);
                  baseMerge(objValue, srcValue, undefined2, customDefaultsMerge, stack);
                  stack["delete"](srcValue);
                }
                return objValue;
              }
              function customOmitClone(value) {
                return isPlainObject(value) ? undefined2 : value;
              }
              function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
                var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
                if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
                  return false;
                }
                var arrStacked = stack.get(array);
                var othStacked = stack.get(other);
                if (arrStacked && othStacked) {
                  return arrStacked == other && othStacked == array;
                }
                var index = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined2;
                stack.set(array, other);
                stack.set(other, array);
                while (++index < arrLength) {
                  var arrValue = array[index], othValue = other[index];
                  if (customizer) {
                    var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
                  }
                  if (compared !== undefined2) {
                    if (compared) {
                      continue;
                    }
                    result2 = false;
                    break;
                  }
                  if (seen) {
                    if (!arraySome(other, function (othValue2, othIndex) {
                      if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                        return seen.push(othIndex);
                      }
                    })) {
                      result2 = false;
                      break;
                    }
                  } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                    result2 = false;
                    break;
                  }
                }
                stack["delete"](array);
                stack["delete"](other);
                return result2;
              }
              function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
                switch (tag) {
                  case dataViewTag:
                    if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                      return false;
                    }
                    object = object.buffer;
                    other = other.buffer;
                  case arrayBufferTag:
                    if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
                      return false;
                    }
                    return true;
                  case boolTag:
                  case dateTag:
                  case numberTag:
                    return eq(+object, +other);
                  case errorTag:
                    return object.name == other.name && object.message == other.message;
                  case regexpTag:
                  case stringTag:
                    return object == other + "";
                  case mapTag:
                    var convert = mapToArray;
                  case setTag:
                    var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
                    convert || (convert = setToArray);
                    if (object.size != other.size && !isPartial) {
                      return false;
                    }
                    var stacked = stack.get(object);
                    if (stacked) {
                      return stacked == other;
                    }
                    bitmask |= COMPARE_UNORDERED_FLAG;
                    stack.set(object, other);
                    var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
                    stack["delete"](object);
                    return result2;
                  case symbolTag:
                    if (symbolValueOf) {
                      return symbolValueOf.call(object) == symbolValueOf.call(other);
                    }
                }
                return false;
              }
              function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
                var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
                if (objLength != othLength && !isPartial) {
                  return false;
                }
                var index = objLength;
                while (index--) {
                  var key = objProps[index];
                  if (!(isPartial ? (key in other) : hasOwnProperty.call(other, key))) {
                    return false;
                  }
                }
                var objStacked = stack.get(object);
                var othStacked = stack.get(other);
                if (objStacked && othStacked) {
                  return objStacked == other && othStacked == object;
                }
                var result2 = true;
                stack.set(object, other);
                stack.set(other, object);
                var skipCtor = isPartial;
                while (++index < objLength) {
                  key = objProps[index];
                  var objValue = object[key], othValue = other[key];
                  if (customizer) {
                    var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
                  }
                  if (!(compared === undefined2 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
                    result2 = false;
                    break;
                  }
                  skipCtor || (skipCtor = key == "constructor");
                }
                if (result2 && !skipCtor) {
                  var objCtor = object.constructor, othCtor = other.constructor;
                  if (objCtor != othCtor && (("constructor" in object) && ("constructor" in other)) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
                    result2 = false;
                  }
                }
                stack["delete"](object);
                stack["delete"](other);
                return result2;
              }
              function flatRest(func) {
                return setToString(overRest(func, undefined2, flatten), func + "");
              }
              function getAllKeys(object) {
                return baseGetAllKeys(object, keys, getSymbols);
              }
              function getAllKeysIn(object) {
                return baseGetAllKeys(object, keysIn, getSymbolsIn);
              }
              var getData = !metaMap ? noop : function (func) {
                return metaMap.get(func);
              };
              function getFuncName(func) {
                var result2 = func.name + "", array = realNames[result2], length = hasOwnProperty.call(realNames, result2) ? array.length : 0;
                while (length--) {
                  var data = array[length], otherFunc = data.func;
                  if (otherFunc == null || otherFunc == func) {
                    return data.name;
                  }
                }
                return result2;
              }
              function getHolder(func) {
                var object = hasOwnProperty.call(lodash, "placeholder") ? lodash : func;
                return object.placeholder;
              }
              function getIteratee() {
                var result2 = lodash.iteratee || iteratee;
                result2 = result2 === iteratee ? baseIteratee : result2;
                return arguments.length ? result2(arguments[0], arguments[1]) : result2;
              }
              function getMapData(map2, key) {
                var data = map2.__data__;
                return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
              }
              function getMatchData(object) {
                var result2 = keys(object), length = result2.length;
                while (length--) {
                  var key = result2[length], value = object[key];
                  result2[length] = [key, value, isStrictComparable(value)];
                }
                return result2;
              }
              function getNative(object, key) {
                var value = getValue(object, key);
                return baseIsNative(value) ? value : undefined2;
              }
              function getRawTag(value) {
                var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
                try {
                  value[symToStringTag] = undefined2;
                  var unmasked = true;
                } catch (e) {}
                var result2 = nativeObjectToString.call(value);
                if (unmasked) {
                  if (isOwn) {
                    value[symToStringTag] = tag;
                  } else {
                    delete value[symToStringTag];
                  }
                }
                return result2;
              }
              var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
                if (object == null) {
                  return [];
                }
                object = Object2(object);
                return arrayFilter(nativeGetSymbols(object), function (symbol) {
                  return propertyIsEnumerable.call(object, symbol);
                });
              };
              var getSymbolsIn = !nativeGetSymbols ? stubArray : function (object) {
                var result2 = [];
                while (object) {
                  arrayPush(result2, getSymbols(object));
                  object = getPrototype(object);
                }
                return result2;
              };
              var getTag = baseGetTag;
              if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
                getTag = function (value) {
                  var result2 = baseGetTag(value), Ctor = result2 == objectTag ? value.constructor : undefined2, ctorString = Ctor ? toSource(Ctor) : "";
                  if (ctorString) {
                    switch (ctorString) {
                      case dataViewCtorString:
                        return dataViewTag;
                      case mapCtorString:
                        return mapTag;
                      case promiseCtorString:
                        return promiseTag;
                      case setCtorString:
                        return setTag;
                      case weakMapCtorString:
                        return weakMapTag;
                    }
                  }
                  return result2;
                };
              }
              function getView(start, end, transforms) {
                var index = -1, length = transforms.length;
                while (++index < length) {
                  var data = transforms[index], size2 = data.size;
                  switch (data.type) {
                    case "drop":
                      start += size2;
                      break;
                    case "dropRight":
                      end -= size2;
                      break;
                    case "take":
                      end = nativeMin(end, start + size2);
                      break;
                    case "takeRight":
                      start = nativeMax(start, end - size2);
                      break;
                  }
                }
                return {
                  "start": start,
                  "end": end
                };
              }
              function getWrapDetails(source) {
                var match = source.match(reWrapDetails);
                return match ? match[1].split(reSplitDetails) : [];
              }
              function hasPath(object, path, hasFunc) {
                path = castPath(path, object);
                var index = -1, length = path.length, result2 = false;
                while (++index < length) {
                  var key = toKey(path[index]);
                  if (!(result2 = object != null && hasFunc(object, key))) {
                    break;
                  }
                  object = object[key];
                }
                if (result2 || ++index != length) {
                  return result2;
                }
                length = object == null ? 0 : object.length;
                return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
              }
              function initCloneArray(array) {
                var length = array.length, result2 = new array.constructor(length);
                if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
                  result2.index = array.index;
                  result2.input = array.input;
                }
                return result2;
              }
              function initCloneObject(object) {
                return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
              }
              function initCloneByTag(object, tag, isDeep) {
                var Ctor = object.constructor;
                switch (tag) {
                  case arrayBufferTag:
                    return cloneArrayBuffer(object);
                  case boolTag:
                  case dateTag:
                    return new Ctor(+object);
                  case dataViewTag:
                    return cloneDataView(object, isDeep);
                  case float32Tag:
                  case float64Tag:
                  case int8Tag:
                  case int16Tag:
                  case int32Tag:
                  case uint8Tag:
                  case uint8ClampedTag:
                  case uint16Tag:
                  case uint32Tag:
                    return cloneTypedArray(object, isDeep);
                  case mapTag:
                    return new Ctor();
                  case numberTag:
                  case stringTag:
                    return new Ctor(object);
                  case regexpTag:
                    return cloneRegExp(object);
                  case setTag:
                    return new Ctor();
                  case symbolTag:
                    return cloneSymbol(object);
                }
              }
              function insertWrapDetails(source, details) {
                var length = details.length;
                if (!length) {
                  return source;
                }
                var lastIndex = length - 1;
                details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
                details = details.join(length > 2 ? ", " : " ");
                return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
              }
              function isFlattenable(value) {
                return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
              }
              function isIndex(value, length) {
                var type = typeof value;
                length = length == null ? MAX_SAFE_INTEGER : length;
                return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
              }
              function isIterateeCall(value, index, object) {
                if (!isObject(object)) {
                  return false;
                }
                var type = typeof index;
                if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && (index in object)) {
                  return eq(object[index], value);
                }
                return false;
              }
              function isKey(value, object) {
                if (isArray(value)) {
                  return false;
                }
                var type = typeof value;
                if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
                  return true;
                }
                return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && (value in Object2(object));
              }
              function isKeyable(value) {
                var type = typeof value;
                return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
              }
              function isLaziable(func) {
                var funcName = getFuncName(func), other = lodash[funcName];
                if (typeof other != "function" || !((funcName in LazyWrapper.prototype))) {
                  return false;
                }
                if (func === other) {
                  return true;
                }
                var data = getData(other);
                return !!data && func === data[0];
              }
              function isMasked(func) {
                return !!maskSrcKey && (maskSrcKey in func);
              }
              var isMaskable = coreJsData ? isFunction : stubFalse;
              function isPrototype(value) {
                var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
                return value === proto;
              }
              function isStrictComparable(value) {
                return value === value && !isObject(value);
              }
              function matchesStrictComparable(key, srcValue) {
                return function (object) {
                  if (object == null) {
                    return false;
                  }
                  return object[key] === srcValue && (srcValue !== undefined2 || (key in Object2(object)));
                };
              }
              function memoizeCapped(func) {
                var result2 = memoize(func, function (key) {
                  if (cache.size === MAX_MEMOIZE_SIZE) {
                    cache.clear();
                  }
                  return key;
                });
                var cache = result2.cache;
                return result2;
              }
              function mergeData(data, source) {
                var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
                var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
                if (!(isCommon || isCombo)) {
                  return data;
                }
                if (srcBitmask & WRAP_BIND_FLAG) {
                  data[2] = source[2];
                  newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
                }
                var value = source[3];
                if (value) {
                  var partials = data[3];
                  data[3] = partials ? composeArgs(partials, value, source[4]) : value;
                  data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
                }
                value = source[5];
                if (value) {
                  partials = data[5];
                  data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
                  data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
                }
                value = source[7];
                if (value) {
                  data[7] = value;
                }
                if (srcBitmask & WRAP_ARY_FLAG) {
                  data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
                }
                if (data[9] == null) {
                  data[9] = source[9];
                }
                data[0] = source[0];
                data[1] = newBitmask;
                return data;
              }
              function nativeKeysIn(object) {
                var result2 = [];
                if (object != null) {
                  for (var key in Object2(object)) {
                    result2.push(key);
                  }
                }
                return result2;
              }
              function objectToString(value) {
                return nativeObjectToString.call(value);
              }
              function overRest(func, start, transform2) {
                start = nativeMax(start === undefined2 ? func.length - 1 : start, 0);
                return function () {
                  var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array2(length);
                  while (++index < length) {
                    array[index] = args[start + index];
                  }
                  index = -1;
                  var otherArgs = Array2(start + 1);
                  while (++index < start) {
                    otherArgs[index] = args[index];
                  }
                  otherArgs[start] = transform2(array);
                  return apply(func, this, otherArgs);
                };
              }
              function parent(object, path) {
                return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
              }
              function reorder(array, indexes) {
                var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
                while (length--) {
                  var index = indexes[length];
                  array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined2;
                }
                return array;
              }
              function safeGet(object, key) {
                if (key === "constructor" && typeof object[key] === "function") {
                  return;
                }
                if (key == "__proto__") {
                  return;
                }
                return object[key];
              }
              var setData = shortOut(baseSetData);
              var setTimeout = ctxSetTimeout || (function (func, wait) {
                return root.setTimeout(func, wait);
              });
              var setToString = shortOut(baseSetToString);
              function setWrapToString(wrapper, reference, bitmask) {
                var source = reference + "";
                return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
              }
              function shortOut(func) {
                var count = 0, lastCalled = 0;
                return function () {
                  var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
                  lastCalled = stamp;
                  if (remaining > 0) {
                    if (++count >= HOT_COUNT) {
                      return arguments[0];
                    }
                  } else {
                    count = 0;
                  }
                  return func.apply(undefined2, arguments);
                };
              }
              function shuffleSelf(array, size2) {
                var index = -1, length = array.length, lastIndex = length - 1;
                size2 = size2 === undefined2 ? length : size2;
                while (++index < size2) {
                  var rand = baseRandom(index, lastIndex), value = array[rand];
                  array[rand] = array[index];
                  array[index] = value;
                }
                array.length = size2;
                return array;
              }
              var stringToPath = memoizeCapped(function (string) {
                var result2 = [];
                if (string.charCodeAt(0) === 46) {
                  result2.push("");
                }
                string.replace(rePropName, function (match, number, quote, subString) {
                  result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
                });
                return result2;
              });
              function toKey(value) {
                if (typeof value == "string" || isSymbol(value)) {
                  return value;
                }
                var result2 = value + "";
                return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
              }
              function toSource(func) {
                if (func != null) {
                  try {
                    return funcToString.call(func);
                  } catch (e) {}
                  try {
                    return func + "";
                  } catch (e) {}
                }
                return "";
              }
              function updateWrapDetails(details, bitmask) {
                arrayEach(wrapFlags, function (pair) {
                  var value = "_." + pair[0];
                  if (bitmask & pair[1] && !arrayIncludes(details, value)) {
                    details.push(value);
                  }
                });
                return details.sort();
              }
              function wrapperClone(wrapper) {
                if (wrapper instanceof LazyWrapper) {
                  return wrapper.clone();
                }
                var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
                result2.__actions__ = copyArray(wrapper.__actions__);
                result2.__index__ = wrapper.__index__;
                result2.__values__ = wrapper.__values__;
                return result2;
              }
              function chunk(array, size2, guard) {
                if (guard ? isIterateeCall(array, size2, guard) : size2 === undefined2) {
                  size2 = 1;
                } else {
                  size2 = nativeMax(toInteger(size2), 0);
                }
                var length = array == null ? 0 : array.length;
                if (!length || size2 < 1) {
                  return [];
                }
                var index = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size2));
                while (index < length) {
                  result2[resIndex++] = baseSlice(array, index, index += size2);
                }
                return result2;
              }
              function compact(array) {
                var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result2 = [];
                while (++index < length) {
                  var value = array[index];
                  if (value) {
                    result2[resIndex++] = value;
                  }
                }
                return result2;
              }
              function concat() {
                var length = arguments.length;
                if (!length) {
                  return [];
                }
                var args = Array2(length - 1), array = arguments[0], index = length;
                while (index--) {
                  args[index - 1] = arguments[index];
                }
                return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
              }
              var difference = baseRest(function (array, values2) {
                return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
              });
              var differenceBy = baseRest(function (array, values2) {
                var iteratee2 = last(values2);
                if (isArrayLikeObject(iteratee2)) {
                  iteratee2 = undefined2;
                }
                return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
              });
              var differenceWith = baseRest(function (array, values2) {
                var comparator = last(values2);
                if (isArrayLikeObject(comparator)) {
                  comparator = undefined2;
                }
                return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), undefined2, comparator) : [];
              });
              function drop(array, n, guard) {
                var length = array == null ? 0 : array.length;
                if (!length) {
                  return [];
                }
                n = guard || n === undefined2 ? 1 : toInteger(n);
                return baseSlice(array, n < 0 ? 0 : n, length);
              }
              function dropRight(array, n, guard) {
                var length = array == null ? 0 : array.length;
                if (!length) {
                  return [];
                }
                n = guard || n === undefined2 ? 1 : toInteger(n);
                n = length - n;
                return baseSlice(array, 0, n < 0 ? 0 : n);
              }
              function dropRightWhile(array, predicate) {
                return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
              }
              function dropWhile(array, predicate) {
                return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
              }
              function fill(array, value, start, end) {
                var length = array == null ? 0 : array.length;
                if (!length) {
                  return [];
                }
                if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
                  start = 0;
                  end = length;
                }
                return baseFill(array, value, start, end);
              }
              function findIndex(array, predicate, fromIndex) {
                var length = array == null ? 0 : array.length;
                if (!length) {
                  return -1;
                }
                var index = fromIndex == null ? 0 : toInteger(fromIndex);
                if (index < 0) {
                  index = nativeMax(length + index, 0);
                }
                return baseFindIndex(array, getIteratee(predicate, 3), index);
              }
              function findLastIndex(array, predicate, fromIndex) {
                var length = array == null ? 0 : array.length;
                if (!length) {
                  return -1;
                }
                var index = length - 1;
                if (fromIndex !== undefined2) {
                  index = toInteger(fromIndex);
                  index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
                }
                return baseFindIndex(array, getIteratee(predicate, 3), index, true);
              }
              function flatten(array) {
                var length = array == null ? 0 : array.length;
                return length ? baseFlatten(array, 1) : [];
              }
              function flattenDeep(array) {
                var length = array == null ? 0 : array.length;
                return length ? baseFlatten(array, INFINITY) : [];
              }
              function flattenDepth(array, depth) {
                var length = array == null ? 0 : array.length;
                if (!length) {
                  return [];
                }
                depth = depth === undefined2 ? 1 : toInteger(depth);
                return baseFlatten(array, depth);
              }
              function fromPairs(pairs) {
                var index = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
                while (++index < length) {
                  var pair = pairs[index];
                  result2[pair[0]] = pair[1];
                }
                return result2;
              }
              function head(array) {
                return array && array.length ? array[0] : undefined2;
              }
              function indexOf(array, value, fromIndex) {
                var length = array == null ? 0 : array.length;
                if (!length) {
                  return -1;
                }
                var index = fromIndex == null ? 0 : toInteger(fromIndex);
                if (index < 0) {
                  index = nativeMax(length + index, 0);
                }
                return baseIndexOf(array, value, index);
              }
              function initial(array) {
                var length = array == null ? 0 : array.length;
                return length ? baseSlice(array, 0, -1) : [];
              }
              var intersection = baseRest(function (arrays) {
                var mapped = arrayMap(arrays, castArrayLikeObject);
                return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
              });
              var intersectionBy = baseRest(function (arrays) {
                var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
                if (iteratee2 === last(mapped)) {
                  iteratee2 = undefined2;
                } else {
                  mapped.pop();
                }
                return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
              });
              var intersectionWith = baseRest(function (arrays) {
                var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
                comparator = typeof comparator == "function" ? comparator : undefined2;
                if (comparator) {
                  mapped.pop();
                }
                return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined2, comparator) : [];
              });
              function join(array, separator) {
                return array == null ? "" : nativeJoin.call(array, separator);
              }
              function last(array) {
                var length = array == null ? 0 : array.length;
                return length ? array[length - 1] : undefined2;
              }
              function lastIndexOf(array, value, fromIndex) {
                var length = array == null ? 0 : array.length;
                if (!length) {
                  return -1;
                }
                var index = length;
                if (fromIndex !== undefined2) {
                  index = toInteger(fromIndex);
                  index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
                }
                return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
              }
              function nth(array, n) {
                return array && array.length ? baseNth(array, toInteger(n)) : undefined2;
              }
              var pull = baseRest(pullAll);
              function pullAll(array, values2) {
                return array && array.length && values2 && values2.length ? basePullAll(array, values2) : array;
              }
              function pullAllBy(array, values2, iteratee2) {
                return array && array.length && values2 && values2.length ? basePullAll(array, values2, getIteratee(iteratee2, 2)) : array;
              }
              function pullAllWith(array, values2, comparator) {
                return array && array.length && values2 && values2.length ? basePullAll(array, values2, undefined2, comparator) : array;
              }
              var pullAt = flatRest(function (array, indexes) {
                var length = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
                basePullAt(array, arrayMap(indexes, function (index) {
                  return isIndex(index, length) ? +index : index;
                }).sort(compareAscending));
                return result2;
              });
              function remove(array, predicate) {
                var result2 = [];
                if (!(array && array.length)) {
                  return result2;
                }
                var index = -1, indexes = [], length = array.length;
                predicate = getIteratee(predicate, 3);
                while (++index < length) {
                  var value = array[index];
                  if (predicate(value, index, array)) {
                    result2.push(value);
                    indexes.push(index);
                  }
                }
                basePullAt(array, indexes);
                return result2;
              }
              function reverse(array) {
                return array == null ? array : nativeReverse.call(array);
              }
              function slice(array, start, end) {
                var length = array == null ? 0 : array.length;
                if (!length) {
                  return [];
                }
                if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
                  start = 0;
                  end = length;
                } else {
                  start = start == null ? 0 : toInteger(start);
                  end = end === undefined2 ? length : toInteger(end);
                }
                return baseSlice(array, start, end);
              }
              function sortedIndex(array, value) {
                return baseSortedIndex(array, value);
              }
              function sortedIndexBy(array, value, iteratee2) {
                return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2));
              }
              function sortedIndexOf(array, value) {
                var length = array == null ? 0 : array.length;
                if (length) {
                  var index = baseSortedIndex(array, value);
                  if (index < length && eq(array[index], value)) {
                    return index;
                  }
                }
                return -1;
              }
              function sortedLastIndex(array, value) {
                return baseSortedIndex(array, value, true);
              }
              function sortedLastIndexBy(array, value, iteratee2) {
                return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2), true);
              }
              function sortedLastIndexOf(array, value) {
                var length = array == null ? 0 : array.length;
                if (length) {
                  var index = baseSortedIndex(array, value, true) - 1;
                  if (eq(array[index], value)) {
                    return index;
                  }
                }
                return -1;
              }
              function sortedUniq(array) {
                return array && array.length ? baseSortedUniq(array) : [];
              }
              function sortedUniqBy(array, iteratee2) {
                return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
              }
              function tail(array) {
                var length = array == null ? 0 : array.length;
                return length ? baseSlice(array, 1, length) : [];
              }
              function take(array, n, guard) {
                if (!(array && array.length)) {
                  return [];
                }
                n = guard || n === undefined2 ? 1 : toInteger(n);
                return baseSlice(array, 0, n < 0 ? 0 : n);
              }
              function takeRight(array, n, guard) {
                var length = array == null ? 0 : array.length;
                if (!length) {
                  return [];
                }
                n = guard || n === undefined2 ? 1 : toInteger(n);
                n = length - n;
                return baseSlice(array, n < 0 ? 0 : n, length);
              }
              function takeRightWhile(array, predicate) {
                return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
              }
              function takeWhile(array, predicate) {
                return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
              }
              var union = baseRest(function (arrays) {
                return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
              });
              var unionBy = baseRest(function (arrays) {
                var iteratee2 = last(arrays);
                if (isArrayLikeObject(iteratee2)) {
                  iteratee2 = undefined2;
                }
                return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
              });
              var unionWith = baseRest(function (arrays) {
                var comparator = last(arrays);
                comparator = typeof comparator == "function" ? comparator : undefined2;
                return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined2, comparator);
              });
              function uniq(array) {
                return array && array.length ? baseUniq(array) : [];
              }
              function uniqBy(array, iteratee2) {
                return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
              }
              function uniqWith(array, comparator) {
                comparator = typeof comparator == "function" ? comparator : undefined2;
                return array && array.length ? baseUniq(array, undefined2, comparator) : [];
              }
              function unzip(array) {
                if (!(array && array.length)) {
                  return [];
                }
                var length = 0;
                array = arrayFilter(array, function (group) {
                  if (isArrayLikeObject(group)) {
                    length = nativeMax(group.length, length);
                    return true;
                  }
                });
                return baseTimes(length, function (index) {
                  return arrayMap(array, baseProperty(index));
                });
              }
              function unzipWith(array, iteratee2) {
                if (!(array && array.length)) {
                  return [];
                }
                var result2 = unzip(array);
                if (iteratee2 == null) {
                  return result2;
                }
                return arrayMap(result2, function (group) {
                  return apply(iteratee2, undefined2, group);
                });
              }
              var without = baseRest(function (array, values2) {
                return isArrayLikeObject(array) ? baseDifference(array, values2) : [];
              });
              var xor = baseRest(function (arrays) {
                return baseXor(arrayFilter(arrays, isArrayLikeObject));
              });
              var xorBy = baseRest(function (arrays) {
                var iteratee2 = last(arrays);
                if (isArrayLikeObject(iteratee2)) {
                  iteratee2 = undefined2;
                }
                return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
              });
              var xorWith = baseRest(function (arrays) {
                var comparator = last(arrays);
                comparator = typeof comparator == "function" ? comparator : undefined2;
                return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined2, comparator);
              });
              var zip = baseRest(unzip);
              function zipObject(props, values2) {
                return baseZipObject(props || [], values2 || [], assignValue);
              }
              function zipObjectDeep(props, values2) {
                return baseZipObject(props || [], values2 || [], baseSet);
              }
              var zipWith = baseRest(function (arrays) {
                var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined2;
                iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined2;
                return unzipWith(arrays, iteratee2);
              });
              function chain(value) {
                var result2 = lodash(value);
                result2.__chain__ = true;
                return result2;
              }
              function tap(value, interceptor) {
                interceptor(value);
                return value;
              }
              function thru(value, interceptor) {
                return interceptor(value);
              }
              var wrapperAt = flatRest(function (paths) {
                var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function (object) {
                  return baseAt(object, paths);
                };
                if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
                  return this.thru(interceptor);
                }
                value = value.slice(start, +start + (length ? 1 : 0));
                value.__actions__.push({
                  "func": thru,
                  "args": [interceptor],
                  "thisArg": undefined2
                });
                return new LodashWrapper(value, this.__chain__).thru(function (array) {
                  if (length && !array.length) {
                    array.push(undefined2);
                  }
                  return array;
                });
              });
              function wrapperChain() {
                return chain(this);
              }
              function wrapperCommit() {
                return new LodashWrapper(this.value(), this.__chain__);
              }
              function wrapperNext() {
                if (this.__values__ === undefined2) {
                  this.__values__ = toArray(this.value());
                }
                var done = this.__index__ >= this.__values__.length, value = done ? undefined2 : this.__values__[this.__index__++];
                return {
                  "done": done,
                  "value": value
                };
              }
              function wrapperToIterator() {
                return this;
              }
              function wrapperPlant(value) {
                var result2, parent2 = this;
                while (parent2 instanceof baseLodash) {
                  var clone2 = wrapperClone(parent2);
                  clone2.__index__ = 0;
                  clone2.__values__ = undefined2;
                  if (result2) {
                    previous.__wrapped__ = clone2;
                  } else {
                    result2 = clone2;
                  }
                  var previous = clone2;
                  parent2 = parent2.__wrapped__;
                }
                previous.__wrapped__ = value;
                return result2;
              }
              function wrapperReverse() {
                var value = this.__wrapped__;
                if (value instanceof LazyWrapper) {
                  var wrapped = value;
                  if (this.__actions__.length) {
                    wrapped = new LazyWrapper(this);
                  }
                  wrapped = wrapped.reverse();
                  wrapped.__actions__.push({
                    "func": thru,
                    "args": [reverse],
                    "thisArg": undefined2
                  });
                  return new LodashWrapper(wrapped, this.__chain__);
                }
                return this.thru(reverse);
              }
              function wrapperValue() {
                return baseWrapperValue(this.__wrapped__, this.__actions__);
              }
              var countBy = createAggregator(function (result2, value, key) {
                if (hasOwnProperty.call(result2, key)) {
                  ++result2[key];
                } else {
                  baseAssignValue(result2, key, 1);
                }
              });
              function every(collection, predicate, guard) {
                var func = isArray(collection) ? arrayEvery : baseEvery;
                if (guard && isIterateeCall(collection, predicate, guard)) {
                  predicate = undefined2;
                }
                return func(collection, getIteratee(predicate, 3));
              }
              function filter(collection, predicate) {
                var func = isArray(collection) ? arrayFilter : baseFilter;
                return func(collection, getIteratee(predicate, 3));
              }
              var find = createFind(findIndex);
              var findLast = createFind(findLastIndex);
              function flatMap(collection, iteratee2) {
                return baseFlatten(map(collection, iteratee2), 1);
              }
              function flatMapDeep(collection, iteratee2) {
                return baseFlatten(map(collection, iteratee2), INFINITY);
              }
              function flatMapDepth(collection, iteratee2, depth) {
                depth = depth === undefined2 ? 1 : toInteger(depth);
                return baseFlatten(map(collection, iteratee2), depth);
              }
              function forEach(collection, iteratee2) {
                var func = isArray(collection) ? arrayEach : baseEach;
                return func(collection, getIteratee(iteratee2, 3));
              }
              function forEachRight(collection, iteratee2) {
                var func = isArray(collection) ? arrayEachRight : baseEachRight;
                return func(collection, getIteratee(iteratee2, 3));
              }
              var groupBy = createAggregator(function (result2, value, key) {
                if (hasOwnProperty.call(result2, key)) {
                  result2[key].push(value);
                } else {
                  baseAssignValue(result2, key, [value]);
                }
              });
              function includes(collection, value, fromIndex, guard) {
                collection = isArrayLike(collection) ? collection : values(collection);
                fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
                var length = collection.length;
                if (fromIndex < 0) {
                  fromIndex = nativeMax(length + fromIndex, 0);
                }
                return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
              }
              var invokeMap = baseRest(function (collection, path, args) {
                var index = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
                baseEach(collection, function (value) {
                  result2[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
                });
                return result2;
              });
              var keyBy = createAggregator(function (result2, value, key) {
                baseAssignValue(result2, key, value);
              });
              function map(collection, iteratee2) {
                var func = isArray(collection) ? arrayMap : baseMap;
                return func(collection, getIteratee(iteratee2, 3));
              }
              function orderBy(collection, iteratees, orders, guard) {
                if (collection == null) {
                  return [];
                }
                if (!isArray(iteratees)) {
                  iteratees = iteratees == null ? [] : [iteratees];
                }
                orders = guard ? undefined2 : orders;
                if (!isArray(orders)) {
                  orders = orders == null ? [] : [orders];
                }
                return baseOrderBy(collection, iteratees, orders);
              }
              var partition = createAggregator(function (result2, value, key) {
                result2[key ? 0 : 1].push(value);
              }, function () {
                return [[], []];
              });
              function reduce(collection, iteratee2, accumulator) {
                var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
                return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
              }
              function reduceRight(collection, iteratee2, accumulator) {
                var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
                return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
              }
              function reject(collection, predicate) {
                var func = isArray(collection) ? arrayFilter : baseFilter;
                return func(collection, negate(getIteratee(predicate, 3)));
              }
              function sample(collection) {
                var func = isArray(collection) ? arraySample : baseSample;
                return func(collection);
              }
              function sampleSize(collection, n, guard) {
                if (guard ? isIterateeCall(collection, n, guard) : n === undefined2) {
                  n = 1;
                } else {
                  n = toInteger(n);
                }
                var func = isArray(collection) ? arraySampleSize : baseSampleSize;
                return func(collection, n);
              }
              function shuffle(collection) {
                var func = isArray(collection) ? arrayShuffle : baseShuffle;
                return func(collection);
              }
              function size(collection) {
                if (collection == null) {
                  return 0;
                }
                if (isArrayLike(collection)) {
                  return isString(collection) ? stringSize(collection) : collection.length;
                }
                var tag = getTag(collection);
                if (tag == mapTag || tag == setTag) {
                  return collection.size;
                }
                return baseKeys(collection).length;
              }
              function some(collection, predicate, guard) {
                var func = isArray(collection) ? arraySome : baseSome;
                if (guard && isIterateeCall(collection, predicate, guard)) {
                  predicate = undefined2;
                }
                return func(collection, getIteratee(predicate, 3));
              }
              var sortBy = baseRest(function (collection, iteratees) {
                if (collection == null) {
                  return [];
                }
                var length = iteratees.length;
                if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
                  iteratees = [];
                } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
                  iteratees = [iteratees[0]];
                }
                return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
              });
              var now = ctxNow || (function () {
                return root.Date.now();
              });
              function after(n, func) {
                if (typeof func != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                n = toInteger(n);
                return function () {
                  if (--n < 1) {
                    return func.apply(this, arguments);
                  }
                };
              }
              function ary(func, n, guard) {
                n = guard ? undefined2 : n;
                n = func && n == null ? func.length : n;
                return createWrap(func, WRAP_ARY_FLAG, undefined2, undefined2, undefined2, undefined2, n);
              }
              function before(n, func) {
                var result2;
                if (typeof func != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                n = toInteger(n);
                return function () {
                  if (--n > 0) {
                    result2 = func.apply(this, arguments);
                  }
                  if (n <= 1) {
                    func = undefined2;
                  }
                  return result2;
                };
              }
              var bind = baseRest(function (func, thisArg, partials) {
                var bitmask = WRAP_BIND_FLAG;
                if (partials.length) {
                  var holders = replaceHolders(partials, getHolder(bind));
                  bitmask |= WRAP_PARTIAL_FLAG;
                }
                return createWrap(func, bitmask, thisArg, partials, holders);
              });
              var bindKey = baseRest(function (object, key, partials) {
                var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
                if (partials.length) {
                  var holders = replaceHolders(partials, getHolder(bindKey));
                  bitmask |= WRAP_PARTIAL_FLAG;
                }
                return createWrap(key, bitmask, object, partials, holders);
              });
              function curry(func, arity, guard) {
                arity = guard ? undefined2 : arity;
                var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
                result2.placeholder = curry.placeholder;
                return result2;
              }
              function curryRight(func, arity, guard) {
                arity = guard ? undefined2 : arity;
                var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
                result2.placeholder = curryRight.placeholder;
                return result2;
              }
              function debounce(func, wait, options) {
                var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
                if (typeof func != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                wait = toNumber(wait) || 0;
                if (isObject(options)) {
                  leading = !!options.leading;
                  maxing = ("maxWait" in options);
                  maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
                  trailing = ("trailing" in options) ? !!options.trailing : trailing;
                }
                function invokeFunc(time) {
                  var args = lastArgs, thisArg = lastThis;
                  lastArgs = lastThis = undefined2;
                  lastInvokeTime = time;
                  result2 = func.apply(thisArg, args);
                  return result2;
                }
                function leadingEdge(time) {
                  lastInvokeTime = time;
                  timerId = setTimeout(timerExpired, wait);
                  return leading ? invokeFunc(time) : result2;
                }
                function remainingWait(time) {
                  var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
                  return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
                }
                function shouldInvoke(time) {
                  var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
                  return lastCallTime === undefined2 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
                }
                function timerExpired() {
                  var time = now();
                  if (shouldInvoke(time)) {
                    return trailingEdge(time);
                  }
                  timerId = setTimeout(timerExpired, remainingWait(time));
                }
                function trailingEdge(time) {
                  timerId = undefined2;
                  if (trailing && lastArgs) {
                    return invokeFunc(time);
                  }
                  lastArgs = lastThis = undefined2;
                  return result2;
                }
                function cancel() {
                  if (timerId !== undefined2) {
                    clearTimeout(timerId);
                  }
                  lastInvokeTime = 0;
                  lastArgs = lastCallTime = lastThis = timerId = undefined2;
                }
                function flush() {
                  return timerId === undefined2 ? result2 : trailingEdge(now());
                }
                function debounced() {
                  var time = now(), isInvoking = shouldInvoke(time);
                  lastArgs = arguments;
                  lastThis = this;
                  lastCallTime = time;
                  if (isInvoking) {
                    if (timerId === undefined2) {
                      return leadingEdge(lastCallTime);
                    }
                    if (maxing) {
                      clearTimeout(timerId);
                      timerId = setTimeout(timerExpired, wait);
                      return invokeFunc(lastCallTime);
                    }
                  }
                  if (timerId === undefined2) {
                    timerId = setTimeout(timerExpired, wait);
                  }
                  return result2;
                }
                debounced.cancel = cancel;
                debounced.flush = flush;
                return debounced;
              }
              var defer = baseRest(function (func, args) {
                return baseDelay(func, 1, args);
              });
              var delay = baseRest(function (func, wait, args) {
                return baseDelay(func, toNumber(wait) || 0, args);
              });
              function flip(func) {
                return createWrap(func, WRAP_FLIP_FLAG);
              }
              function memoize(func, resolver) {
                if (typeof func != "function" || resolver != null && typeof resolver != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                var memoized = function () {
                  var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
                  if (cache.has(key)) {
                    return cache.get(key);
                  }
                  var result2 = func.apply(this, args);
                  memoized.cache = cache.set(key, result2) || cache;
                  return result2;
                };
                memoized.cache = new (memoize.Cache || MapCache)();
                return memoized;
              }
              memoize.Cache = MapCache;
              function negate(predicate) {
                if (typeof predicate != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                return function () {
                  var args = arguments;
                  switch (args.length) {
                    case 0:
                      return !predicate.call(this);
                    case 1:
                      return !predicate.call(this, args[0]);
                    case 2:
                      return !predicate.call(this, args[0], args[1]);
                    case 3:
                      return !predicate.call(this, args[0], args[1], args[2]);
                  }
                  return !predicate.apply(this, args);
                };
              }
              function once(func) {
                return before(2, func);
              }
              var overArgs = castRest(function (func, transforms) {
                transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
                var funcsLength = transforms.length;
                return baseRest(function (args) {
                  var index = -1, length = nativeMin(args.length, funcsLength);
                  while (++index < length) {
                    args[index] = transforms[index].call(this, args[index]);
                  }
                  return apply(func, this, args);
                });
              });
              var partial = baseRest(function (func, partials) {
                var holders = replaceHolders(partials, getHolder(partial));
                return createWrap(func, WRAP_PARTIAL_FLAG, undefined2, partials, holders);
              });
              var partialRight = baseRest(function (func, partials) {
                var holders = replaceHolders(partials, getHolder(partialRight));
                return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined2, partials, holders);
              });
              var rearg = flatRest(function (func, indexes) {
                return createWrap(func, WRAP_REARG_FLAG, undefined2, undefined2, undefined2, indexes);
              });
              function rest(func, start) {
                if (typeof func != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                start = start === undefined2 ? start : toInteger(start);
                return baseRest(func, start);
              }
              function spread(func, start) {
                if (typeof func != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                start = start == null ? 0 : nativeMax(toInteger(start), 0);
                return baseRest(function (args) {
                  var array = args[start], otherArgs = castSlice(args, 0, start);
                  if (array) {
                    arrayPush(otherArgs, array);
                  }
                  return apply(func, this, otherArgs);
                });
              }
              function throttle(func, wait, options) {
                var leading = true, trailing = true;
                if (typeof func != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                if (isObject(options)) {
                  leading = ("leading" in options) ? !!options.leading : leading;
                  trailing = ("trailing" in options) ? !!options.trailing : trailing;
                }
                return debounce(func, wait, {
                  "leading": leading,
                  "maxWait": wait,
                  "trailing": trailing
                });
              }
              function unary(func) {
                return ary(func, 1);
              }
              function wrap(value, wrapper) {
                return partial(castFunction(wrapper), value);
              }
              function castArray() {
                if (!arguments.length) {
                  return [];
                }
                var value = arguments[0];
                return isArray(value) ? value : [value];
              }
              function clone(value) {
                return baseClone(value, CLONE_SYMBOLS_FLAG);
              }
              function cloneWith(value, customizer) {
                customizer = typeof customizer == "function" ? customizer : undefined2;
                return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
              }
              function cloneDeep(value) {
                return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
              }
              function cloneDeepWith(value, customizer) {
                customizer = typeof customizer == "function" ? customizer : undefined2;
                return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
              }
              function conformsTo(object, source) {
                return source == null || baseConformsTo(object, source, keys(source));
              }
              function eq(value, other) {
                return value === other || value !== value && other !== other;
              }
              var gt = createRelationalOperation(baseGt);
              var gte = createRelationalOperation(function (value, other) {
                return value >= other;
              });
              var isArguments = baseIsArguments((function () {
                return arguments;
              })()) ? baseIsArguments : function (value) {
                return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
              };
              var isArray = Array2.isArray;
              var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
              function isArrayLike(value) {
                return value != null && isLength(value.length) && !isFunction(value);
              }
              function isArrayLikeObject(value) {
                return isObjectLike(value) && isArrayLike(value);
              }
              function isBoolean(value) {
                return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
              }
              var isBuffer = nativeIsBuffer || stubFalse;
              var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
              function isElement(value) {
                return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
              }
              function isEmpty(value) {
                if (value == null) {
                  return true;
                }
                if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
                  return !value.length;
                }
                var tag = getTag(value);
                if (tag == mapTag || tag == setTag) {
                  return !value.size;
                }
                if (isPrototype(value)) {
                  return !baseKeys(value).length;
                }
                for (var key in value) {
                  if (hasOwnProperty.call(value, key)) {
                    return false;
                  }
                }
                return true;
              }
              function isEqual2(value, other) {
                return baseIsEqual(value, other);
              }
              function isEqualWith(value, other, customizer) {
                customizer = typeof customizer == "function" ? customizer : undefined2;
                var result2 = customizer ? customizer(value, other) : undefined2;
                return result2 === undefined2 ? baseIsEqual(value, other, undefined2, customizer) : !!result2;
              }
              function isError(value) {
                if (!isObjectLike(value)) {
                  return false;
                }
                var tag = baseGetTag(value);
                return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
              }
              function isFinite(value) {
                return typeof value == "number" && nativeIsFinite(value);
              }
              function isFunction(value) {
                if (!isObject(value)) {
                  return false;
                }
                var tag = baseGetTag(value);
                return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
              }
              function isInteger(value) {
                return typeof value == "number" && value == toInteger(value);
              }
              function isLength(value) {
                return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
              }
              function isObject(value) {
                var type = typeof value;
                return value != null && (type == "object" || type == "function");
              }
              function isObjectLike(value) {
                return value != null && typeof value == "object";
              }
              var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
              function isMatch(object, source) {
                return object === source || baseIsMatch(object, source, getMatchData(source));
              }
              function isMatchWith(object, source, customizer) {
                customizer = typeof customizer == "function" ? customizer : undefined2;
                return baseIsMatch(object, source, getMatchData(source), customizer);
              }
              function isNaN(value) {
                return isNumber(value) && value != +value;
              }
              function isNative(value) {
                if (isMaskable(value)) {
                  throw new Error2(CORE_ERROR_TEXT);
                }
                return baseIsNative(value);
              }
              function isNull(value) {
                return value === null;
              }
              function isNil(value) {
                return value == null;
              }
              function isNumber(value) {
                return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
              }
              function isPlainObject(value) {
                if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
                  return false;
                }
                var proto = getPrototype(value);
                if (proto === null) {
                  return true;
                }
                var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
                return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
              }
              var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
              function isSafeInteger(value) {
                return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
              }
              var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
              function isString(value) {
                return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
              }
              function isSymbol(value) {
                return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
              }
              var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
              function isUndefined(value) {
                return value === undefined2;
              }
              function isWeakMap(value) {
                return isObjectLike(value) && getTag(value) == weakMapTag;
              }
              function isWeakSet(value) {
                return isObjectLike(value) && baseGetTag(value) == weakSetTag;
              }
              var lt = createRelationalOperation(baseLt);
              var lte = createRelationalOperation(function (value, other) {
                return value <= other;
              });
              function toArray(value) {
                if (!value) {
                  return [];
                }
                if (isArrayLike(value)) {
                  return isString(value) ? stringToArray(value) : copyArray(value);
                }
                if (symIterator && value[symIterator]) {
                  return iteratorToArray(value[symIterator]());
                }
                var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
                return func(value);
              }
              function toFinite(value) {
                if (!value) {
                  return value === 0 ? value : 0;
                }
                value = toNumber(value);
                if (value === INFINITY || value === -INFINITY) {
                  var sign = value < 0 ? -1 : 1;
                  return sign * MAX_INTEGER;
                }
                return value === value ? value : 0;
              }
              function toInteger(value) {
                var result2 = toFinite(value), remainder = result2 % 1;
                return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
              }
              function toLength(value) {
                return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
              }
              function toNumber(value) {
                if (typeof value == "number") {
                  return value;
                }
                if (isSymbol(value)) {
                  return NAN;
                }
                if (isObject(value)) {
                  var other = typeof value.valueOf == "function" ? value.valueOf() : value;
                  value = isObject(other) ? other + "" : other;
                }
                if (typeof value != "string") {
                  return value === 0 ? value : +value;
                }
                value = baseTrim(value);
                var isBinary = reIsBinary.test(value);
                return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
              }
              function toPlainObject(value) {
                return copyObject(value, keysIn(value));
              }
              function toSafeInteger(value) {
                return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
              }
              function toString(value) {
                return value == null ? "" : baseToString(value);
              }
              var assign = createAssigner(function (object, source) {
                if (isPrototype(source) || isArrayLike(source)) {
                  copyObject(source, keys(source), object);
                  return;
                }
                for (var key in source) {
                  if (hasOwnProperty.call(source, key)) {
                    assignValue(object, key, source[key]);
                  }
                }
              });
              var assignIn = createAssigner(function (object, source) {
                copyObject(source, keysIn(source), object);
              });
              var assignInWith = createAssigner(function (object, source, srcIndex, customizer) {
                copyObject(source, keysIn(source), object, customizer);
              });
              var assignWith = createAssigner(function (object, source, srcIndex, customizer) {
                copyObject(source, keys(source), object, customizer);
              });
              var at = flatRest(baseAt);
              function create(prototype, properties) {
                var result2 = baseCreate(prototype);
                return properties == null ? result2 : baseAssign(result2, properties);
              }
              var defaults = baseRest(function (object, sources) {
                object = Object2(object);
                var index = -1;
                var length = sources.length;
                var guard = length > 2 ? sources[2] : undefined2;
                if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                  length = 1;
                }
                while (++index < length) {
                  var source = sources[index];
                  var props = keysIn(source);
                  var propsIndex = -1;
                  var propsLength = props.length;
                  while (++propsIndex < propsLength) {
                    var key = props[propsIndex];
                    var value = object[key];
                    if (value === undefined2 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
                      object[key] = source[key];
                    }
                  }
                }
                return object;
              });
              var defaultsDeep = baseRest(function (args) {
                args.push(undefined2, customDefaultsMerge);
                return apply(mergeWith, undefined2, args);
              });
              function findKey(object, predicate) {
                return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
              }
              function findLastKey(object, predicate) {
                return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
              }
              function forIn(object, iteratee2) {
                return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
              }
              function forInRight(object, iteratee2) {
                return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
              }
              function forOwn(object, iteratee2) {
                return object && baseForOwn(object, getIteratee(iteratee2, 3));
              }
              function forOwnRight(object, iteratee2) {
                return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
              }
              function functions(object) {
                return object == null ? [] : baseFunctions(object, keys(object));
              }
              function functionsIn(object) {
                return object == null ? [] : baseFunctions(object, keysIn(object));
              }
              function get(object, path, defaultValue) {
                var result2 = object == null ? undefined2 : baseGet(object, path);
                return result2 === undefined2 ? defaultValue : result2;
              }
              function has(object, path) {
                return object != null && hasPath(object, path, baseHas);
              }
              function hasIn(object, path) {
                return object != null && hasPath(object, path, baseHasIn);
              }
              var invert = createInverter(function (result2, value, key) {
                if (value != null && typeof value.toString != "function") {
                  value = nativeObjectToString.call(value);
                }
                result2[value] = key;
              }, constant(identity));
              var invertBy = createInverter(function (result2, value, key) {
                if (value != null && typeof value.toString != "function") {
                  value = nativeObjectToString.call(value);
                }
                if (hasOwnProperty.call(result2, value)) {
                  result2[value].push(key);
                } else {
                  result2[value] = [key];
                }
              }, getIteratee);
              var invoke = baseRest(baseInvoke);
              function keys(object) {
                return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
              }
              function keysIn(object) {
                return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
              }
              function mapKeys(object, iteratee2) {
                var result2 = {};
                iteratee2 = getIteratee(iteratee2, 3);
                baseForOwn(object, function (value, key, object2) {
                  baseAssignValue(result2, iteratee2(value, key, object2), value);
                });
                return result2;
              }
              function mapValues(object, iteratee2) {
                var result2 = {};
                iteratee2 = getIteratee(iteratee2, 3);
                baseForOwn(object, function (value, key, object2) {
                  baseAssignValue(result2, key, iteratee2(value, key, object2));
                });
                return result2;
              }
              var merge = createAssigner(function (object, source, srcIndex) {
                baseMerge(object, source, srcIndex);
              });
              var mergeWith = createAssigner(function (object, source, srcIndex, customizer) {
                baseMerge(object, source, srcIndex, customizer);
              });
              var omit = flatRest(function (object, paths) {
                var result2 = {};
                if (object == null) {
                  return result2;
                }
                var isDeep = false;
                paths = arrayMap(paths, function (path) {
                  path = castPath(path, object);
                  isDeep || (isDeep = path.length > 1);
                  return path;
                });
                copyObject(object, getAllKeysIn(object), result2);
                if (isDeep) {
                  result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
                }
                var length = paths.length;
                while (length--) {
                  baseUnset(result2, paths[length]);
                }
                return result2;
              });
              function omitBy(object, predicate) {
                return pickBy(object, negate(getIteratee(predicate)));
              }
              var pick = flatRest(function (object, paths) {
                return object == null ? {} : basePick(object, paths);
              });
              function pickBy(object, predicate) {
                if (object == null) {
                  return {};
                }
                var props = arrayMap(getAllKeysIn(object), function (prop) {
                  return [prop];
                });
                predicate = getIteratee(predicate);
                return basePickBy(object, props, function (value, path) {
                  return predicate(value, path[0]);
                });
              }
              function result(object, path, defaultValue) {
                path = castPath(path, object);
                var index = -1, length = path.length;
                if (!length) {
                  length = 1;
                  object = undefined2;
                }
                while (++index < length) {
                  var value = object == null ? undefined2 : object[toKey(path[index])];
                  if (value === undefined2) {
                    index = length;
                    value = defaultValue;
                  }
                  object = isFunction(value) ? value.call(object) : value;
                }
                return object;
              }
              function set(object, path, value) {
                return object == null ? object : baseSet(object, path, value);
              }
              function setWith(object, path, value, customizer) {
                customizer = typeof customizer == "function" ? customizer : undefined2;
                return object == null ? object : baseSet(object, path, value, customizer);
              }
              var toPairs = createToPairs(keys);
              var toPairsIn = createToPairs(keysIn);
              function transform(object, iteratee2, accumulator) {
                var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
                iteratee2 = getIteratee(iteratee2, 4);
                if (accumulator == null) {
                  var Ctor = object && object.constructor;
                  if (isArrLike) {
                    accumulator = isArr ? new Ctor() : [];
                  } else if (isObject(object)) {
                    accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
                  } else {
                    accumulator = {};
                  }
                }
                (isArrLike ? arrayEach : baseForOwn)(object, function (value, index, object2) {
                  return iteratee2(accumulator, value, index, object2);
                });
                return accumulator;
              }
              function unset(object, path) {
                return object == null ? true : baseUnset(object, path);
              }
              function update(object, path, updater) {
                return object == null ? object : baseUpdate(object, path, castFunction(updater));
              }
              function updateWith(object, path, updater, customizer) {
                customizer = typeof customizer == "function" ? customizer : undefined2;
                return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
              }
              function values(object) {
                return object == null ? [] : baseValues(object, keys(object));
              }
              function valuesIn(object) {
                return object == null ? [] : baseValues(object, keysIn(object));
              }
              function clamp(number, lower, upper) {
                if (upper === undefined2) {
                  upper = lower;
                  lower = undefined2;
                }
                if (upper !== undefined2) {
                  upper = toNumber(upper);
                  upper = upper === upper ? upper : 0;
                }
                if (lower !== undefined2) {
                  lower = toNumber(lower);
                  lower = lower === lower ? lower : 0;
                }
                return baseClamp(toNumber(number), lower, upper);
              }
              function inRange(number, start, end) {
                start = toFinite(start);
                if (end === undefined2) {
                  end = start;
                  start = 0;
                } else {
                  end = toFinite(end);
                }
                number = toNumber(number);
                return baseInRange(number, start, end);
              }
              function random(lower, upper, floating) {
                if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
                  upper = floating = undefined2;
                }
                if (floating === undefined2) {
                  if (typeof upper == "boolean") {
                    floating = upper;
                    upper = undefined2;
                  } else if (typeof lower == "boolean") {
                    floating = lower;
                    lower = undefined2;
                  }
                }
                if (lower === undefined2 && upper === undefined2) {
                  lower = 0;
                  upper = 1;
                } else {
                  lower = toFinite(lower);
                  if (upper === undefined2) {
                    upper = lower;
                    lower = 0;
                  } else {
                    upper = toFinite(upper);
                  }
                }
                if (lower > upper) {
                  var temp = lower;
                  lower = upper;
                  upper = temp;
                }
                if (floating || lower % 1 || upper % 1) {
                  var rand = nativeRandom();
                  return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
                }
                return baseRandom(lower, upper);
              }
              var camelCase = createCompounder(function (result2, word, index) {
                word = word.toLowerCase();
                return result2 + (index ? capitalize(word) : word);
              });
              function capitalize(string) {
                return upperFirst(toString(string).toLowerCase());
              }
              function deburr(string) {
                string = toString(string);
                return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
              }
              function endsWith(string, target, position) {
                string = toString(string);
                target = baseToString(target);
                var length = string.length;
                position = position === undefined2 ? length : baseClamp(toInteger(position), 0, length);
                var end = position;
                position -= target.length;
                return position >= 0 && string.slice(position, end) == target;
              }
              function escape(string) {
                string = toString(string);
                return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
              }
              function escapeRegExp(string) {
                string = toString(string);
                return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
              }
              var kebabCase = createCompounder(function (result2, word, index) {
                return result2 + (index ? "-" : "") + word.toLowerCase();
              });
              var lowerCase = createCompounder(function (result2, word, index) {
                return result2 + (index ? " " : "") + word.toLowerCase();
              });
              var lowerFirst = createCaseFirst("toLowerCase");
              function pad(string, length, chars) {
                string = toString(string);
                length = toInteger(length);
                var strLength = length ? stringSize(string) : 0;
                if (!length || strLength >= length) {
                  return string;
                }
                var mid = (length - strLength) / 2;
                return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
              }
              function padEnd(string, length, chars) {
                string = toString(string);
                length = toInteger(length);
                var strLength = length ? stringSize(string) : 0;
                return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
              }
              function padStart(string, length, chars) {
                string = toString(string);
                length = toInteger(length);
                var strLength = length ? stringSize(string) : 0;
                return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
              }
              function parseInt2(string, radix, guard) {
                if (guard || radix == null) {
                  radix = 0;
                } else if (radix) {
                  radix = +radix;
                }
                return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
              }
              function repeat(string, n, guard) {
                if (guard ? isIterateeCall(string, n, guard) : n === undefined2) {
                  n = 1;
                } else {
                  n = toInteger(n);
                }
                return baseRepeat(toString(string), n);
              }
              function replace() {
                var args = arguments, string = toString(args[0]);
                return args.length < 3 ? string : string.replace(args[1], args[2]);
              }
              var snakeCase = createCompounder(function (result2, word, index) {
                return result2 + (index ? "_" : "") + word.toLowerCase();
              });
              function split(string, separator, limit) {
                if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
                  separator = limit = undefined2;
                }
                limit = limit === undefined2 ? MAX_ARRAY_LENGTH : limit >>> 0;
                if (!limit) {
                  return [];
                }
                string = toString(string);
                if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
                  separator = baseToString(separator);
                  if (!separator && hasUnicode(string)) {
                    return castSlice(stringToArray(string), 0, limit);
                  }
                }
                return string.split(separator, limit);
              }
              var startCase = createCompounder(function (result2, word, index) {
                return result2 + (index ? " " : "") + upperFirst(word);
              });
              function startsWith(string, target, position) {
                string = toString(string);
                position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
                target = baseToString(target);
                return string.slice(position, position + target.length) == target;
              }
              function template(string, options, guard) {
                var settings = lodash.templateSettings;
                if (guard && isIterateeCall(string, options, guard)) {
                  options = undefined2;
                }
                string = toString(string);
                options = assignInWith({}, options, settings, customDefaultsAssignIn);
                var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
                var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
                var reDelimiters = RegExp2((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
                var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
                string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
                  interpolateValue || (interpolateValue = esTemplateValue);
                  source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
                  if (escapeValue) {
                    isEscaping = true;
                    source += "' +\n__e(" + escapeValue + ") +\n'";
                  }
                  if (evaluateValue) {
                    isEvaluating = true;
                    source += "';\n" + evaluateValue + ";\n__p += '";
                  }
                  if (interpolateValue) {
                    source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
                  }
                  index = offset + match.length;
                  return match;
                });
                source += "';\n";
                var variable = hasOwnProperty.call(options, "variable") && options.variable;
                if (!variable) {
                  source = "with (obj) {\n" + source + "\n}\n";
                } else if (reForbiddenIdentifierChars.test(variable)) {
                  throw new Error2(INVALID_TEMPL_VAR_ERROR_TEXT);
                }
                source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
                source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
                var result2 = attempt(function () {
                  return Function2(importsKeys, sourceURL + "return " + source).apply(undefined2, importsValues);
                });
                result2.source = source;
                if (isError(result2)) {
                  throw result2;
                }
                return result2;
              }
              function toLower(value) {
                return toString(value).toLowerCase();
              }
              function toUpper(value) {
                return toString(value).toUpperCase();
              }
              function trim(string, chars, guard) {
                string = toString(string);
                if (string && (guard || chars === undefined2)) {
                  return baseTrim(string);
                }
                if (!string || !(chars = baseToString(chars))) {
                  return string;
                }
                var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
                return castSlice(strSymbols, start, end).join("");
              }
              function trimEnd(string, chars, guard) {
                string = toString(string);
                if (string && (guard || chars === undefined2)) {
                  return string.slice(0, trimmedEndIndex(string) + 1);
                }
                if (!string || !(chars = baseToString(chars))) {
                  return string;
                }
                var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
                return castSlice(strSymbols, 0, end).join("");
              }
              function trimStart(string, chars, guard) {
                string = toString(string);
                if (string && (guard || chars === undefined2)) {
                  return string.replace(reTrimStart, "");
                }
                if (!string || !(chars = baseToString(chars))) {
                  return string;
                }
                var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
                return castSlice(strSymbols, start).join("");
              }
              function truncate(string, options) {
                var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
                if (isObject(options)) {
                  var separator = ("separator" in options) ? options.separator : separator;
                  length = ("length" in options) ? toInteger(options.length) : length;
                  omission = ("omission" in options) ? baseToString(options.omission) : omission;
                }
                string = toString(string);
                var strLength = string.length;
                if (hasUnicode(string)) {
                  var strSymbols = stringToArray(string);
                  strLength = strSymbols.length;
                }
                if (length >= strLength) {
                  return string;
                }
                var end = length - stringSize(omission);
                if (end < 1) {
                  return omission;
                }
                var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
                if (separator === undefined2) {
                  return result2 + omission;
                }
                if (strSymbols) {
                  end += result2.length - end;
                }
                if (isRegExp(separator)) {
                  if (string.slice(end).search(separator)) {
                    var match, substring = result2;
                    if (!separator.global) {
                      separator = RegExp2(separator.source, toString(reFlags.exec(separator)) + "g");
                    }
                    separator.lastIndex = 0;
                    while (match = separator.exec(substring)) {
                      var newEnd = match.index;
                    }
                    result2 = result2.slice(0, newEnd === undefined2 ? end : newEnd);
                  }
                } else if (string.indexOf(baseToString(separator), end) != end) {
                  var index = result2.lastIndexOf(separator);
                  if (index > -1) {
                    result2 = result2.slice(0, index);
                  }
                }
                return result2 + omission;
              }
              function unescape(string) {
                string = toString(string);
                return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
              }
              var upperCase = createCompounder(function (result2, word, index) {
                return result2 + (index ? " " : "") + word.toUpperCase();
              });
              var upperFirst = createCaseFirst("toUpperCase");
              function words(string, pattern, guard) {
                string = toString(string);
                pattern = guard ? undefined2 : pattern;
                if (pattern === undefined2) {
                  return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
                }
                return string.match(pattern) || [];
              }
              var attempt = baseRest(function (func, args) {
                try {
                  return apply(func, undefined2, args);
                } catch (e) {
                  return isError(e) ? e : new Error2(e);
                }
              });
              var bindAll = flatRest(function (object, methodNames) {
                arrayEach(methodNames, function (key) {
                  key = toKey(key);
                  baseAssignValue(object, key, bind(object[key], object));
                });
                return object;
              });
              function cond(pairs) {
                var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
                pairs = !length ? [] : arrayMap(pairs, function (pair) {
                  if (typeof pair[1] != "function") {
                    throw new TypeError2(FUNC_ERROR_TEXT);
                  }
                  return [toIteratee(pair[0]), pair[1]];
                });
                return baseRest(function (args) {
                  var index = -1;
                  while (++index < length) {
                    var pair = pairs[index];
                    if (apply(pair[0], this, args)) {
                      return apply(pair[1], this, args);
                    }
                  }
                });
              }
              function conforms(source) {
                return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
              }
              function constant(value) {
                return function () {
                  return value;
                };
              }
              function defaultTo(value, defaultValue) {
                return value == null || value !== value ? defaultValue : value;
              }
              var flow = createFlow();
              var flowRight = createFlow(true);
              function identity(value) {
                return value;
              }
              function iteratee(func) {
                return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
              }
              function matches(source) {
                return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
              }
              function matchesProperty(path, srcValue) {
                return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
              }
              var method = baseRest(function (path, args) {
                return function (object) {
                  return baseInvoke(object, path, args);
                };
              });
              var methodOf = baseRest(function (object, args) {
                return function (path) {
                  return baseInvoke(object, path, args);
                };
              });
              function mixin(object, source, options) {
                var props = keys(source), methodNames = baseFunctions(source, props);
                if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
                  options = source;
                  source = object;
                  object = this;
                  methodNames = baseFunctions(source, keys(source));
                }
                var chain2 = !(isObject(options) && ("chain" in options)) || !!options.chain, isFunc = isFunction(object);
                arrayEach(methodNames, function (methodName) {
                  var func = source[methodName];
                  object[methodName] = func;
                  if (isFunc) {
                    object.prototype[methodName] = function () {
                      var chainAll = this.__chain__;
                      if (chain2 || chainAll) {
                        var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                        actions.push({
                          "func": func,
                          "args": arguments,
                          "thisArg": object
                        });
                        result2.__chain__ = chainAll;
                        return result2;
                      }
                      return func.apply(object, arrayPush([this.value()], arguments));
                    };
                  }
                });
                return object;
              }
              function noConflict() {
                if (root._ === this) {
                  root._ = oldDash;
                }
                return this;
              }
              function noop() {}
              function nthArg(n) {
                n = toInteger(n);
                return baseRest(function (args) {
                  return baseNth(args, n);
                });
              }
              var over = createOver(arrayMap);
              var overEvery = createOver(arrayEvery);
              var overSome = createOver(arraySome);
              function property(path) {
                return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
              }
              function propertyOf(object) {
                return function (path) {
                  return object == null ? undefined2 : baseGet(object, path);
                };
              }
              var range = createRange();
              var rangeRight = createRange(true);
              function stubArray() {
                return [];
              }
              function stubFalse() {
                return false;
              }
              function stubObject() {
                return {};
              }
              function stubString() {
                return "";
              }
              function stubTrue() {
                return true;
              }
              function times(n, iteratee2) {
                n = toInteger(n);
                if (n < 1 || n > MAX_SAFE_INTEGER) {
                  return [];
                }
                var index = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
                iteratee2 = getIteratee(iteratee2);
                n -= MAX_ARRAY_LENGTH;
                var result2 = baseTimes(length, iteratee2);
                while (++index < n) {
                  iteratee2(index);
                }
                return result2;
              }
              function toPath(value) {
                if (isArray(value)) {
                  return arrayMap(value, toKey);
                }
                return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
              }
              function uniqueId(prefix) {
                var id = ++idCounter;
                return toString(prefix) + id;
              }
              var add = createMathOperation(function (augend, addend) {
                return augend + addend;
              }, 0);
              var ceil = createRound("ceil");
              var divide = createMathOperation(function (dividend, divisor) {
                return dividend / divisor;
              }, 1);
              var floor = createRound("floor");
              function max(array) {
                return array && array.length ? baseExtremum(array, identity, baseGt) : undefined2;
              }
              function maxBy(array, iteratee2) {
                return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined2;
              }
              function mean(array) {
                return baseMean(array, identity);
              }
              function meanBy(array, iteratee2) {
                return baseMean(array, getIteratee(iteratee2, 2));
              }
              function min(array) {
                return array && array.length ? baseExtremum(array, identity, baseLt) : undefined2;
              }
              function minBy(array, iteratee2) {
                return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined2;
              }
              var multiply = createMathOperation(function (multiplier, multiplicand) {
                return multiplier * multiplicand;
              }, 1);
              var round = createRound("round");
              var subtract = createMathOperation(function (minuend, subtrahend) {
                return minuend - subtrahend;
              }, 0);
              function sum(array) {
                return array && array.length ? baseSum(array, identity) : 0;
              }
              function sumBy(array, iteratee2) {
                return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
              }
              lodash.after = after;
              lodash.ary = ary;
              lodash.assign = assign;
              lodash.assignIn = assignIn;
              lodash.assignInWith = assignInWith;
              lodash.assignWith = assignWith;
              lodash.at = at;
              lodash.before = before;
              lodash.bind = bind;
              lodash.bindAll = bindAll;
              lodash.bindKey = bindKey;
              lodash.castArray = castArray;
              lodash.chain = chain;
              lodash.chunk = chunk;
              lodash.compact = compact;
              lodash.concat = concat;
              lodash.cond = cond;
              lodash.conforms = conforms;
              lodash.constant = constant;
              lodash.countBy = countBy;
              lodash.create = create;
              lodash.curry = curry;
              lodash.curryRight = curryRight;
              lodash.debounce = debounce;
              lodash.defaults = defaults;
              lodash.defaultsDeep = defaultsDeep;
              lodash.defer = defer;
              lodash.delay = delay;
              lodash.difference = difference;
              lodash.differenceBy = differenceBy;
              lodash.differenceWith = differenceWith;
              lodash.drop = drop;
              lodash.dropRight = dropRight;
              lodash.dropRightWhile = dropRightWhile;
              lodash.dropWhile = dropWhile;
              lodash.fill = fill;
              lodash.filter = filter;
              lodash.flatMap = flatMap;
              lodash.flatMapDeep = flatMapDeep;
              lodash.flatMapDepth = flatMapDepth;
              lodash.flatten = flatten;
              lodash.flattenDeep = flattenDeep;
              lodash.flattenDepth = flattenDepth;
              lodash.flip = flip;
              lodash.flow = flow;
              lodash.flowRight = flowRight;
              lodash.fromPairs = fromPairs;
              lodash.functions = functions;
              lodash.functionsIn = functionsIn;
              lodash.groupBy = groupBy;
              lodash.initial = initial;
              lodash.intersection = intersection;
              lodash.intersectionBy = intersectionBy;
              lodash.intersectionWith = intersectionWith;
              lodash.invert = invert;
              lodash.invertBy = invertBy;
              lodash.invokeMap = invokeMap;
              lodash.iteratee = iteratee;
              lodash.keyBy = keyBy;
              lodash.keys = keys;
              lodash.keysIn = keysIn;
              lodash.map = map;
              lodash.mapKeys = mapKeys;
              lodash.mapValues = mapValues;
              lodash.matches = matches;
              lodash.matchesProperty = matchesProperty;
              lodash.memoize = memoize;
              lodash.merge = merge;
              lodash.mergeWith = mergeWith;
              lodash.method = method;
              lodash.methodOf = methodOf;
              lodash.mixin = mixin;
              lodash.negate = negate;
              lodash.nthArg = nthArg;
              lodash.omit = omit;
              lodash.omitBy = omitBy;
              lodash.once = once;
              lodash.orderBy = orderBy;
              lodash.over = over;
              lodash.overArgs = overArgs;
              lodash.overEvery = overEvery;
              lodash.overSome = overSome;
              lodash.partial = partial;
              lodash.partialRight = partialRight;
              lodash.partition = partition;
              lodash.pick = pick;
              lodash.pickBy = pickBy;
              lodash.property = property;
              lodash.propertyOf = propertyOf;
              lodash.pull = pull;
              lodash.pullAll = pullAll;
              lodash.pullAllBy = pullAllBy;
              lodash.pullAllWith = pullAllWith;
              lodash.pullAt = pullAt;
              lodash.range = range;
              lodash.rangeRight = rangeRight;
              lodash.rearg = rearg;
              lodash.reject = reject;
              lodash.remove = remove;
              lodash.rest = rest;
              lodash.reverse = reverse;
              lodash.sampleSize = sampleSize;
              lodash.set = set;
              lodash.setWith = setWith;
              lodash.shuffle = shuffle;
              lodash.slice = slice;
              lodash.sortBy = sortBy;
              lodash.sortedUniq = sortedUniq;
              lodash.sortedUniqBy = sortedUniqBy;
              lodash.split = split;
              lodash.spread = spread;
              lodash.tail = tail;
              lodash.take = take;
              lodash.takeRight = takeRight;
              lodash.takeRightWhile = takeRightWhile;
              lodash.takeWhile = takeWhile;
              lodash.tap = tap;
              lodash.throttle = throttle;
              lodash.thru = thru;
              lodash.toArray = toArray;
              lodash.toPairs = toPairs;
              lodash.toPairsIn = toPairsIn;
              lodash.toPath = toPath;
              lodash.toPlainObject = toPlainObject;
              lodash.transform = transform;
              lodash.unary = unary;
              lodash.union = union;
              lodash.unionBy = unionBy;
              lodash.unionWith = unionWith;
              lodash.uniq = uniq;
              lodash.uniqBy = uniqBy;
              lodash.uniqWith = uniqWith;
              lodash.unset = unset;
              lodash.unzip = unzip;
              lodash.unzipWith = unzipWith;
              lodash.update = update;
              lodash.updateWith = updateWith;
              lodash.values = values;
              lodash.valuesIn = valuesIn;
              lodash.without = without;
              lodash.words = words;
              lodash.wrap = wrap;
              lodash.xor = xor;
              lodash.xorBy = xorBy;
              lodash.xorWith = xorWith;
              lodash.zip = zip;
              lodash.zipObject = zipObject;
              lodash.zipObjectDeep = zipObjectDeep;
              lodash.zipWith = zipWith;
              lodash.entries = toPairs;
              lodash.entriesIn = toPairsIn;
              lodash.extend = assignIn;
              lodash.extendWith = assignInWith;
              mixin(lodash, lodash);
              lodash.add = add;
              lodash.attempt = attempt;
              lodash.camelCase = camelCase;
              lodash.capitalize = capitalize;
              lodash.ceil = ceil;
              lodash.clamp = clamp;
              lodash.clone = clone;
              lodash.cloneDeep = cloneDeep;
              lodash.cloneDeepWith = cloneDeepWith;
              lodash.cloneWith = cloneWith;
              lodash.conformsTo = conformsTo;
              lodash.deburr = deburr;
              lodash.defaultTo = defaultTo;
              lodash.divide = divide;
              lodash.endsWith = endsWith;
              lodash.eq = eq;
              lodash.escape = escape;
              lodash.escapeRegExp = escapeRegExp;
              lodash.every = every;
              lodash.find = find;
              lodash.findIndex = findIndex;
              lodash.findKey = findKey;
              lodash.findLast = findLast;
              lodash.findLastIndex = findLastIndex;
              lodash.findLastKey = findLastKey;
              lodash.floor = floor;
              lodash.forEach = forEach;
              lodash.forEachRight = forEachRight;
              lodash.forIn = forIn;
              lodash.forInRight = forInRight;
              lodash.forOwn = forOwn;
              lodash.forOwnRight = forOwnRight;
              lodash.get = get;
              lodash.gt = gt;
              lodash.gte = gte;
              lodash.has = has;
              lodash.hasIn = hasIn;
              lodash.head = head;
              lodash.identity = identity;
              lodash.includes = includes;
              lodash.indexOf = indexOf;
              lodash.inRange = inRange;
              lodash.invoke = invoke;
              lodash.isArguments = isArguments;
              lodash.isArray = isArray;
              lodash.isArrayBuffer = isArrayBuffer;
              lodash.isArrayLike = isArrayLike;
              lodash.isArrayLikeObject = isArrayLikeObject;
              lodash.isBoolean = isBoolean;
              lodash.isBuffer = isBuffer;
              lodash.isDate = isDate;
              lodash.isElement = isElement;
              lodash.isEmpty = isEmpty;
              lodash.isEqual = isEqual2;
              lodash.isEqualWith = isEqualWith;
              lodash.isError = isError;
              lodash.isFinite = isFinite;
              lodash.isFunction = isFunction;
              lodash.isInteger = isInteger;
              lodash.isLength = isLength;
              lodash.isMap = isMap;
              lodash.isMatch = isMatch;
              lodash.isMatchWith = isMatchWith;
              lodash.isNaN = isNaN;
              lodash.isNative = isNative;
              lodash.isNil = isNil;
              lodash.isNull = isNull;
              lodash.isNumber = isNumber;
              lodash.isObject = isObject;
              lodash.isObjectLike = isObjectLike;
              lodash.isPlainObject = isPlainObject;
              lodash.isRegExp = isRegExp;
              lodash.isSafeInteger = isSafeInteger;
              lodash.isSet = isSet;
              lodash.isString = isString;
              lodash.isSymbol = isSymbol;
              lodash.isTypedArray = isTypedArray;
              lodash.isUndefined = isUndefined;
              lodash.isWeakMap = isWeakMap;
              lodash.isWeakSet = isWeakSet;
              lodash.join = join;
              lodash.kebabCase = kebabCase;
              lodash.last = last;
              lodash.lastIndexOf = lastIndexOf;
              lodash.lowerCase = lowerCase;
              lodash.lowerFirst = lowerFirst;
              lodash.lt = lt;
              lodash.lte = lte;
              lodash.max = max;
              lodash.maxBy = maxBy;
              lodash.mean = mean;
              lodash.meanBy = meanBy;
              lodash.min = min;
              lodash.minBy = minBy;
              lodash.stubArray = stubArray;
              lodash.stubFalse = stubFalse;
              lodash.stubObject = stubObject;
              lodash.stubString = stubString;
              lodash.stubTrue = stubTrue;
              lodash.multiply = multiply;
              lodash.nth = nth;
              lodash.noConflict = noConflict;
              lodash.noop = noop;
              lodash.now = now;
              lodash.pad = pad;
              lodash.padEnd = padEnd;
              lodash.padStart = padStart;
              lodash.parseInt = parseInt2;
              lodash.random = random;
              lodash.reduce = reduce;
              lodash.reduceRight = reduceRight;
              lodash.repeat = repeat;
              lodash.replace = replace;
              lodash.result = result;
              lodash.round = round;
              lodash.runInContext = runInContext2;
              lodash.sample = sample;
              lodash.size = size;
              lodash.snakeCase = snakeCase;
              lodash.some = some;
              lodash.sortedIndex = sortedIndex;
              lodash.sortedIndexBy = sortedIndexBy;
              lodash.sortedIndexOf = sortedIndexOf;
              lodash.sortedLastIndex = sortedLastIndex;
              lodash.sortedLastIndexBy = sortedLastIndexBy;
              lodash.sortedLastIndexOf = sortedLastIndexOf;
              lodash.startCase = startCase;
              lodash.startsWith = startsWith;
              lodash.subtract = subtract;
              lodash.sum = sum;
              lodash.sumBy = sumBy;
              lodash.template = template;
              lodash.times = times;
              lodash.toFinite = toFinite;
              lodash.toInteger = toInteger;
              lodash.toLength = toLength;
              lodash.toLower = toLower;
              lodash.toNumber = toNumber;
              lodash.toSafeInteger = toSafeInteger;
              lodash.toString = toString;
              lodash.toUpper = toUpper;
              lodash.trim = trim;
              lodash.trimEnd = trimEnd;
              lodash.trimStart = trimStart;
              lodash.truncate = truncate;
              lodash.unescape = unescape;
              lodash.uniqueId = uniqueId;
              lodash.upperCase = upperCase;
              lodash.upperFirst = upperFirst;
              lodash.each = forEach;
              lodash.eachRight = forEachRight;
              lodash.first = head;
              mixin(lodash, (function () {
                var source = {};
                baseForOwn(lodash, function (func, methodName) {
                  if (!hasOwnProperty.call(lodash.prototype, methodName)) {
                    source[methodName] = func;
                  }
                });
                return source;
              })(), {
                "chain": false
              });
              lodash.VERSION = VERSION;
              arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function (methodName) {
                lodash[methodName].placeholder = lodash;
              });
              arrayEach(["drop", "take"], function (methodName, index) {
                LazyWrapper.prototype[methodName] = function (n) {
                  n = n === undefined2 ? 1 : nativeMax(toInteger(n), 0);
                  var result2 = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
                  if (result2.__filtered__) {
                    result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
                  } else {
                    result2.__views__.push({
                      "size": nativeMin(n, MAX_ARRAY_LENGTH),
                      "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
                    });
                  }
                  return result2;
                };
                LazyWrapper.prototype[methodName + "Right"] = function (n) {
                  return this.reverse()[methodName](n).reverse();
                };
              });
              arrayEach(["filter", "map", "takeWhile"], function (methodName, index) {
                var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
                LazyWrapper.prototype[methodName] = function (iteratee2) {
                  var result2 = this.clone();
                  result2.__iteratees__.push({
                    "iteratee": getIteratee(iteratee2, 3),
                    "type": type
                  });
                  result2.__filtered__ = result2.__filtered__ || isFilter;
                  return result2;
                };
              });
              arrayEach(["head", "last"], function (methodName, index) {
                var takeName = "take" + (index ? "Right" : "");
                LazyWrapper.prototype[methodName] = function () {
                  return this[takeName](1).value()[0];
                };
              });
              arrayEach(["initial", "tail"], function (methodName, index) {
                var dropName = "drop" + (index ? "" : "Right");
                LazyWrapper.prototype[methodName] = function () {
                  return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
                };
              });
              LazyWrapper.prototype.compact = function () {
                return this.filter(identity);
              };
              LazyWrapper.prototype.find = function (predicate) {
                return this.filter(predicate).head();
              };
              LazyWrapper.prototype.findLast = function (predicate) {
                return this.reverse().find(predicate);
              };
              LazyWrapper.prototype.invokeMap = baseRest(function (path, args) {
                if (typeof path == "function") {
                  return new LazyWrapper(this);
                }
                return this.map(function (value) {
                  return baseInvoke(value, path, args);
                });
              });
              LazyWrapper.prototype.reject = function (predicate) {
                return this.filter(negate(getIteratee(predicate)));
              };
              LazyWrapper.prototype.slice = function (start, end) {
                start = toInteger(start);
                var result2 = this;
                if (result2.__filtered__ && (start > 0 || end < 0)) {
                  return new LazyWrapper(result2);
                }
                if (start < 0) {
                  result2 = result2.takeRight(-start);
                } else if (start) {
                  result2 = result2.drop(start);
                }
                if (end !== undefined2) {
                  end = toInteger(end);
                  result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
                }
                return result2;
              };
              LazyWrapper.prototype.takeRightWhile = function (predicate) {
                return this.reverse().takeWhile(predicate).reverse();
              };
              LazyWrapper.prototype.toArray = function () {
                return this.take(MAX_ARRAY_LENGTH);
              };
              baseForOwn(LazyWrapper.prototype, function (func, methodName) {
                var checkIteratee = (/^(?:filter|find|map|reject)|While$/).test(methodName), isTaker = (/^(?:head|last)$/).test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || (/^find/).test(methodName);
                if (!lodashFunc) {
                  return;
                }
                lodash.prototype[methodName] = function () {
                  var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray(value);
                  var interceptor = function (value2) {
                    var result3 = lodashFunc.apply(lodash, arrayPush([value2], args));
                    return isTaker && chainAll ? result3[0] : result3;
                  };
                  if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
                    isLazy = useLazy = false;
                  }
                  var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
                  if (!retUnwrapped && useLazy) {
                    value = onlyLazy ? value : new LazyWrapper(this);
                    var result2 = func.apply(value, args);
                    result2.__actions__.push({
                      "func": thru,
                      "args": [interceptor],
                      "thisArg": undefined2
                    });
                    return new LodashWrapper(result2, chainAll);
                  }
                  if (isUnwrapped && onlyLazy) {
                    return func.apply(this, args);
                  }
                  result2 = this.thru(interceptor);
                  return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
                };
              });
              arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function (methodName) {
                var func = arrayProto[methodName], chainName = (/^(?:push|sort|unshift)$/).test(methodName) ? "tap" : "thru", retUnwrapped = (/^(?:pop|shift)$/).test(methodName);
                lodash.prototype[methodName] = function () {
                  var args = arguments;
                  if (retUnwrapped && !this.__chain__) {
                    var value = this.value();
                    return func.apply(isArray(value) ? value : [], args);
                  }
                  return this[chainName](function (value2) {
                    return func.apply(isArray(value2) ? value2 : [], args);
                  });
                };
              });
              baseForOwn(LazyWrapper.prototype, function (func, methodName) {
                var lodashFunc = lodash[methodName];
                if (lodashFunc) {
                  var key = lodashFunc.name + "";
                  if (!hasOwnProperty.call(realNames, key)) {
                    realNames[key] = [];
                  }
                  realNames[key].push({
                    "name": methodName,
                    "func": lodashFunc
                  });
                }
              });
              realNames[createHybrid(undefined2, WRAP_BIND_KEY_FLAG).name] = [{
                "name": "wrapper",
                "func": undefined2
              }];
              LazyWrapper.prototype.clone = lazyClone;
              LazyWrapper.prototype.reverse = lazyReverse;
              LazyWrapper.prototype.value = lazyValue;
              lodash.prototype.at = wrapperAt;
              lodash.prototype.chain = wrapperChain;
              lodash.prototype.commit = wrapperCommit;
              lodash.prototype.next = wrapperNext;
              lodash.prototype.plant = wrapperPlant;
              lodash.prototype.reverse = wrapperReverse;
              lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
              lodash.prototype.first = lodash.prototype.head;
              if (symIterator) {
                lodash.prototype[symIterator] = wrapperToIterator;
              }
              return lodash;
            };
            var _ = runInContext();
            if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
              root._ = _;
              define(function () {
                return _;
              });
            } else if (freeModule) {
              (freeModule.exports = _)._ = _;
              freeExports._ = _;
            } else {
              root._ = _;
            }
          }).call(exports2);
        }
      });
      var src_exports = {};
      __export2(src_exports, {
        compile: () => compile22,
        compileParseTree: () => compileParseTree,
        getStringParseTree: () => getStringParseTree,
        parse: () => parse
      });
      module.exports = __toCommonJS2(src_exports);
      var Reflect2;
      (function (Reflect3) {
        (function (factory) {
          var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : Function("return this;")();
          var exporter = makeExporter(Reflect3);
          if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect3;
          } else {
            exporter = makeExporter(root.Reflect, exporter);
          }
          factory(exporter);
          function makeExporter(target, previous) {
            return function (key, value) {
              if (typeof target[key] !== "function") {
                Object.defineProperty(target, key, {
                  configurable: true,
                  writable: true,
                  value
                });
              }
              if (previous) previous(key, value);
            };
          }
        })(function (exporter) {
          var hasOwn = Object.prototype.hasOwnProperty;
          var supportsSymbol = typeof Symbol === "function";
          var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
          var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
          var supportsCreate = typeof Object.create === "function";
          var supportsProto = ({
            __proto__: []
          }) instanceof Array;
          var downLevel = !supportsCreate && !supportsProto;
          var HashMap = {
            create: supportsCreate ? function () {
              return MakeDictionary(Object.create(null));
            } : supportsProto ? function () {
              return MakeDictionary({
                __proto__: null
              });
            } : function () {
              return MakeDictionary({});
            },
            has: downLevel ? function (map, key) {
              return hasOwn.call(map, key);
            } : function (map, key) {
              return (key in map);
            },
            get: downLevel ? function (map, key) {
              return hasOwn.call(map, key) ? map[key] : void 0;
            } : function (map, key) {
              return map[key];
            }
          };
          var functionPrototype = Object.getPrototypeOf(Function);
          var usePolyfill = typeof define_process_default === "object" && define_process_default.env && define_process_default.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
          var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
          var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
          var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
          var Metadata = new _WeakMap();
          function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
              if (!IsArray(decorators)) throw new TypeError();
              if (!IsObject(target)) throw new TypeError();
              if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes)) throw new TypeError();
              if (IsNull(attributes)) attributes = void 0;
              propertyKey = ToPropertyKey(propertyKey);
              return DecorateProperty(decorators, target, propertyKey, attributes);
            } else {
              if (!IsArray(decorators)) throw new TypeError();
              if (!IsConstructor(target)) throw new TypeError();
              return DecorateConstructor(decorators, target);
            }
          }
          exporter("decorate", decorate);
          function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
              if (!IsObject(target)) throw new TypeError();
              if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) throw new TypeError();
              OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
          }
          exporter("metadata", metadata);
          function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
          }
          exporter("defineMetadata", defineMetadata);
          function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
          }
          exporter("hasMetadata", hasMetadata);
          function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
          }
          exporter("hasOwnMetadata", hasOwnMetadata);
          function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
          }
          exporter("getMetadata", getMetadata);
          function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
          }
          exporter("getOwnMetadata", getOwnMetadata);
          function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
          }
          exporter("getMetadataKeys", getMetadataKeys);
          function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
          }
          exporter("getOwnMetadataKeys", getOwnMetadataKeys);
          function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target)) throw new TypeError();
            if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, false);
            if (IsUndefined(metadataMap)) return false;
            if (!metadataMap.delete(metadataKey)) return false;
            if (metadataMap.size > 0) return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0) return true;
            Metadata.delete(target);
            return true;
          }
          exporter("deleteMetadata", deleteMetadata);
          function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
              var decorator = decorators[i];
              var decorated = decorator(target);
              if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated)) throw new TypeError();
                target = decorated;
              }
            }
            return target;
          }
          function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
              var decorator = decorators[i];
              var decorated = decorator(target, propertyKey, descriptor);
              if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated)) throw new TypeError();
                descriptor = decorated;
              }
            }
            return descriptor;
          }
          function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
              if (!Create) return void 0;
              targetMetadata = new _Map();
              Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
              if (!Create) return void 0;
              metadataMap = new _Map();
              targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
          }
          function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn2) return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent)) return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
          }
          function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap)) return false;
            return ToBoolean(metadataMap.has(MetadataKey));
          }
          function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn2) return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent)) return OrdinaryGetMetadata(MetadataKey, parent, P);
            return void 0;
          }
          function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap)) return void 0;
            return metadataMap.get(MetadataKey);
          }
          function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, true);
            metadataMap.set(MetadataKey, MetadataValue);
          }
          function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null) return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0) return ownKeys;
            if (ownKeys.length <= 0) return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
              var key = ownKeys_1[_i];
              var hasKey = set.has(key);
              if (!hasKey) {
                set.add(key);
                keys.push(key);
              }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
              var key = parentKeys_1[_a];
              var hasKey = set.has(key);
              if (!hasKey) {
                set.add(key);
                keys.push(key);
              }
            }
            return keys;
          }
          function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap)) return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
              var next = IteratorStep(iterator);
              if (!next) {
                keys.length = k;
                return keys;
              }
              var nextValue = IteratorValue(next);
              try {
                keys[k] = nextValue;
              } catch (e) {
                try {
                  IteratorClose(iterator);
                } finally {
                  throw e;
                }
              }
              k++;
            }
          }
          function Type(x) {
            if (x === null) return 1;
            switch (typeof x) {
              case "undefined":
                return 0;
              case "boolean":
                return 2;
              case "string":
                return 3;
              case "symbol":
                return 4;
              case "number":
                return 5;
              case "object":
                return x === null ? 1 : 6;
              default:
                return 6;
            }
          }
          function IsUndefined(x) {
            return x === void 0;
          }
          function IsNull(x) {
            return x === null;
          }
          function IsSymbol(x) {
            return typeof x === "symbol";
          }
          function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
          }
          function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
              case 0:
                return input;
              case 1:
                return input;
              case 2:
                return input;
              case 3:
                return input;
              case 4:
                return input;
              case 5:
                return input;
            }
            var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== void 0) {
              var result = exoticToPrim.call(input, hint);
              if (IsObject(result)) throw new TypeError();
              return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
          }
          function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
              var toString_1 = O.toString;
              if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result)) return result;
              }
              var valueOf = O.valueOf;
              if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result)) return result;
              }
            } else {
              var valueOf = O.valueOf;
              if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result)) return result;
              }
              var toString_2 = O.toString;
              if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result)) return result;
              }
            }
            throw new TypeError();
          }
          function ToBoolean(argument) {
            return !!argument;
          }
          function ToString(argument) {
            return "" + argument;
          }
          function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3);
            if (IsSymbol(key)) return key;
            return ToString(key);
          }
          function IsArray(argument) {
            return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
          }
          function IsCallable(argument) {
            return typeof argument === "function";
          }
          function IsConstructor(argument) {
            return typeof argument === "function";
          }
          function IsPropertyKey(argument) {
            switch (Type(argument)) {
              case 3:
                return true;
              case 4:
                return true;
              default:
                return false;
            }
          }
          function GetMethod(V, P) {
            var func = V[P];
            if (func === void 0 || func === null) return void 0;
            if (!IsCallable(func)) throw new TypeError();
            return func;
          }
          function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method)) throw new TypeError();
            var iterator = method.call(obj);
            if (!IsObject(iterator)) throw new TypeError();
            return iterator;
          }
          function IteratorValue(iterResult) {
            return iterResult.value;
          }
          function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
          }
          function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f) f.call(iterator);
          }
          function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype) return proto;
            if (proto !== functionPrototype) return proto;
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype) return proto;
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function") return proto;
            if (constructor === O) return proto;
            return constructor;
          }
          function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = (function () {
              function MapIterator2(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
              }
              MapIterator2.prototype["@@iterator"] = function () {
                return this;
              };
              MapIterator2.prototype[iteratorSymbol] = function () {
                return this;
              };
              MapIterator2.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                  var result = this._selector(this._keys[index], this._values[index]);
                  if (index + 1 >= this._keys.length) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                  } else {
                    this._index++;
                  }
                  return {
                    value: result,
                    done: false
                  };
                }
                return {
                  value: void 0,
                  done: true
                };
              };
              MapIterator2.prototype.throw = function (error) {
                if (this._index >= 0) {
                  this._index = -1;
                  this._keys = arraySentinel;
                  this._values = arraySentinel;
                }
                throw error;
              };
              MapIterator2.prototype.return = function (value) {
                if (this._index >= 0) {
                  this._index = -1;
                  this._keys = arraySentinel;
                  this._values = arraySentinel;
                }
                return {
                  value,
                  done: true
                };
              };
              return MapIterator2;
            })();
            return (function () {
              function Map2() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              }
              Object.defineProperty(Map2.prototype, "size", {
                get: function () {
                  return this._keys.length;
                },
                enumerable: true,
                configurable: true
              });
              Map2.prototype.has = function (key) {
                return this._find(key, false) >= 0;
              };
              Map2.prototype.get = function (key) {
                var index = this._find(key, false);
                return index >= 0 ? this._values[index] : void 0;
              };
              Map2.prototype.set = function (key, value) {
                var index = this._find(key, true);
                this._values[index] = value;
                return this;
              };
              Map2.prototype.delete = function (key) {
                var index = this._find(key, false);
                if (index >= 0) {
                  var size = this._keys.length;
                  for (var i = index + 1; i < size; i++) {
                    this._keys[i - 1] = this._keys[i];
                    this._values[i - 1] = this._values[i];
                  }
                  this._keys.length--;
                  this._values.length--;
                  if (key === this._cacheKey) {
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                  }
                  return true;
                }
                return false;
              };
              Map2.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              };
              Map2.prototype.keys = function () {
                return new MapIterator(this._keys, this._values, getKey);
              };
              Map2.prototype.values = function () {
                return new MapIterator(this._keys, this._values, getValue);
              };
              Map2.prototype.entries = function () {
                return new MapIterator(this._keys, this._values, getEntry);
              };
              Map2.prototype["@@iterator"] = function () {
                return this.entries();
              };
              Map2.prototype[iteratorSymbol] = function () {
                return this.entries();
              };
              Map2.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                  this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                  this._cacheIndex = this._keys.length;
                  this._keys.push(key);
                  this._values.push(void 0);
                }
                return this._cacheIndex;
              };
              return Map2;
            })();
            function getKey(key, _) {
              return key;
            }
            function getValue(_, value) {
              return value;
            }
            function getEntry(key, value) {
              return [key, value];
            }
          }
          function CreateSetPolyfill() {
            return (function () {
              function Set2() {
                this._map = new _Map();
              }
              Object.defineProperty(Set2.prototype, "size", {
                get: function () {
                  return this._map.size;
                },
                enumerable: true,
                configurable: true
              });
              Set2.prototype.has = function (value) {
                return this._map.has(value);
              };
              Set2.prototype.add = function (value) {
                return (this._map.set(value, value), this);
              };
              Set2.prototype.delete = function (value) {
                return this._map.delete(value);
              };
              Set2.prototype.clear = function () {
                this._map.clear();
              };
              Set2.prototype.keys = function () {
                return this._map.keys();
              };
              Set2.prototype.values = function () {
                return this._map.values();
              };
              Set2.prototype.entries = function () {
                return this._map.entries();
              };
              Set2.prototype["@@iterator"] = function () {
                return this.keys();
              };
              Set2.prototype[iteratorSymbol] = function () {
                return this.keys();
              };
              return Set2;
            })();
          }
          function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return (function () {
              function WeakMap2() {
                this._key = CreateUniqueKey();
              }
              WeakMap2.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, false);
                return table !== void 0 ? HashMap.has(table, this._key) : false;
              };
              WeakMap2.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, false);
                return table !== void 0 ? HashMap.get(table, this._key) : void 0;
              };
              WeakMap2.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, true);
                table[this._key] = value;
                return this;
              };
              WeakMap2.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, false);
                return table !== void 0 ? delete table[this._key] : false;
              };
              WeakMap2.prototype.clear = function () {
                this._key = CreateUniqueKey();
              };
              return WeakMap2;
            })();
            function CreateUniqueKey() {
              var key;
              do key = "@@WeakMap@@" + CreateUUID(); while (HashMap.has(keys, key));
              keys[key] = true;
              return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
              if (!hasOwn.call(target, rootKey)) {
                if (!create) return void 0;
                Object.defineProperty(target, rootKey, {
                  value: HashMap.create()
                });
              }
              return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
              for (var i = 0; i < size; ++i) buffer[i] = Math.random() * 255 | 0;
              return buffer;
            }
            function GenRandomBytes(size) {
              if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined") return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined") return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
              }
              return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
              var data = GenRandomBytes(UUID_SIZE);
              data[6] = data[6] & 79 | 64;
              data[8] = data[8] & 191 | 128;
              var result = "";
              for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8) result += "-";
                if (byte < 16) result += "0";
                result += byte.toString(16).toLowerCase();
              }
              return result;
            }
          }
          function MakeDictionary(obj) {
            obj.__ = void 0;
            delete obj.__;
            return obj;
          }
        });
      })(Reflect2 || (Reflect2 = {}));
      var Tree = class extends Array {};
      (Tree2 => {
        function treeMap(tree, func) {
          return tree.map(node => node instanceof Array ? treeMap(node, func) : func(node));
        }
        Tree2.treeMap = treeMap;
      })(Tree || (Tree = {}));
      var ParseTree = class extends Tree {};
      (ParseTree2 => {
        function getStringArrayRepr(tree) {
          return Tree.treeMap(tree, token => token.lexeme);
        }
        ParseTree2.getStringArrayRepr = getStringArrayRepr;
      })(ParseTree || (ParseTree = {}));
      var ValueType = (ValueType2 => {
        ValueType2[ValueType2["I32"] = 0] = "I32";
        ValueType2[ValueType2["I64"] = 1] = "I64";
        ValueType2[ValueType2["F32"] = 2] = "F32";
        ValueType2[ValueType2["F64"] = 3] = "F64";
        ValueType2[ValueType2["V128"] = 4] = "V128";
        ValueType2[ValueType2["I8"] = 5] = "I8";
        ValueType2[ValueType2["I16"] = 6] = "I16";
        ValueType2[ValueType2["FuncRef"] = 7] = "FuncRef";
        ValueType2[ValueType2["ExternRef"] = 8] = "ExternRef";
        ValueType2[ValueType2["Reference"] = 9] = "Reference";
        ValueType2[ValueType2["Func"] = 10] = "Func";
        ValueType2[ValueType2["Struct"] = 11] = "Struct";
        ValueType2[ValueType2["Array"] = 12] = "Array";
        ValueType2[ValueType2["Void"] = 13] = "Void";
        ValueType2[ValueType2["___"] = 14] = "___";
        ValueType2[ValueType2["Any"] = 15] = "Any";
        ValueType2[ValueType2["I8U"] = 16] = "I8U";
        ValueType2[ValueType2["I16U"] = 17] = "I16U";
        ValueType2[ValueType2["I32U"] = 18] = "I32U";
        return ValueType2;
      })(ValueType || ({}));
      (ValueType2 => {
        function getValue(t) {
          switch (t) {
            case 0:
              return 127;
            case 1:
              return 126;
            case 2:
              return 125;
            case 3:
              return 124;
            case 4:
              return 123;
            case 5:
              return 122;
            case 6:
              return 121;
            case 7:
              return 112;
            case 8:
              return 111;
            case 9:
              return 107;
            case 10:
              return 96;
            case 11:
              return 95;
            case 12:
              return 94;
            case 13:
              return 64;
            case 14:
              return -64;
            case 15:
              return 0;
            case 16:
              return 4;
            case 17:
              return 6;
            case 18:
              return 7;
          }
          throw new Error("Unexpected Value Type");
        }
        ValueType2.getValue = getValue;
      })(ValueType || (ValueType = {}));
      var AssertError = class extends Error {
        constructor(assertionMessage) {
          super(`Assertion Error: ${assertionMessage}`);
        }
      };
      var assert = (b, assertionMessage) => {
        if (!b) {
          throw new AssertError(assertionMessage != null ? assertionMessage : "");
        }
      };
      var Opcode;
      (Opcode2 => {
        function getReturnType(o) {
          return opcodeData[o][0];
        }
        Opcode2.getReturnType = getReturnType;
        function getParamTypes(o) {
          const params = [opcodeData[o][1], opcodeData[o][2], opcodeData[o][3]].filter(p => p !== 14);
          return params;
        }
        Opcode2.getParamTypes = getParamTypes;
        function getParamLength(o) {
          return getParamTypes(o).length;
        }
        Opcode2.getParamLength = getParamLength;
        function getMemSize(o) {
          return opcodeData[o][4];
        }
        Opcode2.getMemSize = getMemSize;
        function getPrefix(o) {
          return opcodeData[o][5];
        }
        Opcode2.getPrefix = getPrefix;
        function getCode(o) {
          return opcodeData[o][6];
        }
        Opcode2.getCode = getCode;
        function getText(o) {
          return opcodeData[o][7];
        }
        Opcode2.getText = getText;
        function getDecompText(o) {
          return opcodeData[o][8];
        }
        Opcode2.getDecompText = getDecompText;
      })(Opcode || (Opcode = {}));
      var opcodeData = {
        [0]: [14, 14, 14, 14, 0, 0, 0, "unreachable", ""],
        [1]: [14, 14, 14, 14, 0, 0, 1, "nop", ""],
        [2]: [14, 14, 14, 14, 0, 0, 2, "block", ""],
        [3]: [14, 14, 14, 14, 0, 0, 3, "loop", ""],
        [4]: [14, 14, 14, 14, 0, 0, 4, "if", ""],
        [5]: [14, 14, 14, 14, 0, 0, 5, "else", ""],
        [6]: [14, 14, 14, 14, 0, 0, 6, "try", ""],
        [7]: [14, 14, 14, 14, 0, 0, 7, "catch", ""],
        [8]: [14, 14, 14, 14, 0, 0, 8, "throw", ""],
        [9]: [14, 14, 14, 14, 0, 0, 9, "rethrow", ""],
        [10]: [14, 14, 14, 14, 0, 0, 11, "end", ""],
        [11]: [14, 14, 14, 14, 0, 0, 12, "br", ""],
        [12]: [14, 0, 14, 14, 0, 0, 13, "br_if", ""],
        [13]: [14, 0, 14, 14, 0, 0, 14, "br_table", ""],
        [14]: [14, 14, 14, 14, 0, 0, 15, "return", ""],
        [15]: [14, 14, 14, 14, 0, 0, 16, "call", ""],
        [16]: [14, 14, 14, 14, 0, 0, 17, "call_indirect", ""],
        [17]: [14, 14, 14, 14, 0, 0, 18, "return_call", ""],
        [18]: [14, 14, 14, 14, 0, 0, 19, "return_call_indirect", ""],
        [19]: [14, 14, 14, 14, 0, 0, 20, "call_ref", ""],
        [20]: [14, 14, 14, 14, 0, 0, 24, "delegate", ""],
        [21]: [14, 14, 14, 14, 0, 0, 25, "catch_all", ""],
        [22]: [14, 14, 14, 14, 0, 0, 26, "drop", ""],
        [23]: [14, 14, 14, 0, 0, 0, 27, "select", ""],
        [24]: [14, 14, 14, 0, 0, 0, 28, "select", ""],
        [25]: [14, 14, 14, 14, 0, 0, 32, "local.get", ""],
        [26]: [14, 14, 14, 14, 0, 0, 33, "local.set", ""],
        [27]: [14, 14, 14, 14, 0, 0, 34, "local.tee", ""],
        [28]: [14, 14, 14, 14, 0, 0, 35, "global.get", ""],
        [29]: [14, 14, 14, 14, 0, 0, 36, "global.set", ""],
        [30]: [0, 0, 14, 14, 4, 0, 40, "i32.load", ""],
        [31]: [1, 0, 14, 14, 8, 0, 41, "i64.load", ""],
        [32]: [2, 0, 14, 14, 4, 0, 42, "f32.load", ""],
        [33]: [3, 0, 14, 14, 8, 0, 43, "f64.load", ""],
        [34]: [0, 0, 14, 14, 1, 0, 44, "i32.load8_s", ""],
        [35]: [0, 0, 14, 14, 1, 0, 45, "i32.load8_u", ""],
        [36]: [0, 0, 14, 14, 2, 0, 46, "i32.load16_s", ""],
        [37]: [0, 0, 14, 14, 2, 0, 47, "i32.load16_u", ""],
        [38]: [1, 0, 14, 14, 1, 0, 48, "i64.load8_s", ""],
        [39]: [1, 0, 14, 14, 1, 0, 49, "i64.load8_u", ""],
        [40]: [1, 0, 14, 14, 2, 0, 50, "i64.load16_s", ""],
        [41]: [1, 0, 14, 14, 2, 0, 51, "i64.load16_u", ""],
        [42]: [1, 0, 14, 14, 4, 0, 52, "i64.load32_s", ""],
        [43]: [1, 0, 14, 14, 4, 0, 53, "i64.load32_u", ""],
        [44]: [14, 0, 0, 14, 4, 0, 54, "i32.store", ""],
        [45]: [14, 0, 1, 14, 8, 0, 55, "i64.store", ""],
        [46]: [14, 0, 2, 14, 4, 0, 56, "f32.store", ""],
        [47]: [14, 0, 3, 14, 8, 0, 57, "f64.store", ""],
        [48]: [14, 0, 0, 14, 1, 0, 58, "i32.store8", ""],
        [49]: [14, 0, 0, 14, 2, 0, 59, "i32.store16", ""],
        [50]: [14, 0, 1, 14, 1, 0, 60, "i64.store8", ""],
        [51]: [14, 0, 1, 14, 2, 0, 61, "i64.store16", ""],
        [52]: [14, 0, 1, 14, 4, 0, 62, "i64.store32", ""],
        [53]: [0, 14, 14, 14, 0, 0, 63, "memory.size", ""],
        [54]: [0, 0, 14, 14, 0, 0, 64, "memory.grow", ""],
        [55]: [0, 14, 14, 14, 0, 0, 65, "i32.const", ""],
        [56]: [1, 14, 14, 14, 0, 0, 66, "i64.const", ""],
        [57]: [2, 14, 14, 14, 0, 0, 67, "f32.const", ""],
        [58]: [3, 14, 14, 14, 0, 0, 68, "f64.const", ""],
        [59]: [0, 0, 14, 14, 0, 0, 69, "i32.eqz", "eqz"],
        [60]: [0, 0, 0, 14, 0, 0, 70, "i32.eq", "=="],
        [61]: [0, 0, 0, 14, 0, 0, 71, "i32.ne", "!="],
        [62]: [0, 0, 0, 14, 0, 0, 72, "i32.lt_s", "<"],
        [63]: [0, 0, 0, 14, 0, 0, 73, "i32.lt_u", "<"],
        [64]: [0, 0, 0, 14, 0, 0, 74, "i32.gt_s", ">"],
        [65]: [0, 0, 0, 14, 0, 0, 75, "i32.gt_u", ">"],
        [66]: [0, 0, 0, 14, 0, 0, 76, "i32.le_s", "<="],
        [67]: [0, 0, 0, 14, 0, 0, 77, "i32.le_u", "<="],
        [68]: [0, 0, 0, 14, 0, 0, 78, "i32.ge_s", ">="],
        [69]: [0, 0, 0, 14, 0, 0, 79, "i32.ge_u", ">="],
        [70]: [0, 1, 14, 14, 0, 0, 80, "i64.eqz", "eqz"],
        [71]: [0, 1, 1, 14, 0, 0, 81, "i64.eq", "=="],
        [72]: [0, 1, 1, 14, 0, 0, 82, "i64.ne", "!="],
        [73]: [0, 1, 1, 14, 0, 0, 83, "i64.lt_s", "<"],
        [74]: [0, 1, 1, 14, 0, 0, 84, "i64.lt_u", "<"],
        [75]: [0, 1, 1, 14, 0, 0, 85, "i64.gt_s", ">"],
        [76]: [0, 1, 1, 14, 0, 0, 86, "i64.gt_u", ">"],
        [77]: [0, 1, 1, 14, 0, 0, 87, "i64.le_s", "<="],
        [78]: [0, 1, 1, 14, 0, 0, 88, "i64.le_u", "<="],
        [79]: [0, 1, 1, 14, 0, 0, 89, "i64.ge_s", ">="],
        [80]: [0, 1, 1, 14, 0, 0, 90, "i64.ge_u", ">="],
        [81]: [0, 2, 2, 14, 0, 0, 91, "f32.eq", "=="],
        [82]: [0, 2, 2, 14, 0, 0, 92, "f32.ne", "!="],
        [83]: [0, 2, 2, 14, 0, 0, 93, "f32.lt", "<"],
        [84]: [0, 2, 2, 14, 0, 0, 94, "f32.gt", ">"],
        [85]: [0, 2, 2, 14, 0, 0, 95, "f32.le", "<="],
        [86]: [0, 2, 2, 14, 0, 0, 96, "f32.ge", ">="],
        [87]: [0, 3, 3, 14, 0, 0, 97, "f64.eq", "=="],
        [88]: [0, 3, 3, 14, 0, 0, 98, "f64.ne", "!="],
        [89]: [0, 3, 3, 14, 0, 0, 99, "f64.lt", "<"],
        [90]: [0, 3, 3, 14, 0, 0, 100, "f64.gt", ">"],
        [91]: [0, 3, 3, 14, 0, 0, 101, "f64.le", "<="],
        [92]: [0, 3, 3, 14, 0, 0, 102, "f64.ge", ">="],
        [93]: [0, 0, 14, 14, 0, 0, 103, "i32.clz", "clz"],
        [94]: [0, 0, 14, 14, 0, 0, 104, "i32.ctz", "ctz"],
        [95]: [0, 0, 14, 14, 0, 0, 105, "i32.popcnt", "popcnt"],
        [96]: [0, 0, 0, 14, 0, 0, 106, "i32.add", "+"],
        [97]: [0, 0, 0, 14, 0, 0, 107, "i32.sub", "-"],
        [98]: [0, 0, 0, 14, 0, 0, 108, "i32.mul", "*"],
        [99]: [0, 0, 0, 14, 0, 0, 109, "i32.div_s", "/"],
        [100]: [0, 0, 0, 14, 0, 0, 110, "i32.div_u", "/"],
        [101]: [0, 0, 0, 14, 0, 0, 111, "i32.rem_s", "%"],
        [102]: [0, 0, 0, 14, 0, 0, 112, "i32.rem_u", "%"],
        [103]: [0, 0, 0, 14, 0, 0, 113, "i32.and", "&"],
        [104]: [0, 0, 0, 14, 0, 0, 114, "i32.or", "|"],
        [105]: [0, 0, 0, 14, 0, 0, 115, "i32.xor", "^"],
        [106]: [0, 0, 0, 14, 0, 0, 116, "i32.shl", "<<"],
        [107]: [0, 0, 0, 14, 0, 0, 117, "i32.shr_s", ">>"],
        [108]: [0, 0, 0, 14, 0, 0, 118, "i32.shr_u", ">>"],
        [109]: [0, 0, 0, 14, 0, 0, 119, "i32.rotl", "<<"],
        [110]: [0, 0, 0, 14, 0, 0, 120, "i32.rotr", ">>"],
        [111]: [1, 1, 14, 14, 0, 0, 121, "i64.clz", "clz"],
        [112]: [1, 1, 14, 14, 0, 0, 122, "i64.ctz", "ctz"],
        [113]: [1, 1, 14, 14, 0, 0, 123, "i64.popcnt", "popcnt"],
        [114]: [1, 1, 1, 14, 0, 0, 124, "i64.add", "+"],
        [115]: [1, 1, 1, 14, 0, 0, 125, "i64.sub", "-"],
        [116]: [1, 1, 1, 14, 0, 0, 126, "i64.mul", "*"],
        [117]: [1, 1, 1, 14, 0, 0, 127, "i64.div_s", "/"],
        [118]: [1, 1, 1, 14, 0, 0, 128, "i64.div_u", "/"],
        [119]: [1, 1, 1, 14, 0, 0, 129, "i64.rem_s", "%"],
        [120]: [1, 1, 1, 14, 0, 0, 130, "i64.rem_u", "%"],
        [121]: [1, 1, 1, 14, 0, 0, 131, "i64.and", "&"],
        [122]: [1, 1, 1, 14, 0, 0, 132, "i64.or", "|"],
        [123]: [1, 1, 1, 14, 0, 0, 133, "i64.xor", "^"],
        [124]: [1, 1, 1, 14, 0, 0, 134, "i64.shl", "<<"],
        [125]: [1, 1, 1, 14, 0, 0, 135, "i64.shr_s", ">>"],
        [126]: [1, 1, 1, 14, 0, 0, 136, "i64.shr_u", ">>"],
        [127]: [1, 1, 1, 14, 0, 0, 137, "i64.rotl", "<<"],
        [128]: [1, 1, 1, 14, 0, 0, 138, "i64.rotr", ">>"],
        [129]: [2, 2, 2, 14, 0, 0, 139, "f32.abs", "abs"],
        [130]: [2, 2, 2, 14, 0, 0, 140, "f32.neg", "-"],
        [131]: [2, 2, 2, 14, 0, 0, 141, "f32.ceil", "ceil"],
        [132]: [2, 2, 2, 14, 0, 0, 142, "f32.floor", "floor"],
        [133]: [2, 2, 2, 14, 0, 0, 143, "f32.trunc", "trunc"],
        [134]: [2, 2, 2, 14, 0, 0, 144, "f32.nearest", "nearest"],
        [135]: [2, 2, 2, 14, 0, 0, 145, "f32.sqrt", "sqrt"],
        [136]: [2, 2, 2, 14, 0, 0, 146, "f32.add", "+"],
        [137]: [2, 2, 2, 14, 0, 0, 147, "f32.sub", "-"],
        [138]: [2, 2, 2, 14, 0, 0, 148, "f32.mul", "*"],
        [139]: [2, 2, 2, 14, 0, 0, 149, "f32.div", "/"],
        [140]: [2, 2, 2, 14, 0, 0, 150, "f32.min", "min"],
        [141]: [2, 2, 2, 14, 0, 0, 151, "f32.max", "max"],
        [142]: [2, 2, 2, 14, 0, 0, 152, "f32.copysign", "copysign"],
        [143]: [3, 3, 3, 14, 0, 0, 153, "f64.abs", "abs"],
        [144]: [3, 3, 3, 14, 0, 0, 154, "f64.neg", "-"],
        [145]: [3, 3, 3, 14, 0, 0, 155, "f64.ceil", "ceil"],
        [146]: [3, 3, 3, 14, 0, 0, 156, "f64.floor", "floor"],
        [147]: [3, 3, 3, 14, 0, 0, 157, "f64.trunc", "trunc"],
        [148]: [3, 3, 3, 14, 0, 0, 158, "f64.nearest", "nearest"],
        [149]: [3, 3, 3, 14, 0, 0, 159, "f64.sqrt", "sqrt"],
        [150]: [3, 3, 3, 14, 0, 0, 160, "f64.add", "+"],
        [151]: [3, 3, 3, 14, 0, 0, 161, "f64.sub", "-"],
        [152]: [3, 3, 3, 14, 0, 0, 162, "f64.mul", "*"],
        [153]: [3, 3, 3, 14, 0, 0, 163, "f64.div", "/"],
        [154]: [3, 3, 3, 14, 0, 0, 164, "f64.min", "min"],
        [155]: [3, 3, 3, 14, 0, 0, 165, "f64.max", "max"],
        [156]: [3, 3, 3, 14, 0, 0, 166, "f64.copysign", "copysign"],
        [157]: [0, 1, 14, 14, 0, 0, 167, "i32.wrap_i64", ""],
        [158]: [0, 2, 14, 14, 0, 0, 168, "i32.trunc_f32_s", ""],
        [159]: [0, 2, 14, 14, 0, 0, 169, "i32.trunc_f32_u", ""],
        [160]: [0, 3, 14, 14, 0, 0, 170, "i32.trunc_f64_s", ""],
        [161]: [0, 3, 14, 14, 0, 0, 171, "i32.trunc_f64_u", ""],
        [162]: [1, 0, 14, 14, 0, 0, 172, "i64.extend_i32_s", ""],
        [163]: [1, 0, 14, 14, 0, 0, 173, "i64.extend_i32_u", ""],
        [164]: [1, 2, 14, 14, 0, 0, 174, "i64.trunc_f32_s", ""],
        [165]: [1, 2, 14, 14, 0, 0, 175, "i64.trunc_f32_u", ""],
        [166]: [1, 3, 14, 14, 0, 0, 176, "i64.trunc_f64_s", ""],
        [167]: [1, 3, 14, 14, 0, 0, 177, "i64.trunc_f64_u", ""],
        [168]: [2, 0, 14, 14, 0, 0, 178, "f32.convert_i32_s", ""],
        [169]: [2, 0, 14, 14, 0, 0, 179, "f32.convert_i32_u", ""],
        [170]: [2, 1, 14, 14, 0, 0, 180, "f32.convert_i64_s", ""],
        [171]: [2, 1, 14, 14, 0, 0, 181, "f32.convert_i64_u", ""],
        [172]: [2, 3, 14, 14, 0, 0, 182, "f32.demote_f64", ""],
        [173]: [3, 0, 14, 14, 0, 0, 183, "f64.convert_i32_s", ""],
        [174]: [3, 0, 14, 14, 0, 0, 184, "f64.convert_i32_u", ""],
        [175]: [3, 1, 14, 14, 0, 0, 185, "f64.convert_i64_s", ""],
        [176]: [3, 1, 14, 14, 0, 0, 186, "f64.convert_i64_u", ""],
        [177]: [3, 2, 14, 14, 0, 0, 187, "f64.promote_f32", ""],
        [178]: [0, 2, 14, 14, 0, 0, 188, "i32.reinterpret_f32", ""],
        [179]: [1, 3, 14, 14, 0, 0, 189, "i64.reinterpret_f64", ""],
        [180]: [2, 0, 14, 14, 0, 0, 190, "f32.reinterpret_i32", ""],
        [181]: [3, 1, 14, 14, 0, 0, 191, "f64.reinterpret_i64", ""],
        [182]: [0, 0, 14, 14, 0, 0, 192, "i32.extend8_s", ""],
        [183]: [0, 0, 14, 14, 0, 0, 193, "i32.extend16_s", ""],
        [184]: [1, 1, 14, 14, 0, 0, 194, "i64.extend8_s", ""],
        [185]: [1, 1, 14, 14, 0, 0, 195, "i64.extend16_s", ""],
        [186]: [1, 1, 14, 14, 0, 0, 196, "i64.extend32_s", ""],
        [187]: [14, 14, 14, 14, 0, 0, 224, "alloca", ""],
        [188]: [14, 0, 14, 14, 0, 0, 225, "br_unless", ""],
        [189]: [14, 14, 14, 14, 0, 0, 226, "call_import", ""],
        [190]: [14, 14, 14, 14, 0, 0, 227, "data", ""],
        [191]: [14, 14, 14, 14, 0, 0, 228, "drop_keep", ""],
        [192]: [14, 14, 14, 14, 0, 0, 229, "catch_drop", ""],
        [193]: [14, 14, 14, 14, 0, 0, 230, "adjust_frame_for_return_call", ""],
        [194]: [0, 2, 14, 14, 0, 252, 0, "i32.trunc_sat_f32_s", ""],
        [195]: [0, 2, 14, 14, 0, 252, 1, "i32.trunc_sat_f32_u", ""],
        [196]: [0, 3, 14, 14, 0, 252, 2, "i32.trunc_sat_f64_s", ""],
        [197]: [0, 3, 14, 14, 0, 252, 3, "i32.trunc_sat_f64_u", ""],
        [198]: [1, 2, 14, 14, 0, 252, 4, "i64.trunc_sat_f32_s", ""],
        [199]: [1, 2, 14, 14, 0, 252, 5, "i64.trunc_sat_f32_u", ""],
        [200]: [1, 3, 14, 14, 0, 252, 6, "i64.trunc_sat_f64_s", ""],
        [201]: [1, 3, 14, 14, 0, 252, 7, "i64.trunc_sat_f64_u", ""],
        [202]: [14, 0, 0, 0, 0, 252, 8, "memory.init", ""],
        [203]: [14, 14, 14, 14, 0, 252, 9, "data.drop", ""],
        [204]: [14, 0, 0, 0, 0, 252, 10, "memory.copy", ""],
        [205]: [14, 0, 0, 0, 0, 252, 11, "memory.fill", ""],
        [206]: [14, 0, 0, 0, 0, 252, 12, "table.init", ""],
        [207]: [14, 14, 14, 14, 0, 252, 13, "elem.drop", ""],
        [208]: [14, 0, 0, 0, 0, 252, 14, "table.copy", ""],
        [209]: [14, 0, 14, 14, 0, 0, 37, "table.get", ""],
        [210]: [14, 0, 14, 14, 0, 0, 38, "table.set", ""],
        [211]: [14, 14, 0, 14, 0, 252, 15, "table.grow", ""],
        [212]: [14, 14, 14, 14, 0, 252, 16, "table.size", ""],
        [213]: [14, 0, 14, 0, 0, 252, 17, "table.fill", ""],
        [214]: [14, 14, 14, 14, 0, 0, 208, "ref.null", ""],
        [215]: [14, 14, 14, 14, 0, 0, 209, "ref.is_null", ""],
        [216]: [14, 14, 14, 14, 0, 0, 210, "ref.func", ""],
        [217]: [4, 0, 14, 14, 16, 253, 0, "v128.load", ""],
        [218]: [4, 0, 14, 14, 8, 253, 1, "v128.load8x8_s", ""],
        [219]: [4, 0, 14, 14, 8, 253, 2, "v128.load8x8_u", ""],
        [220]: [4, 0, 14, 14, 8, 253, 3, "v128.load16x4_s", ""],
        [221]: [4, 0, 14, 14, 8, 253, 4, "v128.load16x4_u", ""],
        [222]: [4, 0, 14, 14, 8, 253, 5, "v128.load32x2_s", ""],
        [223]: [4, 0, 14, 14, 8, 253, 6, "v128.load32x2_u", ""],
        [224]: [4, 0, 14, 14, 1, 253, 7, "v128.load8_splat", ""],
        [225]: [4, 0, 14, 14, 2, 253, 8, "v128.load16_splat", ""],
        [226]: [4, 0, 14, 14, 4, 253, 9, "v128.load32_splat", ""],
        [227]: [4, 0, 14, 14, 8, 253, 10, "v128.load64_splat", ""],
        [228]: [14, 0, 4, 14, 16, 253, 11, "v128.store", ""],
        [229]: [4, 14, 14, 14, 0, 253, 12, "v128.const", ""],
        [230]: [4, 4, 4, 14, 0, 253, 13, "i8x16.shuffle", ""],
        [231]: [4, 4, 4, 14, 0, 253, 14, "i8x16.swizzle", ""],
        [232]: [4, 0, 14, 14, 0, 253, 15, "i8x16.splat", ""],
        [233]: [4, 0, 14, 14, 0, 253, 16, "i16x8.splat", ""],
        [234]: [4, 0, 14, 14, 0, 253, 17, "i32x4.splat", ""],
        [235]: [4, 1, 14, 14, 0, 253, 18, "i64x2.splat", ""],
        [236]: [4, 2, 14, 14, 0, 253, 19, "f32x4.splat", ""],
        [237]: [4, 3, 14, 14, 0, 253, 20, "f64x2.splat", ""],
        [238]: [0, 4, 14, 14, 0, 253, 21, "i8x16.extract_lane_s", ""],
        [239]: [0, 4, 14, 14, 0, 253, 22, "i8x16.extract_lane_u", ""],
        [240]: [4, 4, 0, 14, 0, 253, 23, "i8x16.replace_lane", ""],
        [241]: [0, 4, 14, 14, 0, 253, 24, "i16x8.extract_lane_s", ""],
        [242]: [0, 4, 14, 14, 0, 253, 25, "i16x8.extract_lane_u", ""],
        [243]: [4, 4, 0, 14, 0, 253, 26, "i16x8.replace_lane", ""],
        [244]: [0, 4, 14, 14, 0, 253, 27, "i32x4.extract_lane", ""],
        [245]: [4, 4, 0, 14, 0, 253, 28, "i32x4.replace_lane", ""],
        [246]: [1, 4, 14, 14, 0, 253, 29, "i64x2.extract_lane", ""],
        [247]: [4, 4, 1, 14, 0, 253, 30, "i64x2.replace_lane", ""],
        [248]: [2, 4, 14, 14, 0, 253, 31, "f32x4.extract_lane", ""],
        [249]: [4, 4, 2, 14, 0, 253, 32, "f32x4.replace_lane", ""],
        [250]: [3, 4, 14, 14, 0, 253, 33, "f64x2.extract_lane", ""],
        [251]: [4, 4, 3, 14, 0, 253, 34, "f64x2.replace_lane", ""],
        [252]: [4, 4, 4, 14, 0, 253, 35, "i8x16.eq", ""],
        [253]: [4, 4, 4, 14, 0, 253, 36, "i8x16.ne", ""],
        [254]: [4, 4, 4, 14, 0, 253, 37, "i8x16.lt_s", ""],
        [255]: [4, 4, 4, 14, 0, 253, 38, "i8x16.lt_u", ""],
        [256]: [4, 4, 4, 14, 0, 253, 39, "i8x16.gt_s", ""],
        [257]: [4, 4, 4, 14, 0, 253, 40, "i8x16.gt_u", ""],
        [258]: [4, 4, 4, 14, 0, 253, 41, "i8x16.le_s", ""],
        [259]: [4, 4, 4, 14, 0, 253, 42, "i8x16.le_u", ""],
        [260]: [4, 4, 4, 14, 0, 253, 43, "i8x16.ge_s", ""],
        [261]: [4, 4, 4, 14, 0, 253, 44, "i8x16.ge_u", ""],
        [262]: [4, 4, 4, 14, 0, 253, 45, "i16x8.eq", ""],
        [263]: [4, 4, 4, 14, 0, 253, 46, "i16x8.ne", ""],
        [264]: [4, 4, 4, 14, 0, 253, 47, "i16x8.lt_s", ""],
        [265]: [4, 4, 4, 14, 0, 253, 48, "i16x8.lt_u", ""],
        [266]: [4, 4, 4, 14, 0, 253, 49, "i16x8.gt_s", ""],
        [267]: [4, 4, 4, 14, 0, 253, 50, "i16x8.gt_u", ""],
        [268]: [4, 4, 4, 14, 0, 253, 51, "i16x8.le_s", ""],
        [269]: [4, 4, 4, 14, 0, 253, 52, "i16x8.le_u", ""],
        [270]: [4, 4, 4, 14, 0, 253, 53, "i16x8.ge_s", ""],
        [271]: [4, 4, 4, 14, 0, 253, 54, "i16x8.ge_u", ""],
        [272]: [4, 4, 4, 14, 0, 253, 55, "i32x4.eq", ""],
        [273]: [4, 4, 4, 14, 0, 253, 56, "i32x4.ne", ""],
        [274]: [4, 4, 4, 14, 0, 253, 57, "i32x4.lt_s", ""],
        [275]: [4, 4, 4, 14, 0, 253, 58, "i32x4.lt_u", ""],
        [276]: [4, 4, 4, 14, 0, 253, 59, "i32x4.gt_s", ""],
        [277]: [4, 4, 4, 14, 0, 253, 60, "i32x4.gt_u", ""],
        [278]: [4, 4, 4, 14, 0, 253, 61, "i32x4.le_s", ""],
        [279]: [4, 4, 4, 14, 0, 253, 62, "i32x4.le_u", ""],
        [280]: [4, 4, 4, 14, 0, 253, 63, "i32x4.ge_s", ""],
        [281]: [4, 4, 4, 14, 0, 253, 64, "i32x4.ge_u", ""],
        [282]: [4, 4, 4, 14, 0, 253, 65, "f32x4.eq", ""],
        [283]: [4, 4, 4, 14, 0, 253, 66, "f32x4.ne", ""],
        [284]: [4, 4, 4, 14, 0, 253, 67, "f32x4.lt", ""],
        [285]: [4, 4, 4, 14, 0, 253, 68, "f32x4.gt", ""],
        [286]: [4, 4, 4, 14, 0, 253, 69, "f32x4.le", ""],
        [287]: [4, 4, 4, 14, 0, 253, 70, "f32x4.ge", ""],
        [288]: [4, 4, 4, 14, 0, 253, 71, "f64x2.eq", ""],
        [289]: [4, 4, 4, 14, 0, 253, 72, "f64x2.ne", ""],
        [290]: [4, 4, 4, 14, 0, 253, 73, "f64x2.lt", ""],
        [291]: [4, 4, 4, 14, 0, 253, 74, "f64x2.gt", ""],
        [292]: [4, 4, 4, 14, 0, 253, 75, "f64x2.le", ""],
        [293]: [4, 4, 4, 14, 0, 253, 76, "f64x2.ge", ""],
        [294]: [4, 4, 14, 14, 0, 253, 77, "v128.not", ""],
        [295]: [4, 4, 4, 14, 0, 253, 78, "v128.and", ""],
        [296]: [4, 4, 4, 14, 0, 253, 79, "v128.andnot", ""],
        [297]: [4, 4, 4, 14, 0, 253, 80, "v128.or", ""],
        [298]: [4, 4, 4, 14, 0, 253, 81, "v128.xor", ""],
        [299]: [4, 4, 4, 4, 0, 253, 82, "v128.bitselect", ""],
        [300]: [0, 4, 14, 14, 0, 253, 83, "v128.any_true", ""],
        [301]: [4, 0, 4, 14, 1, 253, 84, "v128.load8_lane", ""],
        [302]: [4, 0, 4, 14, 2, 253, 85, "v128.load16_lane", ""],
        [303]: [4, 0, 4, 14, 4, 253, 86, "v128.load32_lane", ""],
        [304]: [4, 0, 4, 14, 8, 253, 87, "v128.load64_lane", ""],
        [305]: [14, 0, 4, 14, 1, 253, 88, "v128.store8_lane", ""],
        [306]: [14, 0, 4, 14, 2, 253, 89, "v128.store16_lane", ""],
        [307]: [14, 0, 4, 14, 4, 253, 90, "v128.store32_lane", ""],
        [308]: [14, 0, 4, 14, 8, 253, 91, "v128.store64_lane", ""],
        [309]: [4, 0, 14, 14, 4, 253, 92, "v128.load32_zero", ""],
        [310]: [4, 0, 14, 14, 8, 253, 93, "v128.load64_zero", ""],
        [311]: [4, 4, 14, 14, 0, 253, 94, "f32x4.demote_f64x2_zero", ""],
        [312]: [4, 4, 14, 14, 0, 253, 95, "f64x2.promote_low_f32x4", ""],
        [313]: [4, 4, 14, 14, 0, 253, 96, "i8x16.abs", ""],
        [314]: [4, 4, 14, 14, 0, 253, 97, "i8x16.neg", ""],
        [315]: [4, 4, 14, 14, 0, 253, 98, "i8x16.popcnt", ""],
        [316]: [0, 4, 14, 14, 0, 253, 99, "i8x16.all_true", ""],
        [317]: [0, 4, 14, 14, 0, 253, 100, "i8x16.bitmask", ""],
        [318]: [4, 4, 4, 14, 0, 253, 101, "i8x16.narrow_i16x8_s", ""],
        [319]: [4, 4, 4, 14, 0, 253, 102, "i8x16.narrow_i16x8_u", ""],
        [320]: [4, 4, 0, 14, 0, 253, 107, "i8x16.shl", ""],
        [321]: [4, 4, 0, 14, 0, 253, 108, "i8x16.shr_s", ""],
        [322]: [4, 4, 0, 14, 0, 253, 109, "i8x16.shr_u", ""],
        [323]: [4, 4, 4, 14, 0, 253, 110, "i8x16.add", ""],
        [324]: [4, 4, 4, 14, 0, 253, 111, "i8x16.add_sat_s", ""],
        [325]: [4, 4, 4, 14, 0, 253, 112, "i8x16.add_sat_u", ""],
        [326]: [4, 4, 4, 14, 0, 253, 113, "i8x16.sub", ""],
        [327]: [4, 4, 4, 14, 0, 253, 114, "i8x16.sub_sat_s", ""],
        [328]: [4, 4, 4, 14, 0, 253, 115, "i8x16.sub_sat_u", ""],
        [329]: [4, 4, 4, 14, 0, 253, 118, "i8x16.min_s", ""],
        [330]: [4, 4, 4, 14, 0, 253, 119, "i8x16.min_u", ""],
        [331]: [4, 4, 4, 14, 0, 253, 120, "i8x16.max_s", ""],
        [332]: [4, 4, 4, 14, 0, 253, 121, "i8x16.max_u", ""],
        [333]: [4, 4, 4, 14, 0, 253, 123, "i8x16.avgr_u", ""],
        [334]: [4, 4, 14, 14, 0, 253, 124, "i16x8.extadd_pairwise_i8x16_s", ""],
        [335]: [4, 4, 14, 14, 0, 253, 125, "i16x8.extadd_pairwise_i8x16_u", ""],
        [336]: [4, 4, 14, 14, 0, 253, 126, "i32x4.extadd_pairwise_i16x8_s", ""],
        [337]: [4, 4, 14, 14, 0, 253, 127, "i32x4.extadd_pairwise_i16x8_u", ""],
        [338]: [4, 4, 14, 14, 0, 253, 128, "i16x8.abs", ""],
        [339]: [4, 4, 14, 14, 0, 253, 129, "i16x8.neg", ""],
        [340]: [4, 4, 4, 14, 0, 253, 130, "i16x8.q15mulr_sat_s", ""],
        [341]: [0, 4, 14, 14, 0, 253, 131, "i16x8.all_true", ""],
        [342]: [0, 4, 14, 14, 0, 253, 132, "i16x8.bitmask", ""],
        [343]: [4, 4, 4, 14, 0, 253, 133, "i16x8.narrow_i32x4_s", ""],
        [344]: [4, 4, 4, 14, 0, 253, 134, "i16x8.narrow_i32x4_u", ""],
        [345]: [4, 4, 14, 14, 0, 253, 135, "i16x8.extend_low_i8x16_s", ""],
        [346]: [4, 4, 14, 14, 0, 253, 136, "i16x8.extend_high_i8x16_s", ""],
        [347]: [4, 4, 14, 14, 0, 253, 137, "i16x8.extend_low_i8x16_u", ""],
        [348]: [4, 4, 14, 14, 0, 253, 138, "i16x8.extend_high_i8x16_u", ""],
        [349]: [4, 4, 0, 14, 0, 253, 139, "i16x8.shl", ""],
        [350]: [4, 4, 0, 14, 0, 253, 140, "i16x8.shr_s", ""],
        [351]: [4, 4, 0, 14, 0, 253, 141, "i16x8.shr_u", ""],
        [352]: [4, 4, 4, 14, 0, 253, 142, "i16x8.add", ""],
        [353]: [4, 4, 4, 14, 0, 253, 143, "i16x8.add_sat_s", ""],
        [354]: [4, 4, 4, 14, 0, 253, 144, "i16x8.add_sat_u", ""],
        [355]: [4, 4, 4, 14, 0, 253, 145, "i16x8.sub", ""],
        [356]: [4, 4, 4, 14, 0, 253, 146, "i16x8.sub_sat_s", ""],
        [357]: [4, 4, 4, 14, 0, 253, 147, "i16x8.sub_sat_u", ""],
        [358]: [4, 4, 4, 14, 0, 253, 149, "i16x8.mul", ""],
        [359]: [4, 4, 4, 14, 0, 253, 150, "i16x8.min_s", ""],
        [360]: [4, 4, 4, 14, 0, 253, 151, "i16x8.min_u", ""],
        [361]: [4, 4, 4, 14, 0, 253, 152, "i16x8.max_s", ""],
        [362]: [4, 4, 4, 14, 0, 253, 153, "i16x8.max_u", ""],
        [363]: [4, 4, 4, 14, 0, 253, 155, "i16x8.avgr_u", ""],
        [364]: [4, 4, 4, 14, 0, 253, 156, "i16x8.extmul_low_i8x16_s", ""],
        [365]: [4, 4, 4, 14, 0, 253, 157, "i16x8.extmul_high_i8x16_s", ""],
        [366]: [4, 4, 4, 14, 0, 253, 158, "i16x8.extmul_low_i8x16_u", ""],
        [367]: [4, 4, 4, 14, 0, 253, 159, "i16x8.extmul_high_i8x16_u", ""],
        [368]: [4, 4, 14, 14, 0, 253, 160, "i32x4.abs", ""],
        [369]: [4, 4, 14, 14, 0, 253, 161, "i32x4.neg", ""],
        [370]: [0, 4, 14, 14, 0, 253, 163, "i32x4.all_true", ""],
        [371]: [0, 4, 14, 14, 0, 253, 164, "i32x4.bitmask", ""],
        [372]: [4, 4, 14, 14, 0, 253, 167, "i32x4.extend_low_i16x8_s", ""],
        [373]: [4, 4, 14, 14, 0, 253, 168, "i32x4.extend_high_i16x8_s", ""],
        [374]: [4, 4, 14, 14, 0, 253, 169, "i32x4.extend_low_i16x8_u", ""],
        [375]: [4, 4, 14, 14, 0, 253, 170, "i32x4.extend_high_i16x8_u", ""],
        [376]: [4, 4, 0, 14, 0, 253, 171, "i32x4.shl", ""],
        [377]: [4, 4, 0, 14, 0, 253, 172, "i32x4.shr_s", ""],
        [378]: [4, 4, 0, 14, 0, 253, 173, "i32x4.shr_u", ""],
        [379]: [4, 4, 4, 14, 0, 253, 174, "i32x4.add", ""],
        [380]: [4, 4, 4, 14, 0, 253, 177, "i32x4.sub", ""],
        [381]: [4, 4, 4, 14, 0, 253, 181, "i32x4.mul", ""],
        [382]: [4, 4, 4, 14, 0, 253, 182, "i32x4.min_s", ""],
        [383]: [4, 4, 4, 14, 0, 253, 183, "i32x4.min_u", ""],
        [384]: [4, 4, 4, 14, 0, 253, 184, "i32x4.max_s", ""],
        [385]: [4, 4, 4, 14, 0, 253, 185, "i32x4.max_u", ""],
        [386]: [4, 4, 4, 14, 0, 253, 186, "i32x4.dot_i16x8_s", ""],
        [387]: [4, 4, 4, 14, 0, 253, 188, "i32x4.extmul_low_i16x8_s", ""],
        [388]: [4, 4, 4, 14, 0, 253, 189, "i32x4.extmul_high_i16x8_s", ""],
        [389]: [4, 4, 4, 14, 0, 253, 190, "i32x4.extmul_low_i16x8_u", ""],
        [390]: [4, 4, 4, 14, 0, 253, 191, "i32x4.extmul_high_i16x8_u", ""],
        [391]: [4, 4, 14, 14, 0, 253, 192, "i64x2.abs", ""],
        [392]: [4, 4, 14, 14, 0, 253, 193, "i64x2.neg", ""],
        [393]: [0, 4, 14, 14, 0, 253, 195, "i64x2.all_true", ""],
        [394]: [0, 4, 14, 14, 0, 253, 196, "i64x2.bitmask", ""],
        [395]: [4, 4, 14, 14, 0, 253, 199, "i64x2.extend_low_i32x4_s", ""],
        [396]: [4, 4, 14, 14, 0, 253, 200, "i64x2.extend_high_i32x4_s", ""],
        [397]: [4, 4, 14, 14, 0, 253, 201, "i64x2.extend_low_i32x4_u", ""],
        [398]: [4, 4, 14, 14, 0, 253, 202, "i64x2.extend_high_i32x4_u", ""],
        [399]: [4, 4, 0, 14, 0, 253, 203, "i64x2.shl", ""],
        [400]: [4, 4, 0, 14, 0, 253, 204, "i64x2.shr_s", ""],
        [401]: [4, 4, 0, 14, 0, 253, 205, "i64x2.shr_u", ""],
        [402]: [4, 4, 4, 14, 0, 253, 206, "i64x2.add", ""],
        [403]: [4, 4, 4, 14, 0, 253, 209, "i64x2.sub", ""],
        [404]: [4, 4, 4, 14, 0, 253, 213, "i64x2.mul", ""],
        [405]: [4, 4, 4, 14, 0, 253, 214, "i64x2.eq", ""],
        [406]: [4, 4, 4, 14, 0, 253, 215, "i64x2.ne", ""],
        [407]: [4, 4, 4, 14, 0, 253, 216, "i64x2.lt_s", ""],
        [408]: [4, 4, 4, 14, 0, 253, 217, "i64x2.gt_s", ""],
        [409]: [4, 4, 4, 14, 0, 253, 218, "i64x2.le_s", ""],
        [410]: [4, 4, 4, 14, 0, 253, 219, "i64x2.ge_s", ""],
        [411]: [4, 4, 4, 14, 0, 253, 220, "i64x2.extmul_low_i32x4_s", ""],
        [412]: [4, 4, 4, 14, 0, 253, 221, "i64x2.extmul_high_i32x4_s", ""],
        [413]: [4, 4, 4, 14, 0, 253, 222, "i64x2.extmul_low_i32x4_u", ""],
        [414]: [4, 4, 4, 14, 0, 253, 223, "i64x2.extmul_high_i32x4_u", ""],
        [415]: [4, 4, 14, 14, 0, 253, 103, "f32x4.ceil", ""],
        [416]: [4, 4, 14, 14, 0, 253, 104, "f32x4.floor", ""],
        [417]: [4, 4, 14, 14, 0, 253, 105, "f32x4.trunc", ""],
        [418]: [4, 4, 14, 14, 0, 253, 106, "f32x4.nearest", ""],
        [419]: [4, 4, 14, 14, 0, 253, 116, "f64x2.ceil", ""],
        [420]: [4, 4, 14, 14, 0, 253, 117, "f64x2.floor", ""],
        [421]: [4, 4, 14, 14, 0, 253, 122, "f64x2.trunc", ""],
        [422]: [4, 4, 14, 14, 0, 253, 148, "f64x2.nearest", ""],
        [423]: [4, 4, 14, 14, 0, 253, 224, "f32x4.abs", ""],
        [424]: [4, 4, 14, 14, 0, 253, 225, "f32x4.neg", ""],
        [425]: [4, 4, 14, 14, 0, 253, 227, "f32x4.sqrt", ""],
        [426]: [4, 4, 4, 14, 0, 253, 228, "f32x4.add", ""],
        [427]: [4, 4, 4, 14, 0, 253, 229, "f32x4.sub", ""],
        [428]: [4, 4, 4, 14, 0, 253, 230, "f32x4.mul", ""],
        [429]: [4, 4, 4, 14, 0, 253, 231, "f32x4.div", ""],
        [430]: [4, 4, 4, 14, 0, 253, 232, "f32x4.min", ""],
        [431]: [4, 4, 4, 14, 0, 253, 233, "f32x4.max", ""],
        [432]: [4, 4, 4, 14, 0, 253, 234, "f32x4.pmin", ""],
        [433]: [4, 4, 4, 14, 0, 253, 235, "f32x4.pmax", ""],
        [434]: [4, 4, 14, 14, 0, 253, 236, "f64x2.abs", ""],
        [435]: [4, 4, 14, 14, 0, 253, 237, "f64x2.neg", ""],
        [436]: [4, 4, 14, 14, 0, 253, 239, "f64x2.sqrt", ""],
        [437]: [4, 4, 4, 14, 0, 253, 240, "f64x2.add", ""],
        [438]: [4, 4, 4, 14, 0, 253, 241, "f64x2.sub", ""],
        [439]: [4, 4, 4, 14, 0, 253, 242, "f64x2.mul", ""],
        [440]: [4, 4, 4, 14, 0, 253, 243, "f64x2.div", ""],
        [441]: [4, 4, 4, 14, 0, 253, 244, "f64x2.min", ""],
        [442]: [4, 4, 4, 14, 0, 253, 245, "f64x2.max", ""],
        [443]: [4, 4, 4, 14, 0, 253, 246, "f64x2.pmin", ""],
        [444]: [4, 4, 4, 14, 0, 253, 247, "f64x2.pmax", ""],
        [445]: [4, 4, 14, 14, 0, 253, 248, "i32x4.trunc_sat_f32x4_s", ""],
        [446]: [4, 4, 14, 14, 0, 253, 249, "i32x4.trunc_sat_f32x4_u", ""],
        [447]: [4, 4, 14, 14, 0, 253, 250, "f32x4.convert_i32x4_s", ""],
        [448]: [4, 4, 14, 14, 0, 253, 251, "f32x4.convert_i32x4_u", ""],
        [449]: [4, 4, 14, 14, 0, 253, 252, "i32x4.trunc_sat_f64x2_s_zero", ""],
        [450]: [4, 4, 14, 14, 0, 253, 253, "i32x4.trunc_sat_f64x2_u_zero", ""],
        [451]: [4, 4, 14, 14, 0, 253, 254, "f64x2.convert_low_i32x4_s", ""],
        [452]: [4, 4, 14, 14, 0, 253, 255, "f64x2.convert_low_i32x4_u", ""],
        [453]: [4, 4, 4, 14, 0, 253, 256, "i8x16.relaxed_swizzle", ""],
        [454]: [4, 4, 14, 14, 0, 253, 257, "i32x4.relaxed_trunc_f32x4_s", ""],
        [455]: [4, 4, 14, 14, 0, 253, 258, "i32x4.relaxed_trunc_f32x4_u", ""],
        [456]: [4, 4, 14, 14, 0, 253, 259, "i32x4.relaxed_trunc_f64x2_s_zero", ""],
        [457]: [4, 4, 14, 14, 0, 253, 260, "i32x4.relaxed_trunc_f64x2_u_zero", ""],
        [458]: [4, 4, 4, 4, 0, 253, 261, "f32x4.relaxed_madd", ""],
        [459]: [4, 4, 4, 4, 0, 253, 262, "f32x4.relaxed_nmadd", ""],
        [460]: [4, 4, 4, 4, 0, 253, 263, "f64x2.relaxed_madd", ""],
        [461]: [4, 4, 4, 4, 0, 253, 264, "f64x2.relaxed_nmadd", ""],
        [462]: [4, 4, 4, 4, 0, 253, 265, "i8x16.relaxed_laneselect", ""],
        [463]: [4, 4, 4, 4, 0, 253, 266, "i16x8.relaxed_laneselect", ""],
        [464]: [4, 4, 4, 4, 0, 253, 267, "i32x4.relaxed_laneselect", ""],
        [465]: [4, 4, 4, 4, 0, 253, 268, "i64x2.relaxed_laneselect", ""],
        [466]: [4, 4, 4, 14, 0, 253, 269, "f32x4.relaxed_min", ""],
        [467]: [4, 4, 4, 14, 0, 253, 270, "f32x4.relaxed_max", ""],
        [468]: [4, 4, 4, 14, 0, 253, 271, "f64x2.relaxed_min", ""],
        [469]: [4, 4, 4, 14, 0, 253, 272, "f64x2.relaxed_max", ""],
        [470]: [4, 4, 4, 14, 0, 253, 273, "i16x8.relaxed_q15mulr_s", ""],
        [471]: [4, 4, 4, 14, 0, 253, 274, "i16x8.dot_i8x16_i7x16_s", ""],
        [472]: [4, 4, 4, 4, 0, 253, 275, "i32x4.dot_i8x16_i7x16_add_s", ""],
        [473]: [0, 0, 0, 14, 4, 254, 0, "memory.atomic.notify", ""],
        [474]: [0, 0, 0, 1, 4, 254, 1, "memory.atomic.wait32", ""],
        [475]: [0, 0, 1, 1, 8, 254, 2, "memory.atomic.wait64", ""],
        [476]: [14, 14, 14, 14, 0, 254, 3, "atomic.fence", ""],
        [477]: [0, 0, 14, 14, 4, 254, 16, "i32.atomic.load", ""],
        [478]: [1, 0, 14, 14, 8, 254, 17, "i64.atomic.load", ""],
        [479]: [0, 0, 14, 14, 1, 254, 18, "i32.atomic.load8_u", ""],
        [480]: [0, 0, 14, 14, 2, 254, 19, "i32.atomic.load16_u", ""],
        [481]: [1, 0, 14, 14, 1, 254, 20, "i64.atomic.load8_u", ""],
        [482]: [1, 0, 14, 14, 2, 254, 21, "i64.atomic.load16_u", ""],
        [483]: [1, 0, 14, 14, 4, 254, 22, "i64.atomic.load32_u", ""],
        [484]: [14, 0, 0, 14, 4, 254, 23, "i32.atomic.store", ""],
        [485]: [14, 0, 1, 14, 8, 254, 24, "i64.atomic.store", ""],
        [486]: [14, 0, 0, 14, 1, 254, 25, "i32.atomic.store8", ""],
        [487]: [14, 0, 0, 14, 2, 254, 26, "i32.atomic.store16", ""],
        [488]: [14, 0, 1, 14, 1, 254, 27, "i64.atomic.store8", ""],
        [489]: [14, 0, 1, 14, 2, 254, 28, "i64.atomic.store16", ""],
        [490]: [14, 0, 1, 14, 4, 254, 29, "i64.atomic.store32", ""],
        [491]: [0, 0, 0, 14, 4, 254, 30, "i32.atomic.rmw.add", ""],
        [492]: [1, 0, 1, 14, 8, 254, 31, "i64.atomic.rmw.add", ""],
        [493]: [0, 0, 0, 14, 1, 254, 32, "i32.atomic.rmw8.add_u", ""],
        [494]: [0, 0, 0, 14, 2, 254, 33, "i32.atomic.rmw16.add_u", ""],
        [495]: [1, 0, 1, 14, 1, 254, 34, "i64.atomic.rmw8.add_u", ""],
        [496]: [1, 0, 1, 14, 2, 254, 35, "i64.atomic.rmw16.add_u", ""],
        [497]: [1, 0, 1, 14, 4, 254, 36, "i64.atomic.rmw32.add_u", ""],
        [498]: [0, 0, 0, 14, 4, 254, 37, "i32.atomic.rmw.sub", ""],
        [499]: [1, 0, 1, 14, 8, 254, 38, "i64.atomic.rmw.sub", ""],
        [500]: [0, 0, 0, 14, 1, 254, 39, "i32.atomic.rmw8.sub_u", ""],
        [501]: [0, 0, 0, 14, 2, 254, 40, "i32.atomic.rmw16.sub_u", ""],
        [502]: [1, 0, 1, 14, 1, 254, 41, "i64.atomic.rmw8.sub_u", ""],
        [503]: [1, 0, 1, 14, 2, 254, 42, "i64.atomic.rmw16.sub_u", ""],
        [504]: [1, 0, 1, 14, 4, 254, 43, "i64.atomic.rmw32.sub_u", ""],
        [505]: [0, 0, 0, 14, 4, 254, 44, "i32.atomic.rmw.and", ""],
        [506]: [1, 0, 1, 14, 8, 254, 45, "i64.atomic.rmw.and", ""],
        [507]: [0, 0, 0, 14, 1, 254, 46, "i32.atomic.rmw8.and_u", ""],
        [508]: [0, 0, 0, 14, 2, 254, 47, "i32.atomic.rmw16.and_u", ""],
        [509]: [1, 0, 1, 14, 1, 254, 48, "i64.atomic.rmw8.and_u", ""],
        [510]: [1, 0, 1, 14, 2, 254, 49, "i64.atomic.rmw16.and_u", ""],
        [511]: [1, 0, 1, 14, 4, 254, 50, "i64.atomic.rmw32.and_u", ""],
        [512]: [0, 0, 0, 14, 4, 254, 51, "i32.atomic.rmw.or", ""],
        [513]: [1, 0, 1, 14, 8, 254, 52, "i64.atomic.rmw.or", ""],
        [514]: [0, 0, 0, 14, 1, 254, 53, "i32.atomic.rmw8.or_u", ""],
        [515]: [0, 0, 0, 14, 2, 254, 54, "i32.atomic.rmw16.or_u", ""],
        [516]: [1, 0, 1, 14, 1, 254, 55, "i64.atomic.rmw8.or_u", ""],
        [517]: [1, 0, 1, 14, 2, 254, 56, "i64.atomic.rmw16.or_u", ""],
        [518]: [1, 0, 1, 14, 4, 254, 57, "i64.atomic.rmw32.or_u", ""],
        [519]: [0, 0, 0, 14, 4, 254, 58, "i32.atomic.rmw.xor", ""],
        [520]: [1, 0, 1, 14, 8, 254, 59, "i64.atomic.rmw.xor", ""],
        [521]: [0, 0, 0, 14, 1, 254, 60, "i32.atomic.rmw8.xor_u", ""],
        [522]: [0, 0, 0, 14, 2, 254, 61, "i32.atomic.rmw16.xor_u", ""],
        [523]: [1, 0, 1, 14, 1, 254, 62, "i64.atomic.rmw8.xor_u", ""],
        [524]: [1, 0, 1, 14, 2, 254, 63, "i64.atomic.rmw16.xor_u", ""],
        [525]: [1, 0, 1, 14, 4, 254, 64, "i64.atomic.rmw32.xor_u", ""],
        [526]: [0, 0, 0, 14, 4, 254, 65, "i32.atomic.rmw.xchg", ""],
        [527]: [1, 0, 1, 14, 8, 254, 66, "i64.atomic.rmw.xchg", ""],
        [528]: [0, 0, 0, 14, 1, 254, 67, "i32.atomic.rmw8.xchg_u", ""],
        [529]: [0, 0, 0, 14, 2, 254, 68, "i32.atomic.rmw16.xchg_u", ""],
        [530]: [1, 0, 1, 14, 1, 254, 69, "i64.atomic.rmw8.xchg_u", ""],
        [531]: [1, 0, 1, 14, 2, 254, 70, "i64.atomic.rmw16.xchg_u", ""],
        [532]: [1, 0, 1, 14, 4, 254, 71, "i64.atomic.rmw32.xchg_u", ""],
        [533]: [0, 0, 0, 0, 4, 254, 72, "i32.atomic.rmw.cmpxchg", ""],
        [534]: [1, 0, 1, 1, 8, 254, 73, "i64.atomic.rmw.cmpxchg", ""],
        [535]: [0, 0, 0, 0, 1, 254, 74, "i32.atomic.rmw8.cmpxchg_u", ""],
        [536]: [0, 0, 0, 0, 2, 254, 75, "i32.atomic.rmw16.cmpxchg_u", ""],
        [537]: [1, 0, 1, 1, 1, 254, 76, "i64.atomic.rmw8.cmpxchg_u", ""],
        [538]: [1, 0, 1, 1, 2, 254, 77, "i64.atomic.rmw16.cmpxchg_u", ""],
        [539]: [1, 0, 1, 1, 4, 254, 78, "i64.atomic.rmw32.cmpxchg_u", ""],
        [540]: [14, 14, 14, 14, 0, 0, 0, "", ""]
      };
      var Token = class {
        constructor(type, lexeme, line, col, indexInSource, opcodeType = null, valueType = null) {
          this.type = type;
          this.lexeme = lexeme;
          this.line = line;
          this.col = col;
          this.indexInSource = indexInSource;
          this.opcodeType = opcodeType;
          this.valueType = valueType;
        }
        static EofToken(lexeme, line, col, indexInSource) {
          return new Token("EOF", lexeme, line, col, indexInSource, null, null);
        }
        isBareToken() {
          return isTokenTypeBare(this.type);
        }
        isStringToken() {
          return isTokenTypeString(this.type);
        }
        isValueToken() {
          return isTokenTypeType(this.type);
        }
        isOpcodeToken() {
          return isTokenTypeOpcode(this.type);
        }
        isOpcodeType(opcodeType) {
          return isTokenTypeOpcode(this.type) && this.opcodeType === opcodeType;
        }
        isLiteral() {
          return isTokenTypeLiteral(this.type);
        }
        isReference() {
          return isTokenTypeRefKind(this.type);
        }
        getOpcodeParamLength() {
          assert(this.opcodeType !== null);
          return Opcode.getParamLength(this.opcodeType);
        }
        getOpcodeEncoding() {
          assert(this.opcodeType !== null);
          return Opcode.getCode(this.opcodeType);
        }
        extractText() {
          assert(this.type === "TEXT");
          return this.lexeme.slice(1, this.lexeme.length - 1);
        }
      };
      function isTokenTypeBare(token_type) {
        if (token_type === null) return false;
        return token_type === "Invalid" || token_type === "array" || token_type === "assert_exception" || token_type === "assert_exhaustion" || token_type === "assert_invalid" || token_type === "assert_malformed" || token_type === "assert_return" || token_type === "assert_trap" || token_type === "assert_unlinkable" || token_type === "bin" || token_type === "item" || token_type === "data" || token_type === "declare" || token_type === "delegate" || token_type === "do" || token_type === "either" || token_type === "elem" || token_type === "EOF" || token_type === "tag" || token_type === "export" || token_type === "field" || token_type === "get" || token_type === "global" || token_type === "import" || token_type === "invoke" || token_type === "input" || token_type === "local" || token_type === "(" || token_type === "memory" || token_type === "module" || token_type === "mut" || token_type === "nan:arithmetic" || token_type === "nan:canonical" || token_type === "offset" || token_type === "output" || token_type === "param" || token_type === "ref" || token_type === "quote" || token_type === "register" || token_type === "result" || token_type === ")" || token_type === "shared" || token_type === "start" || token_type === "struct" || token_type === "table" || token_type === "then" || token_type === "type" || token_type === "i8x16" || token_type === "i16x8" || token_type === "i32x4" || token_type === "i64x2" || token_type === "f32x4" || token_type === "f64x2";
      }
      function isTokenTypeString(token_type) {
        if (token_type === null) return false;
        return token_type === "align=" || token_type === "Annotation" || token_type === "offset=" || token_type === "Reserved" || token_type === "TEXT" || token_type === "VAR";
      }
      function isTokenTypeType(token_type) {
        if (token_type === null) return false;
        return token_type === "VALUETYPE";
      }
      function isTokenTypeOpcode(token_type) {
        if (token_type === null) return false;
        return token_type === "atomic.fence" || token_type === "ATOMIC_LOAD" || token_type === "ATOMIC_NOTIFY" || token_type === "ATOMIC_RMW" || token_type === "ATOMIC_RMW_CMPXCHG" || token_type === "ATOMIC_STORE" || token_type === "ATOMIC_WAIT" || token_type === "BINARY" || token_type === "block" || token_type === "br" || token_type === "br_if" || token_type === "br_table" || token_type === "call" || token_type === "call_indirect" || token_type === "call_ref" || token_type === "catch" || token_type === "catch_all" || token_type === "COMPARE" || token_type === "CONST" || token_type === "CONVERT" || token_type === "data.drop" || token_type === "drop" || token_type === "elem.drop" || token_type === "else" || token_type === "end" || token_type === "global.get" || token_type === "global.set" || token_type === "if" || token_type === "LOAD" || token_type === "local.get" || token_type === "local.set" || token_type === "local.tee" || token_type === "loop" || token_type === "memory.copy" || token_type === "memory.fill" || token_type === "memory.grow" || token_type === "memory.init" || token_type === "memory.size" || token_type === "nop" || token_type === "ref.extern" || token_type === "ref.func" || token_type === "ref.is_null" || token_type === "ref.null" || token_type === "rethrow" || token_type === "return_call_indirect" || token_type === "return_call" || token_type === "return" || token_type === "select" || token_type === "SIMDLANEOP" || token_type === "SIMDLOADSPLAT" || token_type === "SIMDLOADLANE" || token_type === "SIMDSTORELANE" || token_type === "i8x16.shuffle" || token_type === "STORE" || token_type === "table.copy" || token_type === "table.full" || token_type === "table.get" || token_type === "table.grow" || token_type === "table.init" || token_type === "table.set" || token_type === "table.size" || token_type === "TERNARY" || token_type === "throw" || token_type === "try" || token_type === "UNARY" || token_type === "unreachable";
      }
      function isTokenTypeLiteral(token_type) {
        if (token_type === null) return false;
        return token_type === "FLOAT" || token_type === "INT" || token_type === "NAT";
      }
      function isTokenTypeRefKind(token_type) {
        if (token_type === null) return false;
        return token_type === "func" || token_type === "extern" || token_type === "exn";
      }
      var ExportType = (ExportType2 => {
        ExportType2[ExportType2["Func"] = 0] = "Func";
        ExportType2[ExportType2["Table"] = 1] = "Table";
        ExportType2[ExportType2["Mem"] = 2] = "Mem";
        ExportType2[ExportType2["Global"] = 3] = "Global";
        return ExportType2;
      })(ExportType || ({}));
      (ExportType2 => {
        function getEncoding(e) {
          switch (e) {
            case 0:
              return 0;
            case 1:
              return 1;
            case 2:
              return 2;
            case 3:
              return 3;
            default:
              throw new Error(`ExportType ${e} not recognized`);
          }
        }
        ExportType2.getEncoding = getEncoding;
      })(ExportType || (ExportType = {}));
      var SectionCode;
      (SectionCode2 => {
        SectionCode2.Type = 1;
        SectionCode2.Import = 2;
        SectionCode2.Function = 3;
        SectionCode2.Table = 4;
        SectionCode2.Memory = 5;
        SectionCode2.Global = 6;
        SectionCode2.Export = 7;
        SectionCode2.Start = 8;
        SectionCode2.Element = 9;
        SectionCode2.Code = 10;
        SectionCode2.Data = 11;
      })(SectionCode || (SectionCode = {}));
      var BinaryWriter = class {
        constructor(module2) {
          this.module = module2;
        }
        encode() {
          return new Uint8Array([...[0, ("a").charCodeAt(0), ("s").charCodeAt(0), ("m").charCodeAt(0)], ...[1, 0, 0, 0], ...this.encodeTypeSection(), ...this.encodeImportSection(), ...this.encodeFunctionSection(), ...this.encodeTableSection(), ...this.encodeMemorySection(), ...this.encodeGlobalSection(), ...this.encodeExportSection(), ...this.encodeStartSection(), ...this.encodeElementSection(), ...this.encodeCodeSection(), ...this.encodeDataSection()]);
        }
        encodeTypeSection() {
          const types = this.module.getGlobalTypes();
          const numTypes = types.length;
          let funcSignatureEncodings = [];
          types.map(func => this.encodeFunctionSignature(func)).forEach(arr => {
            funcSignatureEncodings = funcSignatureEncodings.concat(...arr);
          });
          const sectionSize = funcSignatureEncodings.length + 1;
          return new Uint8Array([SectionCode.Type, sectionSize, numTypes, ...funcSignatureEncodings]);
        }
        encodeImportSection() {
          return new Uint8Array([]);
        }
        encodeFunctionSection() {
          const functions = this.module.getFunctionSignatures();
          const num_fns = functions.length;
          const section_size = num_fns + 1;
          const function_indices = functions.map(funcSig => this.module.resolveGlobalTypeIndex(funcSig));
          return new Uint8Array([SectionCode.Function, section_size, num_fns, ...function_indices]);
        }
        encodeTableSection() {
          return new Uint8Array([]);
        }
        encodeMemorySection() {
          return new Uint8Array([]);
        }
        encodeGlobalSection() {
          return new Uint8Array([]);
        }
        encodeExportSection() {
          const {exportExpressions: exportDeclarations} = this.module;
          if (typeof exportDeclarations === "undefined") {
            return new Uint8Array([]);
          }
          const exportEncoding = this.encodeExportExpressions(exportDeclarations);
          const sectionLength = exportEncoding.length;
          if (sectionLength === 0) {
            return new Uint8Array();
          }
          return new Uint8Array([SectionCode.Export, sectionLength, ...exportEncoding]);
        }
        encodeStartSection() {
          return new Uint8Array([]);
        }
        encodeElementSection() {
          return new Uint8Array([]);
        }
        encodeCodeSection() {
          const fnExps = this.module.functions;
          const fnBodyEncodings = [];
          fnExps.forEach(body => {
            fnBodyEncodings.push(...this.encodeFunctionBody(body));
          });
          const sectionSize = fnBodyEncodings.length + 1;
          const fnNumber = fnExps.length;
          return new Uint8Array([SectionCode.Code, sectionSize, fnNumber, ...fnBodyEncodings]);
        }
        encodeDataSection() {
          return new Uint8Array([]);
        }
        encodeFunctionSignature(ir) {
          const FUNCTION_SIG_PREFIX = 96;
          const param_encoding = ir.paramTypes.map(type => ValueType.getValue(type));
          const param_len = param_encoding.length;
          const result_encoding = ir.returnTypes.map(type => ValueType.getValue(type));
          const result_len = result_encoding.length;
          return new Uint8Array([FUNCTION_SIG_PREFIX, param_len, ...param_encoding, result_len, ...result_encoding]);
        }
        encodeFunctionBody(fnExp) {
          const fnBody = fnExp.functionBody;
          const unfoldedBody = fnBody.body.unfold();
          for (let i = 0; i < unfoldedBody.tokens.length; i++) {
            const token = unfoldedBody.tokens[i];
            if (token.type === "VAR") {
              unfoldedBody.tokens[i] = this.convertVarToIndexToken(token, fnExp.resolveVariableIndex(token.lexeme));
            }
          }
          const encodedLocals = this.encodeFunctionBodyLocalTypeCount(fnExp);
          const encodedBody = this.encodePureUnfoldedTokenExpression(unfoldedBody);
          const sectionLength = encodedLocals.length + encodedBody.length + 1;
          const FUNCTION_END = 11;
          return new Uint8Array([sectionLength, ...encodedLocals, ...encodedBody, FUNCTION_END]);
        }
        encodeFunctionBodyLocalTypeCount(fnExp) {
          const localTypes = fnExp.localTypes;
          let uniqueConsecutiveType = null;
          let uniqueConsecutiveTypeCount = 0;
          let total_types = 0;
          const encoding = [];
          for (const type of localTypes) {
            if (uniqueConsecutiveType === type) {
              uniqueConsecutiveTypeCount++;
              continue;
            }
            if (uniqueConsecutiveType !== null) {
              encoding.push(uniqueConsecutiveTypeCount, ValueType.getValue(uniqueConsecutiveType));
            }
            uniqueConsecutiveType = type;
            uniqueConsecutiveTypeCount = 1;
            total_types++;
          }
          if (uniqueConsecutiveType !== null) {
            encoding.push(uniqueConsecutiveTypeCount, ValueType.getValue(uniqueConsecutiveType));
          }
          return Uint8Array.from([total_types, ...encoding]);
        }
        encodePureUnfoldedTokenExpression(ir) {
          const binary = [];
          for (const [index, token] of ir.tokens.entries()) {
            if (!this.isLiteralToken(token)) {
              binary.push(...this.encodeNonLiteralToken(token));
            } else {
              const prevToken = ir.tokens[index - 1];
              binary.push(...this.encodeLiteralToken(prevToken, token));
            }
          }
          return new Uint8Array(binary);
        }
        encodeExportExpressions(exportExpressions) {
          if (exportExpressions.length === 0) {
            return new Uint8Array();
          }
          const exportNum = exportExpressions.length;
          const exportEncodings = [];
          for (const exportExp of exportExpressions) {
            let {exportReferenceIndex, exportName, exportType, exportReferenceName} = exportExp;
            const exportNameEncoding = [];
            for (let i = 0; i < exportName.length; i++) {
              exportNameEncoding.push(exportName.charCodeAt(i));
            }
            exportEncodings.push(exportName.length);
            exportEncodings.push(...exportNameEncoding);
            if (exportReferenceIndex === null && exportReferenceName === null) {
              throw new Error(`Both export reference index and name cannot be null: ${exportExp}`);
            }
            if (exportReferenceIndex === null) {
              exportReferenceIndex = this.module.resolveGlobalExpressionIndex(exportReferenceName);
            }
            exportEncodings.push(ExportType.getEncoding(exportType));
            exportEncodings.push(exportReferenceIndex);
          }
          return new Uint8Array([exportNum, ...exportEncodings]);
        }
        convertVarToIndexToken(varToken, index) {
          assert(Number.isInteger(index));
          assert(index >= 0);
          return new Token("NAT", index.toString(), varToken.line, varToken.col, varToken.indexInSource, null, null);
        }
        isLiteralToken(token) {
          return token.type === "NAT" || token.type === "FLOAT";
        }
        encodeNonLiteralToken(token) {
          if (token.isValueToken()) {
            return new Uint8Array([ValueType.getValue(token.valueType)]);
          }
          if (token.isOpcodeToken()) {
            return new Uint8Array([Opcode.getCode(token.opcodeType)]);
          }
          throw new Error(`Unexpected token: ${token}`);
        }
        encodeLiteralToken(prevToken, token) {
          if (prevToken.isOpcodeType(58)) {
            return NumberEncoder.encodeF64Const((/^\d+$/u).test(token.lexeme) ? Number.parseInt(token.lexeme) : Number.parseFloat(token.lexeme));
          }
          if (prevToken.type === "local.get") {
            assert(token.type === "NAT");
            return new Uint8Array([Number.parseInt(token.lexeme)]);
          }
          throw new Error(`Unsuppored literal token type: [${JSON.stringify(prevToken, void 0, 2)}, ${JSON.stringify(token, void 0, 2)}]`);
        }
      };
      var NumberEncoder;
      (NumberEncoder2 => {
        function encodeF64Const(n) {
          let buffer = new ArrayBuffer(8);
          new DataView(buffer).setFloat64(0, n);
          let bytes = new Uint8Array(buffer);
          return bytes.reverse();
        }
        NumberEncoder2.encodeF64Const = encodeF64Const;
      })(NumberEncoder || (NumberEncoder = {}));
      var import_lodash = __toESM2(require_lodash());
      var Unfoldable;
      (Unfoldable2 => {
        function instanceOf(obj) {
          return ("unfold" in obj);
        }
        Unfoldable2.instanceOf = instanceOf;
      })(Unfoldable || (Unfoldable = {}));
      var IntermediateRepresentation = class {};
      var ModuleExpression = class extends IntermediateRepresentation {
        constructor(...childNodes) {
          super();
          this.globalTypes = [];
          this.functions = [];
          this.globals = [];
          this.exportExpressions = [];
          for (const child of childNodes) {
            if (child instanceof FunctionExpression) {
              this.addFunctionExpression(child);
            } else if (child instanceof ExportExpression) {
              this.addExportExpression(child);
            }
          }
        }
        addFunctionExpression(functionExpression) {
          this.functions.push(functionExpression);
          this.addGlobalType(functionExpression.functionSignature);
          this.globals.push(functionExpression);
          if (functionExpression.hasInlineExport) {
            this.addExportExpression(new ExportExpression(functionExpression.inlineExportName, 0, this.functions.length - 1));
          }
        }
        addExportExpression(exportExpression) {
          this.exportExpressions.push(exportExpression);
        }
        addGlobalType(type) {
          for (const existingType of this.globalTypes) {
            if ((0, import_lodash.isEqual)(existingType, type)) {
              return;
            }
          }
          this.globalTypes.push(type);
        }
        getGlobalTypes() {
          return this.globalTypes;
        }
        resolveGlobalTypeIndex(type) {
          for (const [i, existing_type] of this.globalTypes.entries()) {
            if ((0, import_lodash.isEqual)(existing_type, type)) {
              return i;
            }
          }
          assert(false, `Global type not found! This is an error that should be raised to the developer.
      Please help raise an issue on GitHub.`);
          return -1;
        }
        resolveGlobalExpressionIndex(name) {
          for (const [i, existing_type] of this.globals.entries()) {
            if (existing_type.getID() === name) {
              return i;
            }
          }
          assert(false, "Global not found!");
          return -1;
        }
        getFunctionSignatures() {
          return this.functions.map(func => func.functionSignature);
        }
        getFunctionBodies() {
          return this.functions.map(func => func.functionBody);
        }
      };
      var ExportExpression = class extends IntermediateRepresentation {
        constructor(exportName, exportType, exportReference) {
          super();
          this.exportReferenceIndex = null;
          this.exportReferenceName = null;
          if (typeof exportName === "string") {
            this.exportName = exportName;
          } else {
            this.exportName = this.getExportName(exportName);
          }
          if (exportType instanceof Token) {
            this.exportType = this.getExportType(exportType);
          } else {
            this.exportType = exportType;
          }
          if (typeof exportReference === "number") {
            this.exportReferenceIndex = exportReference;
          } else {
            [this.exportReferenceIndex, this.exportReferenceName] = this.getExportReference(exportReference);
          }
        }
        getExportName(exportName) {
          if (exportName.type !== "TEXT") {
            throw new Error(`unexpected export name: ${exportName}`);
          }
          return exportName.extractText();
        }
        getExportType(exportType) {
          if (exportType.type !== "func") {
            throw new Error(`unexpected export type: ${exportType}`);
          }
          return 0;
        }
        getExportReference(exportReference) {
          switch (exportReference.type) {
            case "NAT":
              return [Number.parseInt(exportReference.lexeme), null];
            case "VAR":
              return [null, exportReference.lexeme];
            default:
              throw new Error(`unexpected export ID: ${JSON.stringify(exportReference, void 0, 2)}.`);
          }
        }
      };
      var FunctionExpression = class extends IntermediateRepresentation {
        constructor(functionName, inlineExportName, paramTypes, paramNames, returnTypes, localTypes, localNames, body) {
          super();
          assert(paramTypes.length === paramNames.length, `Function param types and names must have same length: [${paramTypes}], [${paramNames}]`);
          assert(localTypes.length === localNames.length, `Function local types and names must have same length: [${localTypes}], [${localNames}]`);
          this.functionName = functionName;
          this.inlineExportName = inlineExportName;
          this.hasInlineExport = inlineExportName !== null;
          this.functionSignature = new FunctionSignature(paramTypes, returnTypes);
          this.functionBody = new FunctionBody(body);
          this.paramNames = paramNames;
          this.localTypes = localTypes;
          this.localNames = localNames;
        }
        getID() {
          return this.functionName;
        }
        resolveVariableIndex(nameToResolve) {
          for (const [i, name] of [...this.paramNames, ...this.localNames].entries()) {
            if (name === nameToResolve) {
              return i;
            }
          }
          throw new Error(`Parameter name ${nameToResolve} not found in function. Parameter names available: ${[this.paramNames]}, Local Names available: ${this.localNames}`);
        }
      };
      var FunctionSignature = class {
        constructor(paramTypes, returnTypes) {
          this.paramTypes = paramTypes;
          this.returnTypes = returnTypes;
        }
      };
      var FunctionBody = class {
        constructor(body) {
          this.body = body;
        }
      };
      var OperationTree = class extends IntermediateRepresentation {
        constructor(operator, operands) {
          super();
          this.operator = operator;
          this.operands = operands;
        }
        unfold() {
          const unfoldedOperands = this.operands.flatMap(operand => {
            if (operand instanceof Token) {
              return [operand];
            }
            return operand.unfold().tokens;
          });
          return new PureUnfoldedTokenExpression([...unfoldedOperands, this.operator]);
        }
      };
      var UnfoldedTokenExpression = class extends IntermediateRepresentation {
        constructor(tokens) {
          super();
          this.tokens = tokens;
        }
        unfold() {
          const unfoldedOperands = this.tokens.flatMap(token => {
            if (token instanceof Token) {
              return [token];
            }
            return token.unfold().tokens;
          });
          return new PureUnfoldedTokenExpression(unfoldedOperands);
        }
      };
      var EmptyTokenExpression = class extends IntermediateRepresentation {
        unfold() {
          return new PureUnfoldedTokenExpression([]);
        }
      };
      var PureUnfoldedTokenExpression = class extends IntermediateRepresentation {
        constructor(tokens) {
          super();
          this.tokens = tokens;
        }
      };
      function getIR(parseTree) {
        if (isSExpression(parseTree) || isStackExpression(parseTree)) {
          return parseExpression(parseTree);
        }
        if (isFunctionExpression(parseTree)) {
          return parseFunctionExpression(parseTree);
        }
        if (isModuleDeclaration(parseTree)) {
          return parseModuleExpression(parseTree);
        }
        if (isExportDeclaration(parseTree)) {
          return parseExportDeclaration(parseTree);
        }
        throw new Error(`Unexpected token type to parse: ${JSON.stringify(parseTree, void 0, 2)}`);
      }
      function parseExpression(parseTree) {
        if (parseTree.length === 0 || typeof parseTree === "undefined") {
          return new EmptyTokenExpression();
        }
        if (isSExpression(parseTree)) {
          return parseSExpression(parseTree);
        }
        if (isStackExpression(parseTree)) {
          return parseStackExpression(parseTree);
        }
        throw new Error(`Cannot parse into function expression: ${JSON.stringify(parseTree, void 0, 2)}`);
      }
      function parseSExpression(parseTree) {
        let head = parseTree[0];
        assert(head instanceof Token);
        head = head;
        const body = [];
        for (let i = 1; i < parseTree.length; i++) {
          const token = parseTree[i];
          if (token instanceof Token) {
            body.push(token);
          } else {
            const irNode = getIR(token);
            if (!(irNode instanceof Token || irNode instanceof OperationTree || irNode instanceof UnfoldedTokenExpression)) {
              throw new Error();
            }
            body.push(irNode);
          }
        }
        assert(Opcode.getParamLength(head.opcodeType) === body.length);
        return new OperationTree(head, body);
      }
      function parseStackExpression(parseTree) {
        const nodes = [];
        parseTree.forEach(tokenNode => {
          if (tokenNode instanceof Token) {
            nodes.push(tokenNode);
          } else {
            const temp = getIR(tokenNode);
            if (!(temp instanceof Token || temp instanceof OperationTree)) {
              throw new Error();
            }
            nodes.push(temp);
          }
        });
        return new UnfoldedTokenExpression(nodes);
      }
      function parseFunctionExpression(parseTree) {
        assert(isFunctionExpression(parseTree));
        let functionName = null;
        let inlineExportName = null;
        const paramTypes = [];
        const paramNames = [];
        const resultTypes = [];
        const localTypes = [];
        const localNames = [];
        let cursor = 1;
        let token = parseTree[cursor];
        if (token instanceof Token && token.type === "VAR") {
          functionName = token.lexeme;
          cursor += 1;
        }
        token = parseTree[cursor];
        if (token instanceof Array && token[0] instanceof Token && token[0].type === "export" && token[1] instanceof Token) {
          inlineExportName = token[1].extractText();
          cursor++;
        }
        for (; cursor < parseTree.length; cursor++) {
          const parseTreeNode = parseTree[cursor];
          if (parseTreeNode instanceof Token || !isFunctionParamDeclaration(parseTreeNode)) {
            break;
          }
          const {types, names} = parseFunctionParamExpression(parseTreeNode);
          paramTypes.push(...types);
          paramNames.push(...names);
        }
        for (; cursor < parseTree.length; cursor++) {
          const parseTreeNode = parseTree[cursor];
          if (parseTreeNode instanceof Token || !isFunctionResultDeclaration(parseTreeNode)) {
            break;
          }
          const types = parseFunctionResultExpression(parseTreeNode);
          resultTypes.push(...types);
        }
        for (; cursor < parseTree.length; cursor++) {
          const parseTreeNode = parseTree[cursor];
          if (parseTreeNode instanceof Token || !isFunctionLocalDeclaration(parseTreeNode)) {
            break;
          }
          const {types, names} = parseFunctionLocalExpression(parseTreeNode);
          localTypes.push(...types);
          localNames.push(...names);
        }
        let remainingTree = parseTree.slice(cursor);
        if (remainingTree.length === 1 && !(remainingTree[0] instanceof Token)) {
          remainingTree = remainingTree[0];
        }
        const ir = parseExpression(remainingTree);
        return new FunctionExpression(functionName, inlineExportName, paramTypes, paramNames, resultTypes, localTypes, localNames, ir);
      }
      function parseFunctionParamExpression(parseTree) {
        const types = [];
        const names = [];
        for (let i = 1; i < parseTree.length; i++) {
          const parseTreeNode = parseTree[i];
          if (!(parseTreeNode instanceof Token)) {
            throw new Error();
          }
          if (parseTreeNode.type === "VALUETYPE") {
            types.push(parseTreeNode.valueType);
            names.push(null);
          } else if (parseTreeNode.type === "VAR") {
            names.push(parseTreeNode.lexeme);
            const nextToken = parseTree[++i];
            assert(nextToken instanceof Token && nextToken.type === "VALUETYPE", `Expected Token Type to be a value type: ${nextToken}`);
            types.push(nextToken.valueType);
          } else {
            throw new Error(`Unexpected token, bla bla ${parseTreeNode}`);
          }
        }
        return {
          types,
          names
        };
      }
      function parseFunctionResultExpression(parseTree) {
        const types = [];
        for (let i = 1; i < parseTree.length; i++) {
          const parseTreeNode = parseTree[i];
          if (!(parseTreeNode instanceof Token)) {
            throw new Error();
          }
          if (parseTreeNode.type === "VALUETYPE") {
            types.push(parseTreeNode.valueType);
          } else {
            throw new Error(`Unexpected token, bla bla ${parseTreeNode}`);
          }
        }
        return types;
      }
      function parseFunctionLocalExpression(parseTree) {
        const types = [];
        const names = [];
        for (let i = 1; i < parseTree.length; i++) {
          const parseTreeNode = parseTree[i];
          if (!(parseTreeNode instanceof Token)) {
            throw new Error();
          }
          if (parseTreeNode.type === "VALUETYPE") {
            types.push(parseTreeNode.valueType);
            names.push(null);
          } else if (parseTreeNode.type === "VAR") {
            names.push(parseTreeNode.lexeme);
            const nextToken = parseTree[++i];
            assert(nextToken instanceof Token && nextToken.type === "VALUETYPE", `Expected Token Type to be a value type: ${nextToken}`);
            types.push(nextToken.valueType);
          } else {
            throw new Error(`Unexpected token, bla bla ${parseTreeNode}`);
          }
        }
        return {
          types,
          names
        };
      }
      function parseModuleExpression(parseTree) {
        assert(isModuleDeclaration(parseTree));
        const functionExps = [];
        const exportExps = [];
        for (let i = 1; i < parseTree.length; i++) {
          const parseTreeNode = parseTree[i];
          if (parseTreeNode instanceof Token) {
            throw new Error();
          }
          if (isFunctionExpression(parseTreeNode)) {
            functionExps.push(parseFunctionExpression(parseTreeNode));
          }
          if (isExportDeclaration(parseTreeNode)) {
            exportExps.push(...parseExportDeclaration(parseTreeNode));
          }
        }
        return new ModuleExpression(...functionExps, ...exportExps);
      }
      function parseExportDeclaration(parseTree) {
        assert(isExportDeclaration(parseTree));
        const exportExpressions = [];
        for (let i = 1; i < parseTree.length; i += 2) {
          const exportName = parseTree[i];
          if (!(exportName instanceof Token)) {
            throw new Error();
          }
          const exportInfo = parseTree[i + 1];
          if (!(exportInfo instanceof Array)) {
            throw new Error();
          }
          const [exportType, exportIndex] = exportInfo;
          if (!(exportType instanceof Token && exportIndex instanceof Token)) {
            throw new Error();
          }
          exportExpressions.push(new ExportExpression(exportName, exportType, exportIndex));
        }
        return exportExpressions;
      }
      function isSExpression(parseTree) {
        const tokenHeader = parseTree[0];
        assert(tokenHeader instanceof Token, `first token of ${parseTree} is not a Token type`);
        return tokenHeader instanceof Token && tokenHeader.isOpcodeToken() && Opcode.getParamLength(tokenHeader.opcodeType) > 0;
      }
      function isStackExpression(parseTree) {
        const tokenHeader = parseTree[0];
        assert(tokenHeader instanceof Token, `first token of ${parseTree} is not a Token type`);
        return tokenHeader instanceof Token && tokenHeader.isOpcodeToken() && !isFunctionExpression(parseTree) && !isSExpression(parseTree);
      }
      function isFunctionExpression(parseTree) {
        const tokenHeader = parseTree[0];
        return tokenHeader instanceof Token && tokenHeader.type === "func";
      }
      function isFunctionParamDeclaration(parseTree) {
        const tokenHeader = parseTree[0];
        return tokenHeader instanceof Token && tokenHeader.type === "param";
      }
      function isFunctionResultDeclaration(parseTree) {
        const tokenHeader = parseTree[0];
        return tokenHeader instanceof Token && tokenHeader.type === "result";
      }
      function isFunctionLocalDeclaration(parseTree) {
        const tokenHeader = parseTree[0];
        return tokenHeader instanceof Token && tokenHeader.type === "local";
      }
      function isModuleDeclaration(parseTree) {
        const tokenHeader = parseTree[0];
        return tokenHeader instanceof Token && tokenHeader.type === "module";
      }
      function isExportDeclaration(parseTree) {
        const tokenHeader = parseTree[0];
        return tokenHeader instanceof Token && tokenHeader.type === "export";
      }
      function parseHexdigit(c) {
        assert(c.length === 1);
        switch (c) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            return Number.parseInt(c);
          case "a":
          case "A":
            return 10;
          case "B":
          case "b":
            return 11;
          case "C":
          case "c":
            return 12;
          case "D":
          case "d":
            return 13;
          case "E":
          case "e":
            return 14;
          case "F":
          case "f":
            return 15;
        }
        throw new Error(`Invalid HexDigit: ${c}`);
      }
      var wordlist = {
        "array": ["array", null, 12],
        "assert_exception": ["assert_exception", null, null],
        "assert_exhaustion": ["assert_exhaustion", null, null],
        "assert_invalid": ["assert_invalid", null, null],
        "assert_malformed": ["assert_malformed", null, null],
        "assert_return": ["assert_return", null, null],
        "assert_trap": ["assert_trap", null, null],
        "assert_unlinkable": ["assert_unlinkable", null, null],
        "atomic.fence": ["atomic.fence", 476, null],
        "binary": ["bin", null, null],
        "block": ["block", 2, null],
        "br_if": ["br_if", 12, null],
        "br_table": ["br_table", 13, null],
        "br": ["br", 11, null],
        "call_indirect": ["call_indirect", 16, null],
        "call_ref": ["call_ref", 19, null],
        "call": ["call", 15, null],
        "catch": ["catch", 7, null],
        "catch_all": ["catch_all", 21, null],
        "data.drop": ["data.drop", 203, null],
        "data": ["data", null, null],
        "declare": ["declare", null, null],
        "delegate": ["delegate", null, null],
        "do": ["do", null, null],
        "drop": ["drop", 22, null],
        "either": ["either", null, null],
        "elem.drop": ["elem.drop", 207, null],
        "elem": ["elem", null, null],
        "else": ["else", 5, null],
        "end": ["end", 10, null],
        "tag": ["tag", null, null],
        "extern": ["extern", null, 8],
        "externref": ["VALUETYPE", null, 8],
        "export": ["export", null, null],
        "f32.abs": ["UNARY", 129, null],
        "f32.add": ["BINARY", 136, null],
        "f32.ceil": ["UNARY", 131, null],
        "f32.const": ["CONST", 57, null],
        "f32.convert_i32_s": ["CONVERT", 168, null],
        "f32.convert_i32_u": ["CONVERT", 169, null],
        "f32.convert_i64_s": ["CONVERT", 170, null],
        "f32.convert_i64_u": ["CONVERT", 171, null],
        "f32.copysign": ["BINARY", 142, null],
        "f32.demote_f64": ["CONVERT", 172, null],
        "f32.div": ["BINARY", 139, null],
        "f32.eq": ["COMPARE", 81, null],
        "f32.floor": ["UNARY", 132, null],
        "f32.ge": ["COMPARE", 86, null],
        "f32.gt": ["COMPARE", 84, null],
        "f32.le": ["COMPARE", 85, null],
        "f32.load": ["LOAD", 32, null],
        "f32.lt": ["COMPARE", 83, null],
        "f32.max": ["BINARY", 141, null],
        "f32.min": ["BINARY", 140, null],
        "f32.mul": ["BINARY", 138, null],
        "f32.nearest": ["UNARY", 134, null],
        "f32.neg": ["UNARY", 130, null],
        "f32.ne": ["COMPARE", 82, null],
        "f32.reinterpret_i32": ["CONVERT", 180, null],
        "f32.sqrt": ["UNARY", 135, null],
        "f32.store": ["STORE", 46, null],
        "f32.sub": ["BINARY", 137, null],
        "f32.trunc": ["UNARY", 133, null],
        "f32": ["VALUETYPE", null, 2],
        "f32x4.abs": ["UNARY", 423, null],
        "f32x4.add": ["BINARY", 426, null],
        "f32x4.ceil": ["UNARY", 415, null],
        "f32x4.convert_i32x4_s": ["UNARY", 447, null],
        "f32x4.convert_i32x4_u": ["UNARY", 448, null],
        "f32x4.div": ["BINARY", 429, null],
        "f32x4.eq": ["COMPARE", 282, null],
        "f32x4.extract_lane": ["SIMDLANEOP", 248, null],
        "f32x4.floor": ["UNARY", 416, null],
        "f32x4.ge": ["COMPARE", 287, null],
        "f32x4.gt": ["COMPARE", 285, null],
        "f32x4.le": ["COMPARE", 286, null],
        "f32x4.lt": ["COMPARE", 284, null],
        "f32x4.max": ["BINARY", 431, null],
        "f32x4.min": ["BINARY", 430, null],
        "f32x4.mul": ["BINARY", 428, null],
        "f32x4.nearest": ["UNARY", 418, null],
        "f32x4.neg": ["UNARY", 424, null],
        "f32x4.ne": ["COMPARE", 283, null],
        "f32x4.pmax": ["BINARY", 433, null],
        "f32x4.pmin": ["BINARY", 432, null],
        "f32x4.relaxed_madd": ["TERNARY", 458, null],
        "f32x4.relaxed_max": ["BINARY", 467, null],
        "f32x4.relaxed_min": ["BINARY", 466, null],
        "f32x4.relaxed_nmadd": ["TERNARY", 459, null],
        "f32x4.replace_lane": ["SIMDLANEOP", 249, null],
        "f32x4.splat": ["UNARY", 236, null],
        "f32x4.sqrt": ["UNARY", 425, null],
        "f32x4.sub": ["BINARY", 427, null],
        "f32x4.trunc": ["UNARY", 417, null],
        "f32x4.demote_f64x2_zero": ["UNARY", 311, null],
        "f32x4": ["f32x4", null, null],
        "f64.abs": ["UNARY", 143, null],
        "f64.add": ["BINARY", 150, null],
        "f64.ceil": ["UNARY", 145, null],
        "f64.const": ["CONST", 58, null],
        "f64.convert_i32_s": ["CONVERT", 173, null],
        "f64.convert_i32_u": ["CONVERT", 174, null],
        "f64.convert_i64_s": ["CONVERT", 175, null],
        "f64.convert_i64_u": ["CONVERT", 176, null],
        "f64.copysign": ["BINARY", 156, null],
        "f64.div": ["BINARY", 153, null],
        "f64.eq": ["COMPARE", 87, null],
        "f64.floor": ["UNARY", 146, null],
        "f64.ge": ["COMPARE", 92, null],
        "f64.gt": ["COMPARE", 90, null],
        "f64.le": ["COMPARE", 91, null],
        "f64.load": ["LOAD", 33, null],
        "f64.lt": ["COMPARE", 89, null],
        "f64.max": ["BINARY", 155, null],
        "f64.min": ["BINARY", 154, null],
        "f64.mul": ["BINARY", 152, null],
        "f64.nearest": ["UNARY", 148, null],
        "f64.neg": ["UNARY", 144, null],
        "f64.ne": ["COMPARE", 88, null],
        "f64.promote_f32": ["CONVERT", 177, null],
        "f64.reinterpret_i64": ["CONVERT", 181, null],
        "f64.sqrt": ["UNARY", 149, null],
        "f64.store": ["STORE", 47, null],
        "f64.sub": ["BINARY", 151, null],
        "f64.trunc": ["UNARY", 147, null],
        "f64": ["VALUETYPE", null, 3],
        "f64x2.abs": ["UNARY", 434, null],
        "f64x2.add": ["BINARY", 437, null],
        "f64x2.ceil": ["UNARY", 419, null],
        "f64x2.div": ["BINARY", 440, null],
        "f64x2.eq": ["COMPARE", 288, null],
        "f64x2.extract_lane": ["SIMDLANEOP", 250, null],
        "f64x2.floor": ["UNARY", 420, null],
        "f64x2.ge": ["COMPARE", 293, null],
        "f64x2.gt": ["COMPARE", 291, null],
        "f64x2.le": ["COMPARE", 292, null],
        "f64x2.lt": ["COMPARE", 290, null],
        "f64x2.max": ["BINARY", 442, null],
        "f64x2.min": ["BINARY", 441, null],
        "f64x2.mul": ["BINARY", 439, null],
        "f64x2.nearest": ["UNARY", 422, null],
        "f64x2.neg": ["UNARY", 435, null],
        "f64x2.ne": ["COMPARE", 289, null],
        "f64x2.pmax": ["BINARY", 444, null],
        "f64x2.pmin": ["BINARY", 443, null],
        "f64x2.relaxed_madd": ["TERNARY", 460, null],
        "f64x2.relaxed_max": ["BINARY", 469, null],
        "f64x2.relaxed_min": ["BINARY", 468, null],
        "f64x2.relaxed_nmadd": ["TERNARY", 461, null],
        "f64x2.replace_lane": ["SIMDLANEOP", 251, null],
        "f64x2.splat": ["UNARY", 237, null],
        "f64x2.sqrt": ["UNARY", 436, null],
        "f64x2.sub": ["BINARY", 438, null],
        "f64x2.trunc": ["UNARY", 421, null],
        "f64x2.convert_low_i32x4_s": ["UNARY", 451, null],
        "f64x2.convert_low_i32x4_u": ["UNARY", 452, null],
        "f64x2.promote_low_f32x4": ["UNARY", 312, null],
        "f64x2": ["f64x2", null, null],
        "field": ["field", null, null],
        "funcref": ["VALUETYPE", null, 7],
        "func": ["func", null, 7],
        "get": ["get", null, null],
        "global.get": ["global.get", 28, null],
        "global.set": ["global.set", 29, null],
        "global": ["global", null, null],
        "i16x8.abs": ["UNARY", 338, null],
        "i16x8.add_sat_s": ["BINARY", 353, null],
        "i16x8.add_sat_u": ["BINARY", 354, null],
        "i16x8.add": ["BINARY", 352, null],
        "i16x8.all_true": ["UNARY", 341, null],
        "i16x8.avgr_u": ["BINARY", 363, null],
        "i16x8.bitmask": ["UNARY", 342, null],
        "i16x8.dot_i8x16_i7x16_s": ["BINARY", 471, null],
        "i16x8.eq": ["COMPARE", 262, null],
        "i16x8.extract_lane_s": ["SIMDLANEOP", 241, null],
        "i16x8.extract_lane_u": ["SIMDLANEOP", 242, null],
        "i16x8.ge_s": ["COMPARE", 270, null],
        "i16x8.ge_u": ["COMPARE", 271, null],
        "i16x8.gt_s": ["COMPARE", 266, null],
        "i16x8.gt_u": ["COMPARE", 267, null],
        "i16x8.le_s": ["COMPARE", 268, null],
        "i16x8.le_u": ["COMPARE", 269, null],
        "v128.load8x8_s": ["LOAD", 218, null],
        "v128.load8x8_u": ["LOAD", 219, null],
        "i16x8.lt_s": ["COMPARE", 264, null],
        "i16x8.lt_u": ["COMPARE", 265, null],
        "i16x8.max_s": ["BINARY", 361, null],
        "i16x8.max_u": ["BINARY", 362, null],
        "i16x8.min_s": ["BINARY", 359, null],
        "i16x8.min_u": ["BINARY", 360, null],
        "i16x8.mul": ["BINARY", 358, null],
        "i16x8.narrow_i32x4_s": ["BINARY", 343, null],
        "i16x8.narrow_i32x4_u": ["BINARY", 344, null],
        "i16x8.neg": ["UNARY", 339, null],
        "i16x8.q15mulr_sat_s": ["BINARY", 340, null],
        "i16x8.ne": ["COMPARE", 263, null],
        "i16x8.relaxed_laneselect": ["TERNARY", 463, null],
        "i16x8.relaxed_q15mulr_s": ["BINARY", 470, null],
        "i16x8.replace_lane": ["SIMDLANEOP", 243, null],
        "i16x8.shl": ["BINARY", 349, null],
        "i16x8.shr_s": ["BINARY", 350, null],
        "i16x8.shr_u": ["BINARY", 351, null],
        "i16x8.splat": ["UNARY", 233, null],
        "i16x8.sub_sat_s": ["BINARY", 356, null],
        "i16x8.sub_sat_u": ["BINARY", 357, null],
        "i16x8.sub": ["BINARY", 355, null],
        "i16x8.extadd_pairwise_i8x16_s": ["UNARY", 334, null],
        "i16x8.extadd_pairwise_i8x16_u": ["UNARY", 335, null],
        "i16x8.extmul_low_i8x16_s": ["BINARY", 364, null],
        "i16x8.extmul_high_i8x16_s": ["BINARY", 365, null],
        "i16x8.extmul_low_i8x16_u": ["BINARY", 366, null],
        "i16x8.extmul_high_i8x16_u": ["BINARY", 367, null],
        "i16x8": ["i16x8", null, null],
        "i16x8.extend_high_i8x16_s": ["UNARY", 346, null],
        "i16x8.extend_high_i8x16_u": ["UNARY", 348, null],
        "i16x8.extend_low_i8x16_s": ["UNARY", 345, null],
        "i16x8.extend_low_i8x16_u": ["UNARY", 347, null],
        "i32.add": ["BINARY", 96, null],
        "i32.and": ["BINARY", 103, null],
        "i32.atomic.load16_u": ["ATOMIC_LOAD", 480, null],
        "i32.atomic.load8_u": ["ATOMIC_LOAD", 479, null],
        "i32.atomic.load": ["ATOMIC_LOAD", 477, null],
        "i32.atomic.rmw16.add_u": ["ATOMIC_RMW", 494, null],
        "i32.atomic.rmw16.and_u": ["ATOMIC_RMW", 508, null],
        "i32.atomic.rmw16.cmpxchg_u": ["ATOMIC_RMW_CMPXCHG", 536, null],
        "i32.atomic.rmw16.or_u": ["ATOMIC_RMW", 515, null],
        "i32.atomic.rmw16.sub_u": ["ATOMIC_RMW", 501, null],
        "i32.atomic.rmw16.xchg_u": ["ATOMIC_RMW", 529, null],
        "i32.atomic.rmw16.xor_u": ["ATOMIC_RMW", 522, null],
        "i32.atomic.rmw8.add_u": ["ATOMIC_RMW", 493, null],
        "i32.atomic.rmw8.and_u": ["ATOMIC_RMW", 507, null],
        "i32.atomic.rmw8.cmpxchg_u": ["ATOMIC_RMW_CMPXCHG", 535, null],
        "i32.atomic.rmw8.or_u": ["ATOMIC_RMW", 514, null],
        "i32.atomic.rmw8.sub_u": ["ATOMIC_RMW", 500, null],
        "i32.atomic.rmw8.xchg_u": ["ATOMIC_RMW", 528, null],
        "i32.atomic.rmw8.xor_u": ["ATOMIC_RMW", 521, null],
        "i32.atomic.rmw.add": ["ATOMIC_RMW", 491, null],
        "i32.atomic.rmw.and": ["ATOMIC_RMW", 505, null],
        "i32.atomic.rmw.cmpxchg": ["ATOMIC_RMW_CMPXCHG", 533, null],
        "i32.atomic.rmw.or": ["ATOMIC_RMW", 512, null],
        "i32.atomic.rmw.sub": ["ATOMIC_RMW", 498, null],
        "i32.atomic.rmw.xchg": ["ATOMIC_RMW", 526, null],
        "i32.atomic.rmw.xor": ["ATOMIC_RMW", 519, null],
        "i32.atomic.store16": ["ATOMIC_STORE", 487, null],
        "i32.atomic.store8": ["ATOMIC_STORE", 486, null],
        "i32.atomic.store": ["ATOMIC_STORE", 484, null],
        "i32.clz": ["UNARY", 93, null],
        "i32.const": ["CONST", 55, null],
        "i32.ctz": ["UNARY", 94, null],
        "i32.div_s": ["BINARY", 99, null],
        "i32.div_u": ["BINARY", 100, null],
        "i32.eq": ["COMPARE", 60, null],
        "i32.eqz": ["CONVERT", 59, null],
        "i32.extend16_s": ["UNARY", 183, null],
        "i32.extend8_s": ["UNARY", 182, null],
        "i32.ge_s": ["COMPARE", 68, null],
        "i32.ge_u": ["COMPARE", 69, null],
        "i32.gt_s": ["COMPARE", 64, null],
        "i32.gt_u": ["COMPARE", 65, null],
        "i32.le_s": ["COMPARE", 66, null],
        "i32.le_u": ["COMPARE", 67, null],
        "i32.load16_s": ["LOAD", 36, null],
        "i32.load16_u": ["LOAD", 37, null],
        "i32.load8_s": ["LOAD", 34, null],
        "i32.load8_u": ["LOAD", 35, null],
        "i32.load": ["LOAD", 30, null],
        "i32.lt_s": ["COMPARE", 62, null],
        "i32.lt_u": ["COMPARE", 63, null],
        "i32.mul": ["BINARY", 98, null],
        "i32.ne": ["COMPARE", 61, null],
        "i32.or": ["BINARY", 104, null],
        "i32.popcnt": ["UNARY", 95, null],
        "i32.reinterpret_f32": ["CONVERT", 178, null],
        "i32.rem_s": ["BINARY", 101, null],
        "i32.rem_u": ["BINARY", 102, null],
        "i32.rotl": ["BINARY", 109, null],
        "i32.rotr": ["BINARY", 110, null],
        "i32.shl": ["BINARY", 106, null],
        "i32.shr_s": ["BINARY", 107, null],
        "i32.shr_u": ["BINARY", 108, null],
        "i32.store16": ["STORE", 49, null],
        "i32.store8": ["STORE", 48, null],
        "i32.store": ["STORE", 44, null],
        "i32.sub": ["BINARY", 97, null],
        "i32.trunc_f32_s": ["CONVERT", 158, null],
        "i32.trunc_f32_u": ["CONVERT", 159, null],
        "i32.trunc_f64_s": ["CONVERT", 160, null],
        "i32.trunc_f64_u": ["CONVERT", 161, null],
        "i32.trunc_sat_f32_s": ["CONVERT", 194, null],
        "i32.trunc_sat_f32_u": ["CONVERT", 195, null],
        "i32.trunc_sat_f64_s": ["CONVERT", 196, null],
        "i32.trunc_sat_f64_u": ["CONVERT", 197, null],
        "i32": ["VALUETYPE", null, 0],
        "i32.wrap_i64": ["CONVERT", 157, null],
        "i32x4.abs": ["UNARY", 368, null],
        "i32x4.add": ["BINARY", 379, null],
        "i32x4.all_true": ["UNARY", 370, null],
        "i32x4.bitmask": ["UNARY", 371, null],
        "i32x4.dot_i8x16_i7x16_add_s": ["TERNARY", 472, null],
        "i32x4.eq": ["COMPARE", 272, null],
        "i32x4.extract_lane": ["SIMDLANEOP", 244, null],
        "i32x4.ge_s": ["COMPARE", 280, null],
        "i32x4.ge_u": ["COMPARE", 281, null],
        "i32x4.gt_s": ["COMPARE", 276, null],
        "i32x4.gt_u": ["COMPARE", 277, null],
        "i32x4.le_s": ["COMPARE", 278, null],
        "i32x4.le_u": ["COMPARE", 279, null],
        "i32x4.relaxed_trunc_f32x4_s": ["UNARY", 454, null],
        "i32x4.relaxed_trunc_f32x4_u": ["UNARY", 455, null],
        "i32x4.relaxed_trunc_f64x2_s_zero": ["UNARY", 456, null],
        "i32x4.relaxed_trunc_f64x2_u_zero": ["UNARY", 457, null],
        "v128.load16x4_s": ["LOAD", 220, null],
        "v128.load16x4_u": ["LOAD", 221, null],
        "i32x4.lt_s": ["COMPARE", 274, null],
        "i32x4.lt_u": ["COMPARE", 275, null],
        "i32x4.max_s": ["BINARY", 384, null],
        "i32x4.max_u": ["BINARY", 385, null],
        "i32x4.min_s": ["BINARY", 382, null],
        "i32x4.min_u": ["BINARY", 383, null],
        "i32x4.dot_i16x8_s": ["BINARY", 386, null],
        "i32x4.mul": ["BINARY", 381, null],
        "i32x4.neg": ["UNARY", 369, null],
        "i32x4.ne": ["COMPARE", 273, null],
        "i32x4.relaxed_laneselect": ["TERNARY", 464, null],
        "i32x4.replace_lane": ["SIMDLANEOP", 245, null],
        "i32x4.shl": ["BINARY", 376, null],
        "i32x4.shr_s": ["BINARY", 377, null],
        "i32x4.shr_u": ["BINARY", 378, null],
        "i32x4.splat": ["UNARY", 234, null],
        "i32x4.sub": ["BINARY", 380, null],
        "i32x4.extadd_pairwise_i16x8_s": ["UNARY", 336, null],
        "i32x4.extadd_pairwise_i16x8_u": ["UNARY", 337, null],
        "i32x4.extmul_low_i16x8_s": ["BINARY", 387, null],
        "i32x4.extmul_high_i16x8_s": ["BINARY", 388, null],
        "i32x4.extmul_low_i16x8_u": ["BINARY", 389, null],
        "i32x4.extmul_high_i16x8_u": ["BINARY", 390, null],
        "i32x4": ["i32x4", null, null],
        "i32x4.trunc_sat_f32x4_s": ["UNARY", 445, null],
        "i32x4.trunc_sat_f32x4_u": ["UNARY", 446, null],
        "i32x4.extend_high_i16x8_s": ["UNARY", 373, null],
        "i32x4.extend_high_i16x8_u": ["UNARY", 375, null],
        "i32x4.extend_low_i16x8_s": ["UNARY", 372, null],
        "i32x4.extend_low_i16x8_u": ["UNARY", 374, null],
        "i32x4.trunc_sat_f64x2_s_zero": ["UNARY", 449, null],
        "i32x4.trunc_sat_f64x2_u_zero": ["UNARY", 450, null],
        "i32.xor": ["BINARY", 105, null],
        "i64.add": ["BINARY", 114, null],
        "i64.and": ["BINARY", 121, null],
        "i64.atomic.load16_u": ["ATOMIC_LOAD", 482, null],
        "i64.atomic.load32_u": ["ATOMIC_LOAD", 483, null],
        "i64.atomic.load8_u": ["ATOMIC_LOAD", 481, null],
        "i64.atomic.load": ["ATOMIC_LOAD", 478, null],
        "i64.atomic.rmw16.add_u": ["ATOMIC_RMW", 496, null],
        "i64.atomic.rmw16.and_u": ["ATOMIC_RMW", 510, null],
        "i64.atomic.rmw16.cmpxchg_u": ["ATOMIC_RMW_CMPXCHG", 538, null],
        "i64.atomic.rmw16.or_u": ["ATOMIC_RMW", 517, null],
        "i64.atomic.rmw16.sub_u": ["ATOMIC_RMW", 503, null],
        "i64.atomic.rmw16.xchg_u": ["ATOMIC_RMW", 531, null],
        "i64.atomic.rmw16.xor_u": ["ATOMIC_RMW", 524, null],
        "i64.atomic.rmw32.add_u": ["ATOMIC_RMW", 497, null],
        "i64.atomic.rmw32.and_u": ["ATOMIC_RMW", 511, null],
        "i64.atomic.rmw32.cmpxchg_u": ["ATOMIC_RMW_CMPXCHG", 539, null],
        "i64.atomic.rmw32.or_u": ["ATOMIC_RMW", 518, null],
        "i64.atomic.rmw32.sub_u": ["ATOMIC_RMW", 504, null],
        "i64.atomic.rmw32.xchg_u": ["ATOMIC_RMW", 532, null],
        "i64.atomic.rmw32.xor_u": ["ATOMIC_RMW", 525, null],
        "i64.atomic.rmw8.add_u": ["ATOMIC_RMW", 495, null],
        "i64.atomic.rmw8.and_u": ["ATOMIC_RMW", 509, null],
        "i64.atomic.rmw8.cmpxchg_u": ["ATOMIC_RMW_CMPXCHG", 537, null],
        "i64.atomic.rmw8.or_u": ["ATOMIC_RMW", 516, null],
        "i64.atomic.rmw8.sub_u": ["ATOMIC_RMW", 502, null],
        "i64.atomic.rmw8.xchg_u": ["ATOMIC_RMW", 530, null],
        "i64.atomic.rmw8.xor_u": ["ATOMIC_RMW", 523, null],
        "i64.atomic.rmw.add": ["ATOMIC_RMW", 492, null],
        "i64.atomic.rmw.and": ["ATOMIC_RMW", 506, null],
        "i64.atomic.rmw.cmpxchg": ["ATOMIC_RMW_CMPXCHG", 534, null],
        "i64.atomic.rmw.or": ["ATOMIC_RMW", 513, null],
        "i64.atomic.rmw.sub": ["ATOMIC_RMW", 499, null],
        "i64.atomic.rmw.xchg": ["ATOMIC_RMW", 527, null],
        "i64.atomic.rmw.xor": ["ATOMIC_RMW", 520, null],
        "i64.atomic.store16": ["ATOMIC_STORE", 489, null],
        "i64.atomic.store32": ["ATOMIC_STORE", 490, null],
        "i64.atomic.store8": ["ATOMIC_STORE", 488, null],
        "i64.atomic.store": ["ATOMIC_STORE", 485, null],
        "i64.clz": ["UNARY", 111, null],
        "i64.const": ["CONST", 56, null],
        "i64.ctz": ["UNARY", 112, null],
        "i64.div_s": ["BINARY", 117, null],
        "i64.div_u": ["BINARY", 118, null],
        "i64.eq": ["COMPARE", 71, null],
        "i64.eqz": ["CONVERT", 70, null],
        "i64.extend16_s": ["UNARY", 185, null],
        "i64.extend32_s": ["UNARY", 186, null],
        "i64.extend8_s": ["UNARY", 184, null],
        "i64.extend_i32_s": ["CONVERT", 162, null],
        "i64.extend_i32_u": ["CONVERT", 163, null],
        "i64.ge_s": ["COMPARE", 79, null],
        "i64.ge_u": ["COMPARE", 80, null],
        "i64.gt_s": ["COMPARE", 75, null],
        "i64.gt_u": ["COMPARE", 76, null],
        "i64.le_s": ["COMPARE", 77, null],
        "i64.le_u": ["COMPARE", 78, null],
        "i64.load16_s": ["LOAD", 40, null],
        "i64.load16_u": ["LOAD", 41, null],
        "i64.load32_s": ["LOAD", 42, null],
        "i64.load32_u": ["LOAD", 43, null],
        "i64.load8_s": ["LOAD", 38, null],
        "i64.load8_u": ["LOAD", 39, null],
        "i64.load": ["LOAD", 31, null],
        "i64.lt_s": ["COMPARE", 73, null],
        "i64.lt_u": ["COMPARE", 74, null],
        "i64.mul": ["BINARY", 116, null],
        "i64.ne": ["COMPARE", 72, null],
        "i64.or": ["BINARY", 122, null],
        "i64.popcnt": ["UNARY", 113, null],
        "i64.reinterpret_f64": ["CONVERT", 179, null],
        "i64.rem_s": ["BINARY", 119, null],
        "i64.rem_u": ["BINARY", 120, null],
        "i64.rotl": ["BINARY", 127, null],
        "i64.rotr": ["BINARY", 128, null],
        "i64.shl": ["BINARY", 124, null],
        "i64.shr_s": ["BINARY", 125, null],
        "i64.shr_u": ["BINARY", 126, null],
        "i64.store16": ["STORE", 51, null],
        "i64.store32": ["STORE", 52, null],
        "i64.store8": ["STORE", 50, null],
        "i64.store": ["STORE", 45, null],
        "i64.sub": ["BINARY", 115, null],
        "i64.trunc_f32_s": ["CONVERT", 164, null],
        "i64.trunc_f32_u": ["CONVERT", 165, null],
        "i64.trunc_f64_s": ["CONVERT", 166, null],
        "i64.trunc_f64_u": ["CONVERT", 167, null],
        "i64.trunc_sat_f32_s": ["CONVERT", 198, null],
        "i64.trunc_sat_f32_u": ["CONVERT", 199, null],
        "i64.trunc_sat_f64_s": ["CONVERT", 200, null],
        "i64.trunc_sat_f64_u": ["CONVERT", 201, null],
        "i64": ["VALUETYPE", null, 1],
        "i64x2.add": ["BINARY", 402, null],
        "i64x2.extract_lane": ["SIMDLANEOP", 246, null],
        "v128.load32x2_s": ["LOAD", 222, null],
        "v128.load32x2_u": ["LOAD", 223, null],
        "i64x2.mul": ["BINARY", 404, null],
        "i64x2.eq": ["BINARY", 405, null],
        "i64x2.ne": ["BINARY", 406, null],
        "i64x2.lt_s": ["BINARY", 407, null],
        "i64x2.gt_s": ["BINARY", 408, null],
        "i64x2.le_s": ["BINARY", 409, null],
        "i64x2.ge_s": ["BINARY", 410, null],
        "i64x2.abs": ["UNARY", 391, null],
        "i64x2.neg": ["UNARY", 392, null],
        "i64x2.all_true": ["UNARY", 393, null],
        "i64x2.bitmask": ["UNARY", 394, null],
        "i64x2.extend_low_i32x4_s": ["UNARY", 395, null],
        "i64x2.extend_high_i32x4_s": ["UNARY", 396, null],
        "i64x2.extend_low_i32x4_u": ["UNARY", 397, null],
        "i64x2.extend_high_i32x4_u": ["UNARY", 398, null],
        "i64x2.relaxed_laneselect": ["TERNARY", 465, null],
        "i64x2.replace_lane": ["SIMDLANEOP", 247, null],
        "i64x2.shl": ["BINARY", 399, null],
        "i64x2.shr_s": ["BINARY", 400, null],
        "i64x2.shr_u": ["BINARY", 401, null],
        "i64x2.splat": ["UNARY", 235, null],
        "i64x2.sub": ["BINARY", 403, null],
        "i64x2.extmul_low_i32x4_s": ["BINARY", 411, null],
        "i64x2.extmul_high_i32x4_s": ["BINARY", 412, null],
        "i64x2.extmul_low_i32x4_u": ["BINARY", 413, null],
        "i64x2.extmul_high_i32x4_u": ["BINARY", 414, null],
        "i64x2": ["i64x2", null, null],
        "i64.xor": ["BINARY", 123, null],
        "i8x16.abs": ["UNARY", 313, null],
        "i8x16.add_sat_s": ["BINARY", 324, null],
        "i8x16.add_sat_u": ["BINARY", 325, null],
        "i8x16.add": ["BINARY", 323, null],
        "i8x16.all_true": ["UNARY", 316, null],
        "i8x16.avgr_u": ["BINARY", 333, null],
        "i8x16.bitmask": ["UNARY", 317, null],
        "i8x16.eq": ["COMPARE", 252, null],
        "i8x16.extract_lane_s": ["SIMDLANEOP", 238, null],
        "i8x16.extract_lane_u": ["SIMDLANEOP", 239, null],
        "i8x16.ge_s": ["COMPARE", 260, null],
        "i8x16.ge_u": ["COMPARE", 261, null],
        "i8x16.gt_s": ["COMPARE", 256, null],
        "i8x16.gt_u": ["COMPARE", 257, null],
        "i8x16.le_s": ["COMPARE", 258, null],
        "i8x16.le_u": ["COMPARE", 259, null],
        "i8x16.lt_s": ["COMPARE", 254, null],
        "i8x16.lt_u": ["COMPARE", 255, null],
        "i8x16.max_s": ["BINARY", 331, null],
        "i8x16.max_u": ["BINARY", 332, null],
        "i8x16.min_s": ["BINARY", 329, null],
        "i8x16.min_u": ["BINARY", 330, null],
        "i8x16.narrow_i16x8_s": ["BINARY", 318, null],
        "i8x16.narrow_i16x8_u": ["BINARY", 319, null],
        "i8x16.neg": ["UNARY", 314, null],
        "i8x16.popcnt": ["UNARY", 315, null],
        "i8x16.ne": ["COMPARE", 253, null],
        "i8x16.relaxed_swizzle": ["BINARY", 453, null],
        "i8x16.relaxed_laneselect": ["TERNARY", 462, null],
        "i8x16.replace_lane": ["SIMDLANEOP", 240, null],
        "i8x16.shl": ["BINARY", 320, null],
        "i8x16.shr_s": ["BINARY", 321, null],
        "i8x16.shr_u": ["BINARY", 322, null],
        "i8x16.splat": ["UNARY", 232, null],
        "i8x16.sub_sat_s": ["BINARY", 327, null],
        "i8x16.sub_sat_u": ["BINARY", 328, null],
        "i8x16.sub": ["BINARY", 326, null],
        "i8x16": ["i8x16", null, null],
        "if": ["if", 4, null],
        "import": ["import", null, null],
        "input": ["input", null, null],
        "invoke": ["invoke", null, null],
        "item": ["item", null, null],
        "local.get": ["local.get", 25, null],
        "local.set": ["local.set", 26, null],
        "local.tee": ["local.tee", 27, null],
        "local": ["local", null, null],
        "loop": ["loop", 3, null],
        "memory.atomic.notify": ["ATOMIC_NOTIFY", 473, null],
        "memory.atomic.wait32": ["ATOMIC_WAIT", 474, null],
        "memory.atomic.wait64": ["ATOMIC_WAIT", 475, null],
        "memory.copy": ["memory.copy", 204, null],
        "memory.fill": ["memory.fill", 205, null],
        "memory.grow": ["memory.grow", 54, null],
        "memory.init": ["memory.init", 202, null],
        "memory.size": ["memory.size", 53, null],
        "memory": ["memory", null, null],
        "module": ["module", null, null],
        "mut": ["mut", null, null],
        "nan:arithmetic": ["nan:arithmetic", null, null],
        "nan:canonical": ["nan:canonical", null, null],
        "nop": ["nop", 1, null],
        "offset": ["offset", null, null],
        "output": ["output", null, null],
        "param": ["param", null, null],
        "ref": ["ref", null, null],
        "quote": ["quote", null, null],
        "ref.extern": ["ref.extern", null, null],
        "ref.func": ["ref.func", 216, null],
        "ref.is_null": ["ref.is_null", 215, null],
        "ref.null": ["ref.null", 214, null],
        "register": ["register", null, null],
        "result": ["result", null, null],
        "rethrow": ["rethrow", 9, null],
        "return_call_indirect": ["return_call_indirect", 18, null],
        "return_call": ["return_call", 17, null],
        "return": ["return", 14, null],
        "select": ["select", 23, null],
        "shared": ["shared", null, null],
        "start": ["start", null, null],
        "struct": ["struct", null, 11],
        "table.copy": ["table.copy", 208, null],
        "table.fill": ["table.full", 213, null],
        "table.get": ["table.get", 209, null],
        "table.grow": ["table.grow", 211, null],
        "table.init": ["table.init", 206, null],
        "table.set": ["table.set", 210, null],
        "table.size": ["table.size", 212, null],
        "table": ["table", null, null],
        "then": ["then", null, null],
        "throw": ["throw", 8, null],
        "try": ["try", 6, null],
        "type": ["type", null, null],
        "unreachable": ["unreachable", 0, null],
        "v128.andnot": ["BINARY", 296, null],
        "v128.and": ["BINARY", 295, null],
        "v128.bitselect": ["TERNARY", 299, null],
        "v128.const": ["CONST", 229, null],
        "v128.load": ["LOAD", 217, null],
        "v128.not": ["UNARY", 294, null],
        "v128.or": ["BINARY", 297, null],
        "v128.any_true": ["UNARY", 300, null],
        "v128.load32_zero": ["LOAD", 309, null],
        "v128.load64_zero": ["LOAD", 310, null],
        "v128.store": ["STORE", 228, null],
        "v128": ["VALUETYPE", null, 4],
        "v128.xor": ["BINARY", 298, null],
        "v128.load16_splat": ["LOAD", 225, null],
        "v128.load32_splat": ["LOAD", 226, null],
        "v128.load64_splat": ["LOAD", 227, null],
        "v128.load8_splat": ["LOAD", 224, null],
        "v128.load8_lane": ["SIMDLOADLANE", 301, null],
        "v128.load16_lane": ["SIMDLOADLANE", 302, null],
        "v128.load32_lane": ["SIMDLOADLANE", 303, null],
        "v128.load64_lane": ["SIMDLOADLANE", 304, null],
        "v128.store8_lane": ["SIMDSTORELANE", 305, null],
        "v128.store16_lane": ["SIMDSTORELANE", 306, null],
        "v128.store32_lane": ["SIMDSTORELANE", 307, null],
        "v128.store64_lane": ["SIMDSTORELANE", 308, null],
        "i8x16.shuffle": ["i8x16.shuffle", 230, null],
        "i8x16.swizzle": ["BINARY", 231, null]
      };
      function isKeyWord(str) {
        return (str in wordlist);
      }
      function getType(str) {
        return wordlist[str][2];
      }
      function getTokenType(str) {
        return wordlist[str][0];
      }
      function getOpcodeType(str) {
        return wordlist[str][1];
      }
      var kEof = "\0";
      function tokenize(program) {
        return new Lexer(program).getAllTokens();
      }
      function getSingleToken(token) {
        return new Lexer(token).getToken();
      }
      function isDigit(c) {
        assert(c.length === 1);
        return (/[0-9]/u).test(c);
      }
      function isHexDigit(c) {
        assert(c.length === 1);
        return (/[0-9a-f]/iu).test(c);
      }
      function isKeyword(c) {
        assert(c.length === 1);
        return (/[a-z]/u).test(c);
      }
      function isIdChar(c) {
        assert(c.length === 1);
        return (/[!-~]/u).test(c) && (/[^"(),;=[\]{}]/u).test(c);
      }
      var Lexer = class {
        constructor(source) {
          this.source = source;
          this.tokens = [];
          this.start = 0;
          this.cursor = 0;
          this.line = 0;
          this.col = 0;
          this.token_start = 0;
        }
        getAllTokens() {
          let tokens = [];
          while (true) {
            const token = this.getToken();
            if (token.type === "EOF") break;
            tokens.push(token);
          }
          return tokens;
        }
        getToken() {
          while (true) {
            this.token_start = this.cursor;
            switch (this.peekChar()) {
              case kEof:
                return this.bareToken("EOF");
              case "(":
                if (this.matchString("(;")) {
                  if (this.readBlockComment()) {
                    continue;
                  }
                  return this.bareToken("EOF");
                }
                if (this.matchString("(@")) {
                  this.getIdToken();
                  return this.textToken("Annotation", 2);
                }
                this.readChar();
                return this.bareToken("(");
                break;
              case ")":
                this.readChar();
                return this.bareToken(")");
              case ";":
                if (this.matchString(";;")) {
                  if (this.readLineComment()) {
                    continue;
                  }
                  return this.bareToken("EOF");
                }
                this.readChar();
                throw new Error("unexpected char");
                continue;
                break;
              case " ":
              case "	":
              case "\r":
              case "\n":
                this.readWhitespace();
                continue;
              case '"':
                return this.getStringToken();
              case "+":
              case "-":
                this.readChar();
                switch (this.peekChar()) {
                  case "i":
                    return this.getInfToken();
                  case "n":
                    return this.getNanToken();
                  case "0":
                    return this.matchString("0x") ? this.getHexNumberToken("INT") : this.getNumberToken("INT");
                  case "1":
                  case "2":
                  case "3":
                  case "4":
                  case "5":
                  case "6":
                  case "7":
                  case "8":
                  case "9":
                    return this.getNumberToken("INT");
                  default:
                    return this.getReservedToken();
                }
                break;
              case "0":
                return this.matchString("0x") ? this.getHexNumberToken("NAT") : this.getNumberToken("NAT");
              case "1":
              case "2":
              case "3":
              case "4":
              case "5":
              case "6":
              case "7":
              case "8":
              case "9":
                return this.getNumberToken("NAT");
              case "$":
                return this.getIdToken();
              case "a":
                return this.getNameEqNumToken("align=", "align=");
              case "i":
                return this.getInfToken();
              case "n":
                return this.getNanToken();
              case "o":
                return this.getNameEqNumToken("offset=", "offset=");
              default:
                if (isKeyword(this.peekChar())) {
                  return this.getKeywordToken();
                }
                if (isIdChar(this.peekChar())) {
                  return this.getReservedToken();
                }
                this.readChar();
                throw new Error("unexpected char");
                continue;
            }
          }
        }
        peekChar() {
          return this.cursor < this.source.length ? this.source[this.cursor] : kEof;
        }
        readChar() {
          return this.cursor < this.source.length ? this.source[this.cursor++] : kEof;
        }
        matchChar(c) {
          assert(c.length === 1);
          if (this.peekChar() === c) {
            this.readChar();
            return true;
          }
          return false;
        }
        matchString(s) {
          const saved_cursor = this.cursor;
          for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (this.readChar() !== c) {
              this.cursor = saved_cursor;
              return false;
            }
          }
          return true;
        }
        newline() {
          this.line++;
          this.cursor++;
          this.col = 0;
        }
        noTrailingReservedChars() {
          return this.readReservedChars() === 0;
        }
        readReservedChars() {
          let ret = 0;
          while (true) {
            let peek = this.peekChar();
            if (isIdChar(peek)) {
              this.readChar();
              if (ret === 0) {
                ret = 2;
              }
            } else if (peek === '"') {
              this.getStringToken();
              ret = 1;
            } else {
              break;
            }
          }
          return ret;
        }
        readBlockComment() {
          let nesting = 1;
          while (true) {
            switch (this.readChar()) {
              case kEof:
                throw new Error("EOF in block comment");
                return false;
              case ";":
                if (this.matchChar(")") && --nesting === 0) {
                  return true;
                }
                break;
              case "(":
                if (this.matchChar(";")) {
                  nesting++;
                }
                break;
              case "\n":
                this.newline();
                break;
            }
          }
        }
        readLineComment() {
          while (true) {
            switch (this.readChar()) {
              case kEof:
                return false;
              case "\n":
                this.newline();
                return true;
            }
          }
        }
        readWhitespace() {
          while (true) {
            switch (this.peekChar()) {
              case " ":
              case "	":
              case "\r":
                this.readChar();
                break;
              case "\n":
                this.readChar();
                this.newline();
                break;
              default:
                return;
            }
          }
        }
        readSign() {
          if (this.peekChar() === "+" || this.peekChar() === "-") {
            this.readChar();
          }
        }
        readNum() {
          if (isDigit(this.peekChar())) {
            this.readChar();
            return this.matchChar("_") || isDigit(this.peekChar()) ? this.readNum() : true;
          }
          return false;
        }
        readHexNum() {
          if (isHexDigit(this.peekChar())) {
            this.readChar();
            return this.matchChar("_") || isHexDigit(this.peekChar()) ? this.readHexNum() : true;
          }
          return false;
        }
        bareToken(token_type) {
          return new Token(token_type, this.getText(), this.line, this.col, this.cursor);
        }
        literalToken(token_type, literal_type) {
          return new Token(token_type, this.getText(), this.line, this.col, this.cursor);
        }
        textToken(token_type, offset = 0) {
          return new Token(token_type, this.getText(offset), this.line, this.col, this.cursor);
        }
        getText(offset = 0) {
          return this.source.slice(this.token_start + offset, this.cursor);
        }
        getReservedToken() {
          this.readReservedChars();
          assert(false);
          return this.textToken("Reserved");
        }
        getStringToken() {
          const saved_token_start = this.token_start;
          let has_error = false;
          let in_string = true;
          this.readChar();
          while (in_string) {
            switch (this.readChar()) {
              case kEof:
                return this.bareToken("EOF");
              case "\n":
                this.token_start = this.cursor - 1;
                throw new Error("newline in string");
                has_error = true;
                this.newline();
                continue;
              case '"':
                if (this.peekChar() === '"') {
                  throw new Error("invalid string token");
                  has_error = true;
                }
                in_string = false;
                break;
              case "\\":
                {
                  switch (this.readChar()) {
                    case "t":
                    case "n":
                    case "r":
                    case '"':
                    case "'":
                    case "\\":
                      break;
                    case "0":
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                    case "a":
                    case "b":
                    case "c":
                    case "d":
                    case "e":
                    case "f":
                    case "A":
                    case "B":
                    case "C":
                    case "D":
                    case "E":
                    case "F":
                      if (isHexDigit(this.peekChar())) {
                        this.readChar();
                      } else {
                        this.token_start = this.cursor - 2;
                        throw new Error(`bad escape "%.*s"${this.getText}`);
                        has_error = true;
                      }
                      break;
                    case "u":
                      {
                        this.token_start = this.cursor - 2;
                        if (this.readChar() !== "{") {
                          throw new Error(`bad escape "%.*s"${this.getText}`);
                          has_error = true;
                        }
                        let digit;
                        let scalar_value = 0;
                        while (isHexDigit(this.peekChar())) {
                          digit = parseHexdigit(this.source[this.cursor++]);
                          scalar_value = scalar_value << 4 | digit;
                          if (scalar_value >= 1114112) {
                            throw new Error(`bad escape "%.*s"${this.getText}`);
                            has_error = true;
                          }
                        }
                        if (this.peekChar() !== "}") {
                          throw new Error(`bad escape "%.*s"${this.getText}`);
                          has_error = true;
                        }
                        if (scalar_value >= 55296 && scalar_value < 57344 || this.token_start === this.cursor - 3) {
                          this.readChar();
                          throw new Error(`bad escape "%.*s"${this.getText}`);
                          has_error = true;
                        }
                        break;
                      }
                    default:
                      this.token_start = this.cursor - 2;
                      throw new Error(`bad escape "%.*s"${this.getText}`);
                      has_error = true;
                  }
                  break;
                }
            }
          }
          this.token_start = saved_token_start;
          if (has_error) {
            return new Token("Invalid", this.getText(), this.line, this.col, this.cursor);
          }
          return this.textToken("TEXT");
        }
        getNumberToken(token_type) {
          if (this.readNum()) {
            if (this.matchChar(".")) {
              token_type = "FLOAT";
              if (isDigit(this.peekChar()) && !this.readNum()) {
                return this.getReservedToken();
              }
            }
            if (this.matchChar("e") || this.matchChar("E")) {
              token_type = "FLOAT";
              this.readSign();
              if (!this.readNum()) {
                return this.getReservedToken();
              }
            }
            if (this.noTrailingReservedChars()) {
              if (token_type === "FLOAT") {
                return this.literalToken(token_type, 1);
              }
              return this.literalToken(token_type, 0);
            }
          }
          return this.getReservedToken();
        }
        getHexNumberToken(token_type) {
          if (this.readHexNum()) {
            if (this.matchChar(".")) {
              token_type = "FLOAT";
              if (isHexDigit(this.peekChar()) && !this.readHexNum()) {
                return this.getReservedToken();
              }
            }
            if (this.matchChar("p") || this.matchChar("P")) {
              token_type = "FLOAT";
              this.readSign();
              if (!this.readNum()) {
                return this.getReservedToken();
              }
            }
            if (this.noTrailingReservedChars()) {
              if (token_type === "FLOAT") {
                return this.literalToken(token_type, 2);
              }
              return this.literalToken(token_type, 0);
            }
          }
          return this.getReservedToken();
        }
        getInfToken() {
          if (this.matchString("inf")) {
            if (this.noTrailingReservedChars()) {
              return this.literalToken("FLOAT", 3);
            }
            return this.getReservedToken();
          }
          return this.getKeywordToken();
        }
        getNanToken() {
          if (this.matchString("nan")) {
            if (this.matchChar(":")) {
              if (this.matchString("0x") && this.readHexNum() && this.noTrailingReservedChars()) {
                return this.literalToken("FLOAT", 4);
              }
            } else if (this.noTrailingReservedChars()) {
              return this.literalToken("FLOAT", 4);
            }
          }
          return this.getKeywordToken();
        }
        getNameEqNumToken(name, token_type) {
          if (this.matchString(name)) {
            if (this.matchString("0x")) {
              if (this.readHexNum() && this.noTrailingReservedChars()) {
                return this.textToken(token_type, name.length);
              }
            } else if (this.readNum() && this.noTrailingReservedChars()) {
              return this.textToken(token_type, name.length);
            }
          }
          return this.getKeywordToken();
        }
        getIdToken() {
          this.readChar();
          if (this.readReservedChars() === 2) {
            return this.textToken("VAR");
          }
          return this.textToken("Reserved");
        }
        getKeywordToken() {
          this.readReservedChars();
          const text = this.getText();
          if (!isKeyWord(text)) {
            return this.textToken("Reserved");
          }
          const tokenType = getTokenType(text);
          const valueType = getType(text);
          const opcodeType = getOpcodeType(text);
          if (isTokenTypeBare(tokenType)) {
            return this.bareToken(tokenType);
          }
          if (isTokenTypeType(tokenType) || isTokenTypeRefKind(tokenType)) {
            return new Token(tokenType, text, this.line, this.col, this.cursor, null, valueType);
          }
          assert(isTokenTypeOpcode(tokenType));
          return new Token(tokenType, text, this.line, this.col, this.cursor, opcodeType);
        }
      };
      function getParseTree(tokenList) {
        if (tokenList[0].type === "(") {
          tokenList = tokenList.slice(1);
        }
        return new Parser(tokenList).getGrouping();
      }
      var Parser = class {
        constructor(tokens) {
          this.cursor = 0;
          this.tokens = tokens;
        }
        peek() {
          return this.tokens[this.cursor];
        }
        read() {
          return this.tokens[this.cursor++];
        }
        peekOffset(i) {
          assert(this.cursor + i >= 0 && this.cursor + i < this.tokens.length);
          return this.tokens[this.cursor + i];
        }
        isEof() {
          return this.cursor >= this.tokens.length;
        }
        getGrouping() {
          const tree = [];
          while (!this.isEof()) {
            const token = this.read();
            if (token.type === "(") {
              tree.push(this.getGrouping());
            } else if (token.type === ")") {
              return tree;
            } else {
              tree.push(token);
            }
          }
          return tree;
        }
      };
      var parse = program => getParseTree(tokenize(program));
      var compile2 = parseTree => {
        const ir = getIR(parseTree);
        const binaryWriter = new BinaryWriter(ir);
        return binaryWriter.encode();
      };
      var compile22 = program => compile2(parse(program));
      var getStringParseTree = program => ParseTree.getStringArrayRepr(parse(program));
      var compileParseTree = tree => {
        if (!(tree instanceof ParseTree)) {
          tree = Tree.treeMap(tree, getSingleToken);
        }
        return compile2(tree);
      };
    }
  });
  var require_source_academy_utils = __commonJS({
    "node_modules/source-academy-utils/index.js"(exports, module) {
      init_define_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export2 = (target, all) => {
        for (var name in all) __defProp2(target, name, {
          get: all[name],
          enumerable: true
        });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
            get: () => from[key],
            enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
          });
        }
        return to;
      };
      var __toCommonJS2 = mod => __copyProps2(__defProp2({}, "__esModule", {
        value: true
      }), mod);
      var src_exports = {};
      __export2(src_exports, {
        linkedListToObject: () => linkedListToObject,
        objectToLinkedList: () => objectToLinkedList2
      });
      module.exports = __toCommonJS2(src_exports);
      function objectToLinkedList2(object) {
        let result = null;
        for (const key in object) {
          result = [key, [object[key], result]];
        }
        return result;
      }
      function linkedListToObject(list) {
        let result = {};
        while (list !== null) {
          let key, value;
          key = list[0];
          value = list[1][0];
          list = list[1][1];
          result[key] = value;
        }
        return result;
      }
    }
  });
  var wasm_exports = {};
  __export(wasm_exports, {
    wcompile: () => wcompile,
    wrun: () => wrun
  });
  init_define_process();
  init_define_process();
  var import_source_academy_wabt = __toESM(require_source_academy_wabt(), 1);
  var import_source_academy_utils = __toESM(require_source_academy_utils(), 1);
  var wcompile = program => Array.from((0, import_source_academy_wabt.compile)(program));
  var wrun = buffer => {
    if (buffer instanceof Array) {
      buffer = new Uint8Array(buffer);
    }
    const exps = new WebAssembly.Instance(new WebAssembly.Module(buffer)).exports;
    return (0, import_source_academy_utils.objectToLinkedList)(exps);
  };
  return __toCommonJS(wasm_exports);
}