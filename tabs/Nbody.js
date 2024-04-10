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
  var Nbody_exports = {};
  __export(Nbody_exports, {
    default: () => Nbody_default
  });
  var import_core = __require("@blueprintjs/core");
  var import_icons = __require("@blueprintjs/icons");
  var import_react = __toESM(__require("react"), 1);
  var import_jsx_runtime = __require("react/jsx-runtime");
  var SimulationControl = class extends import_react.default.Component {
    constructor(props) {
      super(props);
      this.state = {
        isPlaying: false,
        speed: 1,
        showTrails: props.sim.getShowTrails(),
        showUniverse: props.sim.universes.map(() => true)
      };
    }
    toggleSimPause() {
      const currentState = this.state.isPlaying;
      this.setState({
        isPlaying: !currentState
      });
      if (currentState) {
        this.props.sim.pause();
      } else {
        this.props.sim.resume();
      }
    }
    toggleShowTrails() {
      const currentState = this.state.showTrails;
      this.setState({
        showTrails: !currentState
      });
      this.props.sim.setShowTrails(!currentState);
    }
    setSpeed(speed) {
      this.setState({
        speed
      });
      this.props.sim.setSpeed(speed);
    }
    toggleShowUniverse(label, i) {
      this.props.sim.setShowUniverse(label, !this.state.showUniverse[i]);
      this.setState({
        showUniverse: this.state.showUniverse.map((v, j) => i === j ? !v : v)
      });
    }
    render() {
      return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
        children: [(0, import_jsx_runtime.jsxs)(import_core.ButtonGroup, {
          style: {
            width: "100%",
            margin: "4px auto"
          },
          children: [(0, import_jsx_runtime.jsx)(import_core.Button, {
            className: "nbody-pause-toggle-button",
            icon: this.state.isPlaying ? import_icons.IconNames.PAUSE : import_icons.IconNames.PLAY,
            active: false,
            onClick: () => this.toggleSimPause(),
            text: this.state.isPlaying ? "Pause" : "Play",
            style: {
              margin: "4px"
            }
          }), (0, import_jsx_runtime.jsx)(import_core.Button, {
            className: "nbody-trails-toggle-button",
            icon: import_icons.IconNames.ROUTE,
            active: this.state.showTrails,
            onClick: () => this.toggleShowTrails(),
            style: {
              margin: "4px"
            },
            text: (this.state.showTrails ? "Hide" : "Show") + " Trails"
          })]
        }), (0, import_jsx_runtime.jsx)(import_core.NumericInput, {
          defaultValue: this.state.speed,
          onValueChange: value => this.setSpeed(value),
          style: {
            margin: "4px auto"
          }
        }), (0, import_jsx_runtime.jsx)(import_core.ButtonGroup, {
          style: {
            margin: "4px auto"
          },
          children: this.props.sim.universes.map((universe, i) => {
            return (0, import_jsx_runtime.jsx)(import_core.Button, {
              className: `"nbody-show-universe-${i}-button"`,
              active: this.state.showUniverse[i],
              onClick: () => this.toggleShowUniverse(universe.label, i),
              text: (this.state.showUniverse[i] ? "Hide" : "Show") + " " + universe.label,
              style: {
                margin: "4px"
              }
            }, i);
          })
        })]
      });
    }
  };
  var Nbody = class extends import_react.default.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    render() {
      const {context: {moduleContexts: {nbody: {state: {simulations, recordInfo}}}}} = this.props.context;
      return (0, import_jsx_runtime.jsxs)("div", {
        children: [simulations.length === 0 ? (0, import_jsx_runtime.jsx)("div", {
          children: "No simulations found"
        }) : (0, import_jsx_runtime.jsx)(SimulationControl, {
          sim: simulations[0]
        }), simulations.map((sim, i) => {
          const divId = `nbody-${i}`;
          return (0, import_jsx_runtime.jsx)("div", {
            style: {
              height: "80vh",
              marginBottom: "5vh"
            },
            children: (0, import_jsx_runtime.jsx)("div", {
              id: divId,
              style: {
                height: "500px",
                width: "500px"
              },
              ref: () => {
                if (recordInfo.isRecording) {
                  sim.start(divId, 500, 500, 1, true, recordInfo.recordFor, recordInfo.recordSpeed);
                } else {
                  sim.start(divId, 500, 500, 1, true);
                }
              }
            })
          }, divId);
        })]
      });
    }
  };
  var Nbody_default = {
    toSpawn(context) {
      var _a, _b;
      console.log("Nbody tospawn");
      const simulations = (_b = (_a = context.context) == null ? void 0 : _a.moduleContexts) == null ? void 0 : _b.nbody.state.simulations;
      return simulations.length > 0;
    },
    body: context => (0, import_jsx_runtime.jsx)(Nbody, {
      context
    }),
    label: "Nbody Viz Tab",
    iconName: "clean"
  };
  return __toCommonJS(Nbody_exports);
};