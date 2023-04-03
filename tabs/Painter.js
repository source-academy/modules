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
    var Painter_exports = {};
    __export(Painter_exports, {
      default: () => Painter_default
    });
    var import_react2 = __toESM(__require("react"), 1);
    var import_react = __toESM(__require("react"), 1);
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
    var Modal = ({open, height, width, children, handleClose}) => import_react.default.createElement(import_react.default.Fragment, null, open && import_react.default.createElement(import_react.default.Fragment, null, import_react.default.createElement("div", {
      style: __spreadValues({
        height,
        width
      }, containerStyle)
    }, import_react.default.createElement("div", {
      style: bodyStyle
    }, children)), import_react.default.createElement("div", {
      style: backdropStyle,
      onClick: handleClose
    })));
    var modal_div_default = Modal;
    var Painter = class extends import_react2.default.Component {
      constructor(props) {
        super(props);
        this.handleOpen = selectedPainter => {
          this.setState({
            modalOpen: true,
            selectedPainter
          });
        };
        this.state = {
          modalOpen: false,
          selectedPainter: null
        };
      }
      render() {
        const {context: {moduleContexts: {painter: {state: {drawnPainters}}}}} = this.props.debuggerContext;
        return import_react2.default.createElement("div", null, import_react2.default.createElement(modal_div_default, {
          open: this.state.modalOpen,
          height: "20rem",
          width: "20rem",
          handleClose: () => this.setState({
            modalOpen: false
          })
        }, import_react2.default.createElement("div", {
          id: "modalDiv",
          ref: () => {
            if (this.state.selectedPainter) {
              this.state.selectedPainter.draw("modalDiv");
            }
          },
          style: {
            height: "20rem",
            width: "20rem"
          }
        })), drawnPainters.map((drawnPainter, id) => {
          const divId = `plotDiv${id}`;
          return import_react2.default.createElement(import_react2.default.Fragment, null, import_react2.default.createElement("div", {
            onClick: () => this.handleOpen(drawnPainter)
          }, "Click here to open Modal"), import_react2.default.createElement("div", {
            id: divId,
            ref: () => {
              console.log(drawnPainter);
              drawnPainter.draw(divId);
            }
          }));
        }));
      }
    };
    var Painter_default = {
      toSpawn(context) {
        var _a, _b;
        const drawnPainters = (_b = (_a = context.context) == null ? void 0 : _a.moduleContexts) == null ? void 0 : _b.painter.state.drawnPainters;
        console.log(drawnPainters);
        return drawnPainters.length > 0;
      },
      body: debuggerContext => import_react2.default.createElement(Painter, {
        debuggerContext
      }),
      label: "Painter Test Tab",
      iconName: "scatter-plot"
    };
    return __toCommonJS(Painter_exports);
  })()["default"];
})