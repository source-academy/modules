/**
 * Best-effort conversion of an arbitrary Conductor value into REPL-display text, standing in for
 * js-slang's `stringify()` (which the pre-Conductor version of this bundle called directly on
 * native values - see the module doc comment in index.ts for why that no longer works).
 *
 * There is no Conductor primitive that renders an opaque DataType.ANY value the way `display()`
 * would - that logic lives inside each language's own evaluator, behind the CSE machine, not
 * behind IDataHandler. This recurses over pairs/arrays structurally (the only shapes IDataHandler
 * lets a bundle inspect) and falls back to a fixed placeholder for closures and opaque values,
 * matching how js-slang's own stringify hides bundle-function implementations behind
 * "[Function ... implementation hidden]". Closures/opaque values used as REPL output are
 * consequently lower-fidelity here than they were pre-migration.
 * @module repl
 */
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';

/** Bounds recursion on self-referential pair/array structures. */
const MAX_DEPTH = 64;

export async function stringifyReplValue(evaluator: IDataHandler, value: TypedValue<DataType>): Promise<string> {
  return stringifyReplValueDepth(evaluator, value, 0);
}

async function stringifyReplValueDepth(
  evaluator: IDataHandler,
  value: TypedValue<DataType>,
  depth: number
): Promise<string> {
  if (depth > MAX_DEPTH) return '...';

  switch (value.type) {
    case DataType.VOID:
      return 'undefined';
    case DataType.BOOLEAN:
    case DataType.NUMBER:
    case DataType.INTEGER:
      return String(value.value);
    case DataType.CONST_STRING:
      return value.value;
    case DataType.EMPTY_LIST:
      return 'null';
    case DataType.PAIR: {
      const pair = value as TypedValue<DataType.PAIR>;
      const head = await evaluator.pair_head(pair);
      const tail = await evaluator.pair_tail(pair);
      return `[${await stringifyReplValueDepth(evaluator, head, depth + 1)}, ${await stringifyReplValueDepth(evaluator, tail, depth + 1)}]`;
    }
    case DataType.ARRAY: {
      const array = value as TypedValue<DataType.ARRAY>;
      const length = await evaluator.array_length(array);
      const parts: string[] = [];
      for (let i = 0; i < length; i += 1) {
        // eslint-disable-next-line no-await-in-loop -- each element must be resolved before the next, same as the pair case
        parts.push(await stringifyReplValueDepth(evaluator, await evaluator.array_get(array, i), depth + 1));
      }
      return `[${parts.join(', ')}]`;
    }
    case DataType.CLOSURE:
      return '<function>';
    case DataType.OPAQUE:
      return '<value>';
    default:
      return String((value as TypedValue<DataType.NUMBER>).value);
  }
}
