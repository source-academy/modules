/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { HollusionRune } from '../../bundles/rune/functions';

/**
 * Canvas used to display Hollusion runes
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export default function HollusionCanvas(props: { rune: HollusionRune }) {
  const canvasRef = React.useRef(null);
  const renderFuncRef = React.useRef<(time: number) => void>();
  const animId = React.useRef<number | null>(null);

  const animCallback = (timeInMs: number) => {
    renderFuncRef.current!(timeInMs);
    animId.current = requestAnimationFrame(animCallback);
  };

  React.useEffect(() => {
    if (canvasRef.current) {
      renderFuncRef.current = props.rune.draw(canvasRef.current!);
      animCallback(0);

      return () => {
        if (animId.current) {
          cancelAnimationFrame(animId.current!);
        }
      };
    }

    return undefined;
  }, []);

  return <canvas height={512} width={512} ref={canvasRef} />;
}
