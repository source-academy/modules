import { describe, expect, it, test } from 'vitest';
import * as funcs from '../functions';

describe(funcs.create_matrix, () => {
  it('throws an error when num_rows is not a number', () => {
    expect(() => funcs.create_matrix('s' as any, 1, ''))
      .toThrowError('create_matrix: Expected an integer value for rows, got: s')
  });

  it('throws an error when num_cols is not a number', () => {
    expect(() => funcs.create_matrix(1, 's' as any, ''))
      .toThrowError('create_matrix: Expected an integer value for columns, got: s')
  });

  it('throws an error when num_cols or num_rows is less than 1', () => {
    expect(() => funcs.create_matrix(0, 1, ''))
      .toThrowError('create_matrix: Cannot create a matrix with fewer than 1 row or column!')

    expect(() => funcs.create_matrix(1, 0, ''))
      .toThrowError('create_matrix: Cannot create a matrix with fewer than 1 row or column!')
  });
});

describe(funcs.copy_matrix, () => {
  it('works', () => {
    const mat = funcs.create_matrix(10, 10, 'mat');
    const copied = funcs.copy_matrix(mat);

    expect(copied.buttons).toEqual([]);
    expect(copied.name).toEqual(['mat Copy'])
  });
});