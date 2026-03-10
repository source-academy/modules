import { Position, Tooltip } from '@blueprintjs/core';
import type { FC } from 'react';

import ControlButton from '../ControlButton';

type DispatchProps = {
  handleEditorEval: () => void;
};

type StateProps = {
  key: string;
  color?: string;
  className?: string;
};

type ControlButtonRunButtonProps = DispatchProps & StateProps;

export const ControlBarRunButton: FC<ControlButtonRunButtonProps> = (props) => {
  const tooltipContent = 'Evaluate the program';
  return (
    <Tooltip content={tooltipContent} placement={Position.TOP}>
      <ControlButton
        label="Run"
        icon='play'
        onClick={props.handleEditorEval}
        options={{
          iconColor: props.color,
          className: props.className
        }}
      />
    </Tooltip>
  );
};
