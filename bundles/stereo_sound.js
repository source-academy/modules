(function (moduleHelpers) {
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
  function array_test(x) {
    if (Array.isArray === undefined) {
      return x instanceof Array;
    } else {
      return Array.isArray(x);
    }
  }
  function pair(x, xs) {
    return [x, xs];
  }
  function is_pair(x) {
    return array_test(x) && x.length === 2;
  }
  function head(xs) {
    if (is_pair(xs)) {
      return xs[0];
    } else {
      throw new Error("head(xs) expects a pair as argument xs, but encountered " + xs);
    }
  }
  function tail(xs) {
    if (is_pair(xs)) {
      return xs[1];
    } else {
      throw new Error("tail(xs) expects a pair as argument xs, but encountered " + xs);
    }
  }
  function is_null(xs) {
    return xs === null;
  }
  function list() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var the_list = null;
    for (var i = args.length - 1; i >= 0; i--) {
      the_list = pair(args[i], the_list);
    }
    return the_list;
  }
  function length(xs) {
    var i = 0;
    while (!is_null(xs)) {
      i += 1;
      xs = tail(xs);
    }
    return i;
  }
  function accumulate(op, initial, sequence) {
    if (is_null(sequence)) {
      return initial;
    } else {
      return op(head(sequence), accumulate(op, initial, tail(sequence)));
    }
  }
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
      sampleRate: 8000,
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
    function split16bitArray(data) {
      var r = [];
      var j = 0;
      var len = data.length;
      for (var i = 0; i < len; i++) {
        r[j++] = data[i] & 255;
        r[j++] = data[i] >> 8 & 255;
      }
      return r;
    }
    this.Make = function (data) {
      if (data instanceof Array) this.data = data;
      this.header.blockAlign = this.header.numChannels * this.header.bitsPerSample >> 3;
      this.header.byteRate = this.header.blockAlign * this.sampleRate;
      this.header.subChunk2Size = this.data.length * (this.header.bitsPerSample >> 3);
      this.header.chunkSize = 36 + this.header.subChunk2Size;
      this.wav = this.header.chunkId.concat(u32ToArray(this.header.chunkSize), this.header.format, this.header.subChunk1Id, u32ToArray(this.header.subChunk1Size), u16ToArray(this.header.audioFormat), u16ToArray(this.header.numChannels), u32ToArray(this.header.sampleRate), u32ToArray(this.header.byteRate), u16ToArray(this.header.blockAlign), u16ToArray(this.header.bitsPerSample), this.header.subChunk2Id, u32ToArray(this.header.subChunk2Size), this.header.bitsPerSample == 16 ? split16bitArray(this.data) : this.data);
      this.dataURI = "data:audio/wav;base64," + FastBase64.Encode(this.wav);
    };
    if (data instanceof Array) this.Make(data);
  }
  var FS = 44100;
  var fourier_expansion_level = 5;
  var audioPlayed = [];
  moduleHelpers.context.moduleContexts.stereo_sound.state = {
    audioPlayed: audioPlayed
  };
  var audioplayer;
  var isPlaying;
  function init_audioCtx() {
    audioplayer = new window.AudioContext();
  }
  function linear_decay(decay_period) {
    return function (t) {
      if (t > decay_period || t < 0) {
        return 0;
      }
      return 1 - t / decay_period;
    };
  }
  var permission;
  var recorded_sound;
  function check_permission() {
    if (permission === undefined) {
      throw new Error("Call init_record(); to obtain permission to use microphone");
    } else if (permission === false) {
      throw new Error("Permission has been denied.\n\n\t\t    Re-start browser and call init_record();\n\n\t\t    to obtain permission to use microphone.");
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
    var data = [];
    mediaRecorder.ondataavailable = function (e) {
      return e.data.size && data.push(e.data);
    };
    mediaRecorder.start();
    mediaRecorder.onstop = function () {
      return process$1(data);
    };
  }
  var recording_signal_duration_ms = 100;
  function play_recording_signal() {
    play(sine_sound(1200, recording_signal_duration_ms / 1000));
  }
  function process$1(data) {
    var audioContext = new AudioContext();
    var blob = new Blob(data);
    convertToArrayBuffer(blob).then(function (arrayBuffer) {
      return audioContext.decodeAudioData(arrayBuffer);
    }).then(save);
  }
  function convertToArrayBuffer(blob) {
    var url = URL.createObjectURL(blob);
    return fetch(url).then(function (response) {
      return response.arrayBuffer();
    });
  }
  function save(audioBuffer) {
    var array = audioBuffer.getChannelData(0);
    var duration = array.length / FS;
    recorded_sound = make_sound(function (t) {
      var index = t * FS;
      var lowerIndex = Math.floor(index);
      var upperIndex = lowerIndex + 1;
      var ratio = index - lowerIndex;
      var upper = array[upperIndex] ? array[upperIndex] : 0;
      var lower = array[lowerIndex] ? array[lowerIndex] : 0;
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
    var mediaRecorder = new MediaRecorder(globalStream);
    setTimeout(function () {
      play_recording_signal();
      start_recording(mediaRecorder);
    }, recording_signal_duration_ms + buffer * 1000);
    return function () {
      mediaRecorder.stop();
      play_recording_signal();
      return function () {
        if (recorded_sound === undefined) {
          throw new Error("recording still being processed");
        } else {
          return recorded_sound;
        }
      };
    };
  }
  function record_for(duration, buffer) {
    recorded_sound = undefined;
    var duration_ms = duration * 1000;
    check_permission();
    var mediaRecorder = new MediaRecorder(globalStream);
    setTimeout(function () {
      play_recording_signal();
      start_recording(mediaRecorder);
      setTimeout(function () {
        mediaRecorder.stop();
        play_recording_signal();
      }, duration_ms);
    }, recording_signal_duration_ms + buffer * 1000);
    return function () {
      if (recorded_sound === undefined) {
        throw new Error("recording still being processed");
      } else {
        return recorded_sound;
      }
    };
  }
  function make_stereo_sound(left_wave, right_wave, duration) {
    return pair(pair(function (t) {
      return t >= duration ? 0 : left_wave(t);
    }, function (t) {
      return t >= duration ? 0 : right_wave(t);
    }), duration);
  }
  function make_sound(wave, duration) {
    return make_stereo_sound(wave, wave, duration);
  }
  function get_left_wave(sound) {
    return head(head(sound));
  }
  function get_right_wave(sound) {
    return tail(head(sound));
  }
  function get_duration(sound) {
    return tail(sound);
  }
  function is_sound(x) {
    return is_pair(x) && typeof get_left_wave(x) === "function" && typeof get_right_wave(x) === "function" && typeof get_duration(x) === "number";
  }
  function play_wave(wave, duration) {
    return play(make_sound(wave, duration));
  }
  function play_waves(wave1, wave2, duration) {
    return play(make_stereo_sound(wave1, wave2, duration));
  }
  function play(sound) {
    if (!is_sound(sound)) {
      throw new Error(("play is expecting sound, but encountered ").concat(sound));
    } else if (isPlaying) {
      throw new Error("play: audio system still playing previous sound");
    } else if (get_duration(sound) < 0) {
      throw new Error("play: duration of sound is negative");
    } else {
      if (!audioplayer) {
        init_audioCtx();
      }
      var channel = [];
      var len = Math.ceil(FS * get_duration(sound));
      var Ltemp = void 0;
      var Rtemp = void 0;
      var Lprev_value = 0;
      var Rprev_value = 0;
      var left_wave = get_left_wave(sound);
      var right_wave = get_right_wave(sound);
      for (var i = 0; i < len; i += 1) {
        Ltemp = left_wave(i / FS);
        if (Ltemp > 1) {
          channel[2 * i] = 1;
        } else if (Ltemp < -1) {
          channel[2 * i] = -1;
        } else {
          channel[2 * i] = Ltemp;
        }
        if (channel[2 * i] === 0 && Math.abs(channel[2 * i] - Lprev_value) > 0.01) {
          channel[2 * i] = Lprev_value * 0.999;
        }
        Lprev_value = channel[2 * i];
        Rtemp = right_wave(i / FS);
        if (Rtemp > 1) {
          channel[2 * i + 1] = 1;
        } else if (Rtemp < -1) {
          channel[2 * i + 1] = -1;
        } else {
          channel[2 * i + 1] = Rtemp;
        }
        if (channel[2 * i + 1] === 0 && Math.abs(channel[2 * i] - Rprev_value) > 0.01) {
          channel[2 * i + 1] = Rprev_value * 0.999;
        }
        Rprev_value = channel[2 * i + 1];
      }
      for (var i = 0; i < channel.length; i += 1) {
        channel[i] = Math.floor(channel[i] * 32767.999);
      }
      var riffwave = new RIFFWAVE([]);
      riffwave.header.sampleRate = FS;
      riffwave.header.numChannels = 2;
      riffwave.header.bitsPerSample = 16;
      riffwave.Make(channel);
      var audio = {
        toReplString: function () {
          return "<AudioPlayed>";
        },
        dataUri: riffwave.dataURI
      };
      audioPlayed.push(audio);
      return audio;
    }
  }
  function play_concurrently(sound) {
    if (!is_sound(sound)) {
      throw new Error(("play_concurrently is expecting sound, but encountered ").concat(sound));
    } else if (get_duration(sound) <= 0) ; else {
      if (!audioplayer) {
        init_audioCtx();
      }
      var channel = Array[2 * Math.ceil(FS * get_duration(sound))];
      var Ltemp = void 0;
      var Rtemp = void 0;
      var prev_value = 0;
      var left_wave = get_left_wave(sound);
      for (var i = 0; i < channel.length; i += 2) {
        Ltemp = left_wave(i / FS);
        if (Ltemp > 1) {
          channel[i] = 1;
        } else if (Ltemp < -1) {
          channel[i] = -1;
        } else {
          channel[i] = Ltemp;
        }
        if (channel[i] === 0 && Math.abs(channel[i] - prev_value) > 0.01) {
          channel[i] = prev_value * 0.999;
        }
        prev_value = channel[i];
      }
      prev_value = 0;
      var right_wave = get_right_wave(sound);
      for (var i = 1; i < channel.length; i += 2) {
        Rtemp = right_wave(i / FS);
        if (Rtemp > 1) {
          channel[i] = 1;
        } else if (Rtemp < -1) {
          channel[i] = -1;
        } else {
          channel[i] = Rtemp;
        }
        if (channel[i] === 0 && Math.abs(channel[i] - prev_value) > 0.01) {
          channel[i] = prev_value * 0.999;
        }
        prev_value = channel[i];
      }
      for (var i = 0; i < channel.length; i += 1) {
        channel[i] = Math.floor(channel[i] * 32767.999);
      }
      var riffwave = new RIFFWAVE([]);
      riffwave.header.sampleRate = FS;
      riffwave.header.numChannels = 2;
      riffwave.header.bitsPerSample = 16;
      riffwave.Make(channel);
      var audio = new Audio(riffwave.dataURI);
      var source2_1 = audioplayer.createMediaElementSource(audio);
      source2_1.connect(audioplayer.destination);
      audio.play();
      isPlaying = true;
      audio.onended = function () {
        source2_1.disconnect(audioplayer.destination);
        isPlaying = false;
      };
    }
  }
  function stop() {
    audioplayer.close();
    isPlaying = false;
  }
  function squash(sound) {
    var left = get_left_wave(sound);
    var right = get_right_wave(sound);
    return make_sound(function (t) {
      return 0.5 * (left(t) + right(t));
    }, get_duration(sound));
  }
  function pan(amount) {
    return function (sound) {
      if (amount > 1) {
        amount = 1;
      }
      if (amount < -1) {
        amount = -1;
      }
      sound = squash(sound);
      return make_stereo_sound(function (t) {
        return (1 - amount) / 2 * get_left_wave(sound)(t);
      }, function (t) {
        return (1 + amount) / 2 * get_right_wave(sound)(t);
      }, get_duration(sound));
    };
  }
  function pan_mod(modulator) {
    var amount = function amount(t) {
      var output = get_left_wave(modulator)(t) + get_right_wave(modulator)(t);
      if (output > 1) {
        output = 1;
      }
      if (output < -1) {
        output = -1;
      }
      return output;
    };
    return function (sound) {
      sound = squash(sound);
      return make_stereo_sound(function (t) {
        return (1 - amount(t)) / 2 * get_left_wave(sound)(t);
      }, function (t) {
        return (1 + amount(t)) / 2 * get_right_wave(sound)(t);
      }, get_duration(sound));
    };
  }
  function noise_sound(duration) {
    return make_sound(function (_t) {
      return Math.random() * 2 - 1;
    }, duration);
  }
  function silence_sound(duration) {
    return make_sound(function (_t) {
      return 0;
    }, duration);
  }
  function sine_sound(freq, duration) {
    return make_sound(function (t) {
      return Math.sin(2 * Math.PI * t * freq);
    }, duration);
  }
  function square_sound(f, duration) {
    function fourier_expansion_square(t) {
      var answer = 0;
      for (var i = 1; i <= fourier_expansion_level; i += 1) {
        answer += Math.sin(2 * Math.PI * (2 * i - 1) * f * t) / (2 * i - 1);
      }
      return answer;
    }
    return make_sound(function (t) {
      return 4 / Math.PI * fourier_expansion_square(t);
    }, duration);
  }
  function triangle_sound(freq, duration) {
    function fourier_expansion_triangle(t) {
      var answer = 0;
      for (var i = 0; i < fourier_expansion_level; i += 1) {
        answer += Math.pow(-1, i) * Math.sin((2 * i + 1) * t * freq * Math.PI * 2) / Math.pow(2 * i + 1, 2);
      }
      return answer;
    }
    return make_sound(function (t) {
      return 8 / Math.PI / Math.PI * fourier_expansion_triangle(t);
    }, duration);
  }
  function sawtooth_sound(freq, duration) {
    function fourier_expansion_sawtooth(t) {
      var answer = 0;
      for (var i = 1; i <= fourier_expansion_level; i += 1) {
        answer += Math.sin(2 * Math.PI * i * freq * t) / i;
      }
      return answer;
    }
    return make_sound(function (t) {
      return 1 / 2 - 1 / Math.PI * fourier_expansion_sawtooth(t);
    }, duration);
  }
  function consecutively(list_of_sounds) {
    function stereo_cons_two(sound1, sound2) {
      var Lwave1 = get_left_wave(sound1);
      var Rwave1 = get_right_wave(sound1);
      var Lwave2 = get_left_wave(sound2);
      var Rwave2 = get_right_wave(sound2);
      var dur1 = get_duration(sound1);
      var dur2 = get_duration(sound2);
      var new_left = function new_left(t) {
        return t < dur1 ? Lwave1(t) : Lwave2(t - dur1);
      };
      var new_right = function new_right(t) {
        return t < dur1 ? Rwave1(t) : Rwave2(t - dur1);
      };
      return make_stereo_sound(new_left, new_right, dur1 + dur2);
    }
    return accumulate(stereo_cons_two, silence_sound(0), list_of_sounds);
  }
  function simultaneously(list_of_sounds) {
    function stereo_simul_two(sound1, sound2) {
      var Lwave1 = get_left_wave(sound1);
      var Rwave1 = get_right_wave(sound1);
      var Lwave2 = get_left_wave(sound2);
      var Rwave2 = get_right_wave(sound2);
      var dur1 = get_duration(sound1);
      var dur2 = get_duration(sound2);
      var new_left = function new_left(t) {
        return Lwave1(t) + Lwave2(t);
      };
      var new_right = function new_right(t) {
        return Rwave1(t) + Rwave2(t);
      };
      var new_dur = dur1 < dur2 ? dur2 : dur1;
      return make_stereo_sound(new_left, new_right, new_dur);
    }
    var unnormed = accumulate(stereo_simul_two, silence_sound(0), list_of_sounds);
    var sounds_length = length(list_of_sounds);
    var normalised_left = function normalised_left(t) {
      return head(head(unnormed))(t) / sounds_length;
    };
    var normalised_right = function normalised_right(t) {
      return tail(head(unnormed))(t) / sounds_length;
    };
    var highest_duration = tail(unnormed);
    return make_stereo_sound(normalised_left, normalised_right, highest_duration);
  }
  function adsr(attack_ratio, decay_ratio, sustain_level, release_ratio) {
    return function (sound) {
      var Lwave = get_left_wave(sound);
      var Rwave = get_right_wave(sound);
      var duration = get_duration(sound);
      var attack_time = duration * attack_ratio;
      var decay_time = duration * decay_ratio;
      var release_time = duration * release_ratio;
      function adsrHelper(wave) {
        return function (x) {
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
        };
      }
      return make_stereo_sound(adsrHelper(Lwave), adsrHelper(Rwave), duration);
    };
  }
  function stacking_adsr(waveform, base_frequency, duration, envelopes) {
    function zip(lst, n) {
      if (is_null(lst)) {
        return lst;
      }
      return pair(pair(n, head(lst)), zip(tail(lst), n + 1));
    }
    return simultaneously(accumulate(function (x, y) {
      return pair(tail(x)(waveform(base_frequency * head(x), duration)), y);
    }, null, zip(envelopes, 1)));
  }
  function phase_mod(freq, duration, amount) {
    return function (modulator) {
      return make_stereo_sound(function (t) {
        return Math.sin(2 * Math.PI * t * freq + amount * get_left_wave(modulator)(t));
      }, function (t) {
        return Math.sin(2 * Math.PI * t * freq + amount * get_right_wave(modulator)(t));
      }, duration);
    };
  }
  function letter_name_to_midi_note(note) {
    var res = 12;
    var n = note[0].toUpperCase();
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
      }
      res += parseInt(note[2]) * 12;
    }
    return res;
  }
  function midi_note_to_frequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }
  function letter_name_to_frequency(note) {
    return midi_note_to_frequency(letter_name_to_midi_note(note));
  }
  function bell(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, list(adsr(0, 0.6, 0, 0.05), adsr(0, 0.6618, 0, 0.05), adsr(0, 0.7618, 0, 0.05), adsr(0, 0.9071, 0, 0.05)));
  }
  function cello(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, list(adsr(0.05, 0, 1, 0.1), adsr(0.05, 0, 1, 0.15), adsr(0, 0, 0.2, 0.15)));
  }
  function piano(note, duration) {
    return stacking_adsr(triangle_sound, midi_note_to_frequency(note), duration, list(adsr(0, 0.515, 0, 0.05), adsr(0, 0.32, 0, 0.05), adsr(0, 0.2, 0, 0.05)));
  }
  function trombone(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, list(adsr(0.2, 0, 1, 0.1), adsr(0.3236, 0.6, 0, 0.1)));
  }
  function violin(note, duration) {
    return stacking_adsr(sawtooth_sound, midi_note_to_frequency(note), duration, list(adsr(0.35, 0, 1, 0.15), adsr(0.35, 0, 1, 0.15), adsr(0.45, 0, 1, 0.15), adsr(0.45, 0, 1, 0.15)));
  }
  exports.adsr = adsr;
  exports.bell = bell;
  exports.cello = cello;
  exports.consecutively = consecutively;
  exports.get_duration = get_duration;
  exports.get_left_wave = get_left_wave;
  exports.get_right_wave = get_right_wave;
  exports.init_record = init_record;
  exports.is_sound = is_sound;
  exports.letter_name_to_frequency = letter_name_to_frequency;
  exports.letter_name_to_midi_note = letter_name_to_midi_note;
  exports.make_sound = make_sound;
  exports.make_stereo_sound = make_stereo_sound;
  exports.midi_note_to_frequency = midi_note_to_frequency;
  exports.noise_sound = noise_sound;
  exports.pan = pan;
  exports.pan_mod = pan_mod;
  exports.phase_mod = phase_mod;
  exports.piano = piano;
  exports.play = play;
  exports.play_concurrently = play_concurrently;
  exports.play_wave = play_wave;
  exports.play_waves = play_waves;
  exports.record = record;
  exports.record_for = record_for;
  exports.sawtooth_sound = sawtooth_sound;
  exports.silence_sound = silence_sound;
  exports.simultaneously = simultaneously;
  exports.sine_sound = sine_sound;
  exports.square_sound = square_sound;
  exports.squash = squash;
  exports.stacking_adsr = stacking_adsr;
  exports.stop = stop;
  exports.triangle_sound = triangle_sound;
  exports.trombone = trombone;
  exports.violin = violin;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
})
