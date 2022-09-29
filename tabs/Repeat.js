(function (React) {
  'use strict';
  function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && ('default' in e) ? e : {
      'default': e
    };
  }
  var React__default = _interopDefaultLegacy(React);
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
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || ({
      __proto__: []
    }) instanceof Array && (function (d, b) {
      d.__proto__ = b;
    }) || (function (d, b) {
      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    });
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var Repeat = (function (_super) {
    __extends(Repeat, _super);
    function Repeat() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    Repeat.prototype.render = function () {
      return React__default["default"].createElement("div", null, "This is spawned from the repeat package");
    };
    return Repeat;
  })(React__default["default"].PureComponent);
  var index = {
    toSpawn: function () {
      return true;
    },
    body: function (debuggerContext) {
      return React__default["default"].createElement(Repeat, {
        debuggerContext: debuggerContext
      });
    },
    label: "Repeat Test Tab",
    iconName: "build"
  };
  return index;
})
