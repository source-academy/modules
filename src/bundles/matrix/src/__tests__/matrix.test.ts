import { describe, expect, it } from 'vitest';
import * as funcs from '../functions';
import type { CellCallback } from '../types';

describe(funcs.create_matrix, () => {
  it('throws an error when num_rows is not a number', () => {
    expect(() => funcs.create_matrix('s' as any, 1, ''))
      .toThrowError('create_matrix: Expected an integer value for rows, got: s');
  });

  it('throws an error when num_cols is not a number', () => {
    expect(() => funcs.create_matrix(1, 's' as any, ''))
      .toThrowError('create_matrix: Expected an integer value for columns, got: s');
  });

  it('throws an error when num_cols or num_rows is less than 1', () => {
    expect(() => funcs.create_matrix(0, 1, ''))
      .toThrowError('create_matrix: Cannot create a matrix with fewer than 1 row or column!');

    expect(() => funcs.create_matrix(1, 0, ''))
      .toThrowError('create_matrix: Cannot create a matrix with fewer than 1 row or column!');
  });
});

describe(funcs.copy_matrix, () => {
  it('works', () => {
    const mat = funcs.create_matrix(10, 10, 'mat');
    funcs.set_cell_value(mat, 1, 1, true);
    const copied = funcs.copy_matrix(mat);

    // Set the value after the copy
    funcs.set_cell_value(mat, 1, 2, true);

    expect(copied.buttons).toEqual([]);
    expect(copied.name).toEqual('mat Copy');
    expect(copied.values[1][1]).toEqual(true);

    expect(mat.values[1][2]).toEqual(true);
    expect(copied.values[1][2]).toEqual(false);
  });
});

describe(funcs.on_cell_click, () => {
  const matrix = funcs.create_matrix(1, 1, undefined);

  it('throws an error when callback is not a function', () => {
    expect(() => funcs.on_cell_click(matrix, 0 as any))
      .toThrowError('on_cell_click expects a function for its callback parameter!');
  });

  it('throws an error when callback is not a function with 4 parameters', () => {
    expect(() => funcs.on_cell_click(matrix, () => {}))
      .toThrowError('on_cell_click expects a function that takes 4 parameters for its callback!');
  });

  it('works', () => {
    const fn: CellCallback = (_a, _b, _c, _d) => {};
    funcs.on_cell_click(matrix, fn);
    expect(matrix.onCellClick).toBe(fn);
  });
});

describe(funcs.on_col_click, () => {
  const matrix = funcs.create_matrix(1, 1, undefined);

  it('throws an error when callback is not a function', () => {
    expect(() => funcs.on_col_click(matrix, 0 as any))
      .toThrowError('on_col_click expects a function for its callback parameter!');
  });

  it('throws an error when callback is not a function with 2 parameters', () => {
    expect(() => funcs.on_col_click(matrix, () => {}))
      .toThrowError('on_col_click expects a function that takes 2 parameters for its callback!');
  });

  it('works', () => {
    const fn = (_a: number, _b: boolean) => {};
    funcs.on_col_click(matrix, fn);
    expect(matrix.onColClick).toBe(fn);
  });
});

describe(funcs.on_row_click, () => {
  const matrix = funcs.create_matrix(1, 1, undefined);

  it('throws an error when callback is not a function', () => {
    expect(() => funcs.on_row_click(matrix, 0 as any))
      .toThrowError('on_row_click expects a function for its callback parameter!');
  });

  it('throws an error when callback is not a function with 2 parameters', () => {
    expect(() => funcs.on_row_click(matrix, () => {}))
      .toThrowError('on_row_click expects a function that takes 2 parameters for its callback!');
  });

  it('works', () => {
    const fn = (_a: number, _b: boolean) => {};
    funcs.on_row_click(matrix, fn);
    expect(matrix.onRowClick).toBe(fn);
  });
});
