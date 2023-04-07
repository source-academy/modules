/**
 *
 * The stereo sounds library build on the sounds library by accommodating stereo sounds.
 * Within this library, all sounds are represented in stereo, with two waves, left and right.
 *
 * A Stereo Sound is a `pair(pair(left_wave, right_wave), duration)` where duration is the length of the sound in seconds.
 * The constructor `make_stereo_sound` and accessors `get_left_wave`, `get_right_wave`, and `get_duration` are provided.
 * The `make_sound` constructor from sounds is syntatic sugar for `make_stereo_sounds` with equal waves.
 *
 * @module stereo_sound
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */

export {
  // Constructor/Accessors/Typecheck
  make_stereo_sound,
  make_sound,
  get_left_wave,
  get_right_wave,
  get_duration,
  is_sound,
  squash,
  pan,
  pan_mod,
  // Play-related
  play,
  play_wave,
  play_waves,
  play_concurrently,
  stop,
  // Recording
  init_record,
  record,
  record_for,
  // Composition and Envelopes
  consecutively,
  simultaneously,
  phase_mod,
  adsr,
  stacking_adsr,
  // Basic waveforms
  noise_sound,
  silence_sound,
  sine_sound,
  sawtooth_sound,
  triangle_sound,
  square_sound,
  // MIDI
  letter_name_to_midi_note,
  midi_note_to_frequency,
  letter_name_to_frequency,
  // Instruments
  bell,
  cello,
  piano,
  trombone,
  violin,
} from './functions';
