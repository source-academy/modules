import { Tooltip } from "@blueprintjs/core";
import ControlButton from "../ControlButton";
import { IconNames } from "@blueprintjs/icons";

type Props = {
  onClick: () => void
}

export const ControlBarRefreshButton = (props: Props) => <Tooltip content="Manually refresh the side content">
	<ControlButton
		onClick={props.onClick}
		icon={IconNames.Refresh}
		label="Refresh"
	/>
</Tooltip>;
