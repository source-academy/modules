export default require => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => (key in obj) ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a2, b) => (typeof require !== "undefined" ? require : a2)[b]
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
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = value => {
        try {
          step(generator.next(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var rejected = value => {
        try {
          step(generator.throw(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var step = x => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  var index_exports = {};
  __export(index_exports, {
    MATRIX_TAB_ID: () => MATRIX_TAB_ID,
    default: () => MatrixTabPlugin
  });
  var import_core = __require("@blueprintjs/core");
  var MATRIX_CHANNEL_ID = "sourceacademy-matrix-channel";
  var MATRIX_WEB_ID = "matrix-web";
  var R;
  !(function (R2) {
    (R2[R2.CALL = 0] = "CALL", R2[R2.RETURN = 1] = "RETURN", R2[R2.RETURN_ERR = 2] = "RETURN_ERR");
  })(R || (R = {}));
  var t = class {
    constructor(s4, t2, r2) {
      __publicField(this, "type", R.CALL);
      __publicField(this, "data");
      this.data = {
        fn: s4,
        args: t2,
        invokeId: r2
      };
    }
  };
  var r = class {
    constructor(s4, t2) {
      __publicField(this, "type", R.RETURN_ERR);
      __publicField(this, "data");
      this.data = {
        invokeId: s4,
        err: t2
      };
    }
  };
  var a = class {
    constructor(s4, t2) {
      __publicField(this, "type", R.RETURN);
      __publicField(this, "data");
      this.data = {
        invokeId: s4,
        res: t2
      };
    }
  };
  function s(s4, o2) {
    const c = [];
    let a2 = 0;
    return (s4.subscribe(n3 => __async(null, null, function* () {
      var _a, _b, _c, _d;
      switch (n3.type) {
        case R.CALL:
          {
            const {fn: r2, args: c2, invokeId: a3} = n3.data;
            try {
              const t2 = yield o2[r2](...c2);
              a3 > 0 && s4.send(new a(a3, t2));
            } catch (e2) {
              a3 > 0 && s4.send(new r(a3, e2));
            }
            break;
          }
        case R.RETURN:
          {
            const {invokeId: e2, res: t2} = n3.data;
            ((_b = (_a = c[e2]) == null ? void 0 : _a[0]) == null ? void 0 : _b.call(_a, t2), delete c[e2]);
            break;
          }
        case R.RETURN_ERR:
          {
            const {invokeId: e2, err: t2} = n3.data;
            ((_d = (_c = c[e2]) == null ? void 0 : _c[1]) == null ? void 0 : _d.call(_c, t2), delete c[e2]);
            break;
          }
      }
    })), new Proxy({}, {
      get(e2, t2, r2) {
        const o3 = Reflect.get(e2, t2, r2);
        if (o3) return o3;
        const i = "string" == typeof t2 && "$" === t2.charAt(0) ? (...e3) => {
          s4.send(new t(t2, e3, 0));
        } : (...e3) => {
          const r3 = ++a2;
          return (s4.send(new t(t2, e3, r3)), new Promise((e4, t3) => {
            c[r3] = [e4, t3];
          }));
        };
        return (Reflect.set(e2, t2, i, r2), i);
      }
    }));
  }
  function n(n3) {}
  var _;
  !(function (_2) {
    (_2.UNKNOWN = "__unknown", _2.INTERNAL = "__internal", _2.EVALUATOR = "__evaluator", _2.EVALUATOR_SYNTAX = "__evaluator_syntax", _2.EVALUATOR_TYPE = "__evaluator_type", _2.EVALUATOR_RUNTIME = "__evaluator_runtime");
  })(_ || (_ = {}));
  var O;
  !(function (O2) {
    (O2[O2.PROTOCOL_VERSION = 0] = "PROTOCOL_VERSION", O2[O2.PROTOCOL_MIN_VERSION = 0] = "PROTOCOL_MIN_VERSION", O2[O2.SETUP_MESSAGES_BUFFER_SIZE = 10] = "SETUP_MESSAGES_BUFFER_SIZE");
  })(O || (O = {}));
  var import_react = __require("react");
  var MATRIX_TAB_ID = "matrix";
  var GRID_SIZE = 16;
  var SQUARE_SIDE_LENGTH = 18;
  var DISTANCE_BETWEEN_SQUARES = 6;
  var MARGIN_LENGTH = 20;
  var CANVAS_SIZE = 420;
  var COLOR_ON = "#cccccc";
  var COLOR_OFF = "#333333";
  function rowToY(row) {
    return MARGIN_LENGTH + row * (SQUARE_SIDE_LENGTH + DISTANCE_BETWEEN_SQUARES);
  }
  function columnToX(column) {
    return MARGIN_LENGTH + column * (SQUARE_SIDE_LENGTH + DISTANCE_BETWEEN_SQUARES);
  }
  function xyToRowColumn(x, y) {
    const row = Math.floor((y - MARGIN_LENGTH) / (SQUARE_SIDE_LENGTH + DISTANCE_BETWEEN_SQUARES));
    const column = Math.floor((x - MARGIN_LENGTH) / (SQUARE_SIDE_LENGTH + DISTANCE_BETWEEN_SQUARES));
    return [row, column];
  }
  var GLOBAL_MATRIX_KEY = Symbol.for("sourceacademy.matrix.sharedMatrix");
  var globalScope = globalThis;
  function createEmptyMatrix() {
    return Array.from({
      length: GRID_SIZE
    }, () => new Array(GRID_SIZE).fill(false));
  }
  function getSharedMatrix() {
    var _a;
    return (_a = globalScope[GLOBAL_MATRIX_KEY]) != null ? _a : globalScope[GLOBAL_MATRIX_KEY] = createEmptyMatrix();
  }
  function setSharedMatrix(matrix) {
    globalScope[GLOBAL_MATRIX_KEY] = matrix;
  }
  function MatrixView({canvasRef, onClear, onRandomise}) {
    return (0, import_react.createElement)("div", {
      className: "sa-tone-matrix"
    }, (0, import_react.createElement)("div", {
      className: "row"
    }, (0, import_react.createElement)("div", {
      className: `controls col-xs-12 ${import_core.Classes.DARK} ${import_core.Classes.BUTTON_GROUP}`
    }, (0, import_react.createElement)(import_core.Button, {
      id: "clear-matrix",
      onClick: onClear
    }, "Clear"), (0, import_react.createElement)(import_core.Button, {
      id: "randomise-matrix",
      onClick: onRandomise
    }, "Randomise"))), (0, import_react.createElement)("div", {
      className: "row"
    }, (0, import_react.createElement)("div", {
      className: "col-xs-12",
      ref: canvasRef
    })));
  }
  var MatrixTabPlugin = class {
    constructor(_conduit, [channel], tabService) {
      this.id = MATRIX_WEB_ID;
      this.__listeners = new Set();
      this.__handleClick = event => {
        if (!this.__canvas) return;
        const rect = this.__canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const [row, column] = xyToRowColumn(x, y);
        if (row < 0 || row >= GRID_SIZE || column < 0 || column >= GRID_SIZE) {
          return;
        }
        const matrix = getSharedMatrix().map(r2 => [...r2]);
        matrix[row][column] = !matrix[row][column];
        setSharedMatrix(matrix);
        this.__setColor(row, column, matrix[row][column] ? COLOR_ON : COLOR_OFF);
        this.__emit();
      };
      this.__attachCanvas = container => {
        if (!container) return;
        if (!this.__canvas) {
          this.__canvas = document.createElement("canvas");
          this.__canvas.width = CANVAS_SIZE;
          this.__canvas.height = CANVAS_SIZE;
          this.__canvas.addEventListener("click", this.__handleClick, false);
          this.__redraw();
        }
        container.appendChild(this.__canvas);
      };
      if (!channel) {
        throw new Error("Matrix channel is required but was not provided.");
      }
      this.__tabService = tabService;
      s(channel, this);
      const subscribe = listener => this.subscribe(listener);
      const MatrixPluginTab = () => {
        (0, import_react.useSyncExternalStore)(subscribe, getSharedMatrix);
        return (0, import_react.createElement)(MatrixView, {
          canvasRef: this.__attachCanvas,
          onClear: () => this.__clearMatrix(),
          onRandomise: () => this.__randomiseMatrix()
        });
      };
      const tab = {
        id: MATRIX_TAB_ID,
        iconName: "grid-view",
        body: (0, import_react.createElement)(MatrixPluginTab),
        label: "Matrix",
        disabled: false
      };
      this.__tabService.registerTab(tab);
      this.__tabService.showTab(MATRIX_TAB_ID);
    }
    subscribe(listener) {
      this.__listeners.add(listener);
      return () => this.__listeners.delete(listener);
    }
    destroy() {}
    getMatrix() {
      return __async(this, null, function* () {
        return getSharedMatrix().map(row => [...row]);
      });
    }
    clearMatrix() {
      return __async(this, null, function* () {
        this.__clearMatrix();
      });
    }
    __clearMatrix() {
      setSharedMatrix(createEmptyMatrix());
      this.__redraw();
      this.__emit();
    }
    __randomiseMatrix() {
      setSharedMatrix(Array.from({
        length: GRID_SIZE
      }, () => Array.from({
        length: GRID_SIZE
      }, () => Math.random() > 0.9)));
      this.__redraw();
      this.__emit();
    }
    __setColor(row, column, color) {
      if (row < 0 || row >= GRID_SIZE || column < 0 || column >= GRID_SIZE || !this.__canvas) {
        return;
      }
      const ctx = this.__canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = color;
      ctx.fillRect(columnToX(column), rowToY(row), SQUARE_SIDE_LENGTH, SQUARE_SIDE_LENGTH);
    }
    __redraw() {
      const matrix = getSharedMatrix();
      for (let i = 0; i < GRID_SIZE; i += 1) {
        for (let j = 0; j < GRID_SIZE; j += 1) {
          this.__setColor(i, j, matrix[i][j] ? COLOR_ON : COLOR_OFF);
        }
      }
    }
    __emit() {
      this.__listeners.forEach(listener => listener());
    }
  };
  MatrixTabPlugin.channelAttach = [MATRIX_CHANNEL_ID];
  n(MatrixTabPlugin);
  return __toCommonJS(index_exports);
};