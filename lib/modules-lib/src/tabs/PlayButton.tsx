/* [Imports] */
import { Icon, Tooltip, type IconProps } from '@blueprintjs/core';
import ButtonComponent, { type ButtonComponentProps } from './ButtonComponent';

/* [Exports] */
export type PlayButtonProps = ButtonComponentProps & {
  isPlaying: boolean;

  /**
   * Tooltip string for the button when `isPlaying` is true. Defaults to `Pause`.
   */
  playingText?: string;

  /**
   * Tooltip string for the button when `isPlaying` is false. Defaults to `Play`.
   */
  pausedText?: string;

  /**
   * Icon for the button when `isPlaying` is true. Defaults to `pause`.
   */
  playingIcon?: IconProps['icon'];

  /**
   * Icon for the button when `isPlaying` is false. Defaults to `play`.
   */
  pausedIcon?: IconProps['icon'];
};

/* [Main] */
export default function PlayButton({
  playingText = 'Pause',
  playingIcon = 'pause',
  pausedText = 'Play',
  pausedIcon = 'play',
  ...props
}: PlayButtonProps) {
  return <Tooltip
    content={props.isPlaying ? playingText : pausedText}
    placement="top"
  >
    <ButtonComponent {...props} >
      <Icon
        icon={props.isPlaying ? playingIcon : pausedIcon}
      />
    </ButtonComponent>
  </Tooltip>;
}
