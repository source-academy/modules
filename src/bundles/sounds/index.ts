/* eslint-disable */


// Un-comment the next line if your bundle requires the use of variables
// declared in cadet-frontend or js-slang.
import __Params from '../../typings/__Params';

/**
 * <Brief description of the module>
 * @author <Author Name>
 * @author <Author Name>
 */

// Constants
const FS = 44100; // Standard sampling rate for all problems

const FOURIER_EXPANSION_LEVEL = 5; // expansion level for
                                   // square, sawtooth, triangle
const FastBase64 = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  encLookup: [],

  Init: function() {
    for (let i = 0; i < 4096; i+= 1) {
      this.encLookup[i] = this.chars[i >> 6] + this.chars[i & 0x3f]
    }
  },

  Encode: function(src) {
    let len = src.length
    let dst = ''
    let i = 0
    while (len > 2) {
      n = (src[i] << 16) | (src[i + 1] << 8) | src[i + 2]
      dst += this.encLookup[n >> 12] + this.encLookup[n & 0xfff]
      len -= 3
      i += 3
    }
    if (len > 0) {
      const n1 = (src[i] & 0xfc) >> 2
      let n2 = (src[i] & 0x03) << 4
      if (len > 1) n2 |= (src[++i] & 0xf0) >> 4
      dst += this.chars[n1]
      dst += this.chars[n2]
      if (len === 2) {
        let n3 = (src[i] & 0x0f) << 2
		i += 1
        n3 |= (src[i] & 0xc0) >> 6
        dst += this.chars[n3]
      }
      if (len === 1) dst += '='
      dst += '='
    }
    return dst
  } // end Encode
}

FastBase64.Init()

const RIFFWAVE = function(data) {
  this.data = [] // Array containing audio samples
  this.wav = [] // Array containing the generated wave file
  this.dataURI = '' // http://en.wikipedia.org/wiki/Data_URI_scheme

  this.header = {
    // OFFS SIZE NOTES
    chunkId: [0x52, 0x49, 0x46, 0x46], // 0    4    "RIFF" = 0x52494646
    chunkSize: 0, // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
    format: [0x57, 0x41, 0x56, 0x45], // 8    4    "WAVE" = 0x57415645
    subChunk1Id: [0x66, 0x6d, 0x74, 0x20], // 12   4    "fmt " = 0x666d7420
    subChunk1Size: 16, // 16   4    16 for PCM
    audioFormat: 1, // 20   2    PCM = 1
    numChannels: 1, // 22   2    Mono = 1, Stereo = 2...
    sampleRate: 8000, // 24   4    8000, 44100...
    byteRate: 0, // 28   4    SampleRate*NumChannels*BitsPerSample/8
    blockAlign: 0, // 32   2    NumChannels*BitsPerSample/8
    bitsPerSample: 8, // 34   2    8 bits = 8, 16 bits = 16
    subChunk2Id: [0x64, 0x61, 0x74, 0x61], // 36   4    "data" = 0x64617461
    subChunk2Size: 0 // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
  }

  function u32ToArray(i) {
    return [i & 0xff, (i >> 8) & 0xff, (i >> 16) & 0xff, (i >> 24) & 0xff]
  }

  function u16ToArray(i) {
    return [i & 0xff, (i >> 8) & 0xff]
  }

  function split16bitArray(datahere) {
	// const dataarray = datahere;
    const r = []
    let j = 0
    const len = datahere.length
    for (let i = 0; i < len; i+= 1) {
      r[j] = datahere[i] & 0xff
	  j += 1
      r[j] = (datahere[i] >> 8) & 0xff
	  j += 1
    }
    return r
  }

  this.Make = function(datahere) {
    if (datahere instanceof Array) this.data = datahere
    this.header.blockAlign = (this.header.numChannels * this.header.bitsPerSample) >> 3
    this.header.byteRate = this.header.blockAlign * this.sampleRate
    this.header.subChunk2Size = this.data.length * (this.header.bitsPerSample >> 3)
    this.header.chunkSize = 36 + this.header.subChunk2Size

    this.wav = this.header.chunkId.concat(
      u32ToArray(this.header.chunkSize),
      this.header.format,
      this.header.subChunk1Id,
      u32ToArray(this.header.subChunk1Size),
      u16ToArray(this.header.audioFormat),
      u16ToArray(this.header.numChannels),
      u32ToArray(this.header.sampleRate),
      u32ToArray(this.header.byteRate),
      u16ToArray(this.header.blockAlign),
      u16ToArray(this.header.bitsPerSample),
      this.header.subChunk2Id,
      u32ToArray(this.header.subChunk2Size),
      this.header.bitsPerSample === 16 ? split16bitArray(this.data) : this.data
    )
    this.dataURI = 'data:audio/wav;base64,' + FastBase64.Encode(this.wav)
  }

  if (data instanceof Array) this.Make(data)
}

