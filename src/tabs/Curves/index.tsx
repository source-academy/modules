import { Button, Icon, Slider } from '@blueprintjs/core';
import React from 'react';
import { ShapeDrawn } from '../../bundles/curves/types';

/**
 * Currently used for rendering HTML canvas element for curves.
 * The same tab will be used if we are trying ThreeJS Canvas in
 * the future.
 * @author Lee Zheng Han
 * @author Ng Yong Xiang
 */

type Props = {
  children?: never;
  className?: never;
  context?: any;
};

type State = {
  rotationAngle: number;
  isRotating: boolean;
};

/* eslint-disable react/destructuring-assignment */
class WebGLCanvas extends React.Component<Props, State> {
  private $canvas: HTMLCanvasElement | null = null;

  constructor(props) {
    super(props);
    this.state = {
      rotationAngle: 0,
      isRotating: true,
    };
  }

  public componentDidMount() {
    if (this.$canvas) {
      this.props.context.result.value.init(this.$canvas);
      this.autoRotate();
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
          this.props.context.result.value.redraw(newValue);
        }
      }
    );
  };

  /**
   * Event handler for play button. Starts automated rotation when called.
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

  private autoRotate = () => {
    if (this.$canvas && this.state.isRotating) {
      const temp = this.state.rotationAngle;
      this.setState(
        (prevState) => ({
          ...prevState,
          rotationAngle: temp >= 2 * Math.PI ? 0 : temp + 0.005,
        }),
        () => {
          this.props.context.result.value.redraw(this.state.rotationAngle);
          window.requestAnimationFrame(this.autoRotate);
        }
      );
    }
  };

  public render() {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          paddingLeft: '20px',
          paddingRight: '20px',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <canvas
          ref={(r) => {
            this.$canvas = r;
          }}
          width={500}
          height={500}
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

export default {
  toSpawn: (context: any) => {
    function isValidFunction(value: any): value is ShapeDrawn {
      try {
        return value instanceof Object && value.init instanceof Function;
      } catch (e) {
        return false;
      }
    }
    return isValidFunction(context.result.value);
  },
  body: (context: any) => <WebGLCanvas context={context} />,
  label: 'Curves Canvas',
  iconName: 'media', // See https://blueprintjs.com/docs/#icons for more options
};
