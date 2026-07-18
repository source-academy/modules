import { InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
import { head, is_null, is_pair, tail } from 'js-slang/dist/stdlib/list';
import type { BinaryTree, EmptyBinaryTree, NonEmptyBinaryTree } from './types';

/**
 * Returns an empty binary tree, represented by the empty list null
 * @example
 * ```
 * display(make_empty_tree()); // Shows "null" in the REPL
 * ```
 * @returns An empty binary tree
 */
export function make_empty_tree(): BinaryTree {
  return null;
}

/**
 * Returns a binary tree node composed of the specified left subtree, value and right subtree.
 * @example
 * ```
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(tree); // Shows "[1, [null, [null, null]]]" in the REPL
 * ```
 * @param value Value to be stored in the node
 * @param left Left subtree of the node
 * @param right Right subtree of the node
 * @returns A binary tree
 */
export function make_tree(value: any, left: BinaryTree, right: BinaryTree): BinaryTree {
  if (!is_tree(left)) {
    throw new InvalidParameterTypeError('binary tree', left, make_tree.name, 'left');
  }

  if (!is_tree(right)) {
    throw new InvalidParameterTypeError('binary tree', right, make_tree.name, 'right');
  }

  return [value, [left, [right, null]]];
}

/**
 * Returns a boolean value, indicating whether the given
 * value is a binary tree.
 * @example
 * ```
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(is_tree(tree)); // Shows "true" in the REPL
 * ```
 * @param value Value to be tested
 */
export function is_tree(value: unknown): value is BinaryTree {
  if (is_empty_tree(value)) return true;

  if (!is_pair(value)) return false;

  const left = tail(value);
  if (!is_pair(left) || !is_tree(head(left))) return false;

  const right = tail(left);
  if (!is_pair(right) || !is_tree(head(right))) return false;

  return is_null(tail(right));
}

/**
 * Returns a boolean value, indicating whether the given
 * value is an empty binary tree.
 * @example
 * ```
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(is_empty_tree(tree)); // Shows "false" in the REPL
 * ```
 * @param value Value to be tested
 * @returns bool
 */
export function is_empty_tree(value: unknown): value is EmptyBinaryTree {
  return value === null;
}

function throwIfNotNonEmptyTree(value: unknown, func_name: string): asserts value is NonEmptyBinaryTree {
  if (!is_tree(value)) {
    throw new InvalidParameterTypeError('binary tree', value, func_name);
  }

  if (is_empty_tree(value)) {
    throw new InvalidParameterTypeError('non-empty binary tree', value, func_name);
  }
}

/**
 * Returns the entry of a given binary tree.
 * @example
 * ```
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(entry(tree)); // Shows "1" in the REPL
 * ```
 * @param t BinaryTree to be accessed
 * @returns Value
 */
export function entry(t: BinaryTree): any {
  throwIfNotNonEmptyTree(t, entry.name);
  return head(t);
}

/**
 * Returns the left branch of a given binary tree.
 * @example
 * ```
 * const tree = make_tree(1, make_tree(2, make_empty_tree(), make_empty_tree()), make_empty_tree());
 * display(entry(left_branch(tree))); // Shows "2" in the REPL
 * ```
 * @param t BinaryTree to be accessed
 * @returns BinaryTree
 */
export function left_branch(t: BinaryTree): BinaryTree {
  throwIfNotNonEmptyTree(t, left_branch.name);
  return head(tail(t)!);
}

/**
 * Returns the right branch of a given binary tree.
 * @example
 * ```
 * const tree = make_tree(1, make_empty_tree(), make_tree(2, make_empty_tree(), make_empty_tree()));
 * display(entry(right_branch(tree))); // Shows "2" in the REPL
 * ```
 * @param t BinaryTree to be accessed
 * @returns BinaryTree
 */
export function right_branch(t: BinaryTree): BinaryTree {
  throwIfNotNonEmptyTree(t, right_branch.name);
  return head(tail(tail(t)!)!);
}
