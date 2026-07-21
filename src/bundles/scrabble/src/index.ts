/**
 * The `scrabble` Source Module provides the allowable
 * words in Scrabble in a list and in an array, according to
 * https://github.com/benjamincrom/scrabble/blob/master/scrabble/dictionary.json
 *
 * @module scrabble
 * @author Martin Henz
 */
import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';

import {
  scrabble_letters,
  scrabble_letters_tiny,
  scrabble_words,
  scrabble_words_tiny
} from './functions';

async function makeStringArray(
  evaluator: IDataHandler,
  words: readonly string[]
): Promise<TypedValue<DataType.ARRAY, DataType.CONST_STRING>> {
  const array = await evaluator.array_make(DataType.CONST_STRING, words.length);
  for (let i = 0; i < words.length; i++) {
    await evaluator.array_set(array, i, { type: DataType.CONST_STRING, value: words[i] });
  }
  return array;
}

async function makeLetterArray(
  evaluator: IDataHandler,
  letterLists: readonly (readonly string[])[]
): Promise<TypedValue<DataType.ARRAY, DataType.ARRAY>> {
  // array_make requires an explicit init value for DataType.ARRAY elements - there's no sensible
  // implicit zero-value for "an array of arrays". Every slot gets overwritten below, so the
  // content doesn't matter; it just needs to be a valid placeholder.
  const placeholder = await evaluator.array_make(DataType.CONST_STRING, 0);
  const outer = await evaluator.array_make(DataType.ARRAY, letterLists.length, placeholder);
  for (let i = 0; i < letterLists.length; i++) {
    await evaluator.array_set(outer, i, await makeStringArray(evaluator, letterLists[i]));
  }
  return outer;
}

export default class ScrabbleModulePlugin extends BaseModulePlugin {
  id = 'scrabble';
  override exportedNames = [] as const;
  static override channelAttach = [];
  constructor(conduit: IConduit, channels: IChannel<any>[], evaluator: IInterfacableEvaluator) {
    super(conduit, channels, evaluator);
  }

  // All four exports are static data, not closures, so there's nothing for the default
  // exportedNames/@moduleMethod machinery to pick up. array_make has no bulk constructor (one
  // array_set call per element), which looked prohibitive for 172,820 words on paper - measured
  // it instead: ~246ms total (TestDataHandler, same-thread - the module and evaluator share a
  // Runner, so no postMessage boundary in between) for both scrabble_words and the nested
  // scrabble_letters, a one-time cost at module load. That's cheap enough to give students real,
  // indexable arrays instead of DataType.OPAQUE, matching the policy that Python lists/JS arrays
  // should be the only built-in data structure modules hand back.
  override async initialise() {
    await super.initialise();
    const [words, letters, wordsTiny, lettersTiny] = await Promise.all([
      makeStringArray(this.evaluator, scrabble_words),
      makeLetterArray(this.evaluator, scrabble_letters),
      makeStringArray(this.evaluator, scrabble_words_tiny),
      makeLetterArray(this.evaluator, scrabble_letters_tiny)
    ]);
    this.exports.push(
      { symbol: 'scrabble_words', value: words },
      { symbol: 'scrabble_letters', value: letters },
      { symbol: 'scrabble_words_tiny', value: wordsTiny },
      { symbol: 'scrabble_letters_tiny', value: lettersTiny }
    );
  }
}
