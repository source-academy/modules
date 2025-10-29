import { Button } from '@blueprintjs/core';

interface IndexLabelProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  /**
   * The column or row index
   */
  index: number;
  /**
   * Title attribute to apply to the underlying button. Only needed for testing
   */
  title?: string;
};

/**
 * React component for rendering the row and column "headers"
 */
export default function IndexLabel({ index, onMouseEnter, onMouseLeave, onClick, title }: IndexLabelProps) {
  return <Button
    title={title}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    style={{
      width: '5px',
      height: '5px',
      textWrap: 'nowrap'
    }}
  >
    {index}
  </Button>;
}
