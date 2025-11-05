export default require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function (x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return (fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res);
  };
  var __commonJS = (cb, mod) => function __require2() {
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
  var init_define_process = __esm({
    "<define:process>"() {}
  });
  var require_baseClamp = __commonJS({
    "../../../node_modules/lodash/_baseClamp.js"(exports, module) {
      "use strict";
      init_define_process();
      function baseClamp(number, lower, upper) {
        if (number === number) {
          if (upper !== void 0) {
            number = number <= upper ? number : upper;
          }
          if (lower !== void 0) {
            number = number >= lower ? number : lower;
          }
        }
        return number;
      }
      module.exports = baseClamp;
    }
  });
  var require_trimmedEndIndex = __commonJS({
    "../../../node_modules/lodash/_trimmedEndIndex.js"(exports, module) {
      "use strict";
      init_define_process();
      var reWhitespace = /\s/;
      function trimmedEndIndex(string) {
        var index = string.length;
        while (index-- && reWhitespace.test(string.charAt(index))) {}
        return index;
      }
      module.exports = trimmedEndIndex;
    }
  });
  var require_baseTrim = __commonJS({
    "../../../node_modules/lodash/_baseTrim.js"(exports, module) {
      "use strict";
      init_define_process();
      var trimmedEndIndex = require_trimmedEndIndex();
      var reTrimStart = /^\s+/;
      function baseTrim(string) {
        return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
      }
      module.exports = baseTrim;
    }
  });
  var require_isObject = __commonJS({
    "../../../node_modules/lodash/isObject.js"(exports, module) {
      "use strict";
      init_define_process();
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      module.exports = isObject;
    }
  });
  var require_freeGlobal = __commonJS({
    "../../../node_modules/lodash/_freeGlobal.js"(exports, module) {
      "use strict";
      init_define_process();
      var freeGlobal = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis;
      module.exports = freeGlobal;
    }
  });
  var require_root = __commonJS({
    "../../../node_modules/lodash/_root.js"(exports, module) {
      "use strict";
      init_define_process();
      var freeGlobal = require_freeGlobal();
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      module.exports = root;
    }
  });
  var require_Symbol = __commonJS({
    "../../../node_modules/lodash/_Symbol.js"(exports, module) {
      "use strict";
      init_define_process();
      var root = require_root();
      var Symbol2 = root.Symbol;
      module.exports = Symbol2;
    }
  });
  var require_getRawTag = __commonJS({
    "../../../node_modules/lodash/_getRawTag.js"(exports, module) {
      "use strict";
      init_define_process();
      var Symbol2 = require_Symbol();
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var nativeObjectToString = objectProto.toString;
      var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
      function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
        try {
          value[symToStringTag] = void 0;
          var unmasked = true;
        } catch (e) {}
        var result = nativeObjectToString.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag] = tag;
          } else {
            delete value[symToStringTag];
          }
        }
        return result;
      }
      module.exports = getRawTag;
    }
  });
  var require_objectToString = __commonJS({
    "../../../node_modules/lodash/_objectToString.js"(exports, module) {
      "use strict";
      init_define_process();
      var objectProto = Object.prototype;
      var nativeObjectToString = objectProto.toString;
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }
      module.exports = objectToString;
    }
  });
  var require_baseGetTag = __commonJS({
    "../../../node_modules/lodash/_baseGetTag.js"(exports, module) {
      "use strict";
      init_define_process();
      var Symbol2 = require_Symbol();
      var getRawTag = require_getRawTag();
      var objectToString = require_objectToString();
      var nullTag = "[object Null]";
      var undefinedTag = "[object Undefined]";
      var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
      function baseGetTag(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag : nullTag;
        }
        return symToStringTag && (symToStringTag in Object(value)) ? getRawTag(value) : objectToString(value);
      }
      module.exports = baseGetTag;
    }
  });
  var require_isObjectLike = __commonJS({
    "../../../node_modules/lodash/isObjectLike.js"(exports, module) {
      "use strict";
      init_define_process();
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      module.exports = isObjectLike;
    }
  });
  var require_isSymbol = __commonJS({
    "../../../node_modules/lodash/isSymbol.js"(exports, module) {
      "use strict";
      init_define_process();
      var baseGetTag = require_baseGetTag();
      var isObjectLike = require_isObjectLike();
      var symbolTag = "[object Symbol]";
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
      }
      module.exports = isSymbol;
    }
  });
  var require_toNumber = __commonJS({
    "../../../node_modules/lodash/toNumber.js"(exports, module) {
      "use strict";
      init_define_process();
      var baseTrim = require_baseTrim();
      var isObject = require_isObject();
      var isSymbol = require_isSymbol();
      var NAN = 0 / 0;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsOctal = /^0o[0-7]+$/i;
      var freeParseInt = parseInt;
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
      module.exports = toNumber;
    }
  });
  var require_clamp = __commonJS({
    "../../../node_modules/lodash/clamp.js"(exports, module) {
      "use strict";
      init_define_process();
      var baseClamp = require_baseClamp();
      var toNumber = require_toNumber();
      function clamp2(number, lower, upper) {
        if (upper === void 0) {
          upper = lower;
          lower = void 0;
        }
        if (upper !== void 0) {
          upper = toNumber(upper);
          upper = upper === upper ? upper : 0;
        }
        if (lower !== void 0) {
          lower = toNumber(lower);
          lower = lower === lower ? lower : 0;
        }
        return baseClamp(toNumber(number), lower, upper);
      }
      module.exports = clamp2;
    }
  });
  var index_exports = {};
  __export(index_exports, {
    default: () => index_default
  });
  init_define_process();
  init_define_process();
  var import_jsx_runtime = __require("react/jsx-runtime");
  var import_core = __require("@blueprintjs/core");
  var import_icons = __require("@blueprintjs/icons");
  var import_clamp = __toESM(require_clamp(), 1);
  var import_react = __require("react");
  function MultiItemDisplay(props) {
    const [currentStep, setCurrentStep] = (0, import_react.useState)(0);
    function changeStep(newIndex) {
      setCurrentStep(newIndex);
      if (props.onStepChange) {
        props.onStepChange(newIndex, currentStep);
      }
    }
    const [stepEditorValue, setStepEditorValue] = (0, import_react.useState)("1");
    const [stepEditorFocused, setStepEditorFocused] = (0, import_react.useState)(false);
    const resetStepEditor = () => setStepEditorValue((currentStep + 1).toString());
    const elementsDigitCount = Math.floor(Math.log10(Math.max(1, props.elements.length))) + 1;
    return (0, import_jsx_runtime.jsxs)("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        height: "100vh"
      },
      children: [(0, import_jsx_runtime.jsxs)("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          position: "relative",
          marginBottom: 10
        },
        children: [(0, import_jsx_runtime.jsx)(import_core.Button, {
          style: {
            position: "absolute",
            left: 0
          },
          tabIndex: 0,
          large: true,
          outlined: true,
          icon: import_icons.IconNames.ARROW_LEFT,
          onClick: () => {
            changeStep(currentStep - 1);
            setStepEditorValue(currentStep.toString());
          },
          disabled: currentStep === 0,
          children: "Previous"
        }), (0, import_jsx_runtime.jsx)("h3", {
          className: "bp3-text-large",
          children: (0, import_jsx_runtime.jsxs)("div", {
            style: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around"
            },
            children: ["Call\xA0", (0, import_jsx_runtime.jsx)("div", {
              style: {
                width: `${stepEditorFocused ? elementsDigitCount + 2 : elementsDigitCount}ch`
              },
              children: (0, import_jsx_runtime.jsx)(import_core.EditableText, {
                value: stepEditorValue,
                disabled: props.elements.length === 1,
                placeholder: void 0,
                selectAllOnFocus: true,
                customInputAttributes: {
                  tabIndex: 0
                },
                onChange: newValue => {
                  if (newValue && !(/^[0-9]+$/u).test(newValue)) return;
                  if (newValue.length > elementsDigitCount) return;
                  setStepEditorValue(newValue);
                },
                onConfirm: value => {
                  if (value) {
                    const newStep = parseInt(value);
                    const clampedStep = (0, import_clamp.default)(newStep, 1, props.elements.length);
                    if (clampedStep - 1 !== currentStep) {
                      changeStep(clampedStep - 1);
                    }
                    setStepEditorFocused(false);
                    setStepEditorValue(clampedStep.toString());
                    return;
                  }
                  resetStepEditor();
                  setStepEditorFocused(false);
                },
                onCancel: () => {
                  resetStepEditor();
                  setStepEditorFocused(false);
                },
                onEdit: () => setStepEditorFocused(true)
              })
            }), stepEditorFocused && (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {
              children: "\xA0"
            }), "/", props.elements.length]
          })
        }), (0, import_jsx_runtime.jsx)(import_core.Button, {
          style: {
            position: "absolute",
            right: 0
          },
          large: true,
          outlined: true,
          icon: import_icons.IconNames.ARROW_RIGHT,
          tabIndex: 0,
          onClick: () => {
            changeStep(currentStep + 1);
            setStepEditorValue((currentStep + 2).toString());
          },
          disabled: currentStep === props.elements.length - 1,
          children: "Next"
        })]
      }), (0, import_jsx_runtime.jsx)("div", {
        style: {
          width: "100%",
          paddingLeft: "20px",
          paddingRight: "20px",
          display: "flex",
          alignContent: "center",
          justifyContent: "center"
        },
        children: props.elements[currentStep]
      })]
    });
  }
  init_define_process();
  function getModuleState(debuggerContext, name) {
    return debuggerContext.context.moduleContexts[name].state;
  }
  function defineTab(tab) {
    return tab;
  }
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var SoundTab = ({context}) => {
    const {audioPlayed} = getModuleState(context, "sound");
    const elements = audioPlayed.map(audio => (0, import_jsx_runtime2.jsx)("audio", {
      src: audio.dataUri,
      controls: true,
      id: "sound-tab-player",
      style: {
        width: "100%"
      }
    }));
    return (0, import_jsx_runtime2.jsxs)("div", {
      children: [(0, import_jsx_runtime2.jsx)("p", {
        id: "sound-default-text",
        children: "The sound tab gives you control over your custom sounds. You can play, pause, adjust the volume and download your sounds."
      }), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsx)(MultiItemDisplay, {
        elements
      }), (0, import_jsx_runtime2.jsx)("br", {})]
    });
  };
  var index_default = defineTab({
    toSpawn(context) {
      var _a, _b, _c, _d;
      const audioPlayed = (_d = (_c = (_b = (_a = context.context) == null ? void 0 : _a.moduleContexts) == null ? void 0 : _b.sound) == null ? void 0 : _c.state) == null ? void 0 : _d.audioPlayed;
      return audioPlayed.length > 0;
    },
    body(context) {
      return (0, import_jsx_runtime2.jsx)(SoundTab, {
        context
      });
    },
    label: "Sounds",
    iconName: "music"
  });
  return __toCommonJS(index_exports);
};