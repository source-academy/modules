import { Tooltip } from '@blueprintjs/core';
import ControlButton from '../ControlButton';

type Props = {
  onClick: () => void;
};

export const ControlBarRefreshButton = (props: Props) => <Tooltip content="Manually refresh the side content">
  <ControlButton
    onClick={props.onClick}
    icon='refresh'
    label="Refresh"
  />
</Tooltip>;
