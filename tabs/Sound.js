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
  var import_jsx_runtime = __require("react/jsx-runtime");
  var import_core = __require("@blueprintjs/core");
  var import_icons = __require("@blueprintjs/icons");
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
      setCurrentStep(newIndex);
      if (props.onStepChange) {
        props.onStepChange(newIndex, currentStep);
      }
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
          icon: (0, import_jsx_runtime.jsx)(import_icons.ArrowLeft, {}),
          onClick: () => {
            changeStep(currentStep - 1);
            setStepEditorValue(currentStep.toString());
          },
          disabled: currentStep === 0,
          children: "Previous"
        }), (0, import_jsx_runtime.jsx)("h3", {
          className: "bp3-text-large",
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
          icon: (0, import_jsx_runtime.jsx)(import_icons.ArrowRight, {}),
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
  function getModuleState(debuggerContext, name) {
    const {context: {moduleContexts}} = debuggerContext;
    return (name in moduleContexts) ? moduleContexts[name].state : null;
  }
  function defineTab(tab) {
    return tab;
  }
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var SoundTab = ({debuggerCtx: context}) => {
    const {audioPlayed} = getModuleState(context, "sound");
    const elements = audioPlayed.map(audio => (0, import_jsx_runtime2.jsx)("audio", {
      src: audio.dataUri,
      controls: true,
      id: "sound-tab-player",
      style: {
        width: "100%"
      }
    }));
    return (0, import_jsx_runtime2.jsxs)("div", {
      children: [(0, import_jsx_runtime2.jsx)("p", {
        id: "sound-default-text",
        children: "The sound tab gives you control over your custom sounds. You can play, pause, adjust the volume and download your sounds."
      }), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsx)(MultiItemDisplay, {
        elements
      }), (0, import_jsx_runtime2.jsx)("br", {})]
    });
  };
  var index_default = defineTab({
    toSpawn(context) {
      const moduleState = getModuleState(context, "sound");
      return !!moduleState && moduleState.audioPlayed.length > 0;
    },
    body(context) {
      return (0, import_jsx_runtime2.jsx)(SoundTab, {
        debuggerCtx: context
      });
    },
    label: "Sounds",
    iconName: "music"
  });
  return __toCommonJS(index_exports);
};