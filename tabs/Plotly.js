require => (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => (key in obj) ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
    return a;
  };
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
  var Plotly_exports = {};
  __export(Plotly_exports, {
    default: () => Plotly_default
  });
  var import_react = __toESM(__require("react"), 1);
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
        style: __spreadValues({
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
  var modal_div_default = Modal;
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var Plotly = class extends import_react.default.Component {
    constructor(props) {
      super(props);
      this.handleOpen = selectedPlot => {
        this.setState({
          modalOpen: true,
          selectedPlot
        });
      };
      this.state = {
        modalOpen: false,
        selectedPlot: null
      };
    }
    render() {
      const {context: {moduleContexts: {plotly: {state: {drawnPlots}}}}} = this.props.debuggerContext;
      return (0, import_jsx_runtime2.jsxs)("div", {
        children: [(0, import_jsx_runtime2.jsx)(modal_div_default, {
          open: this.state.modalOpen,
          height: "90vh",
          width: "80vw",
          handleClose: () => this.setState({
            modalOpen: false
          }),
          children: (0, import_jsx_runtime2.jsx)("div", {
            id: "modalDiv",
            ref: () => {
              if (this.state.selectedPlot) {
                this.state.selectedPlot.draw("modalDiv");
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
              height: "80vh"
            },
            children: [(0, import_jsx_runtime2.jsx)("div", {
              onClick: () => this.handleOpen(drawnPlot),
              children: "Click here to open Modal"
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
    }
  };
  var Plotly_default = {
    toSpawn(context) {
      var _a, _b;
      const drawnPlots = (_b = (_a = context.context) == null ? void 0 : _a.moduleContexts) == null ? void 0 : _b.plotly.state.drawnPlots;
      return drawnPlots.length > 0;
    },
    body: debuggerContext => (0, import_jsx_runtime2.jsx)(Plotly, {
      debuggerContext
    }),
    label: "Plotly Test Tab",
    iconName: "scatter-plot"
  };
  return __toCommonJS(Plotly_exports);
})()["default"]