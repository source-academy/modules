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
  var rune_in_words_exports = {};
  __export(rune_in_words_exports, {
    anaglyph: () => anaglyph,
    beside: () => beside,
    beside_frac: () => beside_frac,
    black: () => black,
    blank: () => blank,
    blue: () => blue,
    brown: () => brown,
    circle: () => circle,
    color: () => color,
    corner: () => corner,
    flip_horiz: () => flip_horiz,
    flip_vert: () => flip_vert,
    from_url: () => from_url,
    green: () => green,
    heart: () => heart,
    hollusion: () => hollusion,
    indigo: () => indigo,
    make_cross: () => make_cross,
    nova: () => nova,
    orange: () => orange,
    overlay: () => overlay,
    overlay_frac: () => overlay_frac,
    pentagram: () => pentagram,
    pink: () => pink,
    purple: () => purple,
    quarter_turn_left: () => quarter_turn_left,
    quarter_turn_right: () => quarter_turn_right,
    random_color: () => random_color,
    rcross: () => rcross,
    red: () => red,
    repeat_pattern: () => repeat_pattern,
    ribbon: () => ribbon,
    rotate: () => rotate,
    sail: () => sail,
    scale: () => scale,
    scale_independent: () => scale_independent,
    show: () => show,
    square: () => square,
    stack: () => stack,
    stack_frac: () => stack_frac,
    stackn: () => stackn,
    translate: () => translate,
    triangle: () => triangle,
    turn_upside_down: () => turn_upside_down,
    white: () => white,
    yellow: () => yellow
  });
  function throwIfNotRune(name, ...runes) {
    runes.forEach(rune => {
      if (!(typeof rune === "string")) {
        throw Error(`${name} expects a rune (string) as argument.`);
      }
    });
  }
  var getSquare = () => "square";
  var getBlank = () => "blank";
  var getRcross = () => "rcross";
  var getSail = () => "sail";
  var getTriangle = () => "triangle";
  var getCorner = () => "corner";
  var getNova = () => "nova";
  var getCircle = () => "circle";
  var getHeart = () => "heart";
  var getPentagram = () => "pentagram";
  var getRibbon = () => "ribbon";
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
    return `url(${imageUrl})`;
  }
  function scale_independent(ratio_x, ratio_y, rune) {
    throwIfNotRune("scale_independent", rune);
    return `scaled(${rune}, ${ratio_x}, ${ratio_y})`;
  }
  function scale(ratio, rune) {
    throwIfNotRune("scale", rune);
    return scale_independent(ratio, ratio, rune);
  }
  function translate(x, y, rune) {
    throwIfNotRune("translate", rune);
    return `translated(${rune}, ${x}, ${y})`;
  }
  function rotate(rad, rune) {
    throwIfNotRune("rotate", rune);
    return `rotated(${rune}, ${rad})`;
  }
  function stack_frac(frac, rune1, rune2) {
    throwIfNotRune("stack_frac", rune1);
    throwIfNotRune("stack_frac", rune2);
    return `stack_frac(${frac}, ${rune1}, ${rune2})`;
  }
  function stack(rune1, rune2) {
    throwIfNotRune("stack", rune1, rune2);
    return `stack(${rune1}, ${rune2})`;
  }
  function stackn(n, rune) {
    throwIfNotRune("stackn", rune);
    return `stackn(${n}, ${rune})`;
  }
  function quarter_turn_right(rune) {
    throwIfNotRune("quarter_turn_right", rune);
    return `quarter_turn_right(${rune})`;
  }
  function quarter_turn_left(rune) {
    throwIfNotRune("quarter_turn_left", rune);
    return `quarter_turn_left(${rune})`;
  }
  function turn_upside_down(rune) {
    throwIfNotRune("turn_upside_down", rune);
    return `quarter_upside_down(${rune})`;
  }
  function beside_frac(frac, rune1, rune2) {
    throwIfNotRune("beside_frac", rune1, rune2);
    return `beside_frac(${frac}, ${rune1}, ${rune2})`;
  }
  function beside(rune1, rune2) {
    throwIfNotRune("beside", rune1, rune2);
    return `stack(${rune1}, ${rune2})`;
  }
  function flip_vert(rune) {
    throwIfNotRune("flip_vert", rune);
    return `flip_vert(${rune})`;
  }
  function flip_horiz(rune) {
    throwIfNotRune("flip_horiz", rune);
    return `flip_horiz(${rune})`;
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
    return `overlay_frac(${frac}, ${rune1}, ${rune2})`;
  }
  function overlay(rune1, rune2) {
    throwIfNotRune("overlay", rune1);
    throwIfNotRune("overlay", rune2);
    return `overlay(${rune1}, ${rune2})`;
  }
  function color(rune, r, g, b) {
    throwIfNotRune("color", rune);
    return `color(${rune}, ${r}, ${g}, ${b})`;
  }
  function random_color(rune) {
    throwIfNotRune("random_color", rune);
    return `random(${rune})`;
  }
  function red(rune) {
    throwIfNotRune("red", rune);
    return `red(${rune})`;
  }
  function pink(rune) {
    throwIfNotRune("pink", rune);
    return `pink(${rune})`;
  }
  function purple(rune) {
    throwIfNotRune("purple", rune);
    return `purple(${rune})`;
  }
  function indigo(rune) {
    throwIfNotRune("indigo", rune);
    return `indigo(${rune})`;
  }
  function blue(rune) {
    throwIfNotRune("blue", rune);
    return `blue(${rune})`;
  }
  function green(rune) {
    throwIfNotRune("green", rune);
    return `green(${rune})`;
  }
  function yellow(rune) {
    throwIfNotRune("yellow", rune);
    return `yellow(${rune})`;
  }
  function orange(rune) {
    throwIfNotRune("orange", rune);
    return `orange(${rune})`;
  }
  function brown(rune) {
    throwIfNotRune("brown", rune);
    return `brown(${rune})`;
  }
  function black(rune) {
    throwIfNotRune("black", rune);
    return `black(${rune})`;
  }
  function white(rune) {
    throwIfNotRune("white", rune);
    return `white(${rune})`;
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
  return __toCommonJS(rune_in_words_exports);
}