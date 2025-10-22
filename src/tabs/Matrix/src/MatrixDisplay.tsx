import type { Matrix } from '@sourceacademy/bundle-matrix/types';
import range from 'lodash/range';
import IndexLabel from './IndexLabel';
import MatrixButton from './MatrixButton';

interface MatrixDisplayProps {
  hoverCoords: [r: number | false, c: number | false] | false;
  onHoverChange: (coords: [r: number | false, c: number | false] | false) => void;
  rerenderCallback: () => void;
  matrix: Matrix;
  showCellLabels?: boolean;
  showColLabels?: boolean;
};

export default function MatrixDisplay({
  hoverCoords, matrix, showColLabels, onHoverChange, rerenderCallback, showCellLabels,
}: MatrixDisplayProps) {
  return (
    <table cellSpacing="0px">
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
                  onMouseEnter={() => onHoverChange([false, i])}
                  onMouseLeave={() => onHoverChange(false)}
                  onClick={() => {
                    let value = false;
                    for (let j = 0; j < matrix.rows; j++) {
                      if (!matrix.values[j][i]) {
                        value = true;
                        break;
                      }
                    }
                    for (let j = 0; j < matrix.rows; j++) {
                      matrix.values[j][i] = value;
                    }
                    if (matrix.onColClick) matrix.onColClick(i, value);
                    rerenderCallback();
                  } } />
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
                    onMouseEnter={() => onHoverChange([rowIndex, false])}
                    onMouseLeave={() => onHoverChange(false)}
                    onClick={() => {
                      const value = !row.find((x) => x);
                      for (let i = 0; i < matrix.cols; i++) {
                        row[i] = value;
                      }
                      if (matrix.onRowClick) matrix.onRowClick(rowIndex, value);
                      rerenderCallback();
                    }}
                  />
                </div>
              </td>}
            {row.map((entry, colIndex) => {
              let hover: boolean;

              if (hoverCoords === false) hover = false;
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
                  showLabel={showCellLabels}
                  onMouseEnter={() => onHoverChange([rowIndex, colIndex])}
                  onMouseLeave={() => onHoverChange(false)}
                  onClick={() => {
                    row[colIndex] = !entry;
                    matrix.onCellClick?.(rowIndex, colIndex, !entry);
                    rerenderCallback();
                  } } />
              </td>);
            })}
          </tr>))}
      </tbody>
    </table>);
}
