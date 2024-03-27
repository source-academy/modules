/**
 *
 * The `stereo_sound` module build on the `sound` module by accommodating stereo sounds.
 * Within this module, all Sounds are represented in stereo, with two waves, left and right.
 *
 * A Stereo Sound (just denoted as "Sound" in this document) is
 a `pair(pair(left_wave, right_wave), duration)` where duration is the length of the Sound in seconds.
 * The constructor `make_stereo_sound` and accessors `get_left_wave`, `get_right_wave`, and `get_duration` are provided.
 * The `make_sound` constructor from sounds is syntatic sugar for `make_stereo_sounds` with equal waves.
 *
 * @module stereo_sound
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
  get_left_wave,
  get_right_wave,
  // Recording
  init_record,
  is_sound,
  letter_name_to_frequency,
  // MIDI
  letter_name_to_midi_note,
  make_sound,
  // Constructor/Accessors/Typecheck
  make_stereo_sound,
  midi_note_to_frequency,
  // Basic waveforms
  noise_sound,
  pan,
  pan_mod,
  phase_mod,
  piano,
  play,
  // Play-related
  play_in_tab,
  play_wave,
  play_waves,
  record,
  record_for,
  sawtooth_sound,
  silence_sound,
  simultaneously,
  sine_sound,
  square_sound,
  squash,
  stacking_adsr,
  stop,
  triangle_sound,
  trombone,
  violin
} from './functions';
