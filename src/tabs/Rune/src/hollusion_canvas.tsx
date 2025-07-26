import type { HollusionRune } from '@sourceacademy/bundle-rune/functions';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { useAnimation } from '@sourceacademy/modules-lib/tabs/useAnimation';
import React from 'react';

type Props = {
  rune: HollusionRune
};

/**
 * Canvas used to display Hollusion runes
 */
export default function HollusionCanvas({ rune }: Props) {
  // We memoize the render function so that we don't have
  // to reinitialize the shaders every time
  const renderFuncRef = React.useRef<(time: number) => void>();

  const { setCanvas } = useAnimation({
    callback(timestamp, canvas) {
      if (renderFuncRef.current === undefined) {
        renderFuncRef.current = rune.draw(canvas);
      }
      renderFuncRef.current(timestamp);
    },
    autoStart: true
  });

  return <WebGLCanvas ref={canvas => {
    if (canvas) {
      setCanvas(canvas);
    }
  }} />;
}
