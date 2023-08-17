import { type CSSProperties, type ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const containerStyle: CSSProperties = {
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  bottom: 0,
  top: 0,
  left: 0,
  right: 0,
  zIndex: 20,
  isolation: 'isolate',
};

export const closeButtonStyle: CSSProperties = {
  position: 'fixed',
  top: '10px',
  right: '10px',
  cursor: 'pointer',
  fontSize: 24,
  color: 'white',
};

export const greyedOutBackground: CSSProperties = {
  background: 'black',
  opacity: '70%',
  width: '100%',
  height: '100%',
  position: 'absolute',
  zIndex: -1,
};

export const childWrapperStyle: CSSProperties = {
  display: 'flex',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
};

export function Modal({ children, isOpen, onClose }: ModalProps) {
  return (
    <div
      style={{
        ...containerStyle,
        display: isOpen ? 'block' : 'none',
      }}
    >
      <div style={greyedOutBackground}></div>
      <span style={closeButtonStyle} onClick={onClose}>
        x
      </span>
      <div style={childWrapperStyle}>{children}</div>
    </div>
  );
}
