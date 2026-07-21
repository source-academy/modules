import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import { TestDataHandler, emptyListValue, numberValue } from '@sourceacademy/modules-testplugin';
import { describe, expect, it } from 'vitest';
import * as funcs from '../functions';

async function opaqueNumber(handler: TestDataHandler, value: number) {
  return handler.opaque_make(value);
}

async function rawTree(
  handler: TestDataHandler,
  value: number,
  left: TypedValue<DataType>,
  right: TypedValue<DataType>
) {
  return handler.pair_make(
    await opaqueNumber(handler, value),
    await handler.pair_make(left, await handler.pair_make(right, emptyListValue()))
  );
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
      await opaqueNumber(handler, 0),
      await handler.pair_make(leftLeaf, rightSubtree)
    );
    await expect(funcs.is_tree(handler, tree)).resolves.toEqual(true);
  });
});

describe(funcs.make_tree, () => {
  it('throws when left is not a tree', async () => {
    const handler = new TestDataHandler();
    await expect(
      funcs.make_tree(handler, await opaqueNumber(handler, 0), numberValue(0) as unknown as TypedValue<DataType.LIST>, funcs.make_empty_tree())
    ).rejects.toThrowError('make_tree expects binary tree for left');
  });

  it('throws when right is not a tree', async () => {
    const handler = new TestDataHandler();
    await expect(
      funcs.make_tree(handler, await opaqueNumber(handler, 0), funcs.make_empty_tree(), numberValue(0) as unknown as TypedValue<DataType.LIST>)
    ).rejects.toThrowError('make_tree expects binary tree for right');
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
      await opaqueNumber(handler, 0),
      funcs.make_empty_tree(),
      funcs.make_empty_tree()
    );
    const result = await funcs.entry(handler, tree);
    await expect(handler.opaque_get(result)).resolves.toEqual(0);
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
      await opaqueNumber(handler, 0),
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
      await opaqueNumber(handler, 1),
      funcs.make_empty_tree(),
      funcs.make_empty_tree()
    );
    const tree = await funcs.make_tree(
      handler,
      await opaqueNumber(handler, 0),
      innerTree,
      funcs.make_empty_tree()
    );

    await expect(handler.opaque_get(await funcs.entry(handler, tree))).resolves.toEqual(0);

    const leftTree = await funcs.left_branch(handler, tree);
    await expect(handler.opaque_get(await funcs.entry(handler, leftTree))).resolves.toEqual(1);
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
      await opaqueNumber(handler, 0),
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
      await opaqueNumber(handler, 1),
      funcs.make_empty_tree(),
      funcs.make_empty_tree()
    );
    const rightTree = await funcs.make_tree(
      handler,
      await opaqueNumber(handler, 2),
      funcs.make_empty_tree(),
      funcs.make_empty_tree()
    );
    const tree = await funcs.make_tree(handler, await opaqueNumber(handler, 0), leftTree, rightTree);

    await expect(handler.opaque_get(await funcs.entry(handler, tree))).resolves.toEqual(0);

    const right = await funcs.right_branch(handler, tree);
    await expect(handler.opaque_get(await funcs.entry(handler, right))).resolves.toEqual(2);
  });
});
