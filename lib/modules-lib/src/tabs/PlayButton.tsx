import { Icon, Tooltip, type IconProps, type TooltipProps } from '@blueprintjs/core';
import ButtonComponent, { type ButtonComponentProps } from './ButtonComponent';

export type PlayButtonProps = Omit<ButtonComponentProps, 'text' | 'icon'> & {
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

  /**
   * Props to be passed to the Tooltip component
   */
  tooltipProps?: Omit<TooltipProps, 'content'>;
};

/**
 * A {@link ButtonComponent|Button} that toggles between two states: playing and not playing.
 *
 * @category Components
 */
export default function PlayButton({
  playingText = 'Pause',
  playingIcon = 'pause',
  pausedText = 'Play',
  pausedIcon = 'play',
  isPlaying,
  tooltipProps,
  ...props
}: PlayButtonProps) {
  return <Tooltip
    content={isPlaying ? playingText : pausedText}
    {...tooltipProps}
  >
    <ButtonComponent {...props} >
      <Icon icon={isPlaying ? playingIcon : pausedIcon} />
    </ButtonComponent>
  </Tooltip>;
}
