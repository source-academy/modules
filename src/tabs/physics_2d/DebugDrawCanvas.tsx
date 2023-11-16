/* eslint-disable new-cap */
// We have to disable linting rules since Box2D functions do not
// follow the same guidelines as the rest of the codebase.

import { Button, Icon, Slider } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Tooltip2 } from '@blueprintjs/popover2';
import React from 'react';
import { DebugDraw } from '@box2d/debug-draw';
import { DrawShapes, type b2World } from '@box2d/core';

import WebGLCanvas from '../common/WebglCanvas';
import { type PhysicsWorld } from '../../bundles/physics_2d/PhysicsWorld';

type DebugDrawCanvasProps = {
  world: PhysicsWorld;
};

type DebugDrawCanvasState = {
  /** Timestamp of the animation */
  animTimestamp: number;

  /** Boolean value indicating if the animation is playing */
  isPlaying: boolean;

  /** Number value for the zoom level of the debug draw world */
  zoomLevel: number;

  /** Number value for the camera x coordinate in the debug draw world */
  camX: number;

  /** Number value for the update step in the debug draw world */
  updateStep: number;
};

export default class DebugDrawCanvas extends React.Component<
DebugDrawCanvasProps,
DebugDrawCanvasState
> {
  private canvas: HTMLCanvasElement | null;

  /**
   * The duration of one frame in milliseconds
   */
  private readonly frameDuration: number;

  /**
   * Last timestamp since the previous `requestAnimationFrame` call
   */
  private callbackTimestamp: number | null;

  private debugDraw: DebugDraw | null;

  private world: PhysicsWorld;
  private b2World: b2World;

  constructor(props: DebugDrawCanvasProps | Readonly<DebugDrawCanvasProps>) {
    super(props);

    this.state = {
      animTimestamp: 0,
      isPlaying: false,
      zoomLevel: 1,
      camX: 0,
      updateStep: 1 / 60,
    };

    this.canvas = null;
    this.frameDuration = 10;
    this.callbackTimestamp = null;
    this.debugDraw = null;
    this.world = props.world;
    this.b2World = this.world.getB2World();
  }

  public componentDidMount() {
    this.drawFrame();
  }

  /**
   * Call this to actually draw a frame onto the canvas
   */
  private drawFrame = () => {
    if (this.canvas) {
      if (!this.debugDraw) {
        const ctx: CanvasRenderingContext2D | null
          = this.canvas.getContext('2d');
        if (ctx) {
          this.debugDraw = new DebugDraw(ctx);
        }
      }

      if (this.debugDraw && this.world) {
        this.debugDraw.Prepare(this.state.camX, 0, this.state.zoomLevel, true);
        DrawShapes(this.debugDraw, this.b2World);
        this.debugDraw.Finish();
      }
    }
  };

  private reqFrame = () => requestAnimationFrame(this.animationCallback);

  private startAnimation = () => this.setState(
    {
      isPlaying: true,
    },
    this.reqFrame,
  );

  private stopAnimation = () => this.setState(
    {
      isPlaying: false,
    },
    () => {
      this.callbackTimestamp = null;
    },
  );

  /**
   * Callback to use with `requestAnimationFrame`
   */
  private animationCallback = (timeInMs: number) => {
    if (!this.canvas || !this.state.isPlaying) return;

    if (!this.callbackTimestamp) {
      this.callbackTimestamp = timeInMs;
      this.drawFrame();
      this.reqFrame();
      return;
    }

    const currentFrame = timeInMs - this.callbackTimestamp;

    if (currentFrame < this.frameDuration) {
      // Not time to draw a new frame yet
      this.reqFrame();
      return;
    }

    this.callbackTimestamp = timeInMs;

    this.setState(
      (prev) => ({
        animTimestamp: prev.animTimestamp + currentFrame,
      }),
      () => {
        this.drawFrame();
        this.reqFrame();
      },
    );

    this.world.update(this.state.updateStep);
  };

  /**
   * Play button click handler
   */
  private onPlayButtonClick = () => {
    if (this.state.isPlaying) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  };

  /**
   * Event handler for slider component. Updates the canvas for any change in
   * zoomLevel.
   *
   * @param newValue new zoom level
   */
  private onZoomSliderChangeHandler = (newValue: number) => {
    this.setState({ zoomLevel: newValue }, () => {});
  };

  /**
   * Event handler for slider component. Updates the canvas for any change in
   * camX.
   *
   * @param newValue new camera x coordinate
   */
  private onCameraSliderChangeHandler = (newValue: number) => {
    this.setState({ camX: newValue }, () => {});
  };

  /**
   * Event handler for slider component. Updates the canvas for any change in
   * updateStep.
   *
   * @param newValue new camera x coordinate
   */
  private onUpdateStepSliderChangeHandler = (newValue: number) => {
    this.setState({ updateStep: newValue }, () => {});
  };

  public render() {
    const buttons = (
      <div
        style={{
          marginLeft: '20px',
          marginRight: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
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
            marginLeft: '20px',
            marginRight: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p>Zoom level: {this.state.zoomLevel.toFixed(2)}</p>
            <Slider
              value={this.state.zoomLevel}
              stepSize={0.01}
              labelValues={[]}
              labelRenderer={false}
              min={0.01}
              max={8}
              onChange={this.onZoomSliderChangeHandler}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <p>Camera X: {this.state.camX.toFixed(2)}</p>
            <Slider
              value={this.state.camX}
              stepSize={10}
              labelValues={[]}
              labelRenderer={false}
              min={-500}
              max={500}
              onChange={this.onCameraSliderChangeHandler}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <p>Update step: {this.state.updateStep.toFixed(4)}</p>
            <Slider
              value={this.state.updateStep}
              stepSize={0.001}
              labelValues={[]}
              labelRenderer={false}
              min={0.001}
              max={0.1}
              onChange={this.onUpdateStepSliderChangeHandler}
            />
          </div>
        </div>
      </div>
    );

    return (
      <>
        <div
          style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <WebGLCanvas
            style={{
              flexGrow: 1,
            }}
            ref={(r) => {
              this.canvas = r;
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '10px',
            padding: '10px',
            flexDirection: 'row',
            justifyContent: 'stretch',
            alignContent: 'center',
          }}
        >
          {buttons}
        </div>
        <div
          style={{
            whiteSpace: 'pre-wrap',
          }}
        >
          {this.world.getWorldStatus()}
        </div>
      </>
    );
  }
}
