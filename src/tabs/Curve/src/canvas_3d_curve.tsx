import { EditableText, Slider, Tooltip } from '@blueprintjs/core';
import type { CurveDrawn } from '@sourceacademy/bundle-curve/curves_webgl';
import AnimationError from '@sourceacademy/modules-lib/tabs/AnimationError';
import PlayButton from '@sourceacademy/modules-lib/tabs/PlayButton';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { BP_TAB_BUTTON_MARGIN, BP_TEXT_MARGIN, CANVAS_MAX_WIDTH, } from '@sourceacademy/modules-lib/tabs/css_constants';
import { useAnimation } from '@sourceacademy/modules-lib/tabs/useAnimation';
import { degreesToRadians } from '@sourceacademy/modules-lib/utilities';
import clamp from 'lodash/clamp';
import { useEffect, useRef, useState } from 'react';

interface Props {
  curve: CurveDrawn;
};

/**
 * Canvas to display 3D Curves.
 *
 * Uses WebGLCanvas internally.
 */
export default function Canvas3DCurve({ curve }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angleText, setAngleText] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    isPlaying: isRotating,
    start,
    stop,
    changeTimestamp: setDisplayAngle,
    timestamp: displayAngle,
    setCanvas,
    errored,
  } = useAnimation({
    animationDuration: 7200,
    autoLoop: true,
    callback(angle) {
      const angleInRadians = degreesToRadians(angle / 20);
      curve.redraw(angleInRadians);
    }
  });

  useEffect(() => {
    if (canvasRef.current) {
      curve.init(canvasRef.current);
      setCanvas(canvasRef.current);
    }
  }, [curve, canvasRef.current]);

  return <div style={{ width: '100%' }}>
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
          disabled={!!errored}
          onClick={() => {
            if (isRotating) stop();
            else start();
          }}
        />
        <Slider
          value={displayAngle / 20}
          min={0}
          max={360}
          disabled={!!errored}
          labelRenderer={false}
          onChange={newValue => {
            stop();
            setDisplayAngle(newValue * 20);
          }}
        />
        <Tooltip content="Angle in Degrees">
          <EditableText
            customInputAttributes={{
              style: { height: '100%' }
            }}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            type="number"
            value={angleText ?? Math.round(displayAngle / 20).toString()}
            disabled={isRotating || !!errored}
            onChange={value => {
              if (value.length > 3) return;
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
        </Tooltip>
      </div>
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {errored ? <AnimationError error={errored} /> : <WebGLCanvas ref={canvasRef} />}
    </div>
  </div>;
}
