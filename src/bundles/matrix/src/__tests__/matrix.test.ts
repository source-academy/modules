import { InvalidCallbackError, InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
import { list, pair, set_tail } from 'js-slang/dist/stdlib/list';
import { describe, expect, it, test } from 'vitest';
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
  it('throws an error when the parameter is not a matrix', () => {
    expect(() => funcs.copy_matrix(0 as any)).toThrowError('copy_matrix: Expected Matrix, got 0.');
  });

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

describe(funcs.get_cell_labels, () => {
  const matrix = funcs.create_matrix(2, 2, undefined);

  funcs.set_cell_labels(matrix, [['1', '2'], ['3', '4']]);

  it('throws an error when the first parameter is not a matrix', () => {
    expect(() => funcs.get_cell_labels(0 as any)).toThrowError('get_cell_labels: Expected Matrix, got 0.');
  });

  it('copies the labels', () => {
    const labels = funcs.get_cell_labels(matrix);
    labels[0][0] = '5';
    expect(matrix.labels[0][0]).toEqual('1');
  });
});

describe(funcs.get_cell_values, () => {
  const matrix = funcs.create_matrix(2, 2, undefined);
  funcs.set_cell_values(matrix, [[true, false], [false, true]]);

  it('throws an error when the first parameter is not a matrix', () => {
    expect(() => funcs.get_cell_values(0 as any)).toThrowError('get_cell_values: Expected Matrix, got 0.');
  });

  it('copies the values', () => {
    const values = funcs.get_cell_values(matrix);
    values[0][0] = false;
    expect(matrix.values[0][0]).toEqual(true);
  });
});

describe(funcs.install_buttons, () => {
  const matrix = funcs.create_matrix(2, 2, undefined);

  it('throws an error when the first parameter is not a matrix', () => {
    expect(() => funcs.install_buttons(0 as any, null)).toThrowError('install_buttons: Expected Matrix, got 0.');
  });

  it('works when buttons is an empty list', () => {
    expect(() => funcs.install_buttons(matrix, null)).not.toThrow();
  });

  it('works with a circular list', () => {
    const func0 = () => {};
    const button0 = pair('0', func0);
    const button1 = pair('1', () => {});
    const button2 = pair('2', () => {});

    const lastPair = pair(button2, null);
    const lst = pair(button0, pair(button1, lastPair));

    set_tail(lastPair, lst); // Make the list circular

    expect(() => funcs.install_buttons(matrix, lst)).not.toThrow();
    const installedButtons = matrix.buttons;
    expect(installedButtons).toHaveLength(3);

    expect(installedButtons[0][0]).toEqual('0');
    expect(installedButtons[0][1]).toBe(func0);

    expect(installedButtons[1][0]).toEqual('1');
    expect(installedButtons[2][0]).toEqual('2');
  });

  it('throws an error when buttons is not a list of pairs', () => {
    expect(() => funcs.install_buttons(matrix, pair('not a pair', null)))
      .toThrowError('Expected a list containing only of pairs of strings and nullary functions');
  });

  describe('throws an error when buttons is not a list of pairs of strings and nullary functions', () => {
    test.each([
      list('not a pair'),
      list(pair('0', 0)),
      list(pair('0', _x => {})),
      list(pair(0, () => {})),
    ])('%o', buttons => {
      expect(() => funcs.install_buttons(matrix, buttons))
        .toThrowError('Expected a list containing only of pairs of strings and nullary functions');
    });
  });
});

describe(funcs.on_cell_click, () => {
  const matrix = funcs.create_matrix(1, 1, undefined);

  it('throws an error when the first parameter is not a matrix', () => {
    expect(() => funcs.on_cell_click(0 as any, () => {}))
      .toThrowError('on_cell_click: Expected Matrix, got 0.');
  });

  it('throws an error when callback is not a function', () => {
    try {
      funcs.on_cell_click(matrix, () => {});
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCallbackError);
      expect((error as InvalidCallbackError).message).toMatch(/on_cell_click: Expected function with 4 parameters for callback, got .+/);
      return;
    }
    throw new Error('Expected on_cell_click to throw an error when callback is not a function!');
  });

  it('throws an error when callback is not a function with 4 parameters', () => {
    try {
      funcs.on_cell_click(matrix, () => {});
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidParameterTypeError);
      expect((e as InvalidParameterTypeError).message).toMatch(/on_cell_click: Expected function with 4 parameters for callback, got .+/);
      return;
    }
    throw new Error(`Expected ${funcs.on_cell_click.name} to throw an error when callback is not a function with 4 parameters!`);
  });

  it('works', () => {
    const fn: CellCallback = (_a, _b, _c, _d) => {};
    funcs.on_cell_click(matrix, fn);
    expect(matrix.onCellClick).toBe(fn);
  });
});

