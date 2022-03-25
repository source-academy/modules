import React from 'react';

export const defaultStyle = {
  width: '100%',
} as React.CSSProperties;

export const DefaultCanvas = React.forwardRef<HTMLCanvasElement, any>(
  (props: any, ref) => (
    <canvas style={defaultStyle} ref={ref} height={512} width={512} />
  )
);
