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
  value: TypedValue<DataType>,
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

  const node = await readTreeNode(evaluator, value);
  if (!node) return false;

  const [, left, right] = node;
  return await is_tree(evaluator, left) && await is_tree(evaluator, right);
}

/**
 * Reads a non-empty tree node, the list `[entry, left, right]`, into its three elements, or returns
 * `undefined` if the value is not a list of exactly three elements. The branches themselves are not
 * checked.
 *
 * A node built by make_tree is a chain of DataType.PAIRs. The same node passed back into this module
 * from a program arrives as a flat 3-element DataType.ARRAY instead: py-slang and js-slang both
 * flatten a proper list into one ARRAY on the way in. Walking that ARRAY with pair_head/pair_tail
 * would read its elements 0 and 1 as head and tail, so an ARRAY is read by index instead.
 */
async function readTreeNode(
  evaluator: IDataHandler,
  value: TypedValue<DataType>
): Promise<[TypedValue<DataType>, TypedValue<DataType>, TypedValue<DataType>] | undefined> {
  const elements: TypedValue<DataType>[] = [];
  if (value.type === DataType.ARRAY) {
    const length = await evaluator.array_length(value);
    if (length !== 3) return undefined;
    for (let i = 0; i < length; i += 1) {
      elements.push(await evaluator.array_get(value, i));
    }
  } else {
    let current: TypedValue<DataType> = value;
    while (current.type === DataType.PAIR && elements.length < 4) {
      elements.push(await evaluator.pair_head(current));
      current = await evaluator.pair_tail(current);
    }
    if (current.type !== DataType.EMPTY_LIST || elements.length !== 3) return undefined;
  }
  return elements as [TypedValue<DataType>, TypedValue<DataType>, TypedValue<DataType>];
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
): Promise<[TypedValue<DataType>, TypedValue<DataType>, TypedValue<DataType>]> {
  if (!value || !await is_tree(evaluator, value)) {
    throw new EvaluatorTypeError(`${funcName} expects binary tree`, 'binary tree', value ? DataType[value.type] : 'undefined');
  }

  const node = await readTreeNode(evaluator, value);
  if (!node) {
    throw new EvaluatorRuntimeError(`${funcName} received an empty binary tree!`);
  }
  return node;
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
export async function entry(evaluator: IDataHandler, t: TypedValue<DataType>): Promise<TypedValue<DataType>> {
  const [value] = await assertNonEmptyTree(evaluator, t, entry.name);
  return value;
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
  const [, left] = await assertNonEmptyTree(evaluator, t, left_branch.name);
  return left as BinaryTree;
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
  const [, , right] = await assertNonEmptyTree(evaluator, t, right_branch.name);
  return right as BinaryTree;
}
