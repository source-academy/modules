/* [Imports] */
import { Icon, Tooltip } from '@blueprintjs/core';
import { Pause, Play } from '@blueprintjs/icons';
import ButtonComponent, { type ButtonComponentProps } from './ButtonComponent';

/* [Exports] */
export type PlayButtonProps = ButtonComponentProps & {
  isPlaying: boolean;
};

/* [Main] */
export default function PlayButton(props: PlayButtonProps) {
  return <Tooltip
    content={props.isPlaying ? 'Pause' : 'Play'}
    placement="top"
  >
    <ButtonComponent {...props} >
      <Icon
        icon={props.isPlaying ? <Pause /> : <Play />}
      />
    </ButtonComponent>
  </Tooltip>;
}
