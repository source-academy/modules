/**
 * A version of [Conway's game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).
 *
 * Use the 'save' button to save the current state of the matrix, then use the 'reset' button
 * whenever you want to restore the matrix back to that state.
 * 
 * Clicking the "simulate" button advances the simulation by 1 generation.
 */
import {
  create_matrix,
  display_matrix,
  clear_matrix,
  install_buttons,
  get_cell_values,
  set_cell_values,
  set_cell_value
} from 'matrix';

const mat_rows = 22;
const mat_cols = 35;

const mat = create_matrix(mat_rows, mat_cols, 'Conway\'s Game of Life');
display_matrix(mat);

const neighbours = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1] ,          [0, 1],
  [1, -1] ,  [1, 0], [1, 1]
];

function simulate() {
  const values = get_cell_values(mat);
  
  function count_neighbours(row, col) {
    let total = 0;
    for (let i = 0; i < 8; i = i + 1) {
      const coords = neighbours[i];
      
      const new_row = row + coords[0];
      if (new_row < 0 || new_row >= mat_rows) {
        continue;
      }
      
      const new_col = col + coords[1];
      if (new_col < 0 || new_col >= mat_cols) { 
        continue;
      }
      
      if (values[new_row][new_col]) {
        total = total + 1;
      }
    }
    return total;
  }
  
  for (let row = 0; row < mat_rows; row = row + 1) {
    for (let col = 0; col < mat_cols; col = col + 1) {
      const neighbours = count_neighbours(row, col);
      if (values[row][col]) {
        if (neighbours < 2 || neighbours > 3) {
            // Any live cell with fewer than two live neighbours
            // or more than three live neighbours dies
            set_cell_value(mat, row, col, false);
        }
      } else if (neighbours === 3) {
        // Any dead cell with exactly three live neighbours comes alive
        set_cell_value(mat, row, col, true);
      }
    }
  }
}

let start_values = [];

install_buttons(mat, list(
  pair('Save', () => {
    start_values = get_cell_values(mat);
  }),
  pair('Reset', () => set_cell_values(mat, start_values)),
  pair('Clear', () => clear_matrix(mat)),
  pair('Simulate', simulate)
));
