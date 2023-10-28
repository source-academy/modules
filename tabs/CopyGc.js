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
  var CopyGc_exports = {};
  __export(CopyGc_exports, {
    default: () => CopyGc_default
  });
  var import_react = __toESM(__require("react"), 1);
  var import_core = __require("@blueprintjs/core");
  var import_jsx_runtime = __require("react/jsx-runtime");
  var CopyGC = class extends import_react.default.Component {
    constructor(props) {
      super(props);
      this.initialize_state = () => {
        const {debuggerContext} = this.props;
        const functions = debuggerContext.result.value;
        const memorySize = functions.get_memory_size();
        const column = functions.get_column_size();
        const tags = functions.get_tags();
        const commandHeap = functions.get_command();
        let heap = [];
        let toSpace = -1;
        let command = "";
        let firstChild = -1;
        let lastChild = -1;
        let description = "";
        let leftDesc = "";
        let rightDesc = "";
        if (commandHeap[0]) {
          const currentHeap = commandHeap[0];
          heap = currentHeap.heap;
          toSpace = currentHeap.to;
          command = currentHeap.type;
          firstChild = currentHeap.left;
          lastChild = currentHeap.right;
          description = currentHeap.desc;
          leftDesc = currentHeap.leftDesc;
          rightDesc = currentHeap.rightDesc;
        }
        const toMemoryMatrix = functions.get_to_memory_matrix();
        const fromMemoryMatrix = functions.get_from_memory_matrix();
        const flips = functions.get_flips();
        this.setState(() => {
          const running = true;
          return {
            memorySize,
            toSpace,
            column,
            tags,
            heap,
            toMemoryMatrix,
            fromMemoryMatrix,
            flips,
            commandHeap,
            command,
            firstChild,
            lastChild,
            description,
            leftDesc,
            rightDesc,
            running
          };
        });
      };
      this.sliderShift = newValue => {
        this.setState(() => {
          const {commandHeap} = this.state;
          return {
            value: newValue,
            heap: commandHeap[newValue].heap,
            toSpace: commandHeap[newValue].to,
            command: commandHeap[newValue].type,
            firstChild: commandHeap[newValue].left,
            lastChild: commandHeap[newValue].right,
            description: commandHeap[newValue].desc,
            leftDesc: commandHeap[newValue].leftDesc,
            rightDesc: commandHeap[newValue].rightDesc
          };
        });
      };
      this.handlePlus = () => {
        let {value} = this.state;
        const lengthOfFunction = this.getlengthFunction();
        if (value < lengthOfFunction - 1) {
          value += 1;
          this.setState(() => {
            const {commandHeap} = this.state;
            return {
              value,
              heap: commandHeap[value].heap,
              toSpace: commandHeap[value].to,
              command: commandHeap[value].type,
              firstChild: commandHeap[value].left,
              lastChild: commandHeap[value].right,
              description: commandHeap[value].desc,
              leftDesc: commandHeap[value].leftDesc,
              rightDesc: commandHeap[value].rightDesc
            };
          });
        }
      };
      this.handleMinus = () => {
        let {value} = this.state;
        if (value > 0) {
          value -= 1;
          this.setState(() => {
            const {commandHeap} = this.state;
            return {
              value,
              heap: commandHeap[value].heap,
              toSpace: commandHeap[value].to,
              command: commandHeap[value].type,
              firstChild: commandHeap[value].left,
              lastChild: commandHeap[value].right,
              description: commandHeap[value].desc,
              leftDesc: commandHeap[value].leftDesc,
              rightDesc: commandHeap[value].rightDesc
            };
          });
        }
      };
      this.getlengthFunction = () => {
        const {debuggerContext} = this.props;
        const commandHeap = debuggerContext.result.value ? debuggerContext.result.value.get_command() : [];
        return commandHeap.length;
      };
      this.isTag = tag => {
        const {tags} = this.state;
        return tags ? tags.includes(tag) : false;
      };
      this.getMemoryColor = indexValue => {
        const {heap} = this.state;
        const value = heap ? heap[indexValue] : 0;
        let color = "";
        if (!value) {
          color = "#707070";
        } else if (this.isTag(value)) {
          color = "salmon";
        } else {
          color = "lightblue";
        }
        return color;
      };
      this.getBackgroundColor = indexValue => {
        const {firstChild} = this.state;
        const {lastChild} = this.state;
        const {commandHeap, value} = this.state;
        const size1 = commandHeap[value].sizeLeft;
        const size2 = commandHeap[value].sizeRight;
        const {command} = this.state;
        let color = "";
        if (command === "Flip") {
          if (indexValue === firstChild) {
            color = "#42a870";
          }
          if (indexValue === lastChild) {
            color = "#f0d60e";
          }
        } else if (indexValue >= firstChild && indexValue < firstChild + size1) {
          color = "#42a870";
        } else if (indexValue >= lastChild && indexValue < lastChild + size2) {
          color = "#f0d60e";
        }
        return color;
      };
      this.renderLabel = val => {
        const {flips} = this.state;
        return flips.includes(val) ? "^" : `${val}`;
      };
      this.state = {
        value: 0,
        memorySize: 0,
        toSpace: 0,
        column: 0,
        tags: [],
        heap: [],
        commandHeap: [],
        flips: [0],
        toMemoryMatrix: [],
        fromMemoryMatrix: [],
        firstChild: -1,
        lastChild: -1,
        command: "",
        description: "",
        rightDesc: "",
        leftDesc: "",
        running: false
      };
    }
    componentDidMount() {
      const {debuggerContext} = this.props;
      if (debuggerContext && debuggerContext.result && debuggerContext.result.value) {
        this.initialize_state();
      }
    }
    render() {
      const {state} = this;
      if (state.running) {
        const {toMemoryMatrix, fromMemoryMatrix} = this.state;
        const lengthOfFunction = this.getlengthFunction();
        return (0, import_jsx_runtime.jsxs)("div", {
          children: [(0, import_jsx_runtime.jsxs)("div", {
            children: [(0, import_jsx_runtime.jsxs)("p", {
              children: ["This is a visualiser for stop and copy garbage collector. Check the guide", " ", (0, import_jsx_runtime.jsx)("a", {
                href: "https://github.com/source-academy/modules/wiki/%5Bcopy_gc-&-mark_sweep%5D-User-Guide",
                children: "here"
              }), "."]
            }), (0, import_jsx_runtime.jsx)("h3", {
              children: state.command
            }), (0, import_jsx_runtime.jsxs)("p", {
              children: [" ", state.description, " "]
            }), (0, import_jsx_runtime.jsxs)("div", {
              style: {
                display: "flex",
                flexDirection: "row",
                marginTop: 10
              },
              children: [state.leftDesc ? (0, import_jsx_runtime.jsxs)("div", {
                style: {
                  flex: 1
                },
                children: [(0, import_jsx_runtime.jsx)("canvas", {
                  width: 10,
                  height: 10,
                  style: {
                    backgroundColor: "#42a870"
                  }
                }), (0, import_jsx_runtime.jsxs)("span", {
                  children: [" ", state.leftDesc, " "]
                })]
              }) : false, state.rightDesc ? (0, import_jsx_runtime.jsxs)("div", {
                style: {
                  flex: 1
                },
                children: [(0, import_jsx_runtime.jsx)("canvas", {
                  width: 10,
                  height: 10,
                  style: {
                    backgroundColor: "#f0d60e"
                  }
                }), (0, import_jsx_runtime.jsxs)("span", {
                  children: [" ", state.rightDesc, " "]
                })]
              }) : false]
            }), (0, import_jsx_runtime.jsx)("br", {}), (0, import_jsx_runtime.jsxs)("p", {
              children: ["Current step:", "   ", (0, import_jsx_runtime.jsx)(import_core.Icon, {
                icon: "remove",
                onClick: this.handleMinus
              }), "   ", state.value, "   ", (0, import_jsx_runtime.jsx)(import_core.Icon, {
                icon: "add",
                onClick: this.handlePlus
              })]
            }), (0, import_jsx_runtime.jsx)("div", {
              style: {
                padding: 5
              },
              children: (0, import_jsx_runtime.jsx)(import_core.Slider, {
                disabled: lengthOfFunction <= 1,
                min: 0,
                max: lengthOfFunction > 0 ? lengthOfFunction - 1 : 0,
                onChange: this.sliderShift,
                value: state.value <= lengthOfFunction ? state.value : 0,
                labelValues: state.flips,
                labelRenderer: this.renderLabel
              })
            })]
          }), (0, import_jsx_runtime.jsxs)("div", {
            children: [(0, import_jsx_runtime.jsxs)("div", {
              children: [(0, import_jsx_runtime.jsx)("h3", {
                children: state.toSpace === 0 ? "To Space" : "From Space"
              }), (0, import_jsx_runtime.jsx)("div", {
                children: toMemoryMatrix && toMemoryMatrix.length > 0 && toMemoryMatrix.map((item, row) => (0, import_jsx_runtime.jsxs)("div", {
                  style: {
                    display: "flex",
                    flexDirection: "row"
                  },
                  children: [(0, import_jsx_runtime.jsxs)("span", {
                    style: {
                      width: 30
                    },
                    children: [" ", row * state.column, " "]
                  }), item && item.length > 0 && item.map(content => {
                    const color = this.getMemoryColor(content);
                    const bgColor = this.getBackgroundColor(content);
                    return (0, import_jsx_runtime.jsx)("div", {
                      style: {
                        width: 14,
                        backgroundColor: bgColor
                      },
                      children: (0, import_jsx_runtime.jsx)("canvas", {
                        width: 10,
                        height: 10,
                        style: {
                          backgroundColor: color
                        }
                      })
                    });
                  })]
                }))
              })]
            }), (0, import_jsx_runtime.jsxs)("div", {
              children: [(0, import_jsx_runtime.jsx)("h3", {
                children: state.toSpace > 0 ? "To Space" : "From Space"
              }), (0, import_jsx_runtime.jsx)("div", {
                children: fromMemoryMatrix && fromMemoryMatrix.length > 0 && fromMemoryMatrix.map((item, row) => (0, import_jsx_runtime.jsxs)("div", {
                  style: {
                    display: "flex",
                    flexDirection: "row"
                  },
                  children: [(0, import_jsx_runtime.jsx)("span", {
                    style: {
                      width: 30
                    },
                    children: row * state.column + state.memorySize / 2
                  }), item && item.length > 0 ? item.map(content => {
                    const color = this.getMemoryColor(content);
                    const bgColor = this.getBackgroundColor(content);
                    return (0, import_jsx_runtime.jsx)("div", {
                      style: {
                        width: 14,
                        backgroundColor: bgColor
                      },
                      children: (0, import_jsx_runtime.jsx)("canvas", {
                        width: 10,
                        height: 10,
                        style: {
                          backgroundColor: color
                        }
                      })
                    });
                  }) : false]
                }))
              })]
            })]
          }), (0, import_jsx_runtime.jsxs)("div", {
            style: {
              display: "flex",
              flexDirection: "row",
              marginTop: 10
            },
            children: [(0, import_jsx_runtime.jsxs)("div", {
              style: {
                flex: 1
              },
              children: [(0, import_jsx_runtime.jsx)("canvas", {
                width: 10,
                height: 10,
                style: {
                  backgroundColor: "lightblue"
                }
              }), (0, import_jsx_runtime.jsx)("span", {
                children: " defined"
              })]
            }), (0, import_jsx_runtime.jsxs)("div", {
              style: {
                flex: 1
              },
              children: [(0, import_jsx_runtime.jsx)("canvas", {
                width: 10,
                height: 10,
                style: {
                  backgroundColor: "salmon"
                }
              }), (0, import_jsx_runtime.jsx)("span", {
                children: " tag"
              })]
            }), (0, import_jsx_runtime.jsxs)("div", {
              style: {
                flex: 1
              },
              children: [(0, import_jsx_runtime.jsx)("canvas", {
                width: 10,
                height: 10,
                style: {
                  backgroundColor: "#707070"
                }
              }), (0, import_jsx_runtime.jsx)("span", {
                children: " empty or undefined"
              })]
            })]
          })]
        });
      }
      return (0, import_jsx_runtime.jsxs)("div", {
        children: [(0, import_jsx_runtime.jsxs)("p", {
          children: ["This is a visualiser for stop and copy garbage collector. Check the guide", " ", (0, import_jsx_runtime.jsx)("a", {
            href: "https://github.com/source-academy/modules/wiki/%5Bcopy_gc-&-mark_sweep%5D-User-Guide",
            children: "here"
          }), "."]
        }), (0, import_jsx_runtime.jsx)("p", {
          children: " Calls the function init() at the end of your code to start. "
        })]
      });
    }
  };
  var CopyGc_default = {
    toSpawn: () => true,
    body: debuggerContext => (0, import_jsx_runtime.jsx)(CopyGC, {
      debuggerContext
    }),
    label: "Copying Garbage Collector",
    iconName: "duplicate"
  };
  return __toCommonJS(CopyGc_exports);
})()["default"];