/* eslint-disable max-classes-per-file */
/* eslint-disable react/destructuring-assignment */
import { Slider, Button, Icon, Switch } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Tooltip2 } from '@blueprintjs/popover2';
import React from 'react';
import { CurveDrawn } from '../../bundles/curve/curves_webgl';
import { glAnimation } from '../../typings/anim_types';

type State = {
  /**
   * Slider component reflects this value. This value is also passed in as
   * argument to render curves.
   */
  rotationAngle: number;

  /**
   * Set to true by default. Slider updates this value to false when interacted
   * with. Recursive `autoRotate()` checks for this value to decide whether to
   * stop recursion. Button checks for this value to decide whether clicking the
   * button takes effect, for countering spam-clicking.
   */
  isRotating: boolean;
};

type Props = {
  curve: CurveDrawn;
};

/**
 * 3D Version of the CurveCanvas to include the rotation angle slider
 * and play button
 */
export default class CurveCanvas3D extends React.Component<Props, State> {
  private $canvas: HTMLCanvasElement | null;

  constructor(props) {
    super(props);

    this.$canvas = null;
    this.state = {
      rotationAngle: 0,
      isRotating: false,
    };
  }

  public componentDidMount() {
    if (this.$canvas) {
      this.props.curve.init(this.$canvas);
      this.props.curve.redraw((this.state.rotationAngle / 180) * Math.PI);
    }
  }

  /**
   * Event handler for slider component. Updates the canvas for any change in
   * rotation.
   *
   * @param newValue new rotation angle
   */
  private onSliderChangeHandler = (newValue: number) => {
    this.setState(
      (prevState) => ({
        ...prevState,
        rotationAngle: newValue,
        isRotating: false,
      }),
      () => {
        if (this.$canvas) {
          this.props.curve.redraw((newValue / 180) * Math.PI);
        }
      }
    );
  };

  /**
   * Event handler for play button. Starts automated rotation by calling
   * `autoRotate()`.
   */
  private onClickHandler = () => {
    if (!this.$canvas) return;

    this.setState(
      (prevState) => ({
        isRotating: !prevState.isRotating,
      }),
      () => {
        if (this.state.isRotating) {
          this.autoRotate();
        }
      }
    );
  };

  /**
   * Environment where `requestAnimationFrame` is called.
   */
  private autoRotate = () => {
    if (this.$canvas && this.state.isRotating) {
      this.setState(
        (prevState) => ({
          ...prevState,
          rotationAngle:
            prevState.rotationAngle >= 360 ? 0 : prevState.rotationAngle + 2,
        }),
        () => {
          this.props.curve.redraw((this.state.rotationAngle / 180) * Math.PI);
          window.requestAnimationFrame(this.autoRotate);
        }
      );
    }
  };

  private onTextBoxChange = (event) => {
    const angle = parseFloat(event.target.value);
    this.setState(
      () => ({ rotationAngle: angle }),
      () => {
        if (this.$canvas) {
          this.props.curve.redraw((angle / 180) * Math.PI);
        }
      }
    );
  };

  public render() {
    return (
      <div>
        <canvas
          ref={(r) => {
            this.$canvas = r;
          }}
          height={500}
          width={500}
        />
        <div
          style={{
            display: 'flex',
            padding: '10px',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Slider
            value={this.state.rotationAngle}
            stepSize={1}
            labelValues={[0, 360]}
            labelRenderer={false}
            min={0}
            max={360}
            onChange={this.onSliderChangeHandler}
          />
          <Button
            style={{
              marginLeft: '20px',
            }}
            onClick={this.onClickHandler}
          >
            <Icon
              icon={this.state.isRotating ? IconNames.PAUSE : IconNames.PLAY}
            />
          </Button>
          <input
            style={{
              marginLeft: '20px',
            }}
            type='number'
            min={0}
            max={360}
            step={1}
            disabled={this.state.isRotating}
            onChange={this.onTextBoxChange}
            value={this.state.rotationAngle}
          />
        </div>
      </div>
    );
  }
}

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

  /** Boolean value indicating if auto play is selected */
  autoPlay: boolean;
};

/**
 * Canvas to display glAnimations
 */
// For some reason, I can't get this component to build
// with the blueprint/js components if it's located in
// another file so it's here for now
export class AnimationCanvas extends React.Component<
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
      autoPlay: true,
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
        this.state.animTimestamp / 1000
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

    if (this.callbackTimestamp == null) {
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
          this.reqFrame
        );
      } else {
        // Otherwise, stop the animation
        this.setState(
          {
            isPlaying: false,
          },
          () => {
            this.callbackTimestamp = null;
          }
        );
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
        }
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
        }
      );
    } else {
      this.setState(
        {
          isPlaying: true,
        },
        this.reqFrame
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
      }
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
      this.drawFrame
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
      }
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
    return (
      <>
        <div
          style={{
            alignItems: 'center',
          }}
        >
          <canvas
            style={{
              width: '80%',
            }}
            ref={(r) => {
              this.canvas = r;
            }}
            height={512}
            width={512}
          />
        </div>
        <div
          style={{
            display: 'flex',
            padding: '10px',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'right',
          }}
        >
          <div
            style={{
              float: 'left',
              marginLeft: '20px',
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
          <div
            style={{
              float: 'left',
              marginLeft: '20px',
            }}
          >
            <Tooltip2 content='Reset'>
              <Button onClick={this.onResetButtonClick}>
                <Icon icon={IconNames.RESET} />
              </Button>
            </Tooltip2>
          </div>
          <div
            style={{
              marginLeft: '20px',
              marginRight: '20px',
            }}
          >
            <Slider
              value={this.state.animTimestamp}
              onChange={this.onSliderChange}
              onRelease={this.onSliderRelease}
              stepSize={1}
              labelRenderer={false}
              min={0}
              max={this.animationDuration}
            />
          </div>
          <div
            style={{
              float: 'right',
              marginRight: '20px',
            }}
          >
            <Switch
              label='Auto Play'
              onChange={this.autoPlaySwitchChanged}
              checked={this.state.autoPlay}
            />
          </div>
        </div>
      </>
    );
  }
}
