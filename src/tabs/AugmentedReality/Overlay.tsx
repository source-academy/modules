import { ARButton } from '@react-three/xr';

/**
 * Default overlay for AR in Source Academy.
 * Toggles are hidden until defined.
 */
export function Overlay() {
  return (
    <div
      style={{
        height: 150,
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0px 20px 20px 20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          padding: '0px 0px 20px 0px',
        }}
      >
        <button
          id="recalibrate-toggle"
          style={{
            background: '#212121',
            color: '#fafafa',
            borderRadius: 30,
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          ↻
        </button>
        <button
          id="left-toggle"
          style={{
            display: 'none',
            width: 100,
            background: '#fafafa',
            color: '#212121',
            borderRadius: 30,
            padding: '15px',
          }}
        />
        <button
          id="center-toggle"
          style={{
            display: 'none',
            width: 100,
            background: '#fafafa',
            color: '#212121',
            borderRadius: 30,
            padding: '15px',
          }}
        />
        <button
          id="right-toggle"
          style={{
            display: 'none',
            width: 100,
            background: '#fafafa',
            color: '#212121',
            borderRadius: 30,
            padding: '15px',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        <ARButton
          style={{
            width: 100,
            background: '#c5d5db',
            color: '#212121',
            borderRadius: 30,
            padding: '10px 15px',
          }}
          exitOnly
        >
          Exit
        </ARButton>
      </div>
    </div>
  );
}
