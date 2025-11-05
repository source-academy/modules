export default require => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __pow = Math.pow;
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
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var index_exports = {};
  __export(index_exports, {
    FLAT: () => FLAT,
    NATURAL: () => NATURAL,
    SHARP: () => SHARP,
    aeolian_scale: () => aeolian_scale,
    dorian_scale: () => dorian_scale,
    ionian_scale: () => ionian_scale,
    letter_name_to_frequency: () => letter_name_to_frequency,
    letter_name_to_midi_note: () => letter_name_to_midi_note,
    locrian_scale: () => locrian_scale,
    lydian_scale: () => lydian_scale,
    major_scale: () => major_scale,
    midi_note_to_frequency: () => midi_note_to_frequency,
    midi_note_to_letter_name: () => midi_note_to_letter_name,
    minor_scale: () => minor_scale,
    mixolydian_scale: () => mixolydian_scale,
    phrygian_scale: () => phrygian_scale
  });
  function noteToValues(note, func_name = noteToValues.name) {
    const match = (/^([A-Ga-g])([#♮b]?)(\d*)$/).exec(note);
    if (match === null) throw new Error(`${func_name}: Invalid Note with Octave: ${note}`);
    const [, noteName, accidental, octaveStr] = match;
    switch (accidental) {
      case "#":
        {
          if (noteName === "B" || noteName === "E") {
            throw new Error(`${func_name}: Invalid Note with Octave: ${note}`);
          }
          break;
        }
      case "b":
        {
          if (noteName === "F" || noteName === "C") {
            throw new Error(`${func_name}: Invalid Note with Octave: ${note}`);
          }
          break;
        }
    }
    const octave = octaveStr === "" ? 4 : parseInt(octaveStr);
    return [noteName.toUpperCase(), accidental !== "" ? accidental : "\u266E", octave];
  }
  function midiNoteToNoteName(midiNote, accidental, func_name = midiNoteToNoteName.name) {
    switch (midiNote % 12) {
      case 0:
        return "C";
      case 1:
        return accidental === "sharp" ? `C${"#"}` : `D${"b"}`;
      case 2:
        return "D";
      case 3:
        return accidental === "sharp" ? `D${"#"}` : `E${"b"}`;
      case 4:
        return "E";
      case 5:
        return "F";
      case 6:
        return accidental === "sharp" ? `F${"#"}` : `G${"b"}`;
      case 7:
        return "G";
      case 8:
        return accidental === "sharp" ? `G${"#"}` : `A${"b"}`;
      case 9:
        return "A";
      case 10:
        return accidental === "sharp" ? `A${"#"}` : `B${"b"}`;
      case 11:
        return "B";
      default:
        throw new Error(`${func_name}: Invalid MIDI note value ${midiNote}`);
    }
  }
  var import_list = __require("js-slang/dist/stdlib/list");
  var major_intervals = [2, 2, 1, 2, 2, 2, 1];
  function make_from_major_scale(root, mode) {
    let output = (0, import_list.pair)(root + 12, null);
    let note = root + 12;
    for (let i = major_intervals.length - 1; i >= 0; i--) {
      const interval = major_intervals[(mode - 1 + i) % major_intervals.length];
      note -= interval;
      output = (0, import_list.pair)(note, output);
    }
    return output;
  }
  function major_scale(key) {
    return make_from_major_scale(key, 1);
  }
  var ionian_scale = major_scale;
  function dorian_scale(key) {
    return make_from_major_scale(key, 2);
  }
  function phrygian_scale(key) {
    return make_from_major_scale(key, 3);
  }
  function lydian_scale(key) {
    return make_from_major_scale(key, 4);
  }
  function mixolydian_scale(key) {
    return make_from_major_scale(key, 5);
  }
  function minor_scale(key) {
    return make_from_major_scale(key, 6);
  }
  var aeolian_scale = minor_scale;
  function locrian_scale(key) {
    return make_from_major_scale(key, 7);
  }
  function letter_name_to_midi_note(note) {
    const [noteName, accidental, octave] = noteToValues(note, letter_name_to_midi_note.name);
    let res = 12;
    switch (noteName) {
      case "C":
        break;
      case "D":
        res += 2;
        break;
      case "E":
        res += 4;
        break;
      case "F":
        res += 5;
        break;
      case "G":
        res += 7;
        break;
      case "A":
        res += 9;
        break;
      case "B":
        res += 11;
        break;
      default:
        break;
    }
    switch (accidental) {
      case "b":
        {
          res -= 1;
          break;
        }
      case "#":
        {
          res += 1;
          break;
        }
      case "\u266E":
        break;
    }
    return res + 12 * octave;
  }
  function midi_note_to_letter_name(midiNote, accidental) {
    const octave = Math.floor(midiNote / 12) - 1;
    const note = midiNoteToNoteName(midiNote, accidental, midi_note_to_letter_name.name);
    return `${note}${octave}`;
  }
  function midi_note_to_frequency(note) {
    return 440 * __pow(2, (note - 69) / 12);
  }
  function letter_name_to_frequency(note) {
    return midi_note_to_frequency(letter_name_to_midi_note(note));
  }
  var SHARP = "#";
  var FLAT = "b";
  var NATURAL = "\u266E";
  return __toCommonJS(index_exports);
};