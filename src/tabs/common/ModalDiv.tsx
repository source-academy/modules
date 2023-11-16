import type { MouseEventHandler, ReactElement } from 'react';

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

const bodyStyle = {
  backgroundColor: '#fffafa',
  border: '2px solid black',
  borderRadius: '5px',
  boxShadow: '0px 0px 5px inset gray',
  height: '100%',
  overflowY: 'auto',
  padding: '0.75rem',
} as React.CSSProperties;

const backdropStyle = {
  position: 'fixed',
  zIndex: 90,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  filter: 'blur(10px)',
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
        <div style={{
          height,
          width,
          ...containerStyle,
        }}>
          <div style={bodyStyle}>{children}</div>
        </div>
        <div style={backdropStyle} onClick={handleClose} />
      </>
    )}
  </>
);

export default Modal;
