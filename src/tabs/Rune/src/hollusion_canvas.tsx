import type { DrawnHollusionRune } from '@sourceacademy/bundle-rune/functions';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { useAnimation } from '@sourceacademy/modules-lib/tabs/useAnimation';
import React from 'react';

interface Props {
  rune: DrawnHollusionRune;
};

type RenderFuncState =
  | { type: 'loading' }
  | { type: 'ready', renderFunc: (time: number) => unknown }
  | { type: 'uninitialized' };

/**
 * Canvas used to display Hollusion runes
 */
export default function HollusionCanvas({ rune }: Props) {
  // We memoize the render function so that we don't have
  // to reinitialize the shaders every time
  const renderFuncRef = React.useRef<RenderFuncState>({ type: 'uninitialized' });
  const { setCanvas } = useAnimation({
    callback({ timestamp, canvas }) {
      if (renderFuncRef.current.type === 'ready') {
        return renderFuncRef.current.renderFunc(timestamp);
      }
      if (renderFuncRef.current.type === 'uninitialized') {
        renderFuncRef.current = { type: 'loading' };
        rune.draw(canvas).then(renderFunc => {
          renderFuncRef.current = { type: 'ready', renderFunc };
          renderFuncRef.current.renderFunc(timestamp);
        });
      }
    },
    autoStart: true
  });

  return <WebGLCanvas ref={canvas => {
    if (canvas) {
      setCanvas(canvas);
    }
  }} />;
}
