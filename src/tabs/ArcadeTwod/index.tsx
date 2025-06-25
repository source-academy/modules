import { Button, ButtonGroup } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { defineTab } from '@sourceacademy/modules-lib/tabs';
import Phaser from 'phaser';
import React from 'react';

/**
 * Game display tab for user-created games made with the Arcade2D module.
 *
 * @module arcade_2d
 * @author Titus Chew Xuan Jun
 * @author Xenos Fiorenzo Anong
 */

/**
 * React Component props for the Tab.
 */
type Props = {
  children?: never;
  className?: never;
  context?: any;
};

/**
 * React Component state for the Game.
 */
type GameState = {
  game?: Phaser.Game;
};

/**
 * React component state for the UI buttons.
 */
type UiState = {
  isPaused: boolean;
};

/**
 * React component props for the UI buttons.
 */
type UiProps = {
  children?: never;
  className?: never;
  context?: any;
  onClick: (b: boolean) => void;
};

/**
 * Component for UI buttons within tab e.g play/pause.
 */
class A2dUiButtons extends React.Component<UiProps, UiState> {
  constructor(props) {
    super(props);
    this.state = {
      isPaused: false
    };
  }

  toggleGamePause(): void {
    const currentState = this.state.isPaused;
    this.props.onClick(!currentState);
    this.setState({ isPaused: !currentState });
  }

  public render() {
    return (
      <ButtonGroup>
        <Button
          className="a2d-play-toggle-button"
          icon={this.state.isPaused ? IconNames.PLAY : IconNames.PAUSE}
          active={false}
          onClick={() => this.toggleGamePause()}
          text={this.state.isPaused ? 'Resume Game' : 'Pause Game'}
        />
      </ButtonGroup>
    );
  }
}

/**
 * The main React Component of the Tab.
 */
class GameTab extends React.Component<Props, GameState> {
  constructor(props) {
    super(props);
    this.state = {
      game: undefined
    };
  }

  componentDidMount() {
    // Only mount the component when the Arcade2D tab is active
    if (document.querySelector('[id="bp4-tab-panel_side-content-tabs_Arcade2D Tab"]')?.ariaHidden === 'true') {
      return;
    }

    // Config will exist since it is checked in toSpawn
    const config = this.props.context.result?.value?.gameConfig;
    this.setState({
      game: new Phaser.Game(config)
    });
  }

  shouldComponentUpdate() {
    // Component itself is a wrapper & should not update - Phaser handles the game updates
    return false;
  }

  toggleGamePause(pause: boolean): void {
    if (pause) {
      // Default scene since there is only one scene.
      this.state.game?.scene.pause('default');
      this.state.game?.sound.pauseAll();
    } else {
      this.state.game?.scene.resume('default');
      this.state.game?.sound.resumeAll();
    }
  }

  componentWillUnmount(): void {
    this.state.game?.sound.stopAll();

    // Prevents multiple update loops being run at the same time
    this.state.game?.destroy(false, false);
  }

  public render() {
    return (
      <div
        id="a2d-tab"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <div id="phaser-game" />
        <A2dUiButtons onClick={(p) => this.toggleGamePause(p)} />
      </div>
    );
  }
}

export default defineTab({
  toSpawn(context) {
    const config = context.result?.value?.gameConfig;
    if (config) {
      return true;
    }
    return false;
  },
  body: context => <GameTab context={context} />,
  label: 'Arcade2D Tab',
  iconName: IconNames.SHAPES
});
