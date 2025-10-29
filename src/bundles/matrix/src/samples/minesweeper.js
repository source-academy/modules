/**
 * A rudimentary implementation of the game Minesweeper
 */

import {
  create_matrix,
  display_matrix,
  install_buttons,
  get_cell_value,
  set_cell_value,
  set_cell_label,
  set_matrix_name,
  on_cell_click
} from 'matrix';

const mat_rows = 20;
const mat_cols = 20;

const mat = create_matrix(mat_rows, mat_cols, 'Minesweeper');
let game_result = 'not_in_game';
const mine_count = 10; // Number of mines to distribute
let closed_cell_count = mat_rows * mat_cols - mine_count; // Number of cells to open

const board = [ // Array indicating where the mines on the board are
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
];

const flags = [ // Array indicating where the flags on the board are
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
];

function game_over(result) {
  // Function for ending the game
  game_result = result;
  if (result === 'loss') {
    set_matrix_name(mat, 'Sorry you lost!');
  } else {
    set_matrix_name(mat, 'You won!');
  }
}

function generate_mines(count) {
  // Function for generating mines across the board

  const cell_count = mat_rows * mat_cols;
  while (count > 0) {
    const value = math_floor(math_random() * cell_count);

    const row_index = math_floor(value / mat_rows);
    const col_index = value % mat_cols;

    if (!board[row_index][col_index]) {
      board[row_index][col_index] = true;
      count = count - 1;
    }
  }
}

function reset_game() {
  // Function for resetting the game to the intial state

  for (let i = 0; i < mat_rows; i = i + 1) {
    for (let j = 0; j < mat_cols; j = j + 1) {
      set_cell_value(mat, i, j, false);
      set_cell_label(mat, i, j, '');
      board[i][j] = false;
      flags[i][j] = false;
    }
  }

  game_result = 'not_in_game';
  set_matrix_name(mat, 'Minesweeper');
  generate_mines(mine_count);
  closed_cell_count = mat_rows * mat_cols - mine_count;
}

function reveal_cell(row, col) {
  // Reveals the given cell. If it doesn't have any mines around it
  // reveal its neighbours too
  // Returns the number of cells revealed

  const neighbours = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1] ,          [0, 1],
    [1, -1] ,  [1, 0], [1, 1]
  ];

  function count_mines(row, col) {
    // Counts the number of mines in the surrounding cells

    let total = 0;
    for (let i = 0; i < 8; i = i + 1) {
      const coords = neighbours[i];
      const rowIndex = row + coords[0];
      if (rowIndex < 0 || rowIndex >= mat_rows) {
        continue;
      }

      const colIndex = col + coords[1];
      if (colIndex < 0 || colIndex >= mat_cols) {
        continue;
      }

      if (board[rowIndex][colIndex]) {
        total = total + 1;
      }
    }

    return total;
  }

  const mines = count_mines(row, col);
  set_cell_value(mat, row, col, true);
  
  if (mines > 0) {
    set_cell_label(mat, row, col, stringify(mines));
    return 1;
  }
  
  let revealed = 1;
  for (let i = 0; i < 8; i = i + 1) {
    const coords = neighbours[i];
    const rowIndex = row + coords[0];
    if (rowIndex < 0 || rowIndex >= mat_rows) {
      continue;
    }

    const colIndex = col + coords[1];
    if (colIndex < 0 || colIndex >= mat_cols) {
      continue;
    }

    if (flags[rowIndex][colIndex]) {
      // Don't reveal flagged cells
      continue;
    }

    // If a cell has already been revealed no need to try and reveal it again
    if (!get_cell_value(mat, rowIndex, colIndex)) {
      revealed = revealed + reveal_cell(rowIndex, colIndex);
    }
  }
  return revealed;
}

function cell_click_callback(row, col, value, click) {
  if (game_result !== 'not_in_game') {
    reset_game();
  } else if (!value) {
    if (click === 'left') {
      if (!flags[row][col]) {
        if (!board[row][col]) {
          const revealed_cells = reveal_cell(row, col);
          closed_cell_count = closed_cell_count - revealed_cells;

          if (closed_cell_count === 0) {
            game_over('win');
          } else {
            set_matrix_name(mat, stringify(closed_cell_count) + ' left to open');
          }
        } else {
          // Clicking on a mine means you die!
          set_cell_label(mat, row, col, '💣');
          set_cell_value(mat, row, col, true);
          game_over('loss');
        }
      }
    } else {
      if (flags[row][col]) {
        flags[row][col] = false;
        set_cell_label(mat, row, col, '');
      } else {
        flags[row][col] = true;
        set_cell_label(mat, row, col, '🚩');
      }
    }
  }
}

install_buttons(mat, list(
  pair('Reset', reset_game),
  pair('Reveal All', () => {
    for (let i = 0; i < mat_rows; i = i + 1) {
      for (let j = 0; j < mat_cols; j = j + 1) {
        if (board[i][j]) {
          set_cell_label(mat, i, j, '💣');
        }
      }
    }
  })
));
on_cell_click(mat, cell_click_callback);
generate_mines(mine_count);
display_matrix(mat);

