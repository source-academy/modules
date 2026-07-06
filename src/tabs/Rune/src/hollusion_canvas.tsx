import type { HollusionRune } from '@sourceacademy/bundle-rune/functions';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { useAnimation } from '@sourceacademy/modules-lib/tabs/useAnimation';
import React from 'react';

type Props = {
  rune: HollusionRune;
};

/**
 * Canvas used to display Hollusion runes
 */
export default function HollusionCanvas({ rune }: Props) {
  // We memoize the render function so that we don't have
  // to reinitialize the shaders every time
  const renderFuncRef = React.useRef<(time: number) => unknown>(undefined);
  const isLoading = React.useRef(false);
  const { setCanvas } = useAnimation({
    callback(timestamp, canvas) {
      if (renderFuncRef.current) {
        return renderFuncRef.current(timestamp);
      }
      if (!isLoading.current) {
        isLoading.current = true;
        rune.draw(canvas).then(renderFunc => {
          renderFuncRef.current = renderFunc;
          renderFuncRef.current(timestamp);
          isLoading.current = false;
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
