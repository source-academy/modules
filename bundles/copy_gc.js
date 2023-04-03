require => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var copy_gc_exports = {};
  __export(copy_gc_exports, {
    allHeap: () => allHeap,
    doneShowRoot: () => doneShowRoot,
    endFlip: () => endFlip,
    generateMemory: () => generateMemory,
    init: () => init,
    initialize_memory: () => initialize_memory,
    initialize_tag: () => initialize_tag,
    newAssign: () => newAssign,
    newCommand: () => newCommand,
    newCopy: () => newCopy,
    newNew: () => newNew,
    newPop: () => newPop,
    newPush: () => newPush,
    resetFromSpace: () => resetFromSpace,
    resetRoots: () => resetRoots,
    scanFlip: () => scanFlip,
    showRoots: () => showRoots,
    startFlip: () => startFlip,
    updateRoots: () => updateRoots,
    updateSlotSegment: () => updateSlotSegment
  });
  var ROW = 10;
  var COLUMN = 32;
  var MEMORY_SIZE = -99;
  var TO_SPACE;
  var FROM_SPACE;
  var memory;
  var memoryHeaps = [];
  var commandHeap = [];
  var toMemoryMatrix;
  var fromMemoryMatrix;
  var tags;
  var typeTag;
  var flips = [];
  var TAG_SLOT = 0;
  var SIZE_SLOT = 1;
  var FIRST_CHILD_SLOT = 2;
  var LAST_CHILD_SLOT = 3;
  var ROOTS = [];
  function initialize_tag(allTag, types) {
    tags = allTag;
    typeTag = types;
  }
  function allHeap(newHeap) {
    memoryHeaps = newHeap;
  }
  function updateFlip() {
    flips.push(commandHeap.length - 1);
  }
  function generateMemory() {
    toMemoryMatrix = [];
    for (let i = 0; i < ROW / 2; i += 1) {
      memory = [];
      for (let j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE / 2; j += 1) {
        memory.push(i * COLUMN + j);
      }
      toMemoryMatrix.push(memory);
    }
    fromMemoryMatrix = [];
    for (let i = ROW / 2; i < ROW; i += 1) {
      memory = [];
      for (let j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE; j += 1) {
        memory.push(i * COLUMN + j);
      }
      fromMemoryMatrix.push(memory);
    }
    const obj = {
      type: "Initialize Memory",
      to: TO_SPACE,
      from: FROM_SPACE,
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
    commandHeap.push(obj);
  }
  function resetFromSpace(fromSpace, heap) {
    const newHeap = [];
    if (fromSpace > 0) {
      for (let i = 0; i < MEMORY_SIZE / 2; i += 1) {
        newHeap.push(heap[i]);
      }
      for (let i = MEMORY_SIZE / 2; i < MEMORY_SIZE; i += 1) {
        newHeap.push(0);
      }
    } else {
      for (let i = 0; i < MEMORY_SIZE / 2; i += 1) {
        newHeap.push(0);
      }
      for (let i = MEMORY_SIZE / 2; i < MEMORY_SIZE; i += 1) {
        newHeap.push(heap[i]);
      }
    }
    return newHeap;
  }
  function initialize_memory(memorySize) {
    MEMORY_SIZE = memorySize;
    ROW = MEMORY_SIZE / COLUMN;
    TO_SPACE = 0;
    FROM_SPACE = MEMORY_SIZE / 2;
    generateMemory();
  }
  function newCommand(type, toSpace, fromSpace, left, right, sizeLeft, sizeRight, heap, description, firstDesc, lastDesc) {
    const newType = type;
    const newToSpace = toSpace;
    const newFromSpace = fromSpace;
    const newLeft = left;
    const newRight = right;
    const newSizeLeft = sizeLeft;
    const newSizeRight = sizeRight;
    const newDesc = description;
    const newFirstDesc = firstDesc;
    const newLastDesc = lastDesc;
    memory = [];
    for (let j = 0; j < heap.length; j += 1) {
      memory.push(heap[j]);
    }
    const obj = {
      type: newType,
      to: newToSpace,
      from: newFromSpace,
      heap: memory,
      left: newLeft,
      right: newRight,
      sizeLeft: newSizeLeft,
      sizeRight: newSizeRight,
      desc: newDesc,
      leftDesc: newFirstDesc,
      rightDesc: newLastDesc,
      scan: -1,
      free: -1
    };
    commandHeap.push(obj);
  }
  function newCopy(left, right, heap) {
    const {length} = commandHeap;
    const toSpace = commandHeap[length - 1].to;
    const fromSpace = commandHeap[length - 1].from;
    const newSizeLeft = heap[left + SIZE_SLOT];
    const newSizeRight = heap[right + SIZE_SLOT];
    const desc = `Copying node ${left} to ${right}`;
    newCommand("Copy", toSpace, fromSpace, left, right, newSizeLeft, newSizeRight, heap, desc, "index", "free");
  }
  function endFlip(left, heap) {
    const {length} = commandHeap;
    const fromSpace = commandHeap[length - 1].from;
    const toSpace = commandHeap[length - 1].to;
    const newSizeLeft = heap[left + SIZE_SLOT];
    const desc = "Flip finished";
    newCommand("Flip", toSpace, fromSpace, left, -1, newSizeLeft, 0, heap, desc, "free", "");
    updateFlip();
  }
  function updateRoots(array) {
    for (let i = 0; i < array.length; i += 1) {
      ROOTS.push(array[i]);
    }
  }
  function resetRoots() {
    ROOTS = [];
  }
  function startFlip(toSpace, fromSpace, heap) {
    const desc = "Memory is exhausted. Start stop and copy garbage collector.";
    newCommand("Start of Cheneys", toSpace, fromSpace, -1, -1, 0, 0, heap, desc, "", "");
    updateFlip();
  }
  function newPush(left, right, heap) {
    const {length} = commandHeap;
    const toSpace = commandHeap[length - 1].to;
    const fromSpace = commandHeap[length - 1].from;
    const desc = `Push OS update memory ${left} and ${right}.`;
    newCommand("Push", toSpace, fromSpace, left, right, 1, 1, heap, desc, "last child address slot", "new child pushed");
  }
  function newPop(res, left, right, heap) {
    const {length} = commandHeap;
    const toSpace = commandHeap[length - 1].to;
    const fromSpace = commandHeap[length - 1].from;
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
    const {length} = commandHeap;
    const toSpace = commandHeap[length - 1].to;
    const fromSpace = commandHeap[length - 1].from;
    const newSizeLeft = heap[left + SIZE_SLOT];
    const desc = `Roots: node ${left}`;
    newCommand("Showing Roots", toSpace, fromSpace, left, -1, newSizeLeft, 0, heap, desc, "roots", "");
  }
  function newAssign(res, left, heap) {
    const {length} = commandHeap;
    const toSpace = commandHeap[length - 1].to;
    const fromSpace = commandHeap[length - 1].from;
    const newRes = res;
    const desc = `Assign memory [${left}] with ${newRes}.`;
    newCommand("Assign", toSpace, fromSpace, left, -1, 1, 1, heap, desc, "assigned memory", "");
  }
  function newNew(left, heap) {
    const {length} = commandHeap;
    const toSpace = commandHeap[length - 1].to;
    const fromSpace = commandHeap[length - 1].from;
    const newSizeLeft = heap[left + SIZE_SLOT];
    const desc = `New node starts in [${left}].`;
    newCommand("New", toSpace, fromSpace, left, -1, newSizeLeft, 0, heap, desc, "new memory allocated", "");
  }
  function scanFlip(left, right, scan, free, heap) {
    const {length} = commandHeap;
    const toSpace = commandHeap[length - 1].to;
    const fromSpace = commandHeap[length - 1].from;
    memory = [];
    for (let j = 0; j < heap.length; j += 1) {
      memory.push(heap[j]);
    }
    const newLeft = left;
    const newRight = right;
    const newScan = scan;
    const newFree = free;
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
      heap: memory,
      left: newLeft,
      right: newRight,
      sizeLeft: 1,
      sizeRight: 1,
      scan: newScan,
      free: newFree,
      desc: newDesc,
      leftDesc: "scan",
      rightDesc: "free"
    };
    commandHeap.push(obj);
  }
  function updateSlotSegment(tag, size, first, last) {
    if (tag >= 0) {
      TAG_SLOT = tag;
    }
    if (size >= 0) {
      SIZE_SLOT = size;
    }
    if (first >= 0) {
      FIRST_CHILD_SLOT = first;
    }
    if (last >= 0) {
      LAST_CHILD_SLOT = last;
    }
  }
  function get_memory_size() {
    return MEMORY_SIZE;
  }
  function get_tags() {
    return tags;
  }
  function get_command() {
    return commandHeap;
  }
  function get_flips() {
    return flips;
  }
  function get_types() {
    return typeTag;
  }
  function get_from_space() {
    return FROM_SPACE;
  }
  function get_memory_heap() {
    return memoryHeaps;
  }
  function get_to_memory_matrix() {
    return toMemoryMatrix;
  }
  function get_from_memory_matrix() {
    return fromMemoryMatrix;
  }
  function get_roots() {
    return ROOTS;
  }
  function get_slots() {
    return [TAG_SLOT, SIZE_SLOT, FIRST_CHILD_SLOT, LAST_CHILD_SLOT];
  }
  function get_to_space() {
    return TO_SPACE;
  }
  function get_column_size() {
    return COLUMN;
  }
  function get_row_size() {
    return ROW;
  }
  function init() {
    return {
      toReplString: () => "<REDACTED>",
      get_memory_size,
      get_from_space,
      get_to_space,
      get_memory_heap,
      get_tags,
      get_types,
      get_column_size,
      get_row_size,
      get_from_memory_matrix,
      get_to_memory_matrix,
      get_flips,
      get_slots,
      get_command,
      get_roots
    };
  }
  return __toCommonJS(copy_gc_exports);
}