// ---------------------------------------------
// Low-level sound support
// ---------------------------------------------

/*
// Samples a continuous wave to a discrete waves at sampling rate for duration
// in seconds
function discretize(wave, duration) {
    var vector = [];

    for (var i = 0; i < duration * FS; i++) {
        vector.push(wave( i / FS));
    }

    return vector;
}
*/

// Discretizes a Sound to a Sound starting from elapsedDuration, for
// sample_length seconds
function discretize_from(wave, duration, elapsed_duration, sample_length, dataarray) {
	const data = dataarray;
    if (elapsed_duration + sample_length > duration) {
        for (let i = elapsed_duration * FS; i < duration * FS; i+= 1) {
            data[i - elapsed_duration * FS] = wave(i / FS);
        }
    } else if (duration - elapsed_duration > 0) {
        for (let i = elapsed_duration * FS;
	     i < (elapsed_duration + sample_length) * FS;
	     i+= 1) {
            data[i - elapsed_duration * FS] = wave(i / FS);
        }
    }
	return data;
}
/* function raw_to_audio(_data) {
    data = copy(_data);
    data = simple_filter(data);
    data = quantize(data);
    var riffwave = new RIFFWAVE();
    riffwave.header.sampleRate = FS;
    riffwave.header.numChannels = 1;
    riffwave.header.bitsPerSample = 16;
    riffwave.Make(data);
    const audio = new Audio(riffwave.dataURI);
    return audio;
} */
// ---------------------------------------------
// Source API for Students
// ---------------------------------------------

// Data abstractions:
// time: real value in seconds  x > 0
// amplitude: real value -1 <= x <= 1
// duration: real value in seconds 0 < x < Infinity
// sound: (time -> amplitude) x duration

/**
 * Makes a Sound from a wave and a duration.
 * The wave is a function from a non-negative time (in seconds)
 * to an amplitude value that should lie between
 * -1 and 1. The duration is given in seconds.
 * @param {function} wave - given wave function
 * @param {Number} duration - in seconds
 * @returns {Sound} 
 */
function make_sound(wave, duration) {
    return pair(t => t >= duration ? 0 : wave(t), duration);
}

/**
 * Accesses the wave of a Sound.
 * The wave is a function from a non-negative time (in seconds)
 * to an amplitude value that should lie between
 * -1 and 1.
 * @param {Sound} sound - given sound
 * @returns {function} wave function of the sound
 */
function get_wave(sound) {
    return head(sound);
}

/**
 * Accesses the duration of a Sound, in seconds.
 * @param {Sound} sound - given Sound
 * @returns {Number} duration in seconds
 */
function get_duration(sound) {
    return tail(sound);
}

/**
 * Checks if a given value is a Sound
 * @param {value} x - given value
 * @returns {boolean} whether <CODE>x</CODE> is a Sound
 */
function is_sound(x) {
    return is_pair(x) &&
    ((typeof get_wave(x)) === 'function') &&
    ((typeof get_duration(x)) === 'number');
}

/**
 * makes a silence Sound with a given duration
 * @param {Number} duration - duration of result Sound, in seconds
 * @returns {Sound} resulting silence Sound
 */
function silence_sound(duration) {
    return make_sound(t => 0*t, duration);
}

// Singular audio context for all playback functions
let audioplayer;
// Track if a sound is currently playing
let playing;

