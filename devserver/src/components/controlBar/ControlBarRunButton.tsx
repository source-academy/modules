import { Position } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Tooltip2 } from "@blueprintjs/popover2";
import React from "react";

import ControlButton from "../ControlButton";

type DispatchProps = {
  handleEditorEval: () => void;
};

type StateProps = {
  key: string;
  color?: string;
  className?: string;
};

type ControlButtonRunButtonProps = DispatchProps & StateProps;

export const ControlBarRunButton: React.FC<ControlButtonRunButtonProps> = (props) => {
	const tooltipContent = "Evaluate the program";
	return (
		<Tooltip2 content={tooltipContent} placement={Position.TOP}>
			<ControlButton
				label="Run"
				icon={IconNames.PLAY}
				onClick={props.handleEditorEval}
				options={{
					iconColor: props.color,
					className: props.className
				}}
			/>
		</Tooltip2>
	);
};
