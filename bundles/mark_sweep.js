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
    addRoots: () => addRoots,
    allHeap: () => allHeap,
    endGC: () => endGC,
    generateMemory: () => generateMemory,
    globalState: () => globalState,
    initialize_memory: () => initialize_memory,
    initialize_tag: () => initialize_tag,
    newAssign: () => newAssign,
    newCommand: () => newCommand,
    newGC: () => newGC,
    newMark: () => newMark,
    newNew: () => newNew,
    newPop: () => newPop,
    newPush: () => newPush,
    newSweep: () => newSweep,
    newUpdateSweep: () => newUpdateSweep,
    showRoot: () => showRoot,
    showRoots: () => showRoots,
    updateRoots: () => updateRoots,
    updateSlotSegment: () => updateSlotSegment
  });
  function chunk(arr, size) {
    if (!Number.isInteger(size) || size <= 0) {
      throw new Error("Size must be an integer greater than zero.");
    }
    const chunkLength = Math.ceil(arr.length / size);
    const result = Array(chunkLength);
    for (let index = 0; index < chunkLength; index++) {
      const start = index * size;
      const end = start + size;
      result[index] = arr.slice(start, end);
    }
    return result;
  }
  function range(start, end, step = 1) {
    if (end == null) {
      end = start;
      start = 0;
    }
    if (!Number.isInteger(step) || step === 0) {
      throw new Error(`The step value must be a non-zero integer.`);
    }
    const length = Math.max(Math.ceil((end - start) / step), 0);
    const result = new Array(length);
    for (let i = 0; i < length; i++) {
      result[i] = start + i * step;
    }
    return result;
  }
  function isPrimitive(value) {
    return value == null || typeof value !== "object" && typeof value !== "function";
  }
  function isTypedArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
  }
  function clone(obj) {
    if (isPrimitive(obj)) {
      return obj;
    }
    if (Array.isArray(obj) || isTypedArray(obj) || obj instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && obj instanceof SharedArrayBuffer) {
      return obj.slice(0);
    }
    const prototype = Object.getPrototypeOf(obj);
    if (prototype == null) {
      return Object.assign(Object.create(prototype), obj);
    }
    const Constructor = prototype.constructor;
    if (obj instanceof Date || obj instanceof Map || obj instanceof Set) {
      return new Constructor(obj);
    }
    if (obj instanceof RegExp) {
      const newRegExp = new Constructor(obj);
      newRegExp.lastIndex = obj.lastIndex;
      return newRegExp;
    }
    if (obj instanceof DataView) {
      return new Constructor(obj.buffer.slice(0));
    }
    if (obj instanceof Error) {
      let newError;
      if (obj instanceof AggregateError) {
        newError = new Constructor(obj.errors, obj.message, {
          cause: obj.cause
        });
      } else {
        newError = new Constructor(obj.message, {
          cause: obj.cause
        });
      }
      newError.stack = obj.stack;
      Object.assign(newError, obj);
      return newError;
    }
    if (typeof File !== "undefined" && obj instanceof File) {
      const newFile = new Constructor([obj], obj.name, {
        type: obj.type,
        lastModified: obj.lastModified
      });
      return newFile;
    }
    if (typeof obj === "object") {
      const newObject = Object.create(prototype);
      return Object.assign(newObject, obj);
    }
    return obj;
  }
  var import_context = __toESM(__require("js-slang/context"), 1);
  function getInitialState() {
    return {
      rowCount: 10,
      columnCount: 32,
      NODE_SIZE: 0,
      MEMORY_SIZE: -99,
      memory: [],
      memoryHeaps: [],
      commandHeap: [],
      memoryMatrix: [],
      tags: [],
      typeTag: [],
      flips: [],
      TAG_SLOT: 0,
      SIZE_SLOT: 1,
      FIRST_CHILD_SLOT: 2,
      LAST_CHILD_SLOT: 3,
      MARKED: 1,
      UNMARKED: 0,
      ROOTS: []
    };
  }
  var globalState = getInitialState();
  function generateMemory() {
    globalState.memoryMatrix = chunk(range(globalState.MEMORY_SIZE), globalState.columnCount);
    newCommand("Initialize Memory", -1, -1, 0, 0, [], "Memory initially empty.", "", "", []);
  }
  function updateRoots(array) {
    globalState.ROOTS.push(...array);
  }
  function initialize_memory(memorySize, nodeSize, marked, unmarked) {
    import_context.default.moduleContexts.mark_sweep.state = globalState;
    globalState.MEMORY_SIZE = memorySize;
    globalState.NODE_SIZE = nodeSize;
    const excess = globalState.MEMORY_SIZE % globalState.NODE_SIZE;
    globalState.MEMORY_SIZE -= excess;
    globalState.rowCount = Math.ceil(globalState.MEMORY_SIZE / globalState.columnCount);
    globalState.MARKED = marked;
    globalState.UNMARKED = unmarked;
    generateMemory();
  }
  function initialize_tag(allTag, types) {
    globalState.tags = allTag;
    globalState.typeTag = types;
  }
  function allHeap(newHeap) {
    globalState.memoryHeaps = newHeap;
  }
  function updateFlip() {
    globalState.flips.push(globalState.commandHeap.length - 1);
  }
  function newCommand(type, left, right, sizeLeft, sizeRight, heap, description, firstDesc, lastDesc, queue = []) {
    globalState.memory = [];
    globalState.memory.push(...heap);
    const newQueue = clone(queue);
    const obj = {
      type,
      heap: globalState.memory,
      left,
      right,
      sizeLeft,
      sizeRight,
      desc: description,
      leftDesc: firstDesc,
      rightDesc: lastDesc,
      queue: newQueue
    };
    globalState.commandHeap.push(obj);
  }
  function newSweep(left, heap) {
    const newSizeLeft = globalState.NODE_SIZE;
    const desc = `Freeing node ${left}`;
    newCommand("Sweep", left, -1, newSizeLeft, 0, heap, desc, "freed node", "");
  }
  function newMark(left, heap, queue) {
    const newSizeLeft = globalState.NODE_SIZE;
    const desc = `Marking node ${left} to be live memory`;
    newCommand("Mark", left, -1, newSizeLeft, 0, heap, desc, "marked node", "", queue);
  }
  function addRoots(arr) {
    globalState.ROOTS.push(...arr);
  }
  function showRoot(heap) {
    const desc = "All root nodes are marked";
    newCommand("Marked Roots", -1, -1, 0, 0, heap, desc, "", "");
  }
  function showRoots(heap) {
    for (let i = 0; i < globalState.ROOTS.length; i += 1) {
      showRoot(heap);
    }
    globalState.ROOTS = [];
  }
  function newUpdateSweep(right, heap) {
    const desc = `Set node ${right} to freelist`;
    newCommand("Sweep Reset", -1, right, 0, globalState.NODE_SIZE, heap, desc, "free node", "");
  }
  function newPush(left, right, heap) {
    const desc = `Push OS update memory ${left} and ${right}.`;
    newCommand("Push", left, right, 1, 1, heap, desc, "last child address slot", "new child pushed");
  }
  function newPop(res, left, right, heap) {
    const newRes = res;
    const desc = `Pop OS from memory ${left}, with value ${newRes}.`;
    newCommand("Pop", left, right, 1, 1, heap, desc, "popped memory", "last child address slot");
  }
  function newAssign(res, left, heap) {
    const newRes = res;
    const desc = `Assign memory [${left}] with ${newRes}.`;
    newCommand("Assign", left, -1, 1, 1, heap, desc, "assigned memory", "");
  }
  function newNew(left, heap) {
    const newSizeLeft = globalState.NODE_SIZE;
    const desc = `New node starts in [${left}].`;
    newCommand("New", left, -1, newSizeLeft, 0, heap, desc, "new memory allocated", "");
  }
  function newGC(heap) {
    const desc = "Memory exhausted, start Mark and Sweep Algorithm";
    newCommand("Mark and Sweep Start", -1, -1, 0, 0, heap, desc, "", "");
    updateFlip();
  }
  function endGC(heap) {
    const desc = "Result of free memory";
    newCommand("End of Garbage Collector", -1, -1, 0, 0, heap, desc, "", "");
    updateFlip();
  }
  function updateSlotSegment(tag, size, first, last) {
    if (tag >= 0) {
      globalState.TAG_SLOT = tag;
    }
    if (size >= 0) {
      globalState.SIZE_SLOT = size;
    }
    if (first >= 0) {
      globalState.FIRST_CHILD_SLOT = first;
    }
    if (last >= 0) {
      globalState.LAST_CHILD_SLOT = last;
    }
  }
  return __toCommonJS(index_exports);
};