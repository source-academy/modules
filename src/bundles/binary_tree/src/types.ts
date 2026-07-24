import type { DataType, TypedValue } from '@sourceacademy/conductor/types';

/**
 * An empty binary tree, represented by the Conductor empty list.
 */
export type EmptyBinaryTree = TypedValue<DataType.EMPTY_LIST>;

/**
 * A non-empty binary tree node, represented by a Conductor Pair of length 3:
 * `(entry . (left . (right . empty-list)))`.
 */
export type NonEmptyBinaryTree = TypedValue<DataType.PAIR>;

/**
 * A binary tree, represented by a Conductor List of length 3, or the empty list.
 */
export type BinaryTree = TypedValue<DataType.LIST>;
