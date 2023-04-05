type IndexLabelProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  index: number
};
const IndexLabel = ({ index, onMouseEnter, onMouseLeave, onClick }: IndexLabelProps) => <rect
  onMouseEnter={() => onMouseEnter()}
  onMouseLeave={() => onMouseLeave()}
  onClick={() => onClick()}
>
  <p>{index}</p>
</rect>;

export default IndexLabel;
