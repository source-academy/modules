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
    allHeap: () => allHeap,
    doneShowRoot: () => doneShowRoot,
    endFlip: () => endFlip,
    generateMemory: () => generateMemory,
    globalState: () => globalState,
    initialize_memory: () => initialize_memory,
    initialize_tag: () => initialize_tag,
    newAssign: () => newAssign,
    newCommand: () => newCommand,
    newCopy: () => newCopy,
    newNew: () => newNew,
    newPop: () => newPop,
    newPush: () => newPush,
    resetRoots: () => resetRoots,
    resetSpace: () => resetSpace,
    scanFlip: () => scanFlip,
    showRoots: () => showRoots,
    startFlip: () => startFlip,
    updateRoots: () => updateRoots,
    updateSlotSegment: () => updateSlotSegment
  });
  var import_rttcErrors = __require("js-slang/dist/errors/rttcErrors");
  var import_base = __require("js-slang/dist/errors/base");
  function chunk(arr, size) {
    if (!Number.isInteger(size) || size <= 0) throw new Error("Size must be an integer greater than zero.");
    const chunkLength = Math.ceil(arr.length / size);
    const result = Array(chunkLength);
    for (let index = 0; index < chunkLength; index++) {
      const start = index * size;
      const end = start + size;
      result[index] = arr.slice(start, end);
    }
    return result;
  }
  function last(arr) {
    return arr[arr.length - 1];
  }
  function range(start, end, step = 1) {
    if (end == null) {
      end = start;
      start = 0;
    }
    if (!Number.isInteger(step) || step === 0) throw new Error(`The step value must be a non-zero integer.`);
    const length = Math.max(Math.ceil((end - start) / step), 0);
    const result = new Array(length);
    for (let i = 0; i < length; i++) result[i] = start + i * step;
    return result;
  }
  function isPrimitive(value) {
    return value == null || typeof value !== "object" && typeof value !== "function";
  }
  function isTypedArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
  }
  function clone(obj) {
    if (isPrimitive(obj)) return obj;
    if (Array.isArray(obj) || isTypedArray(obj) || obj instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && obj instanceof SharedArrayBuffer) return obj.slice(0);
    const prototype = Object.getPrototypeOf(obj);
    if (prototype == null) return Object.assign(Object.create(prototype), obj);
    const Constructor = prototype.constructor;
    if (obj instanceof Date || obj instanceof Map || obj instanceof Set) return new Constructor(obj);
    if (obj instanceof RegExp) {
      const newRegExp = new Constructor(obj);
      newRegExp.lastIndex = obj.lastIndex;
      return newRegExp;
    }
    if (obj instanceof DataView) return new Constructor(obj.buffer.slice(0));
    if (obj instanceof Error) {
      let newError;
      if (obj instanceof AggregateError) newError = new Constructor(obj.errors, obj.message, {
        cause: obj.cause
      }); else newError = new Constructor(obj.message, {
        cause: obj.cause
      });
      newError.stack = obj.stack;
      Object.assign(newError, obj);
      return newError;
    }
    if (typeof File !== "undefined" && obj instanceof File) return new Constructor([obj], obj.name, {
      type: obj.type,
      lastModified: obj.lastModified
    });
    if (typeof obj === "object") return Object.assign(Object.create(prototype), obj);
    return obj;
  }
  var import_context = __toESM(__require("js-slang/context"), 1);
  function getInitialState() {
    return {
      ROW: 10,
      COLUMN: 32,
      MEMORY_SIZE: -99,
      TO_SPACE: -1,
      FROM_SPACE: -1,
      memory: [],
      memoryHeaps: [],
      commandHeap: [],
      toMemoryMatrix: [],
      fromMemoryMatrix: [],
      tags: [],
      typeTag: [],
      flips: [],
      TAG_SLOT: 0,
      SIZE_SLOT: 1,
      FIRST_CHILD_SLOT: 2,
      LAST_CHILD_SLOT: 3,
      ROOTS: []
    };
  }
  var globalState = getInitialState();
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
  function generateMemory() {
    const rawToMemory = range(globalState.FROM_SPACE);
    const rawFromMemory = range(globalState.FROM_SPACE, globalState.MEMORY_SIZE);
    globalState.toMemoryMatrix = chunk(rawToMemory, globalState.COLUMN);
    globalState.fromMemoryMatrix = chunk(rawFromMemory, globalState.COLUMN);
    const obj = {
      type: "Initialize Memory",
      to: globalState.TO_SPACE,
      from: globalState.FROM_SPACE,
      heap: [],
      left: -1,
      right: -1,
      sizeLeft: 0,
      sizeRight: 0,
      desc: "Memory initially empty.",
      leftDesc: "",
      rightDesc: "",
      scan: -1,
      free: -1
    };
    globalState.commandHeap.push(obj);
  }
  function resetSpace(space, heap) {
    if (heap.length !== globalState.MEMORY_SIZE) {
      throw new import_base.GeneralRuntimeError(`${resetSpace.name}: Provided heap was of size ${heap.length}, required size ${globalState.MEMORY_SIZE}`);
    }
    const newHeap = [];
    if (space === "to") {
      for (let i = 0; i < globalState.FROM_SPACE; i += 1) {
        newHeap.push(heap[i]);
      }
      for (let i = globalState.FROM_SPACE; i < globalState.MEMORY_SIZE; i += 1) {
        newHeap.push(0);
      }
    } else {
      for (let i = 0; i < globalState.FROM_SPACE; i += 1) {
        newHeap.push(0);
      }
      for (let i = globalState.FROM_SPACE; i < globalState.MEMORY_SIZE; i += 1) {
        newHeap.push(heap[i]);
      }
    }
    return newHeap;
  }
  function initialize_memory(memorySize) {
    if (memorySize % 2 !== 0) memorySize++;
    globalState.MEMORY_SIZE = memorySize;
    globalState.ROW = Math.ceil(globalState.MEMORY_SIZE / globalState.COLUMN);
    globalState.TO_SPACE = 0;
    globalState.FROM_SPACE = globalState.MEMORY_SIZE / 2;
    import_context.default.moduleContexts.copy_gc.state = globalState;
    generateMemory();
  }
  function newCommand(type, toSpace, fromSpace, left, right, sizeLeft, sizeRight, heap, description, firstDesc, lastDesc) {
    globalState.memory = [];
    globalState.memory.push(...heap);
    const obj = {
      type,
      to: toSpace,
      from: fromSpace,
      heap: globalState.memory,
      left,
      right,
      sizeLeft,
      sizeRight,
      desc: description,
      leftDesc: firstDesc,
      rightDesc: lastDesc,
      scan: -1,
      free: -1
    };
    globalState.commandHeap.push(obj);
  }
  function newCopy(left, right, heap) {
    const {from: fromSpace, to: toSpace} = last(globalState.commandHeap);
    const newSizeLeft = heap[left + globalState.SIZE_SLOT];
    const newSizeRight = heap[right + globalState.SIZE_SLOT];
    const desc = `Copying node ${left} to ${right}`;
    newCommand("Copy", toSpace, fromSpace, left, right, newSizeLeft, newSizeRight, heap, desc, "index", "free");
  }
  function endFlip(left, heap) {
    const {from: fromSpace, to: toSpace} = last(globalState.commandHeap);
    const newSizeLeft = heap[left + globalState.SIZE_SLOT];
    const desc = "Flip finished";
    newCommand("Flip", toSpace, fromSpace, left, -1, newSizeLeft, 0, heap, desc, "free", "");
    updateFlip();
  }
  function updateRoots(array) {
    globalState.ROOTS.push(...array);
  }
  function resetRoots() {
    globalState.ROOTS = [];
  }
  function startFlip(toSpace, fromSpace, heap) {
    const desc = "Memory is exhausted. Start stop and copy garbage collector.";
    newCommand("Start of Cheneys", toSpace, fromSpace, -1, -1, 0, 0, heap, desc, "", "");
    updateFlip();
  }
  function newPush(left, right, heap) {
    const {from: fromSpace, to: toSpace} = last(globalState.commandHeap);
    const desc = `Push OS update memory ${left} and ${right}.`;
    newCommand("Push", toSpace, fromSpace, left, right, 1, 1, heap, desc, "last child address slot", "new child pushed");
  }
  function newPop(res, left, right, heap) {
    const {from: fromSpace, to: toSpace} = last(globalState.commandHeap);
    const newRes = res;
    const desc = `Pop OS from memory ${left}, with value ${newRes}.`;
    newCommand("Pop", toSpace, fromSpace, left, right, 1, 1, heap, desc, "popped memory", "last child address slot");
  }
  function doneShowRoot(heap) {
    const toSpace = 0;
    const fromSpace = 0;
    const desc = "All root nodes are copied";
    newCommand("Copied Roots", toSpace, fromSpace, -1, -1, 0, 0, heap, desc, "", "");
  }
  function showRoots(left, heap) {
    const {from: fromSpace, to: toSpace} = last(globalState.commandHeap);
    const newSizeLeft = heap[left + globalState.SIZE_SLOT];
    const desc = `Roots: node ${left}`;
    newCommand("Showing Roots", toSpace, fromSpace, left, -1, newSizeLeft, 0, heap, desc, "roots", "");
  }
  function newAssign(res, left, heap) {
    const {from: fromSpace, to: toSpace} = last(globalState.commandHeap);
    const newRes = res;
    const desc = `Assign memory [${left}] with ${newRes}.`;
    newCommand("Assign", toSpace, fromSpace, left, -1, 1, 1, heap, desc, "assigned memory", "");
  }
  function newNew(left, heap) {
    const {from: fromSpace, to: toSpace} = last(globalState.commandHeap);
    const newSizeLeft = heap[left + globalState.SIZE_SLOT];
    const desc = `New node starts in [${left}].`;
    newCommand("New", toSpace, fromSpace, left, -1, newSizeLeft, 0, heap, desc, "new memory allocated", "");
  }
  function scanFlip(left, right, scan, free, heap) {
    const {from: fromSpace, to: toSpace} = last(globalState.commandHeap);
    globalState.memory = clone(heap);
    let newDesc = `Scanning node at ${left} for children node ${scan} and ${free}`;
    if (scan) {
      if (free) {
        newDesc = `Scanning node at ${left} for children node ${scan} and ${free}`;
      } else {
        newDesc = `Scanning node at ${left} for children node ${scan}`;
      }
    } else if (free) {
      newDesc = `Scanning node at ${left} for children node ${free}`;
    }
    const obj = {
      type: "Scan",
      to: toSpace,
      from: fromSpace,
      heap: globalState.memory,
      left,
      right,
      sizeLeft: 1,
      sizeRight: 1,
      scan,
      free,
      desc: newDesc,
      leftDesc: "scan",
      rightDesc: "free"
    };
    globalState.commandHeap.push(obj);
  }
  function updateSlotSegment(tag, size, first, last2) {
    if (tag >= 0) {
      globalState.TAG_SLOT = tag;
    }
    if (size >= 0) {
      globalState.SIZE_SLOT = size;
    }
    if (first >= 0) {
      globalState.FIRST_CHILD_SLOT = first;
    }
    if (last2 >= 0) {
      globalState.LAST_CHILD_SLOT = last2;
    }
  }
  return __toCommonJS(index_exports);
};