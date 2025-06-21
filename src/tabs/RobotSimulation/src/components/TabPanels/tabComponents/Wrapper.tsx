import type { CSSProperties } from 'react';

const panelWrapperStyle: CSSProperties = {
  'padding': '10px'
};
export const TabWrapper:React.FC<{
  children?: React.ReactNode;
}> = ({children}) => {
  return <div style={panelWrapperStyle}>{children}</div>;
};
