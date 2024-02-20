import { type ReactNode, useState } from 'react';
import {
  UIBasicComponent,
  LayoutComponent,
  type PaddingType,
} from './UIComponent';
import { Color, Vector3 } from 'three';

type UIRowProps = {
  children?: UIBasicComponent[];
  verticalAlignment?: VerticalAlignment;
  padding?: number | PaddingType;
  background?: number;
  id?: string;
};

export default class UIRowComponent extends LayoutComponent {
  verticalAlignment: VerticalAlignment;
  background: number;
  constructor(props: UIRowProps) {
    super(props.padding, props.id);
    this.background = props.background ?? 0xffffff;
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
    let height = this.paddingTop + this.paddingBottom;
    let maxChildHeight = 0;
    this.children.forEach((item) => {
      item.calculateDimensions();
      maxChildHeight = Math.max(maxChildHeight, item.height);
    });
    return height + maxChildHeight;
  };
  getComponent = (position: Vector3, updateParent: () => void) => {
    return (
      <RowUIComponent
        key={this.id}
        component={this}
        position={position}
        updateParent={updateParent}
      />
    );
  };
}

function RowUIComponent(props: {
  component: UIRowComponent;
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
    let currentXPosition = -component.width / 2 + component.paddingLeft;
    for (let i = 0; i < component.children.length; i++) {
      let child = component.children[i];
      let relativeXPosition = currentXPosition + child.width / 2;
      currentXPosition += child.width;
      let relativeYPosition = 0;
      if (component.verticalAlignment === VerticalAlignment.Top) {
        relativeYPosition =
          (component.height - child.height) / 2 - component.paddingTop;
      } else if (component.verticalAlignment === VerticalAlignment.Bottom) {
        relativeYPosition =
          -(component.height - child.height) / 2 + component.paddingBottom;
      }
      let childPosition = new Vector3(relativeXPosition, relativeYPosition, 0);
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

export enum VerticalAlignment {
  Top,
  Middle,
  Bottom,
}
