import { Button, Icon, Slider } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Tooltip2 } from '@blueprintjs/popover2';
import React from 'react';
import { type glAnimation } from '../../typings/anim_types';
import AutoLoopSwitch from './auto_loop_switch';
import { BP_TAB_BUTTON_MARGIN, BP_TEXT_MARGIN, CANVAS_MAX_WIDTH } from './css_constants';
import PlayButton from './play_button';
import WebGLCanvas from './web_gl_canvas';

type AnimCanvasProps = {
  animation: glAnimation;
};

type AnimCanvasState = {
  /** Timestamp of the animation */
  animTimestamp: number;

  /** Boolean value indicating if the animation is playing */
  isPlaying: boolean;

  /** Previous value of `isPlaying` */
  wasPlaying: boolean;

  /** Whether auto loop is enabled */
  isAutoLooping: boolean;
};

/**
 * Canvas to display glAnimations.
 *
 * Uses WebGLCanvas internally.
 */
export default class AnimationCanvas extends React.Component<
AnimCanvasProps,
AnimCanvasState
> {
  private canvas: HTMLCanvasElement | null;

  /**
   * The duration of one frame in milliseconds
   */
  private readonly frameDuration: number;

  /**
   * The duration of the entire animation
   */
  private readonly animationDuration: number;

  /**
   * Last timestamp since the previous `requestAnimationFrame` call
   */
  private callbackTimestamp: number | null;

  constructor(props: AnimCanvasProps | Readonly<AnimCanvasProps>) {
    super(props);

    this.state = {
      animTimestamp: 0,
      isPlaying: false,
      wasPlaying: false,
      isAutoLooping: true,
    };

    this.canvas = null;
    this.frameDuration = 1000 / props.animation.fps;
    this.animationDuration = Math.round(props.animation.duration * 1000);
    this.callbackTimestamp = null;
  }

  public componentDidMount() {
    this.drawFrame();
  }

  /**
   * Call this to actually draw a frame onto the canvas
   */
  private drawFrame = () => {
    if (this.canvas) {
      const frame = this.props.animation.getFrame(
        this.state.animTimestamp / 1000,
      );
      frame.draw(this.canvas);
    }
  };

  private reqFrame = () => requestAnimationFrame(this.animationCallback);

  private startAnimation = () => this.setState(
    {
      isPlaying: true,
    },
    this.reqFrame,
  );

  private stopAnimation = () => this.setState(
    {
      isPlaying: false,
    },
    () => {
      this.callbackTimestamp = null;
    },
  );

  /**
   * Callback to use with `requestAnimationFrame`
   */
  private animationCallback = (timeInMs: number) => {
    if (!this.canvas || !this.state.isPlaying) return;

    if (!this.callbackTimestamp) {
      this.callbackTimestamp = timeInMs;
      this.drawFrame();
      this.reqFrame();
      return;
    }

    const currentFrame = timeInMs - this.callbackTimestamp;

    if (currentFrame < this.frameDuration) {
      // Not time to draw a new frame yet
      this.reqFrame();
      return;
    }

    this.callbackTimestamp = timeInMs;
    if (this.state.animTimestamp >= this.animationDuration) {
      // Animation has ended
      if (this.state.isAutoLooping) {
        // If auto loop is active, restart the animation
        this.setState(
          {
            animTimestamp: 0,
          },
          this.reqFrame,
        );
      } else {
        // Otherwise, stop the animation
        this.stopAnimation();
      }
    } else {
      // Animation hasn't ended, so just draw the next frame
      this.setState(
        (prev) => ({
          animTimestamp: prev.animTimestamp + currentFrame,
        }),
        () => {
          this.drawFrame();
          this.reqFrame();
        },
      );
    }
  };

  /**
   * Play button click handler
   */
  private onPlayButtonClick = () => {
    if (this.state.isPlaying) this.stopAnimation();
    else this.startAnimation();
  };

  /**
   * Reset button click handler
   */
  private onResetButtonClick = () => {
    this.setState(
      { animTimestamp: 0 },
      () => {
        if (this.state.isPlaying) {
          // Force stop
          this.onPlayButtonClick();
        }

        this.drawFrame();
      },
    );
  };

  /**
   * Slider value change handler
   * @param newValue New value of the slider
   */
  private onSliderChange = (newValue: number) => {
    this.callbackTimestamp = null;
    this.setState(
      (prev) => ({
        wasPlaying: prev.isPlaying,
        isPlaying: false,
        animTimestamp: newValue,
      }),
      this.drawFrame,
    );
  };

  /**
   * Handler triggered when the slider is clicked off
   */
  private onSliderRelease = () => {
    this.setState(
      (prev) => ({
        isPlaying: prev.wasPlaying,
      }),
      () => {
        if (!this.state.isPlaying) {
          this.callbackTimestamp = null;
        } else {
          this.reqFrame();
        }
      },
    );
  };

  /**
   * Auto loop switch onChange callback
   */
  private onSwitchChange = () => {
    this.setState((prev) => ({
      isAutoLooping: !prev.isAutoLooping,
    }));
  };

  public render() {
    return <div
      style={{
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: BP_TAB_BUTTON_MARGIN,

            width: '100%',
            maxWidth: CANVAS_MAX_WIDTH,

            paddingTop: BP_TEXT_MARGIN,
            paddingBottom: BP_TEXT_MARGIN,
          }}
        >
          <PlayButton
            isPlaying={ this.state.isPlaying }
            onClickCallback={ this.onPlayButtonClick }
          />
          <Tooltip2
            content="Reset"
            placement="top"
          >
            <Button onClick={ this.onResetButtonClick }>
              <Icon icon={ IconNames.RESET } />
            </Button>
          </Tooltip2>
          <Slider
            value={ this.state.animTimestamp }
            min={ 0 }
            max={ this.animationDuration }
            stepSize={ 1 }

            labelRenderer={ false }

            onChange={ this.onSliderChange }
            onRelease={ this.onSliderRelease }
          />
          <AutoLoopSwitch
            isAutoLooping={ this.state.isAutoLooping }
            onChangeCallback={ this.onSwitchChange }
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <WebGLCanvas
          ref={(r) => {
            this.canvas = r;
          }}
        />
      </div>
    </div>;
  }
}
