/**
 * The `binary_tree` Source Module provides functions for the interaction with binary trees, as covered the textbook
 * [Structure and Interpretation of Computer Programs, JavaScript Adaptation (SICP JS)](https://sourceacademy.org/sicpjs)
 * in [section 2.3.3 Example: Representing Sets](https://sourceacademy.org/sicpjs/2.3.3#h3).
 * Click on a function name in the index below to see how the function is defined and used.
 * @module binary_tree
 */
import type { BinaryTree } from './types';

/**
 * Returns an empty binary tree, represented by the empty list null
 * @example
 * ```typescript
 * display(make_empty_tree()); // Shows "null" in the REPL
 * ```
 * @return An empty binary tree
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
export function make_tree(
  value: any,
  left: BinaryTree,
  right: BinaryTree,
): BinaryTree {
  return [value, [left, [right, null]]];
}

/**
 * Returns a boolean value, indicating whether the given
 * value is a binary tree.
 * @example
 * ```typescript
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(is_tree(tree)); // Shows "true" in the REPL
 * ```
 * @param v Value to be tested
 * @returns bool
 */
export function is_tree(
  value: any,
): boolean {
  return value === null
         || (Array.isArray(value)
    && value.length === 2
    && Array.isArray(value[1])
      && value[1].length === 2
    && is_tree(value[1][0])
    && value[1][1].length === 2
    && is_tree(value[1][1][0])
    && value[1][1][1] === null);
}

/**
 * Returns a boolean value, indicating whether the given
 * value is an empty binary tree.
 * @example
 * ```typescript
 * const tree = make_tree(1, make_empty_tree(), make_empty_tree());
 * display(is_empty_tree(tree)); // Shows "false" in the REPL
 * ```
 * @param v Value to be tested
 * @returns bool
 */
export function is_empty_tree(
  value: any,
): boolean {
  return value === null;
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
export function entry(
  t: BinaryTree,
): boolean {
  if (Array.isArray(t) && t.length === 2) {
    return t[0];
  }
  throw new Error(
    `function entry expects binary tree, received: ${t}`,
  );
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
export function left_branch(
  t: BinaryTree,
): BinaryTree {
  if (Array.isArray(t) && t.length === 2
      && Array.isArray(t[1]) && t[1].length === 2) {
    return t[1][0];
  }
  throw new Error(
    `function left_branch expects binary tree, received: ${t}`,
  );
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
export function right_branch(
  t: BinaryTree,
): BinaryTree {
  if (Array.isArray(t) && t.length === 2
      && Array.isArray(t[1]) && t[1].length === 2
      && Array.isArray(t[1][1]) && t[1][1].length === 2) {
    return t[1][1][0];
  }
  throw new Error(
    `function right_branch expects binary tree, received: ${t}`,
  );
}
