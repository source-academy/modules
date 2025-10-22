interface IndexLabelProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  index: number;
};

export default function IndexLabel({ index, onMouseEnter, onMouseLeave, onClick }: IndexLabelProps) {
  return <rect
    onMouseEnter={() => onMouseEnter()}
    onMouseLeave={() => onMouseLeave()}
    onClick={() => onClick()}
  >
    <p>{index}</p>
  </rect>;
}