// Instantiates new audio context
function init_audio_ctx() {
    audioplayer = new (window.AudioContext || window.webkitAudioContext)();
}
/* Real time playback of a sound, unsuitable for complex sounds
function play_unsafe(sound) {
    // type-check sound
    if ( !is_sound(sound) ) {
        throw new Error(`play is expecting sound, but encountered ${sound}`);
    // If a sound is already playing, terminate execution
    } else if (playing) {
        throw new Error("play: audio system still playing previous sound");
    } else if (get_duration(sound) <= 0) {
        return sound;
    } else {
        // Declaring duration and wave variables
        const wave = get_wave(sound);
        const duration = get_duration(sound);
        
        playing = true;
      
        // Instantiate audio context if it has not been instantiated
        if (!audioplayer) {
            init_audio_ctx();
        }

        // Controls Length of buffer in seconds.
        const bufferLength = 0.1;

        // Define Buffer Size
        const bufferSize = FS * bufferLength;

        // Create two buffers
        const buffer1 = audioplayer.createBuffer(1, bufferSize, FS);
        const buffer2 = audioplayer.createBuffer(1, bufferSize, FS);

        // Keep track of elapsedDuration & first run of ping_pong
        let elapsedDuration = 0;
        let firstRun = true;
		const startTime = audioplayer.currentTime;
        // Schedules playback of sounds
        function ping_pong(current_sound, next_sound, current_buffer, next_buffer) {
            // If sound has exceeded duration, early return to stop calls.
            if (elapsedDuration > duration || !playing) { 
                current_sound.disconnect(audioplayer.destination);
                playing = false;
                return;
            }

            // Fill current_buffer, then play current_sound.
            if (firstRun) {
                // No longer first run of ping_pong.
                firstRun = false;

                // Discretize first chunk, load into current_buffer.
                let currentData = current_buffer.getChannelData(0);
                currentData = discretize_from(wave, duration, elapsedDuration,
                        bufferLength, currentData);

                // Create current_sound.
                current_sound = new AudioBufferSourceNode(audioplayer);

                // Set current_sound's buffer to current_buffer.
                current_sound.buffer = current_buffer;

                // Play current_sound.
                current_sound.connect(audioplayer.destination);
                current_sound.start();

                // Increment elapsed duration.
                elapsedDuration += bufferLength;
            }

            // Fill next_buffer while current_sound is playing,
            // schedule next_sound to play after current_sound terminates.

            // Discretize next chunk, load into next_buffer.
            let nextData = next_buffer.getChannelData(0);
            nextData = discretize_from(wave, duration, elapsedDuration, bufferLength, nextData);

            // Create next_sound.
            next_sound = new AudioBufferSourceNode(audioplayer);

            // Set next_sound's buffer to next_buffer.
            next_sound.buffer = next_buffer;

            // Schedule next_sound to play after current_sound.
            next_sound.connect(audioplayer.destination);
            next_sound.start(startTime + elapsedDuration);

            // Increment elapsed duration.
            elapsedDuration += bufferLength;

            current_sound.onended =
            () => 
                ping_pong(next_sound, current_sound, next_buffer, current_buffer);
        }
        // let startTime = audioplayer.currentTime;
        ping_pong(null, null, buffer1, buffer2);
        return sound;
    }
} */

let audio = null;

// Fully processes a sound before playback
// Frontloads processing so the sound plays back properly,
//   but possibly with a delay
/**
 * plays a given Sound using your computer's sound device
 * @param {Sound} sound - given Sound
 * @returns {Sound} given Sound
 */
function play(sound) {
    // Type-check sound
    if (!is_sound(sound)) {
        throw new Error(`play is expecting sound, but encountered ${sound}`);
    // If a sound is already playing, terminate execution.
    } else if (playing) {
        throw new Error("play: audio system still playing previous sound");
    } else if (get_duration(sound) <= 0) {
        return sound;
    } else {
        // Instantiate audio context if it has not been instantiated.
        if (!audioplayer) {
            init_audio_ctx();
        }

        // Create mono buffer
        const theBuffer = audioplayer.createBuffer(1, FS * get_duration(sound), FS);
        const channel = theBuffer.getChannelData(0);

        // Discretize the function and clip amplitude
        // Discretize the function and clip amplitude
        let temp;
        let prevValue = 0;
        
        const wave = get_wave(sound);
        for (let i = 0; i < channel.length; i+= 1) {
            temp = wave(i/FS);
            // clip amplitude
            channel[i] = temp > 1 ? 1 : temp < -1 ? -1 : temp;

            // smoothen out sudden cut-outs
            if (channel[i] === 0 && Math.abs(channel[i] - prevValue) > 0.01) {
                channel[i] = prevValue * 0.999;
            }

            prevValue = channel[i];
        }

        // quantize
        for (let i = 0; i < channel.length; i+= 1) {
            channel[i] = Math.floor(channel[i] * 32767.999);
        }

        // Connect data to output destination
        // let source = audioplayer.createBufferSource();

        const data = [];
        for (i = 0; i < channel.length; i+= 1) {
            data[i] = channel[i];
        }
        const riffwave = new RIFFWAVE();
        riffwave.header.sampleRate = FS;
        riffwave.header.numChannels = 1;
        riffwave.header.bitsPerSample = 16;
        riffwave.Make(data);
        audio = new Audio(riffwave.dataURI);
        // source.buffer = theBuffer;
        
        const source2 = audioplayer.createMediaElementSource(audio);
        const webplayer = document.getElementById("sound-tab-player");

        webplayer.src = riffwave.dataURI;
        source2.connect(audioplayer.destination);
        // const htmlStatus = document.getElementById("play-pause");

        playing = true;
        audio.play();
        // webplayer.play();
        // source2.start();
        audio.onended = () => {
            source2.disconnect(audioplayer.destination);
            playing = false;
        }

        return sound;
    }
}

