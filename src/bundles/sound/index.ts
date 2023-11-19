/**
 * The sounds library provides functions for constructing and playing sounds.
 *
 * A wave is a function that takes in a number `t` and returns
 * a number representing the amplitude at time `t`.
 * The amplitude should fall within the range of [-1, 1].
 *
 * A Sound is a pair(wave, duration) where duration is the length of the sound in seconds.
 * The constructor make_sound and accessors get_wave and get_duration are provided.
 *
 * Sound Discipline:
 * For all sounds, the wave function applied to and time `t` beyond its duration returns 0, that is:
 * `(get_wave(sound))(get_duration(sound) + x) === 0` for any x >= 0.
 *
 * Two functions which combine Sounds, `consecutively` and `simultaneously` are given.
 * Additionally, we provide sound transformation functions `adsr` and `phase_mod`
 * which take in a Sound and return a Sound.
 *
 * Finally, the provided `play` function takes in a Sound and plays it using your
 * computer's sound system.
 *
 * @module sound
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */
export {
  adsr,
  // Instruments
  bell,
  cello,
  // Composition and Envelopes
  consecutively,
  get_duration,
  get_wave,
  // Recording
  init_record,
  is_sound,
  letter_name_to_frequency,
  // MIDI
  letter_name_to_midi_note,
  // Constructor/Accessors/Typecheck
  make_sound,
  midi_note_to_frequency,
  // Basic waveforms
  noise_sound,
  phase_mod,
  piano,
  // Play-related
  play_in_tab,
  play,
  play_wave,
  record,
  record_for,
  sawtooth_sound,
  silence_sound,
  simultaneously,
  sine_sound,
  square_sound,
  stacking_adsr,
  stop,
  triangle_sound,
  trombone,
  violin,
} from './functions';
