/* eslint-disable new-cap */
import * as ace from 'ace-builds/src-noconflict/ace';
import { HighlightRulesSelector, ModeSelector } from 'js-slang/dist/editors/ace/modes/source';
import { Chapter, Variant } from 'js-slang/dist/types';

export const modeString = `source${Chapter.SOURCE_4}${Variant.DEFAULT}`;

/**
 * This _modifies global state_ and defines a new Ace mode globally, if it does not already exist.
 *
 * You can call this directly in render functions.
 */
export const selectMode = () => {
  const chapter = Chapter.SOURCE_4;
  const variant = Variant.DEFAULT;
  const library = '';

  if (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    typeof ace.define.modules[`ace/mode/${modeString}`]?.Mode
    === 'function'
  ) {
    return;
  }

  HighlightRulesSelector(chapter, variant, library);
  ModeSelector(chapter, variant, library);
};
