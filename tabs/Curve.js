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
    CurveTab: () => CurveTab,
    default: () => index_default
  });
  var import_icons6 = __require("@blueprintjs/icons");
  var import_jsx_runtime6 = __require("react/jsx-runtime");
  var import_core6 = __require("@blueprintjs/core");
  var import_icons3 = __require("@blueprintjs/icons");
  var import_react3 = __require("react");
  var import_jsx_runtime = __require("react/jsx-runtime");
  var import_core = __require("@blueprintjs/core");
  var import_icons = __require("@blueprintjs/icons");
  function AnimationError({error}) {
    return (0, import_jsx_runtime.jsxs)("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      },
      children: [(0, import_jsx_runtime.jsxs)("div", {
        style: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        },
        children: [(0, import_jsx_runtime.jsx)(import_core.Icon, {
          icon: (0, import_jsx_runtime.jsx)(import_icons.WarningSign, {}),
          size: 90
        }), (0, import_jsx_runtime.jsxs)("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 20
          },
          children: [(0, import_jsx_runtime.jsx)("h3", {
            children: "An error occurred while running your animation!"
          }), (0, import_jsx_runtime.jsx)("p", {
            style: {
              justifySelf: "flex-end"
            },
            children: "Here's the details:"
          })]
        })]
      }), (0, import_jsx_runtime.jsx)("code", {
        style: {
          color: "red"
        },
        children: error.toString()
      })]
    });
  }
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var import_core2 = __require("@blueprintjs/core");
  var __rest = function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  };
  function AutoLoopSwitch(_a) {
    var {isAutoLooping} = _a, props = __rest(_a, ["isAutoLooping"]);
    return (0, import_jsx_runtime2.jsx)(import_core2.Switch, Object.assign({
      style: {
        marginBottom: "0px",
        whiteSpace: "nowrap"
      },
      label: "Auto Loop",
      checked: isAutoLooping
    }, props));
  }
  var import_jsx_runtime3 = __require("react/jsx-runtime");
  var import_core3 = __require("@blueprintjs/core");
  var defaultOptions = {
    className: "",
    fullWidth: false,
    iconOnRight: false,
    intent: import_core3.Intent.NONE,
    minimal: true
  };
  function ButtonComponent(props) {
    const buttonProps = Object.assign(Object.assign({}, defaultOptions), props);
    return props.disabled ? (0, import_jsx_runtime3.jsx)(import_core3.AnchorButton, Object.assign({}, buttonProps)) : (0, import_jsx_runtime3.jsx)(import_core3.Button, Object.assign({}, buttonProps));
  }
  var import_jsx_runtime4 = __require("react/jsx-runtime");
  var import_core4 = __require("@blueprintjs/core");
  var import_icons2 = __require("@blueprintjs/icons");
  function PlayButton(props) {
    return (0, import_jsx_runtime4.jsx)(import_core4.Tooltip, {
      content: props.isPlaying ? "Pause" : "Play",
      placement: "top",
      children: (0, import_jsx_runtime4.jsx)(ButtonComponent, Object.assign({}, props, {
        children: (0, import_jsx_runtime4.jsx)(import_core4.Icon, {
          icon: props.isPlaying ? (0, import_jsx_runtime4.jsx)(import_icons2.Pause, {}) : (0, import_jsx_runtime4.jsx)(import_icons2.Play, {})
        })
      }))
    });
  }
  var import_jsx_runtime5 = __require("react/jsx-runtime");
  var import_react = __require("react");
  var import_core5 = __require("@blueprintjs/core");
  var SA_TAB_ICON_SIZE = import_core5.IconSize.LARGE;
  var BP_TAB_BUTTON_MARGIN = "20px";
  var BP_TEXT_MARGIN = "10px";
  var CANVAS_MAX_WIDTH = "max(70vh, 30vw)";
  var defaultStyle = {
    width: "100%",
    maxWidth: CANVAS_MAX_WIDTH,
    aspectRatio: "1"
  };
  var WebGLCanvas = (0, import_react.forwardRef)((props, ref) => {
    const style = props.style !== void 0 ? Object.assign(Object.assign({}, defaultStyle), props.style) : defaultStyle;
    return (0, import_jsx_runtime5.jsx)("canvas", Object.assign({}, props, {
      style,
      ref,
      height: 512,
      width: 512
    }));
  });
  WebGLCanvas.displayName = "WebGLCanvas";
  var WebGLCanvas_default = WebGLCanvas;
  var import_react2 = __require("react");
  function useRerender() {
    const [, setRenderer] = (0, import_react2.useState)(true);
    return () => setRenderer(prev => !prev);
  }
  function useAnimation({animationDuration, autoLoop, autoStart, callback, frameDuration, startTimestamp}) {
    const rerender = useRerender();
    const requestIdRef = (0, import_react2.useRef)(null);
    const elapsedRef = (0, import_react2.useRef)(startTimestamp !== null && startTimestamp !== void 0 ? startTimestamp : 0);
    const canvasRef = (0, import_react2.useRef)(null);
    const lastFrameTimestamp = (0, import_react2.useRef)(null);
    const [isPlaying, setIsPlaying] = (0, import_react2.useState)(autoStart !== null && autoStart !== void 0 ? autoStart : false);
    const [errored, setErrored] = (0, import_react2.useState)(null);
    function setElapsed(newVal) {
      elapsedRef.current = newVal;
      rerender();
    }
    function requestFrame() {
      requestIdRef.current = requestAnimationFrame(animCallback);
    }
    function stop() {
      setIsPlaying(false);
      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
      lastFrameTimestamp.current = null;
    }
    function reset() {
      setElapsed(0);
      callbackWrapper(0);
      lastFrameTimestamp.current = null;
      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
        requestFrame();
      }
    }
    function start() {
      setIsPlaying(true);
      if (canvasRef.current) requestFrame();
    }
    function callbackWrapper(time) {
      if (canvasRef.current) {
        try {
          callback(time, canvasRef.current);
        } catch (error) {
          setErrored(error);
          stop();
        }
      }
    }
    function animCallback(timeInMs) {
      if (lastFrameTimestamp.current === null) {
        lastFrameTimestamp.current = timeInMs;
        requestFrame();
      } else {
        const diff = timeInMs - lastFrameTimestamp.current;
        const newElapsed = elapsedRef.current + diff;
        if (animationDuration === void 0 || newElapsed < animationDuration) {
          requestFrame();
          if (frameDuration === void 0 || diff >= frameDuration) {
            setElapsed(newElapsed);
            callbackWrapper(newElapsed);
            lastFrameTimestamp.current = timeInMs;
          }
          ;
        } else {
          setElapsed(animationDuration);
          callbackWrapper(animationDuration);
          finishCallbackRef.current();
          return;
        }
      }
    }
    const finishCallbackRef = (0, import_react2.useRef)(null);
    (0, import_react2.useEffect)(() => {
      finishCallbackRef.current = () => {
        if (autoLoop) {
          reset();
        } else {
          stop();
        }
      };
    }, [autoLoop]);
    (0, import_react2.useEffect)(() => {
      if (autoStart) start();
      return stop;
    }, []);
    return {
      start,
      stop,
      reset,
      changeTimestamp: newTime => {
        if (newTime < 0 || animationDuration !== void 0 && newTime > animationDuration) {
          throw new Error(`Invalid timestamp: ${newTime}`);
        }
        setElapsed(newTime);
        callbackWrapper(newTime);
      },
      drawFrame: timestamp => callbackWrapper(timestamp !== null && timestamp !== void 0 ? timestamp : elapsedRef.current),
      isPlaying,
      timestamp: elapsedRef.current,
      setCanvas: canvas => {
        if (canvasRef.current !== null && Object.is(canvasRef.current, canvas)) {
          return;
        }
        canvasRef.current = canvas;
        callbackWrapper(elapsedRef.current);
        if (isPlaying) {
          requestFrame();
        }
      },
      errored
    };
  }
  function AnimationCanvas(props) {
    const [isAutoLooping, setIsAutoLooping] = (0, import_react3.useState)(true);
    const [wasPlaying, setWasPlaying] = (0, import_react3.useState)(null);
    const [frameDuration, animationDuration] = (0, import_react3.useMemo)(() => [1e3 / props.animation.fps, Math.round(props.animation.duration * 1e3)], [props.animation]);
    const {stop, start, reset, changeTimestamp, isPlaying, errored, timestamp, setCanvas} = useAnimation({
      frameDuration,
      animationDuration,
      autoLoop: isAutoLooping,
      callback: (timestamp2, canvas) => {
        const frame = props.animation.getFrame(timestamp2 / 1e3);
        frame.draw(canvas);
      }
    });
    const controlBar = (0, import_jsx_runtime6.jsxs)("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: BP_TAB_BUTTON_MARGIN,
        width: "100%",
        maxWidth: CANVAS_MAX_WIDTH,
        paddingTop: BP_TEXT_MARGIN,
        paddingBottom: BP_TEXT_MARGIN
      },
      children: [(0, import_jsx_runtime6.jsx)(PlayButton, {
        title: "PlayButton",
        isPlaying,
        onClick: () => {
          if (isPlaying) stop(); else {
            if (errored || timestamp >= animationDuration) reset();
            start();
          }
        }
      }), (0, import_jsx_runtime6.jsx)(import_core6.Tooltip, {
        content: "Reset",
        placement: "top",
        children: (0, import_jsx_runtime6.jsx)(ButtonComponent, {
          disabled: Boolean(errored),
          onClick: reset,
          children: (0, import_jsx_runtime6.jsx)(import_core6.Icon, {
            icon: (0, import_jsx_runtime6.jsx)(import_icons3.Reset, {})
          })
        })
      }), (0, import_jsx_runtime6.jsx)(import_core6.Slider, {
        value: timestamp,
        min: 0,
        max: animationDuration,
        stepSize: 1,
        labelRenderer: false,
        disabled: Boolean(errored),
        onChange: newValue => {
          if (wasPlaying === null) {
            setWasPlaying(isPlaying);
          }
          changeTimestamp(newValue);
          stop();
        },
        onRelease: () => {
          if (wasPlaying) {
            start();
          }
          setWasPlaying(null);
        }
      }), (0, import_jsx_runtime6.jsx)(AutoLoopSwitch, {
        isAutoLooping,
        disabled: Boolean(errored),
        onChange: () => setIsAutoLooping(!isAutoLooping)
      })]
    });
    return (0, import_jsx_runtime6.jsxs)("div", {
      style: {
        width: "100%"
      },
      children: [(0, import_jsx_runtime6.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: controlBar
      }), (0, import_jsx_runtime6.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: errored ? (0, import_jsx_runtime6.jsx)(AnimationError, {
          error: errored
        }) : (0, import_jsx_runtime6.jsx)(WebGLCanvas_default, {
          style: {
            flexGrow: 1
          },
          ref: element => {
            if (element !== null) {
              setCanvas(element);
            }
          }
        })
      })]
    });
  }
  var import_jsx_runtime7 = __require("react/jsx-runtime");
  var import_core7 = __require("@blueprintjs/core");
  var import_icons4 = __require("@blueprintjs/icons");
  function clamp(value, bound1, bound2) {
    if (bound2 == null) {
      return Math.min(value, bound1);
    }
    return Math.min(Math.max(value, bound1), bound2);
  }
  var import_react4 = __require("react");
  function MultiItemDisplay(props) {
    const [currentStep, setCurrentStep] = (0, import_react4.useState)(0);
    function changeStep(newIndex) {
      setCurrentStep(newIndex);
      if (props.onStepChange) {
        props.onStepChange(newIndex, currentStep);
      }
    }
    const [stepEditorValue, setStepEditorValue] = (0, import_react4.useState)("1");
    const [stepEditorFocused, setStepEditorFocused] = (0, import_react4.useState)(false);
    const resetStepEditor = () => setStepEditorValue((currentStep + 1).toString());
    const elementsDigitCount = Math.floor(Math.log10(Math.max(1, props.elements.length))) + 1;
    return (0, import_jsx_runtime7.jsxs)("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        height: "100vh"
      },
      children: [(0, import_jsx_runtime7.jsxs)("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          position: "relative",
          marginBottom: 10
        },
        children: [(0, import_jsx_runtime7.jsx)(import_core7.Button, {
          style: {
            position: "absolute",
            left: 0
          },
          tabIndex: 0,
          large: true,
          outlined: true,
          icon: (0, import_jsx_runtime7.jsx)(import_icons4.ArrowLeft, {}),
          onClick: () => {
            changeStep(currentStep - 1);
            setStepEditorValue(currentStep.toString());
          },
          disabled: currentStep === 0,
          children: "Previous"
        }), (0, import_jsx_runtime7.jsx)("h3", {
          className: "bp3-text-large",
          children: (0, import_jsx_runtime7.jsxs)("div", {
            style: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around"
            },
            children: ["Call\xA0", (0, import_jsx_runtime7.jsx)("div", {
              style: {
                width: `${stepEditorFocused ? elementsDigitCount + 2 : elementsDigitCount}ch`
              },
              children: (0, import_jsx_runtime7.jsx)(import_core7.EditableText, {
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
            }), stepEditorFocused && (0, import_jsx_runtime7.jsx)(import_jsx_runtime7.Fragment, {
              children: "\xA0"
            }), "/", props.elements.length]
          })
        }), (0, import_jsx_runtime7.jsx)(import_core7.Button, {
          style: {
            position: "absolute",
            right: 0
          },
          large: true,
          outlined: true,
          icon: (0, import_jsx_runtime7.jsx)(import_icons4.ArrowRight, {}),
          tabIndex: 0,
          onClick: () => {
            changeStep(currentStep + 1);
            setStepEditorValue((currentStep + 2).toString());
          },
          disabled: currentStep === props.elements.length - 1,
          children: "Next"
        })]
      }), (0, import_jsx_runtime7.jsx)("div", {
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
    return debuggerContext.context.moduleContexts[name].state;
  }
  function defineTab(tab) {
    return tab;
  }
  var glAnimation = class {
    constructor(duration, fps) {
      this.duration = duration;
      this.fps = fps;
    }
  };
  glAnimation.isAnimation = obj => obj instanceof glAnimation;
  var import_core9 = __require("@blueprintjs/core");
  var import_jsx_runtime8 = __require("react/jsx-runtime");
  var import_core8 = __require("@blueprintjs/core");
  var import_react5 = __require("react");
  var __rest2 = function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  };
  function NumberSelector(_a) {
    var {value, maxValue, minValue, onValueChanged, onCancel, onEdit, onConfirm, customInputAttributes} = _a, props = __rest2(_a, ["value", "maxValue", "minValue", "onValueChanged", "onCancel", "onEdit", "onConfirm", "customInputAttributes"]);
    const [text, setText] = (0, import_react5.useState)(null);
    const maxTextLength = maxValue === 0 ? 1 : Math.floor(Math.log10(maxValue)) + 2;
    return (0, import_jsx_runtime8.jsx)(import_core8.EditableText, Object.assign({}, props, {
      alwaysRenderInput: true,
      customInputAttributes: customInputAttributes === void 0 ? {
        max: maxValue,
        min: minValue
      } : Object.assign(Object.assign({}, customInputAttributes), {
        max: maxValue,
        min: minValue
      }),
      type: "number",
      value: text !== null && text !== void 0 ? text : value.toString(),
      isEditing: text !== null,
      onChange: textValue => {
        if (textValue.length === maxTextLength) return;
        if (text !== null) {
          setText(textValue);
          return;
        }
        const newValue = parseFloat(textValue);
        if (!Number.isNaN(newValue) && onValueChanged) {
          onValueChanged(clamp(newValue, minValue, maxValue));
        }
      },
      onEdit: editValue => {
        setText(value.toString());
        if (onEdit) onEdit(editValue);
      },
      onCancel: value2 => {
        setText(null);
        if (onCancel) onCancel(value2);
      },
      onConfirm: textValue => {
        const newValue = parseFloat(textValue);
        if (!Number.isNaN(newValue) && onValueChanged) {
          onValueChanged(clamp(newValue, minValue, maxValue));
        }
        if (onConfirm) onConfirm(textValue);
        setText(null);
      }
    }));
  }
  function degreesToRadians(degrees) {
    return degrees / 360 * (2 * Math.PI);
  }
  var import_react6 = __require("react");
  var import_jsx_runtime9 = __require("react/jsx-runtime");
  function Canvas3DCurve({curve}) {
    const canvasRef = (0, import_react6.useRef)(null);
    const {isPlaying: isRotating, start, stop, changeTimestamp: setDisplayAngle, timestamp: displayAngle, setCanvas, errored} = useAnimation({
      animationDuration: 7200,
      autoLoop: true,
      callback(angle) {
        const angleInRadians = degreesToRadians(angle / 20);
        curve.redraw(angleInRadians);
      }
    });
    (0, import_react6.useEffect)(() => {
      if (canvasRef.current) {
        curve.init(canvasRef.current);
        setCanvas(canvasRef.current);
      }
    }, [curve, canvasRef.current]);
    return (0, import_jsx_runtime9.jsxs)("div", {
      style: {
        width: "100%"
      },
      children: [(0, import_jsx_runtime9.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: (0, import_jsx_runtime9.jsxs)("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: BP_TAB_BUTTON_MARGIN,
            width: "100%",
            maxWidth: CANVAS_MAX_WIDTH,
            paddingTop: BP_TEXT_MARGIN,
            paddingBottom: BP_TEXT_MARGIN
          },
          children: [(0, import_jsx_runtime9.jsx)(PlayButton, {
            title: "PlayButton",
            isPlaying: isRotating,
            disabled: !!errored,
            onClick: () => {
              if (isRotating) stop(); else start();
            }
          }), (0, import_jsx_runtime9.jsx)(import_core9.Slider, {
            value: displayAngle / 20,
            min: 0,
            max: 360,
            disabled: !!errored,
            labelRenderer: false,
            onChange: newValue => {
              stop();
              setDisplayAngle(newValue * 20);
            }
          }), (0, import_jsx_runtime9.jsx)(import_core9.Tooltip, {
            content: "Angle in Degrees",
            children: (0, import_jsx_runtime9.jsx)(NumberSelector, {
              value: Math.round(displayAngle / 20),
              minValue: 0,
              maxValue: 360,
              customInputAttributes: {
                style: {
                  height: "100%",
                  width: "5ch"
                }
              },
              onValueChanged: value => setDisplayAngle(value * 20)
            })
          })]
        })
      }), (0, import_jsx_runtime9.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: errored ? (0, import_jsx_runtime9.jsx)(AnimationError, {
          error: errored
        }) : (0, import_jsx_runtime9.jsx)(WebGLCanvas_default, {
          ref: canvasRef
        })
      })]
    });
  }
  var import_core10 = __require("@blueprintjs/core");
  var import_icons5 = __require("@blueprintjs/icons");
  var import_react7 = __require("react");
  var import_jsx_runtime10 = __require("react/jsx-runtime");
  function Curve3DAnimationCanvas({animation}) {
    const [displayAngle, setDisplayAngle] = (0, import_react7.useState)(animation.angle);
    const [isAutoLooping, setIsAutoLooping] = (0, import_react7.useState)(true);
    const [wasPlaying, setWasPlaying] = (0, import_react7.useState)(null);
    const frameDuration = 1e3 / animation.fps;
    const animationDuration = Math.round(animation.duration * 1e3);
    const {changeTimestamp, drawFrame, start, stop, reset, timestamp, errored, isPlaying, setCanvas} = useAnimation({
      frameDuration,
      animationDuration,
      autoLoop: isAutoLooping,
      callback(timestamp2, canvas) {
        const frame = animation.getFrame(timestamp2 / 1e3);
        frame.draw(canvas);
      }
    });
    return (0, import_jsx_runtime10.jsxs)("div", {
      style: {
        width: "100%"
      },
      children: [(0, import_jsx_runtime10.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: (0, import_jsx_runtime10.jsxs)("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: BP_TAB_BUTTON_MARGIN,
            width: "100%",
            maxWidth: CANVAS_MAX_WIDTH,
            paddingTop: BP_TEXT_MARGIN,
            paddingBottom: BP_TEXT_MARGIN
          },
          children: [(0, import_jsx_runtime10.jsx)(PlayButton, {
            title: "PlayButton",
            isPlaying,
            disabled: Boolean(errored),
            onClick: () => {
              if (isPlaying) stop(); else {
                if (timestamp >= animationDuration) reset();
                start();
              }
            }
          }), (0, import_jsx_runtime10.jsx)(import_core10.Tooltip, {
            content: "Reset",
            placement: "top",
            children: (0, import_jsx_runtime10.jsx)(ButtonComponent, {
              disabled: Boolean(errored),
              onClick: reset,
              children: (0, import_jsx_runtime10.jsx)(import_core10.Icon, {
                icon: (0, import_jsx_runtime10.jsx)(import_icons5.Reset, {})
              })
            })
          }), (0, import_jsx_runtime10.jsxs)("div", {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: BP_TEXT_MARGIN,
              width: "100%"
            },
            children: [(0, import_jsx_runtime10.jsx)(import_core10.Slider, {
              value: timestamp,
              min: 0,
              max: animationDuration,
              stepSize: 1,
              labelRenderer: false,
              disabled: Boolean(errored),
              onChange: newValue => {
                changeTimestamp(newValue);
                if (wasPlaying === null) {
                  setWasPlaying(isPlaying);
                }
                stop();
              },
              onRelease: () => {
                if (wasPlaying) start();
                setWasPlaying(null);
              }
            }), (0, import_jsx_runtime10.jsx)(import_core10.Tooltip, {
              content: "Display Angle",
              placement: "top",
              children: (0, import_jsx_runtime10.jsx)(import_core10.Slider, {
                value: displayAngle,
                min: 0,
                max: 2 * Math.PI,
                stepSize: 0.01,
                labelRenderer: false,
                disabled: Boolean(errored),
                onChange: value => {
                  setDisplayAngle(value);
                  if (!isPlaying) drawFrame();
                  animation.angle = value;
                }
              })
            })]
          }), (0, import_jsx_runtime10.jsx)(AutoLoopSwitch, {
            isAutoLooping,
            disabled: Boolean(errored),
            onChange: () => setIsAutoLooping(prev => !prev)
          })]
        })
      }), (0, import_jsx_runtime10.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: errored ? (0, import_jsx_runtime10.jsx)(AnimationError, {
          error: errored
        }) : (0, import_jsx_runtime10.jsx)(WebGLCanvas_default, {
          style: {
            flexGrow: 1
          },
          ref: canvas => {
            if (canvas) {
              setCanvas(canvas);
            }
          }
        })
      })]
    });
  }
  var import_jsx_runtime11 = __require("react/jsx-runtime");
  var CurveTab = ({context}) => {
    const {drawnCurves} = getModuleState(context, "curve");
    const canvases = drawnCurves.map((curve, i) => {
      const elemKey = i.toString();
      if (glAnimation.isAnimation(curve)) {
        return curve.is3D ? (0, import_jsx_runtime11.jsx)(Curve3DAnimationCanvas, {
          animation: curve
        }, elemKey) : (0, import_jsx_runtime11.jsx)(AnimationCanvas, {
          animation: curve
        }, elemKey);
      }
      return curve.is3D() ? (0, import_jsx_runtime11.jsx)(Canvas3DCurve, {
        curve
      }, elemKey) : (0, import_jsx_runtime11.jsx)(WebGLCanvas_default, {
        ref: r => {
          if (r) {
            curve.init(r);
            curve.redraw(0);
          }
        }
      }, elemKey);
    });
    return (0, import_jsx_runtime11.jsx)(MultiItemDisplay, {
      elements: canvases
    });
  };
  var index_default = defineTab({
    toSpawn(context) {
      var _a, _b, _c, _d;
      const drawnCurves = (_d = (_c = (_b = (_a = context.context) == null ? void 0 : _a.moduleContexts) == null ? void 0 : _b.curve) == null ? void 0 : _c.state) == null ? void 0 : _d.drawnCurves;
      return drawnCurves.length > 0;
    },
    body(context) {
      return (0, import_jsx_runtime11.jsx)(CurveTab, {
        context
      });
    },
    label: "Curves Tab",
    iconName: import_icons6.IconNames.MEDIA
  });
  return __toCommonJS(index_exports);
};