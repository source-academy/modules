import { Rune } from './rune';

export const RUNE_CHANNEL_ID = 'sourceacademy-rune-channel';
export const RUNE_RUNNER_ID = 'rune-runner';
export const RUNE_WEB_ID = 'rune-web';
export const RUNE_TAB_NAME = 'Rune';

export type SerializedRune = {
  vertices: number[];
  colors: number[] | null;
  transformMatrix: number[];
  subRunes: SerializedRune[];
  textureUrl: string | null;
  hollusionDistance: number;
};

export type RuneRenderMode = 'normal' | 'anaglyph' | 'hollusion';
export type RuneAnimationMode = 'normal' | 'anaglyph';

export type RuneRenderMessage = {
  type: 'render';
  mode: RuneRenderMode;
  rune: SerializedRune;
  magnitude?: number;
};

export type RuneAnimationMessage = {
  type: 'animation';
  mode: RuneAnimationMode;
  duration: number;
  fps: number;
  frames: SerializedRune[];
};

export type RuneDisplayMessage = RuneRenderMessage | RuneAnimationMessage;

export type RuneChannelMessage = RuneDisplayMessage | {
  type: 'request';
};

function serializeTexture(texture: Rune['texture']): string | null {
  if (texture === null) return null;
  if (typeof texture === 'string') return texture;
  return texture.src;
}

export function serializeRune(rune: Rune): SerializedRune {
  return {
    vertices: Array.from(rune.vertices),
    colors: rune.colors === null ? null : Array.from(rune.colors),
    transformMatrix: Array.from(rune.transformMatrix),
    subRunes: rune.subRunes.map(serializeRune),
    textureUrl: serializeTexture(rune.texture),
    hollusionDistance: rune.hollusionDistance
  };
}
