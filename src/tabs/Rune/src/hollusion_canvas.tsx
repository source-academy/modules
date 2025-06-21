import type { HollusionRune } from '@sourceacademy/bundle-rune/functions';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebglCanvas';
import React from 'react';

/**
 * Canvas used to display Hollusion runes
 */
export default function HollusionCanvas({ rune }: { rune: HollusionRune }) {
  const canvasRef = React.useRef(null);
  const renderFuncRef = React.useRef<(time: number) => void>();
  const animId = React.useRef<number | null>(null);

  const animCallback = (timeInMs: number) => {
    renderFuncRef.current!(timeInMs);
    animId.current = requestAnimationFrame(animCallback);
  };

  React.useEffect(() => {
    if (canvasRef.current) {
      renderFuncRef.current = rune.draw(canvasRef.current!);
      animCallback(0);

      return () => {
        if (animId.current) {
          cancelAnimationFrame(animId.current!);
        }
      };
    }

    return undefined;
  }, []);

  return <WebGLCanvas ref={canvasRef} />;
}
