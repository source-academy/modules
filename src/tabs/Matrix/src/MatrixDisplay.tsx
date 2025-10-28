import { getDefaultCellCallback, getDefaultColCallback, getDefaultRowCallback } from '@sourceacademy/bundle-matrix/callbacks';
import type { Matrix } from '@sourceacademy/bundle-matrix/types';
import range from 'lodash/range';
import IndexLabel from './IndexLabel';
import MatrixButton from './MatrixButton';

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
  showCellLabels?: boolean;
  showColLabels?: boolean;
};

/**
 * React component for displaying a single {@link Matrix}, excluding its installed buttons.
 */
export default function MatrixDisplay({
  hoverCoords, matrix, showColLabels, onHoverChange, rerenderCallback, showCellLabels,
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
                  colClickCallback(i, value);
                  rerenderCallback();
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
          {showColLabels
            && <td>
              <div style={{
                paddingRight: '2px',
              }}>
                <IndexLabel
                  index={rowIndex}
                  onMouseEnter={() => onHoverChange?.([rowIndex, false])}
                  onMouseLeave={() => onHoverChange?.(false)}
                  onClick={() => {
                    const value = !row.some(x => !x);
                    rowClickCallback(rowIndex, value);
                    rerenderCallback();
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
                showLabel={showCellLabels}
                onMouseEnter={() => onHoverChange?.([rowIndex, colIndex])}
                onMouseLeave={() => onHoverChange?.(false)}
                onClick={() => {
                  cellClickCallback(rowIndex, colIndex, entry);
                  rerenderCallback();
                }}
              />
            </td>);
          })}
        </tr>))}
    </tbody>
  </table>;
}
