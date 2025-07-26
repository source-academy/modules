import { Icon, Slider, Tooltip } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import type { AnimatedCurve } from '@sourceacademy/bundle-curve/types';
import AnimationError from '@sourceacademy/modules-lib/tabs/AnimationError';
import AutoLoopSwitch from '@sourceacademy/modules-lib/tabs/AutoLoopSwitch';
import ButtonComponent from '@sourceacademy/modules-lib/tabs/ButtonComponent';
import PlayButton from '@sourceacademy/modules-lib/tabs/PlayButton';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { BP_TAB_BUTTON_MARGIN, BP_TEXT_MARGIN, CANVAS_MAX_WIDTH } from '@sourceacademy/modules-lib/tabs/css_constants';
import { useAnimation } from '@sourceacademy/modules-lib/tabs/useAnimation';
import React from 'react';

type Props = {
  animation: AnimatedCurve;
};

/**
 * Animation Canvas for 3D curves
 */
export default function Curve3DAnimationCanvas({ animation }: Props) {
  const [displayAngle, setDisplayAngle] = React.useState(0);
  const [isAutoLooping, setIsAutoLooping] = React.useState(true);
  const [wasPlaying, setWasPlaying] = React.useState<boolean | null>(null);

  const frameDuration = 1000 / animation.fps;
  const animationDuration = Math.round(animation.duration * 1000);
  const { changeTimestamp, drawFrame, start, stop, reset, timestamp, errored, isPlaying, setCanvas } = useAnimation({
    frameDuration, animationDuration, autoLoop: isAutoLooping,
    callback(timestamp, canvas) {
      const frame = animation.getFrame(timestamp / 1000);
      frame.draw(canvas);
    },
  });

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
          isPlaying={isPlaying}
          disabled={Boolean(errored)}
          onClick={() => {
            if (isPlaying) stop();
            else {
              if (timestamp >= animationDuration) reset();
              start();
            }
          }}
        />
        <Tooltip
          content="Reset"
          placement="top"
        >
          <ButtonComponent
            disabled={Boolean(errored)}
            onClick={reset}
          >
            <Icon icon={IconNames.RESET} />
          </ButtonComponent>
        </Tooltip>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: BP_TEXT_MARGIN,

            width: '100%'
          }}
        >
          <Slider
            value={timestamp}
            min={0}
            max={animationDuration}
            stepSize={1}
            labelRenderer={false}
            disabled={Boolean(errored)}
            onChange={newValue => {
              changeTimestamp(newValue);
              if (wasPlaying === null) {
                setWasPlaying(isPlaying);
              }
              stop();
            }}
            onRelease={() => {
              if (wasPlaying) start();

              setWasPlaying(null);
            }}
          />
          <Tooltip
            content="Display Angle"
            placement="top"
          >
            <Slider
              value={displayAngle}
              min={0}
              max={2 * Math.PI}
              stepSize={0.01}
              labelRenderer={false}
              disabled={Boolean(errored)}
              onChange={value => {
                setDisplayAngle(value);
                if (!isPlaying) drawFrame();
                animation.angle = value;
              }}
            />
          </Tooltip>
        </div>
        <AutoLoopSwitch
          isAutoLooping={isAutoLooping}
          disabled={Boolean(errored)}
          onChange={() => setIsAutoLooping(prev => !prev)}
        />
      </div>
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {errored
        ? <AnimationError error={errored} />
        : (
          <WebGLCanvas
            style={{
              flexGrow: 1
            }}
            ref={canvas => {
              if (canvas) {
                setCanvas(canvas);
              }
            }}
          />
        )}
    </div>
  </div>;
}
