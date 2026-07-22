import { EvaluatorRuntimeError, EvaluatorTypeError } from '@sourceacademy/conductor/common';
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';
import { mEmptyList } from '@sourceacademy/conductor/util';
import type { BinaryTree, EmptyBinaryTree, NonEmptyBinaryTree } from './types';

/**
 * Returns an empty binary tree, represented by the empty list null
 * @example
 * ```
 * display(make_empty_tree()); // Shows "null" in the REPL
 * ```
 * @returns An empty binary tree
 */
export function make_empty_tree(): EmptyBinaryTree {
  return mEmptyList();
}

/**
 * Returns a binary tree node composed of the specified left subtree, value and right subtree.
 * @example
 * ```
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(tree); // Shows "[1, [null, [null, null]]]" in the REPL
 * ```
 * @param evaluator The Conductor data handler for the running evaluator
 * @param value Value to be stored in the node
 * @param left Left subtree of the node
 * @param right Right subtree of the node
 * @returns A binary tree
 */
export async function make_tree(
  evaluator: IDataHandler,
  value: TypedValue<DataType.OPAQUE>,
  left: BinaryTree,
  right: BinaryTree
): Promise<NonEmptyBinaryTree> {
  if (!await is_tree(evaluator, left)) {
    throw new EvaluatorTypeError(`${make_tree.name} expects binary tree for left`, 'binary tree', DataType[left.type]);
  }

  if (!await is_tree(evaluator, right)) {
    throw new EvaluatorTypeError(`${make_tree.name} expects binary tree for right`, 'binary tree', DataType[right.type]);
  }

  const rightPair = await evaluator.pair_make(right, mEmptyList());
  const leftPair = await evaluator.pair_make(left, rightPair);
  return evaluator.pair_make(value, leftPair);
}

/**
 * Returns a boolean value, indicating whether the given
 * value is a binary tree.
 * @example
 * ```
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(is_tree(tree)); // Shows "true" in the REPL
 * ```
 * @param evaluator The Conductor data handler for the running evaluator
 * @param value Value to be tested. May be of any Conductor DataType.
 */
export async function is_tree(evaluator: IDataHandler, value: TypedValue<DataType>): Promise<boolean> {
  if (!value) return false;
  if (value.type === DataType.EMPTY_LIST) return true;
  // A tree node is a pair - per conductor's "a pair is just an array of length 2" model, that may
  // arrive tagged DataType.PAIR (built directly by make_tree) or DataType.ARRAY (round-tripped
  // back in through a Python list, since py-slang's pythonToModule builds every list as an ARRAY
  // now, not a PAIR chain). pair_head/pair_tail already read either shape the same way.
  if (!isPairLike(value)) return false;

  const rest = await evaluator.pair_tail(value as TypedValue<DataType.PAIR>);
  if (!isPairLike(rest)) return false;

  const left = await evaluator.pair_head(rest as TypedValue<DataType.PAIR>);
  if (!await is_tree(evaluator, left)) return false;

  const rightRest = await evaluator.pair_tail(rest as TypedValue<DataType.PAIR>);
  if (!isPairLike(rightRest)) return false;

  const right = await evaluator.pair_head(rightRest as TypedValue<DataType.PAIR>);
  if (!await is_tree(evaluator, right)) return false;

  const tail = await evaluator.pair_tail(rightRest as TypedValue<DataType.PAIR>);
  return tail.type === DataType.EMPTY_LIST;
}

/** A pair is just an array of length 2 (no distinct "pair" representation) - a tree node may be
 * tagged either DataType.PAIR (built directly by make_tree's own pair_make calls) or
 * DataType.ARRAY (round-tripped back in through Python, since pythonToModule builds every list as
 * an ARRAY now). Both are equally valid; pair_head/pair_tail read either the same way. */
function isPairLike(value: TypedValue<DataType>): boolean {
  return value.type === DataType.PAIR || value.type === DataType.ARRAY;
}

/**
 * Returns a boolean value, indicating whether the given
 * value is an empty binary tree.
 * @example
 * ```
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(is_empty_tree(tree)); // Shows "false" in the REPL
 * ```
 * @param value Value to be tested. May be of any Conductor DataType.
 * @returns bool
 */
export function is_empty_tree(value: TypedValue<DataType>): value is TypedValue<DataType.EMPTY_LIST> {
  return value?.type === DataType.EMPTY_LIST;
}

async function assertNonEmptyTree(
  evaluator: IDataHandler,
  value: TypedValue<DataType>,
  funcName: string
): Promise<NonEmptyBinaryTree> {
  if (!value || !await is_tree(evaluator, value)) {
    throw new EvaluatorTypeError(`${funcName} expects binary tree`, 'binary tree', value ? DataType[value.type] : 'undefined');
  }

  if (!isPairLike(value)) {
    throw new EvaluatorRuntimeError(`${funcName} received an empty binary tree!`);
  }

  // NonEmptyBinaryTree is declared DataType.PAIR, but the runtime value may genuinely be
  // DataType.ARRAY (round-tripped back in through Python) - pair_head/pair_tail read either the
  // same way (see isPairLike's doc comment), so this is a safe, documented cast, not a lie.
  return value as NonEmptyBinaryTree;
}

/**
 * Returns the entry of a given binary tree.
 * @example
 * ```
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(entry(tree)); // Shows "1" in the REPL
 * ```
 * @param evaluator The Conductor data handler for the running evaluator
 * @param t BinaryTree to be accessed
 * @returns Value
 */
export async function entry(evaluator: IDataHandler, t: TypedValue<DataType>): Promise<TypedValue<DataType.OPAQUE>> {
  const tree = await assertNonEmptyTree(evaluator, t, entry.name);
  return (await evaluator.pair_head(tree)) as TypedValue<DataType.OPAQUE>;
}

/**
 * Returns the left branch of a given binary tree.
 * @example
 * ```
 * const tree = make_tree(1, make_tree(2, make_empty_tree(), make_empty_tree()), make_empty_tree());
 * display(entry(left_branch(tree))); // Shows "2" in the REPL
 * ```
 * @param evaluator The Conductor data handler for the running evaluator
 * @param t BinaryTree to be accessed
 * @returns BinaryTree
 */
export async function left_branch(evaluator: IDataHandler, t: TypedValue<DataType>): Promise<BinaryTree> {
  const tree = await assertNonEmptyTree(evaluator, t, left_branch.name);
  const rest = await evaluator.pair_tail(tree);
  return (await evaluator.pair_head(rest as TypedValue<DataType.PAIR>)) as BinaryTree;
}

/**
 * Returns the right branch of a given binary tree.
 * @example
 * ```
 * const tree = make_tree(1, make_empty_tree(), make_tree(2, make_empty_tree(), make_empty_tree()));
 * display(entry(right_branch(tree))); // Shows "2" in the REPL
 * ```
 * @param evaluator The Conductor data handler for the running evaluator
 * @param t BinaryTree to be accessed
 * @returns BinaryTree
 */
export async function right_branch(evaluator: IDataHandler, t: TypedValue<DataType>): Promise<BinaryTree> {
  const tree = await assertNonEmptyTree(evaluator, t, right_branch.name);
  const rest = await evaluator.pair_tail(tree);
  const rightRest = await evaluator.pair_tail(rest as TypedValue<DataType.PAIR>);
  return (await evaluator.pair_head(rightRest as TypedValue<DataType.PAIR>)) as BinaryTree;
}