/**
 * plays a given sound without regard if a sound is already playing
 * @param {Sound} sound - given sound
 * @returns {undefined}  undefined
 */
function play_concurrently(sound) {
    // Type-check sound
    if (!is_sound(sound)) {
        throw new Error(`play_concurrently is expecting sound, but encountered ${sound}`);
    }  else if (get_duration(sound) <= 0) {

    } else {
        // Instantiate audio context if it has not been instantiated
        if (!audioplayer) {
            init_audio_ctx();
        }

        // Create mono buffer
        const theBuffer = audioplayer.createBuffer(1, FS * get_duration(sound), FS);
        const channel = theBuffer.getChannelData(0);

        // Discretize the function and clip amplitude
        let temp;
        let prevValue = 0;

        const wave = get_wave(sound);
        for (let i = 0; i < channel.length; i+= 1) {
            temp = wave(i/FS);
            // clip amplitude
            channel[i] = temp > 1 ? 1 : temp < -1 ? -1 : temp;

            // smoothen out sudden cut-outs
            if (channel[i] === 0 && Math.abs(channel[i] - prevValue) > 0.01) {
                channel[i] = prevValue * 0.999;
            }

            prevValue = channel[i];
        }
		
		// Trying to transfer to audio tag
		/* let anotherArray = new Float32Array();
		theBuffer.copyFromChannel(anotherArray,0,0); 
		const blob = new Blob([anotherArray], { type: "audio/wav" });
		const url = window.URL.createObjectURL(blob); //creates a URL for the blob
		
		var audio = document.createElement('audio');
		audio.src = url;
		audio.play();
		*/
		
		
		/* Trying to implement audioplayer.resume, audioplayer.suspend
		var btn = document.getElementById("soundButton")
		btn.innerHTML = "Pause";
		btn.onclick =audioplayer.suspend;
		*/
		

        // Connect data to output destination
        const source = audioplayer.createBufferSource();
        source.buffer = theBuffer;
        
        source.connect(audioplayer.destination);
        playing = true;
        source.start();
        source.onended = () => {
            source.disconnect(audioplayer.destination);
            playing = false;
        }
        
    }

}

/**
 * Stops playing the current sound
 * @returns {undefined} undefined
 */
function stop() {
    audioplayer.close();
    audioplayer = null;
    playing = false;
}

// Concats a list of sounds
/**
 * makes a new sound by combining the sounds in a given
 * list so that
 * they are arranged consecutively. Let us say the durations
 * of the sounds are <CODE>d1</CODE>, ..., <CODE>dn</CODE> and the wave 
 * functions are <CODE>w1</CODE>, ..., <CODE>wn</CODE>. Then the resulting
 * sound has the duration of the sum of <CODE>d1</CODE>, ..., <CODE>dn</CODE>.
 * The wave function <CODE>w</CODE> of the resulting sound uses <CODE>w1</CODE> for the first
 * <CODE>d1</CODE> seconds, <CODE>w2</CODE> for the next 
 * <CODE>d2</CODE> seconds etc. We specify that <CODE>w(d1) = w2(0)</CODE>,
 * <CODE>w(d1+d2) = w3(0)</CODE>, etc
 * @param {list_of_sounds} sounds - given list of sounds
 * @returns {Sound} resulting sound
 */
function consecutively(list_of_sounds) {
    function consec_two(ss1, ss2) {
        const wave1 = head(ss1);
        const wave2 = head(ss2);
        const dur1 = tail(ss1);
        const dur2 = tail(ss2);
        const newWave = t => t < dur1 ? wave1(t) : wave2(t - dur1);
        return pair(newWave, dur1 + dur2);
    }
    return accumulate(consec_two, silence_sound(0), list_of_sounds);
}

