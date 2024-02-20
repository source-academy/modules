import { type ReactNode, useState } from 'react';
import {
  UIBasicComponent,
  LayoutComponent,
  type PaddingType,
} from './UIComponent';
import { Color, Vector3 } from 'three';

type UIColumnProps = {
  children?: UIBasicComponent[];
  horizontalAlignment?: HorizontalAlignment;
  padding?: number | PaddingType;
  background?: number;
  id?: string;
};

export default class UIColumnComponent extends LayoutComponent {
  horizontalAlignment: HorizontalAlignment;
  background: number;
  constructor(props: UIColumnProps) {
    super(props.padding, props.id);
    this.background = props.background ?? 0xffffff;
    if (props.children) {
      this.children = props.children;
    }
    if (props.horizontalAlignment !== undefined) {
      this.horizontalAlignment = props.horizontalAlignment;
    } else {
      this.horizontalAlignment = HorizontalAlignment.Center;
    }
    this.calculateDimensions();
  }
  getWidth = () => {
    let width = this.paddingLeft + this.paddingRight;
    let maxChildWidth = 0;
    this.children.forEach((item) => {
      item.calculateDimensions();
      maxChildWidth = Math.max(maxChildWidth, item.width);
    });
    return width + maxChildWidth;
  };
  getHeight = () => {
    let height = this.paddingTop + this.paddingBottom;
    this.children.forEach((item) => {
      item.calculateDimensions();
      height += item.height;
    });
    return height;
  };
  getComponent = (position: Vector3, updateParent: () => void) => {
    return (
      <ColumnUIComponent
        key={this.id}
        component={this}
        position={position}
        updateParent={updateParent}
      />
    );
  };
}

function ColumnUIComponent(props: {
  component: UIColumnComponent;
  position: Vector3;
  updateParent: () => void;
}) {
  let { component, position, updateParent } = props;

  const [width, setWidth] = useState(component.width);
  const [height, setHeight] = useState(component.height);
  const [componentPositions, setComponentPositions] = useState<Vector3[]>([]);

  function updateSize() {
    let previousHeight = height;
    let previousWidth = width;
    setHeight(component.height);
    setWidth(component.width);
    updateChildrenAlignment();
    if (
      previousHeight != component.height ||
      previousWidth != component.width
    ) {
      updateParent();
    }
  }

  function updateChildrenAlignment() {
    let positions: Vector3[] = [];
    let currentYPosition = -component.height / 2 + component.paddingTop;
    for (let i = 0; i < component.children.length; i++) {
      let child = component.children[i];
      let relativeYPosition = currentYPosition + child.height / 2;
      currentYPosition += child.height;
      let relativeXPosition = 0;
      if (component.horizontalAlignment === HorizontalAlignment.Left) {
        relativeXPosition =
          -(component.width - child.width) / 2 + component.paddingLeft;
      } else if (component.horizontalAlignment === HorizontalAlignment.Right) {
        relativeXPosition =
          (component.width - child.width) / 2 - component.paddingRight;
      }
      let childPosition = new Vector3(relativeXPosition, -relativeYPosition, 0);
      positions.push(childPosition);
    }
    setComponentPositions(positions);
  }

  function ChildrenComponents(props: { componentPositions: Vector3[] }) {
    if (props.componentPositions.length !== component.children.length) {
      updateChildrenAlignment();
      return null;
    }
    let children: ReactNode[] = [];
    for (let i = 0; i < component.children.length; i++) {
      let child = component.children[i];
      let childPosition = props.componentPositions[i];
      children.push(
        <group key={'component_' + component.id + 'child_' + i}>
          {child.getComponent(childPosition, updateSize)}
        </group>
      );
    }
    return <group key={'children_' + component.id}>{children}</group>;
  }

  return (
    <mesh key={'component_' + component.id} position={position}>
      <ambientLight intensity={5} />
      <mesh position={new Vector3(0, 0, -component.layer / 1000)}>
        <boxGeometry args={[width, height, 0]} />
        <meshStandardMaterial color={new Color(component.background)} />
      </mesh>
      <ChildrenComponents componentPositions={componentPositions} />
    </mesh>
  );
}

export enum HorizontalAlignment {
  Left,
  Center,
  Right,
}
