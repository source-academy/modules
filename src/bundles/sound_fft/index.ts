/**
 * This provides extra functionality through the use of FFT.
 *
 * Additional details needed.
 *
 * @module sound_fft
 * @author Tran Gia Huy
 * @author Stuart Lim Yi Xiong
 */
export {
  low_pass_filter,
  high_pass_filter,
  combine_filters,

  get_magnitude,
  get_phase,
  get_frequency,
  make_augmented_sample,

  frequency_to_sound,
  sound_to_frequency,

  filter_sound
} from './functions';
