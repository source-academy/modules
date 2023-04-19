require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __pow = Math.pow;
  var __defNormalProp = (obj, key, value) => (key in obj) ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function (x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return (fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res);
  };
  var __commonJS = (cb, mod) => function __require2() {
    return (mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
      exports: {}
    }).exports, mod), mod.exports);
  };
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
  var init_define_process = __esm({
    "<define:process>"() {}
  });
  var require_b2_settings = __commonJS({
    "node_modules/@box2d/core/dist/common/b2_settings.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2_maxPolygonVertices = exports.b2_lengthUnitsPerMeter = void 0;
      exports.b2_lengthUnitsPerMeter = 1;
      exports.b2_maxPolygonVertices = 8;
    }
  });
  var require_b2_common = __commonJS({
    "node_modules/@box2d/core/dist/common/b2_common.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2MakeArray = exports.b2MakeBooleanArray = exports.b2MakeNumberArray = exports.b2_version = exports.b2_angularSleepTolerance = exports.b2_linearSleepTolerance = exports.b2_timeToSleep = exports.b2_toiBaumgarte = exports.b2_baumgarte = exports.b2_maxRotationSquared = exports.b2_maxRotation = exports.b2_maxTranslationSquared = exports.b2_maxTranslation = exports.b2_maxAngularCorrection = exports.b2_maxLinearCorrection = exports.b2_maxTOIContacts = exports.b2_maxSubSteps = exports.b2_polygonRadius = exports.b2_angularSlop = exports.b2_linearSlop = exports.b2_aabbMultiplier = exports.b2_aabbExtension = exports.b2_maxManifoldPoints = exports.b2_epsilon_sq = exports.b2_epsilon = exports.b2_maxFloat = exports.b2Verify = exports.b2Assert = void 0;
      var b2_settings_1 = require_b2_settings();
      function b2Assert(condition, message) {
        if (!condition) throw new Error(message);
      }
      exports.b2Assert = b2Assert;
      function b2Verify(value) {
        if (value === null) throw new Error();
        return value;
      }
      exports.b2Verify = b2Verify;
      exports.b2_maxFloat = 1e37;
      exports.b2_epsilon = 1e-5;
      exports.b2_epsilon_sq = exports.b2_epsilon * exports.b2_epsilon;
      exports.b2_maxManifoldPoints = 2;
      exports.b2_aabbExtension = 0.1 * b2_settings_1.b2_lengthUnitsPerMeter;
      exports.b2_aabbMultiplier = 4;
      exports.b2_linearSlop = 5e-3 * b2_settings_1.b2_lengthUnitsPerMeter;
      exports.b2_angularSlop = 2 / 180 * Math.PI;
      exports.b2_polygonRadius = 2 * exports.b2_linearSlop;
      exports.b2_maxSubSteps = 8;
      exports.b2_maxTOIContacts = 32;
      exports.b2_maxLinearCorrection = 0.2 * b2_settings_1.b2_lengthUnitsPerMeter;
      exports.b2_maxAngularCorrection = 8 / 180 * Math.PI;
      exports.b2_maxTranslation = 2 * b2_settings_1.b2_lengthUnitsPerMeter;
      exports.b2_maxTranslationSquared = exports.b2_maxTranslation * exports.b2_maxTranslation;
      exports.b2_maxRotation = 0.5 * Math.PI;
      exports.b2_maxRotationSquared = exports.b2_maxRotation * exports.b2_maxRotation;
      exports.b2_baumgarte = 0.2;
      exports.b2_toiBaumgarte = 0.75;
      exports.b2_timeToSleep = 0.5;
      exports.b2_linearSleepTolerance = 0.01 * b2_settings_1.b2_lengthUnitsPerMeter;
      exports.b2_angularSleepTolerance = 2 / 180 * Math.PI;
      exports.b2_version = {
        major: 2,
        minor: 4,
        patch: 0
      };
      function b2MakeNumberArray(length, init = 0) {
        const result = new Array(length);
        for (let i = 0; i < length; i++) result[i] = init;
        return result;
      }
      exports.b2MakeNumberArray = b2MakeNumberArray;
      function b2MakeBooleanArray(length, init = false) {
        const result = new Array(length);
        for (let i = 0; i < length; i++) result[i] = init;
        return result;
      }
      exports.b2MakeBooleanArray = b2MakeBooleanArray;
      function b2MakeArray(length, Class) {
        const result = new Array(length);
        for (let i = 0; i < length; i++) result[i] = new Class();
        return result;
      }
      exports.b2MakeArray = b2MakeArray;
    }
  });
  var require_b2_math = __commonJS({
    "node_modules/@box2d/core/dist/common/b2_math.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2Sweep = exports.b2Transform = exports.b2Rot = exports.b2Mat33 = exports.b2Mat22 = exports.b2Vec3 = exports.b2Vec2 = exports.b2RandomInt = exports.b2RandomFloat = exports.b2Random = exports.b2IsPowerOfTwo = exports.b2NextPowerOfTwo = exports.b2RadToDeg = exports.b2DegToRad = exports.b2Clamp = exports.b2_two_pi = exports.b2_180_over_pi = exports.b2_pi_over_180 = void 0;
      var b2_common_1 = require_b2_common();
      exports.b2_pi_over_180 = Math.PI / 180;
      exports.b2_180_over_pi = 180 / Math.PI;
      exports.b2_two_pi = 2 * Math.PI;
      function b2Clamp(a, low, high) {
        if (a < low) return low;
        return a > high ? high : a;
      }
      exports.b2Clamp = b2Clamp;
      function b2DegToRad(degrees) {
        return degrees * exports.b2_pi_over_180;
      }
      exports.b2DegToRad = b2DegToRad;
      function b2RadToDeg(radians) {
        return radians * exports.b2_180_over_pi;
      }
      exports.b2RadToDeg = b2RadToDeg;
      function b2NextPowerOfTwo(x) {
        x |= x >> 1;
        x |= x >> 2;
        x |= x >> 4;
        x |= x >> 8;
        x |= x >> 16;
        return x + 1;
      }
      exports.b2NextPowerOfTwo = b2NextPowerOfTwo;
      function b2IsPowerOfTwo(x) {
        return x > 0 && (x & x - 1) === 0;
      }
      exports.b2IsPowerOfTwo = b2IsPowerOfTwo;
      function b2Random() {
        return Math.random() * 2 - 1;
      }
      exports.b2Random = b2Random;
      function b2RandomFloat(lo, hi) {
        return (hi - lo) * Math.random() + lo;
      }
      exports.b2RandomFloat = b2RandomFloat;
      function b2RandomInt(lo, hi) {
        return Math.round((hi - lo) * Math.random() + lo);
      }
      exports.b2RandomInt = b2RandomInt;
      var b2Vec24 = class {
        constructor(x = 0, y = 0) {
          this.x = x;
          this.y = y;
        }
        Clone() {
          return new b2Vec24(this.x, this.y);
        }
        SetZero() {
          this.x = 0;
          this.y = 0;
          return this;
        }
        Set(x, y) {
          this.x = x;
          this.y = y;
          return this;
        }
        Copy(other) {
          this.x = other.x;
          this.y = other.y;
          return this;
        }
        Add(v) {
          this.x += v.x;
          this.y += v.y;
          return this;
        }
        AddXY(x, y) {
          this.x += x;
          this.y += y;
          return this;
        }
        Subtract(v) {
          this.x -= v.x;
          this.y -= v.y;
          return this;
        }
        SubtractXY(x, y) {
          this.x -= x;
          this.y -= y;
          return this;
        }
        Scale(s) {
          this.x *= s;
          this.y *= s;
          return this;
        }
        AddScaled(s, v) {
          this.x += s * v.x;
          this.y += s * v.y;
          return this;
        }
        SubtractScaled(s, v) {
          this.x -= s * v.x;
          this.y -= s * v.y;
          return this;
        }
        Dot(v) {
          return this.x * v.x + this.y * v.y;
        }
        Cross(v) {
          return this.x * v.y - this.y * v.x;
        }
        Length() {
          const {x, y} = this;
          return Math.sqrt(x * x + y * y);
        }
        LengthSquared() {
          const {x, y} = this;
          return x * x + y * y;
        }
        Normalize() {
          const length = this.Length();
          if (length < b2_common_1.b2_epsilon) {
            return 0;
          }
          const inv_length = 1 / length;
          this.x *= inv_length;
          this.y *= inv_length;
          return length;
        }
        Rotate(radians) {
          const c = Math.cos(radians);
          const s = Math.sin(radians);
          const {x} = this;
          this.x = c * x - s * this.y;
          this.y = s * x + c * this.y;
          return this;
        }
        RotateCosSin(c, s) {
          const {x} = this;
          this.x = c * x - s * this.y;
          this.y = s * x + c * this.y;
          return this;
        }
        IsValid() {
          return Number.isFinite(this.x) && Number.isFinite(this.y);
        }
        Abs() {
          this.x = Math.abs(this.x);
          this.y = Math.abs(this.y);
          return this;
        }
        GetAbs(out) {
          out.x = Math.abs(this.x);
          out.y = Math.abs(this.y);
          return out;
        }
        Negate() {
          this.x = -this.x;
          this.y = -this.y;
          return this;
        }
        Skew() {
          const {x} = this;
          this.x = -this.y;
          this.y = x;
          return this;
        }
        static Min(a, b, out) {
          out.x = Math.min(a.x, b.x);
          out.y = Math.min(a.y, b.y);
          return out;
        }
        static Max(a, b, out) {
          out.x = Math.max(a.x, b.x);
          out.y = Math.max(a.y, b.y);
          return out;
        }
        static Clamp(v, lo, hi, out) {
          out.x = b2Clamp(v.x, lo.x, hi.x);
          out.y = b2Clamp(v.y, lo.y, hi.y);
          return out;
        }
        static Rotate(v, radians, out) {
          const v_x = v.x;
          const v_y = v.y;
          const c = Math.cos(radians);
          const s = Math.sin(radians);
          out.x = c * v_x - s * v_y;
          out.y = s * v_x + c * v_y;
          return out;
        }
        static Dot(a, b) {
          return a.x * b.x + a.y * b.y;
        }
        static Cross(a, b) {
          return a.x * b.y - a.y * b.x;
        }
        static CrossVec2Scalar(v, s, out) {
          const v_x = v.x;
          out.x = s * v.y;
          out.y = -s * v_x;
          return out;
        }
        static CrossVec2One(v, out) {
          const v_x = v.x;
          out.x = v.y;
          out.y = -v_x;
          return out;
        }
        static CrossScalarVec2(s, v, out) {
          const v_x = v.x;
          out.x = -s * v.y;
          out.y = s * v_x;
          return out;
        }
        static CrossOneVec2(v, out) {
          const v_x = v.x;
          out.x = -v.y;
          out.y = v_x;
          return out;
        }
        static Add(a, b, out) {
          out.x = a.x + b.x;
          out.y = a.y + b.y;
          return out;
        }
        static Subtract(a, b, out) {
          out.x = a.x - b.x;
          out.y = a.y - b.y;
          return out;
        }
        static Scale(s, v, out) {
          out.x = v.x * s;
          out.y = v.y * s;
          return out;
        }
        static AddScaled(a, s, b, out) {
          out.x = a.x + s * b.x;
          out.y = a.y + s * b.y;
          return out;
        }
        static SubtractScaled(a, s, b, out) {
          out.x = a.x - s * b.x;
          out.y = a.y - s * b.y;
          return out;
        }
        static AddCrossScalarVec2(a, s, v, out) {
          const v_x = v.x;
          out.x = a.x - s * v.y;
          out.y = a.y + s * v_x;
          return out;
        }
        static Mid(a, b, out) {
          out.x = (a.x + b.x) * 0.5;
          out.y = (a.y + b.y) * 0.5;
          return out;
        }
        static Extents(a, b, out) {
          out.x = (b.x - a.x) * 0.5;
          out.y = (b.y - a.y) * 0.5;
          return out;
        }
        static Equals(a, b) {
          return a.x === b.x && a.y === b.y;
        }
        static Distance(a, b) {
          return Math.sqrt(__pow(a.x - b.x, 2) + __pow(a.y - b.y, 2));
        }
        static DistanceSquared(a, b) {
          return __pow(a.x - b.x, 2) + __pow(a.y - b.y, 2);
        }
        static Negate(v, out) {
          out.x = -v.x;
          out.y = -v.y;
          return out;
        }
        static Normalize(v, out) {
          const length_sq = __pow(v.x, 2) + __pow(v.y, 2);
          if (length_sq >= b2_common_1.b2_epsilon_sq) {
            const inv_length = 1 / Math.sqrt(length_sq);
            out.x = inv_length * v.x;
            out.y = inv_length * v.y;
          } else {
            out.x = 0;
            out.y = 0;
          }
          return out;
        }
        static Skew(v, out) {
          const {x} = v;
          out.x = -v.y;
          out.y = x;
          return out;
        }
      };
      exports.b2Vec2 = b2Vec24;
      b2Vec24.ZERO = new b2Vec24();
      b2Vec24.UNITX = new b2Vec24(1, 0);
      b2Vec24.UNITY = new b2Vec24(0, 1);
      b2Vec24.s_t0 = new b2Vec24();
      b2Vec24.s_t1 = new b2Vec24();
      b2Vec24.s_t2 = new b2Vec24();
      b2Vec24.s_t3 = new b2Vec24();
      var b2Vec3 = class {
        constructor(x = 0, y = 0, z = 0) {
          this.x = x;
          this.y = y;
          this.z = z;
        }
        Clone() {
          return new b2Vec3(this.x, this.y, this.z);
        }
        SetZero() {
          this.x = 0;
          this.y = 0;
          this.z = 0;
          return this;
        }
        Set(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
          return this;
        }
        Copy(other) {
          this.x = other.x;
          this.y = other.y;
          this.z = other.z;
          return this;
        }
        Negate() {
          this.x = -this.x;
          this.y = -this.y;
          this.z = -this.z;
          return this;
        }
        Add(v) {
          this.x += v.x;
          this.y += v.y;
          this.z += v.z;
          return this;
        }
        AddXYZ(x, y, z) {
          this.x += x;
          this.y += y;
          this.z += z;
          return this;
        }
        Subtract(v) {
          this.x -= v.x;
          this.y -= v.y;
          this.z -= v.z;
          return this;
        }
        SubtractXYZ(x, y, z) {
          this.x -= x;
          this.y -= y;
          this.z -= z;
          return this;
        }
        Scale(s) {
          this.x *= s;
          this.y *= s;
          this.z *= s;
          return this;
        }
        static Dot(a, b) {
          return a.x * b.x + a.y * b.y + a.z * b.z;
        }
        static Cross(a, b, out) {
          const a_x = a.x;
          const a_y = a.y;
          const a_z = a.z;
          const b_x = b.x;
          const b_y = b.y;
          const b_z = b.z;
          out.x = a_y * b_z - a_z * b_y;
          out.y = a_z * b_x - a_x * b_z;
          out.z = a_x * b_y - a_y * b_x;
          return out;
        }
      };
      exports.b2Vec3 = b2Vec3;
      b2Vec3.ZERO = new b2Vec3(0, 0, 0);
      b2Vec3.s_t0 = new b2Vec3();
      var b2Mat22 = class {
        constructor() {
          this.ex = new b2Vec24(1, 0);
          this.ey = new b2Vec24(0, 1);
        }
        Clone() {
          return new b2Mat22().Copy(this);
        }
        static FromColumns(c1, c2) {
          return new b2Mat22().SetColumns(c1, c2);
        }
        static FromScalars(r1c1, r1c2, r2c1, r2c2) {
          return new b2Mat22().SetScalars(r1c1, r1c2, r2c1, r2c2);
        }
        static FromAngle(radians) {
          return new b2Mat22().SetAngle(radians);
        }
        SetScalars(r1c1, r1c2, r2c1, r2c2) {
          this.ex.Set(r1c1, r2c1);
          this.ey.Set(r1c2, r2c2);
          return this;
        }
        SetColumns(c1, c2) {
          this.ex.Copy(c1);
          this.ey.Copy(c2);
          return this;
        }
        SetAngle(radians) {
          const c = Math.cos(radians);
          const s = Math.sin(radians);
          this.ex.Set(c, s);
          this.ey.Set(-s, c);
          return this;
        }
        Copy(other) {
          this.ex.Copy(other.ex);
          this.ey.Copy(other.ey);
          return this;
        }
        SetIdentity() {
          this.ex.Set(1, 0);
          this.ey.Set(0, 1);
          return this;
        }
        SetZero() {
          this.ex.SetZero();
          this.ey.SetZero();
          return this;
        }
        GetAngle() {
          return Math.atan2(this.ex.y, this.ex.x);
        }
        Solve(b_x, b_y, out) {
          const a11 = this.ex.x;
          const a12 = this.ey.x;
          const a21 = this.ex.y;
          const a22 = this.ey.y;
          let det = a11 * a22 - a12 * a21;
          if (det !== 0) {
            det = 1 / det;
          }
          out.x = det * (a22 * b_x - a12 * b_y);
          out.y = det * (a11 * b_y - a21 * b_x);
          return out;
        }
        Abs() {
          this.ex.Abs();
          this.ey.Abs();
          return this;
        }
        Inverse() {
          this.GetInverse(this);
          return this;
        }
        Add(M) {
          this.ex.Add(M.ex);
          this.ey.Add(M.ey);
          return this;
        }
        Subtract(M) {
          this.ex.Subtract(M.ex);
          this.ey.Subtract(M.ey);
          return this;
        }
        GetInverse(out) {
          const a = this.ex.x;
          const b = this.ey.x;
          const c = this.ex.y;
          const d = this.ey.y;
          let det = a * d - b * c;
          if (det !== 0) {
            det = 1 / det;
          }
          out.ex.x = det * d;
          out.ey.x = -det * b;
          out.ex.y = -det * c;
          out.ey.y = det * a;
          return out;
        }
        GetAbs(out) {
          out.ex.x = Math.abs(this.ex.x);
          out.ex.y = Math.abs(this.ex.y);
          out.ey.x = Math.abs(this.ey.x);
          out.ey.y = Math.abs(this.ey.y);
          return out;
        }
        static MultiplyVec2(M, v, out) {
          const v_x = v.x;
          const v_y = v.y;
          out.x = M.ex.x * v_x + M.ey.x * v_y;
          out.y = M.ex.y * v_x + M.ey.y * v_y;
          return out;
        }
        static TransposeMultiplyVec2(M, v, out) {
          const v_x = v.x;
          const v_y = v.y;
          out.x = M.ex.x * v_x + M.ex.y * v_y;
          out.y = M.ey.x * v_x + M.ey.y * v_y;
          return out;
        }
        static Add(A, B, out) {
          out.ex.x = A.ex.x + B.ex.x;
          out.ex.y = A.ex.y + B.ex.y;
          out.ey.x = A.ey.x + B.ey.x;
          out.ey.y = A.ey.y + B.ey.y;
          return out;
        }
        static Multiply(A, B, out) {
          const A_ex_x = A.ex.x;
          const A_ex_y = A.ex.y;
          const A_ey_x = A.ey.x;
          const A_ey_y = A.ey.y;
          const B_ex_x = B.ex.x;
          const B_ex_y = B.ex.y;
          const B_ey_x = B.ey.x;
          const B_ey_y = B.ey.y;
          out.ex.x = A_ex_x * B_ex_x + A_ey_x * B_ex_y;
          out.ex.y = A_ex_y * B_ex_x + A_ey_y * B_ex_y;
          out.ey.x = A_ex_x * B_ey_x + A_ey_x * B_ey_y;
          out.ey.y = A_ex_y * B_ey_x + A_ey_y * B_ey_y;
          return out;
        }
        static TransposeMultiply(A, B, out) {
          const A_ex_x = A.ex.x;
          const A_ex_y = A.ex.y;
          const A_ey_x = A.ey.x;
          const A_ey_y = A.ey.y;
          const B_ex_x = B.ex.x;
          const B_ex_y = B.ex.y;
          const B_ey_x = B.ey.x;
          const B_ey_y = B.ey.y;
          out.ex.x = A_ex_x * B_ex_x + A_ex_y * B_ex_y;
          out.ex.y = A_ey_x * B_ex_x + A_ey_y * B_ex_y;
          out.ey.x = A_ex_x * B_ey_x + A_ex_y * B_ey_y;
          out.ey.y = A_ey_x * B_ey_x + A_ey_y * B_ey_y;
          return out;
        }
      };
      exports.b2Mat22 = b2Mat22;
      b2Mat22.IDENTITY = new b2Mat22();
      var b2Mat33 = class {
        constructor() {
          this.ex = new b2Vec3(1, 0, 0);
          this.ey = new b2Vec3(0, 1, 0);
          this.ez = new b2Vec3(0, 0, 1);
        }
        Clone() {
          return new b2Mat33().Copy(this);
        }
        SetColumns(c1, c2, c3) {
          this.ex.Copy(c1);
          this.ey.Copy(c2);
          this.ez.Copy(c3);
          return this;
        }
        Copy(other) {
          this.ex.Copy(other.ex);
          this.ey.Copy(other.ey);
          this.ez.Copy(other.ez);
          return this;
        }
        SetIdentity() {
          this.ex.Set(1, 0, 0);
          this.ey.Set(0, 1, 0);
          this.ez.Set(0, 0, 1);
          return this;
        }
        SetZero() {
          this.ex.SetZero();
          this.ey.SetZero();
          this.ez.SetZero();
          return this;
        }
        Add(M) {
          this.ex.Add(M.ex);
          this.ey.Add(M.ey);
          this.ez.Add(M.ez);
          return this;
        }
        Solve33(b_x, b_y, b_z, out) {
          const a11 = this.ex.x;
          const a21 = this.ex.y;
          const a31 = this.ex.z;
          const a12 = this.ey.x;
          const a22 = this.ey.y;
          const a32 = this.ey.z;
          const a13 = this.ez.x;
          const a23 = this.ez.y;
          const a33 = this.ez.z;
          let det = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
          if (det !== 0) {
            det = 1 / det;
          }
          out.x = det * (b_x * (a22 * a33 - a32 * a23) + b_y * (a32 * a13 - a12 * a33) + b_z * (a12 * a23 - a22 * a13));
          out.y = det * (a11 * (b_y * a33 - b_z * a23) + a21 * (b_z * a13 - b_x * a33) + a31 * (b_x * a23 - b_y * a13));
          out.z = det * (a11 * (a22 * b_z - a32 * b_y) + a21 * (a32 * b_x - a12 * b_z) + a31 * (a12 * b_y - a22 * b_x));
          return out;
        }
        Solve22(b_x, b_y, out) {
          const a11 = this.ex.x;
          const a12 = this.ey.x;
          const a21 = this.ex.y;
          const a22 = this.ey.y;
          let det = a11 * a22 - a12 * a21;
          if (det !== 0) {
            det = 1 / det;
          }
          out.x = det * (a22 * b_x - a12 * b_y);
          out.y = det * (a11 * b_y - a21 * b_x);
          return out;
        }
        GetInverse22(M) {
          const a = this.ex.x;
          const b = this.ey.x;
          const c = this.ex.y;
          const d = this.ey.y;
          let det = a * d - b * c;
          if (det !== 0) {
            det = 1 / det;
          }
          M.ex.x = det * d;
          M.ey.x = -det * b;
          M.ex.z = 0;
          M.ex.y = -det * c;
          M.ey.y = det * a;
          M.ey.z = 0;
          M.ez.x = 0;
          M.ez.y = 0;
          M.ez.z = 0;
        }
        GetSymInverse33(M) {
          let det = b2Vec3.Dot(this.ex, b2Vec3.Cross(this.ey, this.ez, b2Vec3.s_t0));
          if (det !== 0) {
            det = 1 / det;
          }
          const a11 = this.ex.x;
          const a12 = this.ey.x;
          const a13 = this.ez.x;
          const a22 = this.ey.y;
          const a23 = this.ez.y;
          const a33 = this.ez.z;
          M.ex.x = det * (a22 * a33 - a23 * a23);
          M.ex.y = det * (a13 * a23 - a12 * a33);
          M.ex.z = det * (a12 * a23 - a13 * a22);
          M.ey.x = M.ex.y;
          M.ey.y = det * (a11 * a33 - a13 * a13);
          M.ey.z = det * (a13 * a12 - a11 * a23);
          M.ez.x = M.ex.z;
          M.ez.y = M.ey.z;
          M.ez.z = det * (a11 * a22 - a12 * a12);
        }
        static MultiplyVec3(A, v, out) {
          const {x, y, z} = v;
          out.x = A.ex.x * x + A.ey.x * y + A.ez.x * z;
          out.y = A.ex.y * x + A.ey.y * y + A.ez.y * z;
          out.z = A.ex.z * x + A.ey.z * y + A.ez.z * z;
          return out;
        }
        static MultiplyVec2(A, v, out) {
          const {x, y} = v;
          out.x = A.ex.x * x + A.ey.x * y;
          out.y = A.ex.y * x + A.ey.y * y;
          return out;
        }
      };
      exports.b2Mat33 = b2Mat33;
      b2Mat33.IDENTITY = new b2Mat33();
      var b2Rot = class {
        constructor(angle = 0) {
          this.s = 0;
          this.c = 1;
          if (angle) {
            this.s = Math.sin(angle);
            this.c = Math.cos(angle);
          }
        }
        Clone() {
          return new b2Rot().Copy(this);
        }
        Copy(other) {
          this.s = other.s;
          this.c = other.c;
          return this;
        }
        Set(angle) {
          this.s = Math.sin(angle);
          this.c = Math.cos(angle);
          return this;
        }
        SetIdentity() {
          this.s = 0;
          this.c = 1;
          return this;
        }
        GetAngle() {
          return Math.atan2(this.s, this.c);
        }
        GetXAxis(out) {
          out.x = this.c;
          out.y = this.s;
          return out;
        }
        GetYAxis(out) {
          out.x = -this.s;
          out.y = this.c;
          return out;
        }
        static Multiply(q, r, out) {
          const s = q.s * r.c + q.c * r.s;
          const c = q.c * r.c - q.s * r.s;
          out.s = s;
          out.c = c;
          return out;
        }
        static TransposeMultiply(q, r, out) {
          const s = q.c * r.s - q.s * r.c;
          const c = q.c * r.c + q.s * r.s;
          out.s = s;
          out.c = c;
          return out;
        }
        static MultiplyVec2(q, v, out) {
          const v_x = v.x;
          const v_y = v.y;
          out.x = q.c * v_x - q.s * v_y;
          out.y = q.s * v_x + q.c * v_y;
          return out;
        }
        static TransposeMultiplyVec2(q, v, out) {
          const v_x = v.x;
          const v_y = v.y;
          out.x = q.c * v_x + q.s * v_y;
          out.y = -q.s * v_x + q.c * v_y;
          return out;
        }
      };
      exports.b2Rot = b2Rot;
      b2Rot.IDENTITY = new b2Rot();
      var b2Transform = class {
        constructor() {
          this.p = new b2Vec24();
          this.q = new b2Rot();
        }
        Clone() {
          return new b2Transform().Copy(this);
        }
        Copy(other) {
          this.p.Copy(other.p);
          this.q.Copy(other.q);
          return this;
        }
        SetIdentity() {
          this.p.SetZero();
          this.q.SetIdentity();
          return this;
        }
        SetPositionRotation(position, q) {
          this.p.Copy(position);
          this.q.Copy(q);
          return this;
        }
        SetPositionAngle(pos, a) {
          this.p.Copy(pos);
          this.q.Set(a);
          return this;
        }
        SetPosition(position) {
          this.p.Copy(position);
          return this;
        }
        SetPositionXY(x, y) {
          this.p.Set(x, y);
          return this;
        }
        SetRotation(rotation) {
          this.q.Copy(rotation);
          return this;
        }
        SetRotationAngle(radians) {
          this.q.Set(radians);
          return this;
        }
        GetPosition() {
          return this.p;
        }
        GetRotation() {
          return this.q;
        }
        GetAngle() {
          return this.q.GetAngle();
        }
        static MultiplyVec2(T, v, out) {
          const v_x = v.x;
          const v_y = v.y;
          out.x = T.q.c * v_x - T.q.s * v_y + T.p.x;
          out.y = T.q.s * v_x + T.q.c * v_y + T.p.y;
          return out;
        }
        static TransposeMultiplyVec2(T, v, out) {
          const px = v.x - T.p.x;
          const py = v.y - T.p.y;
          out.x = T.q.c * px + T.q.s * py;
          out.y = -T.q.s * px + T.q.c * py;
          return out;
        }
        static Multiply(A, B, out) {
          b2Rot.Multiply(A.q, B.q, out.q);
          b2Rot.MultiplyVec2(A.q, B.p, out.p).Add(A.p);
          return out;
        }
        static TransposeMultiply(A, B, out) {
          b2Rot.TransposeMultiply(A.q, B.q, out.q);
          b2Rot.TransposeMultiplyVec2(A.q, b2Vec24.Subtract(B.p, A.p, out.p), out.p);
          return out;
        }
      };
      exports.b2Transform = b2Transform;
      b2Transform.IDENTITY = new b2Transform();
      var b2Sweep = class {
        constructor() {
          this.localCenter = new b2Vec24();
          this.c0 = new b2Vec24();
          this.c = new b2Vec24();
          this.a0 = 0;
          this.a = 0;
          this.alpha0 = 0;
        }
        Clone() {
          return new b2Sweep().Copy(this);
        }
        Copy(other) {
          this.localCenter.Copy(other.localCenter);
          this.c0.Copy(other.c0);
          this.c.Copy(other.c);
          this.a0 = other.a0;
          this.a = other.a;
          this.alpha0 = other.alpha0;
          return this;
        }
        GetTransform(xf, beta) {
          const oneMinusBeta = 1 - beta;
          xf.p.x = oneMinusBeta * this.c0.x + beta * this.c.x;
          xf.p.y = oneMinusBeta * this.c0.y + beta * this.c.y;
          const angle = oneMinusBeta * this.a0 + beta * this.a;
          xf.q.Set(angle);
          xf.p.Subtract(b2Rot.MultiplyVec2(xf.q, this.localCenter, b2Vec24.s_t0));
          return xf;
        }
        Advance(alpha) {
          const beta = (alpha - this.alpha0) / (1 - this.alpha0);
          this.c0.x += beta * (this.c.x - this.c0.x);
          this.c0.y += beta * (this.c.y - this.c0.y);
          this.a0 += beta * (this.a - this.a0);
          this.alpha0 = alpha;
        }
        Normalize() {
          const d = exports.b2_two_pi * Math.floor(this.a0 / exports.b2_two_pi);
          this.a0 -= d;
          this.a -= d;
        }
      };
      exports.b2Sweep = b2Sweep;
    }
  });
  var require_b2_draw = __commonJS({
    "node_modules/@box2d/core/dist/common/b2_draw.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.debugColors = exports.b2Color = void 0;
      var b2Color = class {
        constructor(r = 0.5, g = 0.5, b = 0.5, a = 1) {
          this.r = r;
          this.g = g;
          this.b = b;
          this.a = a;
        }
        Clone() {
          return new b2Color(this.r, this.g, this.b, this.a);
        }
        Copy(other) {
          this.r = other.r;
          this.g = other.g;
          this.b = other.b;
          this.a = other.a;
          return this;
        }
        IsEqual(color) {
          return this.r === color.r && this.g === color.g && this.b === color.b && this.a === color.a;
        }
        IsZero() {
          return this.r === 0 && this.g === 0 && this.b === 0 && this.a === 0;
        }
        SetByteRGB(r, g, b) {
          this.r = r / 255;
          this.g = g / 255;
          this.b = b / 255;
          return this;
        }
        SetByteRGBA(r, g, b, a) {
          this.r = r / 255;
          this.g = g / 255;
          this.b = b / 255;
          this.a = a / 255;
          return this;
        }
        SetRGB(r, g, b) {
          this.r = r;
          this.g = g;
          this.b = b;
          return this;
        }
        SetRGBA(r, g, b, a) {
          this.r = r;
          this.g = g;
          this.b = b;
          this.a = a;
          return this;
        }
        Add(color) {
          this.r += color.r;
          this.g += color.g;
          this.b += color.b;
          this.a += color.a;
          return this;
        }
        Subtract(color) {
          this.r -= color.r;
          this.g -= color.g;
          this.b -= color.b;
          this.a -= color.a;
          return this;
        }
        Scale(s) {
          this.r *= s;
          this.g *= s;
          this.b *= s;
          this.a *= s;
          return this;
        }
        Mix(mixColor, strength) {
          b2Color.MixColors(this, mixColor, strength);
        }
        static Add(colorA, colorB, out) {
          out.r = colorA.r + colorB.r;
          out.g = colorA.g + colorB.g;
          out.b = colorA.b + colorB.b;
          out.a = colorA.a + colorB.a;
          return out;
        }
        static Subtract(colorA, colorB, out) {
          out.r = colorA.r - colorB.r;
          out.g = colorA.g - colorB.g;
          out.b = colorA.b - colorB.b;
          out.a = colorA.a - colorB.a;
          return out;
        }
        static Scale(color, s, out) {
          out.r = color.r * s;
          out.g = color.g * s;
          out.b = color.b * s;
          out.a = color.a * s;
          return out;
        }
        static MixColors(colorA, colorB, strength) {
          const dr = strength * (colorB.r - colorA.r);
          const dg = strength * (colorB.g - colorA.g);
          const db = strength * (colorB.b - colorA.b);
          const da = strength * (colorB.a - colorA.a);
          colorA.r += dr;
          colorA.g += dg;
          colorA.b += db;
          colorA.a += da;
          colorB.r -= dr;
          colorB.g -= dg;
          colorB.b -= db;
          colorB.a -= da;
        }
      };
      exports.b2Color = b2Color;
      b2Color.ZERO = new b2Color(0, 0, 0, 0);
      b2Color.RED = new b2Color(1, 0, 0);
      b2Color.GREEN = new b2Color(0, 1, 0);
      b2Color.BLUE = new b2Color(0, 0, 1);
      b2Color.WHITE = new b2Color(1, 1, 1);
      b2Color.BLACK = new b2Color(0, 0, 0);
      exports.debugColors = {
        badBody: new b2Color(1, 0, 0),
        disabledBody: new b2Color(0.5, 0.5, 0.3),
        staticBody: new b2Color(0.5, 0.9, 0.5),
        kinematicBody: new b2Color(0.5, 0.5, 0.9),
        sleepingBody: new b2Color(0.6, 0.6, 0.6),
        body: new b2Color(0.9, 0.7, 0.7),
        pair: new b2Color(0.3, 0.9, 0.9),
        aabb: new b2Color(0.9, 0.3, 0.9),
        joint1: new b2Color(0.7, 0.7, 0.7),
        joint2: new b2Color(0.3, 0.9, 0.3),
        joint3: new b2Color(0.9, 0.3, 0.3),
        joint4: new b2Color(0.3, 0.3, 0.9),
        joint5: new b2Color(0.4, 0.4, 0.4),
        joint6: new b2Color(0.5, 0.8, 0.8),
        joint7: new b2Color(0, 1, 0),
        joint8: new b2Color(0.8, 0.8, 0.8),
        rope: new b2Color(0.4, 0.5, 0.7),
        ropePointG: new b2Color(0.1, 0.8, 0.1),
        ropePointD: new b2Color(0.7, 0.2, 0.4)
      };
    }
  });
  var require_b2_shape = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_shape.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2Shape = exports.b2ShapeType = exports.b2MassData = void 0;
      var b2_math_1 = require_b2_math();
      var b2MassData = class {
        constructor() {
          this.mass = 0;
          this.center = new b2_math_1.b2Vec2();
          this.I = 0;
        }
      };
      exports.b2MassData = b2MassData;
      var b2ShapeType;
      (function (b2ShapeType2) {
        b2ShapeType2[b2ShapeType2["e_unknown"] = -1] = "e_unknown";
        b2ShapeType2[b2ShapeType2["e_circle"] = 0] = "e_circle";
        b2ShapeType2[b2ShapeType2["e_edge"] = 1] = "e_edge";
        b2ShapeType2[b2ShapeType2["e_polygon"] = 2] = "e_polygon";
        b2ShapeType2[b2ShapeType2["e_chain"] = 3] = "e_chain";
        b2ShapeType2[b2ShapeType2["e_typeCount"] = 4] = "e_typeCount";
      })(b2ShapeType = exports.b2ShapeType || (exports.b2ShapeType = {}));
      var b2Shape = class {
        constructor(type, radius) {
          this.m_radius = 0;
          this.m_type = type;
          this.m_radius = radius;
        }
        Copy(other) {
          this.m_radius = other.m_radius;
          return this;
        }
        GetType() {
          return this.m_type;
        }
      };
      exports.b2Shape = b2Shape;
    }
  });
  var require_b2_distance = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_distance.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2ShapeCast = exports.b2Distance = exports.b2Gjk = exports.b2ShapeCastOutput = exports.b2ShapeCastInput = exports.b2DistanceOutput = exports.b2DistanceInput = exports.b2SimplexCache = exports.b2DistanceProxy = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2DistanceProxy = class {
        constructor() {
          this.m_buffer = (0, b2_common_1.b2MakeArray)(2, b2_math_1.b2Vec2);
          this.m_vertices = this.m_buffer;
          this.m_count = 0;
          this.m_radius = 0;
        }
        Copy(other) {
          if (other.m_vertices === other.m_buffer) {
            this.m_vertices = this.m_buffer;
            this.m_buffer[0].Copy(other.m_buffer[0]);
            this.m_buffer[1].Copy(other.m_buffer[1]);
          } else {
            this.m_vertices = other.m_vertices;
          }
          this.m_count = other.m_count;
          this.m_radius = other.m_radius;
          return this;
        }
        Reset() {
          this.m_vertices = this.m_buffer;
          this.m_count = 0;
          this.m_radius = 0;
          return this;
        }
        SetShape(shape, index) {
          shape.SetupDistanceProxy(this, index);
        }
        SetVerticesRadius(vertices, count, radius) {
          this.m_vertices = vertices;
          this.m_count = count;
          this.m_radius = radius;
        }
        GetSupport(d) {
          let bestIndex = 0;
          let bestValue = b2_math_1.b2Vec2.Dot(this.m_vertices[0], d);
          for (let i = 1; i < this.m_count; ++i) {
            const value = b2_math_1.b2Vec2.Dot(this.m_vertices[i], d);
            if (value > bestValue) {
              bestIndex = i;
              bestValue = value;
            }
          }
          return bestIndex;
        }
        GetSupportVertex(d) {
          let bestIndex = 0;
          let bestValue = b2_math_1.b2Vec2.Dot(this.m_vertices[0], d);
          for (let i = 1; i < this.m_count; ++i) {
            const value = b2_math_1.b2Vec2.Dot(this.m_vertices[i], d);
            if (value > bestValue) {
              bestIndex = i;
              bestValue = value;
            }
          }
          return this.m_vertices[bestIndex];
        }
        GetVertexCount() {
          return this.m_count;
        }
        GetVertex(index) {
          return this.m_vertices[index];
        }
      };
      exports.b2DistanceProxy = b2DistanceProxy;
      var b2SimplexCache = class {
        constructor() {
          this.metric = 0;
          this.count = 0;
          this.indexA = [0, 0, 0];
          this.indexB = [0, 0, 0];
        }
        Reset() {
          this.metric = 0;
          this.count = 0;
          return this;
        }
      };
      exports.b2SimplexCache = b2SimplexCache;
      var b2DistanceInput = class {
        constructor() {
          this.proxyA = new b2DistanceProxy();
          this.proxyB = new b2DistanceProxy();
          this.transformA = new b2_math_1.b2Transform();
          this.transformB = new b2_math_1.b2Transform();
          this.useRadii = false;
        }
        Reset() {
          this.proxyA.Reset();
          this.proxyB.Reset();
          this.transformA.SetIdentity();
          this.transformB.SetIdentity();
          this.useRadii = false;
          return this;
        }
      };
      exports.b2DistanceInput = b2DistanceInput;
      var b2DistanceOutput = class {
        constructor() {
          this.pointA = new b2_math_1.b2Vec2();
          this.pointB = new b2_math_1.b2Vec2();
          this.distance = 0;
          this.iterations = 0;
        }
        Reset() {
          this.pointA.SetZero();
          this.pointB.SetZero();
          this.distance = 0;
          this.iterations = 0;
          return this;
        }
      };
      exports.b2DistanceOutput = b2DistanceOutput;
      var b2ShapeCastInput = class {
        constructor() {
          this.proxyA = new b2DistanceProxy();
          this.proxyB = new b2DistanceProxy();
          this.transformA = new b2_math_1.b2Transform();
          this.transformB = new b2_math_1.b2Transform();
          this.translationB = new b2_math_1.b2Vec2();
        }
      };
      exports.b2ShapeCastInput = b2ShapeCastInput;
      var b2ShapeCastOutput = class {
        constructor() {
          this.point = new b2_math_1.b2Vec2();
          this.normal = new b2_math_1.b2Vec2();
          this.lambda = 0;
          this.iterations = 0;
        }
      };
      exports.b2ShapeCastOutput = b2ShapeCastOutput;
      exports.b2Gjk = {
        calls: 0,
        iters: 0,
        maxIters: 0,
        reset() {
          this.calls = 0;
          this.iters = 0;
          this.maxIters = 0;
        }
      };
      var b2SimplexVertex = class {
        constructor() {
          this.wA = new b2_math_1.b2Vec2();
          this.wB = new b2_math_1.b2Vec2();
          this.w = new b2_math_1.b2Vec2();
          this.a = 0;
          this.indexA = 0;
          this.indexB = 0;
        }
        Copy(other) {
          this.wA.Copy(other.wA);
          this.wB.Copy(other.wB);
          this.w.Copy(other.w);
          this.a = other.a;
          this.indexA = other.indexA;
          this.indexB = other.indexB;
          return this;
        }
      };
      var b2Simplex = class {
        constructor() {
          this.m_v1 = new b2SimplexVertex();
          this.m_v2 = new b2SimplexVertex();
          this.m_v3 = new b2SimplexVertex();
          this.m_count = 0;
          this.m_vertices = [this.m_v1, this.m_v2, this.m_v3];
        }
        ReadCache(cache, proxyA, transformA, proxyB, transformB) {
          this.m_count = cache.count;
          const vertices = this.m_vertices;
          for (let i = 0; i < this.m_count; ++i) {
            const v = vertices[i];
            v.indexA = cache.indexA[i];
            v.indexB = cache.indexB[i];
            const wALocal = proxyA.GetVertex(v.indexA);
            const wBLocal = proxyB.GetVertex(v.indexB);
            b2_math_1.b2Transform.MultiplyVec2(transformA, wALocal, v.wA);
            b2_math_1.b2Transform.MultiplyVec2(transformB, wBLocal, v.wB);
            b2_math_1.b2Vec2.Subtract(v.wB, v.wA, v.w);
            v.a = 0;
          }
          if (this.m_count > 1) {
            const metric1 = cache.metric;
            const metric2 = this.GetMetric();
            if (metric2 < 0.5 * metric1 || 2 * metric1 < metric2 || metric2 < b2_common_1.b2_epsilon) {
              this.m_count = 0;
            }
          }
          if (this.m_count === 0) {
            const v = vertices[0];
            v.indexA = 0;
            v.indexB = 0;
            const wALocal = proxyA.GetVertex(0);
            const wBLocal = proxyB.GetVertex(0);
            b2_math_1.b2Transform.MultiplyVec2(transformA, wALocal, v.wA);
            b2_math_1.b2Transform.MultiplyVec2(transformB, wBLocal, v.wB);
            b2_math_1.b2Vec2.Subtract(v.wB, v.wA, v.w);
            v.a = 1;
            this.m_count = 1;
          }
        }
        WriteCache(cache) {
          cache.metric = this.GetMetric();
          cache.count = this.m_count;
          const vertices = this.m_vertices;
          for (let i = 0; i < this.m_count; ++i) {
            cache.indexA[i] = vertices[i].indexA;
            cache.indexB[i] = vertices[i].indexB;
          }
        }
        GetSearchDirection(out) {
          switch (this.m_count) {
            case 1:
              return b2_math_1.b2Vec2.Negate(this.m_v1.w, out);
            case 2:
              {
                const e12 = b2_math_1.b2Vec2.Subtract(this.m_v2.w, this.m_v1.w, out);
                const sgn = b2_math_1.b2Vec2.Cross(e12, b2_math_1.b2Vec2.Negate(this.m_v1.w, b2_math_1.b2Vec2.s_t0));
                if (sgn > 0) {
                  return b2_math_1.b2Vec2.CrossOneVec2(e12, out);
                }
                return b2_math_1.b2Vec2.CrossVec2One(e12, out);
              }
            default:
              return out.SetZero();
          }
        }
        GetClosestPoint(out) {
          switch (this.m_count) {
            case 0:
              return out.SetZero();
            case 1:
              return out.Copy(this.m_v1.w);
            case 2:
              return out.Set(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
            case 3:
              return out.SetZero();
            default:
              return out.SetZero();
          }
        }
        GetWitnessPoints(pA, pB) {
          switch (this.m_count) {
            case 0:
              break;
            case 1:
              pA.Copy(this.m_v1.wA);
              pB.Copy(this.m_v1.wB);
              break;
            case 2:
              pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
              pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
              pB.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
              pB.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
              break;
            case 3:
              pB.x = pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x + this.m_v3.a * this.m_v3.wA.x;
              pB.y = pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
              break;
            default:
              break;
          }
        }
        GetMetric() {
          switch (this.m_count) {
            case 0:
              return 0;
            case 1:
              return 0;
            case 2:
              return b2_math_1.b2Vec2.Distance(this.m_v1.w, this.m_v2.w);
            case 3:
              return b2_math_1.b2Vec2.Cross(b2_math_1.b2Vec2.Subtract(this.m_v2.w, this.m_v1.w, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.Subtract(this.m_v3.w, this.m_v1.w, b2_math_1.b2Vec2.s_t1));
            default:
              return 0;
          }
        }
        Solve2() {
          const w1 = this.m_v1.w;
          const w2 = this.m_v2.w;
          const e12 = b2_math_1.b2Vec2.Subtract(w2, w1, b2Simplex.s_e12);
          const d12_2 = -b2_math_1.b2Vec2.Dot(w1, e12);
          if (d12_2 <= 0) {
            this.m_v1.a = 1;
            this.m_count = 1;
            return;
          }
          const d12_1 = b2_math_1.b2Vec2.Dot(w2, e12);
          if (d12_1 <= 0) {
            this.m_v2.a = 1;
            this.m_count = 1;
            this.m_v1.Copy(this.m_v2);
            return;
          }
          const inv_d12 = 1 / (d12_1 + d12_2);
          this.m_v1.a = d12_1 * inv_d12;
          this.m_v2.a = d12_2 * inv_d12;
          this.m_count = 2;
        }
        Solve3() {
          const w1 = this.m_v1.w;
          const w2 = this.m_v2.w;
          const w3 = this.m_v3.w;
          const e12 = b2_math_1.b2Vec2.Subtract(w2, w1, b2Simplex.s_e12);
          const w1e12 = b2_math_1.b2Vec2.Dot(w1, e12);
          const w2e12 = b2_math_1.b2Vec2.Dot(w2, e12);
          const d12_1 = w2e12;
          const d12_2 = -w1e12;
          const e13 = b2_math_1.b2Vec2.Subtract(w3, w1, b2Simplex.s_e13);
          const w1e13 = b2_math_1.b2Vec2.Dot(w1, e13);
          const w3e13 = b2_math_1.b2Vec2.Dot(w3, e13);
          const d13_1 = w3e13;
          const d13_2 = -w1e13;
          const e23 = b2_math_1.b2Vec2.Subtract(w3, w2, b2Simplex.s_e23);
          const w2e23 = b2_math_1.b2Vec2.Dot(w2, e23);
          const w3e23 = b2_math_1.b2Vec2.Dot(w3, e23);
          const d23_1 = w3e23;
          const d23_2 = -w2e23;
          const n123 = b2_math_1.b2Vec2.Cross(e12, e13);
          const d123_1 = n123 * b2_math_1.b2Vec2.Cross(w2, w3);
          const d123_2 = n123 * b2_math_1.b2Vec2.Cross(w3, w1);
          const d123_3 = n123 * b2_math_1.b2Vec2.Cross(w1, w2);
          if (d12_2 <= 0 && d13_2 <= 0) {
            this.m_v1.a = 1;
            this.m_count = 1;
            return;
          }
          if (d12_1 > 0 && d12_2 > 0 && d123_3 <= 0) {
            const inv_d12 = 1 / (d12_1 + d12_2);
            this.m_v1.a = d12_1 * inv_d12;
            this.m_v2.a = d12_2 * inv_d12;
            this.m_count = 2;
            return;
          }
          if (d13_1 > 0 && d13_2 > 0 && d123_2 <= 0) {
            const inv_d13 = 1 / (d13_1 + d13_2);
            this.m_v1.a = d13_1 * inv_d13;
            this.m_v3.a = d13_2 * inv_d13;
            this.m_count = 2;
            this.m_v2.Copy(this.m_v3);
            return;
          }
          if (d12_1 <= 0 && d23_2 <= 0) {
            this.m_v2.a = 1;
            this.m_count = 1;
            this.m_v1.Copy(this.m_v2);
            return;
          }
          if (d13_1 <= 0 && d23_1 <= 0) {
            this.m_v3.a = 1;
            this.m_count = 1;
            this.m_v1.Copy(this.m_v3);
            return;
          }
          if (d23_1 > 0 && d23_2 > 0 && d123_1 <= 0) {
            const inv_d23 = 1 / (d23_1 + d23_2);
            this.m_v2.a = d23_1 * inv_d23;
            this.m_v3.a = d23_2 * inv_d23;
            this.m_count = 2;
            this.m_v1.Copy(this.m_v3);
            return;
          }
          const inv_d123 = 1 / (d123_1 + d123_2 + d123_3);
          this.m_v1.a = d123_1 * inv_d123;
          this.m_v2.a = d123_2 * inv_d123;
          this.m_v3.a = d123_3 * inv_d123;
          this.m_count = 3;
        }
      };
      b2Simplex.s_e12 = new b2_math_1.b2Vec2();
      b2Simplex.s_e13 = new b2_math_1.b2Vec2();
      b2Simplex.s_e23 = new b2_math_1.b2Vec2();
      var b2Distance_s_simplex = new b2Simplex();
      var b2Distance_s_saveA = [0, 0, 0];
      var b2Distance_s_saveB = [0, 0, 0];
      var b2Distance_s_p = new b2_math_1.b2Vec2();
      var b2Distance_s_d = new b2_math_1.b2Vec2();
      var b2Distance_s_normal = new b2_math_1.b2Vec2();
      var b2Distance_s_supportA = new b2_math_1.b2Vec2();
      var b2Distance_s_supportB = new b2_math_1.b2Vec2();
      function b2Distance(output, cache, input) {
        ++exports.b2Gjk.calls;
        const {proxyA, proxyB, transformA, transformB} = input;
        const simplex = b2Distance_s_simplex;
        simplex.ReadCache(cache, proxyA, transformA, proxyB, transformB);
        const vertices = simplex.m_vertices;
        const k_maxIters = 20;
        const saveA = b2Distance_s_saveA;
        const saveB = b2Distance_s_saveB;
        let saveCount = 0;
        let iter = 0;
        while (iter < k_maxIters) {
          saveCount = simplex.m_count;
          for (let i = 0; i < saveCount; ++i) {
            saveA[i] = vertices[i].indexA;
            saveB[i] = vertices[i].indexB;
          }
          switch (simplex.m_count) {
            case 1:
              break;
            case 2:
              simplex.Solve2();
              break;
            case 3:
              simplex.Solve3();
              break;
          }
          if (simplex.m_count === 3) {
            break;
          }
          const d = simplex.GetSearchDirection(b2Distance_s_d);
          if (d.LengthSquared() < b2_common_1.b2_epsilon_sq) {
            break;
          }
          const vertex = vertices[simplex.m_count];
          vertex.indexA = proxyA.GetSupport(b2_math_1.b2Rot.TransposeMultiplyVec2(transformA.q, b2_math_1.b2Vec2.Negate(d, b2_math_1.b2Vec2.s_t0), b2Distance_s_supportA));
          b2_math_1.b2Transform.MultiplyVec2(transformA, proxyA.GetVertex(vertex.indexA), vertex.wA);
          vertex.indexB = proxyB.GetSupport(b2_math_1.b2Rot.TransposeMultiplyVec2(transformB.q, d, b2Distance_s_supportB));
          b2_math_1.b2Transform.MultiplyVec2(transformB, proxyB.GetVertex(vertex.indexB), vertex.wB);
          b2_math_1.b2Vec2.Subtract(vertex.wB, vertex.wA, vertex.w);
          ++iter;
          ++exports.b2Gjk.iters;
          let duplicate = false;
          for (let i = 0; i < saveCount; ++i) {
            if (vertex.indexA === saveA[i] && vertex.indexB === saveB[i]) {
              duplicate = true;
              break;
            }
          }
          if (duplicate) {
            break;
          }
          ++simplex.m_count;
        }
        exports.b2Gjk.maxIters = Math.max(exports.b2Gjk.maxIters, iter);
        simplex.GetWitnessPoints(output.pointA, output.pointB);
        output.distance = b2_math_1.b2Vec2.Distance(output.pointA, output.pointB);
        output.iterations = iter;
        simplex.WriteCache(cache);
        if (input.useRadii) {
          const rA = proxyA.m_radius;
          const rB = proxyB.m_radius;
          if (output.distance > rA + rB && output.distance > b2_common_1.b2_epsilon) {
            output.distance -= rA + rB;
            const normal = b2_math_1.b2Vec2.Subtract(output.pointB, output.pointA, b2Distance_s_normal);
            normal.Normalize();
            output.pointA.AddScaled(rA, normal);
            output.pointB.SubtractScaled(rB, normal);
          } else {
            const p = b2_math_1.b2Vec2.Mid(output.pointA, output.pointB, b2Distance_s_p);
            output.pointA.Copy(p);
            output.pointB.Copy(p);
            output.distance = 0;
          }
        }
      }
      exports.b2Distance = b2Distance;
      var b2ShapeCast_s_n = new b2_math_1.b2Vec2();
      var b2ShapeCast_s_simplex = new b2Simplex();
      var b2ShapeCast_s_wA = new b2_math_1.b2Vec2();
      var b2ShapeCast_s_wB = new b2_math_1.b2Vec2();
      var b2ShapeCast_s_v = new b2_math_1.b2Vec2();
      var b2ShapeCast_s_p = new b2_math_1.b2Vec2();
      var b2ShapeCast_s_pointA = new b2_math_1.b2Vec2();
      var b2ShapeCast_s_pointB = new b2_math_1.b2Vec2();
      function b2ShapeCast(output, input) {
        output.iterations = 0;
        output.lambda = 1;
        output.normal.SetZero();
        output.point.SetZero();
        const {proxyA, proxyB} = input;
        const radiusA = Math.max(proxyA.m_radius, b2_common_1.b2_polygonRadius);
        const radiusB = Math.max(proxyB.m_radius, b2_common_1.b2_polygonRadius);
        const radius = radiusA + radiusB;
        const xfA = input.transformA;
        const xfB = input.transformB;
        const r = input.translationB;
        const n = b2ShapeCast_s_n.SetZero();
        let lambda = 0;
        const simplex = b2ShapeCast_s_simplex;
        simplex.m_count = 0;
        const vertices = simplex.m_vertices;
        let indexA = proxyA.GetSupport(b2_math_1.b2Rot.TransposeMultiplyVec2(xfA.q, b2_math_1.b2Vec2.Negate(r, b2_math_1.b2Vec2.s_t1), b2_math_1.b2Vec2.s_t0));
        let wA = b2_math_1.b2Transform.MultiplyVec2(xfA, proxyA.GetVertex(indexA), b2ShapeCast_s_wA);
        let indexB = proxyB.GetSupport(b2_math_1.b2Rot.TransposeMultiplyVec2(xfB.q, r, b2_math_1.b2Vec2.s_t0));
        let wB = b2_math_1.b2Transform.MultiplyVec2(xfB, proxyB.GetVertex(indexB), b2ShapeCast_s_wB);
        const v = b2_math_1.b2Vec2.Subtract(wA, wB, b2ShapeCast_s_v);
        const sigma = Math.max(b2_common_1.b2_polygonRadius, radius - b2_common_1.b2_polygonRadius);
        const tolerance = 0.5 * b2_common_1.b2_linearSlop;
        const k_maxIters = 20;
        let iter = 0;
        while (iter < k_maxIters && v.Length() - sigma > tolerance) {
          output.iterations += 1;
          indexA = proxyA.GetSupport(b2_math_1.b2Rot.TransposeMultiplyVec2(xfA.q, b2_math_1.b2Vec2.Negate(v, b2_math_1.b2Vec2.s_t1), b2_math_1.b2Vec2.s_t0));
          wA = b2_math_1.b2Transform.MultiplyVec2(xfA, proxyA.GetVertex(indexA), b2ShapeCast_s_wA);
          indexB = proxyB.GetSupport(b2_math_1.b2Rot.TransposeMultiplyVec2(xfB.q, v, b2_math_1.b2Vec2.s_t0));
          wB = b2_math_1.b2Transform.MultiplyVec2(xfB, proxyB.GetVertex(indexB), b2ShapeCast_s_wB);
          const p = b2_math_1.b2Vec2.Subtract(wA, wB, b2ShapeCast_s_p);
          v.Normalize();
          const vp = b2_math_1.b2Vec2.Dot(v, p);
          const vr = b2_math_1.b2Vec2.Dot(v, r);
          if (vp - sigma > lambda * vr) {
            if (vr <= 0) {
              return false;
            }
            lambda = (vp - sigma) / vr;
            if (lambda > 1) {
              return false;
            }
            b2_math_1.b2Vec2.Negate(v, n);
            simplex.m_count = 0;
          }
          const vertex = vertices[simplex.m_count];
          vertex.indexA = indexB;
          b2_math_1.b2Vec2.AddScaled(wB, lambda, r, vertex.wA);
          vertex.indexB = indexA;
          vertex.wB.Copy(wA);
          b2_math_1.b2Vec2.Subtract(vertex.wB, vertex.wA, vertex.w);
          vertex.a = 1;
          simplex.m_count += 1;
          switch (simplex.m_count) {
            case 1:
              break;
            case 2:
              simplex.Solve2();
              break;
            case 3:
              simplex.Solve3();
              break;
          }
          if (simplex.m_count === 3) {
            return false;
          }
          simplex.GetClosestPoint(v);
          ++iter;
        }
        if (iter === 0) {
          return false;
        }
        const pointA = b2ShapeCast_s_pointA;
        const pointB = b2ShapeCast_s_pointB;
        simplex.GetWitnessPoints(pointA, pointB);
        if (v.LengthSquared() > 0) {
          b2_math_1.b2Vec2.Negate(v, n);
          n.Normalize();
        }
        b2_math_1.b2Vec2.AddScaled(pointA, radiusA, n, output.point);
        output.normal.Copy(n);
        output.lambda = lambda;
        output.iterations = iter;
        return true;
      }
      exports.b2ShapeCast = b2ShapeCast;
    }
  });
  var require_b2_collision = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_collision.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2TestOverlap = exports.b2ClipSegmentToLine = exports.b2AABB = exports.b2RayCastOutput = exports.b2RayCastInput = exports.b2ClipVertex = exports.b2GetPointStates = exports.b2PointState = exports.b2WorldManifold = exports.b2Manifold = exports.b2ManifoldType = exports.b2ManifoldPoint = exports.b2ContactID = exports.b2ContactFeature = exports.b2ContactFeatureType = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_distance_1 = require_b2_distance();
      var b2ContactFeatureType;
      (function (b2ContactFeatureType2) {
        b2ContactFeatureType2[b2ContactFeatureType2["e_vertex"] = 0] = "e_vertex";
        b2ContactFeatureType2[b2ContactFeatureType2["e_face"] = 1] = "e_face";
      })(b2ContactFeatureType = exports.b2ContactFeatureType || (exports.b2ContactFeatureType = {}));
      var b2ContactFeature = class {
        constructor() {
          this.m_key = 0;
          this.m_key_invalid = false;
          this.m_indexA = 0;
          this.m_indexB = 0;
          this.m_typeA = b2ContactFeatureType.e_vertex;
          this.m_typeB = b2ContactFeatureType.e_vertex;
        }
        get key() {
          if (this.m_key_invalid) {
            this.m_key_invalid = false;
            this.m_key = this.m_indexA | this.m_indexB << 8 | this.m_typeA << 16 | this.m_typeB << 24;
          }
          return this.m_key;
        }
        set key(value) {
          this.m_key = value;
          this.m_key_invalid = false;
          this.m_indexA = this.m_key & 255;
          this.m_indexB = this.m_key >> 8 & 255;
          this.m_typeA = this.m_key >> 16 & 255;
          this.m_typeB = this.m_key >> 24 & 255;
        }
        get indexA() {
          return this.m_indexA;
        }
        set indexA(value) {
          this.m_indexA = value;
          this.m_key_invalid = true;
        }
        get indexB() {
          return this.m_indexB;
        }
        set indexB(value) {
          this.m_indexB = value;
          this.m_key_invalid = true;
        }
        get typeA() {
          return this.m_typeA;
        }
        set typeA(value) {
          this.m_typeA = value;
          this.m_key_invalid = true;
        }
        get typeB() {
          return this.m_typeB;
        }
        set typeB(value) {
          this.m_typeB = value;
          this.m_key_invalid = true;
        }
      };
      exports.b2ContactFeature = b2ContactFeature;
      var b2ContactID = class {
        constructor() {
          this.cf = new b2ContactFeature();
        }
        Copy(o) {
          this.key = o.key;
          return this;
        }
        Clone() {
          return new b2ContactID().Copy(this);
        }
        get key() {
          return this.cf.key;
        }
        set key(value) {
          this.cf.key = value;
        }
      };
      exports.b2ContactID = b2ContactID;
      var b2ManifoldPoint = class {
        constructor() {
          this.localPoint = new b2_math_1.b2Vec2();
          this.normalImpulse = 0;
          this.tangentImpulse = 0;
          this.id = new b2ContactID();
        }
        Reset() {
          this.localPoint.SetZero();
          this.normalImpulse = 0;
          this.tangentImpulse = 0;
          this.id.key = 0;
        }
        Copy(o) {
          this.localPoint.Copy(o.localPoint);
          this.normalImpulse = o.normalImpulse;
          this.tangentImpulse = o.tangentImpulse;
          this.id.Copy(o.id);
          return this;
        }
      };
      exports.b2ManifoldPoint = b2ManifoldPoint;
      var b2ManifoldType;
      (function (b2ManifoldType2) {
        b2ManifoldType2[b2ManifoldType2["e_circles"] = 0] = "e_circles";
        b2ManifoldType2[b2ManifoldType2["e_faceA"] = 1] = "e_faceA";
        b2ManifoldType2[b2ManifoldType2["e_faceB"] = 2] = "e_faceB";
      })(b2ManifoldType = exports.b2ManifoldType || (exports.b2ManifoldType = {}));
      var b2Manifold = class {
        constructor() {
          this.points = (0, b2_common_1.b2MakeArray)(b2_common_1.b2_maxManifoldPoints, b2ManifoldPoint);
          this.localNormal = new b2_math_1.b2Vec2();
          this.localPoint = new b2_math_1.b2Vec2();
          this.type = b2ManifoldType.e_circles;
          this.pointCount = 0;
        }
        Reset() {
          for (let i = 0; i < b2_common_1.b2_maxManifoldPoints; ++i) {
            this.points[i].Reset();
          }
          this.localNormal.SetZero();
          this.localPoint.SetZero();
          this.type = b2ManifoldType.e_circles;
          this.pointCount = 0;
        }
        Copy(o) {
          this.pointCount = o.pointCount;
          for (let i = 0; i < b2_common_1.b2_maxManifoldPoints; ++i) {
            this.points[i].Copy(o.points[i]);
          }
          this.localNormal.Copy(o.localNormal);
          this.localPoint.Copy(o.localPoint);
          this.type = o.type;
          return this;
        }
        Clone() {
          return new b2Manifold().Copy(this);
        }
      };
      exports.b2Manifold = b2Manifold;
      var b2WorldManifold = class {
        constructor() {
          this.normal = new b2_math_1.b2Vec2();
          this.points = (0, b2_common_1.b2MakeArray)(b2_common_1.b2_maxManifoldPoints, b2_math_1.b2Vec2);
          this.separations = (0, b2_common_1.b2MakeNumberArray)(b2_common_1.b2_maxManifoldPoints);
        }
        Initialize(manifold, xfA, radiusA, xfB, radiusB) {
          if (manifold.pointCount === 0) {
            return;
          }
          switch (manifold.type) {
            case b2ManifoldType.e_circles:
              {
                this.normal.Set(1, 0);
                const pointA = b2_math_1.b2Transform.MultiplyVec2(xfA, manifold.localPoint, b2WorldManifold.Initialize_s_pointA);
                const pointB = b2_math_1.b2Transform.MultiplyVec2(xfB, manifold.points[0].localPoint, b2WorldManifold.Initialize_s_pointB);
                if (b2_math_1.b2Vec2.DistanceSquared(pointA, pointB) > b2_common_1.b2_epsilon_sq) {
                  b2_math_1.b2Vec2.Subtract(pointB, pointA, this.normal).Normalize();
                }
                const cA = b2_math_1.b2Vec2.AddScaled(pointA, radiusA, this.normal, b2WorldManifold.Initialize_s_cA);
                const cB = b2_math_1.b2Vec2.SubtractScaled(pointB, radiusB, this.normal, b2WorldManifold.Initialize_s_cB);
                b2_math_1.b2Vec2.Mid(cA, cB, this.points[0]);
                this.separations[0] = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(cB, cA, b2_math_1.b2Vec2.s_t0), this.normal);
                break;
              }
            case b2ManifoldType.e_faceA:
              {
                b2_math_1.b2Rot.MultiplyVec2(xfA.q, manifold.localNormal, this.normal);
                const planePoint = b2_math_1.b2Transform.MultiplyVec2(xfA, manifold.localPoint, b2WorldManifold.Initialize_s_planePoint);
                for (let i = 0; i < manifold.pointCount; ++i) {
                  const clipPoint = b2_math_1.b2Transform.MultiplyVec2(xfB, manifold.points[i].localPoint, b2WorldManifold.Initialize_s_clipPoint);
                  const s = radiusA - b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(clipPoint, planePoint, b2_math_1.b2Vec2.s_t0), this.normal);
                  const cA = b2_math_1.b2Vec2.AddScaled(clipPoint, s, this.normal, b2WorldManifold.Initialize_s_cA);
                  const cB = b2_math_1.b2Vec2.SubtractScaled(clipPoint, radiusB, this.normal, b2WorldManifold.Initialize_s_cB);
                  b2_math_1.b2Vec2.Mid(cA, cB, this.points[i]);
                  this.separations[i] = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(cB, cA, b2_math_1.b2Vec2.s_t0), this.normal);
                }
                break;
              }
            case b2ManifoldType.e_faceB:
              {
                b2_math_1.b2Rot.MultiplyVec2(xfB.q, manifold.localNormal, this.normal);
                const planePoint = b2_math_1.b2Transform.MultiplyVec2(xfB, manifold.localPoint, b2WorldManifold.Initialize_s_planePoint);
                for (let i = 0; i < manifold.pointCount; ++i) {
                  const clipPoint = b2_math_1.b2Transform.MultiplyVec2(xfA, manifold.points[i].localPoint, b2WorldManifold.Initialize_s_clipPoint);
                  const s = radiusB - b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(clipPoint, planePoint, b2_math_1.b2Vec2.s_t0), this.normal);
                  const cB = b2_math_1.b2Vec2.AddScaled(clipPoint, s, this.normal, b2WorldManifold.Initialize_s_cB);
                  const cA = b2_math_1.b2Vec2.SubtractScaled(clipPoint, radiusA, this.normal, b2WorldManifold.Initialize_s_cA);
                  b2_math_1.b2Vec2.Mid(cA, cB, this.points[i]);
                  this.separations[i] = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(cA, cB, b2_math_1.b2Vec2.s_t0), this.normal);
                }
                this.normal.Negate();
                break;
              }
          }
        }
      };
      exports.b2WorldManifold = b2WorldManifold;
      b2WorldManifold.Initialize_s_pointA = new b2_math_1.b2Vec2();
      b2WorldManifold.Initialize_s_pointB = new b2_math_1.b2Vec2();
      b2WorldManifold.Initialize_s_cA = new b2_math_1.b2Vec2();
      b2WorldManifold.Initialize_s_cB = new b2_math_1.b2Vec2();
      b2WorldManifold.Initialize_s_planePoint = new b2_math_1.b2Vec2();
      b2WorldManifold.Initialize_s_clipPoint = new b2_math_1.b2Vec2();
      var b2PointState;
      (function (b2PointState2) {
        b2PointState2[b2PointState2["b2_nullState"] = 0] = "b2_nullState";
        b2PointState2[b2PointState2["b2_addState"] = 1] = "b2_addState";
        b2PointState2[b2PointState2["b2_persistState"] = 2] = "b2_persistState";
        b2PointState2[b2PointState2["b2_removeState"] = 3] = "b2_removeState";
      })(b2PointState = exports.b2PointState || (exports.b2PointState = {}));
      function b2GetPointStates(state1, state2, manifold1, manifold2) {
        let i;
        for (i = 0; i < manifold1.pointCount; ++i) {
          const {key} = manifold1.points[i].id;
          state1[i] = b2PointState.b2_removeState;
          for (let j = 0; j < manifold2.pointCount; ++j) {
            if (manifold2.points[j].id.key === key) {
              state1[i] = b2PointState.b2_persistState;
              break;
            }
          }
        }
        for (; i < b2_common_1.b2_maxManifoldPoints; ++i) {
          state1[i] = b2PointState.b2_nullState;
        }
        for (i = 0; i < manifold2.pointCount; ++i) {
          const {key} = manifold2.points[i].id;
          state2[i] = b2PointState.b2_addState;
          for (let j = 0; j < manifold1.pointCount; ++j) {
            if (manifold1.points[j].id.key === key) {
              state2[i] = b2PointState.b2_persistState;
              break;
            }
          }
        }
        for (; i < b2_common_1.b2_maxManifoldPoints; ++i) {
          state2[i] = b2PointState.b2_nullState;
        }
      }
      exports.b2GetPointStates = b2GetPointStates;
      var b2ClipVertex = class {
        constructor() {
          this.v = new b2_math_1.b2Vec2();
          this.id = new b2ContactID();
        }
        Copy(other) {
          this.v.Copy(other.v);
          this.id.Copy(other.id);
          return this;
        }
      };
      exports.b2ClipVertex = b2ClipVertex;
      var b2RayCastInput = class {
        constructor() {
          this.p1 = new b2_math_1.b2Vec2();
          this.p2 = new b2_math_1.b2Vec2();
          this.maxFraction = 1;
        }
        Copy(o) {
          this.p1.Copy(o.p1);
          this.p2.Copy(o.p2);
          this.maxFraction = o.maxFraction;
          return this;
        }
      };
      exports.b2RayCastInput = b2RayCastInput;
      var b2RayCastOutput = class {
        constructor() {
          this.normal = new b2_math_1.b2Vec2();
          this.fraction = 0;
        }
        Copy(o) {
          this.normal.Copy(o.normal);
          this.fraction = o.fraction;
          return this;
        }
      };
      exports.b2RayCastOutput = b2RayCastOutput;
      var b2AABB = class {
        constructor() {
          this.lowerBound = new b2_math_1.b2Vec2();
          this.upperBound = new b2_math_1.b2Vec2();
        }
        Copy(o) {
          this.lowerBound.Copy(o.lowerBound);
          this.upperBound.Copy(o.upperBound);
          return this;
        }
        IsValid() {
          return this.lowerBound.IsValid() && this.upperBound.IsValid() && this.upperBound.x >= this.lowerBound.x && this.upperBound.y >= this.lowerBound.y;
        }
        GetCenter(out) {
          return b2_math_1.b2Vec2.Mid(this.lowerBound, this.upperBound, out);
        }
        GetExtents(out) {
          return b2_math_1.b2Vec2.Extents(this.lowerBound, this.upperBound, out);
        }
        GetPerimeter() {
          const wx = this.upperBound.x - this.lowerBound.x;
          const wy = this.upperBound.y - this.lowerBound.y;
          return 2 * (wx + wy);
        }
        Combine1(aabb) {
          this.lowerBound.x = Math.min(this.lowerBound.x, aabb.lowerBound.x);
          this.lowerBound.y = Math.min(this.lowerBound.y, aabb.lowerBound.y);
          this.upperBound.x = Math.max(this.upperBound.x, aabb.upperBound.x);
          this.upperBound.y = Math.max(this.upperBound.y, aabb.upperBound.y);
          return this;
        }
        Combine2(aabb1, aabb2) {
          this.lowerBound.x = Math.min(aabb1.lowerBound.x, aabb2.lowerBound.x);
          this.lowerBound.y = Math.min(aabb1.lowerBound.y, aabb2.lowerBound.y);
          this.upperBound.x = Math.max(aabb1.upperBound.x, aabb2.upperBound.x);
          this.upperBound.y = Math.max(aabb1.upperBound.y, aabb2.upperBound.y);
          return this;
        }
        static Combine(aabb1, aabb2, out) {
          out.Combine2(aabb1, aabb2);
          return out;
        }
        Contains(aabb) {
          return this.lowerBound.x <= aabb.lowerBound.x && this.lowerBound.y <= aabb.lowerBound.y && aabb.upperBound.x <= this.upperBound.x && aabb.upperBound.y <= this.upperBound.y;
        }
        RayCast(output, input) {
          let tmin = -b2_common_1.b2_maxFloat;
          let tmax = b2_common_1.b2_maxFloat;
          const p_x = input.p1.x;
          const p_y = input.p1.y;
          const d_x = input.p2.x - input.p1.x;
          const d_y = input.p2.y - input.p1.y;
          const absD_x = Math.abs(d_x);
          const absD_y = Math.abs(d_y);
          const {normal} = output;
          if (absD_x < b2_common_1.b2_epsilon) {
            if (p_x < this.lowerBound.x || this.upperBound.x < p_x) {
              return false;
            }
          } else {
            const inv_d = 1 / d_x;
            let t1 = (this.lowerBound.x - p_x) * inv_d;
            let t2 = (this.upperBound.x - p_x) * inv_d;
            let s = -1;
            if (t1 > t2) {
              const t3 = t1;
              t1 = t2;
              t2 = t3;
              s = 1;
            }
            if (t1 > tmin) {
              normal.x = s;
              normal.y = 0;
              tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) {
              return false;
            }
          }
          if (absD_y < b2_common_1.b2_epsilon) {
            if (p_y < this.lowerBound.y || this.upperBound.y < p_y) {
              return false;
            }
          } else {
            const inv_d = 1 / d_y;
            let t1 = (this.lowerBound.y - p_y) * inv_d;
            let t2 = (this.upperBound.y - p_y) * inv_d;
            let s = -1;
            if (t1 > t2) {
              const t3 = t1;
              t1 = t2;
              t2 = t3;
              s = 1;
            }
            if (t1 > tmin) {
              normal.x = 0;
              normal.y = s;
              tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) {
              return false;
            }
          }
          if (tmin < 0 || input.maxFraction < tmin) {
            return false;
          }
          output.fraction = tmin;
          return true;
        }
        TestContain(point) {
          if (point.x < this.lowerBound.x || this.upperBound.x < point.x) {
            return false;
          }
          if (point.y < this.lowerBound.y || this.upperBound.y < point.y) {
            return false;
          }
          return true;
        }
        TestOverlap(other) {
          if (this.upperBound.x < other.lowerBound.x) {
            return false;
          }
          if (this.upperBound.y < other.lowerBound.y) {
            return false;
          }
          if (other.upperBound.x < this.lowerBound.x) {
            return false;
          }
          if (other.upperBound.y < this.lowerBound.y) {
            return false;
          }
          return true;
        }
      };
      exports.b2AABB = b2AABB;
      function b2ClipSegmentToLine(vOut, [vIn0, vIn1], normal, offset, vertexIndexA) {
        let count = 0;
        const distance0 = b2_math_1.b2Vec2.Dot(normal, vIn0.v) - offset;
        const distance1 = b2_math_1.b2Vec2.Dot(normal, vIn1.v) - offset;
        if (distance0 <= 0) vOut[count++].Copy(vIn0);
        if (distance1 <= 0) vOut[count++].Copy(vIn1);
        if (distance0 * distance1 < 0) {
          const interp = distance0 / (distance0 - distance1);
          const {v, id} = vOut[count];
          v.x = vIn0.v.x + interp * (vIn1.v.x - vIn0.v.x);
          v.y = vIn0.v.y + interp * (vIn1.v.y - vIn0.v.y);
          id.cf.indexA = vertexIndexA;
          id.cf.indexB = vIn0.id.cf.indexB;
          id.cf.typeA = b2ContactFeatureType.e_vertex;
          id.cf.typeB = b2ContactFeatureType.e_face;
          ++count;
        }
        return count;
      }
      exports.b2ClipSegmentToLine = b2ClipSegmentToLine;
      var b2TestOverlap_s_input = new b2_distance_1.b2DistanceInput();
      var b2TestOverlap_s_simplexCache = new b2_distance_1.b2SimplexCache();
      var b2TestOverlap_s_output = new b2_distance_1.b2DistanceOutput();
      function b2TestOverlap(shapeA, indexA, shapeB, indexB, xfA, xfB) {
        const input = b2TestOverlap_s_input.Reset();
        input.proxyA.SetShape(shapeA, indexA);
        input.proxyB.SetShape(shapeB, indexB);
        input.transformA.Copy(xfA);
        input.transformB.Copy(xfB);
        input.useRadii = true;
        const simplexCache = b2TestOverlap_s_simplexCache.Reset();
        simplexCache.count = 0;
        const output = b2TestOverlap_s_output.Reset();
        (0, b2_distance_1.b2Distance)(output, simplexCache, input);
        return output.distance < 10 * b2_common_1.b2_epsilon;
      }
      exports.b2TestOverlap = b2TestOverlap;
    }
  });
  var require_b2_fixture = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_fixture.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2Fixture = exports.b2FixtureProxy = exports.b2DefaultFilter = void 0;
      var b2_math_1 = require_b2_math();
      var b2_collision_1 = require_b2_collision();
      var b2_shape_1 = require_b2_shape();
      var b2_common_1 = require_b2_common();
      var b2_settings_1 = require_b2_settings();
      var temp = {
        c1: new b2_math_1.b2Vec2(),
        c2: new b2_math_1.b2Vec2()
      };
      exports.b2DefaultFilter = {
        categoryBits: 1,
        maskBits: 65535,
        groupIndex: 0
      };
      var b2FixtureProxy = class {
        constructor(fixture, broadPhase, xf, childIndex) {
          this.aabb = new b2_collision_1.b2AABB();
          this.fixture = fixture;
          this.childIndex = childIndex;
          fixture.m_shape.ComputeAABB(this.aabb, xf, childIndex);
          this.treeNode = broadPhase.CreateProxy(this.aabb, this);
        }
      };
      exports.b2FixtureProxy = b2FixtureProxy;
      var Synchronize_s_aabb1 = new b2_collision_1.b2AABB();
      var Synchronize_s_aabb2 = new b2_collision_1.b2AABB();
      var Synchronize_s_displacement = new b2_math_1.b2Vec2();
      var b2Fixture = class {
        constructor(body, def) {
          var _a, _b, _c, _d, _e;
          this.m_density = 0;
          this.m_next = null;
          this.m_friction = 0;
          this.m_restitution = 0;
          this.m_restitutionThreshold = 0;
          this.m_proxies = [];
          this.m_isSensor = false;
          this.m_userData = null;
          this.m_body = body;
          this.m_shape = def.shape.Clone();
          this.m_userData = def.userData;
          this.m_friction = (_a = def.friction) !== null && _a !== void 0 ? _a : 0.2;
          this.m_restitution = (_b = def.restitution) !== null && _b !== void 0 ? _b : 0;
          this.m_restitutionThreshold = (_c = def.restitutionThreshold) !== null && _c !== void 0 ? _c : b2_settings_1.b2_lengthUnitsPerMeter;
          this.m_filter = __spreadValues(__spreadValues({}, exports.b2DefaultFilter), def.filter);
          this.m_isSensor = (_d = def.isSensor) !== null && _d !== void 0 ? _d : false;
          this.m_density = (_e = def.density) !== null && _e !== void 0 ? _e : 0;
        }
        get m_proxyCount() {
          return this.m_proxies.length;
        }
        GetType() {
          return this.m_shape.GetType();
        }
        GetShape() {
          return this.m_shape;
        }
        SetSensor(sensor) {
          if (sensor !== this.m_isSensor) {
            this.m_body.SetAwake(true);
            this.m_isSensor = sensor;
          }
        }
        IsSensor() {
          return this.m_isSensor;
        }
        SetFilterData(filter) {
          var _a, _b, _c;
          this.m_filter.categoryBits = (_a = filter.categoryBits) !== null && _a !== void 0 ? _a : exports.b2DefaultFilter.categoryBits;
          this.m_filter.groupIndex = (_b = filter.groupIndex) !== null && _b !== void 0 ? _b : exports.b2DefaultFilter.groupIndex;
          this.m_filter.maskBits = (_c = filter.maskBits) !== null && _c !== void 0 ? _c : exports.b2DefaultFilter.maskBits;
          this.Refilter();
        }
        GetFilterData() {
          return this.m_filter;
        }
        Refilter() {
          let edge = this.m_body.GetContactList();
          while (edge) {
            const {contact} = edge;
            const fixtureA = contact.GetFixtureA();
            const fixtureB = contact.GetFixtureB();
            if (fixtureA === this || fixtureB === this) {
              contact.FlagForFiltering();
            }
            edge = edge.next;
          }
          const world2 = this.m_body.GetWorld();
          const broadPhase = world2.m_contactManager.m_broadPhase;
          for (const proxy of this.m_proxies) {
            broadPhase.TouchProxy(proxy.treeNode);
          }
        }
        GetBody() {
          return this.m_body;
        }
        GetNext() {
          return this.m_next;
        }
        GetUserData() {
          return this.m_userData;
        }
        SetUserData(data) {
          this.m_userData = data;
        }
        TestPoint(p) {
          return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
        }
        RayCast(output, input, childIndex) {
          return this.m_shape.RayCast(output, input, this.m_body.GetTransform(), childIndex);
        }
        GetMassData(massData = new b2_shape_1.b2MassData()) {
          this.m_shape.ComputeMass(massData, this.m_density);
          return massData;
        }
        SetDensity(density) {
          this.m_density = density;
        }
        GetDensity() {
          return this.m_density;
        }
        GetFriction() {
          return this.m_friction;
        }
        SetFriction(friction) {
          this.m_friction = friction;
        }
        GetRestitution() {
          return this.m_restitution;
        }
        SetRestitution(restitution) {
          this.m_restitution = restitution;
        }
        SetRestitutionThreshold(threshold) {
          this.m_restitutionThreshold = threshold;
        }
        GetAABB(childIndex) {
          return this.m_proxies[childIndex].aabb;
        }
        CreateProxies(broadPhase, xf) {
          (0, b2_common_1.b2Assert)(this.m_proxies.length === 0);
          this.m_proxies.length = this.m_shape.GetChildCount();
          for (let i = 0; i < this.m_proxies.length; ++i) {
            this.m_proxies[i] = new b2FixtureProxy(this, broadPhase, xf, i);
          }
        }
        DestroyProxies(broadPhase) {
          for (const proxy of this.m_proxies) {
            broadPhase.DestroyProxy(proxy.treeNode);
          }
          this.m_proxies.length = 0;
        }
        Synchronize(broadPhase, transform1, transform2) {
          const {c1, c2} = temp;
          const displacement = Synchronize_s_displacement;
          for (const proxy of this.m_proxies) {
            const aabb1 = Synchronize_s_aabb1;
            const aabb2 = Synchronize_s_aabb2;
            this.m_shape.ComputeAABB(aabb1, transform1, proxy.childIndex);
            this.m_shape.ComputeAABB(aabb2, transform2, proxy.childIndex);
            proxy.aabb.Combine2(aabb1, aabb2);
            b2_math_1.b2Vec2.Subtract(aabb2.GetCenter(c2), aabb1.GetCenter(c1), displacement);
            broadPhase.MoveProxy(proxy.treeNode, proxy.aabb, displacement);
          }
        }
      };
      exports.b2Fixture = b2Fixture;
    }
  });
  var require_b2_body = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_body.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2Body = exports.b2BodyType = void 0;
      var b2_math_1 = require_b2_math();
      var b2_shape_1 = require_b2_shape();
      var b2_fixture_1 = require_b2_fixture();
      var b2_common_1 = require_b2_common();
      var b2BodyType3;
      (function (b2BodyType4) {
        b2BodyType4[b2BodyType4["b2_staticBody"] = 0] = "b2_staticBody";
        b2BodyType4[b2BodyType4["b2_kinematicBody"] = 1] = "b2_kinematicBody";
        b2BodyType4[b2BodyType4["b2_dynamicBody"] = 2] = "b2_dynamicBody";
      })(b2BodyType3 = exports.b2BodyType || (exports.b2BodyType = {}));
      var b2Body = class {
        constructor(bd, world2) {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
          this.m_type = b2BodyType3.b2_staticBody;
          this.m_islandFlag = false;
          this.m_awakeFlag = false;
          this.m_autoSleepFlag = false;
          this.m_bulletFlag = false;
          this.m_fixedRotationFlag = false;
          this.m_enabledFlag = false;
          this.m_toiFlag = false;
          this.m_islandIndex = 0;
          this.m_xf = new b2_math_1.b2Transform();
          this.m_sweep = new b2_math_1.b2Sweep();
          this.m_linearVelocity = new b2_math_1.b2Vec2();
          this.m_angularVelocity = 0;
          this.m_force = new b2_math_1.b2Vec2();
          this.m_torque = 0;
          this.m_prev = null;
          this.m_next = null;
          this.m_fixtureList = null;
          this.m_fixtureCount = 0;
          this.m_jointList = null;
          this.m_contactList = null;
          this.m_mass = 1;
          this.m_invMass = 1;
          this.m_I = 0;
          this.m_invI = 0;
          this.m_linearDamping = 0;
          this.m_angularDamping = 0;
          this.m_gravityScale = 1;
          this.m_sleepTime = 0;
          this.m_userData = null;
          this.m_bulletFlag = (_a = bd.bullet) !== null && _a !== void 0 ? _a : false;
          this.m_fixedRotationFlag = (_b = bd.fixedRotation) !== null && _b !== void 0 ? _b : false;
          this.m_autoSleepFlag = (_c = bd.allowSleep) !== null && _c !== void 0 ? _c : true;
          if (((_d = bd.awake) !== null && _d !== void 0 ? _d : true) && ((_e = bd.type) !== null && _e !== void 0 ? _e : b2BodyType3.b2_staticBody) !== b2BodyType3.b2_staticBody) {
            this.m_awakeFlag = true;
          }
          this.m_enabledFlag = (_f = bd.enabled) !== null && _f !== void 0 ? _f : true;
          this.m_world = world2;
          this.m_xf.p.Copy((_g = bd.position) !== null && _g !== void 0 ? _g : b2_math_1.b2Vec2.ZERO);
          this.m_xf.q.Set((_h = bd.angle) !== null && _h !== void 0 ? _h : 0);
          this.m_sweep.localCenter.SetZero();
          this.m_sweep.c0.Copy(this.m_xf.p);
          this.m_sweep.c.Copy(this.m_xf.p);
          this.m_sweep.a0 = this.m_sweep.a = this.m_xf.q.GetAngle();
          this.m_sweep.alpha0 = 0;
          this.m_linearVelocity.Copy((_j = bd.linearVelocity) !== null && _j !== void 0 ? _j : b2_math_1.b2Vec2.ZERO);
          this.m_angularVelocity = (_k = bd.angularVelocity) !== null && _k !== void 0 ? _k : 0;
          this.m_linearDamping = (_l = bd.linearDamping) !== null && _l !== void 0 ? _l : 0;
          this.m_angularDamping = (_m = bd.angularDamping) !== null && _m !== void 0 ? _m : 0;
          this.m_gravityScale = (_o = bd.gravityScale) !== null && _o !== void 0 ? _o : 1;
          this.m_force.SetZero();
          this.m_torque = 0;
          this.m_sleepTime = 0;
          this.m_type = (_p = bd.type) !== null && _p !== void 0 ? _p : b2BodyType3.b2_staticBody;
          this.m_mass = 0;
          this.m_invMass = 0;
          this.m_I = 0;
          this.m_invI = 0;
          this.m_userData = bd.userData;
          this.m_fixtureList = null;
          this.m_fixtureCount = 0;
        }
        CreateFixture(def) {
          (0, b2_common_1.b2Assert)(!this.m_world.IsLocked());
          const fixture = new b2_fixture_1.b2Fixture(this, def);
          if (this.m_enabledFlag) {
            const broadPhase = this.m_world.m_contactManager.m_broadPhase;
            fixture.CreateProxies(broadPhase, this.m_xf);
          }
          fixture.m_next = this.m_fixtureList;
          this.m_fixtureList = fixture;
          ++this.m_fixtureCount;
          if (fixture.m_density > 0) {
            this.ResetMassData();
          }
          this.m_world.m_newContacts = true;
          return fixture;
        }
        DestroyFixture(fixture) {
          (0, b2_common_1.b2Assert)(!this.m_world.IsLocked());
          let node = this.m_fixtureList;
          let ppF = null;
          while (node !== null) {
            if (node === fixture) {
              if (ppF) {
                ppF.m_next = fixture.m_next;
              } else {
                this.m_fixtureList = fixture.m_next;
              }
              break;
            }
            ppF = node;
            node = node.m_next;
          }
          let edge = this.m_contactList;
          while (edge) {
            const c = edge.contact;
            edge = edge.next;
            const fixtureA = c.GetFixtureA();
            const fixtureB = c.GetFixtureB();
            if (fixture === fixtureA || fixture === fixtureB) {
              this.m_world.m_contactManager.Destroy(c);
            }
          }
          if (this.m_enabledFlag) {
            const broadPhase = this.m_world.m_contactManager.m_broadPhase;
            fixture.DestroyProxies(broadPhase);
          }
          fixture.m_next = null;
          --this.m_fixtureCount;
          this.ResetMassData();
        }
        SetTransformVec(position, angle) {
          this.SetTransformXY(position.x, position.y, angle);
        }
        SetTransformXY(x, y, angle) {
          (0, b2_common_1.b2Assert)(!this.m_world.IsLocked());
          this.m_xf.q.Set(angle);
          this.m_xf.p.Set(x, y);
          b2_math_1.b2Transform.MultiplyVec2(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
          this.m_sweep.a = angle;
          this.m_sweep.c0.Copy(this.m_sweep.c);
          this.m_sweep.a0 = angle;
          const broadPhase = this.m_world.m_contactManager.m_broadPhase;
          for (let f = this.m_fixtureList; f; f = f.m_next) {
            f.Synchronize(broadPhase, this.m_xf, this.m_xf);
          }
          this.m_world.m_newContacts = true;
        }
        SetTransform(xf) {
          this.SetTransformVec(xf.p, xf.GetAngle());
        }
        GetTransform() {
          return this.m_xf;
        }
        GetPosition() {
          return this.m_xf.p;
        }
        GetAngle() {
          return this.m_sweep.a;
        }
        SetAngle(angle) {
          this.SetTransformVec(this.GetPosition(), angle);
        }
        GetWorldCenter() {
          return this.m_sweep.c;
        }
        GetLocalCenter() {
          return this.m_sweep.localCenter;
        }
        SetLinearVelocity(v) {
          if (this.m_type === b2BodyType3.b2_staticBody) {
            return;
          }
          if (b2_math_1.b2Vec2.Dot(v, v) > 0) {
            this.SetAwake(true);
          }
          this.m_linearVelocity.Copy(v);
        }
        GetLinearVelocity() {
          return this.m_linearVelocity;
        }
        SetAngularVelocity(w) {
          if (this.m_type === b2BodyType3.b2_staticBody) {
            return;
          }
          if (w * w > 0) {
            this.SetAwake(true);
          }
          this.m_angularVelocity = w;
        }
        GetAngularVelocity() {
          return this.m_angularVelocity;
        }
        ApplyForce(force, point, wake = true) {
          if (this.m_type !== b2BodyType3.b2_dynamicBody) {
            return;
          }
          if (wake && !this.m_awakeFlag) {
            this.SetAwake(true);
          }
          if (this.m_awakeFlag) {
            this.m_force.x += force.x;
            this.m_force.y += force.y;
            this.m_torque += (point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x;
          }
        }
        ApplyForceToCenter(force, wake = true) {
          if (this.m_type !== b2BodyType3.b2_dynamicBody) {
            return;
          }
          if (wake && !this.m_awakeFlag) {
            this.SetAwake(true);
          }
          if (this.m_awakeFlag) {
            this.m_force.x += force.x;
            this.m_force.y += force.y;
          }
        }
        ApplyTorque(torque, wake = true) {
          if (this.m_type !== b2BodyType3.b2_dynamicBody) {
            return;
          }
          if (wake && !this.m_awakeFlag) {
            this.SetAwake(true);
          }
          if (this.m_awakeFlag) {
            this.m_torque += torque;
          }
        }
        ApplyLinearImpulse(impulse, point, wake = true) {
          if (this.m_type !== b2BodyType3.b2_dynamicBody) {
            return;
          }
          if (wake && !this.m_awakeFlag) {
            this.SetAwake(true);
          }
          if (this.m_awakeFlag) {
            this.m_linearVelocity.x += this.m_invMass * impulse.x;
            this.m_linearVelocity.y += this.m_invMass * impulse.y;
            this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
          }
        }
        ApplyLinearImpulseToCenter(impulse, wake = true) {
          if (this.m_type !== b2BodyType3.b2_dynamicBody) {
            return;
          }
          if (wake && !this.m_awakeFlag) {
            this.SetAwake(true);
          }
          if (this.m_awakeFlag) {
            this.m_linearVelocity.x += this.m_invMass * impulse.x;
            this.m_linearVelocity.y += this.m_invMass * impulse.y;
          }
        }
        ApplyAngularImpulse(impulse, wake = true) {
          if (this.m_type !== b2BodyType3.b2_dynamicBody) {
            return;
          }
          if (wake && !this.m_awakeFlag) {
            this.SetAwake(true);
          }
          if (this.m_awakeFlag) {
            this.m_angularVelocity += this.m_invI * impulse;
          }
        }
        GetMass() {
          return this.m_mass;
        }
        GetInertia() {
          return this.m_I + this.m_mass * b2_math_1.b2Vec2.Dot(this.m_sweep.localCenter, this.m_sweep.localCenter);
        }
        GetMassData(data) {
          data.mass = this.m_mass;
          data.I = this.m_I + this.m_mass * b2_math_1.b2Vec2.Dot(this.m_sweep.localCenter, this.m_sweep.localCenter);
          data.center.Copy(this.m_sweep.localCenter);
          return data;
        }
        SetMassData(massData) {
          (0, b2_common_1.b2Assert)(!this.m_world.IsLocked());
          if (this.m_type !== b2BodyType3.b2_dynamicBody) {
            return;
          }
          this.m_invMass = 0;
          this.m_I = 0;
          this.m_invI = 0;
          this.m_mass = massData.mass;
          if (this.m_mass <= 0) {
            this.m_mass = 1;
          }
          this.m_invMass = 1 / this.m_mass;
          if (massData.I > 0 && !this.m_fixedRotationFlag) {
            this.m_I = massData.I - this.m_mass * b2_math_1.b2Vec2.Dot(massData.center, massData.center);
            this.m_invI = 1 / this.m_I;
          }
          const oldCenter = b2Body.SetMassData_s_oldCenter.Copy(this.m_sweep.c);
          this.m_sweep.localCenter.Copy(massData.center);
          b2_math_1.b2Transform.MultiplyVec2(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
          this.m_sweep.c0.Copy(this.m_sweep.c);
          b2_math_1.b2Vec2.AddCrossScalarVec2(this.m_linearVelocity, this.m_angularVelocity, b2_math_1.b2Vec2.Subtract(this.m_sweep.c, oldCenter, b2_math_1.b2Vec2.s_t0), this.m_linearVelocity);
        }
        ResetMassData() {
          this.m_mass = 0;
          this.m_invMass = 0;
          this.m_I = 0;
          this.m_invI = 0;
          this.m_sweep.localCenter.SetZero();
          if (this.m_type === b2BodyType3.b2_staticBody || this.m_type === b2BodyType3.b2_kinematicBody) {
            this.m_sweep.c0.Copy(this.m_xf.p);
            this.m_sweep.c.Copy(this.m_xf.p);
            this.m_sweep.a0 = this.m_sweep.a;
            return;
          }
          const localCenter = b2Body.ResetMassData_s_localCenter.SetZero();
          for (let f = this.m_fixtureList; f; f = f.m_next) {
            if (f.m_density === 0) {
              continue;
            }
            const massData = f.GetMassData(b2Body.ResetMassData_s_massData);
            this.m_mass += massData.mass;
            localCenter.AddScaled(massData.mass, massData.center);
            this.m_I += massData.I;
          }
          if (this.m_mass > 0) {
            this.m_invMass = 1 / this.m_mass;
            localCenter.Scale(this.m_invMass);
          }
          if (this.m_I > 0 && !this.m_fixedRotationFlag) {
            this.m_I -= this.m_mass * b2_math_1.b2Vec2.Dot(localCenter, localCenter);
            this.m_invI = 1 / this.m_I;
          } else {
            this.m_I = 0;
            this.m_invI = 0;
          }
          const oldCenter = b2Body.ResetMassData_s_oldCenter.Copy(this.m_sweep.c);
          this.m_sweep.localCenter.Copy(localCenter);
          b2_math_1.b2Transform.MultiplyVec2(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
          this.m_sweep.c0.Copy(this.m_sweep.c);
          b2_math_1.b2Vec2.AddCrossScalarVec2(this.m_linearVelocity, this.m_angularVelocity, b2_math_1.b2Vec2.Subtract(this.m_sweep.c, oldCenter, b2_math_1.b2Vec2.s_t0), this.m_linearVelocity);
        }
        GetWorldPoint(localPoint, out) {
          return b2_math_1.b2Transform.MultiplyVec2(this.m_xf, localPoint, out);
        }
        GetWorldVector(localVector, out) {
          return b2_math_1.b2Rot.MultiplyVec2(this.m_xf.q, localVector, out);
        }
        GetLocalPoint(worldPoint, out) {
          return b2_math_1.b2Transform.TransposeMultiplyVec2(this.m_xf, worldPoint, out);
        }
        GetLocalVector(worldVector, out) {
          return b2_math_1.b2Rot.TransposeMultiplyVec2(this.m_xf.q, worldVector, out);
        }
        GetLinearVelocityFromWorldPoint(worldPoint, out) {
          return b2_math_1.b2Vec2.AddCrossScalarVec2(this.m_linearVelocity, this.m_angularVelocity, b2_math_1.b2Vec2.Subtract(worldPoint, this.m_sweep.c, b2_math_1.b2Vec2.s_t0), out);
        }
        GetLinearVelocityFromLocalPoint(localPoint, out) {
          return this.GetLinearVelocityFromWorldPoint(this.GetWorldPoint(localPoint, out), out);
        }
        GetLinearDamping() {
          return this.m_linearDamping;
        }
        SetLinearDamping(linearDamping) {
          this.m_linearDamping = linearDamping;
        }
        GetAngularDamping() {
          return this.m_angularDamping;
        }
        SetAngularDamping(angularDamping) {
          this.m_angularDamping = angularDamping;
        }
        GetGravityScale() {
          return this.m_gravityScale;
        }
        SetGravityScale(scale) {
          this.m_gravityScale = scale;
        }
        SetType(type) {
          (0, b2_common_1.b2Assert)(!this.m_world.IsLocked());
          if (this.m_type === type) {
            return;
          }
          this.m_type = type;
          this.ResetMassData();
          if (this.m_type === b2BodyType3.b2_staticBody) {
            this.m_linearVelocity.SetZero();
            this.m_angularVelocity = 0;
            this.m_sweep.a0 = this.m_sweep.a;
            this.m_sweep.c0.Copy(this.m_sweep.c);
            this.m_awakeFlag = false;
            this.SynchronizeFixtures();
          }
          this.SetAwake(true);
          this.m_force.SetZero();
          this.m_torque = 0;
          let ce = this.m_contactList;
          while (ce) {
            const ce0 = ce;
            ce = ce.next;
            this.m_world.m_contactManager.Destroy(ce0.contact);
          }
          this.m_contactList = null;
          const broadPhase = this.m_world.m_contactManager.m_broadPhase;
          for (let f = this.m_fixtureList; f; f = f.m_next) {
            for (const proxy of f.m_proxies) {
              broadPhase.TouchProxy(proxy.treeNode);
            }
          }
        }
        GetType() {
          return this.m_type;
        }
        SetBullet(flag) {
          this.m_bulletFlag = flag;
        }
        IsBullet() {
          return this.m_bulletFlag;
        }
        SetSleepingAllowed(flag) {
          this.m_autoSleepFlag = flag;
          if (!flag) {
            this.SetAwake(true);
          }
        }
        IsSleepingAllowed() {
          return this.m_autoSleepFlag;
        }
        SetAwake(flag) {
          if (this.m_type === b2BodyType3.b2_staticBody) {
            return;
          }
          if (flag) {
            this.m_awakeFlag = true;
            this.m_sleepTime = 0;
          } else {
            this.m_awakeFlag = false;
            this.m_sleepTime = 0;
            this.m_linearVelocity.SetZero();
            this.m_angularVelocity = 0;
            this.m_force.SetZero();
            this.m_torque = 0;
          }
        }
        IsAwake() {
          return this.m_awakeFlag;
        }
        SetEnabled(flag) {
          (0, b2_common_1.b2Assert)(!this.m_world.IsLocked());
          if (flag === this.IsEnabled()) {
            return;
          }
          this.m_enabledFlag = flag;
          const broadPhase = this.m_world.m_contactManager.m_broadPhase;
          if (flag) {
            for (let f = this.m_fixtureList; f; f = f.m_next) {
              f.CreateProxies(broadPhase, this.m_xf);
            }
            this.m_world.m_newContacts = true;
          } else {
            for (let f = this.m_fixtureList; f; f = f.m_next) {
              f.DestroyProxies(broadPhase);
            }
            let ce = this.m_contactList;
            while (ce) {
              const ce0 = ce;
              ce = ce.next;
              this.m_world.m_contactManager.Destroy(ce0.contact);
            }
            this.m_contactList = null;
          }
        }
        IsEnabled() {
          return this.m_enabledFlag;
        }
        SetFixedRotation(flag) {
          if (this.m_fixedRotationFlag === flag) {
            return;
          }
          this.m_fixedRotationFlag = flag;
          this.m_angularVelocity = 0;
          this.ResetMassData();
        }
        IsFixedRotation() {
          return this.m_fixedRotationFlag;
        }
        GetFixtureList() {
          return this.m_fixtureList;
        }
        GetJointList() {
          return this.m_jointList;
        }
        GetContactList() {
          return this.m_contactList;
        }
        GetNext() {
          return this.m_next;
        }
        GetUserData() {
          return this.m_userData;
        }
        SetUserData(data) {
          this.m_userData = data;
        }
        GetWorld() {
          return this.m_world;
        }
        SynchronizeFixtures() {
          const broadPhase = this.m_world.m_contactManager.m_broadPhase;
          if (this.m_awakeFlag) {
            const xf1 = b2Body.SynchronizeFixtures_s_xf1;
            xf1.q.Set(this.m_sweep.a0);
            b2_math_1.b2Rot.MultiplyVec2(xf1.q, this.m_sweep.localCenter, xf1.p);
            b2_math_1.b2Vec2.Subtract(this.m_sweep.c0, xf1.p, xf1.p);
            for (let f = this.m_fixtureList; f; f = f.m_next) {
              f.Synchronize(broadPhase, xf1, this.m_xf);
            }
          } else {
            for (let f = this.m_fixtureList; f; f = f.m_next) {
              f.Synchronize(broadPhase, this.m_xf, this.m_xf);
            }
          }
        }
        SynchronizeTransform() {
          this.m_xf.q.Set(this.m_sweep.a);
          b2_math_1.b2Rot.MultiplyVec2(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
          b2_math_1.b2Vec2.Subtract(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
        }
        ShouldCollide(other) {
          if (this.m_type !== b2BodyType3.b2_dynamicBody && other.m_type !== b2BodyType3.b2_dynamicBody) {
            return false;
          }
          return this.ShouldCollideConnected(other);
        }
        ShouldCollideConnected(other) {
          for (let jn = this.m_jointList; jn; jn = jn.next) {
            if (jn.other === other) {
              if (!jn.joint.m_collideConnected) {
                return false;
              }
            }
          }
          return true;
        }
        Advance(alpha) {
          this.m_sweep.Advance(alpha);
          this.m_sweep.c.Copy(this.m_sweep.c0);
          this.m_sweep.a = this.m_sweep.a0;
          this.m_xf.q.Set(this.m_sweep.a);
          b2_math_1.b2Rot.MultiplyVec2(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
          b2_math_1.b2Vec2.Subtract(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
        }
      };
      exports.b2Body = b2Body;
      b2Body.SetMassData_s_oldCenter = new b2_math_1.b2Vec2();
      b2Body.ResetMassData_s_localCenter = new b2_math_1.b2Vec2();
      b2Body.ResetMassData_s_oldCenter = new b2_math_1.b2Vec2();
      b2Body.ResetMassData_s_massData = new b2_shape_1.b2MassData();
      b2Body.SynchronizeFixtures_s_xf1 = new b2_math_1.b2Transform();
    }
  });
  var require_b2_draw_helper = __commonJS({
    "node_modules/@box2d/core/dist/common/b2_draw_helper.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.DrawCenterOfMasses = exports.DrawAABBs = exports.DrawPairs = exports.DrawJoints = exports.DrawShapes = exports.GetShapeColor = void 0;
      var b2_math_1 = require_b2_math();
      var b2_draw_1 = require_b2_draw();
      var b2_body_1 = require_b2_body();
      var b2_common_1 = require_b2_common();
      var temp = {
        cA: new b2_math_1.b2Vec2(),
        cB: new b2_math_1.b2Vec2(),
        vs: (0, b2_common_1.b2MakeArray)(4, b2_math_1.b2Vec2),
        xf: new b2_math_1.b2Transform()
      };
      function GetShapeColor(b) {
        if (b.GetType() === b2_body_1.b2BodyType.b2_dynamicBody && b.m_mass === 0) {
          return b2_draw_1.debugColors.badBody;
        }
        if (!b.IsEnabled()) {
          return b2_draw_1.debugColors.disabledBody;
        }
        if (b.GetType() === b2_body_1.b2BodyType.b2_staticBody) {
          return b2_draw_1.debugColors.staticBody;
        }
        if (b.GetType() === b2_body_1.b2BodyType.b2_kinematicBody) {
          return b2_draw_1.debugColors.kinematicBody;
        }
        if (!b.IsAwake()) {
          return b2_draw_1.debugColors.sleepingBody;
        }
        return b2_draw_1.debugColors.body;
      }
      exports.GetShapeColor = GetShapeColor;
      function testOverlap(fixture, aabb) {
        for (let i = 0; i < fixture.m_proxyCount; i++) {
          if (aabb.TestOverlap(fixture.GetAABB(i))) {
            return true;
          }
        }
        return false;
      }
      function DrawShapes(draw, world2, within) {
        for (let b = world2.GetBodyList(); b; b = b.m_next) {
          const xf = b.m_xf;
          draw.PushTransform(xf);
          for (let f = b.GetFixtureList(); f; f = f.m_next) {
            if (within && !testOverlap(f, within)) continue;
            f.GetShape().Draw(draw, GetShapeColor(b));
          }
          draw.PopTransform(xf);
        }
      }
      exports.DrawShapes = DrawShapes;
      function DrawJoints(draw, world2) {
        for (let j = world2.GetJointList(); j; j = j.m_next) {
          j.Draw(draw);
        }
      }
      exports.DrawJoints = DrawJoints;
      function DrawPairs(draw, world2) {
        for (let contact = world2.GetContactList(); contact; contact = contact.m_next) {
          const fixtureA = contact.GetFixtureA();
          const fixtureB = contact.GetFixtureB();
          const indexA = contact.GetChildIndexA();
          const indexB = contact.GetChildIndexB();
          const cA = fixtureA.GetAABB(indexA).GetCenter(temp.cA);
          const cB = fixtureB.GetAABB(indexB).GetCenter(temp.cB);
          draw.DrawSegment(cA, cB, b2_draw_1.debugColors.pair);
        }
      }
      exports.DrawPairs = DrawPairs;
      function DrawAABBs(draw, world2, within) {
        const {vs} = temp;
        for (let b = world2.GetBodyList(); b; b = b.m_next) {
          if (!b.IsEnabled()) {
            continue;
          }
          for (let f = b.GetFixtureList(); f; f = f.m_next) {
            for (let i = 0; i < f.m_proxyCount; ++i) {
              const {aabb} = f.m_proxies[i].treeNode;
              if (within && !within.TestOverlap(aabb)) continue;
              vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
              vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
              vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
              vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
              draw.DrawPolygon(vs, 4, b2_draw_1.debugColors.aabb);
            }
          }
        }
      }
      exports.DrawAABBs = DrawAABBs;
      function DrawCenterOfMasses(draw, world2) {
        const {xf} = temp;
        for (let b = world2.GetBodyList(); b; b = b.m_next) {
          xf.q.Copy(b.m_xf.q);
          xf.p.Copy(b.GetWorldCenter());
          draw.DrawTransform(xf);
        }
      }
      exports.DrawCenterOfMasses = DrawCenterOfMasses;
    }
  });
  var require_b2_timer = __commonJS({
    "node_modules/@box2d/core/dist/common/b2_timer.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2Timer = void 0;
      var b2Timer = class {
        constructor() {
          this.m_start = performance.now();
        }
        Reset() {
          this.m_start = performance.now();
          return this;
        }
        GetMilliseconds() {
          return performance.now() - this.m_start;
        }
      };
      exports.b2Timer = b2Timer;
    }
  });
  var require_b2_augment = __commonJS({
    "node_modules/@box2d/core/dist/common/b2_augment.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2_augment = void 0;
      function b2_augment(host, augmentations) {
        for (const key of Object.keys(augmentations)) {
          const augmentation = augmentations[key];
          const original = host[key];
          const wrapper = function (...args) {
            return augmentation.call(this, original.bind(this), ...args);
          };
          Object.defineProperty(wrapper, "name", {
            value: key
          });
          host[key] = wrapper;
        }
      }
      exports.b2_augment = b2_augment;
    }
  });
  var require_b2_dynamic_tree = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_dynamic_tree.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2DynamicTree = exports.b2TreeNode = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_collision_1 = require_b2_collision();
      var temp = {
        stack: [],
        t: new b2_math_1.b2Vec2(),
        r: new b2_math_1.b2Vec2(),
        v: new b2_math_1.b2Vec2(),
        abs_v: new b2_math_1.b2Vec2(),
        segmentAABB: new b2_collision_1.b2AABB(),
        subInput: new b2_collision_1.b2RayCastInput(),
        combinedAABB: new b2_collision_1.b2AABB(),
        aabb: new b2_collision_1.b2AABB(),
        fatAABB: new b2_collision_1.b2AABB(),
        hugeAABB: new b2_collision_1.b2AABB(),
        c: new b2_math_1.b2Vec2(),
        h: new b2_math_1.b2Vec2()
      };
      var nextNodeid = 0;
      var b2TreeNode = class {
        constructor() {
          this.aabb = new b2_collision_1.b2AABB();
          this.userData = null;
          this.parent = null;
          this.child1 = null;
          this.child2 = null;
          this.height = 0;
          this.moved = false;
          this.id = nextNodeid++;
        }
        Reset() {
          this.child1 = null;
          this.child2 = null;
          this.height = -1;
          this.userData = null;
        }
        IsLeaf() {
          return this.child1 === null;
        }
        GetArea() {
          if (this.IsLeaf()) return 0;
          let area = this.aabb.GetPerimeter();
          if (this.child1) area += this.child1.GetArea();
          if (this.child2) area += this.child2.GetArea();
          return area;
        }
        ComputeHeight() {
          if (this.IsLeaf()) return 0;
          (0, b2_common_1.b2Assert)(this.child1 !== null && this.child2 !== null);
          const height1 = (0, b2_common_1.b2Verify)(this.child1).ComputeHeight();
          const height2 = (0, b2_common_1.b2Verify)(this.child2).ComputeHeight();
          return 1 + Math.max(height1, height2);
        }
        GetMaxBalance() {
          if (this.height <= 1) return 0;
          const child1 = (0, b2_common_1.b2Verify)(this.child1);
          const child2 = (0, b2_common_1.b2Verify)(this.child2);
          return Math.max(child1.GetMaxBalance(), child2.GetMaxBalance(), Math.abs(child2.height - child1.height));
        }
        ShiftOrigin(newOrigin) {
          if (this.height <= 1) return;
          (0, b2_common_1.b2Verify)(this.child1).ShiftOrigin(newOrigin);
          (0, b2_common_1.b2Verify)(this.child2).ShiftOrigin(newOrigin);
          this.aabb.lowerBound.Subtract(newOrigin);
          this.aabb.upperBound.Subtract(newOrigin);
        }
      };
      exports.b2TreeNode = b2TreeNode;
      var b2DynamicTree = class {
        constructor() {
          this.m_root = null;
          this.m_freeList = null;
        }
        Query(aabb, callback) {
          const stack = temp.stack;
          stack.length = 0;
          let node = this.m_root;
          while (node) {
            if (node.aabb.TestOverlap(aabb)) {
              if (node.IsLeaf()) {
                const proceed = callback(node);
                if (!proceed) {
                  return;
                }
              } else {
                stack.push(node.child1);
                stack.push(node.child2);
              }
            }
            node = stack.pop();
          }
        }
        QueryPoint(point, callback) {
          const stack = temp.stack;
          stack.length = 0;
          let node = this.m_root;
          while (node) {
            if (node.aabb.TestContain(point)) {
              if (node.IsLeaf()) {
                const proceed = callback(node);
                if (!proceed) {
                  return;
                }
              } else {
                stack.push(node.child1);
                stack.push(node.child2);
              }
            }
            node = stack.pop();
          }
        }
        RayCast(input, callback) {
          const {p1, p2} = input;
          const r = b2_math_1.b2Vec2.Subtract(p2, p1, temp.r);
          r.Normalize();
          const v = b2_math_1.b2Vec2.CrossOneVec2(r, temp.v);
          const abs_v = v.GetAbs(temp.abs_v);
          let {maxFraction} = input;
          const {segmentAABB, subInput, c, h, t} = temp;
          b2_math_1.b2Vec2.AddScaled(p1, maxFraction, b2_math_1.b2Vec2.Subtract(p2, p1, t), t);
          b2_math_1.b2Vec2.Min(p1, t, segmentAABB.lowerBound);
          b2_math_1.b2Vec2.Max(p1, t, segmentAABB.upperBound);
          const stack = temp.stack;
          stack.length = 0;
          let node = this.m_root;
          while (node) {
            if (!node.aabb.TestOverlap(segmentAABB)) {
              node = stack.pop();
              continue;
            }
            node.aabb.GetCenter(c);
            node.aabb.GetExtents(h);
            const separation = Math.abs(b2_math_1.b2Vec2.Dot(v, b2_math_1.b2Vec2.Subtract(p1, c, b2_math_1.b2Vec2.s_t0))) - b2_math_1.b2Vec2.Dot(abs_v, h);
            if (separation > 0) {
              node = stack.pop();
              continue;
            }
            if (node.IsLeaf()) {
              subInput.p1.Copy(input.p1);
              subInput.p2.Copy(input.p2);
              subInput.maxFraction = maxFraction;
              const value = callback(subInput, node);
              if (value === 0) {
                return;
              }
              if (value > 0) {
                maxFraction = value;
                b2_math_1.b2Vec2.AddScaled(p1, maxFraction, b2_math_1.b2Vec2.Subtract(p2, p1, t), t);
                b2_math_1.b2Vec2.Min(p1, t, segmentAABB.lowerBound);
                b2_math_1.b2Vec2.Max(p1, t, segmentAABB.upperBound);
              }
            } else {
              stack.push(node.child1);
              stack.push(node.child2);
            }
            node = stack.pop();
          }
        }
        AllocateNode() {
          if (this.m_freeList === null) {
            return new b2TreeNode();
          }
          const node = this.m_freeList;
          this.m_freeList = node.parent;
          node.parent = null;
          node.child1 = null;
          node.child2 = null;
          node.height = 0;
          node.moved = false;
          return node;
        }
        FreeNode(node) {
          node.parent = this.m_freeList;
          node.Reset();
          this.m_freeList = node;
        }
        CreateProxy(aabb, userData) {
          const node = this.AllocateNode();
          const r = b2_common_1.b2_aabbExtension;
          node.aabb.lowerBound.Set(aabb.lowerBound.x - r, aabb.lowerBound.y - r);
          node.aabb.upperBound.Set(aabb.upperBound.x + r, aabb.upperBound.y + r);
          node.userData = userData;
          node.height = 0;
          node.moved = true;
          this.InsertLeaf(node);
          return node;
        }
        DestroyProxy(node) {
          this.RemoveLeaf(node);
          this.FreeNode(node);
        }
        MoveProxy(node, aabb, displacement) {
          const {fatAABB, hugeAABB} = temp;
          const r = b2_common_1.b2_aabbExtension;
          fatAABB.lowerBound.Set(aabb.lowerBound.x - r, aabb.lowerBound.y - r);
          fatAABB.upperBound.Set(aabb.upperBound.x + r, aabb.upperBound.y + r);
          const d_x = b2_common_1.b2_aabbMultiplier * displacement.x;
          const d_y = b2_common_1.b2_aabbMultiplier * displacement.y;
          if (d_x < 0) {
            fatAABB.lowerBound.x += d_x;
          } else {
            fatAABB.upperBound.x += d_x;
          }
          if (d_y < 0) {
            fatAABB.lowerBound.y += d_y;
          } else {
            fatAABB.upperBound.y += d_y;
          }
          const treeAABB = node.aabb;
          if (treeAABB.Contains(aabb)) {
            const r4 = 4 * b2_common_1.b2_aabbExtension;
            hugeAABB.lowerBound.Set(fatAABB.lowerBound.x - r4, aabb.lowerBound.y - r4);
            hugeAABB.upperBound.Set(fatAABB.upperBound.x + r4, aabb.upperBound.y + r4);
            if (hugeAABB.Contains(treeAABB)) {
              return false;
            }
          }
          this.RemoveLeaf(node);
          node.aabb.Copy(fatAABB);
          this.InsertLeaf(node);
          node.moved = true;
          return true;
        }
        InsertLeaf(leaf) {
          if (this.m_root === null) {
            this.m_root = leaf;
            this.m_root.parent = null;
            return;
          }
          const {combinedAABB, aabb} = temp;
          const leafAABB = leaf.aabb;
          let sibling = this.m_root;
          while (!sibling.IsLeaf()) {
            const child1 = (0, b2_common_1.b2Verify)(sibling.child1);
            const child2 = (0, b2_common_1.b2Verify)(sibling.child2);
            const area = sibling.aabb.GetPerimeter();
            combinedAABB.Combine2(sibling.aabb, leafAABB);
            const combinedArea = combinedAABB.GetPerimeter();
            const cost = 2 * combinedArea;
            const inheritanceCost = 2 * (combinedArea - area);
            let cost1;
            let oldArea;
            let newArea;
            if (child1.IsLeaf()) {
              aabb.Combine2(leafAABB, child1.aabb);
              cost1 = aabb.GetPerimeter() + inheritanceCost;
            } else {
              aabb.Combine2(leafAABB, child1.aabb);
              oldArea = child1.aabb.GetPerimeter();
              newArea = aabb.GetPerimeter();
              cost1 = newArea - oldArea + inheritanceCost;
            }
            let cost2;
            if (child2.IsLeaf()) {
              aabb.Combine2(leafAABB, child2.aabb);
              cost2 = aabb.GetPerimeter() + inheritanceCost;
            } else {
              aabb.Combine2(leafAABB, child2.aabb);
              oldArea = child2.aabb.GetPerimeter();
              newArea = aabb.GetPerimeter();
              cost2 = newArea - oldArea + inheritanceCost;
            }
            if (cost < cost1 && cost < cost2) {
              break;
            }
            if (cost1 < cost2) {
              sibling = child1;
            } else {
              sibling = child2;
            }
          }
          const oldParent = sibling.parent;
          const newParent = this.AllocateNode();
          newParent.parent = oldParent;
          newParent.userData = null;
          newParent.aabb.Combine2(leafAABB, sibling.aabb);
          newParent.height = sibling.height + 1;
          if (oldParent !== null) {
            if (oldParent.child1 === sibling) {
              oldParent.child1 = newParent;
            } else {
              oldParent.child2 = newParent;
            }
            newParent.child1 = sibling;
            newParent.child2 = leaf;
            sibling.parent = newParent;
            leaf.parent = newParent;
          } else {
            newParent.child1 = sibling;
            newParent.child2 = leaf;
            sibling.parent = newParent;
            leaf.parent = newParent;
            this.m_root = newParent;
          }
          let node = leaf.parent;
          while (node !== null) {
            node = this.Balance(node);
            const child1 = (0, b2_common_1.b2Verify)(node.child1);
            const child2 = (0, b2_common_1.b2Verify)(node.child2);
            node.height = 1 + Math.max(child1.height, child2.height);
            node.aabb.Combine2(child1.aabb, child2.aabb);
            node = node.parent;
          }
        }
        RemoveLeaf(leaf) {
          if (leaf === this.m_root) {
            this.m_root = null;
            return;
          }
          const parent = (0, b2_common_1.b2Verify)(leaf.parent);
          const grandParent = parent.parent;
          const sibling = (0, b2_common_1.b2Verify)(parent.child1 === leaf ? parent.child2 : parent.child1);
          if (grandParent !== null) {
            if (grandParent.child1 === parent) {
              grandParent.child1 = sibling;
            } else {
              grandParent.child2 = sibling;
            }
            sibling.parent = grandParent;
            this.FreeNode(parent);
            let node = grandParent;
            while (node !== null) {
              node = this.Balance(node);
              const child1 = (0, b2_common_1.b2Verify)(node.child1);
              const child2 = (0, b2_common_1.b2Verify)(node.child2);
              node.aabb.Combine2(child1.aabb, child2.aabb);
              node.height = 1 + Math.max(child1.height, child2.height);
              node = node.parent;
            }
          } else {
            this.m_root = sibling;
            sibling.parent = null;
            this.FreeNode(parent);
          }
        }
        Balance(A) {
          if (A.IsLeaf() || A.height < 2) {
            return A;
          }
          const B = (0, b2_common_1.b2Verify)(A.child1);
          const C = (0, b2_common_1.b2Verify)(A.child2);
          const balance = C.height - B.height;
          if (balance > 1) {
            const F = (0, b2_common_1.b2Verify)(C.child1);
            const G = (0, b2_common_1.b2Verify)(C.child2);
            C.child1 = A;
            C.parent = A.parent;
            A.parent = C;
            if (C.parent !== null) {
              if (C.parent.child1 === A) {
                C.parent.child1 = C;
              } else {
                C.parent.child2 = C;
              }
            } else {
              this.m_root = C;
            }
            if (F.height > G.height) {
              C.child2 = F;
              A.child2 = G;
              G.parent = A;
              A.aabb.Combine2(B.aabb, G.aabb);
              C.aabb.Combine2(A.aabb, F.aabb);
              A.height = 1 + Math.max(B.height, G.height);
              C.height = 1 + Math.max(A.height, F.height);
            } else {
              C.child2 = G;
              A.child2 = F;
              F.parent = A;
              A.aabb.Combine2(B.aabb, F.aabb);
              C.aabb.Combine2(A.aabb, G.aabb);
              A.height = 1 + Math.max(B.height, F.height);
              C.height = 1 + Math.max(A.height, G.height);
            }
            return C;
          }
          if (balance < -1) {
            const D = (0, b2_common_1.b2Verify)(B.child1);
            const E = (0, b2_common_1.b2Verify)(B.child2);
            B.child1 = A;
            B.parent = A.parent;
            A.parent = B;
            if (B.parent !== null) {
              if (B.parent.child1 === A) {
                B.parent.child1 = B;
              } else {
                B.parent.child2 = B;
              }
            } else {
              this.m_root = B;
            }
            if (D.height > E.height) {
              B.child2 = D;
              A.child1 = E;
              E.parent = A;
              A.aabb.Combine2(C.aabb, E.aabb);
              B.aabb.Combine2(A.aabb, D.aabb);
              A.height = 1 + Math.max(C.height, E.height);
              B.height = 1 + Math.max(A.height, D.height);
            } else {
              B.child2 = E;
              A.child1 = D;
              D.parent = A;
              A.aabb.Combine2(C.aabb, D.aabb);
              B.aabb.Combine2(A.aabb, E.aabb);
              A.height = 1 + Math.max(C.height, D.height);
              B.height = 1 + Math.max(A.height, E.height);
            }
            return B;
          }
          return A;
        }
        GetHeight() {
          if (this.m_root === null) {
            return 0;
          }
          return this.m_root.height;
        }
        GetAreaRatio() {
          if (this.m_root === null) {
            return 0;
          }
          const root = this.m_root;
          const rootArea = root.aabb.GetPerimeter();
          const totalArea = root.GetArea();
          return totalArea / rootArea;
        }
        GetMaxBalance() {
          if (this.m_root === null) {
            return 0;
          }
          return this.m_root.GetMaxBalance();
        }
        ShiftOrigin(newOrigin) {
          var _a;
          (_a = this.m_root) === null || _a === void 0 ? void 0 : _a.ShiftOrigin(newOrigin);
        }
      };
      exports.b2DynamicTree = b2DynamicTree;
    }
  });
  var require_b2_broad_phase = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_broad_phase.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2BroadPhase = void 0;
      var b2_common_1 = require_b2_common();
      var b2_dynamic_tree_1 = require_b2_dynamic_tree();
      var b2BroadPhase = class {
        constructor() {
          this.m_tree = new b2_dynamic_tree_1.b2DynamicTree();
          this.m_proxyCount = 0;
          this.m_moveCount = 0;
          this.m_moveBuffer = [];
          this.m_pairCount = 0;
          this.m_pairBuffer = [];
          this.m_queryProxy = new b2_dynamic_tree_1.b2TreeNode();
          this.QueryCallback = proxy => {
            if (proxy.id === this.m_queryProxy.id) {
              return true;
            }
            if (proxy.moved && proxy.id > this.m_queryProxy.id) {
              return true;
            }
            this.m_pairBuffer[this.m_pairCount] = proxy.id < this.m_queryProxy.id ? [proxy, this.m_queryProxy] : [this.m_queryProxy, proxy];
            ++this.m_pairCount;
            return true;
          };
        }
        CreateProxy(aabb, userData) {
          const proxy = this.m_tree.CreateProxy(aabb, userData);
          ++this.m_proxyCount;
          this.BufferMove(proxy);
          return proxy;
        }
        DestroyProxy(proxy) {
          this.UnBufferMove(proxy);
          --this.m_proxyCount;
          this.m_tree.DestroyProxy(proxy);
        }
        MoveProxy(proxy, aabb, displacement) {
          const buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
          if (buffer) {
            this.BufferMove(proxy);
          }
        }
        TouchProxy(proxy) {
          this.BufferMove(proxy);
        }
        GetProxyCount() {
          return this.m_proxyCount;
        }
        UpdatePairs(callback) {
          this.m_pairCount = 0;
          for (let i = 0; i < this.m_moveCount; ++i) {
            const queryProxy = this.m_moveBuffer[i];
            if (queryProxy === null) continue;
            this.m_queryProxy = queryProxy;
            const fatAABB = queryProxy.aabb;
            this.m_tree.Query(fatAABB, this.QueryCallback);
          }
          for (let i = 0; i < this.m_pairCount; ++i) {
            const primaryPair = this.m_pairBuffer[i];
            const userDataA = (0, b2_common_1.b2Verify)(primaryPair[0].userData);
            const userDataB = (0, b2_common_1.b2Verify)(primaryPair[1].userData);
            callback(userDataA, userDataB);
          }
          for (let i = 0; i < this.m_moveCount; ++i) {
            const proxy = this.m_moveBuffer[i];
            if (proxy) proxy.moved = false;
          }
          this.m_moveCount = 0;
        }
        Query(aabb, callback) {
          this.m_tree.Query(aabb, callback);
        }
        QueryPoint(point, callback) {
          this.m_tree.QueryPoint(point, callback);
        }
        RayCast(input, callback) {
          this.m_tree.RayCast(input, callback);
        }
        GetTreeHeight() {
          return this.m_tree.GetHeight();
        }
        GetTreeBalance() {
          return this.m_tree.GetMaxBalance();
        }
        GetTreeQuality() {
          return this.m_tree.GetAreaRatio();
        }
        ShiftOrigin(newOrigin) {
          this.m_tree.ShiftOrigin(newOrigin);
        }
        BufferMove(proxy) {
          this.m_moveBuffer[this.m_moveCount] = proxy;
          ++this.m_moveCount;
        }
        UnBufferMove(proxy) {
          const i = this.m_moveBuffer.indexOf(proxy);
          this.m_moveBuffer[i] = null;
        }
      };
      exports.b2BroadPhase = b2BroadPhase;
    }
  });
  var require_b2_time_of_impact = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_time_of_impact.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2TimeOfImpact = exports.b2TOIOutput = exports.b2TOIOutputState = exports.b2TOIInput = exports.b2Toi = void 0;
      var b2_common_1 = require_b2_common();
      var b2_settings_1 = require_b2_settings();
      var b2_math_1 = require_b2_math();
      var b2_timer_1 = require_b2_timer();
      var b2_distance_1 = require_b2_distance();
      exports.b2Toi = {
        time: 0,
        maxTime: 0,
        calls: 0,
        iters: 0,
        maxIters: 0,
        rootIters: 0,
        maxRootIters: 0,
        reset() {
          this.time = 0;
          this.maxTime = 0;
          this.calls = 0;
          this.iters = 0;
          this.maxIters = 0;
          this.rootIters = 0;
          this.maxRootIters = 0;
        }
      };
      var b2TimeOfImpact_s_xfA = new b2_math_1.b2Transform();
      var b2TimeOfImpact_s_xfB = new b2_math_1.b2Transform();
      var b2TimeOfImpact_s_pointA = new b2_math_1.b2Vec2();
      var b2TimeOfImpact_s_pointB = new b2_math_1.b2Vec2();
      var b2TimeOfImpact_s_normal = new b2_math_1.b2Vec2();
      var b2TimeOfImpact_s_axisA = new b2_math_1.b2Vec2();
      var b2TimeOfImpact_s_axisB = new b2_math_1.b2Vec2();
      var b2TOIInput = class {
        constructor() {
          this.proxyA = new b2_distance_1.b2DistanceProxy();
          this.proxyB = new b2_distance_1.b2DistanceProxy();
          this.sweepA = new b2_math_1.b2Sweep();
          this.sweepB = new b2_math_1.b2Sweep();
          this.tMax = 0;
        }
      };
      exports.b2TOIInput = b2TOIInput;
      var b2TOIOutputState;
      (function (b2TOIOutputState2) {
        b2TOIOutputState2[b2TOIOutputState2["e_unknown"] = 0] = "e_unknown";
        b2TOIOutputState2[b2TOIOutputState2["e_failed"] = 1] = "e_failed";
        b2TOIOutputState2[b2TOIOutputState2["e_overlapped"] = 2] = "e_overlapped";
        b2TOIOutputState2[b2TOIOutputState2["e_touching"] = 3] = "e_touching";
        b2TOIOutputState2[b2TOIOutputState2["e_separated"] = 4] = "e_separated";
      })(b2TOIOutputState = exports.b2TOIOutputState || (exports.b2TOIOutputState = {}));
      var b2TOIOutput = class {
        constructor() {
          this.state = b2TOIOutputState.e_unknown;
          this.t = 0;
        }
      };
      exports.b2TOIOutput = b2TOIOutput;
      var b2SeparationFunctionType;
      (function (b2SeparationFunctionType2) {
        b2SeparationFunctionType2[b2SeparationFunctionType2["e_points"] = 0] = "e_points";
        b2SeparationFunctionType2[b2SeparationFunctionType2["e_faceA"] = 1] = "e_faceA";
        b2SeparationFunctionType2[b2SeparationFunctionType2["e_faceB"] = 2] = "e_faceB";
      })(b2SeparationFunctionType || (b2SeparationFunctionType = {}));
      var b2SeparationFunction = class {
        constructor() {
          this.m_sweepA = new b2_math_1.b2Sweep();
          this.m_sweepB = new b2_math_1.b2Sweep();
          this.m_type = b2SeparationFunctionType.e_points;
          this.m_localPoint = new b2_math_1.b2Vec2();
          this.m_axis = new b2_math_1.b2Vec2();
        }
        Initialize(cache, proxyA, sweepA, proxyB, sweepB, t1) {
          this.m_proxyA = proxyA;
          this.m_proxyB = proxyB;
          const {count} = cache;
          this.m_sweepA.Copy(sweepA);
          this.m_sweepB.Copy(sweepB);
          const xfA = this.m_sweepA.GetTransform(b2TimeOfImpact_s_xfA, t1);
          const xfB = this.m_sweepB.GetTransform(b2TimeOfImpact_s_xfB, t1);
          if (count === 1) {
            this.m_type = b2SeparationFunctionType.e_points;
            const localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
            const localPointB2 = this.m_proxyB.GetVertex(cache.indexB[0]);
            const pointA2 = b2_math_1.b2Transform.MultiplyVec2(xfA, localPointA, b2TimeOfImpact_s_pointA);
            const pointB2 = b2_math_1.b2Transform.MultiplyVec2(xfB, localPointB2, b2TimeOfImpact_s_pointB);
            b2_math_1.b2Vec2.Subtract(pointB2, pointA2, this.m_axis);
            const s2 = this.m_axis.Normalize();
            return s2;
          }
          if (cache.indexA[0] === cache.indexA[1]) {
            this.m_type = b2SeparationFunctionType.e_faceB;
            const localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
            const localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
            b2_math_1.b2Vec2.CrossVec2One(b2_math_1.b2Vec2.Subtract(localPointB2, localPointB1, b2_math_1.b2Vec2.s_t0), this.m_axis).Normalize();
            const normal2 = b2_math_1.b2Rot.MultiplyVec2(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
            b2_math_1.b2Vec2.Mid(localPointB1, localPointB2, this.m_localPoint);
            const pointB2 = b2_math_1.b2Transform.MultiplyVec2(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
            const localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
            const pointA2 = b2_math_1.b2Transform.MultiplyVec2(xfA, localPointA, b2TimeOfImpact_s_pointA);
            let s2 = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(pointA2, pointB2, b2_math_1.b2Vec2.s_t0), normal2);
            if (s2 < 0) {
              this.m_axis.Negate();
              s2 = -s2;
            }
            return s2;
          }
          this.m_type = b2SeparationFunctionType.e_faceA;
          const localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
          const localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
          b2_math_1.b2Vec2.CrossVec2One(b2_math_1.b2Vec2.Subtract(localPointA2, localPointA1, b2_math_1.b2Vec2.s_t0), this.m_axis).Normalize();
          const normal = b2_math_1.b2Rot.MultiplyVec2(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
          b2_math_1.b2Vec2.Mid(localPointA1, localPointA2, this.m_localPoint);
          const pointA = b2_math_1.b2Transform.MultiplyVec2(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
          const localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
          const pointB = b2_math_1.b2Transform.MultiplyVec2(xfB, localPointB, b2TimeOfImpact_s_pointB);
          let s = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(pointB, pointA, b2_math_1.b2Vec2.s_t0), normal);
          if (s < 0) {
            this.m_axis.Negate();
            s = -s;
          }
          return s;
        }
        FindMinSeparation(indexA, indexB, t) {
          const xfA = this.m_sweepA.GetTransform(b2TimeOfImpact_s_xfA, t);
          const xfB = this.m_sweepB.GetTransform(b2TimeOfImpact_s_xfB, t);
          switch (this.m_type) {
            case b2SeparationFunctionType.e_points:
              {
                const axisA = b2_math_1.b2Rot.TransposeMultiplyVec2(xfA.q, this.m_axis, b2TimeOfImpact_s_axisA);
                const axisB = b2_math_1.b2Rot.TransposeMultiplyVec2(xfB.q, b2_math_1.b2Vec2.Negate(this.m_axis, b2_math_1.b2Vec2.s_t0), b2TimeOfImpact_s_axisB);
                indexA[0] = this.m_proxyA.GetSupport(axisA);
                indexB[0] = this.m_proxyB.GetSupport(axisB);
                const localPointA = this.m_proxyA.GetVertex(indexA[0]);
                const localPointB = this.m_proxyB.GetVertex(indexB[0]);
                const pointA = b2_math_1.b2Transform.MultiplyVec2(xfA, localPointA, b2TimeOfImpact_s_pointA);
                const pointB = b2_math_1.b2Transform.MultiplyVec2(xfB, localPointB, b2TimeOfImpact_s_pointB);
                const separation = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(pointB, pointA, b2_math_1.b2Vec2.s_t0), this.m_axis);
                return separation;
              }
            case b2SeparationFunctionType.e_faceA:
              {
                const normal = b2_math_1.b2Rot.MultiplyVec2(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                const pointA = b2_math_1.b2Transform.MultiplyVec2(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                const axisB = b2_math_1.b2Rot.TransposeMultiplyVec2(xfB.q, b2_math_1.b2Vec2.Negate(normal, b2_math_1.b2Vec2.s_t0), b2TimeOfImpact_s_axisB);
                indexA[0] = -1;
                indexB[0] = this.m_proxyB.GetSupport(axisB);
                const localPointB = this.m_proxyB.GetVertex(indexB[0]);
                const pointB = b2_math_1.b2Transform.MultiplyVec2(xfB, localPointB, b2TimeOfImpact_s_pointB);
                const separation = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(pointB, pointA, b2_math_1.b2Vec2.s_t0), normal);
                return separation;
              }
            case b2SeparationFunctionType.e_faceB:
              {
                const normal = b2_math_1.b2Rot.MultiplyVec2(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                const pointB = b2_math_1.b2Transform.MultiplyVec2(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                const axisA = b2_math_1.b2Rot.TransposeMultiplyVec2(xfA.q, b2_math_1.b2Vec2.Negate(normal, b2_math_1.b2Vec2.s_t0), b2TimeOfImpact_s_axisA);
                indexB[0] = -1;
                indexA[0] = this.m_proxyA.GetSupport(axisA);
                const localPointA = this.m_proxyA.GetVertex(indexA[0]);
                const pointA = b2_math_1.b2Transform.MultiplyVec2(xfA, localPointA, b2TimeOfImpact_s_pointA);
                const separation = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(pointA, pointB, b2_math_1.b2Vec2.s_t0), normal);
                return separation;
              }
            default:
              indexA[0] = -1;
              indexB[0] = -1;
              return 0;
          }
        }
        Evaluate(indexA, indexB, t) {
          const xfA = this.m_sweepA.GetTransform(b2TimeOfImpact_s_xfA, t);
          const xfB = this.m_sweepB.GetTransform(b2TimeOfImpact_s_xfB, t);
          switch (this.m_type) {
            case b2SeparationFunctionType.e_points:
              {
                const localPointA = this.m_proxyA.GetVertex(indexA);
                const localPointB = this.m_proxyB.GetVertex(indexB);
                const pointA = b2_math_1.b2Transform.MultiplyVec2(xfA, localPointA, b2TimeOfImpact_s_pointA);
                const pointB = b2_math_1.b2Transform.MultiplyVec2(xfB, localPointB, b2TimeOfImpact_s_pointB);
                const separation = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(pointB, pointA, b2_math_1.b2Vec2.s_t0), this.m_axis);
                return separation;
              }
            case b2SeparationFunctionType.e_faceA:
              {
                const normal = b2_math_1.b2Rot.MultiplyVec2(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                const pointA = b2_math_1.b2Transform.MultiplyVec2(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                const localPointB = this.m_proxyB.GetVertex(indexB);
                const pointB = b2_math_1.b2Transform.MultiplyVec2(xfB, localPointB, b2TimeOfImpact_s_pointB);
                const separation = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(pointB, pointA, b2_math_1.b2Vec2.s_t0), normal);
                return separation;
              }
            case b2SeparationFunctionType.e_faceB:
              {
                const normal = b2_math_1.b2Rot.MultiplyVec2(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                const pointB = b2_math_1.b2Transform.MultiplyVec2(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                const localPointA = this.m_proxyA.GetVertex(indexA);
                const pointA = b2_math_1.b2Transform.MultiplyVec2(xfA, localPointA, b2TimeOfImpact_s_pointA);
                const separation = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(pointA, pointB, b2_math_1.b2Vec2.s_t0), normal);
                return separation;
              }
            default:
              (0, b2_common_1.b2Assert)(false);
              return 0;
          }
        }
      };
      var b2TimeOfImpact_s_timer = new b2_timer_1.b2Timer();
      var b2TimeOfImpact_s_cache = new b2_distance_1.b2SimplexCache();
      var b2TimeOfImpact_s_distanceInput = new b2_distance_1.b2DistanceInput();
      var b2TimeOfImpact_s_distanceOutput = new b2_distance_1.b2DistanceOutput();
      var b2TimeOfImpact_s_fcn = new b2SeparationFunction();
      var b2TimeOfImpact_s_indexA = [0];
      var b2TimeOfImpact_s_indexB = [0];
      var b2TimeOfImpact_s_sweepA = new b2_math_1.b2Sweep();
      var b2TimeOfImpact_s_sweepB = new b2_math_1.b2Sweep();
      function b2TimeOfImpact(output, input) {
        const timer = b2TimeOfImpact_s_timer.Reset();
        ++exports.b2Toi.calls;
        output.state = b2TOIOutputState.e_unknown;
        output.t = input.tMax;
        const {proxyA, proxyB, tMax} = input;
        const maxVertices = Math.max(b2_settings_1.b2_maxPolygonVertices, proxyA.m_count, proxyB.m_count);
        const sweepA = b2TimeOfImpact_s_sweepA.Copy(input.sweepA);
        const sweepB = b2TimeOfImpact_s_sweepB.Copy(input.sweepB);
        sweepA.Normalize();
        sweepB.Normalize();
        const totalRadius = proxyA.m_radius + proxyB.m_radius;
        const target = Math.max(b2_common_1.b2_linearSlop, totalRadius - 3 * b2_common_1.b2_linearSlop);
        const tolerance = 0.25 * b2_common_1.b2_linearSlop;
        let t1 = 0;
        const k_maxIterations = 20;
        let iter = 0;
        const cache = b2TimeOfImpact_s_cache;
        cache.count = 0;
        const distanceInput = b2TimeOfImpact_s_distanceInput;
        distanceInput.proxyA.Copy(input.proxyA);
        distanceInput.proxyB.Copy(input.proxyB);
        distanceInput.useRadii = false;
        for (; ; ) {
          const xfA = sweepA.GetTransform(b2TimeOfImpact_s_xfA, t1);
          const xfB = sweepB.GetTransform(b2TimeOfImpact_s_xfB, t1);
          distanceInput.transformA.Copy(xfA);
          distanceInput.transformB.Copy(xfB);
          const distanceOutput = b2TimeOfImpact_s_distanceOutput;
          (0, b2_distance_1.b2Distance)(distanceOutput, cache, distanceInput);
          if (distanceOutput.distance <= 0) {
            output.state = b2TOIOutputState.e_overlapped;
            output.t = 0;
            break;
          }
          if (distanceOutput.distance < target + tolerance) {
            output.state = b2TOIOutputState.e_touching;
            output.t = t1;
            break;
          }
          const fcn = b2TimeOfImpact_s_fcn;
          fcn.Initialize(cache, proxyA, sweepA, proxyB, sweepB, t1);
          let done = false;
          let t2 = tMax;
          let pushBackIter = 0;
          for (; ; ) {
            const indexA = b2TimeOfImpact_s_indexA;
            const indexB = b2TimeOfImpact_s_indexB;
            let s2 = fcn.FindMinSeparation(indexA, indexB, t2);
            if (s2 > target + tolerance) {
              output.state = b2TOIOutputState.e_separated;
              output.t = tMax;
              done = true;
              break;
            }
            if (s2 > target - tolerance) {
              t1 = t2;
              break;
            }
            let s1 = fcn.Evaluate(indexA[0], indexB[0], t1);
            if (s1 < target - tolerance) {
              output.state = b2TOIOutputState.e_failed;
              output.t = t1;
              done = true;
              break;
            }
            if (s1 <= target + tolerance) {
              output.state = b2TOIOutputState.e_touching;
              output.t = t1;
              done = true;
              break;
            }
            let rootIterCount = 0;
            let a1 = t1;
            let a2 = t2;
            for (; ; ) {
              let t;
              if (rootIterCount & 1) {
                t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
              } else {
                t = 0.5 * (a1 + a2);
              }
              ++rootIterCount;
              ++exports.b2Toi.rootIters;
              const s = fcn.Evaluate(indexA[0], indexB[0], t);
              if (Math.abs(s - target) < tolerance) {
                t2 = t;
                break;
              }
              if (s > target) {
                a1 = t;
                s1 = s;
              } else {
                a2 = t;
                s2 = s;
              }
              if (rootIterCount === 50) {
                break;
              }
            }
            exports.b2Toi.maxRootIters = Math.max(exports.b2Toi.maxRootIters, rootIterCount);
            ++pushBackIter;
            if (pushBackIter === maxVertices) {
              break;
            }
          }
          ++iter;
          ++exports.b2Toi.iters;
          if (done) {
            break;
          }
          if (iter === k_maxIterations) {
            output.state = b2TOIOutputState.e_failed;
            output.t = t1;
            break;
          }
        }
        exports.b2Toi.maxIters = Math.max(exports.b2Toi.maxIters, iter);
        const time = timer.GetMilliseconds();
        exports.b2Toi.maxTime = Math.max(exports.b2Toi.maxTime, time);
        exports.b2Toi.time += time;
      }
      exports.b2TimeOfImpact = b2TimeOfImpact;
    }
  });
  var require_b2_collide_circle = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_collide_circle.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2CollidePolygonAndCircle = exports.b2CollideCircles = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_collision_1 = require_b2_collision();
      var b2CollideCircles_s_pA = new b2_math_1.b2Vec2();
      var b2CollideCircles_s_pB = new b2_math_1.b2Vec2();
      function b2CollideCircles(manifold, circleA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        const pA = b2_math_1.b2Transform.MultiplyVec2(xfA, circleA.m_p, b2CollideCircles_s_pA);
        const pB = b2_math_1.b2Transform.MultiplyVec2(xfB, circleB.m_p, b2CollideCircles_s_pB);
        const distSqr = b2_math_1.b2Vec2.DistanceSquared(pA, pB);
        const radius = circleA.m_radius + circleB.m_radius;
        if (distSqr > radius * radius) {
          return;
        }
        manifold.type = b2_collision_1.b2ManifoldType.e_circles;
        manifold.localPoint.Copy(circleA.m_p);
        manifold.localNormal.SetZero();
        manifold.pointCount = 1;
        manifold.points[0].localPoint.Copy(circleB.m_p);
        manifold.points[0].id.key = 0;
      }
      exports.b2CollideCircles = b2CollideCircles;
      var b2CollidePolygonAndCircle_s_c = new b2_math_1.b2Vec2();
      var b2CollidePolygonAndCircle_s_cLocal = new b2_math_1.b2Vec2();
      var b2CollidePolygonAndCircle_s_faceCenter = new b2_math_1.b2Vec2();
      function b2CollidePolygonAndCircle(manifold, polygonA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        const c = b2_math_1.b2Transform.MultiplyVec2(xfB, circleB.m_p, b2CollidePolygonAndCircle_s_c);
        const cLocal = b2_math_1.b2Transform.TransposeMultiplyVec2(xfA, c, b2CollidePolygonAndCircle_s_cLocal);
        let normalIndex = 0;
        let separation = -b2_common_1.b2_maxFloat;
        const radius = polygonA.m_radius + circleB.m_radius;
        const vertexCount = polygonA.m_count;
        const vertices = polygonA.m_vertices;
        const normals = polygonA.m_normals;
        for (let i = 0; i < vertexCount; ++i) {
          const s = b2_math_1.b2Vec2.Dot(normals[i], b2_math_1.b2Vec2.Subtract(cLocal, vertices[i], b2_math_1.b2Vec2.s_t0));
          if (s > radius) {
            return;
          }
          if (s > separation) {
            separation = s;
            normalIndex = i;
          }
        }
        const vertIndex1 = normalIndex;
        const vertIndex2 = vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0;
        const v1 = vertices[vertIndex1];
        const v2 = vertices[vertIndex2];
        if (separation < b2_common_1.b2_epsilon) {
          manifold.pointCount = 1;
          manifold.type = b2_collision_1.b2ManifoldType.e_faceA;
          manifold.localNormal.Copy(normals[normalIndex]);
          b2_math_1.b2Vec2.Mid(v1, v2, manifold.localPoint);
          manifold.points[0].localPoint.Copy(circleB.m_p);
          manifold.points[0].id.key = 0;
          return;
        }
        const u1 = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(cLocal, v1, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.Subtract(v2, v1, b2_math_1.b2Vec2.s_t1));
        const u2 = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(cLocal, v2, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.Subtract(v1, v2, b2_math_1.b2Vec2.s_t1));
        if (u1 <= 0) {
          if (b2_math_1.b2Vec2.DistanceSquared(cLocal, v1) > radius * radius) {
            return;
          }
          manifold.pointCount = 1;
          manifold.type = b2_collision_1.b2ManifoldType.e_faceA;
          b2_math_1.b2Vec2.Subtract(cLocal, v1, manifold.localNormal).Normalize();
          manifold.localPoint.Copy(v1);
          manifold.points[0].localPoint.Copy(circleB.m_p);
          manifold.points[0].id.key = 0;
        } else if (u2 <= 0) {
          if (b2_math_1.b2Vec2.DistanceSquared(cLocal, v2) > radius * radius) {
            return;
          }
          manifold.pointCount = 1;
          manifold.type = b2_collision_1.b2ManifoldType.e_faceA;
          b2_math_1.b2Vec2.Subtract(cLocal, v2, manifold.localNormal).Normalize();
          manifold.localPoint.Copy(v2);
          manifold.points[0].localPoint.Copy(circleB.m_p);
          manifold.points[0].id.key = 0;
        } else {
          const faceCenter = b2_math_1.b2Vec2.Mid(v1, v2, b2CollidePolygonAndCircle_s_faceCenter);
          const separation2 = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(cLocal, faceCenter, b2_math_1.b2Vec2.s_t1), normals[vertIndex1]);
          if (separation2 > radius) {
            return;
          }
          manifold.pointCount = 1;
          manifold.type = b2_collision_1.b2ManifoldType.e_faceA;
          manifold.localNormal.Copy(normals[vertIndex1]);
          manifold.localPoint.Copy(faceCenter);
          manifold.points[0].localPoint.Copy(circleB.m_p);
          manifold.points[0].id.key = 0;
        }
      }
      exports.b2CollidePolygonAndCircle = b2CollidePolygonAndCircle;
    }
  });
  var require_b2_collide_polygon = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_collide_polygon.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2CollidePolygons = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_collision_1 = require_b2_collision();
      var b2FindMaxSeparation_s_xf = new b2_math_1.b2Transform();
      var b2FindMaxSeparation_s_n = new b2_math_1.b2Vec2();
      var b2FindMaxSeparation_s_v1 = new b2_math_1.b2Vec2();
      function b2FindMaxSeparation(edgeIndex, poly1, xf1, poly2, xf2) {
        const count1 = poly1.m_count;
        const count2 = poly2.m_count;
        const n1s = poly1.m_normals;
        const v1s = poly1.m_vertices;
        const v2s = poly2.m_vertices;
        const xf = b2_math_1.b2Transform.TransposeMultiply(xf2, xf1, b2FindMaxSeparation_s_xf);
        let bestIndex = 0;
        let maxSeparation = -b2_common_1.b2_maxFloat;
        for (let i = 0; i < count1; ++i) {
          const n = b2_math_1.b2Rot.MultiplyVec2(xf.q, n1s[i], b2FindMaxSeparation_s_n);
          const v1 = b2_math_1.b2Transform.MultiplyVec2(xf, v1s[i], b2FindMaxSeparation_s_v1);
          let si = b2_common_1.b2_maxFloat;
          for (let j = 0; j < count2; ++j) {
            const sij = b2_math_1.b2Vec2.Dot(n, b2_math_1.b2Vec2.Subtract(v2s[j], v1, b2_math_1.b2Vec2.s_t0));
            if (sij < si) {
              si = sij;
            }
          }
          if (si > maxSeparation) {
            maxSeparation = si;
            bestIndex = i;
          }
        }
        edgeIndex[0] = bestIndex;
        return maxSeparation;
      }
      var b2FindIncidentEdge_s_normal1 = new b2_math_1.b2Vec2();
      function b2FindIncidentEdge(c, poly1, xf1, edge1, poly2, xf2) {
        const normals1 = poly1.m_normals;
        const count2 = poly2.m_count;
        const vertices2 = poly2.m_vertices;
        const normals2 = poly2.m_normals;
        const normal1 = b2_math_1.b2Rot.TransposeMultiplyVec2(xf2.q, b2_math_1.b2Rot.MultiplyVec2(xf1.q, normals1[edge1], b2_math_1.b2Vec2.s_t0), b2FindIncidentEdge_s_normal1);
        let index = 0;
        let minDot = b2_common_1.b2_maxFloat;
        for (let i = 0; i < count2; ++i) {
          const dot = b2_math_1.b2Vec2.Dot(normal1, normals2[i]);
          if (dot < minDot) {
            minDot = dot;
            index = i;
          }
        }
        const i1 = index;
        const i2 = i1 + 1 < count2 ? i1 + 1 : 0;
        const c0 = c[0];
        b2_math_1.b2Transform.MultiplyVec2(xf2, vertices2[i1], c0.v);
        const cf0 = c0.id.cf;
        cf0.indexA = edge1;
        cf0.indexB = i1;
        cf0.typeA = b2_collision_1.b2ContactFeatureType.e_face;
        cf0.typeB = b2_collision_1.b2ContactFeatureType.e_vertex;
        const c1 = c[1];
        b2_math_1.b2Transform.MultiplyVec2(xf2, vertices2[i2], c1.v);
        const cf1 = c1.id.cf;
        cf1.indexA = edge1;
        cf1.indexB = i2;
        cf1.typeA = b2_collision_1.b2ContactFeatureType.e_face;
        cf1.typeB = b2_collision_1.b2ContactFeatureType.e_vertex;
      }
      var b2CollidePolygons_s_incidentEdge = [new b2_collision_1.b2ClipVertex(), new b2_collision_1.b2ClipVertex()];
      var b2CollidePolygons_s_clipPoints1 = [new b2_collision_1.b2ClipVertex(), new b2_collision_1.b2ClipVertex()];
      var b2CollidePolygons_s_clipPoints2 = [new b2_collision_1.b2ClipVertex(), new b2_collision_1.b2ClipVertex()];
      var b2CollidePolygons_s_edgeA = [0];
      var b2CollidePolygons_s_edgeB = [0];
      var b2CollidePolygons_s_localTangent = new b2_math_1.b2Vec2();
      var b2CollidePolygons_s_localNormal = new b2_math_1.b2Vec2();
      var b2CollidePolygons_s_planePoint = new b2_math_1.b2Vec2();
      var b2CollidePolygons_s_normal = new b2_math_1.b2Vec2();
      var b2CollidePolygons_s_tangent = new b2_math_1.b2Vec2();
      var b2CollidePolygons_s_ntangent = new b2_math_1.b2Vec2();
      var b2CollidePolygons_s_v11 = new b2_math_1.b2Vec2();
      var b2CollidePolygons_s_v12 = new b2_math_1.b2Vec2();
      function b2CollidePolygons(manifold, polyA, xfA, polyB, xfB) {
        manifold.pointCount = 0;
        const totalRadius = polyA.m_radius + polyB.m_radius;
        const edgeIndexA = b2CollidePolygons_s_edgeA;
        const separationA = b2FindMaxSeparation(edgeIndexA, polyA, xfA, polyB, xfB);
        if (separationA > totalRadius) {
          return;
        }
        const edgeIndexB = b2CollidePolygons_s_edgeB;
        const separationB = b2FindMaxSeparation(edgeIndexB, polyB, xfB, polyA, xfA);
        if (separationB > totalRadius) {
          return;
        }
        let poly1;
        let poly2;
        let xf1;
        let xf2;
        let edge1;
        let flip;
        const k_tol = 0.1 * b2_common_1.b2_linearSlop;
        if (separationB > separationA + k_tol) {
          poly1 = polyB;
          poly2 = polyA;
          xf1 = xfB;
          xf2 = xfA;
          edge1 = edgeIndexB[0];
          manifold.type = b2_collision_1.b2ManifoldType.e_faceB;
          flip = 1;
        } else {
          poly1 = polyA;
          poly2 = polyB;
          xf1 = xfA;
          xf2 = xfB;
          edge1 = edgeIndexA[0];
          manifold.type = b2_collision_1.b2ManifoldType.e_faceA;
          flip = 0;
        }
        const incidentEdge = b2CollidePolygons_s_incidentEdge;
        b2FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
        const count1 = poly1.m_count;
        const vertices1 = poly1.m_vertices;
        const iv1 = edge1;
        const iv2 = edge1 + 1 < count1 ? edge1 + 1 : 0;
        let v11 = vertices1[iv1];
        let v12 = vertices1[iv2];
        const localTangent = b2_math_1.b2Vec2.Subtract(v12, v11, b2CollidePolygons_s_localTangent);
        localTangent.Normalize();
        const localNormal = b2_math_1.b2Vec2.CrossVec2One(localTangent, b2CollidePolygons_s_localNormal);
        const planePoint = b2_math_1.b2Vec2.Mid(v11, v12, b2CollidePolygons_s_planePoint);
        const tangent = b2_math_1.b2Rot.MultiplyVec2(xf1.q, localTangent, b2CollidePolygons_s_tangent);
        const normal = b2_math_1.b2Vec2.CrossVec2One(tangent, b2CollidePolygons_s_normal);
        v11 = b2_math_1.b2Transform.MultiplyVec2(xf1, v11, b2CollidePolygons_s_v11);
        v12 = b2_math_1.b2Transform.MultiplyVec2(xf1, v12, b2CollidePolygons_s_v12);
        const frontOffset = b2_math_1.b2Vec2.Dot(normal, v11);
        const sideOffset1 = -b2_math_1.b2Vec2.Dot(tangent, v11) + totalRadius;
        const sideOffset2 = b2_math_1.b2Vec2.Dot(tangent, v12) + totalRadius;
        const clipPoints1 = b2CollidePolygons_s_clipPoints1;
        const clipPoints2 = b2CollidePolygons_s_clipPoints2;
        const ntangent = b2_math_1.b2Vec2.Negate(tangent, b2CollidePolygons_s_ntangent);
        let np = (0, b2_collision_1.b2ClipSegmentToLine)(clipPoints1, incidentEdge, ntangent, sideOffset1, iv1);
        if (np < 2) {
          return;
        }
        np = (0, b2_collision_1.b2ClipSegmentToLine)(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);
        if (np < 2) {
          return;
        }
        manifold.localNormal.Copy(localNormal);
        manifold.localPoint.Copy(planePoint);
        let pointCount = 0;
        for (let i = 0; i < b2_common_1.b2_maxManifoldPoints; ++i) {
          const cv = clipPoints2[i];
          const separation = b2_math_1.b2Vec2.Dot(normal, cv.v) - frontOffset;
          if (separation <= totalRadius) {
            const cp = manifold.points[pointCount];
            b2_math_1.b2Transform.TransposeMultiplyVec2(xf2, cv.v, cp.localPoint);
            cp.id.Copy(cv.id);
            if (flip) {
              const {cf} = cp.id;
              cf.indexA = cf.indexB;
              cf.indexB = cf.indexA;
              cf.typeA = cf.typeB;
              cf.typeB = cf.typeA;
            }
            ++pointCount;
          }
        }
        manifold.pointCount = pointCount;
      }
      exports.b2CollidePolygons = b2CollidePolygons;
    }
  });
  var require_b2_collide_edge = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_collide_edge.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2CollideEdgeAndPolygon = exports.b2CollideEdgeAndCircle = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_collision_1 = require_b2_collision();
      var b2_settings_1 = require_b2_settings();
      var b2CollideEdgeAndCircle_s_Q = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndCircle_s_e = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndCircle_s_d = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndCircle_s_e1 = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndCircle_s_e2 = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndCircle_s_P = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndCircle_s_n = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndCircle_s_id = new b2_collision_1.b2ContactID();
      function b2CollideEdgeAndCircle(manifold, edgeA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        const Q = b2_math_1.b2Transform.TransposeMultiplyVec2(xfA, b2_math_1.b2Transform.MultiplyVec2(xfB, circleB.m_p, b2_math_1.b2Vec2.s_t0), b2CollideEdgeAndCircle_s_Q);
        const A = edgeA.m_vertex1;
        const B = edgeA.m_vertex2;
        const e = b2_math_1.b2Vec2.Subtract(B, A, b2CollideEdgeAndCircle_s_e);
        const n = b2CollideEdgeAndCircle_s_n.Set(e.y, -e.x);
        const offset = b2_math_1.b2Vec2.Dot(n, b2_math_1.b2Vec2.Subtract(Q, A, b2_math_1.b2Vec2.s_t0));
        const oneSided = edgeA.m_oneSided;
        if (oneSided && offset < 0) {
          return;
        }
        const u = b2_math_1.b2Vec2.Dot(e, b2_math_1.b2Vec2.Subtract(B, Q, b2_math_1.b2Vec2.s_t0));
        const v = b2_math_1.b2Vec2.Dot(e, b2_math_1.b2Vec2.Subtract(Q, A, b2_math_1.b2Vec2.s_t0));
        const radius = edgeA.m_radius + circleB.m_radius;
        const id = b2CollideEdgeAndCircle_s_id;
        id.cf.indexB = 0;
        id.cf.typeB = b2_collision_1.b2ContactFeatureType.e_vertex;
        if (v <= 0) {
          const P2 = A;
          const d2 = b2_math_1.b2Vec2.Subtract(Q, P2, b2CollideEdgeAndCircle_s_d);
          const dd2 = b2_math_1.b2Vec2.Dot(d2, d2);
          if (dd2 > radius * radius) {
            return;
          }
          if (edgeA.m_oneSided) {
            const A1 = edgeA.m_vertex0;
            const B1 = A;
            const e1 = b2_math_1.b2Vec2.Subtract(B1, A1, b2CollideEdgeAndCircle_s_e1);
            const u1 = b2_math_1.b2Vec2.Dot(e1, b2_math_1.b2Vec2.Subtract(B1, Q, b2_math_1.b2Vec2.s_t0));
            if (u1 > 0) {
              return;
            }
          }
          id.cf.indexA = 0;
          id.cf.typeA = b2_collision_1.b2ContactFeatureType.e_vertex;
          manifold.pointCount = 1;
          manifold.type = b2_collision_1.b2ManifoldType.e_circles;
          manifold.localNormal.SetZero();
          manifold.localPoint.Copy(P2);
          manifold.points[0].id.Copy(id);
          manifold.points[0].localPoint.Copy(circleB.m_p);
          return;
        }
        if (u <= 0) {
          const P2 = B;
          const d2 = b2_math_1.b2Vec2.Subtract(Q, P2, b2CollideEdgeAndCircle_s_d);
          const dd2 = b2_math_1.b2Vec2.Dot(d2, d2);
          if (dd2 > radius * radius) {
            return;
          }
          if (edgeA.m_oneSided) {
            const B2 = edgeA.m_vertex3;
            const A2 = B;
            const e2 = b2_math_1.b2Vec2.Subtract(B2, A2, b2CollideEdgeAndCircle_s_e2);
            const v2 = b2_math_1.b2Vec2.Dot(e2, b2_math_1.b2Vec2.Subtract(Q, A2, b2_math_1.b2Vec2.s_t0));
            if (v2 > 0) {
              return;
            }
          }
          id.cf.indexA = 1;
          id.cf.typeA = b2_collision_1.b2ContactFeatureType.e_vertex;
          manifold.pointCount = 1;
          manifold.type = b2_collision_1.b2ManifoldType.e_circles;
          manifold.localNormal.SetZero();
          manifold.localPoint.Copy(P2);
          manifold.points[0].id.Copy(id);
          manifold.points[0].localPoint.Copy(circleB.m_p);
          return;
        }
        const den = b2_math_1.b2Vec2.Dot(e, e);
        const P = b2CollideEdgeAndCircle_s_P;
        P.x = 1 / den * (u * A.x + v * B.x);
        P.y = 1 / den * (u * A.y + v * B.y);
        const d = b2_math_1.b2Vec2.Subtract(Q, P, b2CollideEdgeAndCircle_s_d);
        const dd = b2_math_1.b2Vec2.Dot(d, d);
        if (dd > radius * radius) {
          return;
        }
        if (offset < 0) {
          n.Set(-n.x, -n.y);
        }
        n.Normalize();
        id.cf.indexA = 0;
        id.cf.typeA = b2_collision_1.b2ContactFeatureType.e_face;
        manifold.pointCount = 1;
        manifold.type = b2_collision_1.b2ManifoldType.e_faceA;
        manifold.localNormal.Copy(n);
        manifold.localPoint.Copy(A);
        manifold.points[0].id.Copy(id);
        manifold.points[0].localPoint.Copy(circleB.m_p);
      }
      exports.b2CollideEdgeAndCircle = b2CollideEdgeAndCircle;
      var b2EPAxisType;
      (function (b2EPAxisType2) {
        b2EPAxisType2[b2EPAxisType2["e_unknown"] = 0] = "e_unknown";
        b2EPAxisType2[b2EPAxisType2["e_edgeA"] = 1] = "e_edgeA";
        b2EPAxisType2[b2EPAxisType2["e_edgeB"] = 2] = "e_edgeB";
      })(b2EPAxisType || (b2EPAxisType = {}));
      var b2EPAxis = class {
        constructor() {
          this.normal = new b2_math_1.b2Vec2();
          this.type = b2EPAxisType.e_unknown;
          this.index = 0;
          this.separation = 0;
        }
      };
      var b2TempPolygon = class {
        constructor() {
          this.vertices = (0, b2_common_1.b2MakeArray)(b2_settings_1.b2_maxPolygonVertices, b2_math_1.b2Vec2);
          this.normals = (0, b2_common_1.b2MakeArray)(b2_settings_1.b2_maxPolygonVertices, b2_math_1.b2Vec2);
          this.count = 0;
        }
      };
      var b2ReferenceFace = class {
        constructor() {
          this.i1 = 0;
          this.i2 = 0;
          this.v1 = new b2_math_1.b2Vec2();
          this.v2 = new b2_math_1.b2Vec2();
          this.normal = new b2_math_1.b2Vec2();
          this.sideNormal1 = new b2_math_1.b2Vec2();
          this.sideOffset1 = 0;
          this.sideNormal2 = new b2_math_1.b2Vec2();
          this.sideOffset2 = 0;
        }
      };
      var b2ComputeEdgeSeparation_s_axis = new b2EPAxis();
      var b2ComputeEdgeSeparation_s_axes = [new b2_math_1.b2Vec2(), new b2_math_1.b2Vec2()];
      function b2ComputeEdgeSeparation(polygonB, v1, normal1) {
        const axis = b2ComputeEdgeSeparation_s_axis;
        axis.type = b2EPAxisType.e_edgeA;
        axis.index = -1;
        axis.separation = -b2_common_1.b2_maxFloat;
        axis.normal.SetZero();
        const axes = b2ComputeEdgeSeparation_s_axes;
        axes[0].Copy(normal1);
        b2_math_1.b2Vec2.Negate(normal1, axes[1]);
        for (let j = 0; j < 2; ++j) {
          let sj = b2_common_1.b2_maxFloat;
          for (let i = 0; i < polygonB.count; ++i) {
            const si = b2_math_1.b2Vec2.Dot(axes[j], b2_math_1.b2Vec2.Subtract(polygonB.vertices[i], v1, b2_math_1.b2Vec2.s_t0));
            if (si < sj) {
              sj = si;
            }
          }
          if (sj > axis.separation) {
            axis.index = j;
            axis.separation = sj;
            axis.normal.Copy(axes[j]);
          }
        }
        return axis;
      }
      var b2ComputePolygonSeparation_s_axis = new b2EPAxis();
      var b2ComputePolygonSeparation_s_n = new b2_math_1.b2Vec2();
      function b2ComputePolygonSeparation(polygonB, v1, v2) {
        const axis = b2ComputePolygonSeparation_s_axis;
        axis.type = b2EPAxisType.e_unknown;
        axis.index = -1;
        axis.separation = -b2_common_1.b2_maxFloat;
        axis.normal.SetZero();
        for (let i = 0; i < polygonB.count; ++i) {
          const n = b2_math_1.b2Vec2.Negate(polygonB.normals[i], b2ComputePolygonSeparation_s_n);
          const s1 = b2_math_1.b2Vec2.Dot(n, b2_math_1.b2Vec2.Subtract(polygonB.vertices[i], v1, b2_math_1.b2Vec2.s_t0));
          const s2 = b2_math_1.b2Vec2.Dot(n, b2_math_1.b2Vec2.Subtract(polygonB.vertices[i], v2, b2_math_1.b2Vec2.s_t0));
          const s = Math.min(s1, s2);
          if (s > axis.separation) {
            axis.type = b2EPAxisType.e_edgeB;
            axis.index = i;
            axis.separation = s;
            axis.normal.Copy(n);
          }
        }
        return axis;
      }
      var b2CollideEdgeAndPolygon_s_xf = new b2_math_1.b2Transform();
      var b2CollideEdgeAndPolygon_s_centroidB = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndPolygon_s_edge1 = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndPolygon_s_normal1 = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndPolygon_s_edge0 = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndPolygon_s_normal0 = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndPolygon_s_edge2 = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndPolygon_s_normal2 = new b2_math_1.b2Vec2();
      var b2CollideEdgeAndPolygon_s_tempPolygonB = new b2TempPolygon();
      var b2CollideEdgeAndPolygon_s_ref = new b2ReferenceFace();
      var b2CollideEdgeAndPolygon_s_clipPoints = [new b2_collision_1.b2ClipVertex(), new b2_collision_1.b2ClipVertex()];
      var b2CollideEdgeAndPolygon_s_clipPoints1 = [new b2_collision_1.b2ClipVertex(), new b2_collision_1.b2ClipVertex()];
      var b2CollideEdgeAndPolygon_s_clipPoints2 = [new b2_collision_1.b2ClipVertex(), new b2_collision_1.b2ClipVertex()];
      function b2CollideEdgeAndPolygon(manifold, edgeA, xfA, polygonB, xfB) {
        manifold.pointCount = 0;
        const xf = b2_math_1.b2Transform.TransposeMultiply(xfA, xfB, b2CollideEdgeAndPolygon_s_xf);
        const centroidB = b2_math_1.b2Transform.MultiplyVec2(xf, polygonB.m_centroid, b2CollideEdgeAndPolygon_s_centroidB);
        const v1 = edgeA.m_vertex1;
        const v2 = edgeA.m_vertex2;
        const edge1 = b2_math_1.b2Vec2.Subtract(v2, v1, b2CollideEdgeAndPolygon_s_edge1);
        edge1.Normalize();
        const normal1 = b2CollideEdgeAndPolygon_s_normal1.Set(edge1.y, -edge1.x);
        const offset1 = b2_math_1.b2Vec2.Dot(normal1, b2_math_1.b2Vec2.Subtract(centroidB, v1, b2_math_1.b2Vec2.s_t0));
        const oneSided = edgeA.m_oneSided;
        if (oneSided && offset1 < 0) {
          return;
        }
        const tempPolygonB = b2CollideEdgeAndPolygon_s_tempPolygonB;
        tempPolygonB.count = polygonB.m_count;
        for (let i = 0; i < polygonB.m_count; ++i) {
          b2_math_1.b2Transform.MultiplyVec2(xf, polygonB.m_vertices[i], tempPolygonB.vertices[i]);
          b2_math_1.b2Rot.MultiplyVec2(xf.q, polygonB.m_normals[i], tempPolygonB.normals[i]);
        }
        const radius = polygonB.m_radius + edgeA.m_radius;
        const edgeAxis = b2ComputeEdgeSeparation(tempPolygonB, v1, normal1);
        if (edgeAxis.separation > radius) {
          return;
        }
        const polygonAxis = b2ComputePolygonSeparation(tempPolygonB, v1, v2);
        if (polygonAxis.separation > radius) {
          return;
        }
        const k_relativeTol = 0.98;
        const k_absoluteTol = 1e-3;
        let primaryAxis;
        if (polygonAxis.separation - radius > k_relativeTol * (edgeAxis.separation - radius) + k_absoluteTol) {
          primaryAxis = polygonAxis;
        } else {
          primaryAxis = edgeAxis;
        }
        if (oneSided) {
          const edge0 = b2_math_1.b2Vec2.Subtract(v1, edgeA.m_vertex0, b2CollideEdgeAndPolygon_s_edge0);
          edge0.Normalize();
          const normal0 = b2CollideEdgeAndPolygon_s_normal0.Set(edge0.y, -edge0.x);
          const convex1 = b2_math_1.b2Vec2.Cross(edge0, edge1) >= 0;
          const edge2 = b2_math_1.b2Vec2.Subtract(edgeA.m_vertex3, v2, b2CollideEdgeAndPolygon_s_edge2);
          edge2.Normalize();
          const normal2 = b2CollideEdgeAndPolygon_s_normal2.Set(edge2.y, -edge2.x);
          const convex2 = b2_math_1.b2Vec2.Cross(edge1, edge2) >= 0;
          const sinTol = 0.1;
          const side1 = b2_math_1.b2Vec2.Dot(primaryAxis.normal, edge1) <= 0;
          if (side1) {
            if (convex1) {
              if (b2_math_1.b2Vec2.Cross(primaryAxis.normal, normal0) > sinTol) {
                return;
              }
            } else {
              primaryAxis = edgeAxis;
            }
          } else if (convex2) {
            if (b2_math_1.b2Vec2.Cross(normal2, primaryAxis.normal) > sinTol) {
              return;
            }
          } else {
            primaryAxis = edgeAxis;
          }
        }
        const clipPoints = b2CollideEdgeAndPolygon_s_clipPoints;
        const ref = b2CollideEdgeAndPolygon_s_ref;
        if (primaryAxis.type === b2EPAxisType.e_edgeA) {
          manifold.type = b2_collision_1.b2ManifoldType.e_faceA;
          let bestIndex = 0;
          let bestValue = b2_math_1.b2Vec2.Dot(primaryAxis.normal, tempPolygonB.normals[0]);
          for (let i = 1; i < tempPolygonB.count; ++i) {
            const value = b2_math_1.b2Vec2.Dot(primaryAxis.normal, tempPolygonB.normals[i]);
            if (value < bestValue) {
              bestValue = value;
              bestIndex = i;
            }
          }
          const i1 = bestIndex;
          const i2 = i1 + 1 < tempPolygonB.count ? i1 + 1 : 0;
          clipPoints[0].v.Copy(tempPolygonB.vertices[i1]);
          clipPoints[0].id.cf.indexA = 0;
          clipPoints[0].id.cf.indexB = i1;
          clipPoints[0].id.cf.typeA = b2_collision_1.b2ContactFeatureType.e_face;
          clipPoints[0].id.cf.typeB = b2_collision_1.b2ContactFeatureType.e_vertex;
          clipPoints[1].v.Copy(tempPolygonB.vertices[i2]);
          clipPoints[1].id.cf.indexA = 0;
          clipPoints[1].id.cf.indexB = i2;
          clipPoints[1].id.cf.typeA = b2_collision_1.b2ContactFeatureType.e_face;
          clipPoints[1].id.cf.typeB = b2_collision_1.b2ContactFeatureType.e_vertex;
          ref.i1 = 0;
          ref.i2 = 1;
          ref.v1.Copy(v1);
          ref.v2.Copy(v2);
          ref.normal.Copy(primaryAxis.normal);
          b2_math_1.b2Vec2.Negate(edge1, ref.sideNormal1);
          ref.sideNormal2.Copy(edge1);
        } else {
          manifold.type = b2_collision_1.b2ManifoldType.e_faceB;
          clipPoints[0].v.Copy(v2);
          clipPoints[0].id.cf.indexA = 1;
          clipPoints[0].id.cf.indexB = primaryAxis.index;
          clipPoints[0].id.cf.typeA = b2_collision_1.b2ContactFeatureType.e_vertex;
          clipPoints[0].id.cf.typeB = b2_collision_1.b2ContactFeatureType.e_face;
          clipPoints[1].v.Copy(v1);
          clipPoints[1].id.cf.indexA = 0;
          clipPoints[1].id.cf.indexB = primaryAxis.index;
          clipPoints[1].id.cf.typeA = b2_collision_1.b2ContactFeatureType.e_vertex;
          clipPoints[1].id.cf.typeB = b2_collision_1.b2ContactFeatureType.e_face;
          ref.i1 = primaryAxis.index;
          ref.i2 = ref.i1 + 1 < tempPolygonB.count ? ref.i1 + 1 : 0;
          ref.v1.Copy(tempPolygonB.vertices[ref.i1]);
          ref.v2.Copy(tempPolygonB.vertices[ref.i2]);
          ref.normal.Copy(tempPolygonB.normals[ref.i1]);
          ref.sideNormal1.Set(ref.normal.y, -ref.normal.x);
          b2_math_1.b2Vec2.Negate(ref.sideNormal1, ref.sideNormal2);
        }
        ref.sideOffset1 = b2_math_1.b2Vec2.Dot(ref.sideNormal1, ref.v1);
        ref.sideOffset2 = b2_math_1.b2Vec2.Dot(ref.sideNormal2, ref.v2);
        const clipPoints1 = b2CollideEdgeAndPolygon_s_clipPoints1;
        const clipPoints2 = b2CollideEdgeAndPolygon_s_clipPoints2;
        let np;
        np = (0, b2_collision_1.b2ClipSegmentToLine)(clipPoints1, clipPoints, ref.sideNormal1, ref.sideOffset1, ref.i1);
        if (np < b2_common_1.b2_maxManifoldPoints) {
          return;
        }
        np = (0, b2_collision_1.b2ClipSegmentToLine)(clipPoints2, clipPoints1, ref.sideNormal2, ref.sideOffset2, ref.i2);
        if (np < b2_common_1.b2_maxManifoldPoints) {
          return;
        }
        if (primaryAxis.type === b2EPAxisType.e_edgeA) {
          manifold.localNormal.Copy(ref.normal);
          manifold.localPoint.Copy(ref.v1);
        } else {
          manifold.localNormal.Copy(polygonB.m_normals[ref.i1]);
          manifold.localPoint.Copy(polygonB.m_vertices[ref.i1]);
        }
        let pointCount = 0;
        for (let i = 0; i < b2_common_1.b2_maxManifoldPoints; ++i) {
          const separation = b2_math_1.b2Vec2.Dot(ref.normal, b2_math_1.b2Vec2.Subtract(clipPoints2[i].v, ref.v1, b2_math_1.b2Vec2.s_t0));
          if (separation <= radius) {
            const cp = manifold.points[pointCount];
            if (primaryAxis.type === b2EPAxisType.e_edgeA) {
              b2_math_1.b2Transform.TransposeMultiplyVec2(xf, clipPoints2[i].v, cp.localPoint);
              cp.id.Copy(clipPoints2[i].id);
            } else {
              cp.localPoint.Copy(clipPoints2[i].v);
              cp.id.cf.typeA = clipPoints2[i].id.cf.typeB;
              cp.id.cf.typeB = clipPoints2[i].id.cf.typeA;
              cp.id.cf.indexA = clipPoints2[i].id.cf.indexB;
              cp.id.cf.indexB = clipPoints2[i].id.cf.indexA;
            }
            ++pointCount;
          }
        }
        manifold.pointCount = pointCount;
      }
      exports.b2CollideEdgeAndPolygon = b2CollideEdgeAndPolygon;
    }
  });
  var require_b2_circle_shape = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_circle_shape.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2CircleShape = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_shape_1 = require_b2_shape();
      var b2CircleShape3 = class extends b2_shape_1.b2Shape {
        constructor(radius = 0) {
          super(b2_shape_1.b2ShapeType.e_circle, radius);
          this.m_p = new b2_math_1.b2Vec2();
        }
        Set(position, radius = this.m_radius) {
          this.m_p.Copy(position);
          this.m_radius = radius;
          return this;
        }
        Clone() {
          return new b2CircleShape3().Copy(this);
        }
        Copy(other) {
          super.Copy(other);
          this.m_p.Copy(other.m_p);
          return this;
        }
        GetChildCount() {
          return 1;
        }
        TestPoint(transform, p) {
          const center = b2_math_1.b2Transform.MultiplyVec2(transform, this.m_p, b2CircleShape3.TestPoint_s_center);
          const d = b2_math_1.b2Vec2.Subtract(p, center, b2CircleShape3.TestPoint_s_d);
          return b2_math_1.b2Vec2.Dot(d, d) <= __pow(this.m_radius, 2);
        }
        RayCast(output, input, transform, _childIndex) {
          const position = b2_math_1.b2Transform.MultiplyVec2(transform, this.m_p, b2CircleShape3.RayCast_s_position);
          const s = b2_math_1.b2Vec2.Subtract(input.p1, position, b2CircleShape3.RayCast_s_s);
          const b = b2_math_1.b2Vec2.Dot(s, s) - __pow(this.m_radius, 2);
          const r = b2_math_1.b2Vec2.Subtract(input.p2, input.p1, b2CircleShape3.RayCast_s_r);
          const c = b2_math_1.b2Vec2.Dot(s, r);
          const rr = b2_math_1.b2Vec2.Dot(r, r);
          const sigma = c * c - rr * b;
          if (sigma < 0 || rr < b2_common_1.b2_epsilon) {
            return false;
          }
          let a = -(c + Math.sqrt(sigma));
          if (a >= 0 && a <= input.maxFraction * rr) {
            a /= rr;
            output.fraction = a;
            b2_math_1.b2Vec2.AddScaled(s, a, r, output.normal).Normalize();
            return true;
          }
          return false;
        }
        ComputeAABB(aabb, transform, _childIndex) {
          const p = b2_math_1.b2Transform.MultiplyVec2(transform, this.m_p, b2CircleShape3.ComputeAABB_s_p);
          aabb.lowerBound.Set(p.x - this.m_radius, p.y - this.m_radius);
          aabb.upperBound.Set(p.x + this.m_radius, p.y + this.m_radius);
        }
        ComputeMass(massData, density) {
          const radius_sq = __pow(this.m_radius, 2);
          massData.mass = density * Math.PI * radius_sq;
          massData.center.Copy(this.m_p);
          massData.I = massData.mass * (0.5 * radius_sq + b2_math_1.b2Vec2.Dot(this.m_p, this.m_p));
        }
        SetupDistanceProxy(proxy, _index) {
          proxy.m_vertices = proxy.m_buffer;
          proxy.m_vertices[0].Copy(this.m_p);
          proxy.m_count = 1;
          proxy.m_radius = this.m_radius;
        }
        Draw(draw, color) {
          const center = this.m_p;
          const radius = this.m_radius;
          const axis = b2_math_1.b2Vec2.UNITX;
          draw.DrawSolidCircle(center, radius, axis, color);
        }
      };
      exports.b2CircleShape = b2CircleShape3;
      b2CircleShape3.TestPoint_s_center = new b2_math_1.b2Vec2();
      b2CircleShape3.TestPoint_s_d = new b2_math_1.b2Vec2();
      b2CircleShape3.RayCast_s_position = new b2_math_1.b2Vec2();
      b2CircleShape3.RayCast_s_s = new b2_math_1.b2Vec2();
      b2CircleShape3.RayCast_s_r = new b2_math_1.b2Vec2();
      b2CircleShape3.ComputeAABB_s_p = new b2_math_1.b2Vec2();
    }
  });
  var require_b2_polygon_shape = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_polygon_shape.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2PolygonShape = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_settings_1 = require_b2_settings();
      var b2_shape_1 = require_b2_shape();
      var temp = {
        ComputeCentroid: {
          s: new b2_math_1.b2Vec2(),
          p1: new b2_math_1.b2Vec2(),
          p2: new b2_math_1.b2Vec2(),
          p3: new b2_math_1.b2Vec2(),
          e1: new b2_math_1.b2Vec2(),
          e2: new b2_math_1.b2Vec2()
        },
        TestPoint: {
          pLocal: new b2_math_1.b2Vec2()
        },
        ComputeAABB: {
          v: new b2_math_1.b2Vec2()
        },
        ComputeMass: {
          center: new b2_math_1.b2Vec2(),
          s: new b2_math_1.b2Vec2(),
          e1: new b2_math_1.b2Vec2(),
          e2: new b2_math_1.b2Vec2()
        },
        Validate: {
          e: new b2_math_1.b2Vec2(),
          v: new b2_math_1.b2Vec2()
        },
        Set: {
          r: new b2_math_1.b2Vec2(),
          v: new b2_math_1.b2Vec2()
        },
        RayCast: {
          p1: new b2_math_1.b2Vec2(),
          p2: new b2_math_1.b2Vec2(),
          d: new b2_math_1.b2Vec2()
        },
        SetAsBox: {
          xf: new b2_math_1.b2Transform()
        }
      };
      var weldingDistanceSquared = __pow(0.5 * b2_common_1.b2_linearSlop, 2);
      function ComputeCentroid(vs, count, out) {
        const c = out;
        c.SetZero();
        let area = 0;
        const {s, p1, p2, p3, e1, e2} = temp.ComputeCentroid;
        s.Copy(vs[0]);
        const inv3 = 1 / 3;
        for (let i = 0; i < count; ++i) {
          b2_math_1.b2Vec2.Subtract(vs[0], s, p1);
          b2_math_1.b2Vec2.Subtract(vs[i], s, p2);
          b2_math_1.b2Vec2.Subtract(vs[i + 1 < count ? i + 1 : 0], s, p3);
          b2_math_1.b2Vec2.Subtract(p2, p1, e1);
          b2_math_1.b2Vec2.Subtract(p3, p1, e2);
          const D = b2_math_1.b2Vec2.Cross(e1, e2);
          const triangleArea = 0.5 * D;
          area += triangleArea;
          c.x += triangleArea * inv3 * (p1.x + p2.x + p3.x);
          c.y += triangleArea * inv3 * (p1.y + p2.y + p3.y);
        }
        const f = 1 / area;
        c.x = f * c.x + s.x;
        c.y = f * c.y + s.y;
        return c;
      }
      var b2PolygonShape4 = class extends b2_shape_1.b2Shape {
        constructor() {
          super(b2_shape_1.b2ShapeType.e_polygon, b2_common_1.b2_polygonRadius);
          this.m_centroid = new b2_math_1.b2Vec2();
          this.m_vertices = [];
          this.m_normals = [];
          this.m_count = 0;
        }
        Clone() {
          return new b2PolygonShape4().Copy(this);
        }
        Copy(other) {
          super.Copy(other);
          this.m_centroid.Copy(other.m_centroid);
          this.m_count = other.m_count;
          this.m_vertices = (0, b2_common_1.b2MakeArray)(this.m_count, b2_math_1.b2Vec2);
          this.m_normals = (0, b2_common_1.b2MakeArray)(this.m_count, b2_math_1.b2Vec2);
          for (let i = 0; i < this.m_count; ++i) {
            this.m_vertices[i].Copy(other.m_vertices[i]);
            this.m_normals[i].Copy(other.m_normals[i]);
          }
          return this;
        }
        GetChildCount() {
          return 1;
        }
        Set(vertices, count = vertices.length) {
          if (count < 3) {
            return this.SetAsBox(1, 1);
          }
          let n = Math.min(count, b2_settings_1.b2_maxPolygonVertices);
          const ps = [];
          for (let i = 0; i < n; ++i) {
            const v = vertices[i];
            const unique = ps.every(p => b2_math_1.b2Vec2.DistanceSquared(v, p) >= weldingDistanceSquared);
            if (unique) {
              ps.push(v);
            }
          }
          n = ps.length;
          if (n < 3) {
            return this.SetAsBox(1, 1);
          }
          let i0 = 0;
          let x0 = ps[0].x;
          for (let i = 1; i < n; ++i) {
            const {x} = ps[i];
            if (x > x0 || x === x0 && ps[i].y < ps[i0].y) {
              i0 = i;
              x0 = x;
            }
          }
          const hull = [];
          let m = 0;
          let ih = i0;
          for (; ; ) {
            hull[m] = ih;
            let ie = 0;
            for (let j = 1; j < n; ++j) {
              if (ie === ih) {
                ie = j;
                continue;
              }
              const r = b2_math_1.b2Vec2.Subtract(ps[ie], ps[hull[m]], temp.Set.r);
              const v = b2_math_1.b2Vec2.Subtract(ps[j], ps[hull[m]], temp.Set.v);
              const c = b2_math_1.b2Vec2.Cross(r, v);
              if (c < 0) {
                ie = j;
              }
              if (c === 0 && v.LengthSquared() > r.LengthSquared()) {
                ie = j;
              }
            }
            ++m;
            ih = ie;
            if (ie === i0) {
              break;
            }
          }
          (0, b2_common_1.b2Assert)(m >= 3, "Polygon is degenerate");
          this.m_count = m;
          this.m_vertices = (0, b2_common_1.b2MakeArray)(this.m_count, b2_math_1.b2Vec2);
          this.m_normals = (0, b2_common_1.b2MakeArray)(this.m_count, b2_math_1.b2Vec2);
          for (let i = 0; i < m; ++i) {
            this.m_vertices[i].Copy(ps[hull[i]]);
          }
          for (let i = 0; i < m; ++i) {
            const i1 = i;
            const i2 = i + 1 < m ? i + 1 : 0;
            const edge = b2_math_1.b2Vec2.Subtract(this.m_vertices[i2], this.m_vertices[i1], b2_math_1.b2Vec2.s_t0);
            b2_math_1.b2Vec2.CrossVec2One(edge, this.m_normals[i]).Normalize();
          }
          ComputeCentroid(this.m_vertices, m, this.m_centroid);
          return this;
        }
        SetAsBox(hx, hy, center, angle = 0) {
          this.m_count = 4;
          this.m_vertices = (0, b2_common_1.b2MakeArray)(this.m_count, b2_math_1.b2Vec2);
          this.m_normals = (0, b2_common_1.b2MakeArray)(this.m_count, b2_math_1.b2Vec2);
          this.m_vertices[0].Set(-hx, -hy);
          this.m_vertices[1].Set(hx, -hy);
          this.m_vertices[2].Set(hx, hy);
          this.m_vertices[3].Set(-hx, hy);
          this.m_normals[0].Set(0, -1);
          this.m_normals[1].Set(1, 0);
          this.m_normals[2].Set(0, 1);
          this.m_normals[3].Set(-1, 0);
          if (center) {
            this.m_centroid.Copy(center);
            const {xf} = temp.SetAsBox;
            xf.SetPosition(center);
            xf.SetRotationAngle(angle);
            for (let i = 0; i < this.m_count; ++i) {
              b2_math_1.b2Transform.MultiplyVec2(xf, this.m_vertices[i], this.m_vertices[i]);
              b2_math_1.b2Rot.MultiplyVec2(xf.q, this.m_normals[i], this.m_normals[i]);
            }
          } else {
            this.m_centroid.SetZero();
          }
          return this;
        }
        TestPoint(xf, p) {
          const pLocal = b2_math_1.b2Transform.TransposeMultiplyVec2(xf, p, temp.TestPoint.pLocal);
          for (let i = 0; i < this.m_count; ++i) {
            const dot = b2_math_1.b2Vec2.Dot(this.m_normals[i], b2_math_1.b2Vec2.Subtract(pLocal, this.m_vertices[i], b2_math_1.b2Vec2.s_t0));
            if (dot > 0) {
              return false;
            }
          }
          return true;
        }
        RayCast(output, input, xf, _childIndex) {
          const p1 = b2_math_1.b2Transform.TransposeMultiplyVec2(xf, input.p1, temp.RayCast.p1);
          const p2 = b2_math_1.b2Transform.TransposeMultiplyVec2(xf, input.p2, temp.RayCast.p2);
          const d = b2_math_1.b2Vec2.Subtract(p2, p1, temp.RayCast.d);
          let lower = 0;
          let upper = input.maxFraction;
          let index = -1;
          for (let i = 0; i < this.m_count; ++i) {
            const numerator = b2_math_1.b2Vec2.Dot(this.m_normals[i], b2_math_1.b2Vec2.Subtract(this.m_vertices[i], p1, b2_math_1.b2Vec2.s_t0));
            const denominator = b2_math_1.b2Vec2.Dot(this.m_normals[i], d);
            if (denominator === 0) {
              if (numerator < 0) {
                return false;
              }
            } else if (denominator < 0 && numerator < lower * denominator) {
              lower = numerator / denominator;
              index = i;
            } else if (denominator > 0 && numerator < upper * denominator) {
              upper = numerator / denominator;
            }
            if (upper < lower) {
              return false;
            }
          }
          if (index >= 0) {
            output.fraction = lower;
            b2_math_1.b2Rot.MultiplyVec2(xf.q, this.m_normals[index], output.normal);
            return true;
          }
          return false;
        }
        ComputeAABB(aabb, xf, _childIndex) {
          const lower = b2_math_1.b2Transform.MultiplyVec2(xf, this.m_vertices[0], aabb.lowerBound);
          const upper = aabb.upperBound.Copy(lower);
          for (let i = 1; i < this.m_count; ++i) {
            const v = b2_math_1.b2Transform.MultiplyVec2(xf, this.m_vertices[i], temp.ComputeAABB.v);
            b2_math_1.b2Vec2.Min(lower, v, lower);
            b2_math_1.b2Vec2.Max(upper, v, upper);
          }
          const r = this.m_radius;
          lower.SubtractXY(r, r);
          upper.AddXY(r, r);
        }
        ComputeMass(massData, density) {
          const center = temp.ComputeMass.center.SetZero();
          let area = 0;
          let I = 0;
          const s = temp.ComputeMass.s.Copy(this.m_vertices[0]);
          const k_inv3 = 1 / 3;
          for (let i = 0; i < this.m_count; ++i) {
            const e1 = b2_math_1.b2Vec2.Subtract(this.m_vertices[i], s, temp.ComputeMass.e1);
            const e2 = b2_math_1.b2Vec2.Subtract(this.m_vertices[i + 1 < this.m_count ? i + 1 : 0], s, temp.ComputeMass.e2);
            const D = b2_math_1.b2Vec2.Cross(e1, e2);
            const triangleArea = 0.5 * D;
            area += triangleArea;
            center.AddScaled(triangleArea * k_inv3, b2_math_1.b2Vec2.Add(e1, e2, b2_math_1.b2Vec2.s_t0));
            const ex1 = e1.x;
            const ey1 = e1.y;
            const ex2 = e2.x;
            const ey2 = e2.y;
            const intx2 = ex1 * ex1 + ex2 * ex1 + ex2 * ex2;
            const inty2 = ey1 * ey1 + ey2 * ey1 + ey2 * ey2;
            I += 0.25 * k_inv3 * D * (intx2 + inty2);
          }
          massData.mass = density * area;
          center.Scale(1 / area);
          b2_math_1.b2Vec2.Add(center, s, massData.center);
          massData.I = density * I;
          massData.I += massData.mass * (b2_math_1.b2Vec2.Dot(massData.center, massData.center) - b2_math_1.b2Vec2.Dot(center, center));
        }
        Validate() {
          const {e, v} = temp.Validate;
          for (let i = 0; i < this.m_count; ++i) {
            const i1 = i;
            const i2 = i < this.m_count - 1 ? i1 + 1 : 0;
            const p = this.m_vertices[i1];
            b2_math_1.b2Vec2.Subtract(this.m_vertices[i2], p, e);
            for (let j = 0; j < this.m_count; ++j) {
              if (j === i1 || j === i2) {
                continue;
              }
              b2_math_1.b2Vec2.Subtract(this.m_vertices[j], p, v);
              const c = b2_math_1.b2Vec2.Cross(e, v);
              if (c < 0) {
                return false;
              }
            }
          }
          return true;
        }
        SetupDistanceProxy(proxy, _index) {
          proxy.m_vertices = this.m_vertices;
          proxy.m_count = this.m_count;
          proxy.m_radius = this.m_radius;
        }
        Draw(draw, color) {
          const vertexCount = this.m_count;
          const vertices = this.m_vertices;
          draw.DrawSolidPolygon(vertices, vertexCount, color);
        }
      };
      exports.b2PolygonShape = b2PolygonShape4;
    }
  });
  var require_b2_edge_shape = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_edge_shape.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2EdgeShape = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_shape_1 = require_b2_shape();
      var b2EdgeShape = class extends b2_shape_1.b2Shape {
        constructor() {
          super(b2_shape_1.b2ShapeType.e_edge, b2_common_1.b2_polygonRadius);
          this.m_vertex1 = new b2_math_1.b2Vec2();
          this.m_vertex2 = new b2_math_1.b2Vec2();
          this.m_vertex0 = new b2_math_1.b2Vec2();
          this.m_vertex3 = new b2_math_1.b2Vec2();
          this.m_oneSided = false;
        }
        SetOneSided(v0, v1, v2, v3) {
          this.m_vertex0.Copy(v0);
          this.m_vertex1.Copy(v1);
          this.m_vertex2.Copy(v2);
          this.m_vertex3.Copy(v3);
          this.m_oneSided = true;
          return this;
        }
        SetTwoSided(v1, v2) {
          this.m_vertex1.Copy(v1);
          this.m_vertex2.Copy(v2);
          this.m_oneSided = false;
          return this;
        }
        Clone() {
          return new b2EdgeShape().Copy(this);
        }
        Copy(other) {
          super.Copy(other);
          this.m_vertex1.Copy(other.m_vertex1);
          this.m_vertex2.Copy(other.m_vertex2);
          this.m_vertex0.Copy(other.m_vertex0);
          this.m_vertex3.Copy(other.m_vertex3);
          this.m_oneSided = other.m_oneSided;
          return this;
        }
        GetChildCount() {
          return 1;
        }
        TestPoint(_xf, _p) {
          return false;
        }
        RayCast(output, input, xf, _childIndex) {
          const p1 = b2_math_1.b2Transform.TransposeMultiplyVec2(xf, input.p1, b2EdgeShape.RayCast_s_p1);
          const p2 = b2_math_1.b2Transform.TransposeMultiplyVec2(xf, input.p2, b2EdgeShape.RayCast_s_p2);
          const d = b2_math_1.b2Vec2.Subtract(p2, p1, b2EdgeShape.RayCast_s_d);
          const v1 = this.m_vertex1;
          const v2 = this.m_vertex2;
          const e = b2_math_1.b2Vec2.Subtract(v2, v1, b2EdgeShape.RayCast_s_e);
          const {normal} = output;
          normal.Set(e.y, -e.x).Normalize();
          const numerator = b2_math_1.b2Vec2.Dot(normal, b2_math_1.b2Vec2.Subtract(v1, p1, b2_math_1.b2Vec2.s_t0));
          if (this.m_oneSided && numerator > 0) {
            return false;
          }
          const denominator = b2_math_1.b2Vec2.Dot(normal, d);
          if (denominator === 0) {
            return false;
          }
          const t = numerator / denominator;
          if (t < 0 || input.maxFraction < t) {
            return false;
          }
          const q = b2_math_1.b2Vec2.AddScaled(p1, t, d, b2EdgeShape.RayCast_s_q);
          const r = b2_math_1.b2Vec2.Subtract(v2, v1, b2EdgeShape.RayCast_s_r);
          const rr = b2_math_1.b2Vec2.Dot(r, r);
          if (rr === 0) {
            return false;
          }
          const s = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(q, v1, b2_math_1.b2Vec2.s_t0), r) / rr;
          if (s < 0 || s > 1) {
            return false;
          }
          output.fraction = t;
          b2_math_1.b2Rot.MultiplyVec2(xf.q, output.normal, output.normal);
          if (numerator > 0) {
            output.normal.Negate();
          }
          return true;
        }
        ComputeAABB(aabb, xf, _childIndex) {
          const v1 = b2_math_1.b2Transform.MultiplyVec2(xf, this.m_vertex1, b2EdgeShape.ComputeAABB_s_v1);
          const v2 = b2_math_1.b2Transform.MultiplyVec2(xf, this.m_vertex2, b2EdgeShape.ComputeAABB_s_v2);
          b2_math_1.b2Vec2.Min(v1, v2, aabb.lowerBound);
          b2_math_1.b2Vec2.Max(v1, v2, aabb.upperBound);
          const r = this.m_radius;
          aabb.lowerBound.SubtractXY(r, r);
          aabb.upperBound.AddXY(r, r);
        }
        ComputeMass(massData, _density) {
          massData.mass = 0;
          b2_math_1.b2Vec2.Mid(this.m_vertex1, this.m_vertex2, massData.center);
          massData.I = 0;
        }
        SetupDistanceProxy(proxy, _index) {
          proxy.m_vertices = proxy.m_buffer;
          proxy.m_vertices[0].Copy(this.m_vertex1);
          proxy.m_vertices[1].Copy(this.m_vertex2);
          proxy.m_count = 2;
          proxy.m_radius = this.m_radius;
        }
        Draw(draw, color) {
          const v1 = this.m_vertex1;
          const v2 = this.m_vertex2;
          draw.DrawSegment(v1, v2, color);
          if (this.m_oneSided === false) {
            draw.DrawPoint(v1, 4, color);
            draw.DrawPoint(v2, 4, color);
          }
        }
      };
      exports.b2EdgeShape = b2EdgeShape;
      b2EdgeShape.RayCast_s_p1 = new b2_math_1.b2Vec2();
      b2EdgeShape.RayCast_s_p2 = new b2_math_1.b2Vec2();
      b2EdgeShape.RayCast_s_d = new b2_math_1.b2Vec2();
      b2EdgeShape.RayCast_s_e = new b2_math_1.b2Vec2();
      b2EdgeShape.RayCast_s_q = new b2_math_1.b2Vec2();
      b2EdgeShape.RayCast_s_r = new b2_math_1.b2Vec2();
      b2EdgeShape.ComputeAABB_s_v1 = new b2_math_1.b2Vec2();
      b2EdgeShape.ComputeAABB_s_v2 = new b2_math_1.b2Vec2();
    }
  });
  var require_b2_chain_shape = __commonJS({
    "node_modules/@box2d/core/dist/collision/b2_chain_shape.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2ChainShape = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_shape_1 = require_b2_shape();
      var b2_edge_shape_1 = require_b2_edge_shape();
      var b2ChainShape = class extends b2_shape_1.b2Shape {
        constructor() {
          super(b2_shape_1.b2ShapeType.e_chain, b2_common_1.b2_polygonRadius);
          this.m_vertices = [];
          this.m_prevVertex = new b2_math_1.b2Vec2();
          this.m_nextVertex = new b2_math_1.b2Vec2();
        }
        CreateLoop(vertices, count = vertices.length) {
          if (count < 3) {
            return this;
          }
          this.m_vertices.length = count + 1;
          for (let i = 0; i < count; ++i) {
            const {x, y} = vertices[i];
            this.m_vertices[i] = new b2_math_1.b2Vec2(x, y);
          }
          this.m_vertices[count] = this.m_vertices[0].Clone();
          this.m_prevVertex.Copy(this.m_vertices[this.m_vertices.length - 2]);
          this.m_nextVertex.Copy(this.m_vertices[1]);
          return this;
        }
        CreateChain(vertices, count, prevVertex, nextVertex) {
          this.m_vertices.length = count;
          for (let i = 0; i < count; ++i) {
            const {x, y} = vertices[i];
            this.m_vertices[i] = new b2_math_1.b2Vec2(x, y);
          }
          this.m_prevVertex.Copy(prevVertex);
          this.m_nextVertex.Copy(nextVertex);
          return this;
        }
        Clone() {
          return new b2ChainShape().Copy(this);
        }
        Copy(other) {
          super.Copy(other);
          return this.CreateChain(other.m_vertices, other.m_vertices.length, other.m_prevVertex, other.m_nextVertex);
        }
        GetChildCount() {
          return this.m_vertices.length - 1;
        }
        GetChildEdge(edge, index) {
          edge.m_radius = this.m_radius;
          edge.m_vertex1.Copy(this.m_vertices[index]);
          edge.m_vertex2.Copy(this.m_vertices[index + 1]);
          edge.m_oneSided = true;
          if (index > 0) {
            edge.m_vertex0.Copy(this.m_vertices[index - 1]);
          } else {
            edge.m_vertex0.Copy(this.m_prevVertex);
          }
          if (index < this.m_vertices.length - 2) {
            edge.m_vertex3.Copy(this.m_vertices[index + 2]);
          } else {
            edge.m_vertex3.Copy(this.m_nextVertex);
          }
        }
        TestPoint(_xf, _p) {
          return false;
        }
        RayCast(output, input, xf, childIndex) {
          const edgeShape = b2ChainShape.RayCast_s_edgeShape;
          const i1 = childIndex;
          let i2 = childIndex + 1;
          if (i2 === this.m_vertices.length) {
            i2 = 0;
          }
          edgeShape.m_vertex1.Copy(this.m_vertices[i1]);
          edgeShape.m_vertex2.Copy(this.m_vertices[i2]);
          return edgeShape.RayCast(output, input, xf, 0);
        }
        ComputeAABB(aabb, xf, childIndex) {
          const i1 = childIndex;
          let i2 = childIndex + 1;
          if (i2 === this.m_vertices.length) {
            i2 = 0;
          }
          const v1 = b2_math_1.b2Transform.MultiplyVec2(xf, this.m_vertices[i1], b2ChainShape.ComputeAABB_s_v1);
          const v2 = b2_math_1.b2Transform.MultiplyVec2(xf, this.m_vertices[i2], b2ChainShape.ComputeAABB_s_v2);
          const lower = b2_math_1.b2Vec2.Min(v1, v2, b2ChainShape.ComputeAABB_s_lower);
          const upper = b2_math_1.b2Vec2.Max(v1, v2, b2ChainShape.ComputeAABB_s_upper);
          aabb.lowerBound.x = lower.x - this.m_radius;
          aabb.lowerBound.y = lower.y - this.m_radius;
          aabb.upperBound.x = upper.x + this.m_radius;
          aabb.upperBound.y = upper.y + this.m_radius;
        }
        ComputeMass(massData, _density) {
          massData.mass = 0;
          massData.center.SetZero();
          massData.I = 0;
        }
        SetupDistanceProxy(proxy, index) {
          proxy.m_vertices = proxy.m_buffer;
          proxy.m_vertices[0].Copy(this.m_vertices[index]);
          if (index + 1 < this.m_vertices.length) {
            proxy.m_vertices[1].Copy(this.m_vertices[index + 1]);
          } else {
            proxy.m_vertices[1].Copy(this.m_vertices[0]);
          }
          proxy.m_count = 2;
          proxy.m_radius = this.m_radius;
        }
        Draw(draw, color) {
          const vertices = this.m_vertices;
          let v1 = vertices[0];
          for (let i = 1; i < vertices.length; ++i) {
            const v2 = vertices[i];
            draw.DrawSegment(v1, v2, color);
            v1 = v2;
          }
        }
      };
      exports.b2ChainShape = b2ChainShape;
      b2ChainShape.RayCast_s_edgeShape = new b2_edge_shape_1.b2EdgeShape();
      b2ChainShape.ComputeAABB_s_v1 = new b2_math_1.b2Vec2();
      b2ChainShape.ComputeAABB_s_v2 = new b2_math_1.b2Vec2();
      b2ChainShape.ComputeAABB_s_lower = new b2_math_1.b2Vec2();
      b2ChainShape.ComputeAABB_s_upper = new b2_math_1.b2Vec2();
    }
  });
  var require_b2_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2Joint = exports.b2AngularStiffness = exports.b2LinearStiffness = exports.b2JointDef = exports.b2JointEdge = exports.b2JointType = void 0;
      var b2_draw_1 = require_b2_draw();
      var b2_math_1 = require_b2_math();
      var temp = {
        pA: new b2_math_1.b2Vec2(),
        pB: new b2_math_1.b2Vec2()
      };
      var b2JointType;
      (function (b2JointType2) {
        b2JointType2[b2JointType2["e_unknownJoint"] = 0] = "e_unknownJoint";
        b2JointType2[b2JointType2["e_revoluteJoint"] = 1] = "e_revoluteJoint";
        b2JointType2[b2JointType2["e_prismaticJoint"] = 2] = "e_prismaticJoint";
        b2JointType2[b2JointType2["e_distanceJoint"] = 3] = "e_distanceJoint";
        b2JointType2[b2JointType2["e_pulleyJoint"] = 4] = "e_pulleyJoint";
        b2JointType2[b2JointType2["e_mouseJoint"] = 5] = "e_mouseJoint";
        b2JointType2[b2JointType2["e_gearJoint"] = 6] = "e_gearJoint";
        b2JointType2[b2JointType2["e_wheelJoint"] = 7] = "e_wheelJoint";
        b2JointType2[b2JointType2["e_weldJoint"] = 8] = "e_weldJoint";
        b2JointType2[b2JointType2["e_frictionJoint"] = 9] = "e_frictionJoint";
        b2JointType2[b2JointType2["e_motorJoint"] = 10] = "e_motorJoint";
        b2JointType2[b2JointType2["e_areaJoint"] = 11] = "e_areaJoint";
      })(b2JointType = exports.b2JointType || (exports.b2JointType = {}));
      var b2JointEdge = class {
        constructor(joint, other) {
          this.prev = null;
          this.next = null;
          this.joint = joint;
          this.other = other;
        }
      };
      exports.b2JointEdge = b2JointEdge;
      var b2JointDef = class {
        constructor(type) {
          this.userData = null;
          this.collideConnected = false;
          this.type = type;
        }
      };
      exports.b2JointDef = b2JointDef;
      function b2LinearStiffness(def, frequencyHertz, dampingRatio, bodyA, bodyB) {
        const massA = bodyA.GetMass();
        const massB = bodyB.GetMass();
        let mass;
        if (massA > 0 && massB > 0) {
          mass = massA * massB / (massA + massB);
        } else if (massA > 0) {
          mass = massA;
        } else {
          mass = massB;
        }
        const omega = 2 * Math.PI * frequencyHertz;
        def.stiffness = mass * omega * omega;
        def.damping = 2 * mass * dampingRatio * omega;
      }
      exports.b2LinearStiffness = b2LinearStiffness;
      function b2AngularStiffness(def, frequencyHertz, dampingRatio, bodyA, bodyB) {
        const IA = bodyA.GetInertia();
        const IB = bodyB.GetInertia();
        let I;
        if (IA > 0 && IB > 0) {
          I = IA * IB / (IA + IB);
        } else if (IA > 0) {
          I = IA;
        } else {
          I = IB;
        }
        const omega = 2 * Math.PI * frequencyHertz;
        def.stiffness = I * omega * omega;
        def.damping = 2 * I * dampingRatio * omega;
      }
      exports.b2AngularStiffness = b2AngularStiffness;
      var b2Joint = class {
        constructor(def) {
          var _a;
          this.m_type = b2JointType.e_unknownJoint;
          this.m_prev = null;
          this.m_next = null;
          this.m_islandFlag = false;
          this.m_collideConnected = false;
          this.m_userData = null;
          this.m_type = def.type;
          this.m_edgeA = new b2JointEdge(this, def.bodyB);
          this.m_edgeB = new b2JointEdge(this, def.bodyA);
          this.m_bodyA = def.bodyA;
          this.m_bodyB = def.bodyB;
          this.m_collideConnected = (_a = def.collideConnected) !== null && _a !== void 0 ? _a : false;
          this.m_userData = def.userData;
        }
        GetType() {
          return this.m_type;
        }
        GetBodyA() {
          return this.m_bodyA;
        }
        GetBodyB() {
          return this.m_bodyB;
        }
        GetNext() {
          return this.m_next;
        }
        GetUserData() {
          return this.m_userData;
        }
        SetUserData(data) {
          this.m_userData = data;
        }
        IsEnabled() {
          return this.m_bodyA.IsEnabled() && this.m_bodyB.IsEnabled();
        }
        GetCollideConnected() {
          return this.m_collideConnected;
        }
        ShiftOrigin(_newOrigin) {}
        Draw(draw) {
          const x1 = this.m_bodyA.GetTransform().p;
          const x2 = this.m_bodyB.GetTransform().p;
          const p1 = this.GetAnchorA(temp.pA);
          const p2 = this.GetAnchorB(temp.pB);
          draw.DrawSegment(x1, p1, b2_draw_1.debugColors.joint6);
          draw.DrawSegment(p1, p2, b2_draw_1.debugColors.joint6);
          draw.DrawSegment(x2, p2, b2_draw_1.debugColors.joint6);
        }
      };
      exports.b2Joint = b2Joint;
    }
  });
  var require_b2_distance_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_distance_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2DistanceJoint = exports.b2DistanceJointDef = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_joint_1 = require_b2_joint();
      var b2_draw_1 = require_b2_draw();
      var temp = {
        worldPointA: new b2_math_1.b2Vec2(),
        worldPointB: new b2_math_1.b2Vec2(),
        vpA: new b2_math_1.b2Vec2(),
        vpB: new b2_math_1.b2Vec2(),
        vpBA: new b2_math_1.b2Vec2(),
        P: new b2_math_1.b2Vec2(),
        qA: new b2_math_1.b2Rot(),
        qB: new b2_math_1.b2Rot(),
        lalcA: new b2_math_1.b2Vec2(),
        lalcB: new b2_math_1.b2Vec2(),
        Draw: {
          pA: new b2_math_1.b2Vec2(),
          pB: new b2_math_1.b2Vec2(),
          axis: new b2_math_1.b2Vec2(),
          pRest: new b2_math_1.b2Vec2(),
          p1: new b2_math_1.b2Vec2(),
          p2: new b2_math_1.b2Vec2()
        }
      };
      var b2DistanceJointDef = class extends b2_joint_1.b2JointDef {
        constructor() {
          super(b2_joint_1.b2JointType.e_distanceJoint);
          this.localAnchorA = new b2_math_1.b2Vec2();
          this.localAnchorB = new b2_math_1.b2Vec2();
          this.length = 1;
          this.minLength = 0;
          this.maxLength = b2_common_1.b2_maxFloat;
          this.stiffness = 0;
          this.damping = 0;
        }
        Initialize(b1, b2, anchor1, anchor2) {
          this.bodyA = b1;
          this.bodyB = b2;
          this.bodyA.GetLocalPoint(anchor1, this.localAnchorA);
          this.bodyB.GetLocalPoint(anchor2, this.localAnchorB);
          this.length = Math.max(b2_math_1.b2Vec2.Distance(anchor1, anchor2), b2_common_1.b2_linearSlop);
          this.minLength = this.length;
          this.maxLength = this.length;
        }
      };
      exports.b2DistanceJointDef = b2DistanceJointDef;
      var b2DistanceJoint = class extends b2_joint_1.b2Joint {
        constructor(def) {
          var _a, _b;
          super(def);
          this.m_bias = 0;
          this.m_localAnchorA = new b2_math_1.b2Vec2();
          this.m_localAnchorB = new b2_math_1.b2Vec2();
          this.m_gamma = 0;
          this.m_impulse = 0;
          this.m_lowerImpulse = 0;
          this.m_upperImpulse = 0;
          this.m_indexA = 0;
          this.m_indexB = 0;
          this.m_u = new b2_math_1.b2Vec2();
          this.m_rA = new b2_math_1.b2Vec2();
          this.m_rB = new b2_math_1.b2Vec2();
          this.m_localCenterA = new b2_math_1.b2Vec2();
          this.m_localCenterB = new b2_math_1.b2Vec2();
          this.m_currentLength = 0;
          this.m_invMassA = 0;
          this.m_invMassB = 0;
          this.m_invIA = 0;
          this.m_invIB = 0;
          this.m_softMass = 0;
          this.m_mass = 0;
          this.m_localAnchorA.Copy(def.localAnchorA);
          this.m_localAnchorB.Copy(def.localAnchorB);
          this.m_length = Math.max(def.length, b2_common_1.b2_linearSlop);
          this.m_minLength = Math.max(def.minLength, b2_common_1.b2_linearSlop);
          this.m_maxLength = Math.max(def.maxLength, this.m_minLength);
          this.m_stiffness = (_a = def.stiffness) !== null && _a !== void 0 ? _a : 0;
          this.m_damping = (_b = def.damping) !== null && _b !== void 0 ? _b : 0;
        }
        GetAnchorA(out) {
          return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        }
        GetAnchorB(out) {
          return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        }
        GetReactionForce(inv_dt, out) {
          const f = inv_dt * (this.m_impulse + this.m_lowerImpulse - this.m_upperImpulse);
          out.x = f * this.m_u.x;
          out.y = f * this.m_u.y;
          return out;
        }
        GetReactionTorque(_inv_dt) {
          return 0;
        }
        GetLocalAnchorA() {
          return this.m_localAnchorA;
        }
        GetLocalAnchorB() {
          return this.m_localAnchorB;
        }
        SetLength(length) {
          this.m_impulse = 0;
          this.m_length = Math.max(b2_common_1.b2_linearSlop, length);
          return this.m_length;
        }
        GetLength() {
          return this.m_length;
        }
        SetMinLength(minLength) {
          this.m_lowerImpulse = 0;
          this.m_minLength = (0, b2_math_1.b2Clamp)(minLength, b2_common_1.b2_linearSlop, this.m_maxLength);
          return this.m_minLength;
        }
        GetMinLength() {
          return this.m_minLength;
        }
        SetMaxLength(maxLength) {
          this.m_upperImpulse = 0;
          this.m_maxLength = Math.max(maxLength, this.m_minLength);
          return this.m_maxLength;
        }
        GetMaxLength() {
          return this.m_maxLength;
        }
        GetCurrentLength() {
          const pA = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, temp.worldPointA);
          const pB = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, temp.worldPointB);
          return b2_math_1.b2Vec2.Distance(pB, pA);
        }
        SetStiffness(stiffness) {
          this.m_stiffness = stiffness;
        }
        GetStiffness() {
          return this.m_stiffness;
        }
        SetDamping(damping) {
          this.m_damping = damping;
        }
        GetDamping() {
          return this.m_damping;
        }
        InitVelocityConstraints(data) {
          this.m_indexA = this.m_bodyA.m_islandIndex;
          this.m_indexB = this.m_bodyB.m_islandIndex;
          this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
          this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
          this.m_invMassA = this.m_bodyA.m_invMass;
          this.m_invMassB = this.m_bodyB.m_invMass;
          this.m_invIA = this.m_bodyA.m_invI;
          this.m_invIB = this.m_bodyB.m_invI;
          const cA = data.positions[this.m_indexA].c;
          const aA = data.positions[this.m_indexA].a;
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const cB = data.positions[this.m_indexB].c;
          const aB = data.positions[this.m_indexB].a;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {qA, qB, lalcA, lalcB} = temp;
          qA.Set(aA);
          qB.Set(aB);
          b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), this.m_rA);
          b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), this.m_rB);
          this.m_u.x = cB.x + this.m_rB.x - cA.x - this.m_rA.x;
          this.m_u.y = cB.y + this.m_rB.y - cA.y - this.m_rA.y;
          this.m_currentLength = this.m_u.Length();
          if (this.m_currentLength > b2_common_1.b2_linearSlop) {
            this.m_u.Scale(1 / this.m_currentLength);
          } else {
            this.m_u.SetZero();
            this.m_mass = 0;
            this.m_impulse = 0;
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
          const crAu = b2_math_1.b2Vec2.Cross(this.m_rA, this.m_u);
          const crBu = b2_math_1.b2Vec2.Cross(this.m_rB, this.m_u);
          let invMass = this.m_invMassA + this.m_invIA * crAu * crAu + this.m_invMassB + this.m_invIB * crBu * crBu;
          this.m_mass = invMass !== 0 ? 1 / invMass : 0;
          if (this.m_stiffness > 0 && this.m_minLength < this.m_maxLength) {
            const C = this.m_currentLength - this.m_length;
            const d = this.m_damping;
            const k = this.m_stiffness;
            const h = data.step.dt;
            this.m_gamma = h * (d + h * k);
            this.m_gamma = this.m_gamma !== 0 ? 1 / this.m_gamma : 0;
            this.m_bias = C * h * k * this.m_gamma;
            invMass += this.m_gamma;
            this.m_softMass = invMass !== 0 ? 1 / invMass : 0;
          } else {
            this.m_gamma = 0;
            this.m_bias = 0;
            this.m_softMass = this.m_mass;
          }
          if (data.step.warmStarting) {
            this.m_impulse *= data.step.dtRatio;
            this.m_lowerImpulse *= data.step.dtRatio;
            this.m_upperImpulse *= data.step.dtRatio;
            const {P} = temp;
            b2_math_1.b2Vec2.Scale(this.m_impulse + this.m_lowerImpulse - this.m_upperImpulse, this.m_u, P);
            vA.SubtractScaled(this.m_invMassA, P);
            wA -= this.m_invIA * b2_math_1.b2Vec2.Cross(this.m_rA, P);
            vB.AddScaled(this.m_invMassB, P);
            wB += this.m_invIB * b2_math_1.b2Vec2.Cross(this.m_rB, P);
          } else {
            this.m_impulse = 0;
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolveVelocityConstraints(data) {
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          if (this.m_minLength < this.m_maxLength) {
            if (this.m_stiffness > 0) {
              const vpA = b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, this.m_rA, temp.vpA);
              const vpB = b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, this.m_rB, temp.vpB);
              const Cdot = b2_math_1.b2Vec2.Dot(this.m_u, b2_math_1.b2Vec2.Subtract(vpB, vpA, temp.vpBA));
              const impulse = -this.m_softMass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse);
              this.m_impulse += impulse;
              const P = b2_math_1.b2Vec2.Scale(impulse, this.m_u, temp.P);
              vA.SubtractScaled(this.m_invMassA, P);
              wA -= this.m_invIA * b2_math_1.b2Vec2.Cross(this.m_rA, P);
              vB.AddScaled(this.m_invMassB, P);
              wB += this.m_invIB * b2_math_1.b2Vec2.Cross(this.m_rB, P);
            }
            {
              const C = this.m_currentLength - this.m_minLength;
              const bias = Math.max(0, C) * data.step.inv_dt;
              const vpA = b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, this.m_rA, temp.vpA);
              const vpB = b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, this.m_rB, temp.vpB);
              const Cdot = b2_math_1.b2Vec2.Dot(this.m_u, b2_math_1.b2Vec2.Subtract(vpB, vpA, temp.vpBA));
              let impulse = -this.m_mass * (Cdot + bias);
              const oldImpulse = this.m_lowerImpulse;
              this.m_lowerImpulse = Math.max(0, this.m_lowerImpulse + impulse);
              impulse = this.m_lowerImpulse - oldImpulse;
              const P = b2_math_1.b2Vec2.Scale(impulse, this.m_u, temp.P);
              vA.SubtractScaled(this.m_invMassA, P);
              wA -= this.m_invIA * b2_math_1.b2Vec2.Cross(this.m_rA, P);
              vB.AddScaled(this.m_invMassB, P);
              wB += this.m_invIB * b2_math_1.b2Vec2.Cross(this.m_rB, P);
            }
            {
              const C = this.m_maxLength - this.m_currentLength;
              const bias = Math.max(0, C) * data.step.inv_dt;
              const vpA = b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, this.m_rA, temp.vpA);
              const vpB = b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, this.m_rB, temp.vpB);
              const Cdot = b2_math_1.b2Vec2.Dot(this.m_u, b2_math_1.b2Vec2.Subtract(vpA, vpB, temp.vpBA));
              let impulse = -this.m_mass * (Cdot + bias);
              const oldImpulse = this.m_upperImpulse;
              this.m_upperImpulse = Math.max(0, this.m_upperImpulse + impulse);
              impulse = this.m_upperImpulse - oldImpulse;
              const P = b2_math_1.b2Vec2.Scale(-impulse, this.m_u, temp.P);
              vA.SubtractScaled(this.m_invMassA, P);
              wA -= this.m_invIA * b2_math_1.b2Vec2.Cross(this.m_rA, P);
              vB.AddScaled(this.m_invMassB, P);
              wB += this.m_invIB * b2_math_1.b2Vec2.Cross(this.m_rB, P);
            }
          } else {
            const vpA = b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, this.m_rA, temp.vpA);
            const vpB = b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, this.m_rB, temp.vpB);
            const Cdot = b2_math_1.b2Vec2.Dot(this.m_u, b2_math_1.b2Vec2.Subtract(vpB, vpA, temp.vpBA));
            const impulse = -this.m_mass * Cdot;
            this.m_impulse += impulse;
            const P = b2_math_1.b2Vec2.Scale(impulse, this.m_u, temp.P);
            vA.SubtractScaled(this.m_invMassA, P);
            wA -= this.m_invIA * b2_math_1.b2Vec2.Cross(this.m_rA, P);
            vB.AddScaled(this.m_invMassB, P);
            wB += this.m_invIB * b2_math_1.b2Vec2.Cross(this.m_rB, P);
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolvePositionConstraints(data) {
          const cA = data.positions[this.m_indexA].c;
          let aA = data.positions[this.m_indexA].a;
          const cB = data.positions[this.m_indexB].c;
          let aB = data.positions[this.m_indexB].a;
          const {qA, qB, lalcA, lalcB, P} = temp;
          qA.Set(aA);
          qB.Set(aB);
          const rA = b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), this.m_rA);
          const rB = b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), this.m_rB);
          this.m_u.x = cB.x + rB.x - cA.x - rA.x;
          this.m_u.y = cB.y + rB.y - cA.y - rA.y;
          const length = this.m_u.Normalize();
          let C;
          if (this.m_minLength === this.m_maxLength) {
            C = length - this.m_minLength;
          } else if (length < this.m_minLength) {
            C = length - this.m_minLength;
          } else if (this.m_maxLength < length) {
            C = length - this.m_maxLength;
          } else {
            return true;
          }
          const impulse = -this.m_mass * C;
          b2_math_1.b2Vec2.Scale(impulse, this.m_u, P);
          cA.SubtractScaled(this.m_invMassA, P);
          aA -= this.m_invIA * b2_math_1.b2Vec2.Cross(rA, P);
          cB.AddScaled(this.m_invMassB, P);
          aB += this.m_invIB * b2_math_1.b2Vec2.Cross(rB, P);
          data.positions[this.m_indexA].a = aA;
          data.positions[this.m_indexB].a = aB;
          return Math.abs(C) < b2_common_1.b2_linearSlop;
        }
        Draw(draw) {
          const {pA, pB, axis, pRest} = temp.Draw;
          const xfA = this.m_bodyA.GetTransform();
          const xfB = this.m_bodyB.GetTransform();
          b2_math_1.b2Transform.MultiplyVec2(xfA, this.m_localAnchorA, pA);
          b2_math_1.b2Transform.MultiplyVec2(xfB, this.m_localAnchorB, pB);
          b2_math_1.b2Vec2.Subtract(pB, pA, axis);
          axis.Normalize();
          draw.DrawSegment(pA, pB, b2_draw_1.debugColors.joint5);
          b2_math_1.b2Vec2.AddScaled(pA, this.m_length, axis, pRest);
          draw.DrawPoint(pRest, 8, b2_draw_1.debugColors.joint1);
          if (this.m_minLength !== this.m_maxLength) {
            if (this.m_minLength > b2_common_1.b2_linearSlop) {
              const pMin = b2_math_1.b2Vec2.AddScaled(pA, this.m_minLength, axis, temp.Draw.p1);
              draw.DrawPoint(pMin, 4, b2_draw_1.debugColors.joint2);
            }
            if (this.m_maxLength < b2_common_1.b2_maxFloat) {
              const pMax = b2_math_1.b2Vec2.AddScaled(pA, this.m_maxLength, axis, temp.Draw.p1);
              draw.DrawPoint(pMax, 4, b2_draw_1.debugColors.joint3);
            }
          }
        }
      };
      exports.b2DistanceJoint = b2DistanceJoint;
    }
  });
  var require_b2_area_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_area_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2AreaJoint = exports.b2AreaJointDef = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_joint_1 = require_b2_joint();
      var b2_distance_joint_1 = require_b2_distance_joint();
      var b2AreaJointDef = class extends b2_joint_1.b2JointDef {
        constructor() {
          super(b2_joint_1.b2JointType.e_areaJoint);
          this.bodies = [];
          this.stiffness = 0;
          this.damping = 0;
        }
        AddBody(body) {
          this.bodies.push(body);
          if (this.bodies.length === 1) {
            this.bodyA = body;
          } else if (this.bodies.length === 2) {
            this.bodyB = body;
          }
        }
      };
      exports.b2AreaJointDef = b2AreaJointDef;
      var b2AreaJoint = class extends b2_joint_1.b2Joint {
        constructor(def) {
          var _a, _b;
          super(def);
          this.m_stiffness = 0;
          this.m_damping = 0;
          this.m_impulse = 0;
          this.m_targetArea = 0;
          this.m_joints = [];
          this.m_delta = new b2_math_1.b2Vec2();
          this.m_bodies = def.bodies;
          this.m_stiffness = (_a = def.stiffness) !== null && _a !== void 0 ? _a : 0;
          this.m_damping = (_b = def.damping) !== null && _b !== void 0 ? _b : 0;
          this.m_targetLengths = (0, b2_common_1.b2MakeNumberArray)(def.bodies.length);
          this.m_normals = (0, b2_common_1.b2MakeArray)(def.bodies.length, b2_math_1.b2Vec2);
          this.m_deltas = (0, b2_common_1.b2MakeArray)(def.bodies.length, b2_math_1.b2Vec2);
          const djd = new b2_distance_joint_1.b2DistanceJointDef();
          djd.stiffness = this.m_stiffness;
          djd.damping = this.m_damping;
          this.m_targetArea = 0;
          for (let i = 0; i < this.m_bodies.length; ++i) {
            const body = this.m_bodies[i];
            const next = this.m_bodies[(i + 1) % this.m_bodies.length];
            const body_c = body.GetWorldCenter();
            const next_c = next.GetWorldCenter();
            this.m_targetLengths[i] = b2_math_1.b2Vec2.Distance(body_c, next_c);
            this.m_targetArea += b2_math_1.b2Vec2.Cross(body_c, next_c);
            djd.Initialize(body, next, body_c, next_c);
            this.m_joints[i] = body.GetWorld().CreateJoint(djd);
          }
          this.m_targetArea *= 0.5;
        }
        GetAnchorA(out) {
          return out;
        }
        GetAnchorB(out) {
          return out;
        }
        GetReactionForce(inv_dt, out) {
          return out;
        }
        GetReactionTorque(_inv_dt) {
          return 0;
        }
        SetStiffness(stiffness) {
          this.m_stiffness = stiffness;
          for (const joint of this.m_joints) {
            joint.SetStiffness(stiffness);
          }
        }
        GetStiffness() {
          return this.m_stiffness;
        }
        SetDamping(damping) {
          this.m_damping = damping;
          for (const joint of this.m_joints) {
            joint.SetDamping(damping);
          }
        }
        GetDamping() {
          return this.m_damping;
        }
        InitVelocityConstraints(data) {
          for (let i = 0; i < this.m_bodies.length; ++i) {
            const prev = this.m_bodies[(i + this.m_bodies.length - 1) % this.m_bodies.length];
            const next = this.m_bodies[(i + 1) % this.m_bodies.length];
            const prev_c = data.positions[prev.m_islandIndex].c;
            const next_c = data.positions[next.m_islandIndex].c;
            const delta = this.m_deltas[i];
            b2_math_1.b2Vec2.Subtract(next_c, prev_c, delta);
          }
          if (data.step.warmStarting) {
            this.m_impulse *= data.step.dtRatio;
            for (let i = 0; i < this.m_bodies.length; ++i) {
              const body = this.m_bodies[i];
              const body_v = data.velocities[body.m_islandIndex].v;
              const delta = this.m_deltas[i];
              body_v.x += body.m_invMass * delta.y * 0.5 * this.m_impulse;
              body_v.y += body.m_invMass * -delta.x * 0.5 * this.m_impulse;
            }
          } else {
            this.m_impulse = 0;
          }
        }
        SolveVelocityConstraints(data) {
          let dotMassSum = 0;
          let crossMassSum = 0;
          for (let i = 0; i < this.m_bodies.length; ++i) {
            const body = this.m_bodies[i];
            const body_v = data.velocities[body.m_islandIndex].v;
            const delta = this.m_deltas[i];
            dotMassSum += delta.LengthSquared() / body.GetMass();
            crossMassSum += b2_math_1.b2Vec2.Cross(body_v, delta);
          }
          const lambda = -2 * crossMassSum / dotMassSum;
          this.m_impulse += lambda;
          for (let i = 0; i < this.m_bodies.length; ++i) {
            const body = this.m_bodies[i];
            const body_v = data.velocities[body.m_islandIndex].v;
            const delta = this.m_deltas[i];
            body_v.x += body.m_invMass * delta.y * 0.5 * lambda;
            body_v.y += body.m_invMass * -delta.x * 0.5 * lambda;
          }
        }
        SolvePositionConstraints(data) {
          let perimeter = 0;
          let area = 0;
          for (let i = 0; i < this.m_bodies.length; ++i) {
            const body = this.m_bodies[i];
            const next = this.m_bodies[(i + 1) % this.m_bodies.length];
            const body_c = data.positions[body.m_islandIndex].c;
            const next_c = data.positions[next.m_islandIndex].c;
            const delta = b2_math_1.b2Vec2.Subtract(next_c, body_c, this.m_delta);
            let dist = delta.Length();
            if (dist < b2_common_1.b2_epsilon) {
              dist = 1;
            }
            this.m_normals[i].x = delta.y / dist;
            this.m_normals[i].y = -delta.x / dist;
            perimeter += dist;
            area += b2_math_1.b2Vec2.Cross(body_c, next_c);
          }
          area *= 0.5;
          const deltaArea = this.m_targetArea - area;
          const toExtrude = 0.5 * deltaArea / perimeter;
          let done = true;
          for (let i = 0; i < this.m_bodies.length; ++i) {
            const body = this.m_bodies[i];
            const body_c = data.positions[body.m_islandIndex].c;
            const next_i = (i + 1) % this.m_bodies.length;
            const delta = b2_math_1.b2Vec2.Add(this.m_normals[i], this.m_normals[next_i], this.m_delta);
            delta.Scale(toExtrude);
            const norm_sq = delta.LengthSquared();
            if (norm_sq > __pow(b2_common_1.b2_maxLinearCorrection, 2)) {
              delta.Scale(b2_common_1.b2_maxLinearCorrection / Math.sqrt(norm_sq));
            }
            if (norm_sq > __pow(b2_common_1.b2_linearSlop, 2)) {
              done = false;
            }
            body_c.Add(delta);
          }
          return done;
        }
      };
      exports.b2AreaJoint = b2AreaJoint;
    }
  });
  var require_b2_friction_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_friction_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2FrictionJoint = exports.b2FrictionJointDef = void 0;
      var b2_math_1 = require_b2_math();
      var b2_joint_1 = require_b2_joint();
      var temp = {
        qA: new b2_math_1.b2Rot(),
        qB: new b2_math_1.b2Rot(),
        lalcA: new b2_math_1.b2Vec2(),
        lalcB: new b2_math_1.b2Vec2(),
        Cdot: new b2_math_1.b2Vec2(),
        impulse: new b2_math_1.b2Vec2(),
        oldImpulse: new b2_math_1.b2Vec2()
      };
      var b2FrictionJointDef = class extends b2_joint_1.b2JointDef {
        constructor() {
          super(b2_joint_1.b2JointType.e_frictionJoint);
          this.localAnchorA = new b2_math_1.b2Vec2();
          this.localAnchorB = new b2_math_1.b2Vec2();
          this.maxForce = 0;
          this.maxTorque = 0;
        }
        Initialize(bA, bB, anchor) {
          this.bodyA = bA;
          this.bodyB = bB;
          this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
          this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
        }
      };
      exports.b2FrictionJointDef = b2FrictionJointDef;
      var b2FrictionJoint = class extends b2_joint_1.b2Joint {
        constructor(def) {
          var _a, _b;
          super(def);
          this.m_localAnchorA = new b2_math_1.b2Vec2();
          this.m_localAnchorB = new b2_math_1.b2Vec2();
          this.m_linearImpulse = new b2_math_1.b2Vec2();
          this.m_angularImpulse = 0;
          this.m_maxForce = 0;
          this.m_maxTorque = 0;
          this.m_indexA = 0;
          this.m_indexB = 0;
          this.m_rA = new b2_math_1.b2Vec2();
          this.m_rB = new b2_math_1.b2Vec2();
          this.m_localCenterA = new b2_math_1.b2Vec2();
          this.m_localCenterB = new b2_math_1.b2Vec2();
          this.m_invMassA = 0;
          this.m_invMassB = 0;
          this.m_invIA = 0;
          this.m_invIB = 0;
          this.m_linearMass = new b2_math_1.b2Mat22();
          this.m_angularMass = 0;
          this.m_localAnchorA.Copy(def.localAnchorA);
          this.m_localAnchorB.Copy(def.localAnchorB);
          this.m_linearImpulse.SetZero();
          this.m_maxForce = (_a = def.maxForce) !== null && _a !== void 0 ? _a : 0;
          this.m_maxTorque = (_b = def.maxTorque) !== null && _b !== void 0 ? _b : 0;
        }
        InitVelocityConstraints(data) {
          this.m_indexA = this.m_bodyA.m_islandIndex;
          this.m_indexB = this.m_bodyB.m_islandIndex;
          this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
          this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
          this.m_invMassA = this.m_bodyA.m_invMass;
          this.m_invMassB = this.m_bodyB.m_invMass;
          this.m_invIA = this.m_bodyA.m_invI;
          this.m_invIB = this.m_bodyB.m_invI;
          const aA = data.positions[this.m_indexA].a;
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const aB = data.positions[this.m_indexB].a;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {qA, qB, lalcA, lalcB} = temp;
          qA.Set(aA);
          qB.Set(aB);
          b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), this.m_rA);
          b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), this.m_rB);
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          const K = this.m_linearMass;
          K.ex.x = mA + mB + iA * this.m_rA.y * this.m_rA.y + iB * this.m_rB.y * this.m_rB.y;
          K.ex.y = -iA * this.m_rA.x * this.m_rA.y - iB * this.m_rB.x * this.m_rB.y;
          K.ey.x = K.ex.y;
          K.ey.y = mA + mB + iA * this.m_rA.x * this.m_rA.x + iB * this.m_rB.x * this.m_rB.x;
          K.Inverse();
          this.m_angularMass = iA + iB;
          if (this.m_angularMass > 0) {
            this.m_angularMass = 1 / this.m_angularMass;
          }
          if (data.step.warmStarting) {
            this.m_linearImpulse.Scale(data.step.dtRatio);
            this.m_angularImpulse *= data.step.dtRatio;
            const P = this.m_linearImpulse;
            vA.SubtractScaled(mA, P);
            wA -= iA * (b2_math_1.b2Vec2.Cross(this.m_rA, P) + this.m_angularImpulse);
            vB.AddScaled(mB, P);
            wB += iB * (b2_math_1.b2Vec2.Cross(this.m_rB, P) + this.m_angularImpulse);
          } else {
            this.m_linearImpulse.SetZero();
            this.m_angularImpulse = 0;
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolveVelocityConstraints(data) {
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          const h = data.step.dt;
          {
            const Cdot = wB - wA;
            let impulse = -this.m_angularMass * Cdot;
            const oldImpulse = this.m_angularImpulse;
            const maxImpulse = h * this.m_maxTorque;
            this.m_angularImpulse = (0, b2_math_1.b2Clamp)(this.m_angularImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_angularImpulse - oldImpulse;
            wA -= iA * impulse;
            wB += iB * impulse;
          }
          {
            const {Cdot, impulse, oldImpulse} = temp;
            b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, this.m_rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, this.m_rA, b2_math_1.b2Vec2.s_t1), Cdot);
            b2_math_1.b2Mat22.MultiplyVec2(this.m_linearMass, Cdot, impulse).Negate();
            oldImpulse.Copy(this.m_linearImpulse);
            this.m_linearImpulse.Add(impulse);
            const maxImpulse = h * this.m_maxForce;
            if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
              this.m_linearImpulse.Normalize();
              this.m_linearImpulse.Scale(maxImpulse);
            }
            b2_math_1.b2Vec2.Subtract(this.m_linearImpulse, oldImpulse, impulse);
            vA.SubtractScaled(mA, impulse);
            wA -= iA * b2_math_1.b2Vec2.Cross(this.m_rA, impulse);
            vB.AddScaled(mB, impulse);
            wB += iB * b2_math_1.b2Vec2.Cross(this.m_rB, impulse);
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolvePositionConstraints(_data) {
          return true;
        }
        GetAnchorA(out) {
          return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        }
        GetAnchorB(out) {
          return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        }
        GetReactionForce(inv_dt, out) {
          out.x = inv_dt * this.m_linearImpulse.x;
          out.y = inv_dt * this.m_linearImpulse.y;
          return out;
        }
        GetReactionTorque(inv_dt) {
          return inv_dt * this.m_angularImpulse;
        }
        GetLocalAnchorA() {
          return this.m_localAnchorA;
        }
        GetLocalAnchorB() {
          return this.m_localAnchorB;
        }
        SetMaxForce(force) {
          this.m_maxForce = force;
        }
        GetMaxForce() {
          return this.m_maxForce;
        }
        SetMaxTorque(torque) {
          this.m_maxTorque = torque;
        }
        GetMaxTorque() {
          return this.m_maxTorque;
        }
      };
      exports.b2FrictionJoint = b2FrictionJoint;
    }
  });
  var require_b2_gear_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_gear_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2GearJoint = exports.b2GearJointDef = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_joint_1 = require_b2_joint();
      var temp = {
        qA: new b2_math_1.b2Rot(),
        qB: new b2_math_1.b2Rot(),
        qC: new b2_math_1.b2Rot(),
        qD: new b2_math_1.b2Rot(),
        lalcA: new b2_math_1.b2Vec2(),
        lalcB: new b2_math_1.b2Vec2(),
        lalcC: new b2_math_1.b2Vec2(),
        lalcD: new b2_math_1.b2Vec2(),
        u: new b2_math_1.b2Vec2(),
        rA: new b2_math_1.b2Vec2(),
        rB: new b2_math_1.b2Vec2(),
        rC: new b2_math_1.b2Vec2(),
        rD: new b2_math_1.b2Vec2(),
        JvAC: new b2_math_1.b2Vec2(),
        JvBD: new b2_math_1.b2Vec2()
      };
      var b2GearJointDef = class extends b2_joint_1.b2JointDef {
        constructor() {
          super(b2_joint_1.b2JointType.e_gearJoint);
          this.ratio = 1;
        }
      };
      exports.b2GearJointDef = b2GearJointDef;
      var b2GearJoint = class extends b2_joint_1.b2Joint {
        constructor(def) {
          var _a;
          super(def);
          this.m_typeA = b2_joint_1.b2JointType.e_unknownJoint;
          this.m_typeB = b2_joint_1.b2JointType.e_unknownJoint;
          this.m_localAnchorA = new b2_math_1.b2Vec2();
          this.m_localAnchorB = new b2_math_1.b2Vec2();
          this.m_localAnchorC = new b2_math_1.b2Vec2();
          this.m_localAnchorD = new b2_math_1.b2Vec2();
          this.m_localAxisC = new b2_math_1.b2Vec2();
          this.m_localAxisD = new b2_math_1.b2Vec2();
          this.m_referenceAngleA = 0;
          this.m_referenceAngleB = 0;
          this.m_constant = 0;
          this.m_ratio = 0;
          this.m_impulse = 0;
          this.m_indexA = 0;
          this.m_indexB = 0;
          this.m_indexC = 0;
          this.m_indexD = 0;
          this.m_lcA = new b2_math_1.b2Vec2();
          this.m_lcB = new b2_math_1.b2Vec2();
          this.m_lcC = new b2_math_1.b2Vec2();
          this.m_lcD = new b2_math_1.b2Vec2();
          this.m_mA = 0;
          this.m_mB = 0;
          this.m_mC = 0;
          this.m_mD = 0;
          this.m_iA = 0;
          this.m_iB = 0;
          this.m_iC = 0;
          this.m_iD = 0;
          this.m_JvAC = new b2_math_1.b2Vec2();
          this.m_JvBD = new b2_math_1.b2Vec2();
          this.m_JwA = 0;
          this.m_JwB = 0;
          this.m_JwC = 0;
          this.m_JwD = 0;
          this.m_mass = 0;
          this.m_joint1 = def.joint1;
          this.m_joint2 = def.joint2;
          this.m_typeA = this.m_joint1.GetType();
          this.m_typeB = this.m_joint2.GetType();
          let coordinateA;
          let coordinateB;
          this.m_bodyC = this.m_joint1.GetBodyA();
          this.m_bodyA = this.m_joint1.GetBodyB();
          const xfA = this.m_bodyA.m_xf;
          const aA = this.m_bodyA.m_sweep.a;
          const xfC = this.m_bodyC.m_xf;
          const aC = this.m_bodyC.m_sweep.a;
          if (this.m_typeA === b2_joint_1.b2JointType.e_revoluteJoint) {
            const revolute = def.joint1;
            this.m_localAnchorC.Copy(revolute.m_localAnchorA);
            this.m_localAnchorA.Copy(revolute.m_localAnchorB);
            this.m_referenceAngleA = revolute.m_referenceAngle;
            this.m_localAxisC.SetZero();
            coordinateA = aA - aC - this.m_referenceAngleA;
          } else {
            const prismatic = def.joint1;
            this.m_localAnchorC.Copy(prismatic.m_localAnchorA);
            this.m_localAnchorA.Copy(prismatic.m_localAnchorB);
            this.m_referenceAngleA = prismatic.m_referenceAngle;
            this.m_localAxisC.Copy(prismatic.m_localXAxisA);
            const pC = this.m_localAnchorC;
            const pA = b2_math_1.b2Rot.TransposeMultiplyVec2(xfC.q, b2_math_1.b2Rot.MultiplyVec2(xfA.q, this.m_localAnchorA, b2_math_1.b2Vec2.s_t0).Add(xfA.p).Subtract(xfC.p), b2_math_1.b2Vec2.s_t0);
            coordinateA = b2_math_1.b2Vec2.Dot(pA.Subtract(pC), this.m_localAxisC);
          }
          this.m_bodyD = this.m_joint2.GetBodyA();
          this.m_bodyB = this.m_joint2.GetBodyB();
          const xfB = this.m_bodyB.m_xf;
          const aB = this.m_bodyB.m_sweep.a;
          const xfD = this.m_bodyD.m_xf;
          const aD = this.m_bodyD.m_sweep.a;
          if (this.m_typeB === b2_joint_1.b2JointType.e_revoluteJoint) {
            const revolute = def.joint2;
            this.m_localAnchorD.Copy(revolute.m_localAnchorA);
            this.m_localAnchorB.Copy(revolute.m_localAnchorB);
            this.m_referenceAngleB = revolute.m_referenceAngle;
            this.m_localAxisD.SetZero();
            coordinateB = aB - aD - this.m_referenceAngleB;
          } else {
            const prismatic = def.joint2;
            this.m_localAnchorD.Copy(prismatic.m_localAnchorA);
            this.m_localAnchorB.Copy(prismatic.m_localAnchorB);
            this.m_referenceAngleB = prismatic.m_referenceAngle;
            this.m_localAxisD.Copy(prismatic.m_localXAxisA);
            const pD = this.m_localAnchorD;
            const pB = b2_math_1.b2Rot.TransposeMultiplyVec2(xfD.q, b2_math_1.b2Rot.MultiplyVec2(xfB.q, this.m_localAnchorB, b2_math_1.b2Vec2.s_t0).Add(xfB.p).Subtract(xfD.p), b2_math_1.b2Vec2.s_t0);
            coordinateB = b2_math_1.b2Vec2.Dot(pB.Subtract(pD), this.m_localAxisD);
          }
          this.m_ratio = (_a = def.ratio) !== null && _a !== void 0 ? _a : 1;
          this.m_constant = coordinateA + this.m_ratio * coordinateB;
          this.m_impulse = 0;
        }
        InitVelocityConstraints(data) {
          this.m_indexA = this.m_bodyA.m_islandIndex;
          this.m_indexB = this.m_bodyB.m_islandIndex;
          this.m_indexC = this.m_bodyC.m_islandIndex;
          this.m_indexD = this.m_bodyD.m_islandIndex;
          this.m_lcA.Copy(this.m_bodyA.m_sweep.localCenter);
          this.m_lcB.Copy(this.m_bodyB.m_sweep.localCenter);
          this.m_lcC.Copy(this.m_bodyC.m_sweep.localCenter);
          this.m_lcD.Copy(this.m_bodyD.m_sweep.localCenter);
          this.m_mA = this.m_bodyA.m_invMass;
          this.m_mB = this.m_bodyB.m_invMass;
          this.m_mC = this.m_bodyC.m_invMass;
          this.m_mD = this.m_bodyD.m_invMass;
          this.m_iA = this.m_bodyA.m_invI;
          this.m_iB = this.m_bodyB.m_invI;
          this.m_iC = this.m_bodyC.m_invI;
          this.m_iD = this.m_bodyD.m_invI;
          const aA = data.positions[this.m_indexA].a;
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const aB = data.positions[this.m_indexB].a;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const aC = data.positions[this.m_indexC].a;
          const vC = data.velocities[this.m_indexC].v;
          let wC = data.velocities[this.m_indexC].w;
          const aD = data.positions[this.m_indexD].a;
          const vD = data.velocities[this.m_indexD].v;
          let wD = data.velocities[this.m_indexD].w;
          const {qA, qB, qC, qD} = temp;
          qA.Set(aA);
          qB.Set(aB);
          qC.Set(aC);
          qD.Set(aD);
          this.m_mass = 0;
          if (this.m_typeA === b2_joint_1.b2JointType.e_revoluteJoint) {
            this.m_JvAC.SetZero();
            this.m_JwA = 1;
            this.m_JwC = 1;
            this.m_mass += this.m_iA + this.m_iC;
          } else {
            const {u, rC, rA, lalcA, lalcC} = temp;
            b2_math_1.b2Rot.MultiplyVec2(qC, this.m_localAxisC, u);
            b2_math_1.b2Rot.MultiplyVec2(qC, b2_math_1.b2Vec2.Subtract(this.m_localAnchorC, this.m_lcC, lalcC), rC);
            b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_lcA, lalcA), rA);
            this.m_JvAC.Copy(u);
            this.m_JwC = b2_math_1.b2Vec2.Cross(rC, u);
            this.m_JwA = b2_math_1.b2Vec2.Cross(rA, u);
            this.m_mass += this.m_mC + this.m_mA + this.m_iC * this.m_JwC * this.m_JwC + this.m_iA * this.m_JwA * this.m_JwA;
          }
          if (this.m_typeB === b2_joint_1.b2JointType.e_revoluteJoint) {
            this.m_JvBD.SetZero();
            this.m_JwB = this.m_ratio;
            this.m_JwD = this.m_ratio;
            this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
          } else {
            const {u, rB, rD, lalcB, lalcD} = temp;
            b2_math_1.b2Rot.MultiplyVec2(qD, this.m_localAxisD, u);
            b2_math_1.b2Rot.MultiplyVec2(qD, b2_math_1.b2Vec2.Subtract(this.m_localAnchorD, this.m_lcD, lalcD), rD);
            b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_lcB, lalcB), rB);
            b2_math_1.b2Vec2.Scale(this.m_ratio, u, this.m_JvBD);
            this.m_JwD = this.m_ratio * b2_math_1.b2Vec2.Cross(rD, u);
            this.m_JwB = this.m_ratio * b2_math_1.b2Vec2.Cross(rB, u);
            this.m_mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * this.m_JwD * this.m_JwD + this.m_iB * this.m_JwB * this.m_JwB;
          }
          this.m_mass = this.m_mass > 0 ? 1 / this.m_mass : 0;
          if (data.step.warmStarting) {
            vA.AddScaled(this.m_mA * this.m_impulse, this.m_JvAC);
            wA += this.m_iA * this.m_impulse * this.m_JwA;
            vB.AddScaled(this.m_mB * this.m_impulse, this.m_JvBD);
            wB += this.m_iB * this.m_impulse * this.m_JwB;
            vC.SubtractScaled(this.m_mC * this.m_impulse, this.m_JvAC);
            wC -= this.m_iC * this.m_impulse * this.m_JwC;
            vD.SubtractScaled(this.m_mD * this.m_impulse, this.m_JvBD);
            wD -= this.m_iD * this.m_impulse * this.m_JwD;
          } else {
            this.m_impulse = 0;
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
          data.velocities[this.m_indexC].w = wC;
          data.velocities[this.m_indexD].w = wD;
        }
        SolveVelocityConstraints(data) {
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const vC = data.velocities[this.m_indexC].v;
          let wC = data.velocities[this.m_indexC].w;
          const vD = data.velocities[this.m_indexD].v;
          let wD = data.velocities[this.m_indexD].w;
          let Cdot = b2_math_1.b2Vec2.Dot(this.m_JvAC, b2_math_1.b2Vec2.Subtract(vA, vC, b2_math_1.b2Vec2.s_t0)) + b2_math_1.b2Vec2.Dot(this.m_JvBD, b2_math_1.b2Vec2.Subtract(vB, vD, b2_math_1.b2Vec2.s_t0));
          Cdot += this.m_JwA * wA - this.m_JwC * wC + (this.m_JwB * wB - this.m_JwD * wD);
          const impulse = -this.m_mass * Cdot;
          this.m_impulse += impulse;
          vA.AddScaled(this.m_mA * impulse, this.m_JvAC);
          wA += this.m_iA * impulse * this.m_JwA;
          vB.AddScaled(this.m_mB * impulse, this.m_JvBD);
          wB += this.m_iB * impulse * this.m_JwB;
          vC.SubtractScaled(this.m_mC * impulse, this.m_JvAC);
          wC -= this.m_iC * impulse * this.m_JwC;
          vD.SubtractScaled(this.m_mD * impulse, this.m_JvBD);
          wD -= this.m_iD * impulse * this.m_JwD;
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
          data.velocities[this.m_indexC].w = wC;
          data.velocities[this.m_indexD].w = wD;
        }
        SolvePositionConstraints(data) {
          const cA = data.positions[this.m_indexA].c;
          let aA = data.positions[this.m_indexA].a;
          const cB = data.positions[this.m_indexB].c;
          let aB = data.positions[this.m_indexB].a;
          const cC = data.positions[this.m_indexC].c;
          let aC = data.positions[this.m_indexC].a;
          const cD = data.positions[this.m_indexD].c;
          let aD = data.positions[this.m_indexD].a;
          const {qA, qB, qC, qD, JvAC, JvBD} = temp;
          qA.Set(aA);
          qB.Set(aB);
          qC.Set(aC);
          qD.Set(aD);
          const linearError = 0;
          let coordinateA;
          let coordinateB;
          let JwA;
          let JwB;
          let JwC;
          let JwD;
          let mass = 0;
          if (this.m_typeA === b2_joint_1.b2JointType.e_revoluteJoint) {
            JvAC.SetZero();
            JwA = 1;
            JwC = 1;
            mass += this.m_iA + this.m_iC;
            coordinateA = aA - aC - this.m_referenceAngleA;
          } else {
            const {u, rC, rA, lalcC, lalcA} = temp;
            b2_math_1.b2Rot.MultiplyVec2(qC, this.m_localAxisC, u);
            b2_math_1.b2Rot.MultiplyVec2(qC, b2_math_1.b2Vec2.Subtract(this.m_localAnchorC, this.m_lcC, lalcC), rC);
            b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_lcA, lalcA), rA);
            JvAC.Copy(u);
            JwC = b2_math_1.b2Vec2.Cross(rC, u);
            JwA = b2_math_1.b2Vec2.Cross(rA, u);
            mass += this.m_mC + this.m_mA + this.m_iC * JwC * JwC + this.m_iA * JwA * JwA;
            const pC = lalcC;
            const pA = b2_math_1.b2Rot.TransposeMultiplyVec2(qC, b2_math_1.b2Vec2.Add(rA, cA, b2_math_1.b2Vec2.s_t0).Subtract(cC), b2_math_1.b2Vec2.s_t0);
            coordinateA = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(pA, pC, b2_math_1.b2Vec2.s_t0), this.m_localAxisC);
          }
          if (this.m_typeB === b2_joint_1.b2JointType.e_revoluteJoint) {
            JvBD.SetZero();
            JwB = this.m_ratio;
            JwD = this.m_ratio;
            mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
            coordinateB = aB - aD - this.m_referenceAngleB;
          } else {
            const {u, rD, rB, lalcD, lalcB} = temp;
            b2_math_1.b2Rot.MultiplyVec2(qD, this.m_localAxisD, u);
            b2_math_1.b2Rot.MultiplyVec2(qD, b2_math_1.b2Vec2.Subtract(this.m_localAnchorD, this.m_lcD, lalcD), rD);
            b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_lcB, lalcB), rB);
            b2_math_1.b2Vec2.Scale(this.m_ratio, u, JvBD);
            JwD = this.m_ratio * b2_math_1.b2Vec2.Cross(rD, u);
            JwB = this.m_ratio * b2_math_1.b2Vec2.Cross(rB, u);
            mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * JwD * JwD + this.m_iB * JwB * JwB;
            const pD = lalcD;
            const pB = b2_math_1.b2Rot.TransposeMultiplyVec2(qD, b2_math_1.b2Vec2.Add(rB, cB, b2_math_1.b2Vec2.s_t0).Subtract(cD), b2_math_1.b2Vec2.s_t0);
            coordinateB = b2_math_1.b2Vec2.Dot(pB.Subtract(pD), this.m_localAxisD);
          }
          const C = coordinateA + this.m_ratio * coordinateB - this.m_constant;
          let impulse = 0;
          if (mass > 0) {
            impulse = -C / mass;
          }
          cA.AddScaled(this.m_mA * impulse, JvAC);
          aA += this.m_iA * impulse * JwA;
          cB.AddScaled(this.m_mB * impulse, JvBD);
          aB += this.m_iB * impulse * JwB;
          cC.SubtractScaled(this.m_mC * impulse, JvAC);
          aC -= this.m_iC * impulse * JwC;
          cD.SubtractScaled(this.m_mD * impulse, JvBD);
          aD -= this.m_iD * impulse * JwD;
          data.positions[this.m_indexA].a = aA;
          data.positions[this.m_indexB].a = aB;
          data.positions[this.m_indexC].a = aC;
          data.positions[this.m_indexD].a = aD;
          return linearError < b2_common_1.b2_linearSlop;
        }
        GetAnchorA(out) {
          return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        }
        GetAnchorB(out) {
          return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        }
        GetReactionForce(inv_dt, out) {
          return b2_math_1.b2Vec2.Scale(inv_dt * this.m_impulse, this.m_JvAC, out);
        }
        GetReactionTorque(inv_dt) {
          return inv_dt * this.m_impulse * this.m_JwA;
        }
        GetJoint1() {
          return this.m_joint1;
        }
        GetJoint2() {
          return this.m_joint2;
        }
        GetRatio() {
          return this.m_ratio;
        }
        SetRatio(ratio) {
          this.m_ratio = ratio;
        }
      };
      exports.b2GearJoint = b2GearJoint;
    }
  });
  var require_b2_motor_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_motor_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2MotorJoint = exports.b2MotorJointDef = void 0;
      var b2_math_1 = require_b2_math();
      var b2_joint_1 = require_b2_joint();
      var temp = {
        qA: new b2_math_1.b2Rot(),
        qB: new b2_math_1.b2Rot(),
        K: new b2_math_1.b2Mat22(),
        Cdot: new b2_math_1.b2Vec2(),
        impulse: new b2_math_1.b2Vec2(),
        oldImpulse: new b2_math_1.b2Vec2()
      };
      var b2MotorJointDef = class extends b2_joint_1.b2JointDef {
        constructor() {
          super(b2_joint_1.b2JointType.e_motorJoint);
          this.linearOffset = new b2_math_1.b2Vec2();
          this.angularOffset = 0;
          this.maxForce = 1;
          this.maxTorque = 1;
          this.correctionFactor = 0.3;
        }
        Initialize(bodyA, bodyB) {
          this.bodyA = bodyA;
          this.bodyB = bodyB;
          this.bodyA.GetLocalPoint(bodyB.GetPosition(), this.linearOffset);
          const angleA = bodyA.GetAngle();
          const angleB = bodyB.GetAngle();
          this.angularOffset = angleB - angleA;
        }
      };
      exports.b2MotorJointDef = b2MotorJointDef;
      var b2MotorJoint = class extends b2_joint_1.b2Joint {
        constructor(def) {
          var _a, _b, _c, _d, _e;
          super(def);
          this.m_linearOffset = new b2_math_1.b2Vec2();
          this.m_linearImpulse = new b2_math_1.b2Vec2();
          this.m_angularImpulse = 0;
          this.m_indexA = 0;
          this.m_indexB = 0;
          this.m_rA = new b2_math_1.b2Vec2();
          this.m_rB = new b2_math_1.b2Vec2();
          this.m_localCenterA = new b2_math_1.b2Vec2();
          this.m_localCenterB = new b2_math_1.b2Vec2();
          this.m_linearError = new b2_math_1.b2Vec2();
          this.m_angularError = 0;
          this.m_invMassA = 0;
          this.m_invMassB = 0;
          this.m_invIA = 0;
          this.m_invIB = 0;
          this.m_linearMass = new b2_math_1.b2Mat22();
          this.m_angularMass = 0;
          this.m_linearOffset.Copy((_a = def.linearOffset) !== null && _a !== void 0 ? _a : b2_math_1.b2Vec2.ZERO);
          this.m_angularOffset = (_b = def.angularOffset) !== null && _b !== void 0 ? _b : 0;
          this.m_linearImpulse.SetZero();
          this.m_maxForce = (_c = def.maxForce) !== null && _c !== void 0 ? _c : 1;
          this.m_maxTorque = (_d = def.maxTorque) !== null && _d !== void 0 ? _d : 1;
          this.m_correctionFactor = (_e = def.correctionFactor) !== null && _e !== void 0 ? _e : 0.3;
        }
        GetAnchorA(out) {
          const pos = this.m_bodyA.GetPosition();
          out.x = pos.x;
          out.y = pos.y;
          return out;
        }
        GetAnchorB(out) {
          const pos = this.m_bodyB.GetPosition();
          out.x = pos.x;
          out.y = pos.y;
          return out;
        }
        GetReactionForce(inv_dt, out) {
          return b2_math_1.b2Vec2.Scale(inv_dt, this.m_linearImpulse, out);
        }
        GetReactionTorque(inv_dt) {
          return inv_dt * this.m_angularImpulse;
        }
        SetLinearOffset(linearOffset) {
          if (!b2_math_1.b2Vec2.Equals(linearOffset, this.m_linearOffset)) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_linearOffset.Copy(linearOffset);
          }
        }
        GetLinearOffset() {
          return this.m_linearOffset;
        }
        SetAngularOffset(angularOffset) {
          if (angularOffset !== this.m_angularOffset) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_angularOffset = angularOffset;
          }
        }
        GetAngularOffset() {
          return this.m_angularOffset;
        }
        SetMaxForce(force) {
          this.m_maxForce = force;
        }
        GetMaxForce() {
          return this.m_maxForce;
        }
        SetMaxTorque(torque) {
          this.m_maxTorque = torque;
        }
        GetMaxTorque() {
          return this.m_maxTorque;
        }
        GetCorrectionFactor() {
          return this.m_correctionFactor;
        }
        SetCorrectionFactor(factor) {
          this.m_correctionFactor = factor;
        }
        InitVelocityConstraints(data) {
          this.m_indexA = this.m_bodyA.m_islandIndex;
          this.m_indexB = this.m_bodyB.m_islandIndex;
          this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
          this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
          this.m_invMassA = this.m_bodyA.m_invMass;
          this.m_invMassB = this.m_bodyB.m_invMass;
          this.m_invIA = this.m_bodyA.m_invI;
          this.m_invIB = this.m_bodyB.m_invI;
          const cA = data.positions[this.m_indexA].c;
          const aA = data.positions[this.m_indexA].a;
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const cB = data.positions[this.m_indexB].c;
          const aB = data.positions[this.m_indexB].a;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {qA, qB} = temp;
          qA.Set(aA);
          qB.Set(aB);
          const rA = b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_linearOffset, this.m_localCenterA, b2_math_1.b2Vec2.s_t0), this.m_rA);
          const rB = b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Negate(this.m_localCenterB, b2_math_1.b2Vec2.s_t0), this.m_rB);
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          const K = this.m_linearMass;
          K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
          K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
          K.ey.x = K.ex.y;
          K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;
          K.Inverse();
          this.m_angularMass = iA + iB;
          if (this.m_angularMass > 0) {
            this.m_angularMass = 1 / this.m_angularMass;
          }
          b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.Add(cB, rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.Add(cA, rA, b2_math_1.b2Vec2.s_t1), this.m_linearError);
          this.m_angularError = aB - aA - this.m_angularOffset;
          if (data.step.warmStarting) {
            this.m_linearImpulse.Scale(data.step.dtRatio);
            this.m_angularImpulse *= data.step.dtRatio;
            const P = this.m_linearImpulse;
            vA.SubtractScaled(mA, P);
            wA -= iA * (b2_math_1.b2Vec2.Cross(rA, P) + this.m_angularImpulse);
            vB.AddScaled(mB, P);
            wB += iB * (b2_math_1.b2Vec2.Cross(rB, P) + this.m_angularImpulse);
          } else {
            this.m_linearImpulse.SetZero();
            this.m_angularImpulse = 0;
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolveVelocityConstraints(data) {
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          const h = data.step.dt;
          const inv_h = data.step.inv_dt;
          {
            const Cdot = wB - wA + inv_h * this.m_correctionFactor * this.m_angularError;
            let impulse = -this.m_angularMass * Cdot;
            const oldImpulse = this.m_angularImpulse;
            const maxImpulse = h * this.m_maxTorque;
            this.m_angularImpulse = (0, b2_math_1.b2Clamp)(this.m_angularImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_angularImpulse - oldImpulse;
            wA -= iA * impulse;
            wB += iB * impulse;
          }
          {
            const {impulse, oldImpulse, Cdot} = temp;
            b2_math_1.b2Vec2.AddScaled(b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, this.m_rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, this.m_rA, b2_math_1.b2Vec2.s_t1), b2_math_1.b2Vec2.s_t2), inv_h * this.m_correctionFactor, this.m_linearError, Cdot);
            b2_math_1.b2Mat22.MultiplyVec2(this.m_linearMass, Cdot, impulse).Negate();
            oldImpulse.Copy(this.m_linearImpulse);
            this.m_linearImpulse.Add(impulse);
            const maxImpulse = h * this.m_maxForce;
            if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
              this.m_linearImpulse.Normalize();
              this.m_linearImpulse.Scale(maxImpulse);
            }
            b2_math_1.b2Vec2.Subtract(this.m_linearImpulse, oldImpulse, impulse);
            vA.SubtractScaled(mA, impulse);
            wA -= iA * b2_math_1.b2Vec2.Cross(this.m_rA, impulse);
            vB.AddScaled(mB, impulse);
            wB += iB * b2_math_1.b2Vec2.Cross(this.m_rB, impulse);
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolvePositionConstraints(_data) {
          return true;
        }
      };
      exports.b2MotorJoint = b2MotorJoint;
    }
  });
  var require_b2_mouse_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_mouse_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2MouseJoint = exports.b2MouseJointDef = void 0;
      var b2_draw_1 = require_b2_draw();
      var b2_math_1 = require_b2_math();
      var b2_joint_1 = require_b2_joint();
      var temp = {
        qB: new b2_math_1.b2Rot(),
        lalcB: new b2_math_1.b2Vec2(),
        Cdot: new b2_math_1.b2Vec2(),
        impulse: new b2_math_1.b2Vec2(),
        oldImpulse: new b2_math_1.b2Vec2(),
        pA: new b2_math_1.b2Vec2(),
        pB: new b2_math_1.b2Vec2()
      };
      var b2MouseJointDef = class extends b2_joint_1.b2JointDef {
        constructor() {
          super(b2_joint_1.b2JointType.e_mouseJoint);
          this.target = new b2_math_1.b2Vec2();
          this.maxForce = 0;
          this.stiffness = 0;
          this.damping = 0;
        }
      };
      exports.b2MouseJointDef = b2MouseJointDef;
      var b2MouseJoint = class extends b2_joint_1.b2Joint {
        constructor(def) {
          var _a, _b, _c, _d;
          super(def);
          this.m_localAnchorB = new b2_math_1.b2Vec2();
          this.m_targetA = new b2_math_1.b2Vec2();
          this.m_stiffness = 0;
          this.m_damping = 0;
          this.m_beta = 0;
          this.m_impulse = new b2_math_1.b2Vec2();
          this.m_maxForce = 0;
          this.m_gamma = 0;
          this.m_indexB = 0;
          this.m_rB = new b2_math_1.b2Vec2();
          this.m_localCenterB = new b2_math_1.b2Vec2();
          this.m_invMassB = 0;
          this.m_invIB = 0;
          this.m_mass = new b2_math_1.b2Mat22();
          this.m_C = new b2_math_1.b2Vec2();
          this.m_targetA.Copy((_a = def.target) !== null && _a !== void 0 ? _a : b2_math_1.b2Vec2.ZERO);
          b2_math_1.b2Transform.TransposeMultiplyVec2(this.m_bodyB.GetTransform(), this.m_targetA, this.m_localAnchorB);
          this.m_maxForce = (_b = def.maxForce) !== null && _b !== void 0 ? _b : 0;
          this.m_stiffness = (_c = def.stiffness) !== null && _c !== void 0 ? _c : 0;
          this.m_damping = (_d = def.damping) !== null && _d !== void 0 ? _d : 0;
          this.m_beta = 0;
          this.m_gamma = 0;
        }
        SetTarget(target) {
          if (!b2_math_1.b2Vec2.Equals(target, this.m_targetA)) {
            this.m_bodyB.SetAwake(true);
            this.m_targetA.Copy(target);
          }
        }
        GetTarget() {
          return this.m_targetA;
        }
        SetMaxForce(force) {
          this.m_maxForce = force;
        }
        GetMaxForce() {
          return this.m_maxForce;
        }
        SetStiffness(stiffness) {
          this.m_stiffness = stiffness;
        }
        GetStiffness() {
          return this.m_stiffness;
        }
        SetDamping(damping) {
          this.m_damping = damping;
        }
        GetDamping() {
          return this.m_damping;
        }
        InitVelocityConstraints(data) {
          this.m_indexB = this.m_bodyB.m_islandIndex;
          this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
          this.m_invMassB = this.m_bodyB.m_invMass;
          this.m_invIB = this.m_bodyB.m_invI;
          const cB = data.positions[this.m_indexB].c;
          const aB = data.positions[this.m_indexB].a;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {qB, lalcB} = temp;
          qB.Set(aB);
          const d = this.m_damping;
          const k = this.m_stiffness;
          const h = data.step.dt;
          this.m_gamma = h * (d + h * k);
          if (this.m_gamma !== 0) {
            this.m_gamma = 1 / this.m_gamma;
          }
          this.m_beta = h * k * this.m_gamma;
          b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), this.m_rB);
          const K = this.m_mass;
          K.ex.x = this.m_invMassB + this.m_invIB * this.m_rB.y * this.m_rB.y + this.m_gamma;
          K.ex.y = -this.m_invIB * this.m_rB.x * this.m_rB.y;
          K.ey.x = K.ex.y;
          K.ey.y = this.m_invMassB + this.m_invIB * this.m_rB.x * this.m_rB.x + this.m_gamma;
          K.Inverse();
          b2_math_1.b2Vec2.Add(cB, this.m_rB, this.m_C).Subtract(this.m_targetA);
          this.m_C.Scale(this.m_beta);
          wB *= 0.98;
          if (data.step.warmStarting) {
            this.m_impulse.Scale(data.step.dtRatio);
            vB.AddScaled(this.m_invMassB, this.m_impulse);
            wB += this.m_invIB * b2_math_1.b2Vec2.Cross(this.m_rB, this.m_impulse);
          } else {
            this.m_impulse.SetZero();
          }
          data.velocities[this.m_indexB].w = wB;
        }
        SolveVelocityConstraints(data) {
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {Cdot, impulse, oldImpulse} = temp;
          b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, this.m_rB, Cdot);
          b2_math_1.b2Mat22.MultiplyVec2(this.m_mass, b2_math_1.b2Vec2.Add(Cdot, this.m_C, impulse).AddScaled(this.m_gamma, this.m_impulse).Negate(), impulse);
          oldImpulse.Copy(this.m_impulse);
          this.m_impulse.Add(impulse);
          const maxImpulse = data.step.dt * this.m_maxForce;
          if (this.m_impulse.LengthSquared() > maxImpulse * maxImpulse) {
            this.m_impulse.Scale(maxImpulse / this.m_impulse.Length());
          }
          b2_math_1.b2Vec2.Subtract(this.m_impulse, oldImpulse, impulse);
          vB.AddScaled(this.m_invMassB, impulse);
          wB += this.m_invIB * b2_math_1.b2Vec2.Cross(this.m_rB, impulse);
          data.velocities[this.m_indexB].w = wB;
        }
        SolvePositionConstraints(_data) {
          return true;
        }
        GetAnchorA(out) {
          out.x = this.m_targetA.x;
          out.y = this.m_targetA.y;
          return out;
        }
        GetAnchorB(out) {
          return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        }
        GetReactionForce(inv_dt, out) {
          return b2_math_1.b2Vec2.Scale(inv_dt, this.m_impulse, out);
        }
        GetReactionTorque(_inv_dt) {
          return 0;
        }
        ShiftOrigin(newOrigin) {
          this.m_targetA.Subtract(newOrigin);
        }
        Draw(draw) {
          const p1 = this.GetAnchorA(temp.pA);
          const p2 = this.GetAnchorB(temp.pB);
          draw.DrawPoint(p1, 4, b2_draw_1.debugColors.joint7);
          draw.DrawPoint(p2, 4, b2_draw_1.debugColors.joint7);
          draw.DrawSegment(p1, p2, b2_draw_1.debugColors.joint8);
        }
      };
      exports.b2MouseJoint = b2MouseJoint;
    }
  });
  var require_b2_prismatic_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_prismatic_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2PrismaticJoint = exports.b2PrismaticJointDef = void 0;
      var b2_common_1 = require_b2_common();
      var b2_draw_1 = require_b2_draw();
      var b2_math_1 = require_b2_math();
      var b2_joint_1 = require_b2_joint();
      var temp = {
        K3: new b2_math_1.b2Mat33(),
        K2: new b2_math_1.b2Mat22(),
        qA: new b2_math_1.b2Rot(),
        qB: new b2_math_1.b2Rot(),
        lalcA: new b2_math_1.b2Vec2(),
        lalcB: new b2_math_1.b2Vec2(),
        rA: new b2_math_1.b2Vec2(),
        rB: new b2_math_1.b2Vec2(),
        GetJointTranslation: {
          pA: new b2_math_1.b2Vec2(),
          pB: new b2_math_1.b2Vec2(),
          d: new b2_math_1.b2Vec2(),
          axis: new b2_math_1.b2Vec2()
        },
        InitVelocityConstraints: {
          d: new b2_math_1.b2Vec2(),
          P: new b2_math_1.b2Vec2()
        },
        SolveVelocityConstraints: {
          P: new b2_math_1.b2Vec2(),
          df: new b2_math_1.b2Vec2()
        },
        SolvePositionConstraints: {
          d: new b2_math_1.b2Vec2(),
          impulse: new b2_math_1.b2Vec3(),
          impulse1: new b2_math_1.b2Vec2(),
          P: new b2_math_1.b2Vec2()
        },
        Draw: {
          p1: new b2_math_1.b2Vec2(),
          p2: new b2_math_1.b2Vec2(),
          pA: new b2_math_1.b2Vec2(),
          pB: new b2_math_1.b2Vec2(),
          axis: new b2_math_1.b2Vec2(),
          lower: new b2_math_1.b2Vec2(),
          upper: new b2_math_1.b2Vec2(),
          perp: new b2_math_1.b2Vec2()
        }
      };
      var b2PrismaticJointDef = class extends b2_joint_1.b2JointDef {
        constructor() {
          super(b2_joint_1.b2JointType.e_prismaticJoint);
          this.localAnchorA = new b2_math_1.b2Vec2();
          this.localAnchorB = new b2_math_1.b2Vec2();
          this.localAxisA = new b2_math_1.b2Vec2(1, 0);
          this.referenceAngle = 0;
          this.enableLimit = false;
          this.lowerTranslation = 0;
          this.upperTranslation = 0;
          this.enableMotor = false;
          this.maxMotorForce = 0;
          this.motorSpeed = 0;
        }
        Initialize(bA, bB, anchor, axis) {
          this.bodyA = bA;
          this.bodyB = bB;
          this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
          this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
          this.bodyA.GetLocalVector(axis, this.localAxisA);
          this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
        }
      };
      exports.b2PrismaticJointDef = b2PrismaticJointDef;
      var b2PrismaticJoint = class extends b2_joint_1.b2Joint {
        constructor(def) {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
          super(def);
          this.m_localAnchorA = new b2_math_1.b2Vec2();
          this.m_localAnchorB = new b2_math_1.b2Vec2();
          this.m_localXAxisA = new b2_math_1.b2Vec2();
          this.m_localYAxisA = new b2_math_1.b2Vec2();
          this.m_referenceAngle = 0;
          this.m_impulse = new b2_math_1.b2Vec2();
          this.m_motorImpulse = 0;
          this.m_lowerImpulse = 0;
          this.m_upperImpulse = 0;
          this.m_lowerTranslation = 0;
          this.m_upperTranslation = 0;
          this.m_maxMotorForce = 0;
          this.m_motorSpeed = 0;
          this.m_enableLimit = false;
          this.m_enableMotor = false;
          this.m_indexA = 0;
          this.m_indexB = 0;
          this.m_localCenterA = new b2_math_1.b2Vec2();
          this.m_localCenterB = new b2_math_1.b2Vec2();
          this.m_invMassA = 0;
          this.m_invMassB = 0;
          this.m_invIA = 0;
          this.m_invIB = 0;
          this.m_axis = new b2_math_1.b2Vec2();
          this.m_perp = new b2_math_1.b2Vec2();
          this.m_s1 = 0;
          this.m_s2 = 0;
          this.m_a1 = 0;
          this.m_a2 = 0;
          this.m_K = new b2_math_1.b2Mat22();
          this.m_translation = 0;
          this.m_axialMass = 0;
          this.m_localAnchorA.Copy((_a = def.localAnchorA) !== null && _a !== void 0 ? _a : b2_math_1.b2Vec2.ZERO);
          this.m_localAnchorB.Copy((_b = def.localAnchorB) !== null && _b !== void 0 ? _b : b2_math_1.b2Vec2.ZERO);
          b2_math_1.b2Vec2.Normalize((_c = def.localAxisA) !== null && _c !== void 0 ? _c : b2_math_1.b2Vec2.UNITX, this.m_localXAxisA);
          b2_math_1.b2Vec2.CrossOneVec2(this.m_localXAxisA, this.m_localYAxisA);
          this.m_referenceAngle = (_d = def.referenceAngle) !== null && _d !== void 0 ? _d : 0;
          this.m_lowerTranslation = (_e = def.lowerTranslation) !== null && _e !== void 0 ? _e : 0;
          this.m_upperTranslation = (_f = def.upperTranslation) !== null && _f !== void 0 ? _f : 0;
          this.m_maxMotorForce = (_g = def.maxMotorForce) !== null && _g !== void 0 ? _g : 0;
          this.m_motorSpeed = (_h = def.motorSpeed) !== null && _h !== void 0 ? _h : 0;
          this.m_enableLimit = (_j = def.enableLimit) !== null && _j !== void 0 ? _j : false;
          this.m_enableMotor = (_k = def.enableMotor) !== null && _k !== void 0 ? _k : false;
        }
        InitVelocityConstraints(data) {
          this.m_indexA = this.m_bodyA.m_islandIndex;
          this.m_indexB = this.m_bodyB.m_islandIndex;
          this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
          this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
          this.m_invMassA = this.m_bodyA.m_invMass;
          this.m_invMassB = this.m_bodyB.m_invMass;
          this.m_invIA = this.m_bodyA.m_invI;
          this.m_invIB = this.m_bodyB.m_invI;
          const cA = data.positions[this.m_indexA].c;
          const aA = data.positions[this.m_indexA].a;
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const cB = data.positions[this.m_indexB].c;
          const aB = data.positions[this.m_indexB].a;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {qA, qB, lalcA, lalcB, rA, rB} = temp;
          qA.Set(aA);
          qB.Set(aB);
          b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), rA);
          b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), rB);
          const d = b2_math_1.b2Vec2.Subtract(cB, cA, temp.InitVelocityConstraints.d).Add(rB).Subtract(rA);
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          b2_math_1.b2Rot.MultiplyVec2(qA, this.m_localXAxisA, this.m_axis);
          this.m_a1 = b2_math_1.b2Vec2.Cross(b2_math_1.b2Vec2.Add(d, rA, b2_math_1.b2Vec2.s_t0), this.m_axis);
          this.m_a2 = b2_math_1.b2Vec2.Cross(rB, this.m_axis);
          this.m_axialMass = mA + mB + iA * this.m_a1 * this.m_a1 + iB * this.m_a2 * this.m_a2;
          if (this.m_axialMass > 0) {
            this.m_axialMass = 1 / this.m_axialMass;
          }
          b2_math_1.b2Rot.MultiplyVec2(qA, this.m_localYAxisA, this.m_perp);
          this.m_s1 = b2_math_1.b2Vec2.Cross(b2_math_1.b2Vec2.Add(d, rA, b2_math_1.b2Vec2.s_t0), this.m_perp);
          this.m_s2 = b2_math_1.b2Vec2.Cross(rB, this.m_perp);
          const k11 = mA + mB + iA * this.m_s1 * this.m_s1 + iB * this.m_s2 * this.m_s2;
          const k12 = iA * this.m_s1 + iB * this.m_s2;
          let k22 = iA + iB;
          if (k22 === 0) {
            k22 = 1;
          }
          this.m_K.ex.Set(k11, k12);
          this.m_K.ey.Set(k12, k22);
          if (this.m_enableLimit) {
            this.m_translation = b2_math_1.b2Vec2.Dot(this.m_axis, d);
          } else {
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
          if (!this.m_enableMotor) {
            this.m_motorImpulse = 0;
          }
          if (data.step.warmStarting) {
            this.m_impulse.Scale(data.step.dtRatio);
            this.m_motorImpulse *= data.step.dtRatio;
            this.m_lowerImpulse *= data.step.dtRatio;
            this.m_upperImpulse *= data.step.dtRatio;
            const axialImpulse = this.m_motorImpulse + this.m_lowerImpulse - this.m_upperImpulse;
            const {P} = temp.InitVelocityConstraints;
            b2_math_1.b2Vec2.Scale(this.m_impulse.x, this.m_perp, P).AddScaled(axialImpulse, this.m_axis);
            const LA = this.m_impulse.x * this.m_s1 + this.m_impulse.y + axialImpulse * this.m_a1;
            const LB = this.m_impulse.x * this.m_s2 + this.m_impulse.y + axialImpulse * this.m_a2;
            vA.SubtractScaled(mA, P);
            wA -= iA * LA;
            vB.AddScaled(mB, P);
            wB += iB * LB;
          } else {
            this.m_impulse.SetZero();
            this.m_motorImpulse = 0;
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolveVelocityConstraints(data) {
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          const {P, df} = temp.SolveVelocityConstraints;
          if (this.m_enableMotor) {
            const Cdot = b2_math_1.b2Vec2.Dot(this.m_axis, b2_math_1.b2Vec2.Subtract(vB, vA, b2_math_1.b2Vec2.s_t0)) + this.m_a2 * wB - this.m_a1 * wA;
            let impulse = this.m_axialMass * (this.m_motorSpeed - Cdot);
            const oldImpulse = this.m_motorImpulse;
            const maxImpulse = data.step.dt * this.m_maxMotorForce;
            this.m_motorImpulse = (0, b2_math_1.b2Clamp)(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_motorImpulse - oldImpulse;
            b2_math_1.b2Vec2.Scale(impulse, this.m_axis, P);
            const LA = impulse * this.m_a1;
            const LB = impulse * this.m_a2;
            vA.SubtractScaled(mA, P);
            wA -= iA * LA;
            vB.AddScaled(mB, P);
            wB += iB * LB;
          }
          if (this.m_enableLimit) {
            {
              const C = this.m_translation - this.m_lowerTranslation;
              const Cdot = b2_math_1.b2Vec2.Dot(this.m_axis, b2_math_1.b2Vec2.Subtract(vB, vA, b2_math_1.b2Vec2.s_t0)) + this.m_a2 * wB - this.m_a1 * wA;
              let impulse = -this.m_axialMass * (Cdot + Math.max(C, 0) * data.step.inv_dt);
              const oldImpulse = this.m_lowerImpulse;
              this.m_lowerImpulse = Math.max(this.m_lowerImpulse + impulse, 0);
              impulse = this.m_lowerImpulse - oldImpulse;
              b2_math_1.b2Vec2.Scale(impulse, this.m_axis, P);
              const LA = impulse * this.m_a1;
              const LB = impulse * this.m_a2;
              vA.SubtractScaled(mA, P);
              wA -= iA * LA;
              vB.AddScaled(mB, P);
              wB += iB * LB;
            }
            {
              const C = this.m_upperTranslation - this.m_translation;
              const Cdot = b2_math_1.b2Vec2.Dot(this.m_axis, b2_math_1.b2Vec2.Subtract(vA, vB, b2_math_1.b2Vec2.s_t0)) + this.m_a1 * wA - this.m_a2 * wB;
              let impulse = -this.m_axialMass * (Cdot + Math.max(C, 0) * data.step.inv_dt);
              const oldImpulse = this.m_upperImpulse;
              this.m_upperImpulse = Math.max(this.m_upperImpulse + impulse, 0);
              impulse = this.m_upperImpulse - oldImpulse;
              b2_math_1.b2Vec2.Scale(impulse, this.m_axis, P);
              const LA = impulse * this.m_a1;
              const LB = impulse * this.m_a2;
              vA.AddScaled(mA, P);
              wA += iA * LA;
              vB.SubtractScaled(mB, P);
              wB -= iB * LB;
            }
          }
          {
            const Cdot_x = b2_math_1.b2Vec2.Dot(this.m_perp, b2_math_1.b2Vec2.Subtract(vB, vA, b2_math_1.b2Vec2.s_t0)) + this.m_s2 * wB - this.m_s1 * wA;
            const Cdot_y = wB - wA;
            this.m_K.Solve(-Cdot_x, -Cdot_y, df);
            this.m_impulse.Add(df);
            b2_math_1.b2Vec2.Scale(df.x, this.m_perp, P);
            const LA = df.x * this.m_s1 + df.y;
            const LB = df.x * this.m_s2 + df.y;
            vA.SubtractScaled(mA, P);
            wA -= iA * LA;
            vB.AddScaled(mB, P);
            wB += iB * LB;
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolvePositionConstraints(data) {
          const cA = data.positions[this.m_indexA].c;
          let aA = data.positions[this.m_indexA].a;
          const cB = data.positions[this.m_indexB].c;
          let aB = data.positions[this.m_indexB].a;
          const {qA, qB, lalcA, lalcB, rA, rB} = temp;
          qA.Set(aA);
          qB.Set(aB);
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          const {d, impulse, P} = temp.SolvePositionConstraints;
          b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), rA);
          b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), rB);
          b2_math_1.b2Vec2.Add(cB, rB, d).Subtract(cA).Subtract(rA);
          const axis = b2_math_1.b2Rot.MultiplyVec2(qA, this.m_localXAxisA, this.m_axis);
          const a1 = b2_math_1.b2Vec2.Cross(b2_math_1.b2Vec2.Add(d, rA, b2_math_1.b2Vec2.s_t0), axis);
          const a2 = b2_math_1.b2Vec2.Cross(rB, axis);
          const perp = b2_math_1.b2Rot.MultiplyVec2(qA, this.m_localYAxisA, this.m_perp);
          const s1 = b2_math_1.b2Vec2.Cross(b2_math_1.b2Vec2.Add(d, rA, b2_math_1.b2Vec2.s_t0), perp);
          const s2 = b2_math_1.b2Vec2.Cross(rB, perp);
          const C1_x = b2_math_1.b2Vec2.Dot(perp, d);
          const C1_y = aB - aA - this.m_referenceAngle;
          let linearError = Math.abs(C1_x);
          const angularError = Math.abs(C1_y);
          let active = false;
          let C2 = 0;
          if (this.m_enableLimit) {
            const translation = b2_math_1.b2Vec2.Dot(axis, d);
            if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * b2_common_1.b2_linearSlop) {
              C2 = translation;
              linearError = Math.max(linearError, Math.abs(translation));
              active = true;
            } else if (translation <= this.m_lowerTranslation) {
              C2 = Math.min(translation - this.m_lowerTranslation, 0);
              linearError = Math.max(linearError, this.m_lowerTranslation - translation);
              active = true;
            } else if (translation >= this.m_upperTranslation) {
              C2 = Math.max(translation - this.m_upperTranslation, 0);
              linearError = Math.max(linearError, translation - this.m_upperTranslation);
              active = true;
            }
          }
          if (active) {
            const k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
            const k12 = iA * s1 + iB * s2;
            const k13 = iA * s1 * a1 + iB * s2 * a2;
            let k22 = iA + iB;
            if (k22 === 0) {
              k22 = 1;
            }
            const k23 = iA * a1 + iB * a2;
            const k33 = mA + mB + iA * a1 * a1 + iB * a2 * a2;
            const K = temp.K3;
            K.ex.Set(k11, k12, k13);
            K.ey.Set(k12, k22, k23);
            K.ez.Set(k13, k23, k33);
            K.Solve33(-C1_x, -C1_y, -C2, impulse);
          } else {
            const k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
            const k12 = iA * s1 + iB * s2;
            let k22 = iA + iB;
            if (k22 === 0) {
              k22 = 1;
            }
            const K = temp.K2;
            K.ex.Set(k11, k12);
            K.ey.Set(k12, k22);
            const impulse1 = K.Solve(-C1_x, -C1_y, temp.SolvePositionConstraints.impulse1);
            impulse.x = impulse1.x;
            impulse.y = impulse1.y;
            impulse.z = 0;
          }
          b2_math_1.b2Vec2.Scale(impulse.x, perp, P).AddScaled(impulse.z, axis);
          const LA = impulse.x * s1 + impulse.y + impulse.z * a1;
          const LB = impulse.x * s2 + impulse.y + impulse.z * a2;
          cA.SubtractScaled(mA, P);
          aA -= iA * LA;
          cB.AddScaled(mB, P);
          aB += iB * LB;
          data.positions[this.m_indexA].a = aA;
          data.positions[this.m_indexB].a = aB;
          return linearError <= b2_common_1.b2_linearSlop && angularError <= b2_common_1.b2_angularSlop;
        }
        GetAnchorA(out) {
          return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        }
        GetAnchorB(out) {
          return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        }
        GetReactionForce(inv_dt, out) {
          const f = this.m_motorImpulse + this.m_lowerImpulse - this.m_upperImpulse;
          out.x = inv_dt * (this.m_impulse.x * this.m_perp.x + f * this.m_axis.x);
          out.y = inv_dt * (this.m_impulse.x * this.m_perp.y + f * this.m_axis.y);
          return out;
        }
        GetReactionTorque(inv_dt) {
          return inv_dt * this.m_impulse.y;
        }
        GetLocalAnchorA() {
          return this.m_localAnchorA;
        }
        GetLocalAnchorB() {
          return this.m_localAnchorB;
        }
        GetLocalAxisA() {
          return this.m_localXAxisA;
        }
        GetReferenceAngle() {
          return this.m_referenceAngle;
        }
        GetJointTranslation() {
          const {pA, pB, axis, d} = temp.GetJointTranslation;
          this.m_bodyA.GetWorldPoint(this.m_localAnchorA, pA);
          this.m_bodyB.GetWorldPoint(this.m_localAnchorB, pB);
          b2_math_1.b2Vec2.Subtract(pB, pA, d);
          this.m_bodyA.GetWorldVector(this.m_localXAxisA, axis);
          const translation = b2_math_1.b2Vec2.Dot(d, axis);
          return translation;
        }
        GetJointSpeed() {
          const bA = this.m_bodyA;
          const bB = this.m_bodyB;
          const {lalcA, lalcB, rA, rB} = temp;
          b2_math_1.b2Rot.MultiplyVec2(bA.m_xf.q, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, bA.m_sweep.localCenter, lalcA), rA);
          b2_math_1.b2Rot.MultiplyVec2(bB.m_xf.q, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, bB.m_sweep.localCenter, lalcB), rB);
          const p1 = b2_math_1.b2Vec2.Add(bA.m_sweep.c, rA, b2_math_1.b2Vec2.s_t0);
          const p2 = b2_math_1.b2Vec2.Add(bB.m_sweep.c, rB, b2_math_1.b2Vec2.s_t1);
          const d = b2_math_1.b2Vec2.Subtract(p2, p1, b2_math_1.b2Vec2.s_t2);
          const axis = b2_math_1.b2Rot.MultiplyVec2(bA.m_xf.q, this.m_localXAxisA, this.m_axis);
          const vA = bA.m_linearVelocity;
          const vB = bB.m_linearVelocity;
          const wA = bA.m_angularVelocity;
          const wB = bB.m_angularVelocity;
          const speed = b2_math_1.b2Vec2.Dot(d, b2_math_1.b2Vec2.CrossScalarVec2(wA, axis, b2_math_1.b2Vec2.s_t0)) + b2_math_1.b2Vec2.Dot(axis, b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, rA, b2_math_1.b2Vec2.s_t1), b2_math_1.b2Vec2.s_t0));
          return speed;
        }
        IsLimitEnabled() {
          return this.m_enableLimit;
        }
        EnableLimit(flag) {
          if (flag !== this.m_enableLimit) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_enableLimit = flag;
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
          return flag;
        }
        GetLowerLimit() {
          return this.m_lowerTranslation;
        }
        GetUpperLimit() {
          return this.m_upperTranslation;
        }
        SetLimits(lower, upper) {
          if (lower !== this.m_lowerTranslation || upper !== this.m_upperTranslation) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_lowerTranslation = lower;
            this.m_upperTranslation = upper;
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
        }
        IsMotorEnabled() {
          return this.m_enableMotor;
        }
        EnableMotor(flag) {
          if (flag !== this.m_enableMotor) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_enableMotor = flag;
          }
          return flag;
        }
        SetMotorSpeed(speed) {
          if (speed !== this.m_motorSpeed) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_motorSpeed = speed;
          }
          return speed;
        }
        GetMotorSpeed() {
          return this.m_motorSpeed;
        }
        SetMaxMotorForce(force) {
          if (force !== this.m_maxMotorForce) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_maxMotorForce = force;
          }
        }
        GetMaxMotorForce() {
          return this.m_maxMotorForce;
        }
        GetMotorForce(inv_dt) {
          return inv_dt * this.m_motorImpulse;
        }
        Draw(draw) {
          const {p1, p2, pA, pB, axis} = temp.Draw;
          const xfA = this.m_bodyA.GetTransform();
          const xfB = this.m_bodyB.GetTransform();
          b2_math_1.b2Transform.MultiplyVec2(xfA, this.m_localAnchorA, pA);
          b2_math_1.b2Transform.MultiplyVec2(xfB, this.m_localAnchorB, pB);
          b2_math_1.b2Rot.MultiplyVec2(xfA.q, this.m_localXAxisA, axis);
          draw.DrawSegment(pA, pB, b2_draw_1.debugColors.joint5);
          if (this.m_enableLimit) {
            const {lower, upper, perp} = temp.Draw;
            b2_math_1.b2Vec2.AddScaled(pA, this.m_lowerTranslation, axis, lower);
            b2_math_1.b2Vec2.AddScaled(pA, this.m_upperTranslation, axis, upper);
            b2_math_1.b2Rot.MultiplyVec2(xfA.q, this.m_localYAxisA, perp);
            draw.DrawSegment(lower, upper, b2_draw_1.debugColors.joint1);
            draw.DrawSegment(b2_math_1.b2Vec2.SubtractScaled(lower, 0.5, perp, p1), b2_math_1.b2Vec2.AddScaled(lower, 0.5, perp, p2), b2_draw_1.debugColors.joint2);
            draw.DrawSegment(b2_math_1.b2Vec2.SubtractScaled(upper, 0.5, perp, p1), b2_math_1.b2Vec2.AddScaled(upper, 0.5, perp, p2), b2_draw_1.debugColors.joint3);
          } else {
            draw.DrawSegment(b2_math_1.b2Vec2.Subtract(pA, axis, p1), b2_math_1.b2Vec2.Add(pA, axis, p2), b2_draw_1.debugColors.joint1);
          }
          draw.DrawPoint(pA, 5, b2_draw_1.debugColors.joint1);
          draw.DrawPoint(pB, 5, b2_draw_1.debugColors.joint4);
        }
      };
      exports.b2PrismaticJoint = b2PrismaticJoint;
    }
  });
  var require_b2_pulley_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_pulley_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2PulleyJoint = exports.b2PulleyJointDef = exports.b2_minPulleyLength = void 0;
      var b2_common_1 = require_b2_common();
      var b2_draw_1 = require_b2_draw();
      var b2_math_1 = require_b2_math();
      var b2_joint_1 = require_b2_joint();
      exports.b2_minPulleyLength = 2;
      var temp = {
        qA: new b2_math_1.b2Rot(),
        qB: new b2_math_1.b2Rot(),
        lalcA: new b2_math_1.b2Vec2(),
        lalcB: new b2_math_1.b2Vec2(),
        p: new b2_math_1.b2Vec2(),
        PA: new b2_math_1.b2Vec2(),
        PB: new b2_math_1.b2Vec2(),
        vpA: new b2_math_1.b2Vec2(),
        vpB: new b2_math_1.b2Vec2(),
        pA: new b2_math_1.b2Vec2(),
        pB: new b2_math_1.b2Vec2()
      };
      var b2PulleyJointDef = class extends b2_joint_1.b2JointDef {
        constructor() {
          super(b2_joint_1.b2JointType.e_pulleyJoint);
          this.groundAnchorA = new b2_math_1.b2Vec2(-1, 1);
          this.groundAnchorB = new b2_math_1.b2Vec2(1, 1);
          this.localAnchorA = new b2_math_1.b2Vec2(-1, 0);
          this.localAnchorB = new b2_math_1.b2Vec2(1, 0);
          this.lengthA = 0;
          this.lengthB = 0;
          this.ratio = 1;
          this.collideConnected = true;
        }
        Initialize(bA, bB, groundA, groundB, anchorA, anchorB, r) {
          this.bodyA = bA;
          this.bodyB = bB;
          this.groundAnchorA.Copy(groundA);
          this.groundAnchorB.Copy(groundB);
          this.bodyA.GetLocalPoint(anchorA, this.localAnchorA);
          this.bodyB.GetLocalPoint(anchorB, this.localAnchorB);
          this.lengthA = b2_math_1.b2Vec2.Distance(anchorA, groundA);
          this.lengthB = b2_math_1.b2Vec2.Distance(anchorB, groundB);
          this.ratio = r;
        }
      };
      exports.b2PulleyJointDef = b2PulleyJointDef;
      var defaultGroundAnchorA = new b2_math_1.b2Vec2(-1, 1);
      var defaultGroundAnchorB = b2_math_1.b2Vec2.UNITX;
      var defaultLocalAnchorA = new b2_math_1.b2Vec2(-1, 0);
      var defaultLocalAnchorB = b2_math_1.b2Vec2.UNITX;
      var b2PulleyJoint = class extends b2_joint_1.b2Joint {
        constructor(def) {
          var _a, _b, _c, _d, _e, _f, _g;
          super(def);
          this.m_groundAnchorA = new b2_math_1.b2Vec2();
          this.m_groundAnchorB = new b2_math_1.b2Vec2();
          this.m_lengthA = 0;
          this.m_lengthB = 0;
          this.m_localAnchorA = new b2_math_1.b2Vec2();
          this.m_localAnchorB = new b2_math_1.b2Vec2();
          this.m_constant = 0;
          this.m_ratio = 0;
          this.m_impulse = 0;
          this.m_indexA = 0;
          this.m_indexB = 0;
          this.m_uA = new b2_math_1.b2Vec2();
          this.m_uB = new b2_math_1.b2Vec2();
          this.m_rA = new b2_math_1.b2Vec2();
          this.m_rB = new b2_math_1.b2Vec2();
          this.m_localCenterA = new b2_math_1.b2Vec2();
          this.m_localCenterB = new b2_math_1.b2Vec2();
          this.m_invMassA = 0;
          this.m_invMassB = 0;
          this.m_invIA = 0;
          this.m_invIB = 0;
          this.m_mass = 0;
          this.m_groundAnchorA.Copy((_a = def.groundAnchorA) !== null && _a !== void 0 ? _a : defaultGroundAnchorA);
          this.m_groundAnchorB.Copy((_b = def.groundAnchorB) !== null && _b !== void 0 ? _b : defaultGroundAnchorB);
          this.m_localAnchorA.Copy((_c = def.localAnchorA) !== null && _c !== void 0 ? _c : defaultLocalAnchorA);
          this.m_localAnchorB.Copy((_d = def.localAnchorB) !== null && _d !== void 0 ? _d : defaultLocalAnchorB);
          this.m_lengthA = (_e = def.lengthA) !== null && _e !== void 0 ? _e : 0;
          this.m_lengthB = (_f = def.lengthB) !== null && _f !== void 0 ? _f : 0;
          this.m_ratio = (_g = def.ratio) !== null && _g !== void 0 ? _g : 1;
          this.m_constant = this.m_lengthA + this.m_ratio * this.m_lengthB;
          this.m_impulse = 0;
        }
        InitVelocityConstraints(data) {
          this.m_indexA = this.m_bodyA.m_islandIndex;
          this.m_indexB = this.m_bodyB.m_islandIndex;
          this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
          this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
          this.m_invMassA = this.m_bodyA.m_invMass;
          this.m_invMassB = this.m_bodyB.m_invMass;
          this.m_invIA = this.m_bodyA.m_invI;
          this.m_invIB = this.m_bodyB.m_invI;
          const cA = data.positions[this.m_indexA].c;
          const aA = data.positions[this.m_indexA].a;
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const cB = data.positions[this.m_indexB].c;
          const aB = data.positions[this.m_indexB].a;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {qA, qB, lalcA, lalcB} = temp;
          qA.Set(aA);
          qB.Set(aB);
          b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), this.m_rA);
          b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), this.m_rB);
          b2_math_1.b2Vec2.Add(cA, this.m_rA, this.m_uA).Subtract(this.m_groundAnchorA);
          b2_math_1.b2Vec2.Add(cB, this.m_rB, this.m_uB).Subtract(this.m_groundAnchorB);
          const lengthA = this.m_uA.Length();
          const lengthB = this.m_uB.Length();
          if (lengthA > 10 * b2_common_1.b2_linearSlop) {
            this.m_uA.Scale(1 / lengthA);
          } else {
            this.m_uA.SetZero();
          }
          if (lengthB > 10 * b2_common_1.b2_linearSlop) {
            this.m_uB.Scale(1 / lengthB);
          } else {
            this.m_uB.SetZero();
          }
          const ruA = b2_math_1.b2Vec2.Cross(this.m_rA, this.m_uA);
          const ruB = b2_math_1.b2Vec2.Cross(this.m_rB, this.m_uB);
          const mA = this.m_invMassA + this.m_invIA * ruA * ruA;
          const mB = this.m_invMassB + this.m_invIB * ruB * ruB;
          this.m_mass = mA + this.m_ratio * this.m_ratio * mB;
          if (this.m_mass > 0) {
            this.m_mass = 1 / this.m_mass;
          }
          if (data.step.warmStarting) {
            this.m_impulse *= data.step.dtRatio;
            const {PA, PB} = temp;
            b2_math_1.b2Vec2.Scale(-this.m_impulse, this.m_uA, PA);
            b2_math_1.b2Vec2.Scale(-this.m_ratio * this.m_impulse, this.m_uB, PB);
            vA.AddScaled(this.m_invMassA, PA);
            wA += this.m_invIA * b2_math_1.b2Vec2.Cross(this.m_rA, PA);
            vB.AddScaled(this.m_invMassB, PB);
            wB += this.m_invIB * b2_math_1.b2Vec2.Cross(this.m_rB, PB);
          } else {
            this.m_impulse = 0;
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolveVelocityConstraints(data) {
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {PA, PB, vpA, vpB} = temp;
          b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, this.m_rA, vpA);
          b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, this.m_rB, vpB);
          const Cdot = -b2_math_1.b2Vec2.Dot(this.m_uA, vpA) - this.m_ratio * b2_math_1.b2Vec2.Dot(this.m_uB, vpB);
          const impulse = -this.m_mass * Cdot;
          this.m_impulse += impulse;
          b2_math_1.b2Vec2.Scale(-impulse, this.m_uA, PA);
          b2_math_1.b2Vec2.Scale(-this.m_ratio * impulse, this.m_uB, PB);
          vA.AddScaled(this.m_invMassA, PA);
          wA += this.m_invIA * b2_math_1.b2Vec2.Cross(this.m_rA, PA);
          vB.AddScaled(this.m_invMassB, PB);
          wB += this.m_invIB * b2_math_1.b2Vec2.Cross(this.m_rB, PB);
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolvePositionConstraints(data) {
          const cA = data.positions[this.m_indexA].c;
          let aA = data.positions[this.m_indexA].a;
          const cB = data.positions[this.m_indexB].c;
          let aB = data.positions[this.m_indexB].a;
          const {qA, qB, lalcA, lalcB, PA, PB} = temp;
          qA.Set(aA);
          qB.Set(aB);
          const rA = b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), this.m_rA);
          const rB = b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), this.m_rB);
          const uA = b2_math_1.b2Vec2.Add(cA, rA, this.m_uA).Subtract(this.m_groundAnchorA);
          const uB = b2_math_1.b2Vec2.Add(cB, rB, this.m_uB).Subtract(this.m_groundAnchorB);
          const lengthA = uA.Length();
          const lengthB = uB.Length();
          if (lengthA > 10 * b2_common_1.b2_linearSlop) {
            uA.Scale(1 / lengthA);
          } else {
            uA.SetZero();
          }
          if (lengthB > 10 * b2_common_1.b2_linearSlop) {
            uB.Scale(1 / lengthB);
          } else {
            uB.SetZero();
          }
          const ruA = b2_math_1.b2Vec2.Cross(rA, uA);
          const ruB = b2_math_1.b2Vec2.Cross(rB, uB);
          const mA = this.m_invMassA + this.m_invIA * ruA * ruA;
          const mB = this.m_invMassB + this.m_invIB * ruB * ruB;
          let mass = mA + this.m_ratio * this.m_ratio * mB;
          if (mass > 0) {
            mass = 1 / mass;
          }
          const C = this.m_constant - lengthA - this.m_ratio * lengthB;
          const linearError = Math.abs(C);
          const impulse = -mass * C;
          b2_math_1.b2Vec2.Scale(-impulse, uA, PA);
          b2_math_1.b2Vec2.Scale(-this.m_ratio * impulse, uB, PB);
          cA.AddScaled(this.m_invMassA, PA);
          aA += this.m_invIA * b2_math_1.b2Vec2.Cross(rA, PA);
          cB.AddScaled(this.m_invMassB, PB);
          aB += this.m_invIB * b2_math_1.b2Vec2.Cross(rB, PB);
          data.positions[this.m_indexA].a = aA;
          data.positions[this.m_indexB].a = aB;
          return linearError < b2_common_1.b2_linearSlop;
        }
        GetAnchorA(out) {
          return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        }
        GetAnchorB(out) {
          return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        }
        GetReactionForce(inv_dt, out) {
          out.x = inv_dt * this.m_impulse * this.m_uB.x;
          out.y = inv_dt * this.m_impulse * this.m_uB.y;
          return out;
        }
        GetReactionTorque(_inv_dt) {
          return 0;
        }
        GetGroundAnchorA() {
          return this.m_groundAnchorA;
        }
        GetGroundAnchorB() {
          return this.m_groundAnchorB;
        }
        GetLengthA() {
          return this.m_lengthA;
        }
        GetLengthB() {
          return this.m_lengthB;
        }
        GetRatio() {
          return this.m_ratio;
        }
        GetCurrentLengthA() {
          const p = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, temp.p);
          const s = this.m_groundAnchorA;
          return b2_math_1.b2Vec2.Distance(p, s);
        }
        GetCurrentLengthB() {
          const p = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, temp.p);
          const s = this.m_groundAnchorB;
          return b2_math_1.b2Vec2.Distance(p, s);
        }
        ShiftOrigin(newOrigin) {
          this.m_groundAnchorA.Subtract(newOrigin);
          this.m_groundAnchorB.Subtract(newOrigin);
        }
        Draw(draw) {
          const p1 = this.GetAnchorA(temp.pA);
          const p2 = this.GetAnchorB(temp.pB);
          const s1 = this.GetGroundAnchorA();
          const s2 = this.GetGroundAnchorB();
          draw.DrawSegment(s1, p1, b2_draw_1.debugColors.joint6);
          draw.DrawSegment(s2, p2, b2_draw_1.debugColors.joint6);
          draw.DrawSegment(s1, s2, b2_draw_1.debugColors.joint6);
        }
      };
      exports.b2PulleyJoint = b2PulleyJoint;
    }
  });
  var require_b2_revolute_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_revolute_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2RevoluteJoint = exports.b2RevoluteJointDef = void 0;
      var b2_common_1 = require_b2_common();
      var b2_draw_1 = require_b2_draw();
      var b2_math_1 = require_b2_math();
      var b2_joint_1 = require_b2_joint();
      var temp = {
        qA: new b2_math_1.b2Rot(),
        qB: new b2_math_1.b2Rot(),
        lalcA: new b2_math_1.b2Vec2(),
        lalcB: new b2_math_1.b2Vec2(),
        P: new b2_math_1.b2Vec2(),
        Cdot: new b2_math_1.b2Vec2(),
        C: new b2_math_1.b2Vec2(),
        impulse: new b2_math_1.b2Vec2(),
        p2: new b2_math_1.b2Vec2(),
        r: new b2_math_1.b2Vec2(),
        pA: new b2_math_1.b2Vec2(),
        pB: new b2_math_1.b2Vec2(),
        rlo: new b2_math_1.b2Vec2(),
        rhi: new b2_math_1.b2Vec2()
      };
      var b2RevoluteJointDef = class extends b2_joint_1.b2JointDef {
        constructor() {
          super(b2_joint_1.b2JointType.e_revoluteJoint);
          this.localAnchorA = new b2_math_1.b2Vec2();
          this.localAnchorB = new b2_math_1.b2Vec2();
          this.referenceAngle = 0;
          this.enableLimit = false;
          this.lowerAngle = 0;
          this.upperAngle = 0;
          this.enableMotor = false;
          this.motorSpeed = 0;
          this.maxMotorTorque = 0;
        }
        Initialize(bA, bB, anchor) {
          this.bodyA = bA;
          this.bodyB = bB;
          this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
          this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
          this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
        }
      };
      exports.b2RevoluteJointDef = b2RevoluteJointDef;
      var b2RevoluteJoint = class extends b2_joint_1.b2Joint {
        constructor(def) {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j;
          super(def);
          this.m_localAnchorA = new b2_math_1.b2Vec2();
          this.m_localAnchorB = new b2_math_1.b2Vec2();
          this.m_impulse = new b2_math_1.b2Vec2();
          this.m_motorImpulse = 0;
          this.m_lowerImpulse = 0;
          this.m_upperImpulse = 0;
          this.m_enableMotor = false;
          this.m_maxMotorTorque = 0;
          this.m_motorSpeed = 0;
          this.m_enableLimit = false;
          this.m_referenceAngle = 0;
          this.m_lowerAngle = 0;
          this.m_upperAngle = 0;
          this.m_indexA = 0;
          this.m_indexB = 0;
          this.m_rA = new b2_math_1.b2Vec2();
          this.m_rB = new b2_math_1.b2Vec2();
          this.m_localCenterA = new b2_math_1.b2Vec2();
          this.m_localCenterB = new b2_math_1.b2Vec2();
          this.m_invMassA = 0;
          this.m_invMassB = 0;
          this.m_invIA = 0;
          this.m_invIB = 0;
          this.m_K = new b2_math_1.b2Mat22();
          this.m_angle = 0;
          this.m_axialMass = 0;
          this.m_localAnchorA.Copy((_a = def.localAnchorA) !== null && _a !== void 0 ? _a : b2_math_1.b2Vec2.ZERO);
          this.m_localAnchorB.Copy((_b = def.localAnchorB) !== null && _b !== void 0 ? _b : b2_math_1.b2Vec2.ZERO);
          this.m_referenceAngle = (_c = def.referenceAngle) !== null && _c !== void 0 ? _c : 0;
          this.m_impulse.SetZero();
          this.m_lowerAngle = (_d = def.lowerAngle) !== null && _d !== void 0 ? _d : 0;
          this.m_upperAngle = (_e = def.upperAngle) !== null && _e !== void 0 ? _e : 0;
          this.m_maxMotorTorque = (_f = def.maxMotorTorque) !== null && _f !== void 0 ? _f : 0;
          this.m_motorSpeed = (_g = def.motorSpeed) !== null && _g !== void 0 ? _g : 0;
          this.m_enableLimit = (_h = def.enableLimit) !== null && _h !== void 0 ? _h : false;
          this.m_enableMotor = (_j = def.enableMotor) !== null && _j !== void 0 ? _j : false;
        }
        InitVelocityConstraints(data) {
          this.m_indexA = this.m_bodyA.m_islandIndex;
          this.m_indexB = this.m_bodyB.m_islandIndex;
          this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
          this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
          this.m_invMassA = this.m_bodyA.m_invMass;
          this.m_invMassB = this.m_bodyB.m_invMass;
          this.m_invIA = this.m_bodyA.m_invI;
          this.m_invIB = this.m_bodyB.m_invI;
          const aA = data.positions[this.m_indexA].a;
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const aB = data.positions[this.m_indexB].a;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {qA, qB, lalcA, lalcB} = temp;
          qA.Set(aA);
          qB.Set(aB);
          b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), this.m_rA);
          b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), this.m_rB);
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          this.m_K.ex.x = mA + mB + this.m_rA.y * this.m_rA.y * iA + this.m_rB.y * this.m_rB.y * iB;
          this.m_K.ey.x = -this.m_rA.y * this.m_rA.x * iA - this.m_rB.y * this.m_rB.x * iB;
          this.m_K.ex.y = this.m_K.ey.x;
          this.m_K.ey.y = mA + mB + this.m_rA.x * this.m_rA.x * iA + this.m_rB.x * this.m_rB.x * iB;
          this.m_axialMass = iA + iB;
          let fixedRotation;
          if (this.m_axialMass > 0) {
            this.m_axialMass = 1 / this.m_axialMass;
            fixedRotation = false;
          } else {
            fixedRotation = true;
          }
          this.m_angle = aB - aA - this.m_referenceAngle;
          if (this.m_enableLimit === false || fixedRotation) {
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
          if (this.m_enableMotor === false || fixedRotation) {
            this.m_motorImpulse = 0;
          }
          if (data.step.warmStarting) {
            this.m_impulse.Scale(data.step.dtRatio);
            this.m_motorImpulse *= data.step.dtRatio;
            this.m_lowerImpulse *= data.step.dtRatio;
            this.m_upperImpulse *= data.step.dtRatio;
            const axialImpulse = this.m_motorImpulse + this.m_lowerImpulse - this.m_upperImpulse;
            const P = temp.P.Set(this.m_impulse.x, this.m_impulse.y);
            vA.SubtractScaled(mA, P);
            wA -= iA * (b2_math_1.b2Vec2.Cross(this.m_rA, P) + axialImpulse);
            vB.AddScaled(mB, P);
            wB += iB * (b2_math_1.b2Vec2.Cross(this.m_rB, P) + axialImpulse);
          } else {
            this.m_impulse.SetZero();
            this.m_motorImpulse = 0;
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolveVelocityConstraints(data) {
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          const fixedRotation = iA + iB === 0;
          if (this.m_enableMotor && !fixedRotation) {
            const Cdot = wB - wA - this.m_motorSpeed;
            let impulse = -this.m_axialMass * Cdot;
            const oldImpulse = this.m_motorImpulse;
            const maxImpulse = data.step.dt * this.m_maxMotorTorque;
            this.m_motorImpulse = (0, b2_math_1.b2Clamp)(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_motorImpulse - oldImpulse;
            wA -= iA * impulse;
            wB += iB * impulse;
          }
          if (this.m_enableLimit && !fixedRotation) {
            {
              const C = this.m_angle - this.m_lowerAngle;
              const Cdot = wB - wA;
              let impulse = -this.m_axialMass * (Cdot + Math.max(C, 0) * data.step.inv_dt);
              const oldImpulse = this.m_lowerImpulse;
              this.m_lowerImpulse = Math.max(this.m_lowerImpulse + impulse, 0);
              impulse = this.m_lowerImpulse - oldImpulse;
              wA -= iA * impulse;
              wB += iB * impulse;
            }
            {
              const C = this.m_upperAngle - this.m_angle;
              const Cdot = wA - wB;
              let impulse = -this.m_axialMass * (Cdot + Math.max(C, 0) * data.step.inv_dt);
              const oldImpulse = this.m_upperImpulse;
              this.m_upperImpulse = Math.max(this.m_upperImpulse + impulse, 0);
              impulse = this.m_upperImpulse - oldImpulse;
              wA += iA * impulse;
              wB -= iB * impulse;
            }
          }
          {
            const {Cdot, impulse} = temp;
            b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, this.m_rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, this.m_rA, b2_math_1.b2Vec2.s_t1), Cdot);
            this.m_K.Solve(-Cdot.x, -Cdot.y, impulse);
            this.m_impulse.x += impulse.x;
            this.m_impulse.y += impulse.y;
            vA.SubtractScaled(mA, impulse);
            wA -= iA * b2_math_1.b2Vec2.Cross(this.m_rA, impulse);
            vB.AddScaled(mB, impulse);
            wB += iB * b2_math_1.b2Vec2.Cross(this.m_rB, impulse);
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolvePositionConstraints(data) {
          const cA = data.positions[this.m_indexA].c;
          let aA = data.positions[this.m_indexA].a;
          const cB = data.positions[this.m_indexB].c;
          let aB = data.positions[this.m_indexB].a;
          const {qA, qB, lalcA, lalcB, impulse} = temp;
          qA.Set(aA);
          qB.Set(aB);
          let angularError = 0;
          let positionError = 0;
          const fixedRotation = this.m_invIA + this.m_invIB === 0;
          if (this.m_enableLimit && !fixedRotation) {
            const angle = aB - aA - this.m_referenceAngle;
            let C = 0;
            if (Math.abs(this.m_upperAngle - this.m_lowerAngle) < 2 * b2_common_1.b2_angularSlop) {
              C = (0, b2_math_1.b2Clamp)(angle - this.m_lowerAngle, -b2_common_1.b2_maxAngularCorrection, b2_common_1.b2_maxAngularCorrection);
            } else if (angle <= this.m_lowerAngle) {
              C = (0, b2_math_1.b2Clamp)(angle - this.m_lowerAngle + b2_common_1.b2_angularSlop, -b2_common_1.b2_maxAngularCorrection, 0);
            } else if (angle >= this.m_upperAngle) {
              C = (0, b2_math_1.b2Clamp)(angle - this.m_upperAngle - b2_common_1.b2_angularSlop, 0, b2_common_1.b2_maxAngularCorrection);
            }
            const limitImpulse = -this.m_axialMass * C;
            aA -= this.m_invIA * limitImpulse;
            aB += this.m_invIB * limitImpulse;
            angularError = Math.abs(C);
          }
          {
            qA.Set(aA);
            qB.Set(aB);
            const rA = b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), this.m_rA);
            const rB = b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), this.m_rB);
            const C = b2_math_1.b2Vec2.Add(cB, rB, temp.C).Subtract(cA).Subtract(rA);
            positionError = C.Length();
            const mA = this.m_invMassA;
            const mB = this.m_invMassB;
            const iA = this.m_invIA;
            const iB = this.m_invIB;
            const K = this.m_K;
            K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
            K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
            K.ey.x = K.ex.y;
            K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;
            K.Solve(C.x, C.y, impulse).Negate();
            cA.SubtractScaled(mA, impulse);
            aA -= iA * b2_math_1.b2Vec2.Cross(rA, impulse);
            cB.AddScaled(mB, impulse);
            aB += iB * b2_math_1.b2Vec2.Cross(rB, impulse);
          }
          data.positions[this.m_indexA].a = aA;
          data.positions[this.m_indexB].a = aB;
          return positionError <= b2_common_1.b2_linearSlop && angularError <= b2_common_1.b2_angularSlop;
        }
        GetAnchorA(out) {
          return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        }
        GetAnchorB(out) {
          return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        }
        GetReactionForce(inv_dt, out) {
          out.x = inv_dt * this.m_impulse.x;
          out.y = inv_dt * this.m_impulse.y;
          return out;
        }
        GetReactionTorque(inv_dt) {
          return inv_dt * (this.m_motorImpulse + this.m_lowerImpulse - this.m_upperImpulse);
        }
        GetLocalAnchorA() {
          return this.m_localAnchorA;
        }
        GetLocalAnchorB() {
          return this.m_localAnchorB;
        }
        GetReferenceAngle() {
          return this.m_referenceAngle;
        }
        GetJointAngle() {
          return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
        }
        GetJointSpeed() {
          return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
        }
        IsMotorEnabled() {
          return this.m_enableMotor;
        }
        EnableMotor(flag) {
          if (flag !== this.m_enableMotor) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_enableMotor = flag;
          }
          return flag;
        }
        GetMotorTorque(inv_dt) {
          return inv_dt * this.m_motorImpulse;
        }
        GetMotorSpeed() {
          return this.m_motorSpeed;
        }
        SetMaxMotorTorque(torque) {
          if (torque !== this.m_maxMotorTorque) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_maxMotorTorque = torque;
          }
        }
        GetMaxMotorTorque() {
          return this.m_maxMotorTorque;
        }
        IsLimitEnabled() {
          return this.m_enableLimit;
        }
        EnableLimit(flag) {
          if (flag !== this.m_enableLimit) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_enableLimit = flag;
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
          return flag;
        }
        GetLowerLimit() {
          return this.m_lowerAngle;
        }
        GetUpperLimit() {
          return this.m_upperAngle;
        }
        SetLimits(lower, upper) {
          if (lower !== this.m_lowerAngle || upper !== this.m_upperAngle) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
            this.m_lowerAngle = lower;
            this.m_upperAngle = upper;
          }
        }
        SetMotorSpeed(speed) {
          if (speed !== this.m_motorSpeed) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_motorSpeed = speed;
          }
          return speed;
        }
        Draw(draw) {
          const {p2, r, pA, pB} = temp;
          const xfA = this.m_bodyA.GetTransform();
          const xfB = this.m_bodyB.GetTransform();
          b2_math_1.b2Transform.MultiplyVec2(xfA, this.m_localAnchorA, pA);
          b2_math_1.b2Transform.MultiplyVec2(xfB, this.m_localAnchorB, pB);
          draw.DrawPoint(pA, 5, b2_draw_1.debugColors.joint4);
          draw.DrawPoint(pB, 5, b2_draw_1.debugColors.joint5);
          const aA = this.m_bodyA.GetAngle();
          const aB = this.m_bodyB.GetAngle();
          const angle = aB - aA - this.m_referenceAngle;
          const L = 0.5;
          r.Set(Math.cos(angle), Math.sin(angle)).Scale(L);
          draw.DrawSegment(pB, b2_math_1.b2Vec2.Add(pB, r, p2), b2_draw_1.debugColors.joint1);
          draw.DrawCircle(pB, L, b2_draw_1.debugColors.joint1);
          if (this.m_enableLimit) {
            const {rlo, rhi} = temp;
            rlo.Set(Math.cos(this.m_lowerAngle), Math.sin(this.m_lowerAngle)).Scale(L);
            rhi.Set(Math.cos(this.m_upperAngle), Math.sin(this.m_upperAngle)).Scale(L);
            draw.DrawSegment(pB, b2_math_1.b2Vec2.Add(pB, rlo, p2), b2_draw_1.debugColors.joint2);
            draw.DrawSegment(pB, b2_math_1.b2Vec2.Add(pB, rhi, p2), b2_draw_1.debugColors.joint3);
          }
          draw.DrawSegment(xfA.p, pA, b2_draw_1.debugColors.joint6);
          draw.DrawSegment(pA, pB, b2_draw_1.debugColors.joint6);
          draw.DrawSegment(xfB.p, pB, b2_draw_1.debugColors.joint6);
        }
      };
      exports.b2RevoluteJoint = b2RevoluteJoint;
    }
  });
  var require_b2_weld_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_weld_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2WeldJoint = exports.b2WeldJointDef = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_joint_1 = require_b2_joint();
      var temp = {
        qA: new b2_math_1.b2Rot(),
        qB: new b2_math_1.b2Rot(),
        rA: new b2_math_1.b2Vec2(),
        rB: new b2_math_1.b2Vec2(),
        lalcA: new b2_math_1.b2Vec2(),
        lalcB: new b2_math_1.b2Vec2(),
        K: new b2_math_1.b2Mat33(),
        P: new b2_math_1.b2Vec2(),
        Cdot1: new b2_math_1.b2Vec3(),
        impulse1: new b2_math_1.b2Vec2(),
        impulse: new b2_math_1.b2Vec3(),
        C1: new b2_math_1.b2Vec2(),
        C: new b2_math_1.b2Vec3()
      };
      var b2WeldJointDef = class extends b2_joint_1.b2JointDef {
        constructor() {
          super(b2_joint_1.b2JointType.e_weldJoint);
          this.localAnchorA = new b2_math_1.b2Vec2();
          this.localAnchorB = new b2_math_1.b2Vec2();
          this.referenceAngle = 0;
          this.stiffness = 0;
          this.damping = 0;
        }
        Initialize(bA, bB, anchor) {
          this.bodyA = bA;
          this.bodyB = bB;
          this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
          this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
          this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
        }
      };
      exports.b2WeldJointDef = b2WeldJointDef;
      var b2WeldJoint = class extends b2_joint_1.b2Joint {
        constructor(def) {
          var _a, _b, _c, _d, _e;
          super(def);
          this.m_stiffness = 0;
          this.m_damping = 0;
          this.m_bias = 0;
          this.m_localAnchorA = new b2_math_1.b2Vec2();
          this.m_localAnchorB = new b2_math_1.b2Vec2();
          this.m_referenceAngle = 0;
          this.m_gamma = 0;
          this.m_impulse = new b2_math_1.b2Vec3();
          this.m_indexA = 0;
          this.m_indexB = 0;
          this.m_rA = new b2_math_1.b2Vec2();
          this.m_rB = new b2_math_1.b2Vec2();
          this.m_localCenterA = new b2_math_1.b2Vec2();
          this.m_localCenterB = new b2_math_1.b2Vec2();
          this.m_invMassA = 0;
          this.m_invMassB = 0;
          this.m_invIA = 0;
          this.m_invIB = 0;
          this.m_mass = new b2_math_1.b2Mat33();
          this.m_localAnchorA.Copy((_a = def.localAnchorA) !== null && _a !== void 0 ? _a : b2_math_1.b2Vec2.ZERO);
          this.m_localAnchorB.Copy((_b = def.localAnchorB) !== null && _b !== void 0 ? _b : b2_math_1.b2Vec2.ZERO);
          this.m_referenceAngle = (_c = def.referenceAngle) !== null && _c !== void 0 ? _c : 0;
          this.m_stiffness = (_d = def.stiffness) !== null && _d !== void 0 ? _d : 0;
          this.m_damping = (_e = def.damping) !== null && _e !== void 0 ? _e : 0;
        }
        InitVelocityConstraints(data) {
          this.m_indexA = this.m_bodyA.m_islandIndex;
          this.m_indexB = this.m_bodyB.m_islandIndex;
          this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
          this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
          this.m_invMassA = this.m_bodyA.m_invMass;
          this.m_invMassB = this.m_bodyB.m_invMass;
          this.m_invIA = this.m_bodyA.m_invI;
          this.m_invIB = this.m_bodyB.m_invI;
          const aA = data.positions[this.m_indexA].a;
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const aB = data.positions[this.m_indexB].a;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {qA, qB, lalcA, lalcB, K} = temp;
          qA.Set(aA);
          qB.Set(aB);
          b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), this.m_rA);
          b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), this.m_rB);
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          K.ex.x = mA + mB + this.m_rA.y * this.m_rA.y * iA + this.m_rB.y * this.m_rB.y * iB;
          K.ey.x = -this.m_rA.y * this.m_rA.x * iA - this.m_rB.y * this.m_rB.x * iB;
          K.ez.x = -this.m_rA.y * iA - this.m_rB.y * iB;
          K.ex.y = K.ey.x;
          K.ey.y = mA + mB + this.m_rA.x * this.m_rA.x * iA + this.m_rB.x * this.m_rB.x * iB;
          K.ez.y = this.m_rA.x * iA + this.m_rB.x * iB;
          K.ex.z = K.ez.x;
          K.ey.z = K.ez.y;
          K.ez.z = iA + iB;
          if (this.m_stiffness > 0) {
            K.GetInverse22(this.m_mass);
            let invM = iA + iB;
            const C = aB - aA - this.m_referenceAngle;
            const d = this.m_damping;
            const k = this.m_stiffness;
            const h = data.step.dt;
            this.m_gamma = h * (d + h * k);
            this.m_gamma = this.m_gamma !== 0 ? 1 / this.m_gamma : 0;
            this.m_bias = C * h * k * this.m_gamma;
            invM += this.m_gamma;
            this.m_mass.ez.z = invM !== 0 ? 1 / invM : 0;
          } else if (K.ez.z === 0) {
            K.GetInverse22(this.m_mass);
            this.m_gamma = 0;
            this.m_bias = 0;
          } else {
            K.GetSymInverse33(this.m_mass);
            this.m_gamma = 0;
            this.m_bias = 0;
          }
          if (data.step.warmStarting) {
            this.m_impulse.Scale(data.step.dtRatio);
            const {P} = temp;
            P.Copy(this.m_impulse);
            vA.SubtractScaled(mA, P);
            wA -= iA * (b2_math_1.b2Vec2.Cross(this.m_rA, P) + this.m_impulse.z);
            vB.AddScaled(mB, P);
            wB += iB * (b2_math_1.b2Vec2.Cross(this.m_rB, P) + this.m_impulse.z);
          } else {
            this.m_impulse.SetZero();
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolveVelocityConstraints(data) {
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          if (this.m_stiffness > 0) {
            const Cdot2 = wB - wA;
            const impulse2 = -this.m_mass.ez.z * (Cdot2 + this.m_bias + this.m_gamma * this.m_impulse.z);
            this.m_impulse.z += impulse2;
            wA -= iA * impulse2;
            wB += iB * impulse2;
            const {Cdot1, impulse1} = temp;
            b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, this.m_rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, this.m_rA, b2_math_1.b2Vec2.s_t1), Cdot1);
            b2_math_1.b2Mat33.MultiplyVec2(this.m_mass, Cdot1, impulse1).Negate();
            this.m_impulse.x += impulse1.x;
            this.m_impulse.y += impulse1.y;
            const P = impulse1;
            vA.SubtractScaled(mA, P);
            wA -= iA * b2_math_1.b2Vec2.Cross(this.m_rA, P);
            vB.AddScaled(mB, P);
            wB += iB * b2_math_1.b2Vec2.Cross(this.m_rB, P);
          } else {
            const {Cdot1, impulse, P} = temp;
            b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, this.m_rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, this.m_rA, b2_math_1.b2Vec2.s_t1), Cdot1);
            Cdot1.z = wB - wA;
            b2_math_1.b2Mat33.MultiplyVec3(this.m_mass, Cdot1, impulse).Negate();
            this.m_impulse.Add(impulse);
            P.Set(impulse.x, impulse.y);
            vA.SubtractScaled(mA, P);
            wA -= iA * (b2_math_1.b2Vec2.Cross(this.m_rA, P) + impulse.z);
            vB.AddScaled(mB, P);
            wB += iB * (b2_math_1.b2Vec2.Cross(this.m_rB, P) + impulse.z);
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolvePositionConstraints(data) {
          const cA = data.positions[this.m_indexA].c;
          let aA = data.positions[this.m_indexA].a;
          const cB = data.positions[this.m_indexB].c;
          let aB = data.positions[this.m_indexB].a;
          const {qA, qB, lalcA, lalcB, K, C1, P, rA, rB} = temp;
          qA.Set(aA);
          qB.Set(aB);
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), rA);
          b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), rB);
          let positionError;
          let angularError;
          K.ex.x = mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB;
          K.ey.x = -rA.y * rA.x * iA - rB.y * rB.x * iB;
          K.ez.x = -rA.y * iA - rB.y * iB;
          K.ex.y = K.ey.x;
          K.ey.y = mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB;
          K.ez.y = rA.x * iA + rB.x * iB;
          K.ex.z = K.ez.x;
          K.ey.z = K.ez.y;
          K.ez.z = iA + iB;
          if (this.m_stiffness > 0) {
            b2_math_1.b2Vec2.Add(cB, rB, C1).Subtract(cA).Subtract(rA);
            positionError = C1.Length();
            angularError = 0;
            K.Solve22(C1.x, C1.y, P).Negate();
            cA.SubtractScaled(mA, P);
            aA -= iA * b2_math_1.b2Vec2.Cross(rA, P);
            cB.AddScaled(mB, P);
            aB += iB * b2_math_1.b2Vec2.Cross(rB, P);
          } else {
            b2_math_1.b2Vec2.Add(cB, rB, C1).Subtract(cA).Subtract(rA);
            b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.Add(cB, rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.Add(cA, rA, b2_math_1.b2Vec2.s_t1), C1);
            const C2 = aB - aA - this.m_referenceAngle;
            positionError = C1.Length();
            angularError = Math.abs(C2);
            const {impulse, C} = temp;
            C.Set(C1.x, C1.y, C2);
            if (K.ez.z > 0) {
              K.Solve33(C.x, C.y, C.z, impulse).Negate();
            } else {
              K.Solve22(C1.x, C1.y, impulse).Negate();
              impulse.z = 0;
            }
            P.Copy(impulse);
            cA.SubtractScaled(mA, P);
            aA -= iA * (b2_math_1.b2Vec2.Cross(rA, P) + impulse.z);
            cB.AddScaled(mB, P);
            aB += iB * (b2_math_1.b2Vec2.Cross(rB, P) + impulse.z);
          }
          data.positions[this.m_indexA].a = aA;
          data.positions[this.m_indexB].a = aB;
          return positionError <= b2_common_1.b2_linearSlop && angularError <= b2_common_1.b2_angularSlop;
        }
        GetAnchorA(out) {
          return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        }
        GetAnchorB(out) {
          return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        }
        GetReactionForce(inv_dt, out) {
          out.x = inv_dt * this.m_impulse.x;
          out.y = inv_dt * this.m_impulse.y;
          return out;
        }
        GetReactionTorque(inv_dt) {
          return inv_dt * this.m_impulse.z;
        }
        GetLocalAnchorA() {
          return this.m_localAnchorA;
        }
        GetLocalAnchorB() {
          return this.m_localAnchorB;
        }
        GetReferenceAngle() {
          return this.m_referenceAngle;
        }
        SetStiffness(stiffness) {
          this.m_stiffness = stiffness;
        }
        GetStiffness() {
          return this.m_stiffness;
        }
        SetDamping(damping) {
          this.m_damping = damping;
        }
        GetDamping() {
          return this.m_damping;
        }
      };
      exports.b2WeldJoint = b2WeldJoint;
    }
  });
  var require_b2_wheel_joint = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_wheel_joint.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2WheelJoint = exports.b2WheelJointDef = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_joint_1 = require_b2_joint();
      var b2_draw_1 = require_b2_draw();
      var temp = {
        qA: new b2_math_1.b2Rot(),
        qB: new b2_math_1.b2Rot(),
        lalcA: new b2_math_1.b2Vec2(),
        lalcB: new b2_math_1.b2Vec2(),
        rA: new b2_math_1.b2Vec2(),
        rB: new b2_math_1.b2Vec2(),
        d: new b2_math_1.b2Vec2(),
        P: new b2_math_1.b2Vec2(),
        ay: new b2_math_1.b2Vec2(),
        pA: new b2_math_1.b2Vec2(),
        pB: new b2_math_1.b2Vec2(),
        axis: new b2_math_1.b2Vec2(),
        Draw: {
          p1: new b2_math_1.b2Vec2(),
          p2: new b2_math_1.b2Vec2(),
          pA: new b2_math_1.b2Vec2(),
          pB: new b2_math_1.b2Vec2(),
          axis: new b2_math_1.b2Vec2(),
          lower: new b2_math_1.b2Vec2(),
          upper: new b2_math_1.b2Vec2(),
          perp: new b2_math_1.b2Vec2()
        }
      };
      var b2WheelJointDef = class extends b2_joint_1.b2JointDef {
        constructor() {
          super(b2_joint_1.b2JointType.e_wheelJoint);
          this.localAnchorA = new b2_math_1.b2Vec2();
          this.localAnchorB = new b2_math_1.b2Vec2();
          this.localAxisA = new b2_math_1.b2Vec2(1, 0);
          this.enableLimit = false;
          this.lowerTranslation = 0;
          this.upperTranslation = 0;
          this.enableMotor = false;
          this.maxMotorTorque = 0;
          this.motorSpeed = 0;
          this.stiffness = 0;
          this.damping = 0;
        }
        Initialize(bA, bB, anchor, axis) {
          this.bodyA = bA;
          this.bodyB = bB;
          this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
          this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
          this.bodyA.GetLocalVector(axis, this.localAxisA);
        }
      };
      exports.b2WheelJointDef = b2WheelJointDef;
      var b2WheelJoint = class extends b2_joint_1.b2Joint {
        constructor(def) {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
          super(def);
          this.m_localAnchorA = new b2_math_1.b2Vec2();
          this.m_localAnchorB = new b2_math_1.b2Vec2();
          this.m_localXAxisA = new b2_math_1.b2Vec2();
          this.m_localYAxisA = new b2_math_1.b2Vec2();
          this.m_impulse = 0;
          this.m_motorImpulse = 0;
          this.m_springImpulse = 0;
          this.m_lowerImpulse = 0;
          this.m_upperImpulse = 0;
          this.m_translation = 0;
          this.m_lowerTranslation = 0;
          this.m_upperTranslation = 0;
          this.m_maxMotorTorque = 0;
          this.m_motorSpeed = 0;
          this.m_enableLimit = false;
          this.m_enableMotor = false;
          this.m_stiffness = 0;
          this.m_damping = 0;
          this.m_indexA = 0;
          this.m_indexB = 0;
          this.m_localCenterA = new b2_math_1.b2Vec2();
          this.m_localCenterB = new b2_math_1.b2Vec2();
          this.m_invMassA = 0;
          this.m_invMassB = 0;
          this.m_invIA = 0;
          this.m_invIB = 0;
          this.m_ax = new b2_math_1.b2Vec2();
          this.m_ay = new b2_math_1.b2Vec2();
          this.m_sAx = 0;
          this.m_sBx = 0;
          this.m_sAy = 0;
          this.m_sBy = 0;
          this.m_mass = 0;
          this.m_motorMass = 0;
          this.m_axialMass = 0;
          this.m_springMass = 0;
          this.m_bias = 0;
          this.m_gamma = 0;
          this.m_localAnchorA.Copy((_a = def.localAnchorA) !== null && _a !== void 0 ? _a : b2_math_1.b2Vec2.ZERO);
          this.m_localAnchorB.Copy((_b = def.localAnchorB) !== null && _b !== void 0 ? _b : b2_math_1.b2Vec2.ZERO);
          this.m_localXAxisA.Copy((_c = def.localAxisA) !== null && _c !== void 0 ? _c : b2_math_1.b2Vec2.UNITX);
          b2_math_1.b2Vec2.CrossOneVec2(this.m_localXAxisA, this.m_localYAxisA);
          this.m_lowerTranslation = (_d = def.lowerTranslation) !== null && _d !== void 0 ? _d : 0;
          this.m_upperTranslation = (_e = def.upperTranslation) !== null && _e !== void 0 ? _e : 0;
          this.m_enableLimit = (_f = def.enableLimit) !== null && _f !== void 0 ? _f : false;
          this.m_maxMotorTorque = (_g = def.maxMotorTorque) !== null && _g !== void 0 ? _g : 0;
          this.m_motorSpeed = (_h = def.motorSpeed) !== null && _h !== void 0 ? _h : 0;
          this.m_enableMotor = (_j = def.enableMotor) !== null && _j !== void 0 ? _j : false;
          this.m_ax.SetZero();
          this.m_ay.SetZero();
          this.m_stiffness = (_k = def.stiffness) !== null && _k !== void 0 ? _k : 0;
          this.m_damping = (_l = def.damping) !== null && _l !== void 0 ? _l : 0;
        }
        GetMotorSpeed() {
          return this.m_motorSpeed;
        }
        GetMaxMotorTorque() {
          return this.m_maxMotorTorque;
        }
        SetStiffness(stiffness) {
          this.m_stiffness = stiffness;
        }
        GetStiffness() {
          return this.m_stiffness;
        }
        SetDamping(damping) {
          this.m_damping = damping;
        }
        GetDamping() {
          return this.m_damping;
        }
        InitVelocityConstraints(data) {
          this.m_indexA = this.m_bodyA.m_islandIndex;
          this.m_indexB = this.m_bodyB.m_islandIndex;
          this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
          this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
          this.m_invMassA = this.m_bodyA.m_invMass;
          this.m_invMassB = this.m_bodyB.m_invMass;
          this.m_invIA = this.m_bodyA.m_invI;
          this.m_invIB = this.m_bodyB.m_invI;
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          const cA = data.positions[this.m_indexA].c;
          const aA = data.positions[this.m_indexA].a;
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const cB = data.positions[this.m_indexB].c;
          const aB = data.positions[this.m_indexB].a;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {qA, qB, lalcA, lalcB, rA, rB, d} = temp;
          qA.Set(aA);
          qB.Set(aB);
          b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), rA);
          b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), rB);
          b2_math_1.b2Vec2.Add(cB, rB, d).Subtract(cA).Subtract(rA);
          b2_math_1.b2Rot.MultiplyVec2(qA, this.m_localYAxisA, this.m_ay);
          this.m_sAy = b2_math_1.b2Vec2.Cross(b2_math_1.b2Vec2.Add(d, rA, b2_math_1.b2Vec2.s_t0), this.m_ay);
          this.m_sBy = b2_math_1.b2Vec2.Cross(rB, this.m_ay);
          this.m_mass = mA + mB + iA * this.m_sAy * this.m_sAy + iB * this.m_sBy * this.m_sBy;
          if (this.m_mass > 0) {
            this.m_mass = 1 / this.m_mass;
          }
          b2_math_1.b2Rot.MultiplyVec2(qA, this.m_localXAxisA, this.m_ax);
          this.m_sAx = b2_math_1.b2Vec2.Cross(b2_math_1.b2Vec2.Add(d, rA, b2_math_1.b2Vec2.s_t0), this.m_ax);
          this.m_sBx = b2_math_1.b2Vec2.Cross(rB, this.m_ax);
          const invMass = mA + mB + iA * this.m_sAx * this.m_sAx + iB * this.m_sBx * this.m_sBx;
          if (invMass > 0) {
            this.m_axialMass = 1 / invMass;
          } else {
            this.m_axialMass = 0;
          }
          this.m_springMass = 0;
          this.m_bias = 0;
          this.m_gamma = 0;
          if (this.m_stiffness > 0 && invMass > 0) {
            this.m_springMass = 1 / invMass;
            const C = b2_math_1.b2Vec2.Dot(d, this.m_ax);
            const h = data.step.dt;
            this.m_gamma = h * (this.m_damping + h * this.m_stiffness);
            if (this.m_gamma > 0) {
              this.m_gamma = 1 / this.m_gamma;
            }
            this.m_bias = C * h * this.m_stiffness * this.m_gamma;
            this.m_springMass = invMass + this.m_gamma;
            if (this.m_springMass > 0) {
              this.m_springMass = 1 / this.m_springMass;
            }
          } else {
            this.m_springImpulse = 0;
          }
          if (this.m_enableLimit) {
            this.m_translation = b2_math_1.b2Vec2.Dot(this.m_ax, d);
          } else {
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
          if (this.m_enableMotor) {
            this.m_motorMass = iA + iB;
            if (this.m_motorMass > 0) {
              this.m_motorMass = 1 / this.m_motorMass;
            }
          } else {
            this.m_motorMass = 0;
            this.m_motorImpulse = 0;
          }
          if (data.step.warmStarting) {
            this.m_impulse *= data.step.dtRatio;
            this.m_springImpulse *= data.step.dtRatio;
            this.m_motorImpulse *= data.step.dtRatio;
            const axialImpulse = this.m_springImpulse + this.m_lowerImpulse - this.m_upperImpulse;
            const {P} = temp;
            b2_math_1.b2Vec2.Scale(this.m_impulse, this.m_ay, P).AddScaled(axialImpulse, this.m_ax);
            const LA = this.m_impulse * this.m_sAy + axialImpulse * this.m_sAx + this.m_motorImpulse;
            const LB = this.m_impulse * this.m_sBy + axialImpulse * this.m_sBx + this.m_motorImpulse;
            vA.SubtractScaled(this.m_invMassA, P);
            wA -= this.m_invIA * LA;
            vB.AddScaled(this.m_invMassB, P);
            wB += this.m_invIB * LB;
          } else {
            this.m_impulse = 0;
            this.m_springImpulse = 0;
            this.m_motorImpulse = 0;
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolveVelocityConstraints(data) {
          const mA = this.m_invMassA;
          const mB = this.m_invMassB;
          const iA = this.m_invIA;
          const iB = this.m_invIB;
          const vA = data.velocities[this.m_indexA].v;
          let wA = data.velocities[this.m_indexA].w;
          const vB = data.velocities[this.m_indexB].v;
          let wB = data.velocities[this.m_indexB].w;
          const {P} = temp;
          {
            const Cdot = b2_math_1.b2Vec2.Dot(this.m_ax, b2_math_1.b2Vec2.Subtract(vB, vA, b2_math_1.b2Vec2.s_t0)) + this.m_sBx * wB - this.m_sAx * wA;
            const impulse = -this.m_springMass * (Cdot + this.m_bias + this.m_gamma * this.m_springImpulse);
            this.m_springImpulse += impulse;
            b2_math_1.b2Vec2.Scale(impulse, this.m_ax, P);
            const LA = impulse * this.m_sAx;
            const LB = impulse * this.m_sBx;
            vA.SubtractScaled(mA, P);
            wA -= iA * LA;
            vB.AddScaled(mB, P);
            wB += iB * LB;
          }
          {
            const Cdot = wB - wA - this.m_motorSpeed;
            let impulse = -this.m_motorMass * Cdot;
            const oldImpulse = this.m_motorImpulse;
            const maxImpulse = data.step.dt * this.m_maxMotorTorque;
            this.m_motorImpulse = (0, b2_math_1.b2Clamp)(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_motorImpulse - oldImpulse;
            wA -= iA * impulse;
            wB += iB * impulse;
          }
          if (this.m_enableLimit) {
            {
              const C = this.m_translation - this.m_lowerTranslation;
              const Cdot = b2_math_1.b2Vec2.Dot(this.m_ax, b2_math_1.b2Vec2.Subtract(vB, vA, b2_math_1.b2Vec2.s_t0)) + this.m_sBx * wB - this.m_sAx * wA;
              let impulse = -this.m_axialMass * (Cdot + Math.max(C, 0) * data.step.inv_dt);
              const oldImpulse = this.m_lowerImpulse;
              this.m_lowerImpulse = Math.max(this.m_lowerImpulse + impulse, 0);
              impulse = this.m_lowerImpulse - oldImpulse;
              b2_math_1.b2Vec2.Scale(impulse, this.m_ax, P);
              const LA = impulse * this.m_sAx;
              const LB = impulse * this.m_sBx;
              vA.SubtractScaled(mA, P);
              wA -= iA * LA;
              vB.AddScaled(mB, P);
              wB += iB * LB;
            }
            {
              const C = this.m_upperTranslation - this.m_translation;
              const Cdot = b2_math_1.b2Vec2.Dot(this.m_ax, b2_math_1.b2Vec2.Subtract(vA, vB, b2_math_1.b2Vec2.s_t0)) + this.m_sAx * wA - this.m_sBx * wB;
              let impulse = -this.m_axialMass * (Cdot + Math.max(C, 0) * data.step.inv_dt);
              const oldImpulse = this.m_upperImpulse;
              this.m_upperImpulse = Math.max(this.m_upperImpulse + impulse, 0);
              impulse = this.m_upperImpulse - oldImpulse;
              b2_math_1.b2Vec2.Scale(impulse, this.m_ax, P);
              const LA = impulse * this.m_sAx;
              const LB = impulse * this.m_sBx;
              vA.AddScaled(mA, P);
              wA += iA * LA;
              vB.SubtractScaled(mB, P);
              wB -= iB * LB;
            }
          }
          {
            const Cdot = b2_math_1.b2Vec2.Dot(this.m_ay, b2_math_1.b2Vec2.Subtract(vB, vA, b2_math_1.b2Vec2.s_t0)) + this.m_sBy * wB - this.m_sAy * wA;
            const impulse = -this.m_mass * Cdot;
            this.m_impulse += impulse;
            b2_math_1.b2Vec2.Scale(impulse, this.m_ay, P);
            const LA = impulse * this.m_sAy;
            const LB = impulse * this.m_sBy;
            vA.SubtractScaled(mA, P);
            wA -= iA * LA;
            vB.AddScaled(mB, P);
            wB += iB * LB;
          }
          data.velocities[this.m_indexA].w = wA;
          data.velocities[this.m_indexB].w = wB;
        }
        SolvePositionConstraints(data) {
          const cA = data.positions[this.m_indexA].c;
          let aA = data.positions[this.m_indexA].a;
          const cB = data.positions[this.m_indexB].c;
          let aB = data.positions[this.m_indexB].a;
          let linearError = 0;
          const {qA, qB, lalcA, lalcB, rA, rB, d, P, ay} = temp;
          if (this.m_enableLimit) {
            qA.Set(aA);
            qB.Set(aB);
            b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), rA);
            b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), rB);
            b2_math_1.b2Vec2.Subtract(cB, cA, d).Add(rB).Subtract(rA);
            const ax = b2_math_1.b2Rot.MultiplyVec2(qA, this.m_localXAxisA, this.m_ax);
            const sAx = b2_math_1.b2Vec2.Cross(b2_math_1.b2Vec2.Add(d, rA, b2_math_1.b2Vec2.s_t0), this.m_ax);
            const sBx = b2_math_1.b2Vec2.Cross(rB, this.m_ax);
            let C = 0;
            const translation = b2_math_1.b2Vec2.Dot(ax, d);
            if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * b2_common_1.b2_linearSlop) {
              C = translation;
            } else if (translation <= this.m_lowerTranslation) {
              C = Math.min(translation - this.m_lowerTranslation, 0);
            } else if (translation >= this.m_upperTranslation) {
              C = Math.max(translation - this.m_upperTranslation, 0);
            }
            if (C !== 0) {
              const invMass = this.m_invMassA + this.m_invMassB + this.m_invIA * sAx * sAx + this.m_invIB * sBx * sBx;
              let impulse = 0;
              if (invMass !== 0) {
                impulse = -C / invMass;
              }
              b2_math_1.b2Vec2.Scale(impulse, ax, P);
              const LA = impulse * sAx;
              const LB = impulse * sBx;
              cA.SubtractScaled(this.m_invMassA, P);
              aA -= this.m_invIA * LA;
              cB.AddScaled(this.m_invMassB, P);
              aB += this.m_invIB * LB;
              linearError = Math.abs(C);
            }
          }
          {
            qA.Set(aA);
            qB.Set(aB);
            b2_math_1.b2Rot.MultiplyVec2(qA, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA, lalcA), rA);
            b2_math_1.b2Rot.MultiplyVec2(qB, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB, lalcB), rB);
            b2_math_1.b2Vec2.Subtract(cB, cA, d).Add(rB).Subtract(rA);
            b2_math_1.b2Rot.MultiplyVec2(qA, this.m_localYAxisA, ay);
            const sAy = b2_math_1.b2Vec2.Cross(b2_math_1.b2Vec2.Add(d, rA, b2_math_1.b2Vec2.s_t0), ay);
            const sBy = b2_math_1.b2Vec2.Cross(rB, ay);
            const C = b2_math_1.b2Vec2.Dot(d, ay);
            const invMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_sAy * this.m_sAy + this.m_invIB * this.m_sBy * this.m_sBy;
            let impulse = 0;
            if (invMass !== 0) {
              impulse = -C / invMass;
            }
            b2_math_1.b2Vec2.Scale(impulse, ay, P);
            const LA = impulse * sAy;
            const LB = impulse * sBy;
            cA.SubtractScaled(this.m_invMassA, P);
            aA -= this.m_invIA * LA;
            cB.AddScaled(this.m_invMassB, P);
            aB += this.m_invIB * LB;
            linearError = Math.max(linearError, Math.abs(C));
          }
          data.positions[this.m_indexA].a = aA;
          data.positions[this.m_indexB].a = aB;
          return linearError <= b2_common_1.b2_linearSlop;
        }
        GetAnchorA(out) {
          return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        }
        GetAnchorB(out) {
          return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        }
        GetReactionForce(inv_dt, out) {
          const f = this.m_springImpulse + this.m_lowerImpulse - this.m_upperImpulse;
          out.x = inv_dt * (this.m_impulse * this.m_ay.x + f * this.m_ax.x);
          out.y = inv_dt * (this.m_impulse * this.m_ay.y + f * this.m_ax.y);
          return out;
        }
        GetReactionTorque(inv_dt) {
          return inv_dt * this.m_motorImpulse;
        }
        GetLocalAnchorA() {
          return this.m_localAnchorA;
        }
        GetLocalAnchorB() {
          return this.m_localAnchorB;
        }
        GetLocalAxisA() {
          return this.m_localXAxisA;
        }
        GetJointTranslation() {
          const bA = this.m_bodyA;
          const bB = this.m_bodyB;
          const {pA, pB, d, axis} = temp;
          bA.GetWorldPoint(this.m_localAnchorA, pA);
          bB.GetWorldPoint(this.m_localAnchorB, pB);
          b2_math_1.b2Vec2.Subtract(pB, pA, d);
          bA.GetWorldVector(this.m_localXAxisA, axis);
          const translation = b2_math_1.b2Vec2.Dot(d, axis);
          return translation;
        }
        GetJointLinearSpeed() {
          const bA = this.m_bodyA;
          const bB = this.m_bodyB;
          const {rA, rB, lalcA, lalcB, axis} = temp;
          b2_math_1.b2Rot.MultiplyVec2(bA.m_xf.q, b2_math_1.b2Vec2.Subtract(this.m_localAnchorA, bA.m_sweep.localCenter, lalcA), rA);
          b2_math_1.b2Rot.MultiplyVec2(bB.m_xf.q, b2_math_1.b2Vec2.Subtract(this.m_localAnchorB, bB.m_sweep.localCenter, lalcB), rB);
          const p1 = b2_math_1.b2Vec2.Add(bA.m_sweep.c, rA, b2_math_1.b2Vec2.s_t0);
          const p2 = b2_math_1.b2Vec2.Add(bB.m_sweep.c, rB, b2_math_1.b2Vec2.s_t1);
          const d = b2_math_1.b2Vec2.Subtract(p2, p1, b2_math_1.b2Vec2.s_t2);
          b2_math_1.b2Rot.MultiplyVec2(bA.m_xf.q, this.m_localXAxisA, axis);
          const vA = bA.m_linearVelocity;
          const vB = bB.m_linearVelocity;
          const wA = bA.m_angularVelocity;
          const wB = bB.m_angularVelocity;
          const speed = b2_math_1.b2Vec2.Dot(d, b2_math_1.b2Vec2.CrossScalarVec2(wA, axis, b2_math_1.b2Vec2.s_t0)) + b2_math_1.b2Vec2.Dot(axis, b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, rB, b2_math_1.b2Vec2.s_t0).Subtract(vA).Subtract(b2_math_1.b2Vec2.CrossScalarVec2(wA, rA, b2_math_1.b2Vec2.s_t1)));
          return speed;
        }
        GetJointAngle() {
          return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a;
        }
        GetJointAngularSpeed() {
          const wA = this.m_bodyA.m_angularVelocity;
          const wB = this.m_bodyB.m_angularVelocity;
          return wB - wA;
        }
        IsMotorEnabled() {
          return this.m_enableMotor;
        }
        EnableMotor(flag) {
          if (flag !== this.m_enableMotor) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_enableMotor = flag;
          }
          return flag;
        }
        SetMotorSpeed(speed) {
          if (speed !== this.m_motorSpeed) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_motorSpeed = speed;
          }
          return speed;
        }
        SetMaxMotorTorque(torque) {
          if (torque !== this.m_maxMotorTorque) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_maxMotorTorque = torque;
          }
        }
        GetMotorTorque(inv_dt) {
          return inv_dt * this.m_motorImpulse;
        }
        IsLimitEnabled() {
          return this.m_enableLimit;
        }
        EnableLimit(flag) {
          if (flag !== this.m_enableLimit) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_enableLimit = flag;
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
          return flag;
        }
        GetLowerLimit() {
          return this.m_lowerTranslation;
        }
        GetUpperLimit() {
          return this.m_upperTranslation;
        }
        SetLimits(lower, upper) {
          if (lower !== this.m_lowerTranslation || upper !== this.m_upperTranslation) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_lowerTranslation = lower;
            this.m_upperTranslation = upper;
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
          }
        }
        Draw(draw) {
          const {p1, p2, pA, pB, axis} = temp.Draw;
          const xfA = this.m_bodyA.GetTransform();
          const xfB = this.m_bodyB.GetTransform();
          b2_math_1.b2Transform.MultiplyVec2(xfA, this.m_localAnchorA, pA);
          b2_math_1.b2Transform.MultiplyVec2(xfB, this.m_localAnchorB, pB);
          b2_math_1.b2Rot.MultiplyVec2(xfA.q, this.m_localXAxisA, axis);
          draw.DrawSegment(pA, pB, b2_draw_1.debugColors.joint5);
          if (this.m_enableLimit) {
            const {lower, upper, perp} = temp.Draw;
            b2_math_1.b2Vec2.AddScaled(pA, this.m_lowerTranslation, axis, lower);
            b2_math_1.b2Vec2.AddScaled(pA, this.m_upperTranslation, axis, upper);
            b2_math_1.b2Rot.MultiplyVec2(xfA.q, this.m_localYAxisA, perp);
            draw.DrawSegment(lower, upper, b2_draw_1.debugColors.joint1);
            draw.DrawSegment(b2_math_1.b2Vec2.SubtractScaled(lower, 0.5, perp, p1), b2_math_1.b2Vec2.AddScaled(lower, 0.5, perp, p2), b2_draw_1.debugColors.joint2);
            draw.DrawSegment(b2_math_1.b2Vec2.SubtractScaled(upper, 0.5, perp, p1), b2_math_1.b2Vec2.AddScaled(upper, 0.5, perp, p2), b2_draw_1.debugColors.joint3);
          } else {
            draw.DrawSegment(b2_math_1.b2Vec2.Subtract(pA, axis, p1), b2_math_1.b2Vec2.Add(pA, axis, p2), b2_draw_1.debugColors.joint1);
          }
          draw.DrawPoint(pA, 5, b2_draw_1.debugColors.joint1);
          draw.DrawPoint(pB, 5, b2_draw_1.debugColors.joint4);
        }
      };
      exports.b2WheelJoint = b2WheelJoint;
    }
  });
  var require_b2_contact = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_contact.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2Contact = exports.b2ContactEdge = exports.b2MixRestitutionThreshold = exports.b2MixRestitution = exports.b2MixFriction = void 0;
      var b2_common_1 = require_b2_common();
      var b2_collision_1 = require_b2_collision();
      function b2MixFriction(friction1, friction2) {
        return Math.sqrt(friction1 * friction2);
      }
      exports.b2MixFriction = b2MixFriction;
      function b2MixRestitution(restitution1, restitution2) {
        return restitution1 > restitution2 ? restitution1 : restitution2;
      }
      exports.b2MixRestitution = b2MixRestitution;
      function b2MixRestitutionThreshold(threshold1, threshold2) {
        return threshold1 < threshold2 ? threshold1 : threshold2;
      }
      exports.b2MixRestitutionThreshold = b2MixRestitutionThreshold;
      var b2ContactEdge = class {
        constructor(contact) {
          this.m_other = null;
          this.prev = null;
          this.next = null;
          this.contact = contact;
        }
        get other() {
          (0, b2_common_1.b2Assert)(this.m_other !== null);
          return this.m_other;
        }
        set other(value) {
          (0, b2_common_1.b2Assert)(this.m_other === null);
          this.m_other = value;
        }
        Reset() {
          this.m_other = null;
          this.prev = null;
          this.next = null;
        }
      };
      exports.b2ContactEdge = b2ContactEdge;
      var b2Contact = class {
        constructor() {
          this.m_islandFlag = false;
          this.m_touchingFlag = false;
          this.m_enabledFlag = false;
          this.m_filterFlag = false;
          this.m_bulletHitFlag = false;
          this.m_toiFlag = false;
          this.m_prev = null;
          this.m_next = null;
          this.m_nodeA = new b2ContactEdge(this);
          this.m_nodeB = new b2ContactEdge(this);
          this.m_indexA = 0;
          this.m_indexB = 0;
          this.m_manifold = new b2_collision_1.b2Manifold();
          this.m_toiCount = 0;
          this.m_toi = 0;
          this.m_friction = 0;
          this.m_restitution = 0;
          this.m_restitutionThreshold = 0;
          this.m_tangentSpeed = 0;
          this.m_oldManifold = new b2_collision_1.b2Manifold();
        }
        GetManifold() {
          return this.m_manifold;
        }
        GetWorldManifold(worldManifold) {
          const bodyA = this.m_fixtureA.GetBody();
          const bodyB = this.m_fixtureB.GetBody();
          const shapeA = this.GetShapeA();
          const shapeB = this.GetShapeB();
          worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
        }
        IsTouching() {
          return this.m_touchingFlag;
        }
        SetEnabled(flag) {
          this.m_enabledFlag = flag;
        }
        IsEnabled() {
          return this.m_enabledFlag;
        }
        GetNext() {
          return this.m_next;
        }
        GetFixtureA() {
          return this.m_fixtureA;
        }
        GetChildIndexA() {
          return this.m_indexA;
        }
        GetShapeA() {
          return this.m_fixtureA.GetShape();
        }
        GetFixtureB() {
          return this.m_fixtureB;
        }
        GetChildIndexB() {
          return this.m_indexB;
        }
        GetShapeB() {
          return this.m_fixtureB.GetShape();
        }
        FlagForFiltering() {
          this.m_filterFlag = true;
        }
        SetFriction(friction) {
          this.m_friction = friction;
        }
        GetFriction() {
          return this.m_friction;
        }
        ResetFriction() {
          this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
        }
        SetRestitution(restitution) {
          this.m_restitution = restitution;
        }
        GetRestitution() {
          return this.m_restitution;
        }
        ResetRestitution() {
          this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
        }
        SetRestitutionThreshold(threshold) {
          this.m_restitutionThreshold = threshold;
        }
        GetRestitutionThreshold() {
          return this.m_restitutionThreshold;
        }
        ResetRestitutionThreshold() {
          this.m_restitutionThreshold = b2MixRestitutionThreshold(this.m_fixtureA.m_restitutionThreshold, this.m_fixtureB.m_restitutionThreshold);
        }
        SetTangentSpeed(speed) {
          this.m_tangentSpeed = speed;
        }
        GetTangentSpeed() {
          return this.m_tangentSpeed;
        }
        Reset(fixtureA, indexA, fixtureB, indexB) {
          this.m_islandFlag = false;
          this.m_touchingFlag = false;
          this.m_enabledFlag = true;
          this.m_filterFlag = false;
          this.m_bulletHitFlag = false;
          this.m_toiFlag = false;
          this.m_fixtureA = fixtureA;
          this.m_fixtureB = fixtureB;
          this.m_indexA = indexA;
          this.m_indexB = indexB;
          this.m_manifold.pointCount = 0;
          this.m_prev = null;
          this.m_next = null;
          this.m_nodeA.Reset();
          this.m_nodeB.Reset();
          this.m_toiCount = 0;
          this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
          this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
          this.m_restitutionThreshold = b2MixRestitutionThreshold(this.m_fixtureA.m_restitutionThreshold, this.m_fixtureB.m_restitutionThreshold);
        }
        Update(listener) {
          const tManifold = this.m_oldManifold;
          this.m_oldManifold = this.m_manifold;
          this.m_manifold = tManifold;
          this.m_enabledFlag = true;
          let touching = false;
          const wasTouching = this.m_touchingFlag;
          const sensorA = this.m_fixtureA.IsSensor();
          const sensorB = this.m_fixtureB.IsSensor();
          const sensor = sensorA || sensorB;
          const bodyA = this.m_fixtureA.GetBody();
          const bodyB = this.m_fixtureB.GetBody();
          const xfA = bodyA.GetTransform();
          const xfB = bodyB.GetTransform();
          if (sensor) {
            const shapeA = this.GetShapeA();
            const shapeB = this.GetShapeB();
            touching = (0, b2_collision_1.b2TestOverlap)(shapeA, this.m_indexA, shapeB, this.m_indexB, xfA, xfB);
            this.m_manifold.pointCount = 0;
          } else {
            this.Evaluate(this.m_manifold, xfA, xfB);
            touching = this.m_manifold.pointCount > 0;
            for (let i = 0; i < this.m_manifold.pointCount; ++i) {
              const mp2 = this.m_manifold.points[i];
              mp2.normalImpulse = 0;
              mp2.tangentImpulse = 0;
              const id2 = mp2.id;
              for (let j = 0; j < this.m_oldManifold.pointCount; ++j) {
                const mp1 = this.m_oldManifold.points[j];
                if (mp1.id.key === id2.key) {
                  mp2.normalImpulse = mp1.normalImpulse;
                  mp2.tangentImpulse = mp1.tangentImpulse;
                  break;
                }
              }
            }
            if (touching !== wasTouching) {
              bodyA.SetAwake(true);
              bodyB.SetAwake(true);
            }
          }
          this.m_touchingFlag = touching;
          if (!wasTouching && touching && listener) {
            listener.BeginContact(this);
          }
          if (wasTouching && !touching && listener) {
            listener.EndContact(this);
          }
          if (!sensor && touching && listener) {
            listener.PreSolve(this, this.m_oldManifold);
          }
        }
      };
      exports.b2Contact = b2Contact;
    }
  });
  var require_b2_circle_contact = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_circle_contact.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2CircleContact = void 0;
      var b2_collide_circle_1 = require_b2_collide_circle();
      var b2_contact_1 = require_b2_contact();
      var b2CircleContact = class extends b2_contact_1.b2Contact {
        Evaluate(manifold, xfA, xfB) {
          (0, b2_collide_circle_1.b2CollideCircles)(manifold, this.GetShapeA(), xfA, this.GetShapeB(), xfB);
        }
      };
      exports.b2CircleContact = b2CircleContact;
    }
  });
  var require_b2_polygon_contact = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_polygon_contact.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2PolygonContact = void 0;
      var b2_collide_polygon_1 = require_b2_collide_polygon();
      var b2_contact_1 = require_b2_contact();
      var b2PolygonContact = class extends b2_contact_1.b2Contact {
        Evaluate(manifold, xfA, xfB) {
          (0, b2_collide_polygon_1.b2CollidePolygons)(manifold, this.GetShapeA(), xfA, this.GetShapeB(), xfB);
        }
      };
      exports.b2PolygonContact = b2PolygonContact;
    }
  });
  var require_b2_polygon_circle_contact = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_polygon_circle_contact.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2PolygonAndCircleContact = void 0;
      var b2_collide_circle_1 = require_b2_collide_circle();
      var b2_contact_1 = require_b2_contact();
      var b2PolygonAndCircleContact = class extends b2_contact_1.b2Contact {
        Evaluate(manifold, xfA, xfB) {
          (0, b2_collide_circle_1.b2CollidePolygonAndCircle)(manifold, this.GetShapeA(), xfA, this.GetShapeB(), xfB);
        }
      };
      exports.b2PolygonAndCircleContact = b2PolygonAndCircleContact;
    }
  });
  var require_b2_edge_circle_contact = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_edge_circle_contact.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2EdgeAndCircleContact = void 0;
      var b2_collide_edge_1 = require_b2_collide_edge();
      var b2_contact_1 = require_b2_contact();
      var b2EdgeAndCircleContact = class extends b2_contact_1.b2Contact {
        Evaluate(manifold, xfA, xfB) {
          (0, b2_collide_edge_1.b2CollideEdgeAndCircle)(manifold, this.GetShapeA(), xfA, this.GetShapeB(), xfB);
        }
      };
      exports.b2EdgeAndCircleContact = b2EdgeAndCircleContact;
    }
  });
  var require_b2_edge_polygon_contact = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_edge_polygon_contact.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2EdgeAndPolygonContact = void 0;
      var b2_collide_edge_1 = require_b2_collide_edge();
      var b2_contact_1 = require_b2_contact();
      var b2EdgeAndPolygonContact = class extends b2_contact_1.b2Contact {
        Evaluate(manifold, xfA, xfB) {
          (0, b2_collide_edge_1.b2CollideEdgeAndPolygon)(manifold, this.GetShapeA(), xfA, this.GetShapeB(), xfB);
        }
      };
      exports.b2EdgeAndPolygonContact = b2EdgeAndPolygonContact;
    }
  });
  var require_b2_chain_circle_contact = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_chain_circle_contact.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2ChainAndCircleContact = void 0;
      var b2_collide_edge_1 = require_b2_collide_edge();
      var b2_edge_shape_1 = require_b2_edge_shape();
      var b2_contact_1 = require_b2_contact();
      var b2ChainAndCircleContact = class extends b2_contact_1.b2Contact {
        Evaluate(manifold, xfA, xfB) {
          const edge = b2ChainAndCircleContact.Evaluate_s_edge;
          this.GetShapeA().GetChildEdge(edge, this.m_indexA);
          (0, b2_collide_edge_1.b2CollideEdgeAndCircle)(manifold, edge, xfA, this.GetShapeB(), xfB);
        }
      };
      exports.b2ChainAndCircleContact = b2ChainAndCircleContact;
      b2ChainAndCircleContact.Evaluate_s_edge = new b2_edge_shape_1.b2EdgeShape();
    }
  });
  var require_b2_chain_polygon_contact = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_chain_polygon_contact.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2ChainAndPolygonContact = void 0;
      var b2_collide_edge_1 = require_b2_collide_edge();
      var b2_edge_shape_1 = require_b2_edge_shape();
      var b2_contact_1 = require_b2_contact();
      var b2ChainAndPolygonContact = class extends b2_contact_1.b2Contact {
        Evaluate(manifold, xfA, xfB) {
          const edge = b2ChainAndPolygonContact.Evaluate_s_edge;
          this.GetShapeA().GetChildEdge(edge, this.m_indexA);
          (0, b2_collide_edge_1.b2CollideEdgeAndPolygon)(manifold, edge, xfA, this.GetShapeB(), xfB);
        }
      };
      exports.b2ChainAndPolygonContact = b2ChainAndPolygonContact;
      b2ChainAndPolygonContact.Evaluate_s_edge = new b2_edge_shape_1.b2EdgeShape();
    }
  });
  var require_b2_contact_factory = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_contact_factory.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2ContactFactory = void 0;
      var b2_shape_1 = require_b2_shape();
      var b2_circle_contact_1 = require_b2_circle_contact();
      var b2_polygon_contact_1 = require_b2_polygon_contact();
      var b2_polygon_circle_contact_1 = require_b2_polygon_circle_contact();
      var b2_edge_circle_contact_1 = require_b2_edge_circle_contact();
      var b2_edge_polygon_contact_1 = require_b2_edge_polygon_contact();
      var b2_chain_circle_contact_1 = require_b2_chain_circle_contact();
      var b2_chain_polygon_contact_1 = require_b2_chain_polygon_contact();
      var b2ContactFactory = class {
        constructor() {
          const result = new Array(b2_shape_1.b2ShapeType.e_typeCount);
          for (let i = 0; i < b2_shape_1.b2ShapeType.e_typeCount; i++) result[i] = new Array(b2_shape_1.b2ShapeType.e_typeCount);
          this.m_registers = result;
          this.AddType(b2_circle_contact_1.b2CircleContact, b2_shape_1.b2ShapeType.e_circle, b2_shape_1.b2ShapeType.e_circle);
          this.AddType(b2_polygon_circle_contact_1.b2PolygonAndCircleContact, b2_shape_1.b2ShapeType.e_polygon, b2_shape_1.b2ShapeType.e_circle);
          this.AddType(b2_polygon_contact_1.b2PolygonContact, b2_shape_1.b2ShapeType.e_polygon, b2_shape_1.b2ShapeType.e_polygon);
          this.AddType(b2_edge_circle_contact_1.b2EdgeAndCircleContact, b2_shape_1.b2ShapeType.e_edge, b2_shape_1.b2ShapeType.e_circle);
          this.AddType(b2_edge_polygon_contact_1.b2EdgeAndPolygonContact, b2_shape_1.b2ShapeType.e_edge, b2_shape_1.b2ShapeType.e_polygon);
          this.AddType(b2_chain_circle_contact_1.b2ChainAndCircleContact, b2_shape_1.b2ShapeType.e_chain, b2_shape_1.b2ShapeType.e_circle);
          this.AddType(b2_chain_polygon_contact_1.b2ChainAndPolygonContact, b2_shape_1.b2ShapeType.e_chain, b2_shape_1.b2ShapeType.e_polygon);
        }
        AddType(Contact, typeA, typeB) {
          const pool = [];
          const destroyFcn = contact => {
            pool.push(contact);
          };
          this.m_registers[typeA][typeB] = {
            createFcn(fixtureA, indexA, fixtureB, indexB) {
              var _a;
              const c = (_a = pool.pop()) !== null && _a !== void 0 ? _a : new Contact();
              c.Reset(fixtureA, indexA, fixtureB, indexB);
              return c;
            },
            destroyFcn
          };
          if (typeA !== typeB) {
            this.m_registers[typeB][typeA] = {
              createFcn(fixtureA, indexA, fixtureB, indexB) {
                var _a;
                const c = (_a = pool.pop()) !== null && _a !== void 0 ? _a : new Contact();
                c.Reset(fixtureB, indexB, fixtureA, indexA);
                return c;
              },
              destroyFcn
            };
          }
        }
        Create(fixtureA, indexA, fixtureB, indexB) {
          const typeA = fixtureA.GetType();
          const typeB = fixtureB.GetType();
          const reg = this.m_registers[typeA][typeB];
          return reg ? reg.createFcn(fixtureA, indexA, fixtureB, indexB) : null;
        }
        Destroy(contact) {
          const typeA = contact.m_fixtureA.GetType();
          const typeB = contact.m_fixtureB.GetType();
          const reg = this.m_registers[typeA][typeB];
          reg === null || reg === void 0 ? void 0 : reg.destroyFcn(contact);
        }
      };
      exports.b2ContactFactory = b2ContactFactory;
    }
  });
  var require_b2_world_callbacks = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_world_callbacks.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2ContactListener = exports.b2ContactImpulse = exports.b2ContactFilter = exports.b2DestructionListener = void 0;
      var b2_common_1 = require_b2_common();
      var b2DestructionListener = class {
        SayGoodbyeJoint(_joint) {}
        SayGoodbyeFixture(_fixture) {}
      };
      exports.b2DestructionListener = b2DestructionListener;
      var b2ContactFilter = class {
        ShouldCollide(fixtureA, fixtureB) {
          const filterA = fixtureA.GetFilterData();
          const filterB = fixtureB.GetFilterData();
          if (filterA.groupIndex === filterB.groupIndex && filterA.groupIndex !== 0) {
            return filterA.groupIndex > 0;
          }
          return (filterA.maskBits & filterB.categoryBits) !== 0 && (filterA.categoryBits & filterB.maskBits) !== 0;
        }
      };
      exports.b2ContactFilter = b2ContactFilter;
      b2ContactFilter.b2_defaultFilter = new b2ContactFilter();
      var b2ContactImpulse = class {
        constructor() {
          this.normalImpulses = (0, b2_common_1.b2MakeNumberArray)(b2_common_1.b2_maxManifoldPoints);
          this.tangentImpulses = (0, b2_common_1.b2MakeNumberArray)(b2_common_1.b2_maxManifoldPoints);
          this.count = 0;
        }
      };
      exports.b2ContactImpulse = b2ContactImpulse;
      var b2ContactListener2 = class {
        BeginContact(_contact) {}
        EndContact(_contact) {}
        PreSolve(_contact, _oldManifold) {}
        PostSolve(_contact, _impulse) {}
      };
      exports.b2ContactListener = b2ContactListener2;
      b2ContactListener2.b2_defaultListener = new b2ContactListener2();
    }
  });
  var require_b2_contact_manager = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_contact_manager.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2ContactManager = void 0;
      var b2_broad_phase_1 = require_b2_broad_phase();
      var b2_contact_factory_1 = require_b2_contact_factory();
      var b2_body_1 = require_b2_body();
      var b2_world_callbacks_1 = require_b2_world_callbacks();
      var b2ContactManager = class {
        constructor() {
          this.m_broadPhase = new b2_broad_phase_1.b2BroadPhase();
          this.m_contactList = null;
          this.m_contactCount = 0;
          this.m_contactFilter = b2_world_callbacks_1.b2ContactFilter.b2_defaultFilter;
          this.m_contactListener = b2_world_callbacks_1.b2ContactListener.b2_defaultListener;
          this.m_contactFactory = new b2_contact_factory_1.b2ContactFactory();
          this.AddPair = (proxyA, proxyB) => {
            let fixtureA = proxyA.fixture;
            let fixtureB = proxyB.fixture;
            let indexA = proxyA.childIndex;
            let indexB = proxyB.childIndex;
            let bodyA = fixtureA.GetBody();
            let bodyB = fixtureB.GetBody();
            if (bodyA === bodyB) {
              return;
            }
            let edge = bodyB.GetContactList();
            while (edge) {
              if (edge.other === bodyA) {
                const fA = edge.contact.GetFixtureA();
                const fB = edge.contact.GetFixtureB();
                const iA = edge.contact.GetChildIndexA();
                const iB = edge.contact.GetChildIndexB();
                if (fA === fixtureA && fB === fixtureB && iA === indexA && iB === indexB) {
                  return;
                }
                if (fA === fixtureB && fB === fixtureA && iA === indexB && iB === indexA) {
                  return;
                }
              }
              edge = edge.next;
            }
            if (bodyB.ShouldCollide(bodyA) === false) {
              return;
            }
            if (this.m_contactFilter && !this.m_contactFilter.ShouldCollide(fixtureA, fixtureB)) {
              return;
            }
            const c = this.m_contactFactory.Create(fixtureA, indexA, fixtureB, indexB);
            if (c === null) {
              return;
            }
            fixtureA = c.GetFixtureA();
            fixtureB = c.GetFixtureB();
            indexA = c.GetChildIndexA();
            indexB = c.GetChildIndexB();
            bodyA = fixtureA.m_body;
            bodyB = fixtureB.m_body;
            c.m_prev = null;
            c.m_next = this.m_contactList;
            if (this.m_contactList !== null) {
              this.m_contactList.m_prev = c;
            }
            this.m_contactList = c;
            c.m_nodeA.other = bodyB;
            c.m_nodeA.prev = null;
            c.m_nodeA.next = bodyA.m_contactList;
            if (bodyA.m_contactList !== null) {
              bodyA.m_contactList.prev = c.m_nodeA;
            }
            bodyA.m_contactList = c.m_nodeA;
            c.m_nodeB.other = bodyA;
            c.m_nodeB.prev = null;
            c.m_nodeB.next = bodyB.m_contactList;
            if (bodyB.m_contactList !== null) {
              bodyB.m_contactList.prev = c.m_nodeB;
            }
            bodyB.m_contactList = c.m_nodeB;
            ++this.m_contactCount;
          };
        }
        FindNewContacts() {
          this.m_broadPhase.UpdatePairs(this.AddPair);
        }
        Destroy(c) {
          const fixtureA = c.GetFixtureA();
          const fixtureB = c.GetFixtureB();
          const bodyA = fixtureA.GetBody();
          const bodyB = fixtureB.GetBody();
          if (this.m_contactListener && c.IsTouching()) {
            this.m_contactListener.EndContact(c);
          }
          if (c.m_prev) {
            c.m_prev.m_next = c.m_next;
          }
          if (c.m_next) {
            c.m_next.m_prev = c.m_prev;
          }
          if (c === this.m_contactList) {
            this.m_contactList = c.m_next;
          }
          if (c.m_nodeA.prev) {
            c.m_nodeA.prev.next = c.m_nodeA.next;
          }
          if (c.m_nodeA.next) {
            c.m_nodeA.next.prev = c.m_nodeA.prev;
          }
          if (c.m_nodeA === bodyA.m_contactList) {
            bodyA.m_contactList = c.m_nodeA.next;
          }
          if (c.m_nodeB.prev) {
            c.m_nodeB.prev.next = c.m_nodeB.next;
          }
          if (c.m_nodeB.next) {
            c.m_nodeB.next.prev = c.m_nodeB.prev;
          }
          if (c.m_nodeB === bodyB.m_contactList) {
            bodyB.m_contactList = c.m_nodeB.next;
          }
          if (c.m_manifold.pointCount > 0 && !fixtureA.IsSensor() && !fixtureB.IsSensor()) {
            fixtureA.GetBody().SetAwake(true);
            fixtureB.GetBody().SetAwake(true);
          }
          this.m_contactFactory.Destroy(c);
          --this.m_contactCount;
        }
        Collide() {
          let c = this.m_contactList;
          while (c) {
            const fixtureA = c.GetFixtureA();
            const fixtureB = c.GetFixtureB();
            const indexA = c.GetChildIndexA();
            const indexB = c.GetChildIndexB();
            const bodyA = fixtureA.GetBody();
            const bodyB = fixtureB.GetBody();
            if (c.m_filterFlag) {
              if (!bodyB.ShouldCollide(bodyA) || this.m_contactFilter && !this.m_contactFilter.ShouldCollide(fixtureA, fixtureB)) {
                const cNuke = c;
                c = cNuke.m_next;
                this.Destroy(cNuke);
                continue;
              }
              c.m_filterFlag = false;
            }
            const activeA = bodyA.IsAwake() && bodyA.m_type !== b2_body_1.b2BodyType.b2_staticBody;
            const activeB = bodyB.IsAwake() && bodyB.m_type !== b2_body_1.b2BodyType.b2_staticBody;
            if (!activeA && !activeB) {
              c = c.m_next;
              continue;
            }
            const treeNodeA = fixtureA.m_proxies[indexA].treeNode;
            const treeNodeB = fixtureB.m_proxies[indexB].treeNode;
            const overlap = treeNodeA.aabb.TestOverlap(treeNodeB.aabb);
            if (!overlap) {
              const cNuke = c;
              c = cNuke.m_next;
              this.Destroy(cNuke);
              continue;
            }
            c.Update(this.m_contactListener);
            c = c.m_next;
          }
        }
      };
      exports.b2ContactManager = b2ContactManager;
    }
  });
  var require_b2_time_step = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_time_step.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2SolverData = exports.b2Velocity = exports.b2Position = exports.b2TimeStep = exports.b2Profile = void 0;
      var b2_math_1 = require_b2_math();
      var b2Profile = class {
        constructor() {
          this.step = 0;
          this.collide = 0;
          this.solve = 0;
          this.solveInit = 0;
          this.solveVelocity = 0;
          this.solvePosition = 0;
          this.broadphase = 0;
          this.solveTOI = 0;
        }
        Reset() {
          this.step = 0;
          this.collide = 0;
          this.solve = 0;
          this.solveInit = 0;
          this.solveVelocity = 0;
          this.solvePosition = 0;
          this.broadphase = 0;
          this.solveTOI = 0;
          return this;
        }
      };
      exports.b2Profile = b2Profile;
      var b2TimeStep = class {
        constructor() {
          this.dt = 0;
          this.inv_dt = 0;
          this.dtRatio = 0;
          this.config = {
            velocityIterations: 0,
            positionIterations: 0
          };
          this.warmStarting = false;
        }
        static Create() {
          return new b2TimeStep();
        }
        Copy(step) {
          this.dt = step.dt;
          this.inv_dt = step.inv_dt;
          this.dtRatio = step.dtRatio;
          this.config = __spreadValues({}, step.config);
          this.warmStarting = step.warmStarting;
          return this;
        }
      };
      exports.b2TimeStep = b2TimeStep;
      var b2Position = class {
        constructor() {
          this.c = new b2_math_1.b2Vec2();
          this.a = 0;
        }
      };
      exports.b2Position = b2Position;
      var b2Velocity = class {
        constructor() {
          this.v = new b2_math_1.b2Vec2();
          this.w = 0;
        }
      };
      exports.b2Velocity = b2Velocity;
      var b2SolverData = class {
        constructor() {
          this.step = b2TimeStep.Create();
        }
      };
      exports.b2SolverData = b2SolverData;
    }
  });
  var require_b2_contact_solver = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_contact_solver.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2ContactSolver = exports.b2ContactSolverDef = exports.b2ContactVelocityConstraint = exports.b2GetBlockSolve = exports.b2SetBlockSolve = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_collision_1 = require_b2_collision();
      var b2_time_step_1 = require_b2_time_step();
      var g_blockSolve = true;
      function b2SetBlockSolve(value) {
        g_blockSolve = value;
      }
      exports.b2SetBlockSolve = b2SetBlockSolve;
      function b2GetBlockSolve() {
        return g_blockSolve;
      }
      exports.b2GetBlockSolve = b2GetBlockSolve;
      var b2VelocityConstraintPoint = class {
        constructor() {
          this.rA = new b2_math_1.b2Vec2();
          this.rB = new b2_math_1.b2Vec2();
          this.normalImpulse = 0;
          this.tangentImpulse = 0;
          this.normalMass = 0;
          this.tangentMass = 0;
          this.velocityBias = 0;
        }
      };
      var b2ContactVelocityConstraint = class {
        constructor() {
          this.points = (0, b2_common_1.b2MakeArray)(b2_common_1.b2_maxManifoldPoints, b2VelocityConstraintPoint);
          this.normal = new b2_math_1.b2Vec2();
          this.tangent = new b2_math_1.b2Vec2();
          this.normalMass = new b2_math_1.b2Mat22();
          this.K = new b2_math_1.b2Mat22();
          this.indexA = 0;
          this.indexB = 0;
          this.invMassA = 0;
          this.invMassB = 0;
          this.invIA = 0;
          this.invIB = 0;
          this.friction = 0;
          this.restitution = 0;
          this.threshold = 0;
          this.tangentSpeed = 0;
          this.pointCount = 0;
          this.contactIndex = 0;
        }
      };
      exports.b2ContactVelocityConstraint = b2ContactVelocityConstraint;
      var b2ContactPositionConstraint = class {
        constructor() {
          this.localPoints = (0, b2_common_1.b2MakeArray)(b2_common_1.b2_maxManifoldPoints, b2_math_1.b2Vec2);
          this.localNormal = new b2_math_1.b2Vec2();
          this.localPoint = new b2_math_1.b2Vec2();
          this.indexA = 0;
          this.indexB = 0;
          this.invMassA = 0;
          this.invMassB = 0;
          this.localCenterA = new b2_math_1.b2Vec2();
          this.localCenterB = new b2_math_1.b2Vec2();
          this.invIA = 0;
          this.invIB = 0;
          this.type = b2_collision_1.b2ManifoldType.e_circles;
          this.radiusA = 0;
          this.radiusB = 0;
          this.pointCount = 0;
        }
      };
      var b2ContactSolverDef = class {
        constructor() {
          this.step = b2_time_step_1.b2TimeStep.Create();
          this.count = 0;
        }
      };
      exports.b2ContactSolverDef = b2ContactSolverDef;
      var b2PositionSolverManifold = class {
        constructor() {
          this.normal = new b2_math_1.b2Vec2();
          this.point = new b2_math_1.b2Vec2();
          this.separation = 0;
        }
        Initialize(pc, xfA, xfB, index) {
          const pointA = b2PositionSolverManifold.Initialize_s_pointA;
          const pointB = b2PositionSolverManifold.Initialize_s_pointB;
          const planePoint = b2PositionSolverManifold.Initialize_s_planePoint;
          const clipPoint = b2PositionSolverManifold.Initialize_s_clipPoint;
          switch (pc.type) {
            case b2_collision_1.b2ManifoldType.e_circles:
              b2_math_1.b2Transform.MultiplyVec2(xfA, pc.localPoint, pointA);
              b2_math_1.b2Transform.MultiplyVec2(xfB, pc.localPoints[0], pointB);
              b2_math_1.b2Vec2.Subtract(pointB, pointA, this.normal).Normalize();
              b2_math_1.b2Vec2.Mid(pointA, pointB, this.point);
              this.separation = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(pointB, pointA, b2_math_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
              break;
            case b2_collision_1.b2ManifoldType.e_faceA:
              b2_math_1.b2Rot.MultiplyVec2(xfA.q, pc.localNormal, this.normal);
              b2_math_1.b2Transform.MultiplyVec2(xfA, pc.localPoint, planePoint);
              b2_math_1.b2Transform.MultiplyVec2(xfB, pc.localPoints[index], clipPoint);
              this.separation = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(clipPoint, planePoint, b2_math_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
              this.point.Copy(clipPoint);
              break;
            case b2_collision_1.b2ManifoldType.e_faceB:
              b2_math_1.b2Rot.MultiplyVec2(xfB.q, pc.localNormal, this.normal);
              b2_math_1.b2Transform.MultiplyVec2(xfB, pc.localPoint, planePoint);
              b2_math_1.b2Transform.MultiplyVec2(xfA, pc.localPoints[index], clipPoint);
              this.separation = b2_math_1.b2Vec2.Dot(b2_math_1.b2Vec2.Subtract(clipPoint, planePoint, b2_math_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
              this.point.Copy(clipPoint);
              this.normal.Negate();
              break;
          }
        }
      };
      b2PositionSolverManifold.Initialize_s_pointA = new b2_math_1.b2Vec2();
      b2PositionSolverManifold.Initialize_s_pointB = new b2_math_1.b2Vec2();
      b2PositionSolverManifold.Initialize_s_planePoint = new b2_math_1.b2Vec2();
      b2PositionSolverManifold.Initialize_s_clipPoint = new b2_math_1.b2Vec2();
      var b2ContactSolver = class {
        constructor() {
          this.m_step = b2_time_step_1.b2TimeStep.Create();
          this.m_positionConstraints = (0, b2_common_1.b2MakeArray)(1024, b2ContactPositionConstraint);
          this.m_velocityConstraints = (0, b2_common_1.b2MakeArray)(1024, b2ContactVelocityConstraint);
          this.m_count = 0;
        }
        Initialize(def) {
          this.m_step.Copy(def.step);
          this.m_count = def.count;
          if (this.m_positionConstraints.length < this.m_count) {
            const new_length = Math.max(this.m_positionConstraints.length * 2, this.m_count);
            while (this.m_positionConstraints.length < new_length) {
              this.m_positionConstraints[this.m_positionConstraints.length] = new b2ContactPositionConstraint();
            }
          }
          if (this.m_velocityConstraints.length < this.m_count) {
            const new_length = Math.max(this.m_velocityConstraints.length * 2, this.m_count);
            while (this.m_velocityConstraints.length < new_length) {
              this.m_velocityConstraints[this.m_velocityConstraints.length] = new b2ContactVelocityConstraint();
            }
          }
          this.m_positions = def.positions;
          this.m_velocities = def.velocities;
          this.m_contacts = def.contacts;
          for (let i = 0; i < this.m_count; ++i) {
            const contact = this.m_contacts[i];
            const fixtureA = contact.m_fixtureA;
            const fixtureB = contact.m_fixtureB;
            const shapeA = fixtureA.GetShape();
            const shapeB = fixtureB.GetShape();
            const radiusA = shapeA.m_radius;
            const radiusB = shapeB.m_radius;
            const bodyA = fixtureA.GetBody();
            const bodyB = fixtureB.GetBody();
            const manifold = contact.GetManifold();
            const {pointCount} = manifold;
            const vc = this.m_velocityConstraints[i];
            vc.friction = contact.m_friction;
            vc.restitution = contact.m_restitution;
            vc.threshold = contact.m_restitutionThreshold;
            vc.tangentSpeed = contact.m_tangentSpeed;
            vc.indexA = bodyA.m_islandIndex;
            vc.indexB = bodyB.m_islandIndex;
            vc.invMassA = bodyA.m_invMass;
            vc.invMassB = bodyB.m_invMass;
            vc.invIA = bodyA.m_invI;
            vc.invIB = bodyB.m_invI;
            vc.contactIndex = i;
            vc.pointCount = pointCount;
            vc.K.SetZero();
            vc.normalMass.SetZero();
            const pc = this.m_positionConstraints[i];
            pc.indexA = bodyA.m_islandIndex;
            pc.indexB = bodyB.m_islandIndex;
            pc.invMassA = bodyA.m_invMass;
            pc.invMassB = bodyB.m_invMass;
            pc.localCenterA.Copy(bodyA.m_sweep.localCenter);
            pc.localCenterB.Copy(bodyB.m_sweep.localCenter);
            pc.invIA = bodyA.m_invI;
            pc.invIB = bodyB.m_invI;
            pc.localNormal.Copy(manifold.localNormal);
            pc.localPoint.Copy(manifold.localPoint);
            pc.pointCount = pointCount;
            pc.radiusA = radiusA;
            pc.radiusB = radiusB;
            pc.type = manifold.type;
            for (let j = 0; j < pointCount; ++j) {
              const cp = manifold.points[j];
              const vcp = vc.points[j];
              if (this.m_step.warmStarting) {
                vcp.normalImpulse = this.m_step.dtRatio * cp.normalImpulse;
                vcp.tangentImpulse = this.m_step.dtRatio * cp.tangentImpulse;
              } else {
                vcp.normalImpulse = 0;
                vcp.tangentImpulse = 0;
              }
              vcp.rA.SetZero();
              vcp.rB.SetZero();
              vcp.normalMass = 0;
              vcp.tangentMass = 0;
              vcp.velocityBias = 0;
              pc.localPoints[j].Copy(cp.localPoint);
            }
          }
          return this;
        }
        InitializeVelocityConstraints() {
          const xfA = b2ContactSolver.InitializeVelocityConstraints_s_xfA;
          const xfB = b2ContactSolver.InitializeVelocityConstraints_s_xfB;
          const worldManifold = b2ContactSolver.InitializeVelocityConstraints_s_worldManifold;
          const k_maxConditionNumber = 1e3;
          for (let i = 0; i < this.m_count; ++i) {
            const vc = this.m_velocityConstraints[i];
            const pc = this.m_positionConstraints[i];
            const {radiusA, radiusB, localCenterA, localCenterB} = pc;
            const manifold = this.m_contacts[vc.contactIndex].GetManifold();
            const {indexA, indexB, tangent, pointCount} = vc;
            const mA = vc.invMassA;
            const mB = vc.invMassB;
            const iA = vc.invIA;
            const iB = vc.invIB;
            const cA = this.m_positions[indexA].c;
            const aA = this.m_positions[indexA].a;
            const vA = this.m_velocities[indexA].v;
            const wA = this.m_velocities[indexA].w;
            const cB = this.m_positions[indexB].c;
            const aB = this.m_positions[indexB].a;
            const vB = this.m_velocities[indexB].v;
            const wB = this.m_velocities[indexB].w;
            xfA.q.Set(aA);
            xfB.q.Set(aB);
            b2_math_1.b2Vec2.Subtract(cA, b2_math_1.b2Rot.MultiplyVec2(xfA.q, localCenterA, b2_math_1.b2Vec2.s_t0), xfA.p);
            b2_math_1.b2Vec2.Subtract(cB, b2_math_1.b2Rot.MultiplyVec2(xfB.q, localCenterB, b2_math_1.b2Vec2.s_t0), xfB.p);
            worldManifold.Initialize(manifold, xfA, radiusA, xfB, radiusB);
            vc.normal.Copy(worldManifold.normal);
            b2_math_1.b2Vec2.CrossVec2One(vc.normal, tangent);
            for (let j = 0; j < pointCount; ++j) {
              const vcp = vc.points[j];
              b2_math_1.b2Vec2.Subtract(worldManifold.points[j], cA, vcp.rA);
              b2_math_1.b2Vec2.Subtract(worldManifold.points[j], cB, vcp.rB);
              const rnA = b2_math_1.b2Vec2.Cross(vcp.rA, vc.normal);
              const rnB = b2_math_1.b2Vec2.Cross(vcp.rB, vc.normal);
              const kNormal = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
              vcp.normalMass = kNormal > 0 ? 1 / kNormal : 0;
              const rtA = b2_math_1.b2Vec2.Cross(vcp.rA, tangent);
              const rtB = b2_math_1.b2Vec2.Cross(vcp.rB, tangent);
              const kTangent = mA + mB + iA * rtA * rtA + iB * rtB * rtB;
              vcp.tangentMass = kTangent > 0 ? 1 / kTangent : 0;
              vcp.velocityBias = 0;
              const vRel = b2_math_1.b2Vec2.Dot(vc.normal, b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, vcp.rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, vcp.rA, b2_math_1.b2Vec2.s_t1), b2_math_1.b2Vec2.s_t0));
              if (vRel < -vc.threshold) {
                vcp.velocityBias = -vc.restitution * vRel;
              }
            }
            if (vc.pointCount === 2 && g_blockSolve) {
              const vcp1 = vc.points[0];
              const vcp2 = vc.points[1];
              const rn1A = b2_math_1.b2Vec2.Cross(vcp1.rA, vc.normal);
              const rn1B = b2_math_1.b2Vec2.Cross(vcp1.rB, vc.normal);
              const rn2A = b2_math_1.b2Vec2.Cross(vcp2.rA, vc.normal);
              const rn2B = b2_math_1.b2Vec2.Cross(vcp2.rB, vc.normal);
              const k11 = mA + mB + iA * rn1A * rn1A + iB * rn1B * rn1B;
              const k22 = mA + mB + iA * rn2A * rn2A + iB * rn2B * rn2B;
              const k12 = mA + mB + iA * rn1A * rn2A + iB * rn1B * rn2B;
              if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
                vc.K.ex.Set(k11, k12);
                vc.K.ey.Set(k12, k22);
                vc.K.GetInverse(vc.normalMass);
              } else {
                vc.pointCount = 1;
              }
            }
          }
        }
        WarmStart() {
          const P = b2ContactSolver.WarmStart_s_P;
          for (let i = 0; i < this.m_count; ++i) {
            const vc = this.m_velocityConstraints[i];
            const {indexA, indexB, pointCount, normal, tangent} = vc;
            const mA = vc.invMassA;
            const iA = vc.invIA;
            const mB = vc.invMassB;
            const iB = vc.invIB;
            const vA = this.m_velocities[indexA].v;
            let wA = this.m_velocities[indexA].w;
            const vB = this.m_velocities[indexB].v;
            let wB = this.m_velocities[indexB].w;
            for (let j = 0; j < pointCount; ++j) {
              const vcp = vc.points[j];
              b2_math_1.b2Vec2.Add(b2_math_1.b2Vec2.Scale(vcp.normalImpulse, normal, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.Scale(vcp.tangentImpulse, tangent, b2_math_1.b2Vec2.s_t1), P);
              wA -= iA * b2_math_1.b2Vec2.Cross(vcp.rA, P);
              vA.SubtractScaled(mA, P);
              wB += iB * b2_math_1.b2Vec2.Cross(vcp.rB, P);
              vB.AddScaled(mB, P);
            }
            this.m_velocities[indexA].w = wA;
            this.m_velocities[indexB].w = wB;
          }
        }
        SolveVelocityConstraints() {
          const dv = b2ContactSolver.SolveVelocityConstraints_s_dv;
          const dv1 = b2ContactSolver.SolveVelocityConstraints_s_dv1;
          const dv2 = b2ContactSolver.SolveVelocityConstraints_s_dv2;
          const P = b2ContactSolver.SolveVelocityConstraints_s_P;
          const a = b2ContactSolver.SolveVelocityConstraints_s_a;
          const b = b2ContactSolver.SolveVelocityConstraints_s_b;
          const x = b2ContactSolver.SolveVelocityConstraints_s_x;
          const d = b2ContactSolver.SolveVelocityConstraints_s_d;
          const P1 = b2ContactSolver.SolveVelocityConstraints_s_P1;
          const P2 = b2ContactSolver.SolveVelocityConstraints_s_P2;
          const P1P2 = b2ContactSolver.SolveVelocityConstraints_s_P1P2;
          for (let i = 0; i < this.m_count; ++i) {
            const vc = this.m_velocityConstraints[i];
            const {indexA, indexB, pointCount, normal, tangent, friction} = vc;
            const mA = vc.invMassA;
            const iA = vc.invIA;
            const mB = vc.invMassB;
            const iB = vc.invIB;
            const vA = this.m_velocities[indexA].v;
            let wA = this.m_velocities[indexA].w;
            const vB = this.m_velocities[indexB].v;
            let wB = this.m_velocities[indexB].w;
            for (let j = 0; j < pointCount; ++j) {
              const vcp = vc.points[j];
              b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, vcp.rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, vcp.rA, b2_math_1.b2Vec2.s_t1), dv);
              const vt = b2_math_1.b2Vec2.Dot(dv, tangent) - vc.tangentSpeed;
              let lambda = vcp.tangentMass * -vt;
              const maxFriction = friction * vcp.normalImpulse;
              const newImpulse = (0, b2_math_1.b2Clamp)(vcp.tangentImpulse + lambda, -maxFriction, maxFriction);
              lambda = newImpulse - vcp.tangentImpulse;
              vcp.tangentImpulse = newImpulse;
              b2_math_1.b2Vec2.Scale(lambda, tangent, P);
              vA.SubtractScaled(mA, P);
              wA -= iA * b2_math_1.b2Vec2.Cross(vcp.rA, P);
              vB.AddScaled(mB, P);
              wB += iB * b2_math_1.b2Vec2.Cross(vcp.rB, P);
            }
            if (vc.pointCount === 1 || g_blockSolve === false) {
              for (let j = 0; j < pointCount; ++j) {
                const vcp = vc.points[j];
                b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, vcp.rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, vcp.rA, b2_math_1.b2Vec2.s_t1), dv);
                const vn = b2_math_1.b2Vec2.Dot(dv, normal);
                let lambda = -vcp.normalMass * (vn - vcp.velocityBias);
                const newImpulse = Math.max(vcp.normalImpulse + lambda, 0);
                lambda = newImpulse - vcp.normalImpulse;
                vcp.normalImpulse = newImpulse;
                b2_math_1.b2Vec2.Scale(lambda, normal, P);
                vA.SubtractScaled(mA, P);
                wA -= iA * b2_math_1.b2Vec2.Cross(vcp.rA, P);
                vB.AddScaled(mB, P);
                wB += iB * b2_math_1.b2Vec2.Cross(vcp.rB, P);
              }
            } else {
              const cp1 = vc.points[0];
              const cp2 = vc.points[1];
              a.Set(cp1.normalImpulse, cp2.normalImpulse);
              b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, cp1.rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, cp1.rA, b2_math_1.b2Vec2.s_t1), dv1);
              b2_math_1.b2Vec2.Subtract(b2_math_1.b2Vec2.AddCrossScalarVec2(vB, wB, cp2.rB, b2_math_1.b2Vec2.s_t0), b2_math_1.b2Vec2.AddCrossScalarVec2(vA, wA, cp2.rA, b2_math_1.b2Vec2.s_t1), dv2);
              let vn1 = b2_math_1.b2Vec2.Dot(dv1, normal);
              let vn2 = b2_math_1.b2Vec2.Dot(dv2, normal);
              b.x = vn1 - cp1.velocityBias;
              b.y = vn2 - cp2.velocityBias;
              b.Subtract(b2_math_1.b2Mat22.MultiplyVec2(vc.K, a, b2_math_1.b2Vec2.s_t0));
              for (; ; ) {
                b2_math_1.b2Mat22.MultiplyVec2(vc.normalMass, b, x).Negate();
                if (x.x >= 0 && x.y >= 0) {
                  b2_math_1.b2Vec2.Subtract(x, a, d);
                  b2_math_1.b2Vec2.Scale(d.x, normal, P1);
                  b2_math_1.b2Vec2.Scale(d.y, normal, P2);
                  b2_math_1.b2Vec2.Add(P1, P2, P1P2);
                  vA.SubtractScaled(mA, P1P2);
                  wA -= iA * (b2_math_1.b2Vec2.Cross(cp1.rA, P1) + b2_math_1.b2Vec2.Cross(cp2.rA, P2));
                  vB.AddScaled(mB, P1P2);
                  wB += iB * (b2_math_1.b2Vec2.Cross(cp1.rB, P1) + b2_math_1.b2Vec2.Cross(cp2.rB, P2));
                  cp1.normalImpulse = x.x;
                  cp2.normalImpulse = x.y;
                  break;
                }
                x.x = -cp1.normalMass * b.x;
                x.y = 0;
                vn1 = 0;
                vn2 = vc.K.ex.y * x.x + b.y;
                if (x.x >= 0 && vn2 >= 0) {
                  b2_math_1.b2Vec2.Subtract(x, a, d);
                  b2_math_1.b2Vec2.Scale(d.x, normal, P1);
                  b2_math_1.b2Vec2.Scale(d.y, normal, P2);
                  b2_math_1.b2Vec2.Add(P1, P2, P1P2);
                  vA.SubtractScaled(mA, P1P2);
                  wA -= iA * (b2_math_1.b2Vec2.Cross(cp1.rA, P1) + b2_math_1.b2Vec2.Cross(cp2.rA, P2));
                  vB.AddScaled(mB, P1P2);
                  wB += iB * (b2_math_1.b2Vec2.Cross(cp1.rB, P1) + b2_math_1.b2Vec2.Cross(cp2.rB, P2));
                  cp1.normalImpulse = x.x;
                  cp2.normalImpulse = x.y;
                  break;
                }
                x.x = 0;
                x.y = -cp2.normalMass * b.y;
                vn1 = vc.K.ey.x * x.y + b.x;
                vn2 = 0;
                if (x.y >= 0 && vn1 >= 0) {
                  b2_math_1.b2Vec2.Subtract(x, a, d);
                  b2_math_1.b2Vec2.Scale(d.x, normal, P1);
                  b2_math_1.b2Vec2.Scale(d.y, normal, P2);
                  b2_math_1.b2Vec2.Add(P1, P2, P1P2);
                  vA.SubtractScaled(mA, P1P2);
                  wA -= iA * (b2_math_1.b2Vec2.Cross(cp1.rA, P1) + b2_math_1.b2Vec2.Cross(cp2.rA, P2));
                  vB.AddScaled(mB, P1P2);
                  wB += iB * (b2_math_1.b2Vec2.Cross(cp1.rB, P1) + b2_math_1.b2Vec2.Cross(cp2.rB, P2));
                  cp1.normalImpulse = x.x;
                  cp2.normalImpulse = x.y;
                  break;
                }
                x.x = 0;
                x.y = 0;
                vn1 = b.x;
                vn2 = b.y;
                if (vn1 >= 0 && vn2 >= 0) {
                  b2_math_1.b2Vec2.Subtract(x, a, d);
                  b2_math_1.b2Vec2.Scale(d.x, normal, P1);
                  b2_math_1.b2Vec2.Scale(d.y, normal, P2);
                  b2_math_1.b2Vec2.Add(P1, P2, P1P2);
                  vA.SubtractScaled(mA, P1P2);
                  wA -= iA * (b2_math_1.b2Vec2.Cross(cp1.rA, P1) + b2_math_1.b2Vec2.Cross(cp2.rA, P2));
                  vB.AddScaled(mB, P1P2);
                  wB += iB * (b2_math_1.b2Vec2.Cross(cp1.rB, P1) + b2_math_1.b2Vec2.Cross(cp2.rB, P2));
                  cp1.normalImpulse = x.x;
                  cp2.normalImpulse = x.y;
                  break;
                }
                break;
              }
            }
            this.m_velocities[indexA].w = wA;
            this.m_velocities[indexB].w = wB;
          }
        }
        StoreImpulses() {
          for (let i = 0; i < this.m_count; ++i) {
            const vc = this.m_velocityConstraints[i];
            const manifold = this.m_contacts[vc.contactIndex].GetManifold();
            for (let j = 0; j < vc.pointCount; ++j) {
              manifold.points[j].normalImpulse = vc.points[j].normalImpulse;
              manifold.points[j].tangentImpulse = vc.points[j].tangentImpulse;
            }
          }
        }
        SolvePositionConstraints() {
          const xfA = b2ContactSolver.SolvePositionConstraints_s_xfA;
          const xfB = b2ContactSolver.SolvePositionConstraints_s_xfB;
          const psm = b2ContactSolver.SolvePositionConstraints_s_psm;
          const rA = b2ContactSolver.SolvePositionConstraints_s_rA;
          const rB = b2ContactSolver.SolvePositionConstraints_s_rB;
          const P = b2ContactSolver.SolvePositionConstraints_s_P;
          let minSeparation = 0;
          for (let i = 0; i < this.m_count; ++i) {
            const pc = this.m_positionConstraints[i];
            const {indexA, indexB, localCenterA, localCenterB, pointCount} = pc;
            const mA = pc.invMassA;
            const iA = pc.invIA;
            const mB = pc.invMassB;
            const iB = pc.invIB;
            const cA = this.m_positions[indexA].c;
            let aA = this.m_positions[indexA].a;
            const cB = this.m_positions[indexB].c;
            let aB = this.m_positions[indexB].a;
            for (let j = 0; j < pointCount; ++j) {
              xfA.q.Set(aA);
              xfB.q.Set(aB);
              b2_math_1.b2Vec2.Subtract(cA, b2_math_1.b2Rot.MultiplyVec2(xfA.q, localCenterA, b2_math_1.b2Vec2.s_t0), xfA.p);
              b2_math_1.b2Vec2.Subtract(cB, b2_math_1.b2Rot.MultiplyVec2(xfB.q, localCenterB, b2_math_1.b2Vec2.s_t0), xfB.p);
              psm.Initialize(pc, xfA, xfB, j);
              const {normal, point, separation} = psm;
              b2_math_1.b2Vec2.Subtract(point, cA, rA);
              b2_math_1.b2Vec2.Subtract(point, cB, rB);
              minSeparation = Math.min(minSeparation, separation);
              const C = (0, b2_math_1.b2Clamp)(b2_common_1.b2_baumgarte * (separation + b2_common_1.b2_linearSlop), -b2_common_1.b2_maxLinearCorrection, 0);
              const rnA = b2_math_1.b2Vec2.Cross(rA, normal);
              const rnB = b2_math_1.b2Vec2.Cross(rB, normal);
              const K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
              const impulse = K > 0 ? -C / K : 0;
              b2_math_1.b2Vec2.Scale(impulse, normal, P);
              cA.SubtractScaled(mA, P);
              aA -= iA * b2_math_1.b2Vec2.Cross(rA, P);
              cB.AddScaled(mB, P);
              aB += iB * b2_math_1.b2Vec2.Cross(rB, P);
            }
            this.m_positions[indexA].c.Copy(cA);
            this.m_positions[indexA].a = aA;
            this.m_positions[indexB].c.Copy(cB);
            this.m_positions[indexB].a = aB;
          }
          return minSeparation >= -3 * b2_common_1.b2_linearSlop;
        }
        SolveTOIPositionConstraints(toiIndexA, toiIndexB) {
          const xfA = b2ContactSolver.SolveTOIPositionConstraints_s_xfA;
          const xfB = b2ContactSolver.SolveTOIPositionConstraints_s_xfB;
          const psm = b2ContactSolver.SolveTOIPositionConstraints_s_psm;
          const rA = b2ContactSolver.SolveTOIPositionConstraints_s_rA;
          const rB = b2ContactSolver.SolveTOIPositionConstraints_s_rB;
          const P = b2ContactSolver.SolveTOIPositionConstraints_s_P;
          let minSeparation = 0;
          for (let i = 0; i < this.m_count; ++i) {
            const pc = this.m_positionConstraints[i];
            const {indexA, indexB, localCenterA, localCenterB, pointCount} = pc;
            let mA = 0;
            let iA = 0;
            if (indexA === toiIndexA || indexA === toiIndexB) {
              mA = pc.invMassA;
              iA = pc.invIA;
            }
            let mB = 0;
            let iB = 0;
            if (indexB === toiIndexA || indexB === toiIndexB) {
              mB = pc.invMassB;
              iB = pc.invIB;
            }
            const cA = this.m_positions[indexA].c;
            let aA = this.m_positions[indexA].a;
            const cB = this.m_positions[indexB].c;
            let aB = this.m_positions[indexB].a;
            for (let j = 0; j < pointCount; ++j) {
              xfA.q.Set(aA);
              xfB.q.Set(aB);
              b2_math_1.b2Vec2.Subtract(cA, b2_math_1.b2Rot.MultiplyVec2(xfA.q, localCenterA, b2_math_1.b2Vec2.s_t0), xfA.p);
              b2_math_1.b2Vec2.Subtract(cB, b2_math_1.b2Rot.MultiplyVec2(xfB.q, localCenterB, b2_math_1.b2Vec2.s_t0), xfB.p);
              psm.Initialize(pc, xfA, xfB, j);
              const {normal, point, separation} = psm;
              b2_math_1.b2Vec2.Subtract(point, cA, rA);
              b2_math_1.b2Vec2.Subtract(point, cB, rB);
              minSeparation = Math.min(minSeparation, separation);
              const C = (0, b2_math_1.b2Clamp)(b2_common_1.b2_toiBaumgarte * (separation + b2_common_1.b2_linearSlop), -b2_common_1.b2_maxLinearCorrection, 0);
              const rnA = b2_math_1.b2Vec2.Cross(rA, normal);
              const rnB = b2_math_1.b2Vec2.Cross(rB, normal);
              const K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
              const impulse = K > 0 ? -C / K : 0;
              b2_math_1.b2Vec2.Scale(impulse, normal, P);
              cA.SubtractScaled(mA, P);
              aA -= iA * b2_math_1.b2Vec2.Cross(rA, P);
              cB.AddScaled(mB, P);
              aB += iB * b2_math_1.b2Vec2.Cross(rB, P);
            }
            this.m_positions[indexA].a = aA;
            this.m_positions[indexB].a = aB;
          }
          return minSeparation >= -1.5 * b2_common_1.b2_linearSlop;
        }
      };
      exports.b2ContactSolver = b2ContactSolver;
      b2ContactSolver.InitializeVelocityConstraints_s_xfA = new b2_math_1.b2Transform();
      b2ContactSolver.InitializeVelocityConstraints_s_xfB = new b2_math_1.b2Transform();
      b2ContactSolver.InitializeVelocityConstraints_s_worldManifold = new b2_collision_1.b2WorldManifold();
      b2ContactSolver.WarmStart_s_P = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveVelocityConstraints_s_dv = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveVelocityConstraints_s_dv1 = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveVelocityConstraints_s_dv2 = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveVelocityConstraints_s_P = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveVelocityConstraints_s_a = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveVelocityConstraints_s_b = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveVelocityConstraints_s_x = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveVelocityConstraints_s_d = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveVelocityConstraints_s_P1 = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveVelocityConstraints_s_P2 = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveVelocityConstraints_s_P1P2 = new b2_math_1.b2Vec2();
      b2ContactSolver.SolvePositionConstraints_s_xfA = new b2_math_1.b2Transform();
      b2ContactSolver.SolvePositionConstraints_s_xfB = new b2_math_1.b2Transform();
      b2ContactSolver.SolvePositionConstraints_s_psm = new b2PositionSolverManifold();
      b2ContactSolver.SolvePositionConstraints_s_rA = new b2_math_1.b2Vec2();
      b2ContactSolver.SolvePositionConstraints_s_rB = new b2_math_1.b2Vec2();
      b2ContactSolver.SolvePositionConstraints_s_P = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveTOIPositionConstraints_s_xfA = new b2_math_1.b2Transform();
      b2ContactSolver.SolveTOIPositionConstraints_s_xfB = new b2_math_1.b2Transform();
      b2ContactSolver.SolveTOIPositionConstraints_s_psm = new b2PositionSolverManifold();
      b2ContactSolver.SolveTOIPositionConstraints_s_rA = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveTOIPositionConstraints_s_rB = new b2_math_1.b2Vec2();
      b2ContactSolver.SolveTOIPositionConstraints_s_P = new b2_math_1.b2Vec2();
    }
  });
  var require_b2_island = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_island.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2Island = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_timer_1 = require_b2_timer();
      var b2_contact_solver_1 = require_b2_contact_solver();
      var b2_body_1 = require_b2_body();
      var b2_time_step_1 = require_b2_time_step();
      var b2_world_callbacks_1 = require_b2_world_callbacks();
      var b2Island = class {
        constructor(bodyCapacity, contactCapacity, jointCapacity, listener) {
          this.m_bodyCount = 0;
          this.m_jointCount = 0;
          this.m_contactCount = 0;
          this.m_bodyCapacity = bodyCapacity;
          this.m_listener = listener;
          this.m_bodies = new Array(bodyCapacity);
          this.m_contacts = new Array(contactCapacity);
          this.m_joints = new Array(jointCapacity);
          this.m_velocities = (0, b2_common_1.b2MakeArray)(bodyCapacity, b2_time_step_1.b2Velocity);
          this.m_positions = (0, b2_common_1.b2MakeArray)(bodyCapacity, b2_time_step_1.b2Position);
          this.Resize(bodyCapacity);
        }
        Resize(bodyCapacity) {
          while (this.m_bodyCapacity < bodyCapacity) {
            this.m_velocities[this.m_bodyCapacity] = new b2_time_step_1.b2Velocity();
            this.m_positions[this.m_bodyCapacity] = new b2_time_step_1.b2Position();
            this.m_bodyCapacity++;
          }
        }
        Clear() {
          this.m_bodyCount = 0;
          this.m_contactCount = 0;
          this.m_jointCount = 0;
        }
        AddBody(body) {
          body.m_islandIndex = this.m_bodyCount;
          this.m_bodies[this.m_bodyCount] = body;
          ++this.m_bodyCount;
        }
        AddContact(contact) {
          this.m_contacts[this.m_contactCount++] = contact;
        }
        AddJoint(joint) {
          this.m_joints[this.m_jointCount++] = joint;
        }
        Solve(profile, step, gravity, allowSleep) {
          const timer = b2Island.s_timer.Reset();
          const h = step.dt;
          for (let i = 0; i < this.m_bodyCount; ++i) {
            const b = this.m_bodies[i];
            this.m_positions[i].c.Copy(b.m_sweep.c);
            const {a} = b.m_sweep;
            const v = this.m_velocities[i].v.Copy(b.m_linearVelocity);
            let w = b.m_angularVelocity;
            b.m_sweep.c0.Copy(b.m_sweep.c);
            b.m_sweep.a0 = b.m_sweep.a;
            if (b.m_type === b2_body_1.b2BodyType.b2_dynamicBody) {
              v.x += h * b.m_invMass * (b.m_gravityScale * b.m_mass * gravity.x + b.m_force.x);
              v.y += h * b.m_invMass * (b.m_gravityScale * b.m_mass * gravity.y + b.m_force.y);
              w += h * b.m_invI * b.m_torque;
              v.Scale(1 / (1 + h * b.m_linearDamping));
              w *= 1 / (1 + h * b.m_angularDamping);
            }
            this.m_positions[i].a = a;
            this.m_velocities[i].w = w;
          }
          timer.Reset();
          const solverData = b2Island.s_solverData;
          solverData.step.Copy(step);
          solverData.positions = this.m_positions;
          solverData.velocities = this.m_velocities;
          const contactSolverDef = b2Island.s_contactSolverDef;
          contactSolverDef.step.Copy(step);
          contactSolverDef.contacts = this.m_contacts;
          contactSolverDef.count = this.m_contactCount;
          contactSolverDef.positions = this.m_positions;
          contactSolverDef.velocities = this.m_velocities;
          const contactSolver = b2Island.s_contactSolver.Initialize(contactSolverDef);
          contactSolver.InitializeVelocityConstraints();
          if (step.warmStarting) {
            contactSolver.WarmStart();
          }
          for (let i = 0; i < this.m_jointCount; ++i) {
            this.m_joints[i].InitVelocityConstraints(solverData);
          }
          profile.solveInit = timer.GetMilliseconds();
          timer.Reset();
          for (let i = 0; i < step.config.velocityIterations; ++i) {
            for (let j = 0; j < this.m_jointCount; ++j) {
              this.m_joints[j].SolveVelocityConstraints(solverData);
            }
            contactSolver.SolveVelocityConstraints();
          }
          contactSolver.StoreImpulses();
          profile.solveVelocity = timer.GetMilliseconds();
          for (let i = 0; i < this.m_bodyCount; ++i) {
            const {c} = this.m_positions[i];
            let {a} = this.m_positions[i];
            const {v} = this.m_velocities[i];
            let {w} = this.m_velocities[i];
            const translation = b2_math_1.b2Vec2.Scale(h, v, b2Island.s_translation);
            if (b2_math_1.b2Vec2.Dot(translation, translation) > b2_common_1.b2_maxTranslationSquared) {
              const ratio = b2_common_1.b2_maxTranslation / translation.Length();
              v.Scale(ratio);
            }
            const rotation = h * w;
            if (rotation * rotation > b2_common_1.b2_maxRotationSquared) {
              const ratio = b2_common_1.b2_maxRotation / Math.abs(rotation);
              w *= ratio;
            }
            c.AddScaled(h, v);
            a += h * w;
            this.m_positions[i].a = a;
            this.m_velocities[i].w = w;
          }
          timer.Reset();
          let positionSolved = false;
          for (let i = 0; i < step.config.positionIterations; ++i) {
            const contactsOkay = contactSolver.SolvePositionConstraints();
            let jointsOkay = true;
            for (let j = 0; j < this.m_jointCount; ++j) {
              const jointOkay = this.m_joints[j].SolvePositionConstraints(solverData);
              jointsOkay = jointsOkay && jointOkay;
            }
            if (contactsOkay && jointsOkay) {
              positionSolved = true;
              break;
            }
          }
          for (let i = 0; i < this.m_bodyCount; ++i) {
            const body = this.m_bodies[i];
            body.m_sweep.c.Copy(this.m_positions[i].c);
            body.m_sweep.a = this.m_positions[i].a;
            body.m_linearVelocity.Copy(this.m_velocities[i].v);
            body.m_angularVelocity = this.m_velocities[i].w;
            body.SynchronizeTransform();
          }
          profile.solvePosition = timer.GetMilliseconds();
          this.Report(contactSolver.m_velocityConstraints);
          if (allowSleep) {
            let minSleepTime = b2_common_1.b2_maxFloat;
            const linTolSqr = b2_common_1.b2_linearSleepTolerance * b2_common_1.b2_linearSleepTolerance;
            const angTolSqr = b2_common_1.b2_angularSleepTolerance * b2_common_1.b2_angularSleepTolerance;
            for (let i = 0; i < this.m_bodyCount; ++i) {
              const b = this.m_bodies[i];
              if (b.GetType() === b2_body_1.b2BodyType.b2_staticBody) {
                continue;
              }
              if (!b.m_autoSleepFlag || b.m_angularVelocity * b.m_angularVelocity > angTolSqr || b2_math_1.b2Vec2.Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
                b.m_sleepTime = 0;
                minSleepTime = 0;
              } else {
                b.m_sleepTime += h;
                minSleepTime = Math.min(minSleepTime, b.m_sleepTime);
              }
            }
            if (minSleepTime >= b2_common_1.b2_timeToSleep && positionSolved) {
              for (let i = 0; i < this.m_bodyCount; ++i) {
                const b = this.m_bodies[i];
                b.SetAwake(false);
              }
            }
          }
        }
        SolveTOI(subStep, toiIndexA, toiIndexB) {
          for (let i = 0; i < this.m_bodyCount; ++i) {
            const b = this.m_bodies[i];
            this.m_positions[i].c.Copy(b.m_sweep.c);
            this.m_positions[i].a = b.m_sweep.a;
            this.m_velocities[i].v.Copy(b.m_linearVelocity);
            this.m_velocities[i].w = b.m_angularVelocity;
          }
          const contactSolverDef = b2Island.s_contactSolverDef;
          contactSolverDef.contacts = this.m_contacts;
          contactSolverDef.count = this.m_contactCount;
          contactSolverDef.step.Copy(subStep);
          contactSolverDef.positions = this.m_positions;
          contactSolverDef.velocities = this.m_velocities;
          const contactSolver = b2Island.s_contactSolver.Initialize(contactSolverDef);
          for (let i = 0; i < subStep.config.positionIterations; ++i) {
            const contactsOkay = contactSolver.SolveTOIPositionConstraints(toiIndexA, toiIndexB);
            if (contactsOkay) {
              break;
            }
          }
          this.m_bodies[toiIndexA].m_sweep.c0.Copy(this.m_positions[toiIndexA].c);
          this.m_bodies[toiIndexA].m_sweep.a0 = this.m_positions[toiIndexA].a;
          this.m_bodies[toiIndexB].m_sweep.c0.Copy(this.m_positions[toiIndexB].c);
          this.m_bodies[toiIndexB].m_sweep.a0 = this.m_positions[toiIndexB].a;
          contactSolver.InitializeVelocityConstraints();
          for (let i = 0; i < subStep.config.velocityIterations; ++i) {
            contactSolver.SolveVelocityConstraints();
          }
          const h = subStep.dt;
          for (let i = 0; i < this.m_bodyCount; ++i) {
            const {c} = this.m_positions[i];
            let {a} = this.m_positions[i];
            const {v} = this.m_velocities[i];
            let {w} = this.m_velocities[i];
            const translation = b2_math_1.b2Vec2.Scale(h, v, b2Island.s_translation);
            if (b2_math_1.b2Vec2.Dot(translation, translation) > b2_common_1.b2_maxTranslationSquared) {
              const ratio = b2_common_1.b2_maxTranslation / translation.Length();
              v.Scale(ratio);
            }
            const rotation = h * w;
            if (rotation * rotation > b2_common_1.b2_maxRotationSquared) {
              const ratio = b2_common_1.b2_maxRotation / Math.abs(rotation);
              w *= ratio;
            }
            c.AddScaled(h, v);
            a += h * w;
            this.m_positions[i].a = a;
            this.m_velocities[i].w = w;
            const body = this.m_bodies[i];
            body.m_sweep.c.Copy(c);
            body.m_sweep.a = a;
            body.m_linearVelocity.Copy(v);
            body.m_angularVelocity = w;
            body.SynchronizeTransform();
          }
          this.Report(contactSolver.m_velocityConstraints);
        }
        Report(constraints) {
          for (let i = 0; i < this.m_contactCount; ++i) {
            const c = this.m_contacts[i];
            const vc = constraints[i];
            const impulse = b2Island.s_impulse;
            impulse.count = vc.pointCount;
            for (let j = 0; j < vc.pointCount; ++j) {
              impulse.normalImpulses[j] = vc.points[j].normalImpulse;
              impulse.tangentImpulses[j] = vc.points[j].tangentImpulse;
            }
            this.m_listener.PostSolve(c, impulse);
          }
        }
      };
      exports.b2Island = b2Island;
      b2Island.s_timer = new b2_timer_1.b2Timer();
      b2Island.s_solverData = new b2_time_step_1.b2SolverData();
      b2Island.s_contactSolverDef = new b2_contact_solver_1.b2ContactSolverDef();
      b2Island.s_contactSolver = new b2_contact_solver_1.b2ContactSolver();
      b2Island.s_translation = new b2_math_1.b2Vec2();
      b2Island.s_impulse = new b2_world_callbacks_1.b2ContactImpulse();
    }
  });
  var require_b2_world = __commonJS({
    "node_modules/@box2d/core/dist/dynamics/b2_world.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2World = void 0;
      var b2_common_1 = require_b2_common();
      var b2_math_1 = require_b2_math();
      var b2_timer_1 = require_b2_timer();
      var b2_collision_1 = require_b2_collision();
      var b2_time_of_impact_1 = require_b2_time_of_impact();
      var b2_joint_1 = require_b2_joint();
      var b2_area_joint_1 = require_b2_area_joint();
      var b2_distance_joint_1 = require_b2_distance_joint();
      var b2_friction_joint_1 = require_b2_friction_joint();
      var b2_gear_joint_1 = require_b2_gear_joint();
      var b2_motor_joint_1 = require_b2_motor_joint();
      var b2_mouse_joint_1 = require_b2_mouse_joint();
      var b2_prismatic_joint_1 = require_b2_prismatic_joint();
      var b2_pulley_joint_1 = require_b2_pulley_joint();
      var b2_revolute_joint_1 = require_b2_revolute_joint();
      var b2_weld_joint_1 = require_b2_weld_joint();
      var b2_wheel_joint_1 = require_b2_wheel_joint();
      var b2_body_1 = require_b2_body();
      var b2_contact_manager_1 = require_b2_contact_manager();
      var b2_island_1 = require_b2_island();
      var b2_time_step_1 = require_b2_time_step();
      var b2World2 = class {
        constructor(gravity) {
          this.m_contactManager = new b2_contact_manager_1.b2ContactManager();
          this.m_bodyList = null;
          this.m_jointList = null;
          this.m_bodyCount = 0;
          this.m_jointCount = 0;
          this.m_gravity = new b2_math_1.b2Vec2();
          this.m_allowSleep = true;
          this.m_destructionListener = null;
          this.m_inv_dt0 = 0;
          this.m_newContacts = false;
          this.m_locked = false;
          this.m_clearForces = true;
          this.m_warmStarting = true;
          this.m_continuousPhysics = true;
          this.m_subStepping = false;
          this.m_stepComplete = true;
          this.m_profile = new b2_time_step_1.b2Profile();
          this.m_island = new b2_island_1.b2Island(2 * b2_common_1.b2_maxTOIContacts, b2_common_1.b2_maxTOIContacts, 0, this.m_contactManager.m_contactListener);
          this.s_stack = [];
          this.m_gravity.Copy(gravity);
        }
        static Create(gravity) {
          return new b2World2(gravity);
        }
        SetDestructionListener(listener) {
          this.m_destructionListener = listener;
        }
        GetDestructionListener() {
          return this.m_destructionListener;
        }
        SetContactFilter(filter) {
          this.m_contactManager.m_contactFilter = filter;
        }
        SetContactListener(listener) {
          this.m_contactManager.m_contactListener = listener;
          this.m_island.m_listener = listener;
        }
        CreateBody(def = {}) {
          (0, b2_common_1.b2Assert)(!this.IsLocked());
          const b = new b2_body_1.b2Body(def, this);
          b.m_prev = null;
          b.m_next = this.m_bodyList;
          if (this.m_bodyList) {
            this.m_bodyList.m_prev = b;
          }
          this.m_bodyList = b;
          ++this.m_bodyCount;
          return b;
        }
        DestroyBody(b) {
          var _a, _b;
          (0, b2_common_1.b2Assert)(!this.IsLocked());
          let je = b.m_jointList;
          while (je) {
            const je0 = je;
            je = je.next;
            (_a = this.m_destructionListener) === null || _a === void 0 ? void 0 : _a.SayGoodbyeJoint(je0.joint);
            this.DestroyJoint(je0.joint);
            b.m_jointList = je;
          }
          b.m_jointList = null;
          let ce = b.m_contactList;
          while (ce) {
            const ce0 = ce;
            ce = ce.next;
            this.m_contactManager.Destroy(ce0.contact);
          }
          b.m_contactList = null;
          const broadPhase = this.m_contactManager.m_broadPhase;
          let f = b.m_fixtureList;
          while (f) {
            const f0 = f;
            f = f.m_next;
            (_b = this.m_destructionListener) === null || _b === void 0 ? void 0 : _b.SayGoodbyeFixture(f0);
            f0.DestroyProxies(broadPhase);
            b.m_fixtureList = f;
            b.m_fixtureCount -= 1;
          }
          b.m_fixtureList = null;
          b.m_fixtureCount = 0;
          if (b.m_prev) {
            b.m_prev.m_next = b.m_next;
          }
          if (b.m_next) {
            b.m_next.m_prev = b.m_prev;
          }
          if (b === this.m_bodyList) {
            this.m_bodyList = b.m_next;
          }
          --this.m_bodyCount;
        }
        static Joint_Create(def) {
          switch (def.type) {
            case b2_joint_1.b2JointType.e_distanceJoint:
              return new b2_distance_joint_1.b2DistanceJoint(def);
            case b2_joint_1.b2JointType.e_mouseJoint:
              return new b2_mouse_joint_1.b2MouseJoint(def);
            case b2_joint_1.b2JointType.e_prismaticJoint:
              return new b2_prismatic_joint_1.b2PrismaticJoint(def);
            case b2_joint_1.b2JointType.e_revoluteJoint:
              return new b2_revolute_joint_1.b2RevoluteJoint(def);
            case b2_joint_1.b2JointType.e_pulleyJoint:
              return new b2_pulley_joint_1.b2PulleyJoint(def);
            case b2_joint_1.b2JointType.e_gearJoint:
              return new b2_gear_joint_1.b2GearJoint(def);
            case b2_joint_1.b2JointType.e_wheelJoint:
              return new b2_wheel_joint_1.b2WheelJoint(def);
            case b2_joint_1.b2JointType.e_weldJoint:
              return new b2_weld_joint_1.b2WeldJoint(def);
            case b2_joint_1.b2JointType.e_frictionJoint:
              return new b2_friction_joint_1.b2FrictionJoint(def);
            case b2_joint_1.b2JointType.e_motorJoint:
              return new b2_motor_joint_1.b2MotorJoint(def);
            case b2_joint_1.b2JointType.e_areaJoint:
              return new b2_area_joint_1.b2AreaJoint(def);
          }
          throw new Error();
        }
        CreateJoint(def) {
          (0, b2_common_1.b2Assert)(!this.IsLocked());
          const j = b2World2.Joint_Create(def);
          j.m_prev = null;
          j.m_next = this.m_jointList;
          if (this.m_jointList) {
            this.m_jointList.m_prev = j;
          }
          this.m_jointList = j;
          ++this.m_jointCount;
          j.m_edgeA.prev = null;
          j.m_edgeA.next = j.m_bodyA.m_jointList;
          if (j.m_bodyA.m_jointList) j.m_bodyA.m_jointList.prev = j.m_edgeA;
          j.m_bodyA.m_jointList = j.m_edgeA;
          j.m_edgeB.prev = null;
          j.m_edgeB.next = j.m_bodyB.m_jointList;
          if (j.m_bodyB.m_jointList) j.m_bodyB.m_jointList.prev = j.m_edgeB;
          j.m_bodyB.m_jointList = j.m_edgeB;
          const bodyA = j.m_bodyA;
          const bodyB = j.m_bodyB;
          if (!def.collideConnected) {
            let edge = bodyB.GetContactList();
            while (edge) {
              if (edge.other === bodyA) {
                edge.contact.FlagForFiltering();
              }
              edge = edge.next;
            }
          }
          return j;
        }
        DestroyJoint(j) {
          (0, b2_common_1.b2Assert)(!this.IsLocked());
          if (j.m_prev) {
            j.m_prev.m_next = j.m_next;
          }
          if (j.m_next) {
            j.m_next.m_prev = j.m_prev;
          }
          if (j === this.m_jointList) {
            this.m_jointList = j.m_next;
          }
          const bodyA = j.m_bodyA;
          const bodyB = j.m_bodyB;
          const collideConnected = j.m_collideConnected;
          bodyA.SetAwake(true);
          bodyB.SetAwake(true);
          if (j.m_edgeA.prev) {
            j.m_edgeA.prev.next = j.m_edgeA.next;
          }
          if (j.m_edgeA.next) {
            j.m_edgeA.next.prev = j.m_edgeA.prev;
          }
          if (j.m_edgeA === bodyA.m_jointList) {
            bodyA.m_jointList = j.m_edgeA.next;
          }
          j.m_edgeA.prev = null;
          j.m_edgeA.next = null;
          if (j.m_edgeB.prev) {
            j.m_edgeB.prev.next = j.m_edgeB.next;
          }
          if (j.m_edgeB.next) {
            j.m_edgeB.next.prev = j.m_edgeB.prev;
          }
          if (j.m_edgeB === bodyB.m_jointList) {
            bodyB.m_jointList = j.m_edgeB.next;
          }
          j.m_edgeB.prev = null;
          j.m_edgeB.next = null;
          --this.m_jointCount;
          if (!collideConnected) {
            let edge = bodyB.GetContactList();
            while (edge) {
              if (edge.other === bodyA) {
                edge.contact.FlagForFiltering();
              }
              edge = edge.next;
            }
          }
        }
        Step(dt, iterations) {
          const stepTimer = b2World2.Step_s_stepTimer.Reset();
          if (this.m_newContacts) {
            this.m_contactManager.FindNewContacts();
            this.m_newContacts = false;
          }
          this.m_locked = true;
          const step = b2World2.Step_s_step;
          step.dt = dt;
          step.config = __spreadValues({}, iterations);
          if (dt > 0) {
            step.inv_dt = 1 / dt;
          } else {
            step.inv_dt = 0;
          }
          step.dtRatio = this.m_inv_dt0 * dt;
          step.warmStarting = this.m_warmStarting;
          {
            const timer = b2World2.Step_s_timer.Reset();
            this.m_contactManager.Collide();
            this.m_profile.collide = timer.GetMilliseconds();
          }
          if (this.m_stepComplete && step.dt > 0) {
            const timer = b2World2.Step_s_timer.Reset();
            this.Solve(step);
            this.m_profile.solve = timer.GetMilliseconds();
          }
          if (this.m_continuousPhysics && step.dt > 0) {
            const timer = b2World2.Step_s_timer.Reset();
            this.SolveTOI(step);
            this.m_profile.solveTOI = timer.GetMilliseconds();
          }
          if (step.dt > 0) {
            this.m_inv_dt0 = step.inv_dt;
          }
          if (this.m_clearForces) {
            this.ClearForces();
          }
          this.m_locked = false;
          this.m_profile.step = stepTimer.GetMilliseconds();
        }
        ClearForces() {
          for (let body = this.m_bodyList; body; body = body.GetNext()) {
            body.m_force.SetZero();
            body.m_torque = 0;
          }
        }
        QueryAABB(aabb, callback) {
          this.m_contactManager.m_broadPhase.Query(aabb, proxy => {
            const fixture_proxy = (0, b2_common_1.b2Verify)(proxy.userData);
            return callback(fixture_proxy.fixture);
          });
        }
        QueryAllAABB(aabb, out = []) {
          this.QueryAABB(aabb, fixture => {
            out.push(fixture);
            return true;
          });
          return out;
        }
        QueryPointAABB(point, callback) {
          this.m_contactManager.m_broadPhase.QueryPoint(point, proxy => {
            const fixture_proxy = (0, b2_common_1.b2Verify)(proxy.userData);
            return callback(fixture_proxy.fixture);
          });
        }
        QueryAllPointAABB(point, out = []) {
          this.QueryPointAABB(point, fixture => {
            out.push(fixture);
            return true;
          });
          return out;
        }
        QueryFixtureShape(shape, index, transform, callback) {
          const aabb = b2World2.QueryFixtureShape_s_aabb;
          shape.ComputeAABB(aabb, transform, index);
          this.m_contactManager.m_broadPhase.Query(aabb, proxy => {
            const fixture_proxy = (0, b2_common_1.b2Verify)(proxy.userData);
            const {fixture} = fixture_proxy;
            const overlap = (0, b2_collision_1.b2TestOverlap)(shape, index, fixture.GetShape(), fixture_proxy.childIndex, transform, fixture.GetBody().GetTransform());
            return !overlap || callback(fixture);
          });
        }
        QueryAllFixtureShape(shape, index, transform, out = []) {
          this.QueryFixtureShape(shape, index, transform, fixture => {
            out.push(fixture);
            return true;
          });
          return out;
        }
        QueryFixturePoint(point, callback) {
          this.m_contactManager.m_broadPhase.QueryPoint(point, proxy => {
            const fixture_proxy = (0, b2_common_1.b2Verify)(proxy.userData);
            const {fixture} = fixture_proxy;
            const overlap = fixture.TestPoint(point);
            return !overlap || callback(fixture);
          });
        }
        QueryAllFixturePoint(point, out = []) {
          this.QueryFixturePoint(point, fixture => {
            out.push(fixture);
            return true;
          });
          return out;
        }
        RayCast(point1, point2, callback) {
          const input = b2World2.RayCast_s_input;
          input.maxFraction = 1;
          input.p1.Copy(point1);
          input.p2.Copy(point2);
          this.m_contactManager.m_broadPhase.RayCast(input, (input2, proxy) => {
            const fixture_proxy = (0, b2_common_1.b2Verify)(proxy.userData);
            const {fixture} = fixture_proxy;
            const index = fixture_proxy.childIndex;
            const output = b2World2.RayCast_s_output;
            const hit = fixture.RayCast(output, input2, index);
            if (hit) {
              const {fraction} = output;
              const point = b2World2.RayCast_s_point;
              point.Set((1 - fraction) * point1.x + fraction * point2.x, (1 - fraction) * point1.y + fraction * point2.y);
              return callback(fixture, point, output.normal, fraction);
            }
            return input2.maxFraction;
          });
        }
        RayCastOne(point1, point2) {
          let result = null;
          let min_fraction = 1;
          this.RayCast(point1, point2, (fixture, _point, _normal, fraction) => {
            if (fraction < min_fraction) {
              min_fraction = fraction;
              result = fixture;
            }
            return min_fraction;
          });
          return result;
        }
        RayCastAll(point1, point2, out = []) {
          this.RayCast(point1, point2, fixture => {
            out.push(fixture);
            return 1;
          });
          return out;
        }
        GetBodyList() {
          return this.m_bodyList;
        }
        GetJointList() {
          return this.m_jointList;
        }
        GetContactList() {
          return this.m_contactManager.m_contactList;
        }
        SetAllowSleeping(flag) {
          if (flag === this.m_allowSleep) {
            return;
          }
          this.m_allowSleep = flag;
          if (!this.m_allowSleep) {
            for (let b = this.m_bodyList; b; b = b.m_next) {
              b.SetAwake(true);
            }
          }
        }
        GetAllowSleeping() {
          return this.m_allowSleep;
        }
        SetWarmStarting(flag) {
          this.m_warmStarting = flag;
        }
        GetWarmStarting() {
          return this.m_warmStarting;
        }
        SetContinuousPhysics(flag) {
          this.m_continuousPhysics = flag;
        }
        GetContinuousPhysics() {
          return this.m_continuousPhysics;
        }
        SetSubStepping(flag) {
          this.m_subStepping = flag;
        }
        GetSubStepping() {
          return this.m_subStepping;
        }
        GetProxyCount() {
          return this.m_contactManager.m_broadPhase.GetProxyCount();
        }
        GetBodyCount() {
          return this.m_bodyCount;
        }
        GetJointCount() {
          return this.m_jointCount;
        }
        GetContactCount() {
          return this.m_contactManager.m_contactCount;
        }
        GetTreeHeight() {
          return this.m_contactManager.m_broadPhase.GetTreeHeight();
        }
        GetTreeBalance() {
          return this.m_contactManager.m_broadPhase.GetTreeBalance();
        }
        GetTreeQuality() {
          return this.m_contactManager.m_broadPhase.GetTreeQuality();
        }
        SetGravity(gravity) {
          this.m_gravity.Copy(gravity);
        }
        GetGravity() {
          return this.m_gravity;
        }
        IsLocked() {
          return this.m_locked;
        }
        SetAutoClearForces(flag) {
          this.m_clearForces = flag;
        }
        GetAutoClearForces() {
          return this.m_clearForces;
        }
        ShiftOrigin(newOrigin) {
          (0, b2_common_1.b2Assert)(!this.IsLocked());
          for (let b = this.m_bodyList; b; b = b.m_next) {
            b.m_xf.p.Subtract(newOrigin);
            b.m_sweep.c0.Subtract(newOrigin);
            b.m_sweep.c.Subtract(newOrigin);
          }
          for (let j = this.m_jointList; j; j = j.m_next) {
            j.ShiftOrigin(newOrigin);
          }
          this.m_contactManager.m_broadPhase.ShiftOrigin(newOrigin);
        }
        GetContactManager() {
          return this.m_contactManager;
        }
        GetProfile() {
          return this.m_profile;
        }
        Solve(step) {
          this.m_profile.solveInit = 0;
          this.m_profile.solveVelocity = 0;
          this.m_profile.solvePosition = 0;
          const island = this.m_island;
          island.Resize(this.m_bodyCount);
          island.Clear();
          for (let b = this.m_bodyList; b; b = b.m_next) {
            b.m_islandFlag = false;
          }
          for (let c = this.m_contactManager.m_contactList; c; c = c.m_next) {
            c.m_islandFlag = false;
          }
          for (let j = this.m_jointList; j; j = j.m_next) {
            j.m_islandFlag = false;
          }
          const stack = this.s_stack;
          for (let seed = this.m_bodyList; seed; seed = seed.m_next) {
            if (seed.m_islandFlag) {
              continue;
            }
            if (!seed.IsAwake() || !seed.IsEnabled()) {
              continue;
            }
            if (seed.GetType() === b2_body_1.b2BodyType.b2_staticBody) {
              continue;
            }
            island.Clear();
            let stackCount = 0;
            stack[stackCount++] = seed;
            seed.m_islandFlag = true;
            while (stackCount > 0) {
              const b = stack[--stackCount];
              (0, b2_common_1.b2Assert)(b !== null);
              island.AddBody(b);
              if (b.GetType() === b2_body_1.b2BodyType.b2_staticBody) {
                continue;
              }
              b.m_awakeFlag = true;
              for (let ce = b.m_contactList; ce; ce = ce.next) {
                const {contact} = ce;
                if (contact.m_islandFlag) {
                  continue;
                }
                if (!contact.IsEnabled() || !contact.IsTouching()) {
                  continue;
                }
                const sensorA = contact.m_fixtureA.m_isSensor;
                const sensorB = contact.m_fixtureB.m_isSensor;
                if (sensorA || sensorB) {
                  continue;
                }
                island.AddContact(contact);
                contact.m_islandFlag = true;
                const {other} = ce;
                if (other.m_islandFlag) {
                  continue;
                }
                stack[stackCount++] = other;
                other.m_islandFlag = true;
              }
              for (let je = b.m_jointList; je; je = je.next) {
                if (je.joint.m_islandFlag) {
                  continue;
                }
                const {other} = je;
                if (!other.IsEnabled()) {
                  continue;
                }
                island.AddJoint(je.joint);
                je.joint.m_islandFlag = true;
                if (other.m_islandFlag) {
                  continue;
                }
                stack[stackCount++] = other;
                other.m_islandFlag = true;
              }
            }
            const profile = new b2_time_step_1.b2Profile();
            island.Solve(profile, step, this.m_gravity, this.m_allowSleep);
            this.m_profile.solveInit += profile.solveInit;
            this.m_profile.solveVelocity += profile.solveVelocity;
            this.m_profile.solvePosition += profile.solvePosition;
            for (let i = 0; i < island.m_bodyCount; ++i) {
              const b = island.m_bodies[i];
              if (b.GetType() === b2_body_1.b2BodyType.b2_staticBody) {
                b.m_islandFlag = false;
              }
            }
          }
          for (let i = 0; i < stack.length; ++i) {
            if (!stack[i]) {
              break;
            }
            stack[i] = null;
          }
          const timer = new b2_timer_1.b2Timer();
          for (let b = this.m_bodyList; b; b = b.m_next) {
            if (!b.m_islandFlag) {
              continue;
            }
            if (b.GetType() === b2_body_1.b2BodyType.b2_staticBody) {
              continue;
            }
            b.SynchronizeFixtures();
          }
          this.m_contactManager.FindNewContacts();
          this.m_profile.broadphase = timer.GetMilliseconds();
        }
        SolveTOI(step) {
          const island = this.m_island;
          island.Clear();
          if (this.m_stepComplete) {
            for (let b = this.m_bodyList; b; b = b.m_next) {
              b.m_islandFlag = false;
              b.m_sweep.alpha0 = 0;
            }
            for (let c = this.m_contactManager.m_contactList; c; c = c.m_next) {
              c.m_toiFlag = false;
              c.m_islandFlag = false;
              c.m_toiCount = 0;
              c.m_toi = 1;
            }
          }
          for (; ; ) {
            let minContact = null;
            let minAlpha = 1;
            for (let c = this.m_contactManager.m_contactList; c; c = c.m_next) {
              if (!c.IsEnabled()) {
                continue;
              }
              if (c.m_toiCount > b2_common_1.b2_maxSubSteps) {
                continue;
              }
              let alpha = 1;
              if (c.m_toiFlag) {
                alpha = c.m_toi;
              } else {
                const fA2 = c.GetFixtureA();
                const fB2 = c.GetFixtureB();
                if (fA2.IsSensor() || fB2.IsSensor()) {
                  continue;
                }
                const bA2 = fA2.GetBody();
                const bB2 = fB2.GetBody();
                const typeA = bA2.m_type;
                const typeB = bB2.m_type;
                const activeA = bA2.IsAwake() && typeA !== b2_body_1.b2BodyType.b2_staticBody;
                const activeB = bB2.IsAwake() && typeB !== b2_body_1.b2BodyType.b2_staticBody;
                if (!activeA && !activeB) {
                  continue;
                }
                const collideA = bA2.IsBullet() || typeA !== b2_body_1.b2BodyType.b2_dynamicBody;
                const collideB = bB2.IsBullet() || typeB !== b2_body_1.b2BodyType.b2_dynamicBody;
                if (!collideA && !collideB) {
                  continue;
                }
                let {alpha0} = bA2.m_sweep;
                if (bA2.m_sweep.alpha0 < bB2.m_sweep.alpha0) {
                  alpha0 = bB2.m_sweep.alpha0;
                  bA2.m_sweep.Advance(alpha0);
                } else if (bB2.m_sweep.alpha0 < bA2.m_sweep.alpha0) {
                  alpha0 = bA2.m_sweep.alpha0;
                  bB2.m_sweep.Advance(alpha0);
                }
                const indexA = c.GetChildIndexA();
                const indexB = c.GetChildIndexB();
                const input = b2World2.SolveTOI_s_toi_input;
                input.proxyA.SetShape(fA2.GetShape(), indexA);
                input.proxyB.SetShape(fB2.GetShape(), indexB);
                input.sweepA.Copy(bA2.m_sweep);
                input.sweepB.Copy(bB2.m_sweep);
                input.tMax = 1;
                const output = b2World2.SolveTOI_s_toi_output;
                (0, b2_time_of_impact_1.b2TimeOfImpact)(output, input);
                const beta = output.t;
                if (output.state === b2_time_of_impact_1.b2TOIOutputState.e_touching) {
                  alpha = Math.min(alpha0 + (1 - alpha0) * beta, 1);
                } else {
                  alpha = 1;
                }
                c.m_toi = alpha;
                c.m_toiFlag = true;
              }
              if (alpha < minAlpha) {
                minContact = c;
                minAlpha = alpha;
              }
            }
            if (minContact === null || 1 - 10 * b2_common_1.b2_epsilon < minAlpha) {
              this.m_stepComplete = true;
              break;
            }
            const fA = minContact.GetFixtureA();
            const fB = minContact.GetFixtureB();
            const bA = fA.GetBody();
            const bB = fB.GetBody();
            const backup1 = b2World2.SolveTOI_s_backup1.Copy(bA.m_sweep);
            const backup2 = b2World2.SolveTOI_s_backup2.Copy(bB.m_sweep);
            bA.Advance(minAlpha);
            bB.Advance(minAlpha);
            minContact.Update(this.m_contactManager.m_contactListener);
            minContact.m_toiFlag = false;
            ++minContact.m_toiCount;
            if (!minContact.IsEnabled() || !minContact.IsTouching()) {
              minContact.SetEnabled(false);
              bA.m_sweep.Copy(backup1);
              bB.m_sweep.Copy(backup2);
              bA.SynchronizeTransform();
              bB.SynchronizeTransform();
              continue;
            }
            bA.SetAwake(true);
            bB.SetAwake(true);
            island.Clear();
            island.AddBody(bA);
            island.AddBody(bB);
            island.AddContact(minContact);
            bA.m_islandFlag = true;
            bB.m_islandFlag = true;
            minContact.m_islandFlag = true;
            for (let i = 0; i < 2; ++i) {
              const body = i === 0 ? bA : bB;
              if (body.m_type === b2_body_1.b2BodyType.b2_dynamicBody) {
                for (let ce = body.m_contactList; ce; ce = ce.next) {
                  if (island.m_bodyCount === island.m_bodyCapacity) {
                    break;
                  }
                  if (island.m_contactCount === b2_common_1.b2_maxTOIContacts) {
                    break;
                  }
                  const {contact} = ce;
                  if (contact.m_islandFlag) {
                    continue;
                  }
                  const {other} = ce;
                  if (other.m_type === b2_body_1.b2BodyType.b2_dynamicBody && !body.IsBullet() && !other.IsBullet()) {
                    continue;
                  }
                  const sensorA = contact.m_fixtureA.m_isSensor;
                  const sensorB = contact.m_fixtureB.m_isSensor;
                  if (sensorA || sensorB) {
                    continue;
                  }
                  const backup = b2World2.SolveTOI_s_backup.Copy(other.m_sweep);
                  if (!other.m_islandFlag) {
                    other.Advance(minAlpha);
                  }
                  contact.Update(this.m_contactManager.m_contactListener);
                  if (!contact.IsEnabled()) {
                    other.m_sweep.Copy(backup);
                    other.SynchronizeTransform();
                    continue;
                  }
                  if (!contact.IsTouching()) {
                    other.m_sweep.Copy(backup);
                    other.SynchronizeTransform();
                    continue;
                  }
                  contact.m_islandFlag = true;
                  island.AddContact(contact);
                  if (other.m_islandFlag) {
                    continue;
                  }
                  other.m_islandFlag = true;
                  if (other.m_type !== b2_body_1.b2BodyType.b2_staticBody) {
                    other.SetAwake(true);
                  }
                  island.AddBody(other);
                }
              }
            }
            const subStep = b2World2.SolveTOI_s_subStep;
            subStep.dt = (1 - minAlpha) * step.dt;
            subStep.inv_dt = 1 / subStep.dt;
            subStep.dtRatio = 1;
            subStep.config = __spreadProps(__spreadValues({}, step.config), {
              positionIterations: 20
            });
            subStep.warmStarting = false;
            island.SolveTOI(subStep, bA.m_islandIndex, bB.m_islandIndex);
            for (let i = 0; i < island.m_bodyCount; ++i) {
              const body = island.m_bodies[i];
              body.m_islandFlag = false;
              if (body.m_type !== b2_body_1.b2BodyType.b2_dynamicBody) {
                continue;
              }
              body.SynchronizeFixtures();
              for (let ce = body.m_contactList; ce; ce = ce.next) {
                ce.contact.m_toiFlag = false;
                ce.contact.m_islandFlag = false;
              }
            }
            this.m_contactManager.FindNewContacts();
            if (this.m_subStepping) {
              this.m_stepComplete = false;
              break;
            }
          }
        }
      };
      exports.b2World = b2World2;
      b2World2.Step_s_step = b2_time_step_1.b2TimeStep.Create();
      b2World2.Step_s_stepTimer = new b2_timer_1.b2Timer();
      b2World2.Step_s_timer = new b2_timer_1.b2Timer();
      b2World2.QueryFixtureShape_s_aabb = new b2_collision_1.b2AABB();
      b2World2.RayCast_s_input = new b2_collision_1.b2RayCastInput();
      b2World2.RayCast_s_output = new b2_collision_1.b2RayCastOutput();
      b2World2.RayCast_s_point = new b2_math_1.b2Vec2();
      b2World2.SolveTOI_s_subStep = b2_time_step_1.b2TimeStep.Create();
      b2World2.SolveTOI_s_backup = new b2_math_1.b2Sweep();
      b2World2.SolveTOI_s_backup1 = new b2_math_1.b2Sweep();
      b2World2.SolveTOI_s_backup2 = new b2_math_1.b2Sweep();
      b2World2.SolveTOI_s_toi_input = new b2_time_of_impact_1.b2TOIInput();
      b2World2.SolveTOI_s_toi_output = new b2_time_of_impact_1.b2TOIOutput();
    }
  });
  var require_b2_rope = __commonJS({
    "node_modules/@box2d/core/dist/rope/b2_rope.js"(exports) {
      "use strict";
      init_define_process();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2Rope = exports.b2RopeTuning = exports.b2BendingModel = exports.b2StretchingModel = void 0;
      var b2_common_1 = require_b2_common();
      var b2_draw_1 = require_b2_draw();
      var b2_math_1 = require_b2_math();
      var temp = {
        J1: new b2_math_1.b2Vec2(),
        J2: new b2_math_1.b2Vec2(),
        J3: new b2_math_1.b2Vec2(),
        r: new b2_math_1.b2Vec2(),
        e1: new b2_math_1.b2Vec2(),
        e2: new b2_math_1.b2Vec2(),
        Jd1: new b2_math_1.b2Vec2(),
        Jd2: new b2_math_1.b2Vec2(),
        d: new b2_math_1.b2Vec2(),
        u: new b2_math_1.b2Vec2(),
        dp1: new b2_math_1.b2Vec2(),
        dp2: new b2_math_1.b2Vec2(),
        dp3: new b2_math_1.b2Vec2(),
        d1: new b2_math_1.b2Vec2(),
        d2: new b2_math_1.b2Vec2(),
        dHat: new b2_math_1.b2Vec2()
      };
      var b2StretchingModel;
      (function (b2StretchingModel2) {
        b2StretchingModel2[b2StretchingModel2["b2_pbdStretchingModel"] = 0] = "b2_pbdStretchingModel";
        b2StretchingModel2[b2StretchingModel2["b2_xpbdStretchingModel"] = 1] = "b2_xpbdStretchingModel";
      })(b2StretchingModel = exports.b2StretchingModel || (exports.b2StretchingModel = {}));
      var b2BendingModel;
      (function (b2BendingModel2) {
        b2BendingModel2[b2BendingModel2["b2_springAngleBendingModel"] = 0] = "b2_springAngleBendingModel";
        b2BendingModel2[b2BendingModel2["b2_pbdAngleBendingModel"] = 1] = "b2_pbdAngleBendingModel";
        b2BendingModel2[b2BendingModel2["b2_xpbdAngleBendingModel"] = 2] = "b2_xpbdAngleBendingModel";
        b2BendingModel2[b2BendingModel2["b2_pbdDistanceBendingModel"] = 3] = "b2_pbdDistanceBendingModel";
        b2BendingModel2[b2BendingModel2["b2_pbdHeightBendingModel"] = 4] = "b2_pbdHeightBendingModel";
        b2BendingModel2[b2BendingModel2["b2_pbdTriangleBendingModel"] = 5] = "b2_pbdTriangleBendingModel";
      })(b2BendingModel = exports.b2BendingModel || (exports.b2BendingModel = {}));
      var b2RopeTuning = class {
        constructor() {
          this.stretchingModel = b2StretchingModel.b2_pbdStretchingModel;
          this.bendingModel = b2BendingModel.b2_pbdAngleBendingModel;
          this.damping = 0;
          this.stretchStiffness = 1;
          this.stretchHertz = 0;
          this.stretchDamping = 0;
          this.bendStiffness = 0.5;
          this.bendHertz = 1;
          this.bendDamping = 0;
          this.isometric = false;
          this.fixedEffectiveMass = false;
          this.warmStart = false;
        }
        Copy(other) {
          this.stretchingModel = other.stretchingModel;
          this.bendingModel = other.bendingModel;
          this.damping = other.damping;
          this.stretchStiffness = other.stretchStiffness;
          this.stretchHertz = other.stretchHertz;
          this.stretchDamping = other.stretchDamping;
          this.bendStiffness = other.bendStiffness;
          this.bendHertz = other.bendHertz;
          this.bendDamping = other.bendDamping;
          this.isometric = other.isometric;
          this.fixedEffectiveMass = other.fixedEffectiveMass;
          this.warmStart = other.warmStart;
          return this;
        }
      };
      exports.b2RopeTuning = b2RopeTuning;
      var b2RopeStretch = class {
        constructor() {
          this.i1 = 0;
          this.i2 = 0;
          this.invMass1 = 0;
          this.invMass2 = 0;
          this.L = 0;
          this.lambda = 0;
          this.spring = 0;
          this.damper = 0;
        }
      };
      var b2RopeBend = class {
        constructor() {
          this.i1 = 0;
          this.i2 = 0;
          this.i3 = 0;
          this.invMass1 = 0;
          this.invMass2 = 0;
          this.invMass3 = 0;
          this.invEffectiveMass = 0;
          this.lambda = 0;
          this.L1 = 0;
          this.L2 = 0;
          this.alpha1 = 0;
          this.alpha2 = 0;
          this.spring = 0;
          this.damper = 0;
        }
      };
      var b2Rope = class {
        constructor(def) {
          this.m_position = new b2_math_1.b2Vec2();
          this.m_count = 0;
          this.m_stretchCount = 0;
          this.m_bendCount = 0;
          this.m_gravity = new b2_math_1.b2Vec2();
          this.m_tuning = new b2RopeTuning();
          (0, b2_common_1.b2Assert)(def.vertices.length >= 3);
          this.m_position.Copy(def.position);
          this.m_count = def.vertices.length;
          this.m_bindPositions = (0, b2_common_1.b2MakeArray)(this.m_count, b2_math_1.b2Vec2);
          this.m_ps = (0, b2_common_1.b2MakeArray)(this.m_count, b2_math_1.b2Vec2);
          this.m_p0s = (0, b2_common_1.b2MakeArray)(this.m_count, b2_math_1.b2Vec2);
          this.m_vs = (0, b2_common_1.b2MakeArray)(this.m_count, b2_math_1.b2Vec2);
          this.m_invMasses = (0, b2_common_1.b2MakeNumberArray)(this.m_count);
          for (let i = 0; i < this.m_count; ++i) {
            this.m_bindPositions[i].Copy(def.vertices[i]);
            b2_math_1.b2Vec2.Add(def.vertices[i], this.m_position, this.m_ps[i]);
            b2_math_1.b2Vec2.Add(def.vertices[i], this.m_position, this.m_p0s[i]);
            this.m_vs[i].SetZero();
            const m = def.masses[i];
            if (m > 0) {
              this.m_invMasses[i] = 1 / m;
            } else {
              this.m_invMasses[i] = 0;
            }
          }
          this.m_stretchCount = this.m_count - 1;
          this.m_bendCount = this.m_count - 2;
          this.m_stretchConstraints = new Array(this.m_stretchCount);
          for (let i = 0; i < this.m_stretchCount; i++) this.m_stretchConstraints[i] = new b2RopeStretch();
          this.m_bendConstraints = new Array(this.m_bendCount);
          for (let i = 0; i < this.m_bendCount; i++) this.m_bendConstraints[i] = new b2RopeBend();
          for (let i = 0; i < this.m_stretchCount; ++i) {
            const c = this.m_stretchConstraints[i];
            const p1 = this.m_ps[i];
            const p2 = this.m_ps[i + 1];
            c.i1 = i;
            c.i2 = i + 1;
            c.L = b2_math_1.b2Vec2.Distance(p1, p2);
            c.invMass1 = this.m_invMasses[i];
            c.invMass2 = this.m_invMasses[i + 1];
            c.lambda = 0;
            c.damper = 0;
            c.spring = 0;
          }
          const {J1, J2, r, e1, e2, Jd1, Jd2} = temp;
          for (let i = 0; i < this.m_bendCount; ++i) {
            const c = this.m_bendConstraints[i];
            const p1 = this.m_ps[i];
            const p2 = this.m_ps[i + 1];
            const p3 = this.m_ps[i + 2];
            c.i1 = i;
            c.i2 = i + 1;
            c.i3 = i + 2;
            c.invMass1 = this.m_invMasses[i];
            c.invMass2 = this.m_invMasses[i + 1];
            c.invMass3 = this.m_invMasses[i + 2];
            c.invEffectiveMass = 0;
            c.L1 = b2_math_1.b2Vec2.Distance(p1, p2);
            c.L2 = b2_math_1.b2Vec2.Distance(p2, p3);
            c.lambda = 0;
            b2_math_1.b2Vec2.Subtract(p2, p1, e1);
            b2_math_1.b2Vec2.Subtract(p3, p2, e2);
            const L1sqr = e1.LengthSquared();
            const L2sqr = e2.LengthSquared();
            if (L1sqr * L2sqr === 0) {
              continue;
            }
            b2_math_1.b2Vec2.Skew(e1, Jd1).Scale(-1 / L1sqr);
            b2_math_1.b2Vec2.Skew(e2, Jd2).Scale(1 / L2sqr);
            b2_math_1.b2Vec2.Negate(Jd1, J1);
            b2_math_1.b2Vec2.Subtract(Jd1, Jd2, J2);
            const J3 = Jd2;
            c.invEffectiveMass = c.invMass1 * b2_math_1.b2Vec2.Dot(J1, J1) + c.invMass2 * b2_math_1.b2Vec2.Dot(J2, J2) + c.invMass3 * b2_math_1.b2Vec2.Dot(J3, J3);
            b2_math_1.b2Vec2.Subtract(p3, p1, r);
            const rr = r.LengthSquared();
            if (rr === 0) {
              continue;
            }
            c.alpha1 = b2_math_1.b2Vec2.Dot(e2, r) / rr;
            c.alpha2 = b2_math_1.b2Vec2.Dot(e1, r) / rr;
          }
          this.m_gravity.Copy(def.gravity);
          this.SetTuning(def.tuning);
        }
        SetTuning(tuning) {
          this.m_tuning.Copy(tuning);
          const bendOmega = 2 * Math.PI * this.m_tuning.bendHertz;
          for (let i = 0; i < this.m_bendCount; ++i) {
            const c = this.m_bendConstraints[i];
            const L1sqr = c.L1 * c.L1;
            const L2sqr = c.L2 * c.L2;
            if (L1sqr * L2sqr === 0) {
              c.spring = 0;
              c.damper = 0;
              continue;
            }
            const J2 = 1 / c.L1 + 1 / c.L2;
            const sum = c.invMass1 / L1sqr + c.invMass2 * J2 * J2 + c.invMass3 / L2sqr;
            if (sum === 0) {
              c.spring = 0;
              c.damper = 0;
              continue;
            }
            const mass = 1 / sum;
            c.spring = mass * bendOmega * bendOmega;
            c.damper = 2 * mass * this.m_tuning.bendDamping * bendOmega;
          }
          const stretchOmega = 2 * Math.PI * this.m_tuning.stretchHertz;
          for (let i = 0; i < this.m_stretchCount; ++i) {
            const c = this.m_stretchConstraints[i];
            const sum = c.invMass1 + c.invMass2;
            if (sum === 0) {
              continue;
            }
            const mass = 1 / sum;
            c.spring = mass * stretchOmega * stretchOmega;
            c.damper = 2 * mass * this.m_tuning.stretchDamping * stretchOmega;
          }
        }
        Step(dt, iterations, position) {
          if (dt === 0) {
            return;
          }
          const inv_dt = 1 / dt;
          const d = Math.exp(-dt * this.m_tuning.damping);
          for (let i = 0; i < this.m_count; ++i) {
            if (this.m_invMasses[i] > 0) {
              this.m_vs[i].Scale(d);
              this.m_vs[i].AddScaled(dt, this.m_gravity);
            } else {
              this.m_vs[i].x = inv_dt * (this.m_bindPositions[i].x + position.x - this.m_p0s[i].x);
              this.m_vs[i].y = inv_dt * (this.m_bindPositions[i].y + position.y - this.m_p0s[i].y);
            }
          }
          if (this.m_tuning.bendingModel === b2BendingModel.b2_springAngleBendingModel) {
            this.ApplyBendForces(dt);
          }
          for (let i = 0; i < this.m_bendCount; ++i) {
            this.m_bendConstraints[i].lambda = 0;
          }
          for (let i = 0; i < this.m_stretchCount; ++i) {
            this.m_stretchConstraints[i].lambda = 0;
          }
          for (let i = 0; i < this.m_count; ++i) {
            this.m_ps[i].AddScaled(dt, this.m_vs[i]);
          }
          for (let i = 0; i < iterations; ++i) {
            if (this.m_tuning.bendingModel === b2BendingModel.b2_pbdAngleBendingModel) {
              this.SolveBend_PBD_Angle();
            } else if (this.m_tuning.bendingModel === b2BendingModel.b2_xpbdAngleBendingModel) {
              this.SolveBend_XPBD_Angle(dt);
            } else if (this.m_tuning.bendingModel === b2BendingModel.b2_pbdDistanceBendingModel) {
              this.SolveBend_PBD_Distance();
            } else if (this.m_tuning.bendingModel === b2BendingModel.b2_pbdHeightBendingModel) {
              this.SolveBend_PBD_Height();
            } else if (this.m_tuning.bendingModel === b2BendingModel.b2_pbdTriangleBendingModel) {
              this.SolveBend_PBD_Triangle();
            }
            if (this.m_tuning.stretchingModel === b2StretchingModel.b2_pbdStretchingModel) {
              this.SolveStretch_PBD();
            } else if (this.m_tuning.stretchingModel === b2StretchingModel.b2_xpbdStretchingModel) {
              this.SolveStretch_XPBD(dt);
            }
          }
          for (let i = 0; i < this.m_count; ++i) {
            this.m_vs[i].x = inv_dt * (this.m_ps[i].x - this.m_p0s[i].x);
            this.m_vs[i].y = inv_dt * (this.m_ps[i].y - this.m_p0s[i].y);
            this.m_p0s[i].Copy(this.m_ps[i]);
          }
        }
        Reset(position) {
          this.m_position.Copy(position);
          for (let i = 0; i < this.m_count; ++i) {
            b2_math_1.b2Vec2.Add(this.m_bindPositions[i], this.m_position, this.m_ps[i]);
            this.m_p0s[i].Copy(this.m_ps[i]);
            this.m_vs[i].SetZero();
          }
          for (let i = 0; i < this.m_bendCount; ++i) {
            this.m_bendConstraints[i].lambda = 0;
          }
          for (let i = 0; i < this.m_stretchCount; ++i) {
            this.m_stretchConstraints[i].lambda = 0;
          }
        }
        SolveStretch_PBD() {
          const stiffness = this.m_tuning.stretchStiffness;
          const {d} = temp;
          for (let i = 0; i < this.m_stretchCount; ++i) {
            const c = this.m_stretchConstraints[i];
            const p1 = this.m_ps[c.i1];
            const p2 = this.m_ps[c.i2];
            b2_math_1.b2Vec2.Subtract(p2, p1, d);
            const L = d.Normalize();
            const sum = c.invMass1 + c.invMass2;
            if (sum === 0) {
              continue;
            }
            const s1 = c.invMass1 / sum;
            const s2 = c.invMass2 / sum;
            p1.SubtractScaled(stiffness * s1 * (c.L - L), d);
            p2.AddScaled(stiffness * s2 * (c.L - L), d);
          }
        }
        SolveStretch_XPBD(dt) {
          const {dp1, dp2, u, J1} = temp;
          for (let i = 0; i < this.m_stretchCount; ++i) {
            const c = this.m_stretchConstraints[i];
            const p1 = this.m_ps[c.i1];
            const p2 = this.m_ps[c.i2];
            b2_math_1.b2Vec2.Subtract(p1, this.m_p0s[c.i1], dp1);
            b2_math_1.b2Vec2.Subtract(p2, this.m_p0s[c.i2], dp2);
            b2_math_1.b2Vec2.Subtract(p2, p1, u);
            const L = u.Normalize();
            b2_math_1.b2Vec2.Negate(u, J1);
            const J2 = u;
            const sum = c.invMass1 + c.invMass2;
            if (sum === 0) {
              continue;
            }
            const alpha = 1 / (c.spring * dt * dt);
            const beta = dt * dt * c.damper;
            const sigma = alpha * beta / dt;
            const C = L - c.L;
            const Cdot = b2_math_1.b2Vec2.Dot(J1, dp1) + b2_math_1.b2Vec2.Dot(J2, dp2);
            const B = C + alpha * c.lambda + sigma * Cdot;
            const sum2 = (1 + sigma) * sum + alpha;
            const impulse = -B / sum2;
            p1.AddScaled(c.invMass1 * impulse, J1);
            p2.AddScaled(c.invMass2 * impulse, J2);
            c.lambda += impulse;
          }
        }
        SolveBend_PBD_Angle() {
          const stiffness = this.m_tuning.bendStiffness;
          const {Jd1, Jd2, J1, J2, d1, d2} = temp;
          for (let i = 0; i < this.m_bendCount; ++i) {
            const c = this.m_bendConstraints[i];
            const p1 = this.m_ps[c.i1];
            const p2 = this.m_ps[c.i2];
            const p3 = this.m_ps[c.i3];
            b2_math_1.b2Vec2.Subtract(p2, p1, d1);
            b2_math_1.b2Vec2.Subtract(p3, p2, d2);
            const a = b2_math_1.b2Vec2.Cross(d1, d2);
            const b = b2_math_1.b2Vec2.Dot(d1, d2);
            const angle = Math.atan2(a, b);
            let L1sqr;
            let L2sqr;
            if (this.m_tuning.isometric) {
              L1sqr = c.L1 * c.L1;
              L2sqr = c.L2 * c.L2;
            } else {
              L1sqr = d1.LengthSquared();
              L2sqr = d2.LengthSquared();
            }
            if (L1sqr * L2sqr === 0) {
              continue;
            }
            b2_math_1.b2Vec2.Skew(d1, Jd1).Scale(-1 / L1sqr);
            b2_math_1.b2Vec2.Skew(d2, Jd2).Scale(1 / L2sqr);
            b2_math_1.b2Vec2.Negate(Jd1, J1);
            b2_math_1.b2Vec2.Subtract(Jd1, Jd2, J2);
            const J3 = Jd2;
            let sum;
            if (this.m_tuning.fixedEffectiveMass) {
              sum = c.invEffectiveMass;
            } else {
              sum = c.invMass1 * b2_math_1.b2Vec2.Dot(J1, J1) + c.invMass2 * b2_math_1.b2Vec2.Dot(J2, J2) + c.invMass3 * b2_math_1.b2Vec2.Dot(J3, J3);
            }
            if (sum === 0) {
              sum = c.invEffectiveMass;
            }
            const impulse = -stiffness * angle / sum;
            p1.AddScaled(c.invMass1 * impulse, J1);
            p2.AddScaled(c.invMass2 * impulse, J2);
            p3.AddScaled(c.invMass3 * impulse, J3);
          }
        }
        SolveBend_XPBD_Angle(dt) {
          const {dp1, dp2, dp3, d1, d2, Jd1, Jd2, J1, J2} = temp;
          for (let i = 0; i < this.m_bendCount; ++i) {
            const c = this.m_bendConstraints[i];
            const p1 = this.m_ps[c.i1];
            const p2 = this.m_ps[c.i2];
            const p3 = this.m_ps[c.i3];
            b2_math_1.b2Vec2.Subtract(p1, this.m_p0s[c.i1], dp1);
            b2_math_1.b2Vec2.Subtract(p2, this.m_p0s[c.i2], dp2);
            b2_math_1.b2Vec2.Subtract(p3, this.m_p0s[c.i3], dp3);
            b2_math_1.b2Vec2.Subtract(p2, p1, d1);
            b2_math_1.b2Vec2.Subtract(p3, p2, d2);
            let L1sqr;
            let L2sqr;
            if (this.m_tuning.isometric) {
              L1sqr = c.L1 * c.L1;
              L2sqr = c.L2 * c.L2;
            } else {
              L1sqr = d1.LengthSquared();
              L2sqr = d2.LengthSquared();
            }
            if (L1sqr * L2sqr === 0) {
              continue;
            }
            const a = b2_math_1.b2Vec2.Cross(d1, d2);
            const b = b2_math_1.b2Vec2.Dot(d1, d2);
            const angle = Math.atan2(a, b);
            b2_math_1.b2Vec2.Skew(d1, Jd1).Scale(-1 / L1sqr);
            b2_math_1.b2Vec2.Skew(d2, Jd2).Scale(1 / L2sqr);
            b2_math_1.b2Vec2.Negate(Jd1, J1);
            b2_math_1.b2Vec2.Subtract(Jd1, Jd2, J2);
            const J3 = Jd2;
            let sum;
            if (this.m_tuning.fixedEffectiveMass) {
              sum = c.invEffectiveMass;
            } else {
              sum = c.invMass1 * b2_math_1.b2Vec2.Dot(J1, J1) + c.invMass2 * b2_math_1.b2Vec2.Dot(J2, J2) + c.invMass3 * b2_math_1.b2Vec2.Dot(J3, J3);
            }
            if (sum === 0) {
              continue;
            }
            const alpha = 1 / (c.spring * dt * dt);
            const beta = dt * dt * c.damper;
            const sigma = alpha * beta / dt;
            const C = angle;
            const Cdot = b2_math_1.b2Vec2.Dot(J1, dp1) + b2_math_1.b2Vec2.Dot(J2, dp2) + b2_math_1.b2Vec2.Dot(J3, dp3);
            const B = C + alpha * c.lambda + sigma * Cdot;
            const sum2 = (1 + sigma) * sum + alpha;
            const impulse = -B / sum2;
            p1.AddScaled(c.invMass1 * impulse, J1);
            p2.AddScaled(c.invMass2 * impulse, J2);
            p3.AddScaled(c.invMass3 * impulse, J3);
            c.lambda += impulse;
          }
        }
        SolveBend_PBD_Distance() {
          const stiffness = this.m_tuning.bendStiffness;
          const {d} = temp;
          for (let i = 0; i < this.m_bendCount; ++i) {
            const c = this.m_bendConstraints[i];
            const {i1} = c;
            const i2 = c.i3;
            const p1 = this.m_ps[i1];
            const p2 = this.m_ps[i2];
            b2_math_1.b2Vec2.Subtract(p2, p1, d);
            const L = d.Normalize();
            const sum = c.invMass1 + c.invMass3;
            if (sum === 0) {
              continue;
            }
            const s1 = c.invMass1 / sum;
            const s2 = c.invMass3 / sum;
            p1.SubtractScaled(stiffness * s1 * (c.L1 + c.L2 - L), d);
            p2.AddScaled(stiffness * s2 * (c.L1 + c.L2 - L), d);
          }
        }
        SolveBend_PBD_Height() {
          const stiffness = this.m_tuning.bendStiffness;
          const {dHat, J1, J2, J3, d} = temp;
          for (let i = 0; i < this.m_bendCount; ++i) {
            const c = this.m_bendConstraints[i];
            const p1 = this.m_ps[c.i1];
            const p2 = this.m_ps[c.i2];
            const p3 = this.m_ps[c.i3];
            d.x = c.alpha1 * p1.x + c.alpha2 * p3.x - p2.x;
            d.y = c.alpha1 * p1.y + c.alpha2 * p3.y - p2.y;
            const dLen = d.Length();
            if (dLen === 0) {
              continue;
            }
            b2_math_1.b2Vec2.Scale(1 / dLen, d, dHat);
            b2_math_1.b2Vec2.Scale(c.alpha1, dHat, J1);
            b2_math_1.b2Vec2.Negate(dHat, J2);
            b2_math_1.b2Vec2.Scale(c.alpha2, dHat, J3);
            const sum = c.invMass1 * c.alpha1 * c.alpha1 + c.invMass2 + c.invMass3 * c.alpha2 * c.alpha2;
            if (sum === 0) {
              continue;
            }
            const C = dLen;
            const mass = 1 / sum;
            const impulse = -stiffness * mass * C;
            p1.AddScaled(c.invMass1 * impulse, J1);
            p2.AddScaled(c.invMass2 * impulse, J2);
            p3.AddScaled(c.invMass3 * impulse, J3);
          }
        }
        SolveBend_PBD_Triangle() {
          const stiffness = this.m_tuning.bendStiffness;
          const {d} = temp;
          for (let i = 0; i < this.m_bendCount; ++i) {
            const c = this.m_bendConstraints[i];
            const b0 = this.m_ps[c.i1];
            const v = this.m_ps[c.i2];
            const b1 = this.m_ps[c.i3];
            const wb0 = c.invMass1;
            const wv = c.invMass2;
            const wb1 = c.invMass3;
            const W = wb0 + wb1 + 2 * wv;
            const invW = stiffness / W;
            d.x = v.x - 1 / 3 * (b0.x + v.x + b1.x);
            d.y = v.y - 1 / 3 * (b0.y + v.y + b1.y);
            b0.AddScaled(2 * wb0 * invW, d);
            v.AddScaled(-4 * wv * invW, d);
            b1.AddScaled(2 * wb1 * invW, d);
          }
        }
        ApplyBendForces(dt) {
          const omega = 2 * Math.PI * this.m_tuning.bendHertz;
          const {d1, d2, Jd1, Jd2, J1, J2} = temp;
          for (let i = 0; i < this.m_bendCount; ++i) {
            const c = this.m_bendConstraints[i];
            const p1 = this.m_ps[c.i1];
            const p2 = this.m_ps[c.i2];
            const p3 = this.m_ps[c.i3];
            const v1 = this.m_vs[c.i1];
            const v2 = this.m_vs[c.i2];
            const v3 = this.m_vs[c.i3];
            b2_math_1.b2Vec2.Subtract(p2, p1, d1);
            b2_math_1.b2Vec2.Subtract(p3, p2, d2);
            let L1sqr;
            let L2sqr;
            if (this.m_tuning.isometric) {
              L1sqr = c.L1 * c.L1;
              L2sqr = c.L2 * c.L2;
            } else {
              L1sqr = d1.LengthSquared();
              L2sqr = d2.LengthSquared();
            }
            if (L1sqr * L2sqr === 0) {
              continue;
            }
            const a = b2_math_1.b2Vec2.Cross(d1, d2);
            const b = b2_math_1.b2Vec2.Dot(d1, d2);
            const angle = Math.atan2(a, b);
            b2_math_1.b2Vec2.Skew(d1, Jd1).Scale(-1 / L1sqr);
            b2_math_1.b2Vec2.Skew(d2, Jd2).Scale(1 / L2sqr);
            b2_math_1.b2Vec2.Negate(Jd1, J1);
            b2_math_1.b2Vec2.Subtract(Jd1, Jd2, J2);
            const J3 = Jd2;
            let sum;
            if (this.m_tuning.fixedEffectiveMass) {
              sum = c.invEffectiveMass;
            } else {
              sum = c.invMass1 * b2_math_1.b2Vec2.Dot(J1, J1) + c.invMass2 * b2_math_1.b2Vec2.Dot(J2, J2) + c.invMass3 * b2_math_1.b2Vec2.Dot(J3, J3);
            }
            if (sum === 0) {
              continue;
            }
            const mass = 1 / sum;
            const spring = mass * omega * omega;
            const damper = 2 * mass * this.m_tuning.bendDamping * omega;
            const C = angle;
            const Cdot = b2_math_1.b2Vec2.Dot(J1, v1) + b2_math_1.b2Vec2.Dot(J2, v2) + b2_math_1.b2Vec2.Dot(J3, v3);
            const impulse = -dt * (spring * C + damper * Cdot);
            this.m_vs[c.i1].AddScaled(c.invMass1 * impulse, J1);
            this.m_vs[c.i2].AddScaled(c.invMass2 * impulse, J2);
            this.m_vs[c.i3].AddScaled(c.invMass3 * impulse, J3);
          }
        }
        Draw(draw) {
          for (let i = 0; i < this.m_count - 1; ++i) {
            draw.DrawSegment(this.m_ps[i], this.m_ps[i + 1], b2_draw_1.debugColors.rope);
            const pc2 = this.m_invMasses[i] > 0 ? b2_draw_1.debugColors.ropePointD : b2_draw_1.debugColors.ropePointG;
            draw.DrawPoint(this.m_ps[i], 5, pc2);
          }
          const pc = this.m_invMasses[this.m_count - 1] > 0 ? b2_draw_1.debugColors.ropePointD : b2_draw_1.debugColors.ropePointG;
          draw.DrawPoint(this.m_ps[this.m_count - 1], 5, pc);
        }
      };
      exports.b2Rope = b2Rope;
    }
  });
  var require_dist = __commonJS({
    "node_modules/@box2d/core/dist/index.js"(exports) {
      "use strict";
      init_define_process();
      var __createBinding = exports && exports.__createBinding || (Object.create ? function (o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || (("get" in desc) ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            }
          };
        }
        Object.defineProperty(o, k2, desc);
      } : function (o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || (function (m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      });
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b2GetBlockSolve = exports.b2SetBlockSolve = exports.b2World = exports.b2BodyType = exports.b2Body = void 0;
      __exportStar(require_b2_common(), exports);
      __exportStar(require_b2_settings(), exports);
      __exportStar(require_b2_math(), exports);
      __exportStar(require_b2_draw(), exports);
      __exportStar(require_b2_draw_helper(), exports);
      __exportStar(require_b2_timer(), exports);
      __exportStar(require_b2_augment(), exports);
      __exportStar(require_b2_collision(), exports);
      __exportStar(require_b2_distance(), exports);
      __exportStar(require_b2_broad_phase(), exports);
      __exportStar(require_b2_dynamic_tree(), exports);
      __exportStar(require_b2_time_of_impact(), exports);
      __exportStar(require_b2_collide_circle(), exports);
      __exportStar(require_b2_collide_polygon(), exports);
      __exportStar(require_b2_collide_edge(), exports);
      __exportStar(require_b2_shape(), exports);
      __exportStar(require_b2_circle_shape(), exports);
      __exportStar(require_b2_polygon_shape(), exports);
      __exportStar(require_b2_edge_shape(), exports);
      __exportStar(require_b2_chain_shape(), exports);
      __exportStar(require_b2_fixture(), exports);
      var b2_body_1 = require_b2_body();
      Object.defineProperty(exports, "b2Body", {
        enumerable: true,
        get: function () {
          return b2_body_1.b2Body;
        }
      });
      Object.defineProperty(exports, "b2BodyType", {
        enumerable: true,
        get: function () {
          return b2_body_1.b2BodyType;
        }
      });
      var b2_world_1 = require_b2_world();
      Object.defineProperty(exports, "b2World", {
        enumerable: true,
        get: function () {
          return b2_world_1.b2World;
        }
      });
      __exportStar(require_b2_world_callbacks(), exports);
      __exportStar(require_b2_time_step(), exports);
      __exportStar(require_b2_contact_manager(), exports);
      __exportStar(require_b2_contact(), exports);
      __exportStar(require_b2_contact_factory(), exports);
      var b2_contact_solver_1 = require_b2_contact_solver();
      Object.defineProperty(exports, "b2SetBlockSolve", {
        enumerable: true,
        get: function () {
          return b2_contact_solver_1.b2SetBlockSolve;
        }
      });
      Object.defineProperty(exports, "b2GetBlockSolve", {
        enumerable: true,
        get: function () {
          return b2_contact_solver_1.b2GetBlockSolve;
        }
      });
      __exportStar(require_b2_joint(), exports);
      __exportStar(require_b2_area_joint(), exports);
      __exportStar(require_b2_distance_joint(), exports);
      __exportStar(require_b2_friction_joint(), exports);
      __exportStar(require_b2_gear_joint(), exports);
      __exportStar(require_b2_motor_joint(), exports);
      __exportStar(require_b2_mouse_joint(), exports);
      __exportStar(require_b2_prismatic_joint(), exports);
      __exportStar(require_b2_pulley_joint(), exports);
      __exportStar(require_b2_revolute_joint(), exports);
      __exportStar(require_b2_weld_joint(), exports);
      __exportStar(require_b2_wheel_joint(), exports);
      __exportStar(require_b2_rope(), exports);
    }
  });
  var physics_2d_exports = {};
  __export(physics_2d_exports, {
    add_box_object: () => add_box_object,
    add_circle_object: () => add_circle_object,
    add_triangle_object: () => add_triangle_object,
    add_vector: () => add_vector,
    add_wall: () => add_wall,
    apply_force: () => apply_force,
    apply_force_to_center: () => apply_force_to_center,
    array_to_vector: () => array_to_vector,
    get_angular_velocity: () => get_angular_velocity,
    get_position: () => get_position,
    get_rotation: () => get_rotation,
    get_velocity: () => get_velocity,
    impact_start_time: () => impact_start_time,
    is_touching: () => is_touching,
    make_force: () => make_force,
    make_ground: () => make_ground,
    make_vector: () => make_vector,
    scale_size: () => scale_size,
    set_angular_velocity: () => set_angular_velocity,
    set_density: () => set_density,
    set_friction: () => set_friction,
    set_gravity: () => set_gravity,
    set_position: () => set_position,
    set_rotation: () => set_rotation,
    set_velocity: () => set_velocity,
    simulate_world: () => simulate_world,
    subtract_vector: () => subtract_vector,
    update_world: () => update_world,
    vector_to_array: () => vector_to_array
  });
  init_define_process();
  init_define_process();
  var import_context = __toESM(__require("js-slang/context"), 1);
  var import_core4 = __toESM(require_dist(), 1);
  init_define_process();
  var import_core = __toESM(require_dist(), 1);
  var ACCURACY = 2;
  var Vector2 = class extends import_core.b2Vec2 {
    constructor() {
      super(...arguments);
      this.toReplString = () => `Vector2D: [${this.x}, ${this.y}]`;
    }
  };
  var Timer = class {
    constructor() {
      this.time = 0;
    }
    step(dt) {
      this.time += dt;
      return this.time;
    }
    getTime() {
      return this.time;
    }
    toString() {
      return `${this.time.toFixed(4)}`;
    }
  };
  init_define_process();
  var import_core2 = __toESM(require_dist(), 1);
  var PhysicsObject = class {
    constructor(position, rotation, shape, isStatic, world2) {
      this.forcesCentered = [];
      this.forcesAtAPoint = [];
      this.toReplString = () => `
  Mass: ${this.getMass().toFixed(ACCURACY)}
  Position: [${this.getPosition().x.toFixed(ACCURACY)},${this.getPosition().y.toFixed(ACCURACY)}]
  Velocity: [${this.getVelocity().x.toFixed(ACCURACY)},${this.getVelocity().y.toFixed(ACCURACY)}] 
  
  Rotation: ${this.getRotation().toFixed(ACCURACY)}
  AngularVelocity: [${this.getAngularVelocity().toFixed(ACCURACY)}]`;
      this.body = world2.createBody({
        type: isStatic ? import_core2.b2BodyType.b2_staticBody : import_core2.b2BodyType.b2_dynamicBody,
        position,
        angle: rotation
      });
      this.shape = shape;
      this.fixture = this.body.CreateFixture({
        shape: this.shape,
        density: 1,
        friction: 1
      });
    }
    getFixture() {
      return this.fixture;
    }
    getMass() {
      return this.body.GetMass();
    }
    setDensity(density) {
      this.fixture.SetDensity(density);
      this.body.ResetMassData();
    }
    setFriction(friction) {
      this.fixture.SetFriction(friction);
    }
    getPosition() {
      return this.body.GetPosition();
    }
    setPosition(pos) {
      this.body.SetTransformVec(pos, this.getRotation());
    }
    getRotation() {
      return this.body.GetAngle();
    }
    setRotation(rot) {
      this.body.SetAngle(rot);
    }
    getVelocity() {
      return this.body.GetLinearVelocity();
    }
    setVelocity(velc) {
      this.body.SetLinearVelocity(velc);
    }
    getAngularVelocity() {
      return this.body.GetAngularVelocity();
    }
    setAngularVelocity(velc) {
      this.body.SetAngularVelocity(velc);
    }
    addForceCentered(force) {
      this.forcesCentered.push(force);
    }
    addForceAtAPoint(force, pos) {
      this.forcesAtAPoint.push({
        force,
        pos
      });
    }
    applyForcesToCenter(world_time) {
      this.forcesCentered = this.forcesCentered.filter(force => force.start_time + force.duration > world_time);
      const resForce = this.forcesCentered.filter(force => force.start_time < world_time).reduce((res, force) => res.Add(force.direction.Scale(force.magnitude)), new import_core2.b2Vec2());
      this.body.ApplyForceToCenter(resForce);
    }
    applyForcesAtAPoint(world_time) {
      this.forcesAtAPoint = this.forcesAtAPoint.filter(forceWithPos => forceWithPos.force.start_time + forceWithPos.force.duration > world_time);
      this.forcesAtAPoint.forEach(forceWithPos => {
        const force = forceWithPos.force;
        this.body.ApplyForce(force.direction.Scale(force.magnitude), forceWithPos.pos);
      });
    }
    applyForces(world_time) {
      this.applyForcesToCenter(world_time);
      this.applyForcesAtAPoint(world_time);
    }
    isTouching(obj2) {
      let ce = this.body.GetContactList();
      while (ce !== null) {
        if (ce.other === obj2.body && ce.contact.IsTouching()) {
          return true;
        }
        ce = ce.next;
      }
      return false;
    }
    scale_size(scale) {
      if (this.shape instanceof import_core2.b2CircleShape) {
        this.shape.m_radius *= scale;
      } else if (this.shape instanceof import_core2.b2PolygonShape) {
        const centroid = this.shape.m_centroid;
        const arr = [];
        this.shape.m_vertices.forEach(vec => {
          arr.push(new import_core2.b2Vec2(centroid.x + scale * (vec.x - centroid.x), centroid.y + scale * (vec.y - centroid.y)));
        });
        this.shape = new import_core2.b2PolygonShape().Set(arr);
      }
      const f = this.fixture;
      this.body.DestroyFixture(this.fixture);
      this.fixture = this.body.CreateFixture({
        shape: this.shape,
        density: f.GetDensity(),
        friction: f.GetFriction()
      });
    }
  };
  init_define_process();
  var import_core3 = __toESM(require_dist(), 1);
  var PhysicsWorld = class {
    constructor() {
      this.iterationsConfig = {
        velocityIterations: 8,
        positionIterations: 3
      };
      this.b2World = import_core3.b2World.Create(new import_core3.b2Vec2());
      this.physicsObjects = [];
      this.timer = new Timer();
      this.touchingObjects = new Map();
      const contactListener = new import_core3.b2ContactListener();
      contactListener.BeginContact = contact => {
        const m = this.touchingObjects.get(contact.GetFixtureA());
        if (m === void 0) {
          const newMap = new Map();
          newMap.set(contact.GetFixtureB(), this.timer.getTime());
          this.touchingObjects.set(contact.GetFixtureA(), newMap);
        } else {
          m.set(contact.GetFixtureB(), this.timer.getTime());
        }
      };
      contactListener.EndContact = contact => {
        const contacts = this.touchingObjects.get(contact.GetFixtureA());
        if (contacts) {
          contacts.delete(contact.GetFixtureB());
        }
      };
      this.b2World.SetContactListener(contactListener);
    }
    setGravity(gravity) {
      this.b2World.SetGravity(gravity);
    }
    addObject(obj) {
      this.physicsObjects.push(obj);
      return obj;
    }
    createBody(bodyDef) {
      return this.b2World.CreateBody(bodyDef);
    }
    makeGround(height, friction) {
      const groundBody = this.createBody({
        type: import_core3.b2BodyType.b2_staticBody,
        position: new import_core3.b2Vec2(0, height - 10)
      });
      const groundShape = new import_core3.b2PolygonShape().SetAsBox(1e4, 10);
      groundBody.CreateFixture({
        shape: groundShape,
        density: 1,
        friction
      });
    }
    update(dt) {
      for (const obj of this.physicsObjects) {
        obj.applyForces(this.timer.getTime());
      }
      this.b2World.Step(dt, this.iterationsConfig);
      this.timer.step(dt);
    }
    simulate(total_time) {
      const dt = 0.01;
      for (let i = 0; i < total_time; i += dt) {
        this.update(dt);
      }
    }
    getB2World() {
      return this.b2World;
    }
    getWorldStatus() {
      let world_status = `
  World time: ${this.timer.toString()}
  
  Objects:
      `;
      this.physicsObjects.forEach(obj => {
        world_status += `
  ------------------------
  ${obj.toReplString()}
  ------------------------
        `;
      });
      return world_status;
    }
    findImpact(obj1, obj2) {
      const m = this.touchingObjects.get(obj1.getFixture());
      if (m === void 0) {
        return -1;
      }
      const time = m.get(obj2.getFixture());
      if (time === void 0) {
        return -1;
      }
      return time;
    }
  };
  var world = null;
  var NO_WORLD = new Error("Please call set_gravity first!");
  var MULTIPLE_WORLDS = new Error("You may only call set_gravity once!");
  function make_vector(x, y) {
    return new Vector2(x, y);
  }
  function make_force(dir, mag, dur, start) {
    let force = {
      direction: dir,
      magnitude: mag,
      duration: dur,
      start_time: start
    };
    return force;
  }
  function set_gravity(v) {
    if (world) {
      throw MULTIPLE_WORLDS;
    }
    world = new PhysicsWorld();
    import_context.default.moduleContexts.physics_2d.state = {
      world
    };
    world.setGravity(v);
  }
  function make_ground(height, friction) {
    if (!world) {
      throw NO_WORLD;
    }
    world.makeGround(height, friction);
  }
  function add_wall(pos, rot, size) {
    if (!world) {
      throw NO_WORLD;
    }
    return world.addObject(new PhysicsObject(pos, rot, new import_core4.b2PolygonShape().SetAsBox(size.x / 2, size.y / 2), true, world));
  }
  function add_box_object(pos, rot, velc, size, isStatic) {
    if (!world) {
      throw NO_WORLD;
    }
    const newObj = new PhysicsObject(pos, rot, new import_core4.b2PolygonShape().SetAsBox(size.x / 2, size.y / 2), isStatic, world);
    newObj.setVelocity(velc);
    return world.addObject(newObj);
  }
  function add_circle_object(pos, rot, velc, radius, isStatic) {
    if (!world) {
      throw NO_WORLD;
    }
    const newObj = new PhysicsObject(pos, rot, new import_core4.b2CircleShape().Set(new Vector2(), radius), isStatic, world);
    newObj.setVelocity(velc);
    return world.addObject(newObj);
  }
  function add_triangle_object(pos, rot, velc, base, height, isStatic) {
    if (!world) {
      throw NO_WORLD;
    }
    const newObj = new PhysicsObject(pos, rot, new import_core4.b2PolygonShape().Set([new Vector2(-base / 2, -height / 2), new Vector2(base / 2, -height / 2), new Vector2(0, height / 2)]), isStatic, world);
    newObj.setVelocity(velc);
    return world.addObject(newObj);
  }
  function update_world(dt) {
    if (!world) {
      throw NO_WORLD;
    }
    world.update(dt);
  }
  function simulate_world(total_time) {
    if (!world) {
      throw NO_WORLD;
    }
    world.simulate(total_time);
  }
  function get_position(obj) {
    return new Vector2(obj.getPosition().x, obj.getPosition().y);
  }
  function get_rotation(obj) {
    return obj.getRotation();
  }
  function get_velocity(obj) {
    return new Vector2(obj.getVelocity().x, obj.getVelocity().y);
  }
  function get_angular_velocity(obj) {
    return new Vector2(obj.getAngularVelocity());
  }
  function set_position(obj, pos) {
    obj.setPosition(pos);
  }
  function set_rotation(obj, rot) {
    obj.setRotation(rot);
  }
  function set_velocity(obj, velc) {
    obj.setVelocity(velc);
  }
  function set_angular_velocity(obj, velc) {
    return obj.setAngularVelocity(velc);
  }
  function set_density(obj, density) {
    obj.setDensity(density);
  }
  function scale_size(obj, scale) {
    if (!world) {
      throw NO_WORLD;
    }
    obj.scale_size(scale);
  }
  function set_friction(obj, friction) {
    obj.setFriction(friction);
  }
  function is_touching(obj1, obj2) {
    return obj1.isTouching(obj2);
  }
  function impact_start_time(obj1, obj2) {
    if (!world) {
      throw NO_WORLD;
    }
    return world.findImpact(obj1, obj2);
  }
  function apply_force_to_center(force, obj) {
    obj.addForceCentered(force);
  }
  function apply_force(force, pos, obj) {
    obj.addForceAtAPoint(force, pos);
  }
  function vector_to_array(vec) {
    return [vec.x, vec.y];
  }
  function array_to_vector([x, y]) {
    return new Vector2(x, y);
  }
  function add_vector(vec1, vec2) {
    return new Vector2(vec1.x + vec2.x, vec1.y + vec2.y);
  }
  function subtract_vector(vec1, vec2) {
    return new Vector2(vec1.x - vec2.x, vec1.y - vec2.y);
  }
  return __toCommonJS(physics_2d_exports);
}