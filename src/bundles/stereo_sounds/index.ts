import {
  // Constructor/Accessors/Typecheck
  make_stereo_sound,
  make_sound,
  get_left_wave,
  get_right_wave,
  get_duration,
  is_sound,
  squash,
  // Play-related
  play,
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

export default function sounds() {
  return {
    // Constructor/Accessors/Typecheck
    make_stereo_sound,
    make_sound,
    get_left_wave,
    get_right_wave,
    get_duration,
    is_sound,
    squash,
    // Play-related
    play,
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
  };
}
