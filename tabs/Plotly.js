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
    Plotly: () => Plotly,
    default: () => index_default
  });
  var import_jsx_runtime = __require("react/jsx-runtime");
  var containerStyle = {
    position: "fixed",
    zIndex: 999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: "auto",
    padding: "0.5rem",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    borderRadius: "5px",
    backgroundColor: "rgb(199, 196, 196)"
  };
  var bodyStyle = {
    backgroundColor: "#fffafa",
    border: "2px solid black",
    borderRadius: "5px",
    boxShadow: "0px 0px 5px inset gray",
    height: "100%",
    overflowY: "auto",
    padding: "0.75rem"
  };
  var backdropStyle = {
    position: "fixed",
    zIndex: 90,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    filter: "blur(10px)"
  };
  var Modal = ({open, height, width, children, handleClose}) => (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {
    children: open && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
      children: [(0, import_jsx_runtime.jsx)("div", {
        style: Object.assign({
          height,
          width
        }, containerStyle),
        children: (0, import_jsx_runtime.jsx)("div", {
          style: bodyStyle,
          children
        })
      }), (0, import_jsx_runtime.jsx)("div", {
        style: backdropStyle,
        onClick: handleClose
      })]
    })
  });
  var ModalDiv_default = Modal;
  function defineTab(tab) {
    return tab;
  }
  var import_react = __require("react");
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var Plotly = ({context}) => {
    const [selectedPlot, setSelectedPlot] = (0, import_react.useState)(null);
    const {context: {moduleContexts: {plotly: {state: {drawnPlots}}}}} = context;
    return (0, import_jsx_runtime2.jsxs)("div", {
      children: [(0, import_jsx_runtime2.jsx)(ModalDiv_default, {
        open: selectedPlot !== null,
        height: "90vh",
        width: "80vw",
        handleClose: () => setSelectedPlot(null),
        children: (0, import_jsx_runtime2.jsx)("div", {
          id: "modalDiv",
          ref: () => {
            if (selectedPlot) {
              selectedPlot.draw("modalDiv");
            }
          },
          style: {
            height: "80vh"
          }
        })
      }), drawnPlots.map((drawnPlot, id) => {
        const divId = `plotDiv${id}`;
        return (0, import_jsx_runtime2.jsxs)("div", {
          style: {
            height: "80vh",
            marginBottom: "5vh"
          },
          children: [(0, import_jsx_runtime2.jsx)("div", {
            onClick: () => setSelectedPlot(drawnPlot),
            style: {
              cursor: "pointer",
              padding: "5px 10px",
              backgroundColor: "#474F5E",
              border: "1px solid #aaa",
              borderRadius: "4px",
              display: "inline-block"
            },
            children: "Popout plot"
          }), (0, import_jsx_runtime2.jsx)("div", {
            id: divId,
            style: {
              height: "80vh"
            },
            ref: () => {
              drawnPlot.draw(divId);
            }
          })]
        }, divId);
      })]
    });
  };
  var index_default = defineTab({
    toSpawn(context) {
      var _a, _b;
      const drawnPlots = (_b = (_a = context.context) == null ? void 0 : _a.moduleContexts) == null ? void 0 : _b.plotly.state.drawnPlots;
      return drawnPlots.length > 0;
    },
    body: debuggerContext => (0, import_jsx_runtime2.jsx)(Plotly, {
      context: debuggerContext
    }),
    label: "Plotly",
    iconName: "scatter-plot"
  });
  return __toCommonJS(index_exports);
};