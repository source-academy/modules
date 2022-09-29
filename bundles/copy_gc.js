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
    COMMAND["SCAN"] = "Scan";
    COMMAND["INIT"] = "Initialize Memory";
  })(COMMAND || (COMMAND = {}));
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
    for (var i = 0; i < ROW / 2; i += 1) {
      memory = [];
      for (var j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE / 2; j += 1) {
        memory.push(i * COLUMN + j);
      }
      toMemoryMatrix.push(memory);
    }
    fromMemoryMatrix = [];
    for (var i = ROW / 2; i < ROW; i += 1) {
      memory = [];
      for (var j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE; j += 1) {
        memory.push(i * COLUMN + j);
      }
      fromMemoryMatrix.push(memory);
    }
    var obj = {
      type: COMMAND.INIT,
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
    var newHeap = [];
    if (fromSpace > 0) {
      for (var i = 0; i < MEMORY_SIZE / 2; i += 1) {
        newHeap.push(heap[i]);
      }
      for (var i = MEMORY_SIZE / 2; i < MEMORY_SIZE; i += 1) {
        newHeap.push(0);
      }
    } else {
      for (var i = 0; i < MEMORY_SIZE / 2; i += 1) {
        newHeap.push(0);
      }
      for (var i = MEMORY_SIZE / 2; i < MEMORY_SIZE; i += 1) {
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
    var newType = type;
    var newToSpace = toSpace;
    var newFromSpace = fromSpace;
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
    var obj = {
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
    var length = commandHeap.length;
    var toSpace = commandHeap[length - 1].to;
    var fromSpace = commandHeap[length - 1].from;
    var newSizeLeft = heap[left + SIZE_SLOT];
    var newSizeRight = heap[right + SIZE_SLOT];
    var desc = ("Copying node ").concat(left, " to ").concat(right);
    newCommand(COMMAND.COPY, toSpace, fromSpace, left, right, newSizeLeft, newSizeRight, heap, desc, "index", "free");
  }
  function endFlip(left, heap) {
    var length = commandHeap.length;
    var fromSpace = commandHeap[length - 1].from;
    var toSpace = commandHeap[length - 1].to;
    var newSizeLeft = heap[left + SIZE_SLOT];
    var desc = "Flip finished";
    newCommand(COMMAND.FLIP, toSpace, fromSpace, left, -1, newSizeLeft, 0, heap, desc, "free", "");
    updateFlip();
  }
  function updateRoots(array) {
    for (var i = 0; i < array.length; i += 1) {
      ROOTS.push(array[i]);
    }
  }
  function resetRoots() {
    ROOTS = [];
  }
  function startFlip(toSpace, fromSpace, heap) {
    var desc = "Memory is exhausted. Start stop and copy garbage collector.";
    newCommand("Start of Cheneys", toSpace, fromSpace, -1, -1, 0, 0, heap, desc, "", "");
    updateFlip();
  }
  function newPush(left, right, heap) {
    var length = commandHeap.length;
    var toSpace = commandHeap[length - 1].to;
    var fromSpace = commandHeap[length - 1].from;
    var desc = ("Push OS update memory ").concat(left, " and ").concat(right, ".");
    newCommand(COMMAND.PUSH, toSpace, fromSpace, left, right, 1, 1, heap, desc, "last child address slot", "new child pushed");
  }
  function newPop(res, left, right, heap) {
    var length = commandHeap.length;
    var toSpace = commandHeap[length - 1].to;
    var fromSpace = commandHeap[length - 1].from;
    var newRes = res;
    var desc = ("Pop OS from memory ").concat(left, ", with value ").concat(newRes, ".");
    newCommand(COMMAND.POP, toSpace, fromSpace, left, right, 1, 1, heap, desc, "popped memory", "last child address slot");
  }
  function doneShowRoot(heap) {
    var toSpace = 0;
    var fromSpace = 0;
    var desc = "All root nodes are copied";
    newCommand("Copied Roots", toSpace, fromSpace, -1, -1, 0, 0, heap, desc, "", "");
  }
  function showRoots(left, heap) {
    var length = commandHeap.length;
    var toSpace = commandHeap[length - 1].to;
    var fromSpace = commandHeap[length - 1].from;
    var newSizeLeft = heap[left + SIZE_SLOT];
    var desc = ("Roots: node ").concat(left);
    newCommand("Showing Roots", toSpace, fromSpace, left, -1, newSizeLeft, 0, heap, desc, "roots", "");
  }
  function newAssign(res, left, heap) {
    var length = commandHeap.length;
    var toSpace = commandHeap[length - 1].to;
    var fromSpace = commandHeap[length - 1].from;
    var newRes = res;
    var desc = ("Assign memory [").concat(left, "] with ").concat(newRes, ".");
    newCommand(COMMAND.ASSIGN, toSpace, fromSpace, left, -1, 1, 1, heap, desc, "assigned memory", "");
  }
  function newNew(left, heap) {
    var length = commandHeap.length;
    var toSpace = commandHeap[length - 1].to;
    var fromSpace = commandHeap[length - 1].from;
    var newSizeLeft = heap[left + SIZE_SLOT];
    var desc = ("New node starts in [").concat(left, "].");
    newCommand(COMMAND.NEW, toSpace, fromSpace, left, -1, newSizeLeft, 0, heap, desc, "new memory allocated", "");
  }
  function scanFlip(left, right, scan, free, heap) {
    var length = commandHeap.length;
    var toSpace = commandHeap[length - 1].to;
    var fromSpace = commandHeap[length - 1].from;
    memory = [];
    for (var j = 0; j < heap.length; j += 1) {
      memory.push(heap[j]);
    }
    var newLeft = left;
    var newRight = right;
    var newScan = scan;
    var newFree = free;
    var newDesc = ("Scanning node at ").concat(left, " for children node ").concat(scan, " and ").concat(free);
    if (scan) {
      if (free) {
        newDesc = ("Scanning node at ").concat(left, " for children node ").concat(scan, " and ").concat(free);
      } else {
        newDesc = ("Scanning node at ").concat(left, " for children node ").concat(scan);
      }
    } else if (free) {
      newDesc = ("Scanning node at ").concat(left, " for children node ").concat(free);
    }
    var obj = {
      type: COMMAND.SCAN,
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
      toReplString: function () {
        return "<REDACTED>";
      },
      get_memory_size: get_memory_size,
      get_from_space: get_from_space,
      get_to_space: get_to_space,
      get_memory_heap: get_memory_heap,
      get_tags: get_tags,
      get_types: get_types,
      get_column_size: get_column_size,
      get_row_size: get_row_size,
      get_from_memory_matrix: get_from_memory_matrix,
      get_to_memory_matrix: get_to_memory_matrix,
      get_flips: get_flips,
      get_slots: get_slots,
      get_command: get_command,
      get_roots: get_roots
    };
  }
  exports.allHeap = allHeap;
  exports.doneShowRoot = doneShowRoot;
  exports.endFlip = endFlip;
  exports.generateMemory = generateMemory;
  exports.init = init;
  exports.initialize_memory = initialize_memory;
  exports.initialize_tag = initialize_tag;
  exports.newAssign = newAssign;
  exports.newCommand = newCommand;
  exports.newCopy = newCopy;
  exports.newNew = newNew;
  exports.newPop = newPop;
  exports.newPush = newPush;
  exports.resetFromSpace = resetFromSpace;
  exports.resetRoots = resetRoots;
  exports.scanFlip = scanFlip;
  exports.showRoots = showRoots;
  exports.startFlip = startFlip;
  exports.updateRoots = updateRoots;
  exports.updateSlotSegment = updateSlotSegment;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
})
