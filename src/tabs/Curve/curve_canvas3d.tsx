import { Slider, Button, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React from 'react';
import type { CurveDrawn } from '../../bundles/curve/curves_webgl';
import WebGLCanvas from '../common/webgl_canvas';

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

  displayAngle: boolean;
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
      displayAngle: false,
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
      {
        rotationAngle: newValue,
        isRotating: false,
        displayAngle: true,
      },
      () => {
        if (this.$canvas) {
          this.props.curve.redraw((newValue / 180) * Math.PI);
        }
      },
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
      },
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
        },
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
      },
    );
  };

  public render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'center',
        }}
      >
        <WebGLCanvas
          ref={(r) => {
            this.$canvas = r;
          }}
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
            labelValues={[]}
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
            type="number"
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