describe(funcs.on_col_click, () => {
  const matrix = funcs.create_matrix(1, 1, undefined);

  it('throws an error when the first parameter is not a matrix', () => {
    expect(() => funcs.on_col_click(0 as any, () => {}))
      .toThrowError('on_col_click: Expected Matrix, got 0.');
  });

  it('throws an error when callback is not a function', () => {
    expect(() => funcs.on_col_click(matrix, 0 as any))
      .toThrowError('on_col_click: Expected function with 2 parameters for callback, got 0.');
  });

  it('throws an error when callback is not a function with 2 parameters', () => {
    try {
      funcs.on_col_click(matrix, () => {});
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCallbackError);
      expect((error as InvalidCallbackError).message).toMatch(/on_col_click: Expected function with 2 parameters for callback, got .+/);
      return;
    }

    throw new Error(`Expected ${funcs.on_col_click.name} to throw an error when callback is not a function!`);
  });

  it('works', () => {
    const fn = (_a: number, _b: boolean) => {};
    funcs.on_col_click(matrix, fn);
    expect(matrix.onColClick).toBe(fn);
  });
});

describe(funcs.on_row_click, () => {
  const matrix = funcs.create_matrix(1, 1, undefined);

  it('throws an error when the first parameter is not a matrix', () => {
    expect(() => funcs.on_row_click(0 as any, () => {}))
      .toThrowError('on_row_click: Expected Matrix, got 0.');
  });

  it('throws an error when callback is not a function', () => {
    expect(() => funcs.on_row_click(matrix, 0 as any))
      .toThrowError('on_row_click: Expected function with 2 parameters for callback, got 0.');
  });

  it('throws an error when callback is not a function with 2 parameters', () => {
    try {
      funcs.on_row_click(matrix, () => {});
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCallbackError);
      expect((error as InvalidCallbackError).message).toMatch(/on_row_click: Expected function with 2 parameters for callback, got .+/);
      return;
    }

    throw new Error(`Expected ${funcs.on_row_click.name} to throw an error when callback is not a function with 2 parameters!`);
  });

  it('works', () => {
    const fn = (_a: number, _b: boolean) => {};
    funcs.on_row_click(matrix, fn);
    expect(matrix.onRowClick).toBe(fn);
  });
});

describe(funcs.set_cell_values, () => {
  const matrix = funcs.create_matrix(2, 2, undefined);

  it('throws an error when the first parameter is not a matrix', () => {
    expect(() => funcs.set_cell_values(0 as any, [[]]))
      .toThrowError('set_cell_values: Expected Matrix, got 0.');
  });

  it('throws an error when the second parameter is not a 2D array of booleans', () => {
    expect(() => funcs.set_cell_values(matrix, [
      [true, true],
      [1, 0] as any
    ]))
      .toThrowErrorMatchingInlineSnapshot(`
        InvalidParameterTypeError {
          "actualValue": [
            [
              true,
              true,
            ],
            [
              1,
              0,
            ],
          ],
          "expectedType": "2D boolean array",
          "func_name": "set_cell_values",
          "location": {
            "end": {
              "column": -1,
              "line": -1,
            },
            "start": {
              "column": -1,
              "line": -1,
            },
          },
          "param_name": undefined,
          "severity": "Error",
          "type": "Runtime",
        }
      `);
  });
});

describe(funcs.set_cell_labels, () => {
  const matrix = funcs.create_matrix(2, 2, undefined);

  it('throws an error when the first parameter is not a matrix', () => {
    expect(() => funcs.set_cell_labels(0 as any, [[]]))
      .toThrowError('set_cell_labels: Expected Matrix, got 0.');
  });

  it('throws an error when the second parameter is not a 2D array of strings', () => {
    expect(() => funcs.set_cell_labels(matrix, [
      ['a', 'b'],
      ['c', 1] as any
    ]))
      .toThrowErrorMatchingInlineSnapshot(`
        InvalidParameterTypeError {
          "actualValue": [
            [
              "a",
              "b",
            ],
            [
              "c",
              1,
            ],
          ],
          "expectedType": "2D string array",
          "func_name": "set_cell_labels",
          "location": {
            "end": {
              "column": -1,
              "line": -1,
            },
            "start": {
              "column": -1,
              "line": -1,
            },
          },
          "param_name": undefined,
          "severity": "Error",
          "type": "Runtime",
        }
      `);
  });
});
