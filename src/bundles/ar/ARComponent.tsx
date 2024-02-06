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
import { ARState } from "./AR";
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
    <div>
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
    <div>
      <button
        id="left-toggle"
        style={{
          display: "none",
          position: "absolute",
          bottom: 30,
          left: 20,
          background: "#fafafa",
          color: "#212121",
          borderRadius: 30,
          padding: "15px 30px",
        }}
      />
      <button
        id="centre-toggle"
        style={{
          display: "none",
          position: "absolute",
          bottom: 30,
          background: "#fafafa",
          color: "#212121",
          borderRadius: 30,
          padding: "15px 30px",
        }}
      />
      <button
        id="right-toggle"
        style={{
          display: "none",
          position: "absolute",
          bottom: 30,
          right: 20,
          background: "#fafafa",
          color: "#212121",
          borderRadius: 30,
          padding: "15px 30px",
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
  }, []);

  useEffect(() => {
    setupToggles(props.overlay, screenState.overlayRef);
  }, [
    props.overlay.toggleCentre,
    props.overlay.toggleLeft,
    props.overlay.toggleRight,
  ]);

  useEffect(() => {
    console.log("Updated");
    let newObjects: ARObject[] = [];
    props.arObjects.forEach((object) => {
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
  }, [props, props.arObjects]);

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
  // Centre
  let centreToggle = overlay?.querySelector("#centre-toggle") as HTMLElement;
  if (centreToggle) {
    if (overlayHelper.toggleCentre) {
      centreToggle.style.display = "block";
      centreToggle.textContent = overlayHelper.toggleCentre.text;
      centreToggle.onclick = () => {
        overlayHelper.toggleCentre?.callback();
      };
    } else {
      centreToggle.style.display = "none";
      centreToggle.textContent = "";
      centreToggle.onclick = () => {};
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
