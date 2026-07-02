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
    COMMAND2["START"] = "Mark and Sweep Start";
    COMMAND2["END"] = "End of Garbage Collector";
    COMMAND2["RESET"] = "Sweep Reset";
    COMMAND2["SHOW_MARKED"] = "Marked Roots";
    COMMAND2["MARK"] = "Mark";
    COMMAND2["SWEEP"] = "Sweep";
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
  var MarkSweep = ({debuggerCtx}) => {
    const {commandHeap, columnCount: columnSize, flips, memoryMatrix, MARKED: marked, ROOTS: roots, tags, UNMARKED: unmarked} = getModuleState(debuggerCtx, "mark_sweep");
    const [value, setValue] = import_react.default.useState(0);
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
    if (value < commandHeap.length) {
      const {type: command, desc: description, left: firstChild, heap, right: lastChild, leftDesc, queue, rightDesc} = commandHeap[value];
      const getMemoryColor = indexValue => {
        const value2 = heap ? heap[indexValue] : 0;
        let color = "";
        if (command === COMMAND.SHOW_MARKED && roots.includes(indexValue)) {
          color = "magenta";
        } else if (isTag(heap[indexValue - MARK_SLOT])) {
          if (value2 === marked) {
            color = "red";
          } else if (value2 === unmarked) {
            color = "black";
          }
        } else if (!value2) {
          color = "#707070";
        } else if (isTag(value2)) {
          color = "salmon";
        } else {
          color = "lightblue";
        }
        return color;
      };
      const getBackgroundColor = indexValue => {
        const size1 = commandHeap[value].sizeLeft;
        const size2 = commandHeap[value].sizeRight;
        let color = "";
        if (command === COMMAND.SHOW_MARKED && roots.includes(indexValue)) {
          color = "#42a870";
        } else if (indexValue >= firstChild && indexValue < firstChild + size1) {
          color = "#42a870";
        } else if (indexValue >= lastChild && indexValue < lastChild + size2) {
          color = "#f0d60e";
        }
        return color;
      };
      return (0, import_jsx_runtime.jsxs)("div", {
        children: [(0, import_jsx_runtime.jsxs)("div", {
          children: [(0, import_jsx_runtime.jsxs)("p", {
            children: ["This is a visualiser for mark and sweep garbage collector. Check the guide", " ", (0, import_jsx_runtime.jsx)("a", {
              href: "https://github.com/source-academy/modules/wiki/%5Bcopy_gc-&-mark_sweep%5D-User-Guide",
              children: "here"
            }), "."]
          }), (0, import_jsx_runtime.jsx)("h3", {
            children: command
          }), (0, import_jsx_runtime.jsx)("p", {
            children: description
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
              }), (0, import_jsx_runtime.jsxs)("span", {
                children: [" ", leftDesc, " "]
              })]
            }), rightDesc ? (0, import_jsx_runtime.jsxs)("div", {
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
                children: [" ", rightDesc, " "]
              })]
            }) : false]
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
              max: Math.max(commandHeap.length - 1, 0),
              onChange: setValue,
              value: value <= commandHeap.length ? value : 0,
              labelValues: flips,
              labelRenderer: val => flips.includes(val) ? "^" : `${val}`
            })
          })]
        }), (0, import_jsx_runtime.jsxs)("div", {
          children: [(0, import_jsx_runtime.jsxs)("div", {
            children: [(0, import_jsx_runtime.jsx)("div", {
              children: memoryMatrix.length > 0 && memoryMatrix.map((item, rowIndex) => (0, import_jsx_runtime.jsxs)("div", {
                style: {
                  display: "flex",
                  flexDirection: "row"
                },
                children: [(0, import_jsx_runtime.jsx)("span", {
                  style: {
                    width: 30
                  },
                  children: rowIndex * columnSize
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
            }), (0, import_jsx_runtime.jsx)("div", {
              children: queue.length && (0, import_jsx_runtime.jsxs)("div", {
                children: [(0, import_jsx_runtime.jsx)("br", {}), (0, import_jsx_runtime.jsx)("span", {
                  children: " Queue: ["
                }), queue.map(child => (0, import_jsx_runtime.jsxs)("span", {
                  style: {
                    fontSize: 10
                  },
                  children: [" ", child, ", "]
                })), (0, import_jsx_runtime.jsx)("span", {
                  children: " ] "
                })]
              })
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
          }), (0, import_jsx_runtime.jsxs)("div", {
            style: {
              display: "flex",
              flexDirection: "row",
              marginTop: 10
            },
            children: [(0, import_jsx_runtime.jsx)("div", {
              style: {
                flex: 1
              },
              children: (0, import_jsx_runtime.jsx)("span", {
                children: " MARK_SLOT: "
              })
            }), (0, import_jsx_runtime.jsxs)("div", {
              style: {
                flex: 1
              },
              children: [(0, import_jsx_runtime.jsx)("canvas", {
                width: 10,
                height: 10,
                style: {
                  backgroundColor: "red"
                }
              }), (0, import_jsx_runtime.jsx)("span", {
                children: " marked"
              })]
            }), (0, import_jsx_runtime.jsxs)("div", {
              style: {
                flex: 1
              },
              children: [(0, import_jsx_runtime.jsx)("canvas", {
                width: 10,
                height: 10,
                style: {
                  backgroundColor: "black"
                }
              }), (0, import_jsx_runtime.jsx)("span", {
                children: " unmarked"
              })]
            })]
          })]
        })]
      });
    }
    return (0, import_jsx_runtime.jsxs)("div", {
      children: [(0, import_jsx_runtime.jsxs)("p", {
        children: ["This is a visualiser for mark and sweep garbage collector. Check the guide", " ", (0, import_jsx_runtime.jsx)("a", {
          href: "https://github.com/source-academy/modules/wiki/%5Bcopy_gc-&-mark_sweep%5D-User-Guide",
          children: "here"
        }), "."]
      }), (0, import_jsx_runtime.jsxs)("p", {
        children: [" Call the function ", (0, import_jsx_runtime.jsx)("code", {
          children: "initialize_memory()"
        }), " in your code to start. "]
      })]
    });
  };
  var MARK_SLOT = 1;
  var index_default = defineTab({
    toSpawn: context => {
      const state = getModuleState(context, "mark_sweep");
      return state !== null;
    },
    body: debuggerContext => (0, import_jsx_runtime.jsx)(MarkSweep, {
      debuggerCtx: debuggerContext
    }),
    label: "Mark Sweep Garbage Collector",
    iconName: "heat-grid"
  });
  return __toCommonJS(index_exports);
};