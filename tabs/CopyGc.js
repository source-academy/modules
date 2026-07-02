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
  var index_exports = {};
  __export(index_exports, {
    default: () => index_default
  });
  var import_core = __require("@blueprintjs/core");
  var COMMAND;
  (function (COMMAND2) {
    COMMAND2["FLIP"] = "Flip";
    COMMAND2["PUSH"] = "Push";
    COMMAND2["POP"] = "Pop";
    COMMAND2["COPY"] = "Copy";
    COMMAND2["ASSIGN"] = "Assign";
    COMMAND2["NEW"] = "New";
    COMMAND2["SCAN"] = "Scan";
    COMMAND2["INIT"] = "Initialize Memory";
  })(COMMAND || (COMMAND = {}));
  function getModuleState(debuggerContext, name) {
    const {context: {moduleContexts}} = debuggerContext;
    return (name in moduleContexts) ? moduleContexts[name].state : null;
  }
  function defineTab(tab) {
    return tab;
  }
  var import_react = __toESM(__require("react"), 1);
  var import_jsx_runtime = __require("react/jsx-runtime");
  var CopyGC = ({debuggerCtx}) => {
    const {commandHeap, COLUMN: column, flips, fromMemoryMatrix, MEMORY_SIZE: memorySize, toMemoryMatrix, TO_SPACE: toSpace, tags} = getModuleState(debuggerCtx, "copy_gc");
    const [value, setValue] = import_react.default.useState(0);
    if (value < commandHeap.length) {
      const {type: command, desc: description, left: firstChild, heap, right: lastChild, leftDesc, rightDesc, sizeLeft, sizeRight} = commandHeap[value];
      const handlePlus = () => {
        if (value < commandHeap.length - 1) {
          setValue(value + 1);
        }
      };
      const handleMinus = () => {
        if (value > 0) {
          setValue(value - 1);
        }
      };
      const isTag = tag => tags.includes(tag);
      const getMemoryColor = indexValue => {
        const value2 = heap ? heap[indexValue] : 0;
        let color = "";
        if (!value2) {
          color = "#707070";
        } else if (isTag(value2)) {
          color = "salmon";
        } else {
          color = "lightblue";
        }
        return color;
      };
      const getBackgroundColor = indexValue => {
        let color = "";
        if (command === COMMAND.FLIP) {
          if (indexValue === firstChild) {
            color = "#42a870";
          }
          if (indexValue === lastChild) {
            color = "#f0d60e";
          }
        } else if (indexValue >= firstChild && indexValue < firstChild + sizeLeft) {
          color = "#42a870";
        } else if (indexValue >= lastChild && indexValue < lastChild + sizeRight) {
          color = "#f0d60e";
        }
        return color;
      };
      const renderLabel = val => flips.includes(val) ? "^" : `${val}`;
      return (0, import_jsx_runtime.jsxs)("div", {
        children: [(0, import_jsx_runtime.jsxs)("div", {
          children: [(0, import_jsx_runtime.jsxs)("p", {
            children: ["This is a visualiser for stop and copy garbage collector. Check the guide", " ", (0, import_jsx_runtime.jsx)("a", {
              href: "https://github.com/source-academy/modules/wiki/%5Bcopy_gc-&-mark_sweep%5D-User-Guide",
              children: "here"
            }), "."]
          }), (0, import_jsx_runtime.jsx)("h3", {
            children: command
          }), (0, import_jsx_runtime.jsxs)("p", {
            children: [" ", description, " "]
          }), (0, import_jsx_runtime.jsxs)("div", {
            style: {
              display: "flex",
              flexDirection: "row",
              marginTop: 10
            },
            children: [leftDesc && (0, import_jsx_runtime.jsxs)("div", {
              style: {
                flex: 1
              },
              children: [(0, import_jsx_runtime.jsx)("canvas", {
                width: 10,
                height: 10,
                style: {
                  backgroundColor: "#42a870"
                }
              }), (0, import_jsx_runtime.jsx)("span", {
                children: leftDesc
              })]
            }), rightDesc && (0, import_jsx_runtime.jsxs)("div", {
              style: {
                flex: 1
              },
              children: [(0, import_jsx_runtime.jsx)("canvas", {
                width: 10,
                height: 10,
                style: {
                  backgroundColor: "#f0d60e"
                }
              }), (0, import_jsx_runtime.jsx)("span", {
                children: rightDesc
              })]
            })]
          }), (0, import_jsx_runtime.jsx)("br", {}), (0, import_jsx_runtime.jsxs)("p", {
            children: ["Current step:", "   ", (0, import_jsx_runtime.jsx)(import_core.Icon, {
              icon: "remove",
              onClick: handleMinus
            }), "   ", value, "   ", (0, import_jsx_runtime.jsx)(import_core.Icon, {
              icon: "add",
              onClick: handlePlus
            })]
          }), (0, import_jsx_runtime.jsx)("div", {
            style: {
              padding: 5
            },
            children: (0, import_jsx_runtime.jsx)(import_core.Slider, {
              disabled: commandHeap.length <= 1,
              min: 0,
              max: commandHeap.length > 0 ? commandHeap.length - 1 : 0,
              onChange: setValue,
              value: value <= commandHeap.length ? value : 0,
              labelValues: flips,
              labelRenderer: renderLabel
            })
          })]
        }), (0, import_jsx_runtime.jsxs)("div", {
          children: [(0, import_jsx_runtime.jsxs)("div", {
            children: [(0, import_jsx_runtime.jsxs)("h3", {
              children: [toSpace === 0 ? "To" : "From", " Space"]
            }), (0, import_jsx_runtime.jsx)("div", {
              children: toMemoryMatrix.length > 0 && toMemoryMatrix.map((item, row) => (0, import_jsx_runtime.jsxs)("div", {
                style: {
                  display: "flex",
                  flexDirection: "row"
                },
                children: [(0, import_jsx_runtime.jsxs)("span", {
                  style: {
                    width: 30
                  },
                  children: [" ", row * column, " "]
                }), item.length > 0 && item.map(content => {
                  const color = getMemoryColor(content);
                  const bgColor = getBackgroundColor(content);
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
              children: toSpace > 0 ? "To Space" : "From Space"
            }), (0, import_jsx_runtime.jsx)("div", {
              children: fromMemoryMatrix.length > 0 && fromMemoryMatrix.map((item, row) => (0, import_jsx_runtime.jsxs)("div", {
                style: {
                  display: "flex",
                  flexDirection: "row"
                },
                children: [(0, import_jsx_runtime.jsx)("span", {
                  style: {
                    width: 30
                  },
                  children: row * column + memorySize / 2
                }), item.length > 0 && item.map(content => {
                  const color = getMemoryColor(content);
                  const bgColor = getBackgroundColor(content);
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
      }), (0, import_jsx_runtime.jsxs)("p", {
        children: [" Calls the function ", (0, import_jsx_runtime.jsx)("code", {
          children: "initialize_memory()"
        }), " at the end of your code to start. "]
      })]
    });
  };
  var index_default = defineTab({
    toSpawn: ctx => {
      const state = getModuleState(ctx, "copy_gc");
      return state !== null;
    },
    body: debuggerContext => (0, import_jsx_runtime.jsx)(CopyGC, {
      debuggerCtx: debuggerContext
    }),
    label: "Copying Garbage Collector",
    iconName: "duplicate"
  });
  return __toCommonJS(index_exports);
};