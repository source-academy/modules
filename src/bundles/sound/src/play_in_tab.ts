import { GeneralRuntimeError, InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
import context from 'js-slang/context';
import { stringify } from 'js-slang/dist/utils/stringify';
import { FS, get_duration, get_wave, is_sound, validateDuration } from './functions';
import { RIFFWAVE } from './riffwave';
import type { AudioPlayed, Sound } from './types';

export const audioPlayed: AudioPlayed[] = [];
context.moduleContexts.sound.state = { audioPlayed };

/**
 * Adds the given Sound to a list of sounds to be played one-at-a-time
 * in a Source Academy tab.
 *
 * @param sound the Sound to play
 * @returns the given Sound
 * @example
 * ```
 * play_in_tab(sine_sound(440, 5));
 * ```
 */

export function play_in_tab(sound: Sound): Sound {
  // Type-check sound
  if (!is_sound(sound)) {
    throw new InvalidParameterTypeError('Sound', sound, play_in_tab.name);
  }

  const duration = get_duration(sound);
  validateDuration(play_in_tab.name, duration);
  if (duration === 0) return sound;

  // Create mono buffer
  const channel: number[] = [];
  const len = Math.ceil(FS * duration);

  let prev_value = 0;

  const wave = get_wave(sound);
  for (let i = 0; i < len; i += 1) {
    const temp = wave(i / FS);

    if (typeof temp !== 'number') {
      throw new GeneralRuntimeError(`${play_in_tab.name}: Provided Sound returned a non-numeric value ${stringify(temp)}.`);
    }

    // clip amplitude
    if (temp > 1) {
      channel[i] = 1;
    } else if (temp < -1) {
      channel[i] = -1;
    } else {
      channel[i] = temp;
    }

    // smoothen out sudden cut-outs
    if (channel[i] === 0 && Math.abs(channel[i] - prev_value) > 0.01) {
      channel[i] = prev_value * 0.999;
    }

    prev_value = channel[i];
  }

  // quantize
  for (let i = 0; i < channel.length; i += 1) {
    channel[i] = Math.floor(channel[i] * 32767.999);
  }

  // @ts-expect-error RIFFWAVE type definition missing
  const riffwave = new RIFFWAVE([]);
  riffwave.header.sampleRate = FS;
  riffwave.header.numChannels = 1;
  riffwave.header.bitsPerSample = 16;
  riffwave.Make(channel);

  const soundToPlay: AudioPlayed = {
    toReplString: () => '<AudioPlayed>',
    dataUri: riffwave.dataURI
  };
  audioPlayed.push(soundToPlay);
  return sound;
}
