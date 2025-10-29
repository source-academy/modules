import { Button } from '@blueprintjs/core';

const color_on = '#cccccc';
const color_on_hover = '#DDDDDD';
const color_off = '#333333';
const color_off_hover = '#444444';

interface MatrixButtonProps {
  onClick?: (click: 'left' | 'right') => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;

  /**
   * The current state of the button
   */
  state: boolean;

  /**
   * Whether the button or its row or column is currently being hovered over
   */
  hover?: boolean;

  label?: string;

  /**
   * Title attribute to be applied to the button. Only needed for testing
   */
  title?: string;
};

/**
 * React component representing a single cell in the matrix.
 */
export default function MatrixButton({
  onClick, state, label, hover, onMouseEnter, onMouseLeave, title
}: MatrixButtonProps) {
  const backgroundColor = state
    ? hover
      ? color_on_hover
      : color_on
    : hover
      ? color_off_hover
      : color_off;

  return <Button
    style={{
      backgroundColor,
      margin: '2px, 2px, 2px, 2px',
      color: state ? '#000000' : '#ffffff',
      height: '5px',
      width: '5px'
    }}
    title={title}
    onClick={() => onClick?.('left')}
    onContextMenu={e => {
      onClick?.('right');
      e.preventDefault();
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {label !== undefined && <>{label}</>}
  </Button>;
}
