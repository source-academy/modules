import { type SpringValue, animated } from '@react-spring/three';
import { type InterfaceModel } from '../Behaviour';
import {
  useEffect,
  type MutableRefObject,
  useState,
  type ReactNode,
} from 'react';
import { type UIBasicComponent } from '../ui_component/UIComponent';
import UIRowComponent, {
  VerticalAlignment,
} from '../ui_component/UIRowComponent';
import UIColumnComponent, {
  HorizontalAlignment,
} from '../ui_component/UIColumnComponent';
import UITextComponent from '../ui_component/UITextComponent';
import { Vector3 } from 'three';
import UIImageComponent from '../ui_component/UIImageComponent';
import UIBase64ImageComponent from '../ui_component/UIBase64ImageComponent';

type InterfaceProps = {
  interfaceModel: InterfaceModel;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
};

export default function InterfaceComponent(props: InterfaceProps) {
  const [components, setComponents] = useState<ReactNode>();

  useEffect(() => {
    let parsedJson = parseJsonInterface(props.interfaceModel.uiJson);
    setComponents(parsedJson?.getComponent(new Vector3(0), () => {}));
  }, [props.interfaceModel.uiJson]);

  return (
    <animated.mesh ref={props.meshRef} position={props.springPosition}>
      {components}
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
    typeof id !== 'string' ||
    typeof paddingLeft !== 'number' ||
    typeof paddingRight !== 'number' ||
    typeof paddingTop !== 'number' ||
    typeof paddingBottom !== 'number'
  ) {
    return undefined;
  }
  switch (componentType) {
    case 'UIColumnComponent': {
      return parseColumn(
        uiJson,
        id,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
      );
    }
    case 'UIRowComponent': {
      return parseRow(
        uiJson,
        id,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
      );
    }
    case 'UITextComponent': {
      return parseText(
        uiJson,
        id,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
      );
    }
    case 'UIImageComponent': {
      return parseImage(
        uiJson,
        id,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
      );
    }
    case 'UIBase64ImageComponent': {
      return parseBase64Image(
        uiJson,
        id,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
      );
    }
  }
  return undefined;
}

function parseColumn(
  uiJson: any,
  id: string,
  paddingLeft: number | undefined,
  paddingRight: number | undefined,
  paddingTop: number | undefined,
  paddingBottom: number | undefined,
) {
  let horizontalAlignmentIndex = uiJson.horizontalAlignment;
  let horizontalAlignment = HorizontalAlignment.Left;
  if (typeof horizontalAlignmentIndex === 'number') {
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
  let backgroundColor = uiJson.background;
  if (typeof backgroundColor !== 'number') {
    backgroundColor = undefined;
  }
  return new UIColumnComponent({
    children,
    horizontalAlignment,
    padding: {
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    },
    backgroundColor,
    id,
  });
}

function parseRow(
  uiJson: any,
  id: string,
  paddingLeft: number | undefined,
  paddingRight: number | undefined,
  paddingTop: number | undefined,
  paddingBottom: number | undefined,
) {
  let verticalAlignmentIndex = uiJson.verticalAlignment;
  let verticalAlignment = VerticalAlignment.Top;
  if (typeof verticalAlignmentIndex === 'number') {
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
  let backgroundColor = uiJson.background;
  if (typeof backgroundColor !== 'number') {
    backgroundColor = undefined;
  }
  return new UIRowComponent({
    children,
    verticalAlignment,
    padding: {
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    },
    backgroundColor,
    id,
  });
}

function parseText(
  uiJson: any,
  id: string,
  paddingLeft: number | undefined,
  paddingRight: number | undefined,
  paddingTop: number | undefined,
  paddingBottom: number | undefined,
) {
  let text = uiJson.text;
  let textSize = uiJson.textSize;
  let textWidth = uiJson.textWidth;
  let textAlign = uiJson.textAlign;
  let color = uiJson.color;
  if (
    typeof text === 'string' &&
    typeof textSize === 'number' &&
    typeof textWidth === 'number' &&
    typeof color === 'number'
  ) {
    return new UITextComponent({
      text,
      textSize,
      textWidth,
      textAlign,
      color,
      padding: {
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
      },
      id,
    });
  }
  return undefined;
}

function parseImage(
  uiJson: any,
  id: string,
  paddingLeft: number | undefined,
  paddingRight: number | undefined,
  paddingTop: number | undefined,
  paddingBottom: number | undefined,
) {
  let src = uiJson.src;
  let imageWidth = uiJson.imageWidth;
  let imageHeight = uiJson.imageHeight;
  if (
    typeof src === 'string' &&
    typeof imageWidth === 'number' &&
    typeof imageHeight === 'number'
  ) {
    return new UIImageComponent({
      src,
      imageWidth,
      imageHeight,
      padding: {
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
      },
      id,
    });
  }
  return undefined;
}

function parseBase64Image(
  uiJson: any,
  id: string,
  paddingLeft: number | undefined,
  paddingRight: number | undefined,
  paddingTop: number | undefined,
  paddingBottom: number | undefined,
) {
  let base64 = uiJson.base64;
  let imageWidth = uiJson.imageWidth;
  let imageHeight = uiJson.imageHeight;
  if (
    typeof base64 === 'string' &&
    typeof imageWidth === 'number' &&
    typeof imageHeight === 'number'
  ) {
    return new UIBase64ImageComponent({
      base64,
      imageWidth,
      imageHeight,
      padding: {
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
      },
      id,
    });
  }
  return undefined;
}
