(function () {
  'use strict';
  var exports = {};
  (function () {
    const env = {};
    try {
      if (process) {
        process.env = Object.assign({}, process.env);
        Object.assign(process.env, env);
        return;
      }
    } catch (e) {}
    globalThis.process = {
      env: env
    };
  })();
  var COMMAND;
  (function (COMMAND) {
    COMMAND["FLIP"] = "Flip";
    COMMAND["PUSH"] = "Push";
    COMMAND["POP"] = "Pop";
    COMMAND["COPY"] = "Copy";
    COMMAND["ASSIGN"] = "Assign";
    COMMAND["NEW"] = "New";
    COMMAND["START"] = "Mark and Sweep Start";
    COMMAND["END"] = "End of Garbage Collector";
    COMMAND["RESET"] = "Sweep Reset";
    COMMAND["SHOW_MARKED"] = "Marked Roots";
    COMMAND["MARK"] = "Mark";
    COMMAND["SWEEP"] = "Sweep";
    COMMAND["INIT"] = "Initialize Memory";
  })(COMMAND || (COMMAND = {}));
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
    for (var i = 0; i < ROW; i += 1) {
      memory = [];
      for (var j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE; j += 1) {
        memory.push(i * COLUMN + j);
      }
      memoryMatrix.push(memory);
    }
    var obj = {
      type: COMMAND.INIT,
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
    for (var i = 0; i < array.length; i += 1) {
      ROOTS.push(array[i]);
    }
  }
  function initialize_memory(memorySize, nodeSize, marked, unmarked) {
    MEMORY_SIZE = memorySize;
    NODE_SIZE = nodeSize;
    var excess = MEMORY_SIZE % NODE_SIZE;
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
  function newCommand(type, left, right, sizeLeft, sizeRight, heap, description, firstDesc, lastDesc, queue) {
    if (queue === void 0) {
      queue = [];
    }
    var newType = type;
    var newLeft = left;
    var newRight = right;
    var newSizeLeft = sizeLeft;
    var newSizeRight = sizeRight;
    var newDesc = description;
    var newFirstDesc = firstDesc;
    var newLastDesc = lastDesc;
    memory = [];
    for (var j = 0; j < heap.length; j += 1) {
      memory.push(heap[j]);
    }
    var newQueue = [];
    for (var j = 0; j < queue.length; j += 1) {
      newQueue.push(queue[j]);
    }
    var obj = {
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
    var newSizeLeft = NODE_SIZE;
    var desc = ("Freeing node ").concat(left);
    newCommand(COMMAND.SWEEP, left, -1, newSizeLeft, 0, heap, desc, "freed node", "");
  }
  function newMark(left, heap, queue) {
    var newSizeLeft = NODE_SIZE;
    var desc = ("Marking node ").concat(left, " to be live memory");
    newCommand(COMMAND.MARK, left, -1, newSizeLeft, 0, heap, desc, "marked node", "", queue);
  }
  function addRoots(arr) {
    for (var i = 0; i < arr.length; i += 1) {
      ROOTS.push(arr[i]);
    }
  }
  function showRoot(heap) {
    var desc = "All root nodes are marked";
    newCommand(COMMAND.SHOW_MARKED, -1, -1, 0, 0, heap, desc, "", "");
  }
  function showRoots(heap) {
    for (var i = 0; i < ROOTS.length; i += 1) {
      showRoot(heap);
    }
    ROOTS = [];
  }
  function newUpdateSweep(right, heap) {
    var desc = ("Set node ").concat(right, " to freelist");
    newCommand(COMMAND.RESET, -1, right, 0, NODE_SIZE, heap, desc, "free node", "");
  }
  function newPush(left, right, heap) {
    var desc = ("Push OS update memory ").concat(left, " and ").concat(right, ".");
    newCommand(COMMAND.PUSH, left, right, 1, 1, heap, desc, "last child address slot", "new child pushed");
  }
  function newPop(res, left, right, heap) {
    var newRes = res;
    var desc = ("Pop OS from memory ").concat(left, ", with value ").concat(newRes, ".");
    newCommand(COMMAND.POP, left, right, 1, 1, heap, desc, "popped memory", "last child address slot");
  }
  function newAssign(res, left, heap) {
    var newRes = res;
    var desc = ("Assign memory [").concat(left, "] with ").concat(newRes, ".");
    newCommand(COMMAND.ASSIGN, left, -1, 1, 1, heap, desc, "assigned memory", "");
  }
  function newNew(left, heap) {
    var newSizeLeft = NODE_SIZE;
    var desc = ("New node starts in [").concat(left, "].");
    newCommand(COMMAND.NEW, left, -1, newSizeLeft, 0, heap, desc, "new memory allocated", "");
  }
  function newGC(heap) {
    var desc = "Memory exhausted, start Mark and Sweep Algorithm";
    newCommand(COMMAND.START, -1, -1, 0, 0, heap, desc, "", "");
    updateFlip();
  }
  function endGC(heap) {
    var desc = "Result of free memory";
    newCommand(COMMAND.END, -1, -1, 0, 0, heap, desc, "", "");
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
      toReplString: function () {
        return "<GC REDACTED>";
      },
      get_memory_size: get_memory_size,
      get_memory_heap: get_memory_heap,
      get_tags: get_tags,
      get_types: get_types,
      get_column_size: get_column_size,
      get_row_size: get_row_size,
      get_memory_matrix: get_memory_matrix,
      get_flips: get_flips,
      get_slots: get_slots,
      get_command: get_command,
      get_unmarked: get_unmarked,
      get_marked: get_marked,
      get_roots: get_roots
    };
  }
  exports.addRoots = addRoots;
  exports.allHeap = allHeap;
  exports.endGC = endGC;
  exports.generateMemory = generateMemory;
  exports.init = init;
  exports.initialize_memory = initialize_memory;
  exports.initialize_tag = initialize_tag;
  exports.newAssign = newAssign;
  exports.newCommand = newCommand;
  exports.newGC = newGC;
  exports.newMark = newMark;
  exports.newNew = newNew;
  exports.newPop = newPop;
  exports.newPush = newPush;
  exports.newSweep = newSweep;
  exports.newUpdateSweep = newUpdateSweep;
  exports.showRoot = showRoot;
  exports.showRoots = showRoots;
  exports.updateRoots = updateRoots;
  exports.updateSlotSegment = updateSlotSegment;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
})
