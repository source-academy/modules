export default require => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = value => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = value => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = x => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  var RobotSimulation_exports = {};
  __export(RobotSimulation_exports, {
    default: () => RobotSimulation_default
  });
  var import_react7 = __require("react");
  var import_react = __require("react");
  var import_jsx_runtime = __require("react/jsx-runtime");
  var containerStyle = {
    width: "100vw",
    height: "100vh",
    position: "fixed",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    isolation: "isolate"
  };
  var closeButtonStyle = {
    position: "fixed",
    top: "10px",
    right: "10px",
    cursor: "pointer",
    fontSize: 24,
    color: "white"
  };
  var greyedOutBackground = {
    background: "black",
    opacity: "70%",
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -1
  };
  var childWrapperStyle = {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  };
  var Modal = ({children, isOpen, onClose}) => {
    return (0, import_jsx_runtime.jsxs)("div", {
      style: __spreadProps(__spreadValues({}, containerStyle), {
        display: isOpen ? "block" : "none"
      }),
      children: [(0, import_jsx_runtime.jsx)("div", {
        style: greyedOutBackground
      }), (0, import_jsx_runtime.jsx)("span", {
        style: closeButtonStyle,
        onClick: onClose,
        children: "x"
      }), (0, import_jsx_runtime.jsx)("div", {
        style: childWrapperStyle,
        children
      })]
    });
  };
  var import_core3 = __require("@blueprintjs/core");
  var import_react5 = __require("react");
  var import_react3 = __require("react");
  var import_react2 = __require("react");
  var useFetchFromSimulation = (fetchFn, fetchInterval) => {
    const [fetchTime, setFetchTime] = (0, import_react2.useState)(null);
    const [fetchedData, setFetchedData] = (0, import_react2.useState)(null);
    (0, import_react2.useEffect)(() => {
      const interval = setInterval(() => {
        const data = fetchFn();
        setFetchedData(data);
        setFetchTime(new Date());
      }, fetchInterval);
      return () => clearInterval(interval);
    });
    return [fetchTime, fetchedData];
  };
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var getTimeString = date => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    };
    return date.toLocaleTimeString([], options);
  };
  var LastUpdated = ({time}) => {
    const timeString = getTimeString(time);
    return (0, import_jsx_runtime2.jsxs)("span", {
      children: ["Last updated: ", timeString]
    });
  };
  var import_jsx_runtime3 = __require("react/jsx-runtime");
  var panelWrapperStyle = {
    "padding": "10px"
  };
  var TabWrapper = ({children}) => {
    return (0, import_jsx_runtime3.jsx)("div", {
      style: panelWrapperStyle,
      children
    });
  };
  var import_jsx_runtime4 = __require("react/jsx-runtime");
  var ColorSensorPanel = ({ev3}) => {
    const colorSensor = ev3 == null ? void 0 : ev3.get("colorSensor");
    const sensorVisionRef = (0, import_react3.useRef)(null);
    const [timing, color] = useFetchFromSimulation(() => {
      if (colorSensor === void 0) {
        return null;
      }
      return colorSensor.sense();
    }, 1e3);
    (0, import_react3.useEffect)(() => {
      if (colorSensor && sensorVisionRef.current) {
        sensorVisionRef.current.replaceChildren(colorSensor.renderer.getElement());
      }
    }, [timing]);
    if (!ev3) {
      return (0, import_jsx_runtime4.jsx)(TabWrapper, {
        children: "EV3 not found in context. Did you call saveToContext('ev3', ev3);"
      });
    }
    if (timing === null) {
      return (0, import_jsx_runtime4.jsx)(TabWrapper, {
        children: "Loading color sensor"
      });
    }
    if (color === null) {
      return (0, import_jsx_runtime4.jsx)(TabWrapper, {
        children: "Color sensor not found"
      });
    }
    return (0, import_jsx_runtime4.jsxs)(TabWrapper, {
      children: [(0, import_jsx_runtime4.jsx)(LastUpdated, {
        time: timing
      }), (0, import_jsx_runtime4.jsx)("div", {
        ref: sensorVisionRef
      }), (0, import_jsx_runtime4.jsxs)("p", {
        children: ["Red: ", color.r]
      }), (0, import_jsx_runtime4.jsxs)("p", {
        children: ["Green: ", color.g]
      }), (0, import_jsx_runtime4.jsxs)("p", {
        children: ["Blue: ", color.b]
      })]
    });
  };
  var import_jsx_runtime5 = __require("react/jsx-runtime");
  var getLogString = log => {
    const logLevelText = {
      source: "Runtime Source Error",
      error: "Error"
    };
    const timeString = getTimeString(new Date(log.timestamp));
    return `[${timeString}] ${logLevelText[log.level]}: ${log.message}`;
  };
  var ConsolePanel = ({robot_console}) => {
    const [timing, logs] = useFetchFromSimulation(() => {
      if (robot_console === void 0) {
        return null;
      }
      return robot_console.getLogs();
    }, 1e3);
    if (timing === null) {
      return (0, import_jsx_runtime5.jsx)(TabWrapper, {
        children: "Not fetched yet"
      });
    }
    if (logs === null) {
      return (0, import_jsx_runtime5.jsx)(TabWrapper, {
        children: "Console not found. Ensure that the world is initialized properly."
      });
    }
    if (logs.length === 0) {
      return (0, import_jsx_runtime5.jsxs)(TabWrapper, {
        children: [(0, import_jsx_runtime5.jsx)(LastUpdated, {
          time: timing
        }), (0, import_jsx_runtime5.jsx)("p", {
          children: "There is currently no logs"
        })]
      });
    }
    return (0, import_jsx_runtime5.jsxs)(TabWrapper, {
      children: [(0, import_jsx_runtime5.jsx)(LastUpdated, {
        time: timing
      }), (0, import_jsx_runtime5.jsx)("ul", {
        children: logs.map((log, i) => (0, import_jsx_runtime5.jsx)("li", {
          children: getLogString(log)
        }, i))
      })]
    });
  };
  var import_core = __require("@blueprintjs/core");
  var import_jsx_runtime6 = __require("react/jsx-runtime");
  var RowStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "0.6rem"
  };
  var MotorPidPanel = ({ev3}) => {
    if (!ev3) {
      return (0, import_jsx_runtime6.jsx)(TabWrapper, {
        children: "EV3 not found in context. Did you call saveToContext('ev3', ev3);"
      });
    }
    const leftMotor = ev3.get("leftMotor");
    const rightMotor = ev3.get("rightMotor");
    if (!leftMotor || !rightMotor) {
      return (0, import_jsx_runtime6.jsx)(TabWrapper, {
        children: "Motor not found"
      });
    }
    const onChangeProportional = value => {
      ev3.get("leftMotor").pid.proportionalGain = value;
      ev3.get("rightMotor").pid.proportionalGain = value;
    };
    const onChangeIntegral = value => {
      ev3.get("leftMotor").pid.integralGain = value;
      ev3.get("rightMotor").pid.integralGain = value;
    };
    const onChangeDerivative = value => {
      ev3.get("leftMotor").pid.derivativeGain = value;
      ev3.get("rightMotor").pid.derivativeGain = value;
    };
    return (0, import_jsx_runtime6.jsxs)(TabWrapper, {
      children: [(0, import_jsx_runtime6.jsxs)("div", {
        style: RowStyle,
        children: [(0, import_jsx_runtime6.jsx)("span", {
          children: "Proportional Gain: "
        }), (0, import_jsx_runtime6.jsx)(import_core.NumericInput, {
          defaultValue: ev3.get("leftMotor").pid.proportionalGain,
          onValueChange: onChangeProportional,
          stepSize: 0.01,
          minorStepSize: null
        })]
      }), (0, import_jsx_runtime6.jsxs)("div", {
        style: RowStyle,
        children: [(0, import_jsx_runtime6.jsx)("span", {
          children: "Integral Gain: "
        }), (0, import_jsx_runtime6.jsx)(import_core.NumericInput, {
          defaultValue: ev3.get("leftMotor").pid.integralGain,
          onValueChange: onChangeIntegral,
          stepSize: 0.01,
          minorStepSize: null
        })]
      }), (0, import_jsx_runtime6.jsxs)("div", {
        style: RowStyle,
        children: [(0, import_jsx_runtime6.jsx)("span", {
          children: "Derivative Gain: "
        }), (0, import_jsx_runtime6.jsx)(import_core.NumericInput, {
          defaultValue: ev3.get("leftMotor").pid.derivativeGain,
          onValueChange: onChangeDerivative,
          stepSize: 0.01,
          minorStepSize: null
        })]
      })]
    });
  };
  var import_react4 = __require("react");
  var import_jsx_runtime7 = __require("react/jsx-runtime");
  var UltrasonicSensorPanel = ({ev3}) => {
    const ultrasonicSensor = ev3 == null ? void 0 : ev3.get("ultrasonicSensor");
    const [timing, distanceSensed] = useFetchFromSimulation(() => {
      if (ultrasonicSensor === void 0) {
        return null;
      }
      return ultrasonicSensor.sense();
    }, 1e3);
    if (!ev3) {
      return (0, import_jsx_runtime7.jsx)(TabWrapper, {
        children: "EV3 not found in context. Did you call saveToContext('ev3', ev3);"
      });
    }
    if (timing === null) {
      return (0, import_jsx_runtime7.jsx)(TabWrapper, {
        children: "Loading ultrasonic sensor"
      });
    }
    if (distanceSensed === null) {
      return (0, import_jsx_runtime7.jsx)(TabWrapper, {
        children: "Ultrasonic sensor not found"
      });
    }
    return (0, import_jsx_runtime7.jsxs)(TabWrapper, {
      children: [(0, import_jsx_runtime7.jsx)(LastUpdated, {
        time: timing
      }), (0, import_jsx_runtime7.jsx)("div", {
        children: (0, import_jsx_runtime7.jsxs)("p", {
          children: ["Distance: ", distanceSensed]
        })
      })]
    });
  };
  var import_core2 = __require("@blueprintjs/core");
  var import_jsx_runtime8 = __require("react/jsx-runtime");
  var RowStyle2 = {
    display: "flex",
    flexDirection: "row",
    gap: "0.6rem"
  };
  var WheelPidPanel = ({ev3}) => {
    if (!ev3) {
      return (0, import_jsx_runtime8.jsx)(TabWrapper, {
        children: "EV3 not found in context. Did you call saveToContext('ev3', ev3);"
      });
    }
    if (!ev3.get("backLeftWheel") || !ev3.get("backRightWheel") || !ev3.get("frontLeftWheel") || !ev3.get("frontRightWheel")) {
      return (0, import_jsx_runtime8.jsx)(TabWrapper, {
        children: "Wheel not found"
      });
    }
    const onChangeProportional = value => {
      ev3.get("backLeftWheel").pid.proportionalGain = value;
      ev3.get("backRightWheel").pid.proportionalGain = value;
      ev3.get("frontLeftWheel").pid.proportionalGain = value;
      ev3.get("frontRightWheel").pid.proportionalGain = value;
    };
    const onChangeIntegral = value => {
      ev3.get("backLeftWheel").pid.integralGain = value;
      ev3.get("backRightWheel").pid.integralGain = value;
      ev3.get("frontLeftWheel").pid.integralGain = value;
      ev3.get("frontRightWheel").pid.integralGain = value;
    };
    const onChangeDerivative = value => {
      ev3.get("backLeftWheel").pid.derivativeGain = value;
      ev3.get("backRightWheel").pid.derivativeGain = value;
      ev3.get("frontLeftWheel").pid.derivativeGain = value;
      ev3.get("frontRightWheel").pid.derivativeGain = value;
    };
    return (0, import_jsx_runtime8.jsxs)(TabWrapper, {
      children: [(0, import_jsx_runtime8.jsxs)("div", {
        style: RowStyle2,
        children: [(0, import_jsx_runtime8.jsx)("span", {
          children: "Proportional Gain: "
        }), (0, import_jsx_runtime8.jsx)(import_core2.NumericInput, {
          defaultValue: ev3.get("backLeftWheel").pid.proportionalGain,
          onValueChange: onChangeProportional,
          stepSize: 1,
          minorStepSize: null
        })]
      }), (0, import_jsx_runtime8.jsxs)("div", {
        style: RowStyle2,
        children: [(0, import_jsx_runtime8.jsx)("span", {
          children: "Integral Gain: "
        }), (0, import_jsx_runtime8.jsx)(import_core2.NumericInput, {
          defaultValue: ev3.get("backLeftWheel").pid.integralGain,
          onValueChange: onChangeIntegral,
          stepSize: 0.01,
          minorStepSize: null
        })]
      }), (0, import_jsx_runtime8.jsxs)("div", {
        style: RowStyle2,
        children: [(0, import_jsx_runtime8.jsx)("span", {
          children: "Derivative Gain: "
        }), (0, import_jsx_runtime8.jsx)(import_core2.NumericInput, {
          defaultValue: ev3.get("backLeftWheel").pid.derivativeGain,
          onValueChange: onChangeDerivative,
          stepSize: 0.01,
          minorStepSize: null
        })]
      })]
    });
  };
  var import_jsx_runtime9 = __require("react/jsx-runtime");
  var WrapperStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem"
  };
  var CanvasStyle = {
    width: 900,
    height: 500,
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.2)"
  };
  var bottomPanelStyle = {
    width: 900,
    height: 200,
    backgroundColor: "#1a2530",
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.2)"
  };
  var SimulationCanvas = ({context, isOpen}) => {
    const ref = (0, import_react5.useRef)(null);
    const sensorRef = (0, import_react5.useRef)(null);
    const [currentState, setCurrentState] = (0, import_react5.useState)("unintialized");
    const world = context.context.moduleContexts.robot_simulation.state.world;
    const ev3 = context.context.moduleContexts.robot_simulation.state.ev3;
    const robotConsole = world.robotConsole;
    (0, import_react5.useEffect)(() => {
      const startThreeAndRapierEngines = () => __async(void 0, null, function* () {
        setCurrentState(world.state);
      });
      const attachRenderDom = () => {
        if (ref.current) {
          ref.current.replaceChildren(world.render.getElement());
        }
        if (!ev3) {
          return;
        }
        if (sensorRef.current) {
          sensorRef.current.replaceChildren(ev3.get("colorSensor").renderer.getElement());
        }
      };
      if (currentState === "unintialized") {
        startThreeAndRapierEngines();
      }
      if (currentState === "ready" || currentState === "running") {
        attachRenderDom();
      }
      if (currentState === "loading") {
        setTimeout(() => {
          setCurrentState("unintialized");
        }, 500);
      }
    }, [currentState]);
    (0, import_react5.useEffect)(() => {
      if (isOpen) {
        world.start();
      } else {
        world.pause();
      }
    }, [isOpen]);
    return (0, import_jsx_runtime9.jsxs)("div", {
      style: WrapperStyle,
      children: [(0, import_jsx_runtime9.jsx)("div", {
        style: CanvasStyle,
        children: (0, import_jsx_runtime9.jsx)("div", {
          ref,
          children: currentState
        })
      }), (0, import_jsx_runtime9.jsx)("div", {
        style: bottomPanelStyle,
        children: (0, import_jsx_runtime9.jsxs)(import_core3.Tabs, {
          id: "TabsExample",
          children: [(0, import_jsx_runtime9.jsx)(import_core3.Tab, {
            id: "suspensionPid",
            title: "Suspension PID",
            panel: (0, import_jsx_runtime9.jsx)(WheelPidPanel, {
              ev3
            })
          }), (0, import_jsx_runtime9.jsx)(import_core3.Tab, {
            id: "motorPid",
            title: "Motor PID",
            panel: (0, import_jsx_runtime9.jsx)(MotorPidPanel, {
              ev3
            })
          }), (0, import_jsx_runtime9.jsx)(import_core3.Tab, {
            id: "colorSensor",
            title: "Color Sensor",
            panel: (0, import_jsx_runtime9.jsx)(ColorSensorPanel, {
              ev3
            })
          }), (0, import_jsx_runtime9.jsx)(import_core3.Tab, {
            id: "ultrasonicSensor",
            title: "Ultrasonic Sensor",
            panel: (0, import_jsx_runtime9.jsx)(UltrasonicSensorPanel, {
              ev3
            })
          }), (0, import_jsx_runtime9.jsx)(import_core3.Tab, {
            id: "consolePanel",
            title: "Console",
            panel: (0, import_jsx_runtime9.jsx)(ConsolePanel, {
              robot_console: robotConsole
            })
          })]
        })
      })]
    });
  };
  var import_react6 = __require("react");
  var import_jsx_runtime10 = __require("react/jsx-runtime");
  var TabUi = ({onOpenCanvas}) => {
    return (0, import_jsx_runtime10.jsxs)("div", {
      children: [(0, import_jsx_runtime10.jsx)("p", {
        children: "Welcome to robot simulator."
      }), (0, import_jsx_runtime10.jsx)("button", {
        onClick: () => {
          onOpenCanvas();
        },
        children: "Open simulation"
      })]
    });
  };
  var import_jsx_runtime11 = __require("react/jsx-runtime");
  var Main = ({context}) => {
    const [isCanvasShowing, setIsCanvasShowing] = (0, import_react7.useState)(false);
    return (0, import_jsx_runtime11.jsxs)("div", {
      children: [(0, import_jsx_runtime11.jsx)(TabUi, {
        onOpenCanvas: () => {
          setIsCanvasShowing(true);
        }
      }), (0, import_jsx_runtime11.jsx)(Modal, {
        isOpen: isCanvasShowing,
        onClose: () => {
          setIsCanvasShowing(false);
        },
        children: (0, import_jsx_runtime11.jsx)(SimulationCanvas, {
          context,
          isOpen: isCanvasShowing
        })
      })]
    });
  };
  var import_jsx_runtime12 = __require("react/jsx-runtime");
  var RobotSimulation_default = {
    toSpawn(context) {
      var _a, _b;
      const worldState = (_b = (_a = context.context.moduleContexts.robot_simulation.state) == null ? void 0 : _a.world) == null ? void 0 : _b.state;
      return worldState !== void 0;
    },
    body: context => (0, import_jsx_runtime12.jsx)(Main, {
      context
    }),
    label: "Sample Tab",
    iconName: "build"
  };
  return __toCommonJS(RobotSimulation_exports);
};