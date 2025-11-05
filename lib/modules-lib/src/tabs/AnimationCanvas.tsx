import { Icon, Slider, Tooltip } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useMemo, useState } from 'react';
import type { glAnimation } from '../types';
import AnimationError from './AnimationError';
import AutoLoopSwitch from './AutoLoopSwitch';
import ButtonComponent from './ButtonComponent';
import PlayButton from './PlayButton';
import WebGLCanvas from './WebGLCanvas';
import { BP_TAB_BUTTON_MARGIN, BP_TEXT_MARGIN, CANVAS_MAX_WIDTH } from './css_constants';
import { useAnimation } from './useAnimation';

export type AnimCanvasProps = {
  animation: glAnimation;
};

/**
 * React Component for displaying {@link glAnimation|glAnimations}.
 *
 * Uses {@link WebGLCanvas} internally.
 */
export default function AnimationCanvas(props: AnimCanvasProps) {
  const [isAutoLooping, setIsAutoLooping] = useState(true);
  const [wasPlaying, setWasPlaying] = useState<boolean | null>(null);

  const [frameDuration, animationDuration] = useMemo(() => [
    1000 / props.animation.fps,
    Math.round(props.animation.duration * 1000)
  ], [props.animation]);

  const { stop, start, reset, changeTimestamp, isPlaying, errored, timestamp, setCanvas } = useAnimation({
    frameDuration,
    animationDuration,
    autoLoop: isAutoLooping,
    callback: (timestamp, canvas) => {
      const frame = props.animation.getFrame(timestamp / 1000);
      frame.draw(canvas);
    }
  });

  const controlBar = (
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
        title='PlayButton'
        isPlaying={isPlaying}
        onClick={() => {
          if (isPlaying) stop();
          else {
            if (errored || timestamp >= animationDuration) reset();
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
      <Slider
        value={timestamp}
        min={0}
        max={animationDuration}
        stepSize={1}
        labelRenderer={false}
        disabled={Boolean(errored)}
        onChange={newValue => {
          if (wasPlaying === null) {
            setWasPlaying(isPlaying);
          }

          changeTimestamp(newValue);
          stop();
        }}
        onRelease={() => {
          if (wasPlaying) {
            start();
          }

          setWasPlaying(null);
        }}
      />
      <AutoLoopSwitch
        isAutoLooping={isAutoLooping}
        disabled={Boolean(errored)}
        onChange={() => setIsAutoLooping(!isAutoLooping)}
      />
    </div>
  );

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
      {controlBar}
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
            style={{ flexGrow: 1 }}
            ref={element => {
              if (element !== null) {
                setCanvas(element);
              }
            }}
          />
        )}
    </div>
  </div>;
}
