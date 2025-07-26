import { forwardRef, type CanvasHTMLAttributes, type DetailedHTMLProps } from 'react';
import { CANVAS_MAX_WIDTH } from './css_constants';

const defaultStyle = {
  width: '100%',
  maxWidth: CANVAS_MAX_WIDTH,
  aspectRatio: '1'
};

export type WebGLCanvasProps = DetailedHTMLProps<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;

/**
 * Canvas component used by the curve and rune modules. Standardizes the
 * appearances of canvases for both modules.
 */
const WebGLCanvas = forwardRef<HTMLCanvasElement, WebGLCanvasProps>(
  (props, ref) => {
    const style: Partial<WebGLCanvasProps['style']>
      = props.style !== undefined
        ? {
          ...defaultStyle,
          ...props.style
        }
        : defaultStyle;

    return (
      <canvas {...props} style={style} ref={ref} height={512} width={512} />
    );
  }
);

WebGLCanvas.displayName = 'WebGLCanvas';

export default WebGLCanvas;
