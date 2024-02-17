import { Tooltip } from "@blueprintjs/core";
import ControlButton from "../ControlButton";
import { IconNames } from "@blueprintjs/icons";

type Props = {
  onClick: () => void
}

export const ControlBarClearButton = (props: Props) => <Tooltip content="Clear the editor and context">
	<ControlButton
		label="Clear"
		icon={IconNames.Trash}
		onClick={props.onClick}
	/>
</Tooltip>;
