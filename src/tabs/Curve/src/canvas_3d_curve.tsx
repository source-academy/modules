import { EditableText, Slider } from '@blueprintjs/core';
import type { CurveDrawn } from '@sourceacademy/bundle-curve/curves_webgl';
import PlayButton from '@sourceacademy/modules-lib/tabs/PlayButton';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { BP_TAB_BUTTON_MARGIN, BP_TEXT_MARGIN, CANVAS_MAX_WIDTH, } from '@sourceacademy/modules-lib/tabs/css_constants';
import { useAnimation } from '@sourceacademy/modules-lib/tabs/useAnimation';
import { degreesToRadians } from '@sourceacademy/modules-lib/utilities';
import { clamp } from 'lodash';
import React from 'react';

export default function Canvas3DCurve({ curve }: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [angleText, setAngleText] = React.useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  const {
    isPlaying: isRotating,
    start,
    stop,
    changeTimestamp: setDisplayAngle,
    timestamp: displayAngle,
    setCanvas,
  } = useAnimation({
    animationDuration: 7200,
    autoLoop: true,
    callback(angle) {
      const angleInRadians = degreesToRadians(angle / 20);
      curve.redraw(angleInRadians);
    }
  });

  React.useEffect(() => {
    if (canvasRef.current) {
      curve.init(canvasRef.current);
      setCanvas(canvasRef.current);
    }
  }, [curve, canvasRef.current]);

  return <div
    style={{ width: '100%' }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
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
          paddingBottom: BP_TEXT_MARGIN
        }}
      >
        <PlayButton
          isPlaying={isRotating}
          onClick={() => {
            if (isRotating) stop();
            else start();
          }}
        />
        <Slider
          value={displayAngle / 20}
          min={0}
          max={360}
          labelRenderer={false}
          onChange={newValue => {
            stop();
            setDisplayAngle(newValue * 20);
          }}
        />
        <EditableText
          customInputAttributes={{
            style: { height: '100%' }
          }}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          type="number"
          value={angleText ?? Math.round(displayAngle / 20).toString()}
          disabled={isRotating}
          onChange={value => {
            setAngleText(value);
            if (isEditing) return;

            const angle = parseFloat(value);
            if (!Number.isNaN(angle)) {
              setDisplayAngle(clamp(angle, 0, 360) * 20);
            }
            setAngleText(null);
          }}
          onConfirm={value => {
            const angle = parseFloat(value);
            setDisplayAngle(clamp(angle, 0, 360) * 20);
            setAngleText(null);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <WebGLCanvas ref={canvasRef} />
    </div>
  </div>;
}

type State = {
  /**
   * Slider component reflects this value. This value is also passed in as
   * argument to render curves.
   */
  displayAngle: number;

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
 * Canvas to display 3D Curves.
 *
 * Uses WebGLCanvas internally.
 */
export class Canvas3dCurve extends React.Component<Props, State> {
  private canvas: HTMLCanvasElement | null;

  constructor(props) {
    super(props);

    this.canvas = null;
    this.state = {
      displayAngle: 0,
      isRotating: false
    };
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
        displayAngle: newValue,
        isRotating: false
      },
      () => {
        if (this.canvas) {
          this.props.curve.redraw(degreesToRadians(newValue));
        }
      }
    );
  };

  /**
   * Event handler for play button. Starts automated rotation by calling
   * `autoRotate()`.
   */
  private onClickHandler = () => {
    if (!this.canvas) return;

    this.setState(
      (prevState) => ({
        isRotating: !prevState.isRotating
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
    if (this.canvas && this.state.isRotating) {
      this.setState(
        (prevState) => ({
          ...prevState,
          displayAngle:
            prevState.displayAngle >= 360 ? 0 : prevState.displayAngle + 2
        }),
        () => {
          this.props.curve.redraw(degreesToRadians(this.state.displayAngle));
          window.requestAnimationFrame(this.autoRotate);
        }
      );
    }
  };

  private onTextBoxChange = (event) => {
    const angle = parseFloat(event.target.value);
    this.setState(
      () => ({ displayAngle: angle }),
      () => {
        if (this.canvas) {
          this.props.curve.redraw(degreesToRadians(angle));
        }
      }
    );
  };

  public componentDidMount() {
    if (this.canvas) {
      this.props.curve.init(this.canvas);
      this.props.curve.redraw(degreesToRadians(this.state.displayAngle));
    }
  }

  public render() {
    return <div
      style={{
        width: '100%'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center'
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
            paddingBottom: BP_TEXT_MARGIN
          }}
        >
          <PlayButton
            isPlaying={ this.state.isRotating }
            onClick={ this.onClickHandler }
          />
          <Slider
            value={ this.state.displayAngle }
            min={ 0 }
            max={ 360 }
            labelRenderer={ false }
            onChange={ this.onSliderChangeHandler }
          />
          <input
            style={{
              height: '100%'
            }}
            type="number"
            value={ this.state.displayAngle }
            min={ 0 }
            max={ 360 }
            step={ 1 }
            disabled={ this.state.isRotating }
            onChange={ this.onTextBoxChange }
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center'
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
