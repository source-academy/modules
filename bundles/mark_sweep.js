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
  var mark_sweep_exports = {};
  __export(mark_sweep_exports, {
    addRoots: () => addRoots,
    allHeap: () => allHeap,
    endGC: () => endGC,
    generateMemory: () => generateMemory,
    init: () => init,
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
  var ROW = 10;
  var COLUMN = 32;
  var NODE_SIZE = 0;
  var MEMORY_SIZE = -99;
  var memory;
  var memoryHeaps = [];
  var commandHeap = [];
  var memoryMatrix;
  var tags;
  var typeTag;
  var flips = [];
  var TAG_SLOT = 0;
  var SIZE_SLOT = 1;
  var FIRST_CHILD_SLOT = 2;
  var LAST_CHILD_SLOT = 3;
  var MARKED = 1;
  var UNMARKED = 0;
  var ROOTS = [];
  function generateMemory() {
    memoryMatrix = [];
    for (let i = 0; i < ROW; i += 1) {
      memory = [];
      for (let j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE; j += 1) {
        memory.push(i * COLUMN + j);
      }
      memoryMatrix.push(memory);
    }
    const obj = {
      type: "Initialize Memory",
      heap: [],
      left: -1,
      right: -1,
      sizeLeft: 0,
      sizeRight: 0,
      desc: "Memory initially empty.",
      leftDesc: "",
      rightDesc: "",
      queue: []
    };
    commandHeap.push(obj);
  }
  function updateRoots(array) {
    for (let i = 0; i < array.length; i += 1) {
      ROOTS.push(array[i]);
    }
  }
  function initialize_memory(memorySize, nodeSize, marked, unmarked) {
    MEMORY_SIZE = memorySize;
    NODE_SIZE = nodeSize;
    const excess = MEMORY_SIZE % NODE_SIZE;
    MEMORY_SIZE -= excess;
    ROW = MEMORY_SIZE / COLUMN;
    MARKED = marked;
    UNMARKED = unmarked;
    generateMemory();
  }
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
  function newCommand(type, left, right, sizeLeft, sizeRight, heap, description, firstDesc, lastDesc, queue = []) {
    const newType = type;
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
    const newQueue = [];
    for (let j = 0; j < queue.length; j += 1) {
      newQueue.push(queue[j]);
    }
    const obj = {
      type: newType,
      heap: memory,
      left: newLeft,
      right: newRight,
      sizeLeft: newSizeLeft,
      sizeRight: newSizeRight,
      desc: newDesc,
      leftDesc: newFirstDesc,
      rightDesc: newLastDesc,
      queue: newQueue
    };
    commandHeap.push(obj);
  }
  function newSweep(left, heap) {
    const newSizeLeft = NODE_SIZE;
    const desc = `Freeing node ${left}`;
    newCommand("Sweep", left, -1, newSizeLeft, 0, heap, desc, "freed node", "");
  }
  function newMark(left, heap, queue) {
    const newSizeLeft = NODE_SIZE;
    const desc = `Marking node ${left} to be live memory`;
    newCommand("Mark", left, -1, newSizeLeft, 0, heap, desc, "marked node", "", queue);
  }
  function addRoots(arr) {
    for (let i = 0; i < arr.length; i += 1) {
      ROOTS.push(arr[i]);
    }
  }
  function showRoot(heap) {
    const desc = "All root nodes are marked";
    newCommand("Marked Roots", -1, -1, 0, 0, heap, desc, "", "");
  }
  function showRoots(heap) {
    for (let i = 0; i < ROOTS.length; i += 1) {
      showRoot(heap);
    }
    ROOTS = [];
  }
  function newUpdateSweep(right, heap) {
    const desc = `Set node ${right} to freelist`;
    newCommand("Sweep Reset", -1, right, 0, NODE_SIZE, heap, desc, "free node", "");
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
    const newSizeLeft = NODE_SIZE;
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
  function get_memory_heap() {
    return memoryHeaps;
  }
  function get_memory_matrix() {
    return memoryMatrix;
  }
  function get_roots() {
    return ROOTS;
  }
  function get_slots() {
    return [TAG_SLOT, SIZE_SLOT, FIRST_CHILD_SLOT, LAST_CHILD_SLOT];
  }
  function get_column_size() {
    return COLUMN;
  }
  function get_row_size() {
    return ROW;
  }
  function get_unmarked() {
    return UNMARKED;
  }
  function get_marked() {
    return MARKED;
  }
  function init() {
    return {
      toReplString: () => "<GC REDACTED>",
      get_memory_size,
      get_memory_heap,
      get_tags,
      get_types,
      get_column_size,
      get_row_size,
      get_memory_matrix,
      get_flips,
      get_slots,
      get_command,
      get_unmarked,
      get_marked,
      get_roots
    };
  }
  return __toCommonJS(mark_sweep_exports);
}