import { Button } from '@blueprintjs/core';

const color_on = '#cccccc';
const color_on_hover = '#DDDDDD';
const color_off = '#333333';
const color_off_hover = '#444444';

interface MatrixButtonProps {
  onClick?: () => void;
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

  label: string;
  showLabel?: boolean;

  /**
   * Title attribute to be applied to the button. Only needed for testing
   */
  title?: string;
};

/**
 * React component representing a single cell in the matrix.
 */
export default function MatrixButton({
  onClick, state, label, hover, showLabel, onMouseEnter, onMouseLeave, title
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
    }}
    title={title}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {showLabel && <>{label}</>}
  </Button>;
}
