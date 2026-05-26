import { Button, ButtonGroup, Divider, NumericInput } from '@blueprintjs/core';
import { MAX_FPS, MAX_HEIGHT, MAX_WIDTH, MIN_FPS, MIN_HEIGHT, MIN_WIDTH } from '@sourceacademy/bundle-pix_n_flix/constants';

export interface VideoControlsProps {
  isPlaying: boolean;
  onClickStart?: () => void;
  onClickStop?: () => void;

  fps: number;
  onFpsChange?: (newFps: number) => void;
}

export function VideoControls({
  isPlaying,
  onClickStart,
  onClickStop,
  fps,
  onFpsChange
}: VideoControlsProps) {
  return <div
    className="sa-video-header-element"
  >
    <ButtonGroup>
      <Button
        className="sa-live-video-button"
        icon='video'
        active={isPlaying}
        onClick={onClickStart}
        text="Play Video"
      />
      <Button
        className="sa-still-image-button"
        icon='camera'
        active={!isPlaying}
        onClick={onClickStop}
        text="Pause Video"
      />
    </ButtonGroup>
    <Divider />
    <div className="sa-video-header-numeric-input">
      {/* <Tooltip2 content='Change FPS'> */}
      <NumericInput
        leftIcon='stopwatch'
        style={{ width: 60 }}
        value={fps}
        onValueChange={onFpsChange}
        minorStepSize={null}
        stepSize={1}
        majorStepSize={null}
        max={MAX_FPS}
        min={MIN_FPS}
      />
      {/* </Tooltip2> */}
    </div>
  </div>;
}

interface DimensionControlsProps {
  height: number;
  width: number;

  onHeightChange?: (newValue: number) => void;
  onWidthChange?: (newValue: number) => void;
}

export function DimensionControls({
  height, onHeightChange,
  width, onWidthChange
}: DimensionControlsProps) {

  return <div
    className="sa-video-header-element"
  >
    <div className="sa-video-header-numeric-input">
      {/* <Tooltip2 content='Change width'> */}
      <NumericInput
        disabled
        leftIcon='horizontal-distribution'
        style={{ width: 70 }}
        value={width}
        onValueChange={onWidthChange}
        minorStepSize={1}
        stepSize={10}
        majorStepSize={100}
        max={MAX_WIDTH}
        min={MIN_WIDTH}
      />
      {/* </Tooltip2> */}
    </div>
    <div className="sa-video-header-numeric-input">
      {/* <Tooltip2 content='Change height'> */}
      <NumericInput
        disabled
        leftIcon='vertical-distribution'
        style={{ width: 70 }}
        value={height}
        onValueChange={onHeightChange}
        minorStepSize={1}
        stepSize={10}
        majorStepSize={100}
        max={MAX_HEIGHT}
        min={MIN_HEIGHT}
      />
      {/* </Tooltip2> */}
    </div>
  </div>;
}
