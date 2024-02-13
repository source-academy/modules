import { ARButton } from "@react-three/xr";
import {
  ScreenStateContext,
  useScreenState,
} from "./libraries/screen_state_library/ScreenStateContext";
import { type RefObject, useEffect, useState } from "react";
import {
  PlayAreaContext,
  usePlayArea,
} from "./libraries/calibration_library/PlayAreaContext";
import {
  ControlsContext,
  useControls,
} from "./libraries/controls_library/ControlsContext";
import { ARState, getModuleState } from "./AR";
import { OverlayHelper } from "./OverlayHelper";
import {
  CubeObject,
  type ARObject,
  UIObject,
  LightObject,
} from "./libraries/object_state_library/ARObject";

export default function ARComponent(props: ARState) {
  return (
    <ScreenStateContext>
      <ButtonComponent {...props} />
    </ScreenStateContext>
  );
}

function ButtonComponent(props: ARState) {
  const screenState = useScreenState();

  useEffect(() => {
    screenState.setStates(<AugmentedLayer {...props} />, <Overlay />);
  }, []);

  return (
    <div style={{ height: "50vh" }}>
      <ARButton
        sessionInit={{
          requiredFeatures: ["hit-test"],
          optionalFeatures: ["dom-overlay"],
          domOverlay: screenState.domOverlay,
        }}
      />
      {screenState.component}
    </div>
  );
}

function Overlay() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "0px 20px 60px 20px",
      }}
    >
      <button
        id="left-toggle"
        style={{
          display: "none",
          width: 100,
          background: "#fafafa",
          color: "#212121",
          borderRadius: 30,
          padding: "15px",
        }}
      />
      <button
        id="center-toggle"
        style={{
          display: "none",
          width: 100,
          background: "#fafafa",
          color: "#212121",
          borderRadius: 30,
          padding: "15px",
        }}
      />
      <button
        id="right-toggle"
        style={{
          display: "none",
          width: 100,
          background: "#fafafa",
          color: "#212121",
          borderRadius: 30,
          padding: "15px",
        }}
      />
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

function AugmentedContent(props: ARState) {
  const screenState = useScreenState();
  const playArea = usePlayArea();
  const controls = useControls();
  const [objects, setObjects] = useState<ARObject[]>([]);

  useEffect(() => {
    controls.setCallback((prev, current) => {
      if (prev) {
        let object = objects.find((item) => {
          return item.uuid === prev.uuid;
        });
        if (object) {
          object.isHighlighted = false;
        }
      }
      if (current) {
        let object = objects.find((item) => {
          return item.uuid === current.uuid;
        });
        if (object) {
          object.isHighlighted = true;
        }
      }
    });
    (window as any).arControllerCallback = () => {
      let newState = getModuleState();
      updateObjects(newState);
    };
    updateObjects(props);
  }, []);

  useEffect(() => {
    setupToggles(props.overlay, screenState.overlayRef);
  }, [
    props.overlay.toggleCenter,
    props.overlay.toggleLeft,
    props.overlay.toggleRight,
  ]);

  function updateObjects(state: ARState) {
    let newObjects: ARObject[] = [];
    state.arObjects.forEach((object) => {
      if (!object) return;
      let newObject = CubeObject.parseObject(object);
      if (newObject) {
        newObjects.push(newObject);
        return;
      }
      newObject = UIObject.parseObject(object);
      if (newObject) {
        newObjects.push(newObject);
        return;
      }
      newObject = LightObject.parseObject(object);
      if (newObject) {
        newObjects.push(newObject);
        return;
      }
    });
    setObjects(newObjects);
  }

  return (
    <group>
      {objects.map((item) => {
        return item.getComponent(playArea.getCameraRelativePosition);
      })}
    </group>
  );
}

function setupToggles(
  overlayHelper: OverlayHelper,
  overlayRef: RefObject<HTMLDivElement> | null
) {
  if (!overlayRef || !overlayRef.current) return;
  let overlay = overlayRef.current;
  // Left
  let leftToggle = overlay?.querySelector("#left-toggle") as HTMLElement;
  if (leftToggle) {
    if (overlayHelper.toggleLeft) {
      leftToggle.style.display = "block";
      leftToggle.textContent = overlayHelper.toggleLeft.text;
      leftToggle.onclick = () => {
        overlayHelper.toggleLeft?.callback();
      };
    } else {
      leftToggle.style.display = "none";
      leftToggle.textContent = "";
      leftToggle.onclick = () => {};
    }
  }
  // Center
  let centerToggle = overlay?.querySelector("#center-toggle") as HTMLElement;
  if (centerToggle) {
    if (overlayHelper.toggleCenter) {
      centerToggle.style.display = "block";
      centerToggle.textContent = overlayHelper.toggleCenter.text;
      centerToggle.onclick = () => {
        overlayHelper.toggleCenter?.callback();
      };
    } else {
      centerToggle.style.display = "none";
      centerToggle.textContent = "";
      centerToggle.onclick = () => {};
    }
  }
  // Right
  let rightToggle = overlay?.querySelector("#right-toggle") as HTMLElement;
  if (rightToggle) {
    if (overlayHelper.toggleRight) {
      rightToggle.style.display = "block";
      rightToggle.textContent = overlayHelper.toggleRight.text;
      rightToggle.onclick = () => {
        overlayHelper.toggleRight?.callback();
      };
    } else {
      rightToggle.style.display = "none";
      rightToggle.textContent = "";
      rightToggle.onclick = () => {};
    }
  }
}
