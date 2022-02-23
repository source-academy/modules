/* eslint-disable react/destructuring-assignment */
import { Slider, Button, Icon } from '@blueprintjs/core';
import React from 'react';
import { CurveCanvasProps } from './types';

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

/**
 * 3D Version of the CurveCanvas to include the rotation angle slider
 * and play button
 */
export default class CurveCanvas3D extends React.Component<
  CurveCanvasProps,
  State
> {
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
      this.props.curve.redraw(this.state.rotationAngle);
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
          this.props.curve.redraw(newValue);
        }
      }
    );
  };

  /**
   * Event handler for play button. Starts automated rotation by calling
   * `autoRotate()`.
   */
  private onClickHandler = () => {
    if (this.$canvas && !this.state.isRotating) {
      this.setState(
        (prevState) => ({
          ...prevState,
          isRotating: true,
        }),
        () => {
          this.autoRotate();
        }
      );
    }
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
            prevState.rotationAngle >= 2 * Math.PI
              ? 0
              : prevState.rotationAngle + 0.005,
        }),
        () => {
          this.props.curve.redraw(this.state.rotationAngle);
          window.requestAnimationFrame(this.autoRotate);
        }
      );
    }
  };

  public render() {
    return (
      <div>
        <canvas
          ref={(r) => {
            if (r) {
              this.$canvas = r;
              this.props.curve.init(this.$canvas);
              this.props.curve.redraw(this.state.rotationAngle);
            }
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
            stepSize={0.01}
            labelValues={[0, 2 * Math.PI]}
            labelRenderer={false}
            min={0}
            max={2 * Math.PI}
            onChange={this.onChangeHandler}
          />
          <Button
            style={{
              marginLeft: '20px',
            }}
            onClick={this.onClickHandler}
          >
            <Icon icon='play' />
          </Button>
        </div>
      </div>
    );
  }
}
