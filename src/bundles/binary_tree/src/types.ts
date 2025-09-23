
/**
 * An empty binary tree, represented by the empty list `null`
 */
export type EmptyBinaryTree = null;

/**
 * A binary tree, represented by a list of length 3.
 */
export type NonEmptyBinaryTree = [any, [BinaryTree, [BinaryTree, null]]];

export type BinaryTree = NonEmptyBinaryTree | EmptyBinaryTree;
