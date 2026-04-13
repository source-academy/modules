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
    default: () => index_default
  });
  function getModuleState(debuggerContext, name) {
    const {context: {moduleContexts}} = debuggerContext;
    return (name in moduleContexts) ? moduleContexts[name].state : null;
  }
  function defineTab(tab) {
    return tab;
  }
  function partition(arr, isInTruthy) {
    const truthy = [];
    const falsy = [];
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (isInTruthy(item, i, arr)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    }
    return [truthy, falsy];
  }
  var import_jsx_runtime = __require("react/jsx-runtime");
  var colfixed = {
    border: "1px solid gray",
    overflow: "hidden",
    width: 200
  };
  var colauto = {
    border: "1px solid gray",
    overflow: "hidden",
    width: "auto"
  };
  function suiteResultToDiv(suiteResult) {
    const {name, results, runtime, passCount} = suiteResult;
    const [suiteResults, testResults] = partition(results, each => ("results" in each));
    const testsPassed = testResults.filter(each => each.passed);
    const testResultsTable = (0, import_jsx_runtime.jsxs)("details", {
      children: [(0, import_jsx_runtime.jsxs)("summary", {
        children: [(0, import_jsx_runtime.jsx)("strong", {
          children: "Test Cases"
        }), " Passed ", testsPassed.length, "/", testResults.length]
      }), (0, import_jsx_runtime.jsxs)("table", {
        style: {
          width: "100%",
          tableLayout: "fixed"
        },
        children: [(0, import_jsx_runtime.jsx)("thead", {
          children: (0, import_jsx_runtime.jsxs)("tr", {
            children: [(0, import_jsx_runtime.jsx)("th", {
              style: colfixed,
              children: "Test Cases"
            }), (0, import_jsx_runtime.jsx)("th", {
              style: colauto,
              children: "Messages"
            })]
          })
        }), (0, import_jsx_runtime.jsx)("tbody", {
          children: testResults.map(each => {
            if (each.passed) {
              return (0, import_jsx_runtime.jsxs)("tr", {
                children: [(0, import_jsx_runtime.jsx)("td", {
                  style: colfixed,
                  children: each.name
                }), (0, import_jsx_runtime.jsx)("td", {
                  style: colauto,
                  children: "'Passed.'"
                })]
              });
            } else {
              return (0, import_jsx_runtime.jsxs)("tr", {
                children: [(0, import_jsx_runtime.jsx)("td", {
                  style: colfixed,
                  children: each.name
                }), (0, import_jsx_runtime.jsxs)("td", {
                  style: colauto,
                  children: ["'", each.error, "'"]
                })]
              });
            }
          })
        })]
      })]
    });
    const suitesPassed = suiteResults.filter(each => each.passed);
    const suiteResultList = (0, import_jsx_runtime.jsxs)("details", {
      children: [(0, import_jsx_runtime.jsxs)("summary", {
        children: [(0, import_jsx_runtime.jsx)("strong", {
          children: "Test Suites"
        }), " Passed all ", suitesPassed.length, "/", suiteResults.length]
      }), (0, import_jsx_runtime.jsx)("ol", {
        children: suiteResults.map(each => (0, import_jsx_runtime.jsx)("li", {
          children: suiteResultToDiv(each)
        }))
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
      }), results.length > 0 ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
        children: [(0, import_jsx_runtime.jsxs)("p", {
          children: ["Passed ", passCount, "/", results.length, " in ", runtime.toFixed(2), "ms"]
        }), testResults.length > 0 && testResultsTable, suiteResults.length > 0 && suiteResultList]
      }) : (0, import_jsx_runtime.jsx)("p", {
        children: "This test suite did not contain any tests/suites"
      })]
    }, name);
  }
  function TestSuitesTab({results}) {
    return (0, import_jsx_runtime.jsxs)("div", {
      children: [(0, import_jsx_runtime.jsx)("h1", {
        children: "Test Report"
      }), (0, import_jsx_runtime.jsx)("ol", {
        children: results.map(each => {
          return (0, import_jsx_runtime.jsx)("li", {
            children: suiteResultToDiv(each)
          });
        })
      })]
    });
  }
  var index_default = defineTab({
    toSpawn: context => {
      const moduleState = getModuleState(context, "unittest");
      return !!moduleState && moduleState.suiteResults.length > 0;
    },
    body: context => {
      const moduleContext = getModuleState(context, "unittest");
      return (0, import_jsx_runtime.jsx)(TestSuitesTab, {
        results: moduleContext.suiteResults
      });
    },
    label: "Test suites",
    iconName: "lab-test"
  });
  return __toCommonJS(index_exports);
};