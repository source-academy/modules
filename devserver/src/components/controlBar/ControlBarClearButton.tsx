import ControlButton from '../ControlButton';

type Props = {
  onClick: () => void;
};

export const ControlBarClearButton = (props: Props) => <ControlButton
  tooltip='Clear the editor and context'
  label="Clear"
  icon='trash'
  onClick={props.onClick}
/>;
