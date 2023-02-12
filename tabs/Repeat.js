(function (_react, ReactDOM) {
  function require(x) {
    const result = ({
      "react": _react,
      "react-dom": ReactDOM
    })[x];
    if (result === undefined) throw new Error(`Internal Error: Unknown import "${x}"!`); else return result;
  }
  return (() => {
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
      throw new Error('Dynamic require of "' + x + '" is not supported');
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
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
      value: mod,
      enumerable: true
    }) : target, mod));
    var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
      value: true
    }), mod);
    var Repeat_exports = {};
    __export(Repeat_exports, {
      default: () => Repeat_default
    });
    var import_react = __toESM(__require("react"), 1);
    var Repeat = class extends import_react.default.PureComponent {
      render() {
        return import_react.default.createElement("div", null, "This is spawned from the repeat package");
      }
    };
    var Repeat_default = {
      toSpawn: () => true,
      body: debuggerContext => import_react.default.createElement(Repeat, {
        debuggerContext
      }),
      label: "Repeat Test Tab",
      iconName: "build"
    };
    return __toCommonJS(Repeat_exports);
  })()["default"];
})