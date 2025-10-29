import { create_matrix, on_cell_click, on_col_click, on_row_click, set_cell_value } from '@sourceacademy/bundle-matrix/functions';
import type { Matrix } from '@sourceacademy/bundle-matrix/types';
import { describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { cleanup, render, type RenderResult } from 'vitest-browser-react';
import MatrixDisplay from '../MatrixDisplay';

interface Fixtures {
  matrix: Matrix;
  display: RenderResult;
}

const testWithMatrix = test.extend<Fixtures>({
  matrix: ({}, useValue) => useValue(create_matrix(3, 3, undefined)),
  display: async ({ matrix }, useValue) => {
    const component = await render(<MatrixDisplay
      showColLabels
      matrix={matrix}
      rerenderCallback={() => {}}
    />);
    await useValue(component);
    cleanup();
  }
});

describe('Row callbacks', () => {
  testWithMatrix('Default callback with fully selected row', async ({ matrix, display }) => {
    for (let i = 0; i < 3; i++) {
      set_cell_value(matrix, 0, i, true);
    }

    const label = display.getByTitle('row_0_label');
    await userEvent.click(label);

    expect(matrix.values[0]).toEqual([false, false, false]);
  });

  testWithMatrix('Default callback with row with some selected', async ({ matrix, display }) => {
    set_cell_value(matrix, 0, 0, true);

    const label = display.getByTitle('row_0_label');
    await userEvent.click(label);

    expect(matrix.values[0]).toEqual([true, true, true]);
  });

  testWithMatrix('Default callback with row with none selected', async ({ matrix, display }) => {
    const label = display.getByTitle('row_0_label');
    await userEvent.click(label);

    expect(matrix.values[0]).toEqual([true, true, true]);
  });

  testWithMatrix('Providing a different callback', async ({ matrix }) => {
    const callback = vi.fn((_a, _b) => {});
    on_row_click(matrix, callback);

    const display = await render(<MatrixDisplay showColLabels matrix={matrix} rerenderCallback={() => {}}/>);
    const label = display.getByTitle('row_0_label');
    await userEvent.click(label);

    expect(callback).toHaveBeenCalledExactlyOnceWith(0, false);
    // This new callback doesn't change anything, so no values in the matrix should change
    expect(matrix.values[0]).toEqual([false, false, false]);
  });
});

describe('Col callbacks', () => {
  testWithMatrix('Default callback with fully selected column', async ({ matrix, display }) => {
    for (let i = 0; i < 3; i++) {
      set_cell_value(matrix, i, 0, true);
    }
    const label = display.getByTitle('col_0_label');
    await userEvent.click(label);

    for (let i = 0; i < 3; i++) {
      expect(matrix.values[i][0]).toEqual(false);
    }
  });

  testWithMatrix('Default callback with column with some selected', async ({ matrix, display }) => {
    set_cell_value(matrix, 0, 1, true);
    const label = display.getByTitle('col_0_label');
    await userEvent.click(label);

    for (let i = 0; i < 3; i++) {
      expect(matrix.values[i][0]).toEqual(true);
    }
  });

  testWithMatrix('Default callback with column with none selected', async ({ matrix, display }) => {
    const label = display.getByTitle('col_0_label');
    await userEvent.click(label);

    for (let i = 0; i < 3; i++) {
      expect(matrix.values[i][0]).toEqual(true);
    }
  });

  testWithMatrix('Providing a different callback', async ({ matrix }) => {
    const callback = vi.fn((_a, _b) => {});
    on_col_click(matrix, callback);

    const display = await render(<MatrixDisplay showColLabels matrix={matrix} rerenderCallback={() => {}}/>);
    const label = display.getByTitle('col_0_label');
    await userEvent.click(label);

    expect(callback).toHaveBeenCalledExactlyOnceWith(0, false);
    // This new callback doesn't change anything, so no values in the matrix should change
    for (let i = 0; i < 3; i++) {
      expect(matrix.values[i][0]).toEqual(false);
    }
  });
});

describe('Default cell callback', () => {
  testWithMatrix('inverts cell value', async ({ matrix, display }) => {
    expect(matrix.values[0][0]).toEqual(false);

    const label = display.getByTitle('cell_0_0_button');
    await userEvent.click(label);

    expect(matrix.values[0][0]).toEqual(true);
  });

  testWithMatrix('Providing a different callback', async ({ matrix }) => {
    const callback = vi.fn((_a, _b, _c, _d) => {});
    on_cell_click(matrix, callback);

    const display = await render(<MatrixDisplay matrix={matrix} rerenderCallback={() => {}}/>);
    const label = display.getByTitle('cell_1_0_button');
    await userEvent.click(label);

    expect(callback).toHaveBeenCalledExactlyOnceWith(1, 0, false, 'left');
    // This new callback doesn't change anything, so no values in the matrix should change
    expect(matrix.values[1][0]).toEqual(false);
  });
});
