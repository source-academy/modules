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
  function throwIfNotRune(name) {
    var runes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      runes[_i - 1] = arguments[_i];
    }
    runes.forEach(function (rune) {
      if (!(typeof rune === "string")) {
        throw Error(("").concat(name, " expects a rune (string) as argument."));
      }
    });
  }
  var getSquare = function getSquare() {
    return "square";
  };
  var getBlank = function getBlank() {
    return "blank";
  };
  var getRcross = function getRcross() {
    return "rcross";
  };
  var getSail = function getSail() {
    return "sail";
  };
  var getTriangle = function getTriangle() {
    return "triangle";
  };
  var getCorner = function getCorner() {
    return "corner";
  };
  var getNova = function getNova() {
    return "nova";
  };
  var getCircle = function getCircle() {
    return "circle";
  };
  var getHeart = function getHeart() {
    return "heart";
  };
  var getPentagram = function getPentagram() {
    return "pentagram";
  };
  var getRibbon = function getRibbon() {
    return "ribbon";
  };
  var square = getSquare();
  var blank = getBlank();
  var rcross = getRcross();
  var sail = getSail();
  var triangle = getTriangle();
  var corner = getCorner();
  var nova = getNova();
  var circle = getCircle();
  var heart = getHeart();
  var pentagram = getPentagram();
  var ribbon = getRibbon();
  function from_url(imageUrl) {
    return ("url(").concat(imageUrl, ")");
  }
  function scale_independent(ratio_x, ratio_y, rune) {
    throwIfNotRune("scale_independent", rune);
    return ("scaled(").concat(rune, ", ").concat(ratio_x, ", ").concat(ratio_y, ")");
  }
  function scale(ratio, rune) {
    throwIfNotRune("scale", rune);
    return scale_independent(ratio, ratio, rune);
  }
  function translate(x, y, rune) {
    throwIfNotRune("translate", rune);
    return ("translated(").concat(rune, ", ").concat(x, ", ").concat(y, ")");
  }
  function rotate(rad, rune) {
    throwIfNotRune("rotate", rune);
    return ("rotated(").concat(rune, ", ").concat(rad, ")");
  }
  function stack_frac(frac, rune1, rune2) {
    throwIfNotRune("stack_frac", rune1);
    throwIfNotRune("stack_frac", rune2);
    return ("stack_frac(").concat(frac, ", ").concat(rune1, ", ").concat(rune2, ")");
  }
  function stack(rune1, rune2) {
    throwIfNotRune("stack", rune1, rune2);
    return ("stack(").concat(rune1, ", ").concat(rune2, ")");
  }
  function stackn(n, rune) {
    throwIfNotRune("stackn", rune);
    return ("stackn(").concat(n, ", ").concat(rune, ")");
  }
  function quarter_turn_right(rune) {
    throwIfNotRune("quarter_turn_right", rune);
    return ("quarter_turn_right(").concat(rune, ")");
  }
  function quarter_turn_left(rune) {
    throwIfNotRune("quarter_turn_left", rune);
    return ("quarter_turn_left(").concat(rune, ")");
  }
  function turn_upside_down(rune) {
    throwIfNotRune("turn_upside_down", rune);
    return ("quarter_upside_down(").concat(rune, ")");
  }
  function beside_frac(frac, rune1, rune2) {
    throwIfNotRune("beside_frac", rune1, rune2);
    return ("beside_frac(").concat(frac, ", ").concat(rune1, ", ").concat(rune2, ")");
  }
  function beside(rune1, rune2) {
    throwIfNotRune("beside", rune1, rune2);
    return ("stack(").concat(rune1, ", ").concat(rune2, ")");
  }
  function flip_vert(rune) {
    throwIfNotRune("flip_vert", rune);
    return ("flip_vert(").concat(rune, ")");
  }
  function flip_horiz(rune) {
    throwIfNotRune("flip_horiz", rune);
    return ("flip_horiz(").concat(rune, ")");
  }
  function make_cross(rune) {
    throwIfNotRune("make_cross", rune);
    return stack(beside(quarter_turn_right(rune), turn_upside_down(rune)), beside(rune, quarter_turn_left(rune)));
  }
  function repeat_pattern(n, pattern, initial) {
    if (n === 0) {
      return initial;
    }
    return pattern(repeat_pattern(n - 1, pattern, initial));
  }
  function overlay_frac(frac, rune1, rune2) {
    throwIfNotRune("overlay_frac", rune1);
    throwIfNotRune("overlay_frac", rune2);
    return ("overlay_frac(").concat(frac, ", ").concat(rune1, ", ").concat(rune2, ")");
  }
  function overlay(rune1, rune2) {
    throwIfNotRune("overlay", rune1);
    throwIfNotRune("overlay", rune2);
    return ("overlay(").concat(rune1, ", ").concat(rune2, ")");
  }
  function color(rune, r, g, b) {
    throwIfNotRune("color", rune);
    return ("color(").concat(rune, ", ").concat(r, ", ").concat(g, ", ").concat(b, ")");
  }
  function random_color(rune) {
    throwIfNotRune("random_color", rune);
    return ("random(").concat(rune, ")");
  }
  function red(rune) {
    throwIfNotRune("red", rune);
    return ("red(").concat(rune, ")");
  }
  function pink(rune) {
    throwIfNotRune("pink", rune);
    return ("pink(").concat(rune, ")");
  }
  function purple(rune) {
    throwIfNotRune("purple", rune);
    return ("purple(").concat(rune, ")");
  }
  function indigo(rune) {
    throwIfNotRune("indigo", rune);
    return ("indigo(").concat(rune, ")");
  }
  function blue(rune) {
    throwIfNotRune("blue", rune);
    return ("blue(").concat(rune, ")");
  }
  function green(rune) {
    throwIfNotRune("green", rune);
    return ("green(").concat(rune, ")");
  }
  function yellow(rune) {
    throwIfNotRune("yellow", rune);
    return ("yellow(").concat(rune, ")");
  }
  function orange(rune) {
    throwIfNotRune("orange", rune);
    return ("orange(").concat(rune, ")");
  }
  function brown(rune) {
    throwIfNotRune("brown", rune);
    return ("brown(").concat(rune, ")");
  }
  function black(rune) {
    throwIfNotRune("black", rune);
    return ("black(").concat(rune, ")");
  }
  function white(rune) {
    throwIfNotRune("white", rune);
    return ("white(").concat(rune, ")");
  }
  function show(rune) {
    throwIfNotRune("show", rune);
    return rune;
  }
  function anaglyph(rune) {
    throwIfNotRune("anaglyph", rune);
    return rune;
  }
  function hollusion(rune) {
    throwIfNotRune("hollusion", rune);
    return rune;
  }
  exports.anaglyph = anaglyph;
  exports.beside = beside;
  exports.beside_frac = beside_frac;
  exports.black = black;
  exports.blank = blank;
  exports.blue = blue;
  exports.brown = brown;
  exports.circle = circle;
  exports.color = color;
  exports.corner = corner;
  exports.flip_horiz = flip_horiz;
  exports.flip_vert = flip_vert;
  exports.from_url = from_url;
  exports.green = green;
  exports.heart = heart;
  exports.hollusion = hollusion;
  exports.indigo = indigo;
  exports.make_cross = make_cross;
  exports.nova = nova;
  exports.orange = orange;
  exports.overlay = overlay;
  exports.overlay_frac = overlay_frac;
  exports.pentagram = pentagram;
  exports.pink = pink;
  exports.purple = purple;
  exports.quarter_turn_left = quarter_turn_left;
  exports.quarter_turn_right = quarter_turn_right;
  exports.random_color = random_color;
  exports.rcross = rcross;
  exports.red = red;
  exports.repeat_pattern = repeat_pattern;
  exports.ribbon = ribbon;
  exports.rotate = rotate;
  exports.sail = sail;
  exports.scale = scale;
  exports.scale_independent = scale_independent;
  exports.show = show;
  exports.square = square;
  exports.stack = stack;
  exports.stack_frac = stack_frac;
  exports.stackn = stackn;
  exports.translate = translate;
  exports.triangle = triangle;
  exports.turn_upside_down = turn_upside_down;
  exports.white = white;
  exports.yellow = yellow;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
})
