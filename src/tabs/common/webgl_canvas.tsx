import React from 'react';

const defaultStyle = {
  width: '100%',
  maxWidth: 'max(70vh, 30vw)',
  aspectRatio: '1',
} as React.CSSProperties;

/**
 * Canvas type used for the Curves and Runes modules.
 * Standardizes the appearances of canvases
 * for the tabs of both modules
 */
const WebGLCanvas = React.forwardRef<HTMLCanvasElement, any>(
  (props: any, ref) => {
    const style =
      props.style !== undefined
        ? {
            ...defaultStyle,
            ...props.style,
          }
        : defaultStyle;

    return (
      <canvas
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        style={style}
        ref={ref}
        height={512}
        width={512}
      />
    );
  }
);

export default WebGLCanvas;
