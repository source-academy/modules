import { Tooltip } from '@blueprintjs/core';
import { Trash } from '@blueprintjs/icons';
import ControlButton from '../ControlButton';

type Props = {
  onClick: () => void;
};

export const ControlBarClearButton = (props: Props) => <Tooltip content="Clear the editor and context">
  <ControlButton
    label="Clear"
    icon={<Trash />}
    onClick={props.onClick}
  />
</Tooltip>;
