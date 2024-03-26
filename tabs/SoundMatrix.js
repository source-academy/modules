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
  var require_classnames = __commonJS({
    "node_modules/classnames/index.js"(exports, module) {
      "use strict";
      init_define_process();
      (function () {
        "use strict";
        var hasOwn = ({}).hasOwnProperty;
        var nativeCodeString = "[native code]";
        function classNames2() {
          var classes = [];
          for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (!arg) continue;
            var argType = typeof arg;
            if (argType === "string" || argType === "number") {
              classes.push(arg);
            } else if (Array.isArray(arg)) {
              if (arg.length) {
                var inner = classNames2.apply(null, arg);
                if (inner) {
                  classes.push(inner);
                }
              }
            } else if (argType === "object") {
              if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
                classes.push(arg.toString());
                continue;
              }
              for (var key in arg) {
                if (hasOwn.call(arg, key) && arg[key]) {
                  classes.push(key);
                }
              }
            }
          }
          return classes.join(" ");
        }
        if (typeof module !== "undefined" && module.exports) {
          classNames2.default = classNames2;
          module.exports = classNames2;
        } else if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
          define("classnames", [], function () {
            return classNames2;
          });
        } else {
          window.classNames = classNames2;
        }
      })();
    }
  });
  var SoundMatrix_exports = {};
  __export(SoundMatrix_exports, {
    default: () => SoundMatrix_default
  });
  init_define_process();
  var import_core = __require("@blueprintjs/core");
  var import_classnames = __toESM(require_classnames(), 1);
  var import_react = __toESM(__require("react"), 1);
  var import_jsx_runtime = __require("react/jsx-runtime");
  var SoundMatrix = class extends import_react.default.Component {
    constructor(props) {
      super(props);
      this.$container = null;
      this.handleClear = () => {
        window.ToneMatrix.clear_matrix();
      };
      this.handleRandomise = () => {
        window.ToneMatrix.randomise_matrix();
      };
      this.state = {};
    }
    componentDidMount() {
      if (window.ToneMatrix) {
        window.ToneMatrix.initialise_matrix(this.$container);
      }
    }
    shouldComponentUpdate() {
      return false;
    }
    render() {
      return (0, import_jsx_runtime.jsxs)("div", {
        className: "sa-tone-matrix",
        children: [(0, import_jsx_runtime.jsx)("div", {
          className: "row",
          children: (0, import_jsx_runtime.jsxs)("div", {
            className: (0, import_classnames.default)("controls", "col-xs-12", import_core.Classes.DARK, import_core.Classes.BUTTON_GROUP),
            children: [(0, import_jsx_runtime.jsx)(import_core.Button, {
              id: "clear-matrix",
              onClick: this.handleClear,
              children: "Clear"
            }), (0, import_jsx_runtime.jsx)(import_core.Button, {
              id: "randomise-matrix",
              onClick: this.handleRandomise,
              children: "Randomise"
            })]
          })
        }), (0, import_jsx_runtime.jsx)("div", {
          className: "row",
          children: (0, import_jsx_runtime.jsx)("div", {
            className: "col-xs-12",
            ref: r => {
              this.$container = r;
            }
          })
        })]
      });
    }
  };
  var SoundMatrix_default = {
    toSpawn: context => context.result.value === "test",
    body: context => (0, import_jsx_runtime.jsx)(SoundMatrix, {
      context
    }),
    label: "Sound Matrix",
    iconName: "music"
  };
  return __toCommonJS(SoundMatrix_exports);
};