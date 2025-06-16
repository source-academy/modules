/**
 * The `sound_fft` module provides functions for converting Source Sounds to
 * their frequency-domain representations and vice versa, as well as processing
 * Sounds in the frequency domain.
 *
 * For more information about Sounds in Source, see the `sound` module.
 *
 * In this module, the frequency-domain representation of a Sound is a list
 * in which each element is an AugmentedSample. An AugmentedSample describes
 * the magnitude, phase and frequency of a sample in the frequency domain.
 *
 * Sound processing in the frequency domain is done via frequency filters,
 * known as Filters. A Filter is a function that takes in a list of
 * AugmentedSamples and returns another list of AugmentedSamples. Hence, a
 * Filter can be applied to a frequency-domain representation to transform it.
 *
 * The conversion between Sounds and frequency-domain representations is
 * implemented using FFT (Fast Fourier Transform).
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
