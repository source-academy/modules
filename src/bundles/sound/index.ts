import { ModuleContexts, ModuleParams } from '../../typings/type_helpers.js';
import {
  adsr,
  audioPlayed,
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
  play,
  play_concurrently,
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
import { SoundsModuleState } from './types';

export default function sounds(
  moduleParams: ModuleParams,
  moduleContexts: ModuleContexts
) {
  // Update the module's global context
  let moduleContext = moduleContexts.get('sound');

  if (!moduleContext) {
    moduleContext = {
      tabs: [],
      state: {
        audioPlayed,
      },
    };

    moduleContexts.set('sound', moduleContext);
  } else if (!moduleContext.state) {
    moduleContext.state = {
      audioPlayed,
    };
  } else {
    (moduleContext.state as SoundsModuleState).audioPlayed = audioPlayed;
  }

  return {
    // Constructor/Accessors/Typecheck
    make_sound,
    get_wave,
    get_duration,
    is_sound,
    // Play-related
    play,
    play_wave,
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
