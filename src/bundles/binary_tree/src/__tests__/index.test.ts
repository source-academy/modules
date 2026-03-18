import { list } from 'js-slang/dist/stdlib/list';
import { describe, expect, it } from 'vitest';
import * as funcs from '../functions';

describe(funcs.is_tree, () => {
  it('returns false when argument is not a tree', () => {
    const arg = [0, [0, null]];
    expect(funcs.is_tree(arg)).toEqual(false);
  });

  it('returns false when argument is a list of 4 elements', () => {
    const arg = list(0, funcs.make_empty_tree(), funcs.make_empty_tree(), funcs.make_empty_tree());
    expect(funcs.is_tree(arg)).toEqual(false);
  });

  it('returns false when the branches are not trees', () => {
    const not_tree = list(0, 1, 2);
    expect(funcs.is_tree(not_tree)).toEqual(false);

    const also_not_tree = list(1, not_tree, null);
    expect(funcs.is_tree(also_not_tree)).toEqual(false);
  });

  it('returns true when argument is a tree (simple)', () => {
    const arg = [0, [null, [null, null]]];
    expect(funcs.is_tree(arg)).toEqual(true);
  });

  it('returns true when argument is a tree (complex)', () => {
    const arg = [
      0,
      [
        [0, [null, [null, null]]],
        [
          [
            1,
            [
              null,
              [null, null]
            ]
          ],
          null
        ]
      ]
    ];
    expect(funcs.is_tree(arg)).toEqual(true);
  });
});

describe(funcs.make_tree, () => {
  it('throws an error when \'left\' is not a tree', () => {
    expect(() => funcs.make_tree(0, 0 as any, null)).toThrowError('make_tree: Expected binary tree for left, got 0.');
  });

  it('throws an error when \'right\' is not a tree', () => {
    expect(() => funcs.make_tree(0, null, 0 as any)).toThrowError('make_tree: Expected binary tree for right, got 0.');
  });
});

describe(funcs.entry, () => {
  it('throws when argument is not a tree', () => {
    expect(() => funcs.entry(0 as any)).toThrowError('entry: Expected binary tree, got 0.');
  });

  it('throws when argument is an empty tree', () => {
    expect(() => funcs.entry(null)).toThrowError('entry: Expected non-empty binary tree, got null.');
  });

  it('works', () => {
    const tree = funcs.make_tree(0, null, null);
    expect(funcs.entry(tree)).toEqual(0);
  });
});

describe(funcs.left_branch, () => {
  it('throws when argument is not a tree', () => {
    expect(() => funcs.left_branch(0 as any)).toThrowError('left_branch: Expected binary tree, got 0.');
  });

  it('throws when argument is an empty tree', () => {
    expect(() => funcs.left_branch(null)).toThrowError('left_branch: Expected non-empty binary tree, got null.');
  });

  it('works (simple)', () => {
    const tree = funcs.make_tree(0, null, null);
    expect(funcs.left_branch(tree)).toEqual(null);
  });

  it('works (complex)', () => {
    const tree = funcs.make_tree(0, funcs.make_tree(1, null, null), null);
    expect(funcs.entry(tree)).toEqual(0);

    const leftTree = funcs.left_branch(tree);
    expect(funcs.entry(leftTree)).toEqual(1);
  });
});

describe(funcs.right_branch, () => {
  it('throws when argument is not a tree', () => {
    expect(() => funcs.right_branch(0 as any)).toThrowError('right_branch: Expected binary tree, got 0.');
  });

  it('throws when argument is an empty tree', () => {
    expect(() => funcs.right_branch(null)).toThrowError('right_branch: Expected non-empty binary tree, got null.');
  });

  it('works (simple)', () => {
    const tree = funcs.make_tree(0, null, null);
    expect(funcs.right_branch(tree)).toEqual(null);
  });

  it('works (complex)', () => {
    const tree = funcs.make_tree(0, funcs.make_tree(1, null, null), funcs.make_tree(2, null, null));
    expect(funcs.entry(tree)).toEqual(0);

    const rightTree = funcs.right_branch(tree);
    expect(funcs.entry(rightTree)).toEqual(2);
  });
});