// returns the length of a given argument list
// throws an exception if the argument is not a list
function length(xs) {
  let ys = xs;
  let i = 0;
  while (!is_null(ys)) {
    i += 1;
    ys = tail(ys);
  }
  return i;
}

// Mushes a list of sounds together
/**
 * makes a new sound by combining the sounds in a given
 * list so that
 * they play simutaneously, all starting at the beginning of the 
 * resulting sound
 * @param {list_of_sounds} sounds - given list of sounds
 * @returns {Sound} resulting sound
 */
function simultaneously(list_of_sounds) {
    function musher(ss1, ss2) {
        const wave1 = head(ss1);
        const wave2 = head(ss2);
        const dur1 = tail(ss1);
        const dur2 = tail(ss2);
        // newWave assumes sound discipline (ie, wave(t) = 0 after t > dur)
        const newWave = t => wave1(t) + wave2(t);
        // newDuration is higher of the two dur
        const newDuration = dur1 < dur2 ? dur2 : dur1;
        return pair(newWave, newDuration);
    }

    const mushedSounds = accumulate(musher, silence_sound(0), list_of_sounds);
    const normalisedWave =  t =>
	(head(mushedSounds))(t) / length(list_of_sounds);
    const highestDuration = tail(mushedSounds);
    return pair(normalisedWave, highestDuration);
}

/**
 * makes a Sound of a given duration by randomly
 * generating amplitude values
 * @param {Number} duration - duration of result sound, in seconds
 * @returns {Sound} resulting noise sound
 */
function noise_sound(duration) {
    return make_sound(t => Math.random() * 2 - 1 + t - t, duration);
}

/**
 * makes a sine wave Sound with given frequency and a given duration
 * @param {Number} freq - frequency of result Sound, in Hz, <CODE>freq</CODE> ≥ 0
 * @param {Number} duration - duration of result Sound, in seconds
 * @returns {Sound} resulting sine Sound
 */
function sine_sound(freq, duration) {
    return make_sound(t => Math.sin(2 * Math.PI * t * freq), duration);
}

/**
 * makes a square wave Sound with given frequency and a given duration
 * @param {Number} freq - frequency of result Sound, in Hz, <CODE>freq</CODE> ≥ 0
 * @param {Number} duration - duration of result Sound, in seconds
 * @returns {Sound} resulting square Sound
 */
function square_sound(freq, duration) {
    function fourier_expansion_square(t) {
        let answer = 0;
        for (let i = 1; i <= FOURIER_EXPANSION_LEVEL; i+= 1) {
            answer += Math.sin(2 * Math.PI * (2 * i - 1) * freq * t)/ (2 * i - 1);
        }
        return answer;
    }
    return make_sound(t => 
        (4 / Math.PI) * fourier_expansion_square(t),
        duration);
}

/**
 * makes a triangle wave Sound with given frequency and a given duration
 * @param {Number} freq - frequency of result Sound, in Hz, <CODE>freq</CODE> ≥ 0
 * @param {Number} duration - duration of result Sound, in seconds
 * @returns {Sound} resulting triangle Sound
 */
function triangle_sound(freq, duration) {
    function fourier_expansion_triangle(t) {
        let answer = 0;
        for (let i = 0; i < FOURIER_EXPANSION_LEVEL; i+= 1) {
            answer += Math.pow(-1, i) * Math.sin((2 * i + 1) * t * freq * Math.PI * 2) / Math.pow((2 * i + 1), 2);
        }
        return answer;
    }
    return make_sound(t => 
        (8 / Math.PI / Math.PI) * fourier_expansion_triangle(t),
        duration);
}

/**
 * makes a sawtooth wave Sound with given frequency and a given duration
 * @param {Number} freq - frequency of result Sound, in Hz; <CODE>freq</CODE> ≥ 0
 * @param {Number} duration - duration of result Sound, in seconds
 * @returns {Sound} resulting sawtooth Sound
 */
function sawtooth_sound(freq, duration) {
    function fourier_expansion_sawtooth(t) {
        let answer = 0;
        for (let i = 1; i <= FOURIER_EXPANSION_LEVEL; i += 1) {
            answer += Math.sin(2 * Math.PI * i * freq * t) / i;
        }
        return answer;
    }
    return make_sound(t =>
		      (1 / 2) - (1 / Math.PI) * fourier_expansion_sawtooth(t),
		      duration);
}

