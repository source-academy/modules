import { Button } from '@blueprintjs/core';

const color_on = '#cccccc';
const color_on_hover = '#DDDDDD';
const color_off = '#333333';
const color_off_hover = '#444444';

type ButtonProps = {
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  state: boolean;
  hover?: boolean;
  label: string,
  showLabel?: boolean;
};
const MatrixButton = ({
  onClick,
  state,
  label,
  hover,
  showLabel,
  onMouseEnter,
  onMouseLeave,
}: ButtonProps) => {
  const backgroundColor = state ? (hover ? color_on_hover : color_on) : (hover ? color_off_hover : color_off);

  return <Button
    style={{
      backgroundColor,
      margin: '2px, 2px, 2px, 2px',
    }}
    onClick={() => {
      if (onClick) onClick();
    }}
    onMouseEnter={() => {
      if (onMouseEnter) onMouseEnter();
    }}
    onMouseLeave={() => {
      if (onMouseLeave) onMouseLeave();
    }}
  >
    {showLabel && <p>{label}</p>}
  </Button>;
};

export default MatrixButton;
