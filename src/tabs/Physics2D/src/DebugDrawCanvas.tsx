import { Slider } from '@blueprintjs/core';
import { DrawShapes } from '@box2d/core';
import { DebugDraw } from '@box2d/debug-draw';

import type { PhysicsWorld } from '@sourceacademy/bundle-physics_2d/PhysicsWorld';
import PlayButton from '@sourceacademy/modules-lib/tabs/PlayButton';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { useAnimation } from '@sourceacademy/modules-lib/tabs/useAnimation';
import React from 'react';

interface DebugDrawCanvasProps {
  world: PhysicsWorld;
}

export default function DebugDrawCanvas({ world }: DebugDrawCanvasProps) {
  const debugDraw = React.useRef<DebugDraw | null>(null);

  const [camX, setCamX] = React.useState(0);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [updateStep, setUpdateStep] = React.useState(1 / 60);

  const { start, stop, isPlaying, setCanvas, drawFrame } = useAnimation({
    autoStart: false,
    callback({ canvas, isPlaying }) {
      if (!debugDraw.current) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        debugDraw.current = new DebugDraw(ctx);
      }

      debugDraw.current.Prepare(camX, 0, zoomLevel, true);
      DrawShapes(debugDraw.current, world.getB2World());
      debugDraw.current.Finish();

      if (isPlaying) world.update(updateStep);
    },
  });

  const buttons = (
    <div
      style={{
        marginLeft: '20px',
        marginRight: '20px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <div
        style={{
          marginRight: '20px',
        }}
      >
        <PlayButton
          isPlaying={isPlaying}
          onClick={() => {
            if (isPlaying) {
              stop();
            } else {
              start();
            }
          }}
        />
      </div>
      <div
        style={{
          marginLeft: '20px',
          marginRight: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <p>Zoom level: {zoomLevel.toFixed(2)}</p>
          <Slider
            value={zoomLevel}
            stepSize={0.01}
            labelValues={[]}
            labelRenderer={false}
            min={0.01}
            max={8}
            onChange={value => {
              setZoomLevel(value);
              if (!isPlaying) drawFrame();
            }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <p>Camera X: {camX.toFixed(2)}</p>
          <Slider
            value={camX}
            stepSize={10}
            labelValues={[]}
            labelRenderer={false}
            min={-500}
            max={500}
            onChange={value => {
              setCamX(value);
              if (!isPlaying) drawFrame();
            }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <p>Update step: {updateStep.toFixed(4)}</p>
          <Slider
            value={updateStep}
            stepSize={0.001}
            labelValues={[]}
            labelRenderer={false}
            min={0.001}
            max={0.1}
            onChange={setUpdateStep}
          />
        </div>
      </div>
    </div>
  );

  return <>
    <div
      style={{
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center'
      }}
    >
      <WebGLCanvas
        style={{
          flexGrow: 1
        }}
        ref={r => {
          if (r) setCanvas(r);
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
        alignContent: 'center'
      }}
    >
      {buttons}
    </div>
    <div
      style={{
        whiteSpace: 'pre-wrap'
      }}
    >
      {world.getWorldStatus()}
    </div>
  </>;
}
