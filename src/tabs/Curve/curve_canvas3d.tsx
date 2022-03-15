/* eslint-disable max-classes-per-file */
/* eslint-disable react/destructuring-assignment */
import { Slider, Button, Icon, Switch } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Tooltip2 } from '@blueprintjs/popover2';
import React from 'react';
import { CurveDrawn } from '../../bundles/curve/curves_webgl';
import { glAnimation } from '../../typings/anim_test';

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
  private onChangeHandler = (newValue: number) => {
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
            /*
            if (r) {
              this.props.curve.init(this.$canvas);
              this.props.curve.redraw(this.state.rotationAngle);
            } */
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
            onChange={this.onChangeHandler}
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
  currentFrame: number;
  isPlaying: boolean;
  autoPlay: boolean;
  frameDuration: number;
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

  private step: number;

  private prevTimestamp: number;

  constructor(props: AnimCanvasProps | Readonly<AnimCanvasProps>) {
    super(props);

    this.state = {
      currentFrame: 0,
      isPlaying: false,
      autoPlay: true,
      frameDuration: 10 / 24,
    };

    this.canvas = null;
    this.step = 1 / props.animation.numFrames;
    this.prevTimestamp = 0;
  }

  public componentDidMount() {
    this.drawFrame();
  }

  /**
   * Call this to actually draw a frame onto the canvas
   */
  private drawFrame = () => {
    if (this.canvas) {
      const frame = this.props.animation.getFrame(this.state.currentFrame);
      frame.draw(this.canvas);
    }
  };

  /**
   * Callback to use with `requestAnimationFrame`
   */
  private animationCallback = (timestamp) => {
    if (this.canvas && this.state.isPlaying) {
      if (timestamp - this.prevTimestamp < this.state.frameDuration) {
        // Not time to draw the frame yet
        requestAnimationFrame(this.animationCallback);
        return;
      }

      this.drawFrame();
      this.prevTimestamp = timestamp;

      if (this.state.currentFrame >= 1) {
        // CurrentFrame exceeded
        if (this.state.autoPlay) {
          // Autoplay is on
          this.setState(
            () => ({
              currentFrame: 0,
            }),
            () => setTimeout(this.animationCallback, this.state.frameDuration)
          );
        } else {
          // Autoplay isn't on
          this.setState({
            isPlaying: false,
          });
        }
      } else {
        this.setState(
          (prev) => ({
            currentFrame: this.step + prev.currentFrame,
          }),
          () => requestAnimationFrame(this.animationCallback)
        );
      }
    }
  };

  private onPlayButtonClick = () => {
    if (this.state.isPlaying) {
      this.setState({
        isPlaying: false,
      });
    } else if (this.state.currentFrame >= 1) {
      this.setState(
        {
          currentFrame: 0,
          isPlaying: true,
        },
        () => requestAnimationFrame(this.animationCallback)
      );
    } else {
      this.setState(
        () => ({
          isPlaying: true,
        }),
        () => requestAnimationFrame(this.animationCallback)
      );
    }
  };

  private onResetButtonClick = () => {
    this.setState(
      () => ({
        currentFrame: 0,
      }),
      () => {
        if (this.state.isPlaying) requestAnimationFrame(this.animationCallback);
        else this.drawFrame();
      }
    );
  };

  private autoPlaySwitchChanged = () => {
    this.setState((prev) => ({
      autoPlay: !prev.autoPlay,
    }));
  };

  private onFPSChanged = (event) => {
    const frameDuration = 10 / parseFloat(event.target.value);
    this.setState({
      frameDuration,
    });
  };

  public render() {
    return (
      <div>
        <div>
          <canvas
            ref={(r) => {
              this.canvas = r;
            }}
            height={500}
            width={500}
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
              float: 'right',
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
          <div
            style={{
              marginRight: '20px',
            }}
          >
            <Tooltip2 content='Reset'>
              <Button onClick={this.onResetButtonClick}>
                <Icon icon={IconNames.RESET} />
              </Button>
            </Tooltip2>
          </div>
          <Tooltip2 content='FPS'>
            <input
              type='number'
              min={0}
              max={1000}
              value={Math.round(10 / this.state.frameDuration)}
              onChange={this.onFPSChanged}
            />
          </Tooltip2>
          <Switch
            label='Auto Play'
            onChange={this.autoPlaySwitchChanged}
            checked={this.state.autoPlay}
          />
        </div>
      </div>
    );
  }
}
