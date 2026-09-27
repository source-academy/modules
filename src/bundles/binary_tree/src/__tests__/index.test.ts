import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import { TestDataHandler, emptyListValue, numberValue } from '@sourceacademy/modules-testplugin';
import { describe, expect, it } from 'vitest';
import * as funcs from '../functions';

async function rawTree(
  handler: TestDataHandler,
  value: number,
  left: TypedValue<DataType>,
  right: TypedValue<DataType>
) {
  return handler.pair_make(
    numberValue(value),
    await handler.pair_make(left, await handler.pair_make(right, emptyListValue()))
  );
}

async function flatTree(
  handler: TestDataHandler,
  value: number,
  left: TypedValue<DataType>,
  right: TypedValue<DataType>
) {
  const tree = await handler.array_make(DataType.ANY, 3, emptyListValue());
  await handler.array_set(tree, 0, numberValue(value));
  await handler.array_set(tree, 1, left);
  await handler.array_set(tree, 2, right);
  return tree;
}

describe(funcs.is_tree, () => {
  it('returns false when argument is not a list', async () => {
    const handler = new TestDataHandler();
    await expect(funcs.is_tree(handler, numberValue(0))).resolves.toEqual(false);
  });

  it('returns false when argument is a list of 4 elements', async () => {
    const handler = new TestDataHandler();
    const arg = await handler.list(
      numberValue(0),
      funcs.make_empty_tree(),
      funcs.make_empty_tree(),
      funcs.make_empty_tree()
    );
    await expect(funcs.is_tree(handler, arg)).resolves.toEqual(false);
  });

  it('returns false when the branches are not trees', async () => {
    const handler = new TestDataHandler();
    const notTree = await handler.list(numberValue(0), numberValue(1), numberValue(2));
    await expect(funcs.is_tree(handler, notTree)).resolves.toEqual(false);

    const alsoNotTree = await handler.list(numberValue(1), notTree, emptyListValue());
    await expect(funcs.is_tree(handler, alsoNotTree)).resolves.toEqual(false);
  });

  it('returns true when argument is a tree (simple)', async () => {
    const handler = new TestDataHandler();
    const tree = await rawTree(handler, 0, emptyListValue(), emptyListValue());
    await expect(funcs.is_tree(handler, tree)).resolves.toEqual(true);
  });

  it('returns true when argument is a tree (complex)', async () => {
    const handler = new TestDataHandler();
    const leftLeaf = await rawTree(handler, 0, emptyListValue(), emptyListValue());
    const rightLeaf = await rawTree(handler, 1, emptyListValue(), emptyListValue());
    const rightSubtree = await handler.pair_make(rightLeaf, emptyListValue());
    const tree = await handler.pair_make(
      numberValue(0),
      await handler.pair_make(leftLeaf, rightSubtree)
    );
    await expect(funcs.is_tree(handler, tree)).resolves.toEqual(true);
  });

  it('returns true for a tree passed back in as a flat 3-element DataType.ARRAY', async () => {
    // py-slang and js-slang both flatten a proper list into one ARRAY when a program passes it to a
    // module, so a tree that make_tree returned comes back as [entry, left, right], not as a PAIR chain.
    const handler = new TestDataHandler();
    const leaf = await flatTree(handler, 4, emptyListValue(), emptyListValue());
    const tree = await flatTree(handler, 5, leaf, emptyListValue());

    await expect(funcs.is_tree(handler, leaf)).resolves.toEqual(true);
    await expect(funcs.is_tree(handler, tree)).resolves.toEqual(true);
  });

  it('returns false for a DataType.ARRAY that does not have exactly 3 elements', async () => {
    const handler = new TestDataHandler();
    const two = await handler.array_make(DataType.ANY, 2, emptyListValue());
    const four = await handler.array_make(DataType.ANY, 4, emptyListValue());

    await expect(funcs.is_tree(handler, two)).resolves.toEqual(false);
    await expect(funcs.is_tree(handler, four)).resolves.toEqual(false);
  });

  it('returns false for a flat DataType.ARRAY whose branches are not trees', async () => {
    const handler = new TestDataHandler();
    const tree = await flatTree(handler, 0, numberValue(1), emptyListValue());
    await expect(funcs.is_tree(handler, tree)).resolves.toEqual(false);
  });
});

describe(funcs.make_tree, () => {
  it('throws when left is not a tree', async () => {
    const handler = new TestDataHandler();
    await expect(
      funcs.make_tree(handler, numberValue(0), numberValue(0) as unknown as TypedValue<DataType.LIST>, funcs.make_empty_tree())
    ).rejects.toThrowError('make_tree expects binary tree for left');
  });

  it('throws when right is not a tree', async () => {
    const handler = new TestDataHandler();
    await expect(
      funcs.make_tree(handler, numberValue(0), funcs.make_empty_tree(), numberValue(0) as unknown as TypedValue<DataType.LIST>)
    ).rejects.toThrowError('make_tree expects binary tree for right');
  });

  it('accepts a branch passed back in as a flat 3-element DataType.ARRAY', async () => {
    // Regression: make_tree(5, make_tree(4, None, None), None) failed with
    // "make_tree expects binary tree for left (expected binary tree, got ARRAY)".
    const handler = new TestDataHandler();
    const leaf = await flatTree(handler, 4, emptyListValue(), emptyListValue());
    const tree = await funcs.make_tree(handler, numberValue(5), leaf as unknown as TypedValue<DataType.LIST>, funcs.make_empty_tree());

    await expect(funcs.entry(handler, tree)).resolves.toEqual(numberValue(5));
    const left = await funcs.left_branch(handler, tree);
    await expect(funcs.entry(handler, left)).resolves.toEqual(numberValue(4));
  });
});

