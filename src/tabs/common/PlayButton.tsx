/* [Imports] */
import { Icon, type ButtonProps, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { IconNames } from '@blueprintjs/icons';
import ButtonComponent from './ButtonComponent';

/* [Exports] */
export type PlayButtonProps = {
  isPlaying: boolean,
  // onClickCallback: () => void,
} & ButtonProps;

/* [Main] */
export default class PlayButton extends React.Component<PlayButtonProps> {
  render() {
    return <Tooltip
      content={ this.props.isPlaying ? 'Pause' : 'Play' }
      placement="top"
    >
      <ButtonComponent {...this.props} >
        <Icon
          icon={ this.props.isPlaying ? IconNames.PAUSE : IconNames.PLAY }
        />
      </ButtonComponent>
    </Tooltip>;
  }
}
