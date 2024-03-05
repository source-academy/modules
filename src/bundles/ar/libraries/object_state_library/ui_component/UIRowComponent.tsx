import { type ReactNode, useState } from 'react';
import {
  type UIBasicComponent,
  LayoutComponent,
  type PaddingType,
} from './UIComponent';
import { Color, Vector3 } from 'three';

export enum VerticalAlignment {
  Top,
  Middle,
  Bottom,
}

type UIRowProps = {
  children?: UIBasicComponent[];
  verticalAlignment?: VerticalAlignment;
  padding?: number | PaddingType;
  backgroundColor?: number;
  id?: string;
};

export default class UIRowComponent extends LayoutComponent {
  verticalAlignment: VerticalAlignment;
  background: number;
  constructor(props: UIRowProps) {
    super(props.padding, props.id);
    this.background = props.backgroundColor ?? 0xffffff;
    if (props.children) {
      this.children = props.children;
    }
    if (props.verticalAlignment !== undefined) {
      this.verticalAlignment = props.verticalAlignment;
    } else {
      this.verticalAlignment = VerticalAlignment.Middle;
    }
    this.calculateDimensions();
  }
  getWidth = () => {
    let width = this.paddingLeft + this.paddingRight;
    this.children.forEach((item) => {
      item.calculateDimensions();
      width += item.width;
    });
    return width;
  };
  getHeight = () => {
    const height = this.paddingTop + this.paddingBottom;
    let maxChildHeight = 0;
    this.children.forEach((item) => {
      item.calculateDimensions();
      maxChildHeight = Math.max(maxChildHeight, item.height);
    });
    return height + maxChildHeight;
  };
  getComponent = (position: Vector3, updateParent: () => void) => (
    <RowUIComponent
      key={this.id}
      component={this}
      position={position}
      updateParent={updateParent}
    />
  );
}

function RowUIComponent(props: {
  component: UIRowComponent;
  position: Vector3;
  updateParent: () => void;
}) {
  const { component, position, updateParent } = props;

  const [width, setWidth] = useState(component.width);
  const [height, setHeight] = useState(component.height);
  const [componentPositions, setComponentPositions] = useState<Vector3[]>([]);

  function updateSize() {
    const previousHeight = height;
    const previousWidth = width;
    setHeight(component.height);
    setWidth(component.width);
    updateChildrenAlignment();
    if (
      previousHeight !== component.height ||
      previousWidth !== component.width
    ) {
      updateParent();
    }
  }

  function updateChildrenAlignment() {
    const positions: Vector3[] = [];
    let currentXPosition = -component.width / 2 + component.paddingLeft;
    for (let i = 0; i < component.children.length; i++) {
      const child = component.children[i];
      const relativeXPosition =
        currentXPosition +
        child.width / 2 +
        (child.paddingLeft - child.paddingRight) / 2;
      currentXPosition += child.width;
      let relativeYPosition = -(child.paddingTop - child.paddingBottom) / 2;
      if (component.verticalAlignment === VerticalAlignment.Top) {
        relativeYPosition +=
          (component.height - child.height) / 2 - component.paddingTop;
      } else if (component.verticalAlignment === VerticalAlignment.Bottom) {
        relativeYPosition +=
          -(component.height - child.height) / 2 - component.paddingBottom;
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
      <ambientLight intensity={0.1} />
      <mesh position={new Vector3(0, 0, -component.layer / 1000)}>
        <boxGeometry args={[width, height, 0]} />
        <meshStandardMaterial color={new Color(component.background)} />
      </mesh>
      <ChildrenComponents componentPositions={componentPositions} />
    </mesh>
  );
}
