import { Button, Icon, Slider, Switch } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Tooltip2 } from '@blueprintjs/popover2';
import React from 'react';
import { type AnimatedCurve } from '../../bundles/curve/types';
import WebGLCanvas from '../common/webgl_canvas';

type Props = {
  animation: AnimatedCurve;
};

type State = {
  /** Timestamp of the animation */
  animTimestamp: number;

  /** Boolean value indicating if the animation is playing */
  isPlaying: boolean;

  /** Previous value of `isPlaying` */
  wasPlaying: boolean;

  /** Boolean value indicating if auto play is selected */
  autoPlay: boolean;

  /** Curve Angle */
  curveAngle: number;
};

export default class Curve3DAnimationCanvas extends React.Component<
Props,
State
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

  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      animTimestamp: 0,
      isPlaying: false,
      wasPlaying: false,
      autoPlay: true,
      curveAngle: 0,
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
      if (this.state.autoPlay) {
        // If autoplay is active, reset the animation
        this.setState(
          {
            animTimestamp: 0,
          },
          this.reqFrame,
        );
      } else {
        // Otherwise, stop the animation
        this.setState(
          {
            isPlaying: false,
          },
          () => {
            this.callbackTimestamp = null;
          },
        );
      }
    } else {
      // Animation hasn't ended, so just draw the next frame
      this.drawFrame();
      this.setState(
        (prev) => ({
          animTimestamp: prev.animTimestamp + currentFrame,
        }),
        this.reqFrame,
      );
    }
  };

  /**
   * Play button click handler
   */
  private onPlayButtonClick = () => {
    if (this.state.isPlaying) {
      this.setState(
        {
          isPlaying: false,
        },
        () => {
          this.callbackTimestamp = null;
        },
      );
    } else {
      this.setState(
        {
          isPlaying: true,
        },
        this.reqFrame,
      );
    }
  };

  /**
   * Reset button click handler
   */
  private onResetButtonClick = () => {
    this.setState(
      {
        animTimestamp: 0,
      },
      () => {
        if (this.state.isPlaying) this.reqFrame();
        else this.drawFrame();
      },
    );
  };

  /**
   * Slider value change handler
   * @param newValue New value of the slider
   */
  private onTimeSliderChange = (newValue: number) => {
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
  private onTimeSliderRelease = () => {
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

  private onAngleSliderChange = (newAngle: number) => {
    this.setState(
      {
        curveAngle: newAngle,
      },
      () => {
        this.props.animation.angle = newAngle;
        if (this.state.isPlaying) this.reqFrame();
        else this.drawFrame();
      },
    );
  };

  /**
   * Auto play switch handler
   */
  private autoPlaySwitchChanged = () => {
    this.setState((prev) => ({
      autoPlay: !prev.autoPlay,
    }));
  };

  public render() {
    const buttons = (
      <div
        style={{
          marginLeft: '20px',
          marginRight: '20px',
          marginTop: '5px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            marginRight: '20px',
          }}
        >
          <Tooltip2 content={this.state.isPlaying ? 'Pause' : 'Play'}>
            <Button onClick={this.onPlayButtonClick}>
              <Icon
                icon={this.state.isPlaying ? IconNames.PAUSE : IconNames.PLAY}
              />
            </Button>
          </Tooltip2>
        </div>
        <Tooltip2 content="Reset">
          <Button onClick={this.onResetButtonClick}>
            <Icon icon={IconNames.RESET} />
          </Button>
        </Tooltip2>
      </div>
    );

    const sliders = (
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'stretch',
        }}
      >
        <Slider
          value={this.state.animTimestamp}
          onChange={this.onTimeSliderChange}
          onRelease={this.onTimeSliderRelease}
          stepSize={1}
          labelRenderer={false}
          min={0}
          max={this.animationDuration}
        />
        <Tooltip2 content="Display Angle">
          <div
            style={{
              marginTop: '5px',
            }}
          >
            <Slider
              value={this.state.curveAngle}
              onChange={this.onAngleSliderChange}
              stepSize={0.01}
              min={0}
              max={2 * Math.PI}
              labelRenderer={false}
            />
          </div>
        </Tooltip2>
      </div>
    );

    return (
      <>
        <div
          style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <WebGLCanvas
            style={{
              flexGrow: 1,
            }}
            ref={(r) => {
              this.canvas = r;
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '10px',
            padding: '10px',
            flexDirection: 'row',
            justifyContent: 'stretch',
            alignContent: 'center',
          }}
        >
          {buttons}
          {sliders}
          <Switch
            style={{
              marginLeft: '20px',
              marginRight: '20px',
              marginTop: '10px',
              whiteSpace: 'nowrap',
            }}
            label="Auto Play"
            onChange={this.autoPlaySwitchChanged}
            checked={this.state.autoPlay}
          />
        </div>
      </>
    );
  }
}
