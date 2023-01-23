import React, { MouseEventHandler, ReactElement } from 'react';

const containerStyle = {
  position: 'fixed',
  zIndex: 999,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 'auto',
  padding: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  borderRadius: '5px',
  backgroundColor: 'rgb(199, 196, 196)',
} as React.CSSProperties;

const backdropStyle = {
  position: 'fixed',
  zIndex: 9998,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
} as React.CSSProperties;

interface ModalProp {
  open: boolean
  height: string
  width: string
  handleClose: MouseEventHandler
  children: ReactElement
}

const Modal = ({ open, height, width, children, handleClose }: ModalProp) => (
  <>
    {open && (
      <>
        <div className={'modal_container'} style={{
          height,
          width,
          ...containerStyle,
        }}>
          <div className={'modal_body'}>{children}</div>
        </div>
        <div style={backdropStyle} onClick={handleClose} />
      </>
    )}
  </>
);

export default Modal;
