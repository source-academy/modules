/**
 * BINARYTREES provide functions for binary trees, as covered the textbook
 * [Structure and Interpretation of Computer Programs, JavaScript Adaptation (SICP JS)](https://sicp.comp.nus.edu.sg/)
 * in [section 2.3.3 Example: Representing Sets](https://sicp.comp.nus.edu.sg/chapters/37).
 * Click on a name on the left to see how they are defined and used.
 * @module BINARYTREES
 */
import { BinaryTree } from './types';

/**
 * Returns an empty binary tree, represented by the empty list null
 * @example
 * ```typescript
 * display(make_empty_tree()); // Shows "[]" in the REPL
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
 * display(tree); // Shows "[null, 1, null]" in the REPL
 * ```
 * @param value Value to be stored in the node
 * @param left Left subtree of the node
 * @param right Right subtree of the node
 * @returns A binary tree
 */
export function make_tree(
  value: any,
  left: BinaryTree,
  right: BinaryTree
): BinaryTree {
  return [left, value, right];
}
