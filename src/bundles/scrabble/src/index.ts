/**
 * Scrabble words for Source Academy
 * @author Martin Henz
 * @module scrabble
 */
import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';

import {
  scrabble_letters,
  scrabble_letters_tiny,
  scrabble_words,
  scrabble_words_tiny
} from './functions';

export default class ScrabbleModulePlugin extends BaseModulePlugin {
  id = 'scrabble';
  exportedNames = [] as const;
  static channelAttach = [];
  constructor(conduit: IConduit, channels: IChannel<any>[], evaluator: IInterfacableEvaluator) {
    super(conduit, channels, evaluator);
  }

  // All four exports are static data, not closures, so there's nothing for the default
  // exportedNames/@moduleMethod machinery to pick up. opaque_make keeps the word lists as a
  // single identifier-backed blob instead of marshalling 172,820 entries through array_make/
  // array_set one call at a time. Has to happen here rather than the constructor: opaque_make
  // is async, and the runner awaits initialise() (see ModuleLoaderRunnerPlugin.requestModule)
  // before the module is usable.
  override async initialise() {
    await super.initialise();
    const [words, letters, wordsTiny, lettersTiny] = await Promise.all([
      this.evaluator.opaque_make(scrabble_words, true),
      this.evaluator.opaque_make(scrabble_letters, true),
      this.evaluator.opaque_make(scrabble_words_tiny, true),
      this.evaluator.opaque_make(scrabble_letters_tiny, true)
    ]);
    this.exports.push(
      { symbol: 'scrabble_words', value: words },
      { symbol: 'scrabble_letters', value: letters },
      { symbol: 'scrabble_words_tiny', value: wordsTiny },
      { symbol: 'scrabble_letters_tiny', value: lettersTiny }
    );
  }
}
