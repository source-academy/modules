import type { FC } from 'react';

import ControlButton from '../ControlButton';

type DispatchProps = {
  handleEditorEval: () => void;
};

type StateProps = {
  key: string;
  color?: string;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
};

type ControlButtonRunButtonProps = DispatchProps & StateProps;

export const ControlBarRunButton: FC<ControlButtonRunButtonProps> = (props) => {
  return (
    <ControlButton
      label="Run"
      icon='play'
      onClick={props.handleEditorEval}
      options={{
        iconColor: props.color,
        className: props.className,
      }}
      isDisabled={props.disabled}
      tooltip={props.tooltip ?? 'Evaluate the program'}
    />
  );
};
