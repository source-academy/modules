import { type ReactNode, useState } from 'react';
import { type UIBasicItem, UILayoutItem, type PaddingType } from './UIItem';
import { Color, Vector3 } from 'three';

export enum VerticalAlignment {
  Top,
  Middle,
  Bottom,
}

type UIRowProps = {
  children?: UIBasicItem[];
  verticalAlignment?: VerticalAlignment;
  padding?: number | PaddingType;
  backgroundColor?: number;
  id?: string;
};

const ROW_UI_TYPE = 'UIRowItem';

/**
 * Row layout subcomponent for InterfaceComponent.
 */
export default class UIRowItem extends UILayoutItem {
  verticalAlignment: VerticalAlignment;
  background: number;
  constructor(props: UIRowProps) {
    super(ROW_UI_TYPE, props.padding, props.id);
    this.background = props.backgroundColor ?? 0xffffff;
    if (props.children) {
      this.children = props.children;
    }
    if (props.verticalAlignment !== undefined) {
      this.verticalAlignment = props.verticalAlignment;
    } else {
      this.verticalAlignment = VerticalAlignment.Middle;
    }
    this.calculateLayer();
  }
  getWidth = () => {
    let width = this.paddingLeft + this.paddingRight;
    this.children.forEach((item) => {
      item.calculateLayer();
      width += item.getWidth();
    });
    return width;
  };
  getHeight = () => {
    const height = this.paddingTop + this.paddingBottom;
    let maxChildHeight = 0;
    this.children.forEach((item) => {
      item.calculateLayer();
      maxChildHeight = Math.max(maxChildHeight, item.getHeight());
    });
    return height + maxChildHeight;
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
    if (!uiJson || uiJson.type !== ROW_UI_TYPE) return undefined;
    const verticalAlignmentIndex = uiJson.verticalAlignment;
    let verticalAlignment = VerticalAlignment.Top;
    if (typeof verticalAlignmentIndex === 'number') {
      const parsedIndex = Math.min(Math.max(0, verticalAlignmentIndex), 2);
      verticalAlignment = parsedIndex;
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
    return new UIRowItem({
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
  component: UIRowItem;
  position: Vector3;
  updateParent: () => void;
}) {
  const { component, position, updateParent } = props;

  const [width, setWidth] = useState(component.getWidth());
  const [height, setHeight] = useState(component.getHeight());
  const [componentPositions, setComponentPositions] = useState<Vector3[]>([]);

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

  function updateChildrenAlignment() {
    const positions: Vector3[] = [];
    const componentHeight = component.getHeight();
    const componentWidth = component.getWidth();
    let currentXPosition = -componentWidth / 2 + component.paddingLeft;
    for (let i = 0; i < component.children.length; i++) {
      const child = component.children[i];
      const childHeight = child.getHeight();
      const childWidth = child.getWidth();
      const relativeXPosition =
        currentXPosition +
        childWidth / 2 +
        (child.paddingLeft - child.paddingRight) / 2;
      currentXPosition += childWidth;
      let relativeYPosition = -(child.paddingTop - child.paddingBottom) / 2;
      if (component.verticalAlignment === VerticalAlignment.Top) {
        relativeYPosition +=
          (componentHeight - childHeight) / 2 - component.paddingTop;
      } else if (component.verticalAlignment === VerticalAlignment.Bottom) {
        relativeYPosition +=
          -(componentHeight - childHeight) / 2 - component.paddingBottom;
      }
      const childPosition = new Vector3(
        relativeXPosition,
        relativeYPosition,
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
    const children: ReactNode[] = [];
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
