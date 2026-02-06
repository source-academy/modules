import type { Matrix } from '@sourceacademy/bundle-matrix/types';
import range from 'lodash/range';
import IndexLabel from './IndexLabel';
import MatrixButton from './MatrixButton';
import { getDefaultCellCallback, getDefaultColCallback, getDefaultRowCallback } from './callbacks';

type ErrorLocations = 'cell' | 'col' | 'row';

interface MatrixDisplayProps {
  /**
   * Coordinates of which column, row or cell is being hovered over, or `false`
   * if none
   */
  hoverCoords?: [r: number | false, c: number | false] | false;
  /**
   * Callback that is called whenever hover state is changed.
   */
  onHoverChange?: (coords: [r: number | false, c: number | false] | false) => void;
  rerenderCallback: () => void;
  matrix: Matrix;
  showColLabels?: boolean;

  /**
   * Callback that is called when a user provided function throws an error
   */
  onError?: (loc: ErrorLocations, error: unknown) => void;
};

/**
 * React component for displaying a single {@link Matrix}, excluding its installed buttons.
 */
export default function MatrixDisplay({
  hoverCoords, matrix, showColLabels, onHoverChange, rerenderCallback, onError
}: MatrixDisplayProps) {
  const rowClickCallback = matrix.onRowClick ?? getDefaultRowCallback(matrix);
  const colClickCallback = matrix.onColClick ?? getDefaultColCallback(matrix);
  const cellClickCallback = matrix.onCellClick ?? getDefaultCellCallback(matrix);

  return <table cellSpacing="0px">
    <tbody>
      {showColLabels && <tr
        style={{
          textAlign: 'center',
          verticalAlign: 'middle',
        }}>
        <td />
        {range(0, matrix.cols)
          .map((_, i) => (
            <td>
              <IndexLabel
                key={i}
                index={i}
                title={`col_${i}_label`}
                onMouseEnter={() => onHoverChange?.([false, i])}
                onMouseLeave={() => onHoverChange?.(false)}
                onClick={() => {
                  let value = true;
                  for (let j = 0; j < matrix.rows; j++) {
                    if (!matrix.values[j][i]) {
                      value = false;
                      break;
                    }
                  }
                  try {
                    colClickCallback(i, value);
                    rerenderCallback();
                  } catch (e) {
                    onError?.('col', e);
                  }
                }}
              />
            </td>
          ))}
      </tr>}
      {matrix.values.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          style={{
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          {showColLabels && <td>
            <div style={{
              paddingRight: '2px',
            }}>
              <IndexLabel
                index={rowIndex}
                onMouseEnter={() => onHoverChange?.([rowIndex, false])}
                onMouseLeave={() => onHoverChange?.(false)}
                onClick={() => {
                  const value = !row.some(x => !x);
                  try {
                    rowClickCallback(rowIndex, value);
                    rerenderCallback();
                  } catch (e) {
                    onError?.('row', e);
                  }
                }}
                title={`row_${rowIndex}_label`}
              />
            </div>
          </td>}
          {row.map((entry, colIndex) => {
            let hover: boolean;

            if (!hoverCoords) hover = false;
            else {
              const [hoverRow, hoverCol] = hoverCoords;
              if (hoverRow === false) hover = colIndex === hoverCol;
              else if (hoverCol === false) hover = rowIndex === hoverRow;
              else hover = colIndex === hoverCol && rowIndex === hoverRow;
            }

            return (<td>
              <MatrixButton
                hover={hover}
                state={entry}
                label={matrix.labels[rowIndex][colIndex]}
                title={`cell_${rowIndex}_${colIndex}_button`}
                onMouseEnter={() => onHoverChange?.([rowIndex, colIndex])}
                onMouseLeave={() => onHoverChange?.(false)}
                onClick={click => {
                  try {
                    cellClickCallback(rowIndex, colIndex, entry, click);
                    rerenderCallback();
                  } catch (e) {
                    onError?.('cell', e);
                  }
                }}
              />
            </td>);
          })}
        </tr>))}
    </tbody>
  </table>;
}
