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
import { Color, Vector3 } from 'three';
import UIImageComponent from '../ui_component/UIImageComponent';
import UIBase64ImageComponent from '../ui_component/UIBase64ImageComponent';
import { Outlines } from '@react-three/drei';

type InterfaceProps = {
  interfaceModel: InterfaceModel;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
  isHighlighted: boolean;
};

export default function InterfaceComponent(props: InterfaceProps) {
  const [components, setComponents] = useState<ReactNode>();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setComponents(
      props.interfaceModel.rootComponent?.getComponent(new Vector3(0), () => {
        setWidth(props.interfaceModel.rootComponent?.getWidth() ?? 0);
        setHeight(props.interfaceModel.rootComponent?.getHeight() ?? 0);
      }),
    );
  }, [props.interfaceModel.rootComponent]);

  return (
    <animated.mesh ref={props.meshRef} position={props.springPosition}>
      <mesh position={new Vector3(0, 0, -1 / 1000)}>
        <Outlines
          visible={props.isHighlighted}
          thickness={10}
          color={new Color(0xffa500)}
          screenspace={true}
          opacity={1}
          transparent={false}
          angle={0}
        />
        <boxGeometry args={[width + 0.01, height + 0.01, 0]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      {components}
    </animated.mesh>
  );
}

export function parseJsonInterface(uiJson: any) {
  if (!uiJson) {
    return undefined;
  }
  const componentType = uiJson.type as string;
  const id = uiJson.id;
  const paddingLeft = uiJson.paddingLeft;
  const paddingRight = uiJson.paddingRight;
  const paddingTop = uiJson.paddingTop;
  const paddingBottom = uiJson.paddingBottom;
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
  const horizontalAlignmentIndex = uiJson.horizontalAlignment;
  let horizontalAlignment = HorizontalAlignment.Left;
  if (typeof horizontalAlignmentIndex === 'number') {
    const parsedIndex = Math.min(Math.max(0, horizontalAlignmentIndex), 2);
    horizontalAlignment = parsedIndex;
  }
  const children: UIBasicComponent[] = [];
  const jsonChildren = uiJson.children;
  if (Array.isArray(jsonChildren)) {
    jsonChildren.forEach((jsonChild) => {
      const child = parseJsonInterface(jsonChild);
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
  const verticalAlignmentIndex = uiJson.verticalAlignment;
  let verticalAlignment = VerticalAlignment.Top;
  if (typeof verticalAlignmentIndex === 'number') {
    const parsedIndex = Math.min(Math.max(0, verticalAlignmentIndex), 2);
    verticalAlignment = parsedIndex;
  }
  const children: UIBasicComponent[] = [];
  const jsonChildren = uiJson.children;
  if (Array.isArray(jsonChildren)) {
    jsonChildren.forEach((jsonChild) => {
      const child = parseJsonInterface(jsonChild);
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
  const text = uiJson.text;
  const textSize = uiJson.textSize;
  const textWidth = uiJson.textWidth;
  const textAlign = uiJson.textAlign;
  const color = uiJson.color;
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
  const src = uiJson.src;
  const imageWidth = uiJson.imageWidth;
  const imageHeight = uiJson.imageHeight;
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
  const base64 = uiJson.base64;
  const imageWidth = uiJson.imageWidth;
  const imageHeight = uiJson.imageHeight;
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
