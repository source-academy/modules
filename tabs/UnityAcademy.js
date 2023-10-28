export default require => (() => {
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
  var UnityAcademy_exports = {};
  __export(UnityAcademy_exports, {
    default: () => UnityAcademy_default
  });
  var import_react2 = __toESM(__require("react"), 1);
  var import_core2 = __require("@blueprintjs/core");
  var import_icons2 = __require("@blueprintjs/icons");
  var UNITY_ACADEMY_BACKEND_URL = "https://unity-academy.s3.ap-southeast-1.amazonaws.com/";
  var BUILD_NAME = "ua-frontend-prod";
  var import_react = __toESM(__require("react"), 1);
  var import_react_dom = __toESM(__require("react-dom"), 1);
  var import_core = __require("@blueprintjs/core");
  var import_icons = __require("@blueprintjs/icons");
  var import_jsx_runtime = __require("react/jsx-runtime");
  function getInstance() {
    return window.unityAcademyContext;
  }
  var UnityComponent = class extends import_react.default.Component {
    render() {
      const moduleInstance = getInstance();
      return (0, import_jsx_runtime.jsxs)("div", {
        style: {
          width: "100%",
          height: "100%",
          position: "absolute",
          left: "0%",
          top: "0%",
          zIndex: "9999"
        },
        children: [(0, import_jsx_runtime.jsx)("div", {
          style: {
            backgroundColor: "rgba(100,100,100,0.75)",
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: "-1"
          },
          children: (0, import_jsx_runtime.jsx)("p", {
            id: "unity_load_info",
            style: {
              textAlign: "center",
              lineHeight: "30",
              fontSize: "23px",
              color: "cyan"
            },
            children: "Preparing to load Unity Academy..."
          })
        }), (0, import_jsx_runtime.jsx)("div", {
          id: "unity-container",
          children: (0, import_jsx_runtime.jsx)("canvas", {
            id: "unity-canvas",
            style: {
              width: "100%",
              height: "100%",
              position: "absolute"
            }
          })
        }), (0, import_jsx_runtime.jsx)(import_core.Button, {
          icon: import_icons.IconNames.CROSS,
          active: true,
          onClick: () => {
            moduleInstance.setShowUnityComponent(0);
          },
          text: "Hide Unity Academy Window",
          style: {
            position: "absolute",
            left: "0%",
            top: "0%",
            width: "15%"
          }
        }), (0, import_jsx_runtime.jsx)(import_core.Button, {
          icon: import_icons.IconNames.DISABLE,
          active: true,
          onClick: () => {
            moduleInstance.terminate();
          },
          text: "Terminate Unity Academy Instance",
          style: {
            position: "absolute",
            left: "17%",
            top: "0%",
            width: "20%"
          }
        })]
      });
    }
    componentDidMount() {
      getInstance().firstTimeLoadUnityApplication();
    }
  };
  var UNITY_CONFIG = {
    loaderUrl: `${UNITY_ACADEMY_BACKEND_URL}frontend/${BUILD_NAME}.loader.js`,
    dataUrl: `${UNITY_ACADEMY_BACKEND_URL}frontend/${BUILD_NAME}.data.gz`,
    frameworkUrl: `${UNITY_ACADEMY_BACKEND_URL}frontend/${BUILD_NAME}.framework.js.gz`,
    codeUrl: `${UNITY_ACADEMY_BACKEND_URL}frontend/${BUILD_NAME}.wasm.gz`,
    streamingAssetsUrl: `${UNITY_ACADEMY_BACKEND_URL}webgl_assetbundles`,
    companyName: "Wang Zihan @ NUS SoC 2026",
    productName: "Unity Academy (Source Academy Embedding Version)",
    productVersion: "See 'About' in the embedded frontend."
  };
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var Unity3DTab = class extends import_react2.default.Component {
    constructor(props) {
      super(props);
      this.userAgreementCheckboxChecked = false;
    }
    render() {
      let highFPSWarning;
      const currentTargetFrameRate = getInstance().getTargetFrameRate();
      if (currentTargetFrameRate > 30 && currentTargetFrameRate <= 60) {
        highFPSWarning = (0, import_jsx_runtime2.jsx)("div", {
          style: {
            color: "yellow"
          },
          children: "[Warning] You are using a target FPS higher than default value (30). Higher FPS will lead to more cost in your device's resources such as GPU, increace device temperature and battery usage and may even lead to browser not responding, crash the browser or even crash your operation system if your device really can not endure the high resource cost."
        });
      } else if (currentTargetFrameRate > 60 && currentTargetFrameRate <= 120) {
        highFPSWarning = (0, import_jsx_runtime2.jsxs)("div", {
          style: {
            color: "red"
          },
          children: ["[!!WARNING!!] You are using a target FPS that is extremely high. This FPS may lead to large cost in your device's resources such as GPU, significantly increace device temperature and battery usage and have a large chance of making browser not responding, crash the browser or even crash your operation system if your device's performance is not enough.", (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsx)("br", {}), " ***ARE YOU REALLY CONFIDENT ABOUT THE PERFORMANCE OF YOUR OWN DEVICE?***"]
        });
      } else {
        highFPSWarning = (0, import_jsx_runtime2.jsx)("div", {});
      }
      const dimensionMode = getInstance().dimensionMode;
      return (0, import_jsx_runtime2.jsxs)("div", {
        children: [(0, import_jsx_runtime2.jsx)("p", {
          children: "Click the button below to open the Unity Academy Window filling the page."
        }), (0, import_jsx_runtime2.jsx)("p", {
          children: (0, import_jsx_runtime2.jsxs)("b", {
            children: ["Current Mode: ", dimensionMode === "3d" ? "3D" : "2D"]
          })
        }), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsxs)("p", {
          children: [(0, import_jsx_runtime2.jsx)("b", {
            children: "Remember always terminate the Unity Academy application when you completely finish programming with this module"
          }), " to clean up the engine and free up memory."]
        }), (0, import_jsx_runtime2.jsx)("p", {
          children: "Otherwise it may lead to a potential waste to your device's resources (such as RAM) and battery."
        }), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsxs)("p", {
          children: [(0, import_jsx_runtime2.jsxs)("b", {
            children: ["Note that you need to use a ", (0, import_jsx_runtime2.jsx)("u", {
              children: "'Native'"
            }), " variant of Source language in order to use this module."]
          }), " If any strange error happens when using this module, please check whether you are using the 'Native' variant of Source language or not."]
        }), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsx)(import_core2.Button, {
          icon: import_icons2.IconNames.SEND_TO,
          active: true,
          onClick: () => {
            this.openUnityWindow(100);
          },
          text: "Open Unity Academy Embedded Frontend"
        }), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsx)("p", {
          children: "If the frame rate is low when you are using Unity Academy with the default resolution, try using Unity Academy with 50% resolution here:"
        }), (0, import_jsx_runtime2.jsx)("p", {
          children: "50% resolution will display Unity Academy in a smaller area with lower quality and less detailed graphics but requires less device (especially GPU) performance than the default resolution."
        }), (0, import_jsx_runtime2.jsx)(import_core2.Button, {
          icon: import_icons2.IconNames.SEND_TO,
          active: true,
          onClick: () => {
            this.openUnityWindow(50);
          },
          text: "Open with 50% resolution"
        }), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsx)("p", {
          children: "Target (Maximum) Frame Rate (Frames Per Second): "
        }), (0, import_jsx_runtime2.jsxs)("div", {
          style: {
            display: "inline-flex"
          },
          children: [(0, import_jsx_runtime2.jsx)(import_core2.NumericInput, {
            style: {
              width: 100
            },
            leftIcon: import_icons2.IconNames.REFRESH,
            value: currentTargetFrameRate,
            max: 120,
            min: 15,
            onValueChange: x => {
              getInstance().setTargetFrameRate(x);
              this.setState({});
            },
            stepSize: 1
          }), (0, import_jsx_runtime2.jsx)(import_core2.Button, {
            active: true,
            onClick: () => {
              getInstance().setTargetFrameRate(30);
              this.setState({});
            },
            text: "30"
          }), (0, import_jsx_runtime2.jsx)(import_core2.Button, {
            active: true,
            onClick: () => {
              if (confirm("Set the target frame rate higher than the default recommended value (30) ?")) {
                getInstance().setTargetFrameRate(60);
                this.setState({});
              }
            },
            text: "60"
          }), (0, import_jsx_runtime2.jsx)(import_core2.Button, {
            active: true,
            onClick: () => {
              if (confirm("Set the target frame rate higher than the default recommended value (30) ?")) {
                getInstance().setTargetFrameRate(90);
                this.setState({});
              }
            },
            text: "90"
          }), (0, import_jsx_runtime2.jsx)(import_core2.Button, {
            active: true,
            onClick: () => {
              if (confirm("Set the target frame rate higher than the default recommended value (30) ?")) {
                getInstance().setTargetFrameRate(120);
                this.setState({});
              }
            },
            text: "120"
          })]
        }), (0, import_jsx_runtime2.jsx)("p", {
          children: "The actual frame rate depends on your device's performance."
        }), highFPSWarning, (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsxs)("div", {
          children: ["Code Examples: ", (0, import_jsx_runtime2.jsx)("a", {
            href: `${UNITY_ACADEMY_BACKEND_URL}code_examples.html`,
            rel: "noopener noreferrer",
            target: "_blank",
            children: "Click Here"
          })]
        }), (0, import_jsx_runtime2.jsxs)("div", {
          children: ["3D Prefab Information: ", (0, import_jsx_runtime2.jsx)("a", {
            href: `${UNITY_ACADEMY_BACKEND_URL}webgl_assetbundles/prefab_info.html`,
            rel: "noopener noreferrer",
            target: "_blank",
            children: "Click Here"
          }), dimensionMode === "2d" && " (You need 3D mode to use prefabs.)"]
        }), (0, import_jsx_runtime2.jsx)("br", {}), (0, import_jsx_runtime2.jsxs)("div", {
          children: ["Please note that before using Unity Academy and this module, you must agree to our ", (0, import_jsx_runtime2.jsx)("a", {
            href: `${UNITY_ACADEMY_BACKEND_URL}user_agreement.html`,
            rel: "noopener noreferrer",
            target: "_blank",
            children: "User Agreement"
          })]
        }), (0, import_jsx_runtime2.jsx)("br", {}), getInstance().getUserAgreementStatus() === "new_user_agreement" && (0, import_jsx_runtime2.jsxs)("div", {
          children: [(0, import_jsx_runtime2.jsx)("b", {
            children: "The User Agreement has updated."
          }), (0, import_jsx_runtime2.jsx)("br", {})]
        }), (0, import_jsx_runtime2.jsx)(import_core2.Checkbox, {
          label: "I agree to the User Agreement",
          ref: e => {
            if (e !== null) {
              if (e.input !== null) {
                e.input.checked = getInstance().getUserAgreementStatus() === "agreed";
                this.userAgreementCheckboxChecked = e.input.checked;
              }
            }
          },
          onChange: event => {
            this.userAgreementCheckboxChecked = event.target.checked;
            getInstance().setUserAgreementStatus(this.userAgreementCheckboxChecked);
          }
        })]
      });
    }
    openUnityWindow(resolution) {
      if (!this.userAgreementCheckboxChecked) {
        alert("You must agree to the our User Agreement before using Unity Academy and this module!");
        return;
      }
      const INSTANCE = getInstance();
      if (INSTANCE === void 0) {
        alert("No running Unity application found. Please rerun your code and try again.");
        return;
      }
      INSTANCE.setShowUnityComponent(resolution);
    }
  };
  var UnityAcademy_default = {
    toSpawn(_context) {
      return getInstance() !== void 0;
    },
    body(_context) {
      return (0, import_jsx_runtime2.jsx)(Unity3DTab, {});
    },
    label: "Unity Academy",
    iconName: "cube"
  };
  return __toCommonJS(UnityAcademy_exports);
})()["default"];