/* [Imports] */
import { Button, Icon } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import React from 'react';
import { type PlayButtonProps } from './types';
import { IconNames } from '@blueprintjs/icons';



/* [Main] */
export default class PlayButton extends React.Component<PlayButtonProps> {
  render() {
    return <Tooltip2
      content={ this.props.isPlaying ? 'Pause' : 'Play' }
      placement="top"
    >
      <Button onClick={ this.props.onClickCallback }>
        <Icon
          icon={ this.props.isPlaying ? IconNames.PAUSE : IconNames.PLAY }
        />
      </Button>
    </Tooltip2>;
  }
}
