/* [Imports] */
import { Icon, type ButtonProps, Tooltip } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import ButtonComponent from './ButtonComponent';

/* [Exports] */
export type PlayButtonProps = ButtonProps & {
  isPlaying: boolean,
  // onClickCallback: () => void,
};

/* [Main] */
export default function PlayButton(props: PlayButtonProps) {
  return <Tooltip
    content={props.isPlaying ? 'Pause' : 'Play'}
    placement="top"
  >
    <ButtonComponent {...props} >
      <Icon
        icon={props.isPlaying ? IconNames.PAUSE : IconNames.PLAY}
      />
    </ButtonComponent>
  </Tooltip>;
}
