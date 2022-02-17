import { Button, Icon, Slider } from '@blueprintjs/core';
import React from 'react';
import { CurveModuleState, ShapeDrawn } from '../../bundles/curve/types';

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

type CurvesTabState = {
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
  /**
   * Set to false by default. Slider and button checks for this value to decide
   * whether to be disabled.
   */
  is3D: boolean;
};

/* eslint-disable react/destructuring-assignment */
class WebGLCanvas extends React.Component<Props, CurvesTabState> {
  private $canvas: HTMLCanvasElement | null = null;

  constructor(props) {
    super(props);
    this.state = {
      rotationAngle: 0,
      isRotating: true,
      is3D: false,
    };
  }

  /**
   * This function decides whether the rendered curve is in 3D and setState
   * accordingly.
   */
  public componentDidMount() {
    if (this.$canvas) {
      const curveToDraw: ShapeDrawn = this.props.context.context.modules.get(
        'curve'
      ).state.drawnCurves[0];

      if (curveToDraw.init(this.$canvas)) {
        this.setState(
          (prevState) => ({
            ...prevState,
            is3D: true,
          }),
          () => {
            this.autoRotate();
          }
        );
      } else {
        this.setState(
          (prevState) => ({
            ...prevState,
            is3D: false,
          }),
          () => {
            curveToDraw.redraw(this.state.rotationAngle);
          }
        );
      }
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
            disabled={!this.state.is3D}
            min={0}
            max={2 * Math.PI}
            onChange={this.onChangeHandler}
          />
          <Button
            style={{
              marginLeft: '20px',
            }}
            disabled={!this.state.is3D}
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
    const moduleContext = context.context?.modules?.get('curve');
    if (moduleContext == null) {
      // eslint-disable-next-line no-alert
      alert('moduleContext was null (curves tab)');
      return false;
    }

    const moduleState: CurveModuleState = moduleContext.state;
    if (moduleState == null) {
      // eslint-disable-next-line no-alert
      alert('moduleState was null (curves tab)');
      return false;
    }

    return moduleState.drawnCurves.length > 0;
  },
  body: (context: any) => <WebGLCanvas context={context} />,
  label: 'Curve Canvas',
  iconName: 'media', // See https://blueprintjs.com/docs/#icons for more options
};
