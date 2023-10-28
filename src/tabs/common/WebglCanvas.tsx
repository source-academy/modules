import React from 'react';
import { CANVAS_MAX_WIDTH } from './css_constants';

const defaultStyle = {
  width: '100%',
  maxWidth: CANVAS_MAX_WIDTH,
  aspectRatio: '1',
} as React.CSSProperties;

/**
 * Canvas component used by the curve and rune modules. Standardizes the
 * appearances of canvases for both modules.
 */
const WebGLCanvas = React.forwardRef<HTMLCanvasElement, any>(
  (props: any, ref) => {
    const style
      = props.style !== undefined
        ? {
          ...defaultStyle,
          ...props.style,
        }
        : defaultStyle;

    return (
      <canvas {...props} style={style} ref={ref} height={512} width={512} />
    );
  },
);

export default WebGLCanvas;