/**
 * converts a letter name <CODE>str</CODE> to corresponding midi note.
 * Examples for letter names are <CODE>"A5"</CODE>, <CODE>"B3"</CODE>, <CODE>"D#4"</CODE>.
 * See <a href="https://i.imgur.com/qGQgmYr.png">mapping from
 * letter name to midi notes</a>
 * @param {string} str - given letter name
 * @returns {Number} midi value of the corresponding note
 */
function letter_name_to_midi_note(note_name) {
    // we don't consider double flat/ double sharp
    note = [...note_name];
    let res = 12; // C0 is midi note 12
    const n = note[0].toUpperCase();
    switch (n) {
        case 'D':
            res += 2;
            break;

        case 'E':
            res += 4;
            break;

        case 'F':
            res += 5;
            break;

        case 'G':
            res += 7;
            break;

        case 'A':
            res += 9;
            break;

        case 'B':
            res += 11;
            break;

        default:
            break;
    }
  
    if (note.length === 2) {
        res = parseInt(note[1], 10) * 12 + res;
    } else if (note.length === 3) {
        switch (note[1]) {
            case '#':
                res += 1;
                break;
  
            case 'b':
                res -= 1;
                break;
  
            default:
                break;
        }
    res = parseInt(note[2], 10) * 12 + res;
    }
  
    return res;
  }


/**
 * converts a midi note <CODE>n</CODE> to corresponding frequency.
 * The note is given as an integer Number.
 * @param {Number} n - given midi note
 * @returns {Number} frequency of the note in Hz
 */
function midi_note_to_frequency(note) {
    // A4 = 440Hz = midi note 69
    return 440 * (2 ** ((note - 69) / 12));
}

/**
 * converts a letter name <CODE>str</CODE> to corresponding frequency.
 * First converts <CODE>str</CODE> to a note using <CODE>letter_name_to_midi_note</CODE>
 * and then to a frequency using <CODE>midi_note_to_frequency</CODE>
 * @param {string} str - given letter name
 * @returns {Number} frequency of corresponding note in Hz
 */
function letter_name_to_frequency(note) {
    return midi_note_to_frequency(letter_name_to_midi_note(note));
}

// linear decay from 1 to 0 over decay_period
function linear_decay(decay_period) {
    return t => {
        if ((t > decay_period) || (t < 0)) {
            return 0;
        }
        return 1 - (t / decay_period);
    }
}
  
/**
 * Returns an envelope: a function from Sound to Sound.
 * When the envelope is applied to a Sound, it returns
 * a new Sound that results from applying ADSR to
 * the given Sound. The Attack, Sustain and
 * Release ratios are given in the first, second and fourth
 * arguments, and the Sustain level is given in 
 * the third argument as a fraction between 0 and 1.
 * @param {Number} attack_ratio - proportion of Sound in attack phase
 * @param {Number} decay_ratio - proportion of Sound decay phase
 * @param {Number} sustain_level - sustain level between 0 and 1
 * @param {Number} release_ratio - proportion of Sound release phase
 * @returns {function} envelope: function from Sound to Sound
 */
function adsr(attack_ratio, decay_ratio, sustain_level, release_ratio) {
    return sound => {
        const wave = get_wave(sound);
        const duration = get_duration(sound);
        const attackTime = duration * attack_ratio;
         decayTime = duration * decay_ratio;
        const releaseTime = duration * release_ratio;
        return make_sound( x => {
            if (x < attackTime) {
                return wave(x) * (x / attackTime);
            }
			if (x < attackTime + decayTime) {
                return ((1 - sustain_level) * 
                        (linear_decay(decayTime))(x - attackTime) + sustain_level) *
                         wave(x);
            }
			if (x < duration - releaseTime) {
                return wave(x) * sustain_level;
            } 
			if (x <= duration) {
                return wave(x) * sustain_level * 
                        (linear_decay(releaseTime))(x - (duration - releaseTime));
            }
            return 0;
        }, duration);
    };
  }
  
// waveform is a function that accepts freq, dur and returns Sound
/**
 * Returns a Sound that results from applying a list of envelopes
 * to a given wave form. The wave form should be a Sound generator that
 * takes a frequency and a duration as arguments and produces a
 * Sound with the given frequency and duration. Each envelope is
 * applied to a harmonic: the first harmonic has the given frequency,
 * the second has twice the frequency, the third three times the
 * frequency etc.
 * @param {function} waveform - function from frequency and duration to Sound
 * @param {Number} base_frequency - frequency of the first harmonic
 * @param {Number} duration - duration of the produced Sound, in seconds
 * @param {list_of_envelope} envelopes - each a function from Sound to Sound
 * @returns {Sound} resulting Sound
 */
