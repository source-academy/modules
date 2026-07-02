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
  var import_core4 = __require("@blueprintjs/core");
  var import_jsx_runtime = __require("react/jsx-runtime");
  var import_core = __require("@blueprintjs/core");
  function clamp(value, bound1, bound2) {
    if (bound2 == null) {
      return Math.min(value, bound1);
    }
    return Math.min(Math.max(value, bound1), bound2);
  }
  var import_react = __require("react");
  function MultiItemDisplay(props) {
    const [currentStep, setCurrentStep] = (0, import_react.useState)(0);
    function changeStep(newIndex) {
      var _a;
      setCurrentStep(newIndex);
      (_a = props.onStepChange) === null || _a === void 0 ? void 0 : _a.call(props, newIndex, currentStep);
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
          icon: "arrow-left",
          onClick: () => {
            changeStep(currentStep - 1);
            setStepEditorValue(currentStep.toString());
          },
          disabled: currentStep === 0,
          children: "Previous"
        }), (0, import_jsx_runtime.jsx)("h3", {
          className: "bp6-text-large",
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
                    const clampedStep = clamp(newStep, 1, props.elements.length);
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
          icon: "arrow-right",
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
  var import_jsx_runtime3 = __require("react/jsx-runtime");
  var import_core3 = __require("@blueprintjs/core");
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var import_core2 = __require("@blueprintjs/core");
  var defaultOptions = {
    className: "",
    fullWidth: false,
    iconOnRight: false,
    intent: import_core2.Intent.NONE,
    minimal: true
  };
  function ButtonComponent(props) {
    const buttonProps = Object.assign(Object.assign({}, defaultOptions), props);
    return props.disabled ? (0, import_jsx_runtime2.jsx)(import_core2.AnchorButton, Object.assign({}, buttonProps)) : (0, import_jsx_runtime2.jsx)(import_core2.Button, Object.assign({}, buttonProps));
  }
  var __rest = function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  };
  function PlayButton(_a) {
    var {playingText = "Pause", playingIcon = "pause", pausedText = "Play", pausedIcon = "play", isPlaying, tooltipProps, iconProps} = _a, props = __rest(_a, ["playingText", "playingIcon", "pausedText", "pausedIcon", "isPlaying", "tooltipProps", "iconProps"]);
    return (0, import_jsx_runtime3.jsx)(import_core3.Tooltip, Object.assign({
      content: isPlaying ? playingText : pausedText
    }, tooltipProps, {
      children: (0, import_jsx_runtime3.jsx)(ButtonComponent, Object.assign({}, props, {
        children: (0, import_jsx_runtime3.jsx)(import_core3.Icon, Object.assign({
          icon: isPlaying ? playingIcon : pausedIcon
        }, iconProps))
      }))
    }));
  }
  function getModuleState(debuggerContext, name) {
    const {context: {moduleContexts}} = debuggerContext;
    return (name in moduleContexts) ? moduleContexts[name].state : null;
  }
  function defineTab(tab) {
    return tab;
  }
  var import_react2 = __require("react");
  var import_jsx_runtime4 = __require("react/jsx-runtime");
  function SimulationControls({sim}) {
    const [isPlaying, setIsPlaying] = (0, import_react2.useState)(false);
    const [speed, setSpeed] = (0, import_react2.useState)(1);
    const [showTrails, setShowTrails] = (0, import_react2.useState)(sim.getShowTrails());
    const [showUniverse, setShowUniverse] = (0, import_react2.useState)(sim.universes.map(() => true));
    return (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, {
      children: [(0, import_jsx_runtime4.jsxs)(import_core4.ButtonGroup, {
        style: {
          width: "100%",
          margin: "4px auto"
        },
        children: [(0, import_jsx_runtime4.jsx)(PlayButton, {
          isPlaying,
          active: false,
          onClick: () => {
            setIsPlaying(!isPlaying);
            if (isPlaying) {
              sim.pause();
            } else {
              sim.resume();
            }
          },
          style: {
            margin: "4px"
          }
        }), (0, import_jsx_runtime4.jsx)(import_core4.Button, {
          className: "nbody-trails-toggle-button",
          icon: "route",
          active: showTrails,
          onClick: () => {
            setShowTrails(!showTrails);
            sim.setShowTrails(!showTrails);
          },
          style: {
            margin: "4px"
          },
          text: (showTrails ? "Hide" : "Show") + " Trails"
        })]
      }), (0, import_jsx_runtime4.jsx)(import_core4.Tooltip, {
        content: "Sim Speed",
        children: (0, import_jsx_runtime4.jsx)(import_core4.NumericInput, {
          value: speed,
          onValueChange: value => {
            if (value < 0) value = 0;
            setSpeed(value);
            sim.setSpeed(value);
          },
          style: {
            margin: "4px auto"
          }
        })
      }), (0, import_jsx_runtime4.jsx)(import_core4.ButtonGroup, {
        style: {
          margin: "4px auto"
        },
        children: sim.universes.map((universe, i) => (0, import_jsx_runtime4.jsxs)(import_core4.Checkbox, {
          className: `"nbody-show-universe-${i}-button"`,
          checked: showUniverse[i],
          onClick: () => {
            sim.setShowUniverse(universe.label, !showUniverse[i]);
            setShowUniverse(showUniverse.map((v, j) => i === j ? !v : v));
          },
          style: {
            margin: "4px"
          },
          children: ["Show ", universe.label]
        }, i))
      })]
    });
  }
  var Nbody = ({debuggerCtx: context}) => {
    const {simulations, recordInfo} = getModuleState(context, "nbody");
    return (0, import_jsx_runtime4.jsx)(MultiItemDisplay, {
      elements: simulations.map((sim, i) => {
        const divId = `nbody-${i}`;
        return (0, import_jsx_runtime4.jsxs)("div", {
          children: [(0, import_jsx_runtime4.jsx)(SimulationControls, {
            sim
          }), (0, import_jsx_runtime4.jsx)("div", {
            style: {
              height: "80vh",
              marginBottom: "5vh"
            },
            children: (0, import_jsx_runtime4.jsx)("div", {
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
          }, divId)]
        });
      })
    });
  };
  var index_default = defineTab({
    toSpawn(context) {
      const state = getModuleState(context, "nbody");
      return !!state && state.simulations.length > 0;
    },
    body: context => (0, import_jsx_runtime4.jsx)(Nbody, {
      debuggerCtx: context
    }),
    label: "Nbody Viz Tab",
    iconName: "clean"
  });
  return __toCommonJS(index_exports);
};