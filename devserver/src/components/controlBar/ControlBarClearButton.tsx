import { Tooltip2 } from "@blueprintjs/popover2";
import ControlButton from "../ControlButton";
import { IconNames } from "@blueprintjs/icons";

type Props = {
  onClick: () => void
}

export const ControlBarClearButton = (props: Props) => <Tooltip2 content="Clear the editor and context">
	<ControlButton
		label="Clear"
		icon={IconNames.Trash}
		onClick={props.onClick}
	/>
</Tooltip2>;
