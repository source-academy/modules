import { type ReactNode, useState } from 'react';
import { type UIBasicItem, UILayoutItem, type PaddingType } from './UIItem';
import { Color, Vector3 } from 'three';

export enum HorizontalAlignment {
  Left,
  Center,
  Right,
}

type UIColumnProps = {
  children?: UIBasicItem[];
  horizontalAlignment?: HorizontalAlignment;
  padding?: number | PaddingType;
  backgroundColor?: number;
  id?: string;
};

const COLUMN_UI_TYPE = 'UIColumnItem';

/**
 * Column layout subcomponent for InterfaceComponent.
 */
export default class UIColumnItem extends UILayoutItem {
  horizontalAlignment: HorizontalAlignment;
  background: number;
  constructor(props: UIColumnProps) {
    super(COLUMN_UI_TYPE, props.padding, props.id);
    this.background = props.backgroundColor ?? 0xffffff;
    if (props.children) {
      this.children = props.children;
    }
    if (props.horizontalAlignment !== undefined) {
      this.horizontalAlignment = props.horizontalAlignment;
    } else {
      this.horizontalAlignment = HorizontalAlignment.Center;
    }
    this.calculateLayer();
  }
  getWidth = () => {
    const width = this.paddingLeft + this.paddingRight;
    let maxChildWidth = 0;
    this.children.forEach((item) => {
      item.calculateLayer();
      maxChildWidth = Math.max(maxChildWidth, item.getWidth());
    });
    return width + maxChildWidth;
  };
  getHeight = () => {
    let height = this.paddingTop + this.paddingBottom;
    this.children.forEach((item) => {
      item.calculateLayer();
      height += item.getHeight();
    });
    return height;
  };
  static parseJson(
    uiJson: any,
    id: string,
    paddingLeft: number | undefined,
    paddingRight: number | undefined,
    paddingTop: number | undefined,
    paddingBottom: number | undefined,
    parseJsonInterface: (uiJson: any) => UIBasicItem | undefined,
  ) {
    if (!uiJson || uiJson.type !== COLUMN_UI_TYPE) return undefined;
    const horizontalAlignmentIndex = uiJson.horizontalAlignment;
    let horizontalAlignment = HorizontalAlignment.Left;
    if (typeof horizontalAlignmentIndex === 'number') {
      const parsedIndex = Math.min(Math.max(0, horizontalAlignmentIndex), 2);
      horizontalAlignment = parsedIndex;
    }
    const children: UIBasicItem[] = [];
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
    return new UIColumnItem({
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

  getComponent = (position: Vector3, updateParent: () => void) => (
    <Component
      key={this.id}
      component={this}
      position={position}
      updateParent={updateParent}
    />
  );
}

function Component(props: {
  component: UIColumnItem;
  position: Vector3;
  updateParent: () => void;
}) {
  const { component, position, updateParent } = props;

  const [width, setWidth] = useState(component.getWidth());
  const [height, setHeight] = useState(component.getHeight());
  const [componentPositions, setComponentPositions] = useState<Vector3[]>([]);

  /**
   * Updates the height and width, to adapt to children size.
   * Need to realign children items after updating.
   */
  function updateSize() {
    const previousHeight = height;
    const previousWidth = width;
    const newHeight = component.getHeight();
    const newWidth = component.getWidth();
    setHeight(newHeight);
    setWidth(newWidth);
    updateChildrenAlignment();
    if (previousHeight !== newHeight || previousWidth !== newWidth) {
      updateParent();
    }
  }

  /**
   * Realign children items depending on the specified alignment.
   */
  function updateChildrenAlignment() {
    const positions: Vector3[] = [];
    const componentHeight = component.getHeight();
    const componentWidth = component.getWidth();
    let currentYPosition = -componentHeight / 2 + component.paddingTop;
    for (let i = 0; i < component.children.length; i++) {
      const child = component.children[i];
      const childHeight = child.getHeight();
      const childWidth = child.getWidth();
      const relativeYPosition =
        currentYPosition +
        childHeight / 2 +
        (child.paddingTop - child.paddingBottom) / 2;
      currentYPosition += childHeight;
      let relativeXPosition = (child.paddingLeft - child.paddingRight) / 2;
      if (component.horizontalAlignment === HorizontalAlignment.Left) {
        relativeXPosition +=
          -(componentWidth - childWidth) / 2 + component.paddingLeft;
      } else if (component.horizontalAlignment === HorizontalAlignment.Right) {
        relativeXPosition +=
          (componentWidth - childWidth) / 2 - component.paddingRight;
      }
      const childPosition = new Vector3(
        relativeXPosition,
        -relativeYPosition,
        0,
      );
      positions.push(childPosition);
    }
    setComponentPositions(positions);
  }

  function ChildrenComponents(childProps: { componentPositions: Vector3[] }) {
    if (childProps.componentPositions.length !== component.children.length) {
      updateChildrenAlignment();
      return null;
    }
    let children: ReactNode[] = [];
    for (let i = 0; i < component.children.length; i++) {
      const child = component.children[i];
      const childPosition = childProps.componentPositions[i];
      children.push(
        <group key={`component_${component.id}child_${i}`}>
          {child.getComponent(childPosition, updateSize)}
        </group>,
      );
    }
    return <group key={`children_${component.id}`}>{children}</group>;
  }

  return (
    <mesh key={`component_${component.id}`} position={position}>
      <mesh position={new Vector3(0, 0, -component.layer / 1000)}>
        <boxGeometry args={[width, height, 0]} />
        <meshBasicMaterial color={new Color(component.background)} />
      </mesh>
      <ChildrenComponents componentPositions={componentPositions} />
    </mesh>
  );
}