function stacking_adsr(waveform, base_frequency, duration, envelopes) {
    function zip(lst, n) {
      if (is_null(lst)) {
        return lst;
      }
      return pair(pair(n, head(lst)), zip(tail(lst), n + 1));
    }
  
    return simultaneously(accumulate(
        (x, y) => pair((tail(x))
               (waveform(base_frequency * head(x), duration))
               , y)
        , null
        , zip(envelopes, 1)));
}
  
// instruments for students

/**
 * returns a Sound that is reminiscent of a trombone, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {Number} note - midi note
 * @param {Number} duration - duration in seconds
 * @returns {Sound} resulting trombone Sound with given given pitch and duration
 */
function trombone(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration,
        list(adsr(0.2, 0, 1, 0.1),
        adsr(0.3236, 0.6, 0, 0.1)));
}

/**
 * returns a Sound that is reminiscent of a piano, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {Number} note - midi note
 * @param {Number} duration - duration in seconds
 * @returns {Sound} resulting piano Sound with given given pitch and duration
 */
function piano(note, duration) {
    return stacking_adsr(triangle_sound, midi_note_to_frequency(note), duration,
        list(adsr(0, 0.515, 0, 0.05),
        adsr(0, 0.32, 0, 0.05),
        adsr(0, 0.2, 0, 0.05)));
}

/**
 * returns a Sound that is reminiscent of a bell, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {Number} note - midi note
 * @param {Number} duration - duration in seconds
 * @returns {Sound} resulting bell Sound with given given pitch and duration
 */
function bell(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration,
        list(adsr(0, 0.6, 0, 0.05),
        adsr(0, 0.6618, 0, 0.05),
        adsr(0, 0.7618, 0, 0.05),
        adsr(0, 0.9071, 0, 0.05)));
}

/**
 * returns a Sound that is reminiscent of a violin, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {Number} note - midi note
 * @param {Number} duration - duration in seconds
 * @returns {Sound} resulting violin Sound with given given pitch and duration
 */
function violin(note, duration) {
    return stacking_adsr(sawtooth_sound, midi_note_to_frequency(note), duration,
        list(adsr(0.35, 0, 1, 0.15),
        adsr(0.35, 0, 1, 0.15),
        adsr(0.45, 0, 1, 0.15),
        adsr(0.45, 0, 1, 0.15)));
}

/**
 * returns a Sound that is reminiscent of a cello, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {Number} note - midi note
 * @param {Number} duration - duration in seconds
 * @returns {Sound} resulting cello Sound with given given pitch and duration
 */
function cello(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration,
        list(adsr(0.05, 0, 1, 0.1),
        adsr(0.05, 0, 1, 0.15),
        adsr(0, 0, 0.2, 0.15)));
}

// Requires 'All' libraries!
function display_waveform(numPoints_per_second, sound) {
    const wave = get_wave(sound);
    const duration = get_duration(sound);
    const numPoints = numPoints_per_second * duration;
    return draw_connected_full_view_proportional(numPoints)(t => pair(t, wave(duration * t)));
}

/* sound_to_string and string_to_sound would be really cool!!!

function sound_to_string(sound) {
    let discretized_wave = discretize(wave(sound), duration(sound));
    let discretized_sound = pair(discretized_wave, duration(sound));
    return stringify(pair(data), tail(sound));
}

function string_to_sound(str) {
    var discretized_sound = eval(str);
    
    return pair(t => ..., duration(data));
}
*/

let permission = undefined;

let recordedSound = undefined;

// check_permission is called whenever we try
// to record a sound
function check_permission() {
    if (permission === undefined) {
	throw new Error("Call init_record(); " +
		    "to obtain permission to use microphone");
    } else if (permission === false) {
	throw new Error("Permission has been denied.\n" +
		    "Re-start browser and call init_record();\n" +
		    "to obtain permission to use microphone.");
    } // (permission === true): do nothing
}

let globalStream;


function rememberStream(stream) {
    permission = true;	
    globalStream = stream;
}

function setPermissionToFalse() {
    permission = false;	
}

/**
 * Initialize recording by obtaining permission
 * to use the default device microphone
 * @returns {undefined} 
 */
