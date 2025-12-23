import { head, is_list, is_pair, list, tail } from 'js-slang/dist/stdlib/list';
import type { BinaryTree, EmptyBinaryTree, NonEmptyBinaryTree } from './types';

/**
 * Returns an empty binary tree, represented by the empty list null
 * @example
 * ```typescript
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
 * ```typescript
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(tree); // Shows "[1, [null, [null, null]]]" in the REPL
 * ```
 * @param value Value to be stored in the node
 * @param left Left subtree of the node
 * @param right Right subtree of the node
 * @returns A binary tree
 */
export function make_tree(value: any, left: BinaryTree, right: BinaryTree): BinaryTree {
  return list(value, left, right);
}

/**
 * Returns a boolean value, indicating whether the given
 * value is a binary tree.
 * @example
 * ```typescript
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(is_tree(tree)); // Shows "true" in the REPL
 * ```
 * @param value Value to be tested
 */
export function is_tree(value: any): value is BinaryTree {
  // TODO: value parameter should be of type unknown
  if (!is_list(value)) return false;

  if (is_empty_tree(value)) return true;

  const left = tail(value);
  if (!is_list(left) || !is_tree(head(left))) return false;

  const right = tail(left);
  if (!is_pair(right) || !is_tree(head(right))) return false;

  return tail(right) === null;
}

/**
 * Returns a boolean value, indicating whether the given
 * value is an empty binary tree.
 * @example
 * ```typescript
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(is_empty_tree(tree)); // Shows "false" in the REPL
 * ```
 * @param value Value to be tested
 * @returns bool
 */
export function is_empty_tree(value: BinaryTree): value is EmptyBinaryTree {
  return value === null;
}

function throwIfNotNonEmptyTree(value: unknown, func_name: string): asserts value is NonEmptyBinaryTree {
  if (!is_tree(value)) {
    throw new Error(`${func_name} expects binary tree, received: ${value}`);
  }

  if (is_empty_tree(value)) {
    throw new Error(`${func_name} received an empty binary tree!`);
  }
}

/**
 * Returns the entry of a given binary tree.
 * @example
 * ```typescript
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(entry(tree)); // Shows "1" in the REPL
 * ```
 * @param t BinaryTree to be accessed
 * @returns Value
 */
export function entry(t: BinaryTree): any {
  throwIfNotNonEmptyTree(t, entry.name);
  return t[0];
}

/**
 * Returns the left branch of a given binary tree.
 * @example
 * ```typescript
 * const tree = make_tree(1, make_tree(2, make_empty_tree(), make_empty_tree()), make_empty_tree());
 * display(entry(left_branch(tree))); // Shows "2" in the REPL
 * ```
 * @param t BinaryTree to be accessed
 * @returns BinaryTree
 */
export function left_branch(t: BinaryTree): BinaryTree {
  throwIfNotNonEmptyTree(t, left_branch.name);
  return head(tail(t));
}

/**
 * Returns the right branch of a given binary tree.
 * @example
 * ```typescript
 * const tree = make_tree(1, make_empty_tree(), make_tree(2, make_empty_tree(), make_empty_tree()));
 * display(entry(right_branch(tree))); // Shows "2" in the REPL
 * ```
 * @param t BinaryTree to be accessed
 * @returns BinaryTree
 */
export function right_branch(t: BinaryTree): BinaryTree {
  throwIfNotNonEmptyTree(t, right_branch.name);
  return head(tail(tail(t)));
}
