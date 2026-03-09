import { Tooltip } from '@blueprintjs/core';
import ControlButton from '../ControlButton';

type Props = {
  onClick: () => void;
};

export const ControlBarClearButton = (props: Props) => <Tooltip content="Clear the editor and context">
  <ControlButton
    label="Clear"
    icon='trash'
    onClick={props.onClick}
  />
</Tooltip>;
