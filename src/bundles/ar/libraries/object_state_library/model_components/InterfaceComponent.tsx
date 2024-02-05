import { SpringValue, animated } from "@react-spring/three";
import { InterfaceModel as InterfaceModel } from "../Behaviour";
import { type MutableRefObject } from "react";
import { UIBasicComponent } from "../ui_component/UIComponent";
import UIRowComponent, {
  VerticalAlignment,
} from "../ui_component/UIRowComponent";
import UIColumnComponent, {
  HorizontalAlignment,
} from "../ui_component/UIColumnComponent";
import UITextComponent from "../ui_component/UITextComponent";
import { Color, Vector3 } from "three";
import UIImageComponent from "../ui_component/UIImageComponent";

type InterfaceProps = {
  interfaceModel: InterfaceModel;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
};

export default function InterfaceComponent(props: InterfaceProps) {
  return (
    <animated.mesh ref={props.meshRef} position={props.springPosition}>
      {parseJsonInterface(props.interfaceModel.uiJson)?.getComponent(
        new Vector3(0),
        () => {}
      )}
    </animated.mesh>
  );
}

export function parseJsonInterface(uiJson: any) {
  if (!uiJson) {
    return undefined;
  }
  let componentType = uiJson.type as string;
  let id = uiJson.id;
  let paddingLeft = uiJson.paddingLeft;
  let paddingRight = uiJson.paddingRight;
  let paddingTop = uiJson.paddingTop;
  let paddingBottom = uiJson.paddingBottom;
  if (
    typeof id !== "string" ||
    typeof paddingLeft !== "number" ||
    typeof paddingRight !== "number" ||
    typeof paddingTop !== "number" ||
    typeof paddingBottom !== "number"
  ) {
    return;
  }
  switch (componentType) {
    case "UIColumnComponent": {
      let horizontalAlignmentIndex = uiJson.horizontalAlignment;
      let horizontalAlignment = HorizontalAlignment.Left;
      if (typeof horizontalAlignmentIndex === "number") {
        let parsedIndex = Math.min(Math.max(0, horizontalAlignmentIndex), 2);
        horizontalAlignment = parsedIndex;
      }
      let children: UIBasicComponent[] = [];
      let jsonChildren = uiJson.children;
      if (Array.isArray(jsonChildren)) {
        jsonChildren.forEach((jsonChild) => {
          let child = parseJsonInterface(jsonChild);
          if (child) {
            children.push(child);
          }
        });
      }
      let background = uiJson.background;
      if (typeof background != "number") {
        background = undefined;
      }
      return new UIColumnComponent({
        horizontalAlignment: horizontalAlignment,
        padding: {
          paddingLeft: paddingLeft,
          paddingRight: paddingRight,
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
        },
        children: children,
        background: background,
        id: id,
      });
    }
    case "UIRowComponent": {
      let verticalAlignmentIndex = uiJson.verticalAlignment;
      let verticalAlignment = VerticalAlignment.Top;
      if (typeof verticalAlignmentIndex === "number") {
        let parsedIndex = Math.min(Math.max(0, verticalAlignmentIndex), 2);
        verticalAlignment = parsedIndex;
      }
      let children: UIBasicComponent[] = [];
      let jsonChildren = uiJson.children;
      if (Array.isArray(jsonChildren)) {
        jsonChildren.forEach((jsonChild) => {
          let child = parseJsonInterface(jsonChild);
          if (child) {
            children.push(child);
          }
        });
      }
      let background = uiJson.background;
      if (typeof background != "number") {
        background = undefined;
      }
      return new UIRowComponent({
        verticalAlignment: verticalAlignment,
        padding: {
          paddingLeft: paddingLeft,
          paddingRight: paddingRight,
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
        },
        children: children,
        background: background,
        id: id,
      });
    }
    case "UITextComponent": {
      let text = uiJson.text;
      let textSize = uiJson.textSize;
      let textWidth = uiJson.textWidth;
      let textAlign = uiJson.textAlign;
      let color = uiJson.color;
      if (
        typeof text === "string" &&
        typeof textSize === "number" &&
        typeof textWidth === "number" &&
        typeof color === "number"
      ) {
        return new UITextComponent({
          text: text,
          textSize: textSize,
          textWidth: textWidth,
          textAlign: textAlign,
          color: new Color(color),
          padding: {
            paddingLeft: paddingLeft,
            paddingRight: paddingRight,
            paddingTop: paddingTop,
            paddingBottom: paddingBottom,
          },
          id: id,
        });
      }
      break;
    }
    case "UIImageComponent": {
      let src = uiJson.src;
      let imageWidth = uiJson.imageWidth;
      let imageHeight = uiJson.imageHeight;
      if (
        typeof src === "string" &&
        typeof imageWidth === "number" &&
        typeof imageHeight === "number"
      ) {
        return new UIImageComponent({
          src: src,
          imageWidth: imageWidth,
          imageHeight: imageHeight,
          padding: {
            paddingLeft: paddingLeft,
            paddingRight: paddingRight,
            paddingTop: paddingTop,
            paddingBottom: paddingBottom,
          },
          id: id,
        });
      }
      break;
    }
  }
  return undefined;
}