function init_record(){
    navigator.mediaDevices.getUserMedia({ audio: true })
	.then(rememberStream, setPermissionToFalse);
    return "obtaining recording permission";
}

// Converts input microphone sound (blob) into array format.
function convertToArrayBuffer(blob) {
    const url = URL.createObjectURL(blob);
    
    return fetch(url).then(response => {
        return response.arrayBuffer();
    });
}

function save(audioBuffer) {
    const array = audioBuffer.getChannelData(0);
    const duration = array.length / FS;
    recordedSound = 
        make_sound( t => {
            const index = t * FS
            const lowerIndex = Math.floor(index)
            const upperIndex = lowerIndex + 1
            const ratio = index - lowerIndex
            const upper = array[upperIndex] ? array[upperIndex] : 0
            const lower = array[lowerIndex] ? array[lowerIndex] : 0
            return lower * (1 - ratio) + upper * ratio
        }, duration);
}

function process(data) {
    const audioContext = new AudioContext();
    const blob = new Blob(data);
    
    convertToArrayBuffer(blob)
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(save);
}

function start_recording(mediaRecorder) {
    const data = [];
    mediaRecorder.ondataavailable = e => e.data.size && data.push(e.data);
    mediaRecorder.start(); 
    mediaRecorder.onstop = () => process(data);
}

// there is a beep signal at the beginning and end
// of each recording
const recordingSignalDurationms = 300;

function play_recording_signal() {
    play(sine_sound(500, recordingSignalDurationms / 1000));
}

/**
 * takes a <CODE>buffer</CODE> duration (in seconds) as argument, and
 * returns a nullary stop function <CODE>stop</CODE>. A call
 * <CODE>stop()</CODE> returns a sound promise: a nullary function
 * that returns a sound. Example: <PRE><CODE>init_record();
 * const stop = record(0.5);
 * // record after 0.5 seconds. Then in next query:
 * const promise = stop();
 * // In next query, you can play the promised sound, by
 * // applying the promise:
 * play(promise());</CODE></PRE>
 * @param {number} buffer - pause before recording, in seconds
 * @returns {function} nullary <CODE>stop</CODE> function;
 * <CODE>stop()</CODE> stops the recording and 
 * returns a sound promise: a nullary function that returns the recorded sound
 */
 
function record(buffer) {
    check_permission();
    const mediaRecorder = new MediaRecorder(globalStream);
    play_recording_signal();
    setTimeout(() => {    
		start_recording(mediaRecorder);
    }, recordingSignalDurationms + buffer * 1000);
    return () => {
	mediaRecorder.stop();
	play_recording_signal();
	return () => {
	    if (recordedSound === undefined) {
		throw new Error("recording still being processed")
	    } else {
		return recordedSound;
	    }
	};
    };
}

/**
 * Records a sound of given <CODE>duration</CODE> in seconds, after
 * a <CODE>buffer</CODE> also in seconds, and
 * returns a sound promise: a nullary function
 * that returns a sound. Example: <PRE><CODE>init_record();
 * const promise = record_for(2, 0.5);
 * // In next query, you can play the promised sound, by
 * // applying the promise:
 * play(promise());</CODE></PRE>
 * @param {number} duration - duration in seconds
 * @param {number} buffer - pause before recording, in seconds
 * @returns {function} <CODE>promise</CODE>: nullary function which returns the recorded sound
 */
 
function record_for(duration, buffer) {
    recordedSound = undefined;
    const durationms = duration * 1000;
    check_permission();
    const mediaRecorder = new MediaRecorder(globalStream);
    play_recording_signal();
    setTimeout(() => {
	start_recording(mediaRecorder);
        setTimeout(() => {
	    mediaRecorder.stop();
	    play_recording_signal();
        }, durationms);
    }, recordingSignalDurationms + buffer * 1000);
    return () => {
	    if (recordedSound === undefined) {
		throw new Error("recording still being processed")
	    } else {
		return recordedSound;
	    }
    };
}



// exported functions
export default function (_params: __Params) {
  return {
	make_sound,
	get_duration,
	get_wave,
	is_sound,
	play,
	play_concurrently,
	sine_sound,
	square_sound,
	triangle_sound,
	sawtooth_sound,
	noise_sound,
	silence_sound,
	consecutively,
	simultaneously,
	piano,
	cello,
	bell,
	violin,
	trombone,
	letter_name_to_frequency,
	letter_name_to_midi_note,
	midi_note_to_frequency,
	init_record,
	record,
	record_for,
	display_waveform,
	stop,
  };
}