describe(funcs.entry, () => {
  it('throws when argument is not a tree', async () => {
    const handler = new TestDataHandler();
    await expect(funcs.entry(handler, numberValue(0))).rejects.toThrowError('entry expects binary tree');
  });

  it('throws when argument is an empty tree', async () => {
    const handler = new TestDataHandler();
    await expect(funcs.entry(handler, emptyListValue())).rejects.toThrowError(
      'entry received an empty binary tree!'
    );
  });

  it('works', async () => {
    const handler = new TestDataHandler();
    const tree = await funcs.make_tree(
      handler,
      numberValue(0),
      funcs.make_empty_tree(),
      funcs.make_empty_tree()
    );
    const result = await funcs.entry(handler, tree);
    expect(result).toEqual(numberValue(0));
  });
});

describe(funcs.left_branch, () => {
  it('throws when argument is not a tree', async () => {
    const handler = new TestDataHandler();
    await expect(funcs.left_branch(handler, numberValue(0))).rejects.toThrowError('left_branch expects binary tree');
  });

  it('throws when argument is an empty tree', async () => {
    const handler = new TestDataHandler();
    await expect(funcs.left_branch(handler, emptyListValue())).rejects.toThrowError(
      'left_branch received an empty binary tree!'
    );
  });

  it('works (simple)', async () => {
    const handler = new TestDataHandler();
    const tree = await funcs.make_tree(
      handler,
      numberValue(0),
      funcs.make_empty_tree(),
      funcs.make_empty_tree()
    );
    const left = await funcs.left_branch(handler, tree);
    expect(left.type).toEqual(DataType.EMPTY_LIST);
  });

  it('works (complex)', async () => {
    const handler = new TestDataHandler();
    const innerTree = await funcs.make_tree(
      handler,
      numberValue(1),
      funcs.make_empty_tree(),
      funcs.make_empty_tree()
    );
    const tree = await funcs.make_tree(
      handler,
      numberValue(0),
      innerTree,
      funcs.make_empty_tree()
    );

    expect(await funcs.entry(handler, tree)).toEqual(numberValue(0));

    const leftTree = await funcs.left_branch(handler, tree);
    expect(await funcs.entry(handler, leftTree)).toEqual(numberValue(1));
  });
});

describe('accessors on a flat DataType.ARRAY tree', () => {
  it('read entry, left_branch and right_branch by position', async () => {
    const handler = new TestDataHandler();
    const left = await flatTree(handler, 1, emptyListValue(), emptyListValue());
    const right = await flatTree(handler, 2, emptyListValue(), emptyListValue());
    const tree = await flatTree(handler, 0, left, right);

    await expect(funcs.entry(handler, tree)).resolves.toEqual(numberValue(0));
    await expect(funcs.left_branch(handler, tree)).resolves.toBe(left);
    await expect(funcs.right_branch(handler, tree)).resolves.toBe(right);
  });
});

describe(funcs.right_branch, () => {
  it('throws when argument is not a tree', async () => {
    const handler = new TestDataHandler();
    await expect(funcs.right_branch(handler, numberValue(0))).rejects.toThrowError(
      'right_branch expects binary tree'
    );
  });

  it('throws when argument is an empty tree', async () => {
    const handler = new TestDataHandler();
    await expect(funcs.right_branch(handler, emptyListValue())).rejects.toThrowError(
      'right_branch received an empty binary tree!'
    );
  });

  it('works (simple)', async () => {
    const handler = new TestDataHandler();
    const tree = await funcs.make_tree(
      handler,
      numberValue(0),
      funcs.make_empty_tree(),
      funcs.make_empty_tree()
    );
    const right = await funcs.right_branch(handler, tree);
    expect(right.type).toEqual(DataType.EMPTY_LIST);
  });

  it('works (complex)', async () => {
    const handler = new TestDataHandler();
    const leftTree = await funcs.make_tree(
      handler,
      numberValue(1),
      funcs.make_empty_tree(),
      funcs.make_empty_tree()
    );
    const rightTree = await funcs.make_tree(
      handler,
      numberValue(2),
      funcs.make_empty_tree(),
      funcs.make_empty_tree()
    );
    const tree = await funcs.make_tree(handler, numberValue(0), leftTree, rightTree);

    expect(await funcs.entry(handler, tree)).toEqual(numberValue(0));

    const right = await funcs.right_branch(handler, tree);
    expect(await funcs.entry(handler, right)).toEqual(numberValue(2));
  });
});
