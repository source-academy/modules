import {
  getModuleState,
  type ARState,
  setFrontObject,
} from '@sourceacademy/bundle-ar/AR';
import type { OverlayHelper } from '@sourceacademy/bundle-ar/OverlayHelper';
import { useState, type RefObject, useRef, useEffect } from 'react';
import { usePlayArea } from 'saar/libraries/calibration_library/PlayAreaContext';
import { useControls } from 'saar/libraries/controls_library/ControlsContext';
import { ARObject } from 'saar/libraries/object_state_library/ARObject';
import { useScreenState } from 'saar/libraries/screen_state_library/ScreenStateContext';

/**
 * Content to be shown on screen.
 */
export function AugmentedContent(props: ARState) {
  const screenState = useScreenState();
  const playArea = usePlayArea();
  const controls = useControls();
  const [objects, setObjects] = useState<ARObject[]>([]);
  const highlightFrontObject = useRef(props.highlightFrontObject);
  const objectsRef = useRef<ARObject[]>();
  const [timeOffset, setTimeOffset] = useState(0);

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
          setFrontObject(object);
        } else {
          setFrontObject(undefined);
        }
      } else {
        setFrontObject(undefined);
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
      playArea.setCameraAsOrigin();
    });
  }, [
    props.overlay.toggleCenter,
    props.overlay.toggleLeft,
    props.overlay.toggleRight,
  ]);

  function updateObjects(state: ARState) {
    const newObjects: ARObject[] = [];
    state.arObjects.forEach((object) => {
      const newObject = ARObject.fromObject(object, getCurrentTime);
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

  // Toggles

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
    const centerToggle = overlay?.querySelector(
      '#center-toggle',
    ) as HTMLElement;
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

  // Time

  useEffect(() => {
    try {
      fetch('https://worldtimeapi.org/api/timezone/Asia/Singapore')
        .then((response) => response.json())
        .then((data) => {
          const time = new Date(data.datetime).getTime();
          const offset = time - new Date().getTime();
          setTimeOffset(offset);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch {
      setTimeOffset(0);
    }
  }, []);

  /**
   * Obtains the current time that is synced with other devices.
   * Offset obtained via this free api: https://worldtimeapi.org/api/timezone/Asia/Singapore
   *
   * @returns Corrected current timing.
   */
  function getCurrentTime() {
    return new Date().getTime() + timeOffset;
  }

  return (
    <group>
      {objects.map((item) => item.getComponent(playArea.getCameraPosition))}
    </group>
  );
}
