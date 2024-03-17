import { type SpringValue, animated } from '@react-spring/three';
import { type InterfaceModel } from '../Behaviour';
import {
  useEffect,
  type MutableRefObject,
  useState,
  type ReactNode,
} from 'react';
import { Outline } from '../Outline';
import { Vector3 } from 'three';
import UIColumnItem from '../ui_component/UIColumnItem';
import UIRowItem from '../ui_component/UIRowItem';
import UITextItem from '../ui_component/UITextItem';
import UIImageItem from '../ui_component/UIImageItem';
import UIBase64ImageItem from '../ui_component/UIBase64ImageItem';
import type { UIBasicItem } from '../ui_component/UIItem';

type InterfaceProps = {
  interfaceModel: InterfaceModel;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
  isSelected: boolean;
  isInFront: boolean;
};

/**
 * Component for showing floating UI.
 */
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
        <Outline isSelected={props.isSelected} isInFront={props.isInFront} />
        <boxGeometry args={[width + 0.01, height + 0.01, 0]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      {components}
    </animated.mesh>
  );
}

/**
 * Parses the json of an interface back to the original classes.
 * Used for restoring the UI after json conversion.
 *
 * @param uiJson Json of the UI to show
 */
export function parseJsonInterface(uiJson: any) {
  if (!uiJson) {
    return undefined;
  }
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
  const columnItem = UIColumnItem.parseJson(
    uiJson,
    id,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    parseJsonInterface,
  );
  if (columnItem) {
    return columnItem as UIBasicItem;
  }
  const rowItem = UIRowItem.parseJson(
    uiJson,
    id,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    parseJsonInterface,
  );
  if (rowItem) {
    return rowItem as UIBasicItem;
  }
  const textItem = UITextItem.parseJson(
    uiJson,
    id,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
  );
  if (textItem) {
    return textItem as UIBasicItem;
  }
  const imageItem = UIImageItem.parseJson(
    uiJson,
    id,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
  );
  if (imageItem) {
    return imageItem as UIBasicItem;
  }
  const base64ImageItem = UIBase64ImageItem.parseJson(
    uiJson,
    id,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
  );
  if (base64ImageItem) {
    return base64ImageItem as UIBasicItem;
  }
  return undefined;
}
