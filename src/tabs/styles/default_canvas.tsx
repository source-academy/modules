import React from 'react';

export const defaultStyle = {
  width: '100%',
} as React.CSSProperties;

/**
 * Canvas type used for the Curves and Runes modules.
 * Standardizes the appearances of canvases
 * for the tabs of both modules
 */
export const DefaultCanvas = React.forwardRef<HTMLCanvasElement, any>(
  (props: any, ref) => (
    <canvas style={defaultStyle} ref={ref} height={512} width={512} />
  )
);
