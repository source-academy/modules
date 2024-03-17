import { ARButton } from '@react-three/xr';
import {
  ScreenStateContext,
  useScreenState,
} from './libraries/screen_state_library/ScreenStateContext';
import { type RefObject, useEffect, useState, useRef } from 'react';
import {
  PlayAreaContext,
  usePlayArea,
} from './libraries/calibration_library/PlayAreaContext';
import {
  ControlsContext,
  useControls,
} from './libraries/controls_library/ControlsContext';
import { type ARState, getModuleState } from './AR';
import { type OverlayHelper } from './OverlayHelper';
import { ARObject } from './libraries/object_state_library/ARObject';
import { useThree } from '@react-three/fiber';

export default function ARComponent(props: ARState) {
  return (
    <ScreenStateContext>
      <ButtonComponent {...props} />
    </ScreenStateContext>
  );
}

/**
 * Toggle to start AR context, for tab.
 */
function ButtonComponent(props: ARState) {
  const screenState = useScreenState();

  useEffect(() => {
    screenState.setState(<AugmentedLayer {...props} />, <Overlay />);
  }, []);

  return (
    <div style={{ height: '50vh' }}>
      <ARButton
        enterOnly
        style={{}}
        sessionInit={{
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: screenState.domOverlay,
        }}
      />
      {screenState.component}
    </div>
  );
}

/**
 * Default overlay for AR in Source Academy.
 * Toggles are hidden until defined.
 */
function Overlay() {
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

function AugmentedLayer(props: ARState) {
  return (
    <PlayAreaContext>
      <ControlsContext>
        <AugmentedContent {...props} />
      </ControlsContext>
    </PlayAreaContext>
  );
}

/**
 * Content to be shown on screen.
 */
function AugmentedContent(props: ARState) {
  const screenState = useScreenState();
  const playArea = usePlayArea();
  const controls = useControls();
  const three = useThree();
  const [objects, setObjects] = useState<ARObject[]>([]);
  const highlightFrontObject = useRef(props.highlightFrontObject);
  const objectsRef = useRef<ARObject[]>();

  useEffect(() => {
    controls.setObjectInSightCallback((prev, current) => {
      if (!highlightFrontObject.current) {
        return;
      }
      if (prev) {
        const object = objectsRef.current?.find(
          (item) => item.uuid === prev.uuid,
        );
        if (object) {
          object.isInFront = false;
        }
      }
      if (current) {
        const object = objectsRef.current?.find(
          (item) => item.uuid === current.uuid,
        );
        if (object) {
          object.isInFront = true;
        }
      }
    });
    (window as any).arControllerCallback = () => {
      const newState = getModuleState();
      updateObjects(newState);
      highlightFrontObject.current = newState.highlightFrontObject;
    };
    updateObjects(props);
  }, []);

  useEffect(() => {
    setupToggles(props.overlay, screenState.overlayRef, () => {
      playArea.setPositionAsOrigin(
        three.camera.position,
        three.camera.rotation,
      );
    });
  }, [
    props.overlay.toggleCenter,
    props.overlay.toggleLeft,
    props.overlay.toggleRight,
  ]);

  function updateObjects(state: ARState) {
    const newObjects: ARObject[] = [];
    state.arObjects.forEach((object) => {
      const newObject = ARObject.fromObject(object);
      if (newObject) {
        newObjects.push(newObject);
      }
    });
    newObjects.forEach((object) => {
      object.onSelect = () => {
        const moduleState = getModuleState();
        if (moduleState) {
          const callback = moduleState.clickCallbacks.get(object.id);
          callback?.();
        }
      };
    });
    setObjects(newObjects);
    objectsRef.current = newObjects;
  }

  return (
    <group>
      {objects.map((item) => item.getComponent(playArea.getCameraPosition))}
    </group>
  );
}

function setupToggles(
  overlayHelper: OverlayHelper,
  overlayRef: RefObject<HTMLDivElement> | null,
  recalibrate: () => void,
) {
  if (!overlayRef || !overlayRef.current) return;
  const overlay = overlayRef.current;
  // Recalibrate
  const recalibrateToggle = overlay?.querySelector(
    '#recalibrate-toggle',
  ) as HTMLElement;
  if (recalibrateToggle) {
    recalibrateToggle.onclick = recalibrate;
  }
  // Left
  const leftToggle = overlay?.querySelector('#left-toggle') as HTMLElement;
  if (leftToggle) {
    if (overlayHelper.toggleLeft) {
      leftToggle.style.display = 'block';
      leftToggle.textContent = overlayHelper.toggleLeft.text;
      leftToggle.onclick = () => {
        overlayHelper.toggleLeft?.callback();
      };
    } else {
      leftToggle.style.display = 'none';
      leftToggle.textContent = '';
      leftToggle.onclick = () => {};
    }
  }
  // Center
  const centerToggle = overlay?.querySelector('#center-toggle') as HTMLElement;
  if (centerToggle) {
    if (overlayHelper.toggleCenter) {
      centerToggle.style.display = 'block';
      centerToggle.textContent = overlayHelper.toggleCenter.text;
      centerToggle.onclick = () => {
        overlayHelper.toggleCenter?.callback();
      };
    } else {
      centerToggle.style.display = 'none';
      centerToggle.textContent = '';
      centerToggle.onclick = () => {};
    }
  }
  // Right
  const rightToggle = overlay?.querySelector('#right-toggle') as HTMLElement;
  if (rightToggle) {
    if (overlayHelper.toggleRight) {
      rightToggle.style.display = 'block';
      rightToggle.textContent = overlayHelper.toggleRight.text;
      rightToggle.onclick = () => {
        overlayHelper.toggleRight?.callback();
      };
    } else {
      rightToggle.style.display = 'none';
      rightToggle.textContent = '';
      rightToggle.onclick = () => {};
    }
  }
}
