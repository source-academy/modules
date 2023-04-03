require => (() => {
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
  var Game_exports = {};
  __export(Game_exports, {
    default: () => Game_default
  });
  var import_react = __toESM(__require("react"), 1);
  var import_jsx_runtime = __require("react/jsx-runtime");
  var Game = class extends import_react.default.PureComponent {
    render() {
      return (0, import_jsx_runtime.jsxs)("div", {
        children: ["Info: You need to visit the game to see the effect of your program. Remember to save your work first!", (0, import_jsx_runtime.jsx)("br", {}), (0, import_jsx_runtime.jsx)("br", {}), "You may find the game module", " ", (0, import_jsx_runtime.jsxs)("a", {
          href: "https://source-academy.github.io/modules/documentation/modules/game.html",
          rel: "noopener noreferrer",
          target: "_blank",
          children: ["documentation", " "]
        }), "and", " ", (0, import_jsx_runtime.jsxs)("a", {
          href: "https://github.com/source-academy/modules/wiki/%5Bgame%5D-User-Guide",
          rel: "noopener noreferrer",
          target: "_blank",
          children: ["user guide", " "]
        }), "useful."]
      });
    }
  };
  var Game_default = {
    toSpawn: () => true,
    body: debuggerContext => (0, import_jsx_runtime.jsx)(Game, {
      debuggerContext
    }),
    label: "Game Info Tab",
    iconName: "info-sign"
  };
  return __toCommonJS(Game_exports);
})()["default"]