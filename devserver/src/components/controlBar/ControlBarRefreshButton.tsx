import { Tooltip2 } from "@blueprintjs/popover2";
import ControlButton from "../ControlButton";
import { IconNames } from "@blueprintjs/icons";

type Props = {
  onClick: () => void
}

export const ControlBarRefreshButton = (props: Props) => <Tooltip2 content="Manually refresh the side content">
	<ControlButton
		onClick={props.onClick}
		icon={IconNames.Refresh}
		label="Refresh"
	/>
</Tooltip2>;
