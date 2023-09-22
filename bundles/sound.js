require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __pow = Math.pow;
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function (x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
    value: mod,
    enumerable: true
  }) : target, mod));
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var sound_exports = {};
  __export(sound_exports, {
    adsr: () => adsr,
    bell: () => bell,
    cello: () => cello,
    consecutively: () => consecutively,
    get_duration: () => get_duration,
    get_wave: () => get_wave,
    init_record: () => init_record,
    is_sound: () => is_sound,
    letter_name_to_frequency: () => letter_name_to_frequency,
    letter_name_to_midi_note: () => letter_name_to_midi_note,
    make_sound: () => make_sound,
    midi_note_to_frequency: () => midi_note_to_frequency,
    noise_sound: () => noise_sound,
    phase_mod: () => phase_mod,
    piano: () => piano,
    play: () => play,
    play_in_tab: () => play_in_tab,
    play_wave: () => play_wave,
    record: () => record,
    record_for: () => record_for,
    sawtooth_sound: () => sawtooth_sound,
    silence_sound: () => silence_sound,
    simultaneously: () => simultaneously,
    sine_sound: () => sine_sound,
    square_sound: () => square_sound,
    stacking_adsr: () => stacking_adsr,
    stop: () => stop,
    triangle_sound: () => triangle_sound,
    trombone: () => trombone,
    violin: () => violin
  });
  var import_list = __require("js-slang/dist/stdlib/list");
  var FastBase64 = {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encLookup: String,
    Init: function () {
      for (var i = 0; i < 4096; i++) {
        this.encLookup[i] = this.chars[i >> 6] + this.chars[i & 63];
      }
    },
    Encode: function (src) {
      var len = src.length;
      var dst = "";
      var i = 0;
      var n;
      while (len > 2) {
        n = src[i] << 16 | src[i + 1] << 8 | src[i + 2];
        dst += this.encLookup[n >> 12] + this.encLookup[n & 4095];
        len -= 3;
        i += 3;
      }
      if (len > 0) {
        var n1 = (src[i] & 252) >> 2;
        var n2 = (src[i] & 3) << 4;
        if (len > 1) n2 |= (src[++i] & 240) >> 4;
        dst += this.chars[n1];
        dst += this.chars[n2];
        if (len == 2) {
          var n3 = (src[i++] & 15) << 2;
          n3 |= (src[i] & 192) >> 6;
          dst += this.chars[n3];
        }
        if (len == 1) dst += "=";
        dst += "=";
      }
      return dst;
    }
  };
  FastBase64.Init();
  function RIFFWAVE(data) {
    this.data = [];
    this.wav = [];
    this.dataURI = "";
    this.header = {
      chunkId: [82, 73, 70, 70],
      chunkSize: 0,
      format: [87, 65, 86, 69],
      subChunk1Id: [102, 109, 116, 32],
      subChunk1Size: 16,
      audioFormat: 1,
      numChannels: 1,
      sampleRate: 8e3,
      byteRate: 0,
      blockAlign: 0,
      bitsPerSample: 8,
      subChunk2Id: [100, 97, 116, 97],
      subChunk2Size: 0
    };
    function u32ToArray(i) {
      return [i & 255, i >> 8 & 255, i >> 16 & 255, i >> 24 & 255];
    }
    function u16ToArray(i) {
      return [i & 255, i >> 8 & 255];
    }
    function split16bitArray(data2) {
      var r = [];
      var j = 0;
      var len = data2.length;
      for (var i = 0; i < len; i++) {
        r[j++] = data2[i] & 255;
        r[j++] = data2[i] >> 8 & 255;
      }
      return r;
    }
    this.Make = function (data2) {
      if (data2 instanceof Array) this.data = data2;
      this.header.blockAlign = this.header.numChannels * this.header.bitsPerSample >> 3;
      this.header.byteRate = this.header.blockAlign * this.sampleRate;
      this.header.subChunk2Size = this.data.length * (this.header.bitsPerSample >> 3);
      this.header.chunkSize = 36 + this.header.subChunk2Size;
      this.wav = this.header.chunkId.concat(u32ToArray(this.header.chunkSize), this.header.format, this.header.subChunk1Id, u32ToArray(this.header.subChunk1Size), u16ToArray(this.header.audioFormat), u16ToArray(this.header.numChannels), u32ToArray(this.header.sampleRate), u32ToArray(this.header.byteRate), u16ToArray(this.header.blockAlign), u16ToArray(this.header.bitsPerSample), this.header.subChunk2Id, u32ToArray(this.header.subChunk2Size), this.header.bitsPerSample == 16 ? split16bitArray(this.data) : this.data);
      this.dataURI = "data:audio/wav;base64," + FastBase64.Encode(this.wav);
    };
    if (data instanceof Array) this.Make(data);
  }
  var import_context = __toESM(__require("js-slang/context"), 1);
  var FS = 44100;
  var fourier_expansion_level = 5;
  var audioPlayed = [];
  import_context.default.moduleContexts.sound.state = {
    audioPlayed
  };
  var audioplayer;
  var isPlaying;
  function init_audioCtx() {
    audioplayer = new window.AudioContext();
  }
  function linear_decay(decay_period) {
    return t => {
      if (t > decay_period || t < 0) {
        return 0;
      }
      return 1 - t / decay_period;
    };
  }
  var permission;
  var recorded_sound;
  function check_permission() {
    if (permission === void 0) {
      throw new Error("Call init_record(); to obtain permission to use microphone");
    } else if (permission === false) {
      throw new Error(`Permission has been denied.

		    Re-start browser and call init_record();

		    to obtain permission to use microphone.`);
    }
  }
  var globalStream;
  function rememberStream(stream) {
    permission = true;
    globalStream = stream;
  }
  function setPermissionToFalse() {
    permission = false;
  }
  function start_recording(mediaRecorder) {
    const data = [];
    mediaRecorder.ondataavailable = e => e.data.size && data.push(e.data);
    mediaRecorder.start();
    mediaRecorder.onstop = () => process(data);
  }
  var recording_signal_ms = 100;
  var pre_recording_signal_pause_ms = 200;
  function play_recording_signal() {
    play(sine_sound(1200, recording_signal_ms / 1e3));
  }
  function process(data) {
    const audioContext = new AudioContext();
    const blob = new Blob(data);
    convertToArrayBuffer(blob).then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)).then(save);
  }
  function convertToArrayBuffer(blob) {
    const url = URL.createObjectURL(blob);
    return fetch(url).then(response => response.arrayBuffer());
  }
  function save(audioBuffer) {
    const array = audioBuffer.getChannelData(0);
    const duration = array.length / FS;
    recorded_sound = make_sound(t => {
      const index = t * FS;
      const lowerIndex = Math.floor(index);
      const upperIndex = lowerIndex + 1;
      const ratio = index - lowerIndex;
      const upper = array[upperIndex] ? array[upperIndex] : 0;
      const lower = array[lowerIndex] ? array[lowerIndex] : 0;
      return lower * (1 - ratio) + upper * ratio;
    }, duration);
  }
  function init_record() {
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(rememberStream, setPermissionToFalse);
    return "obtaining recording permission";
  }
  function record(buffer) {
    check_permission();
    const mediaRecorder = new MediaRecorder(globalStream);
    setTimeout(() => {
      play_recording_signal();
      start_recording(mediaRecorder);
    }, recording_signal_ms + buffer * 1e3);
    return () => {
      mediaRecorder.stop();
      play_recording_signal();
      return () => {
        if (recorded_sound === void 0) {
          throw new Error("recording still being processed");
        } else {
          return recorded_sound;
        }
      };
    };
  }
  function record_for(duration, buffer) {
    recorded_sound = void 0;
    const recording_ms = duration * 1e3;
    const pre_recording_pause_ms = buffer * 1e3;
    check_permission();
    const mediaRecorder = new MediaRecorder(globalStream);
    setTimeout(() => {
      play_recording_signal();
      setTimeout(() => {
        start_recording(mediaRecorder);
        setTimeout(() => {
          mediaRecorder.stop();
          play_recording_signal();
        }, recording_ms);
      }, recording_signal_ms + pre_recording_pause_ms);
    }, pre_recording_signal_pause_ms);
    return () => {
      if (recorded_sound === void 0) {
        throw new Error("recording still being processed");
      } else {
        return recorded_sound;
      }
    };
  }
  function make_sound(wave, duration) {
    if (duration <= 0) {
      throw new Error("Sound duration must be greater than 0");
    }
    return (0, import_list.pair)(t => t >= duration ? 0 : wave(t), duration);
  }
  function get_wave(sound) {
    return (0, import_list.head)(sound);
  }
  function get_duration(sound) {
    return (0, import_list.tail)(sound);
  }
  function is_sound(x) {
    return (0, import_list.is_pair)(x) && typeof get_wave(x) === "function" && typeof get_duration(x) === "number";
  }
  function play_wave(wave, duration) {
    return play(make_sound(wave, duration));
  }
  function play_in_tab(sound) {
    if (!is_sound(sound)) {
      throw new Error(`${play_in_tab.name} is expecting sound, but encountered ${sound}`);
    } else if (isPlaying) {
      throw new Error(`${play_in_tab.name}: audio system still playing previous sound`);
    } else if (get_duration(sound) < 0) {
      throw new Error(`${play_in_tab.name}: duration of sound is negative`);
    } else if (get_duration(sound) === 0) {
      return sound;
    } else {
      if (!audioplayer) {
        init_audioCtx();
      }
      const channel = [];
      const len = Math.ceil(FS * get_duration(sound));
      let temp;
      let prev_value = 0;
      const wave = get_wave(sound);
      for (let i = 0; i < len; i += 1) {
        temp = wave(i / FS);
        if (temp > 1) {
          channel[i] = 1;
        } else if (temp < -1) {
          channel[i] = -1;
        } else {
          channel[i] = temp;
        }
        if (channel[i] === 0 && Math.abs(channel[i] - prev_value) > 0.01) {
          channel[i] = prev_value * 0.999;
        }
        prev_value = channel[i];
      }
      for (let i = 0; i < channel.length; i += 1) {
        channel[i] = Math.floor(channel[i] * 32767.999);
      }
      const riffwave = new RIFFWAVE([]);
      riffwave.header.sampleRate = FS;
      riffwave.header.numChannels = 1;
      riffwave.header.bitsPerSample = 16;
      riffwave.Make(channel);
      const soundToPlay = {
        toReplString: () => "<AudioPlayed>",
        dataUri: riffwave.dataURI
      };
      audioPlayed.push(soundToPlay);
      return sound;
    }
  }
  function play(sound) {
    if (!is_sound(sound)) {
      throw new Error(`${play.name} is expecting sound, but encountered ${sound}`);
    } else if (get_duration(sound) < 0) {
      throw new Error(`${play.name}: duration of sound is negative`);
    } else if (get_duration(sound) === 0) {
      return sound;
    } else {
      if (!audioplayer) {
        init_audioCtx();
      }
      const theBuffer = audioplayer.createBuffer(1, Math.ceil(FS * get_duration(sound)), FS);
      const channel = theBuffer.getChannelData(0);
      let temp;
      let prev_value = 0;
      const wave = get_wave(sound);
      for (let i = 0; i < channel.length; i += 1) {
        temp = wave(i / FS);
        if (temp > 1) {
          channel[i] = 1;
        } else if (temp < -1) {
          channel[i] = -1;
        } else {
          channel[i] = temp;
        }
        if (channel[i] === 0 && Math.abs(channel[i] - prev_value) > 0.01) {
          channel[i] = prev_value * 0.999;
        }
        prev_value = channel[i];
      }
      const source = audioplayer.createBufferSource();
      source.buffer = theBuffer;
      source.connect(audioplayer.destination);
      isPlaying = true;
      source.start();
      source.onended = () => {
        source.disconnect(audioplayer.destination);
        isPlaying = false;
      };
      return sound;
    }
  }
  function stop() {
    audioplayer.close();
    isPlaying = false;
  }
  function noise_sound(duration) {
    return make_sound(_t => Math.random() * 2 - 1, duration);
  }
  function silence_sound(duration) {
    return make_sound(_t => 0, duration);
  }
  function sine_sound(freq, duration) {
    return make_sound(t => Math.sin(2 * Math.PI * t * freq), duration);
  }
  function square_sound(f, duration) {
    function fourier_expansion_square(t) {
      let answer = 0;
      for (let i = 1; i <= fourier_expansion_level; i += 1) {
        answer += Math.sin(2 * Math.PI * (2 * i - 1) * f * t) / (2 * i - 1);
      }
      return answer;
    }
    return make_sound(t => 4 / Math.PI * fourier_expansion_square(t), duration);
  }
  function triangle_sound(freq, duration) {
    function fourier_expansion_triangle(t) {
      let answer = 0;
      for (let i = 0; i < fourier_expansion_level; i += 1) {
        answer += __pow(-1, i) * Math.sin((2 * i + 1) * t * freq * Math.PI * 2) / __pow(2 * i + 1, 2);
      }
      return answer;
    }
    return make_sound(t => 8 / Math.PI / Math.PI * fourier_expansion_triangle(t), duration);
  }
  function sawtooth_sound(freq, duration) {
    function fourier_expansion_sawtooth(t) {
      let answer = 0;
      for (let i = 1; i <= fourier_expansion_level; i += 1) {
        answer += Math.sin(2 * Math.PI * i * freq * t) / i;
      }
      return answer;
    }
    return make_sound(t => 1 / 2 - 1 / Math.PI * fourier_expansion_sawtooth(t), duration);
  }
  function consecutively(list_of_sounds) {
    function consec_two(ss1, ss2) {
      const wave1 = get_wave(ss1);
      const wave2 = get_wave(ss2);
      const dur1 = get_duration(ss1);
      const dur2 = get_duration(ss2);
      const new_wave = t => t < dur1 ? wave1(t) : wave2(t - dur1);
      return make_sound(new_wave, dur1 + dur2);
    }
    return (0, import_list.accumulate)(consec_two, silence_sound(0), list_of_sounds);
  }
  function simultaneously(list_of_sounds) {
    function simul_two(ss1, ss2) {
      const wave1 = get_wave(ss1);
      const wave2 = get_wave(ss2);
      const dur1 = get_duration(ss1);
      const dur2 = get_duration(ss2);
      const new_wave = t => wave1(t) + wave2(t);
      const new_dur = dur1 < dur2 ? dur2 : dur1;
      return make_sound(new_wave, new_dur);
    }
    const mushed_sounds = (0, import_list.accumulate)(simul_two, silence_sound(0), list_of_sounds);
    const len = (0, import_list.length)(list_of_sounds);
    const normalised_wave = t => (0, import_list.head)(mushed_sounds)(t) / len;
    const highest_duration = (0, import_list.tail)(mushed_sounds);
    return make_sound(normalised_wave, highest_duration);
  }
  function adsr(attack_ratio, decay_ratio, sustain_level, release_ratio) {
    return sound => {
      const wave = get_wave(sound);
      const duration = get_duration(sound);
      const attack_time = duration * attack_ratio;
      const decay_time = duration * decay_ratio;
      const release_time = duration * release_ratio;
      return make_sound(x => {
        if (x < attack_time) {
          return wave(x) * (x / attack_time);
        }
        if (x < attack_time + decay_time) {
          return ((1 - sustain_level) * linear_decay(decay_time)(x - attack_time) + sustain_level) * wave(x);
        }
        if (x < duration - release_time) {
          return wave(x) * sustain_level;
        }
        return wave(x) * sustain_level * linear_decay(release_time)(x - (duration - release_time));
      }, duration);
    };
  }
  function stacking_adsr(waveform, base_frequency, duration, envelopes) {
    function zip(lst, n) {
      if ((0, import_list.is_null)(lst)) {
        return lst;
      }
      return (0, import_list.pair)((0, import_list.pair)(n, (0, import_list.head)(lst)), zip((0, import_list.tail)(lst), n + 1));
    }
    return simultaneously((0, import_list.accumulate)((x, y) => (0, import_list.pair)((0, import_list.tail)(x)(waveform(base_frequency * (0, import_list.head)(x), duration)), y), null, zip(envelopes, 1)));
  }
  function phase_mod(freq, duration, amount) {
    return modulator => make_sound(t => Math.sin(2 * Math.PI * t * freq + amount * get_wave(modulator)(t)), duration);
  }
  function letter_name_to_midi_note(note) {
    let res = 12;
    const n = note[0].toUpperCase();
    switch (n) {
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
    if (note.length === 2) {
      res += parseInt(note[1]) * 12;
    } else if (note.length === 3) {
      switch (note[1]) {
        case "#":
          res += 1;
          break;
        case "b":
          res -= 1;
          break;
        default:
          break;
      }
      res += parseInt(note[2]) * 12;
    }
    return res;
  }
  function midi_note_to_frequency(note) {
    return 440 * __pow(2, (note - 69) / 12);
  }
  function letter_name_to_frequency(note) {
    return midi_note_to_frequency(letter_name_to_midi_note(note));
  }
  function bell(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, (0, import_list.list)(adsr(0, 0.6, 0, 0.05), adsr(0, 0.6618, 0, 0.05), adsr(0, 0.7618, 0, 0.05), adsr(0, 0.9071, 0, 0.05)));
  }
  function cello(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, (0, import_list.list)(adsr(0.05, 0, 1, 0.1), adsr(0.05, 0, 1, 0.15), adsr(0, 0, 0.2, 0.15)));
  }
  function piano(note, duration) {
    return stacking_adsr(triangle_sound, midi_note_to_frequency(note), duration, (0, import_list.list)(adsr(0, 0.515, 0, 0.05), adsr(0, 0.32, 0, 0.05), adsr(0, 0.2, 0, 0.05)));
  }
  function trombone(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, (0, import_list.list)(adsr(0.2, 0, 1, 0.1), adsr(0.3236, 0.6, 0, 0.1)));
  }
  function violin(note, duration) {
    return stacking_adsr(sawtooth_sound, midi_note_to_frequency(note), duration, (0, import_list.list)(adsr(0.35, 0, 1, 0.15), adsr(0.35, 0, 1, 0.15), adsr(0.45, 0, 1, 0.15), adsr(0.45, 0, 1, 0.15)));
  }
  return __toCommonJS(sound_exports);
}