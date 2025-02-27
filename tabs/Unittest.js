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
  var Unittest_exports = {};
  __export(Unittest_exports, {
    default: () => Unittest_default
  });
  var import_react = __toESM(__require("react"), 1);
  var getModuleState = ({context: {moduleContexts}}, moduleName) => moduleContexts[moduleName].state;
  var import_jsx_runtime = __require("react/jsx-runtime");
  function suiteResultToDiv(suiteResult) {
    const {name, results, total, passed} = suiteResult;
    if (results.length === 0) {
      return (0, import_jsx_runtime.jsx)("div", {
        children: "Your test suite did not contain any tests!"
      });
    }
    const colfixed = {
      border: "1px solid gray",
      overflow: "hidden",
      width: 200
    };
    const colauto = {
      border: "1px solid gray",
      overflow: "hidden",
      width: "auto"
    };
    const rows = results.map(({name: testname, error}, index) => (0, import_jsx_runtime.jsxs)("tr", {
      children: [(0, import_jsx_runtime.jsx)("td", {
        style: colfixed,
        children: testname
      }), (0, import_jsx_runtime.jsx)("td", {
        style: colauto,
        children: error || "Passed."
      })]
    }, index));
    const tablestyle = {
      "table-layout": "fixed",
      width: "100%"
    };
    const table = (0, import_jsx_runtime.jsxs)("table", {
      style: tablestyle,
      children: [(0, import_jsx_runtime.jsx)("thead", {
        children: (0, import_jsx_runtime.jsxs)("tr", {
          children: [(0, import_jsx_runtime.jsx)("th", {
            style: colfixed,
            children: "Test case"
          }), (0, import_jsx_runtime.jsx)("th", {
            style: colauto,
            children: "Messages"
          })]
        })
      }), (0, import_jsx_runtime.jsx)("tbody", {
        children: rows
      })]
    });
    const suitestyle = {
      border: "1px solid white",
      padding: 5,
      margin: 5
    };
    return (0, import_jsx_runtime.jsxs)("div", {
      style: suitestyle,
      children: [(0, import_jsx_runtime.jsx)("p", {
        children: (0, import_jsx_runtime.jsx)("strong", {
          children: name
        })
      }), (0, import_jsx_runtime.jsxs)("p", {
        children: ["Passed testcases: ", passed, "/", total]
      }), table]
    }, name);
  }
  var TestSuitesTab = class extends import_react.default.PureComponent {
    render() {
      const {context: {suiteResults, called}} = this.props;
      if (!called) {
        return (0, import_jsx_runtime.jsxs)("div", {
          children: ["Call ", (0, import_jsx_runtime.jsx)("code", {
            children: "describe"
          }), " at least once to be able to view the results of your tests"]
        });
      }
      const block = suiteResultToDiv(suiteResults);
      return (0, import_jsx_runtime.jsxs)("div", {
        children: [(0, import_jsx_runtime.jsx)("p", {
          children: "The following is a report of your tests."
        }), block]
      });
    }
  };
  var Unittest_default = {
    toSpawn: _context => true,
    body: context => {
      const moduleContext = getModuleState(context, "unittest");
      return (0, import_jsx_runtime.jsx)(TestSuitesTab, {
        context: moduleContext
      });
    },
    label: "Test suites",
    iconName: "lab-test"
  };
  return __toCommonJS(Unittest_exports);
};