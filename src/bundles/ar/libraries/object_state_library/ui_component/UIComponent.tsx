import { useEffect } from 'react';
import { type Vector3 } from 'three';
import uniqid from 'uniqid';

type UIComponentProps = {
  position: Vector3;
  children: LayoutComponent;
};

export default function UIComponent(props: UIComponentProps) {
  useEffect(() => {
    props.children.calculateDimensions();
  }, [props.children]);
  return <mesh>{props.children.getComponent(props.position, () => {})}</mesh>;
}

export type PaddingType = {
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
};

export class UIBasicComponent {
  type: string;
  paddingLeft = 0;
  paddingRight = 0;
  paddingTop = 0;
  paddingBottom = 0;
  height = 0;
  width = 0;
  id = '';
  layer = 1;
  parent?: UIBasicComponent = undefined;
  constructor(padding?: number | PaddingType, id?: string) {
    this.type = this.constructor.name;
    if (padding) {
      if (typeof padding === 'number') {
        this.paddingLeft = padding;
        this.paddingRight = padding;
        this.paddingTop = padding;
        this.paddingBottom = padding;
      } else {
        if (padding.paddingLeft) {
          this.paddingLeft = padding.paddingLeft;
        }
        if (padding.paddingRight) {
          this.paddingRight = padding.paddingRight;
        }
        if (padding.paddingTop) {
          this.paddingTop = padding.paddingTop;
        }
        if (padding.paddingBottom) {
          this.paddingBottom = padding.paddingBottom;
        }
      }
    }
    if (id) {
      this.id = id;
    } else {
      this.id = uniqid();
    }
  }
  toJSON = () => {
    let object = { ...this } as any;
    delete object.height;
    delete object.width;
    delete object.layer;
    delete object.parent;
    return object;
  };
  calculateDimensions = () => {
    this.calculateLayer();
    const newHeight = this.getHeight();
    const newWidth = this.getWidth();
    if (this.height !== newHeight || this.width !== newWidth) {
      this.height = newHeight;
      this.width = newWidth;
      this.parent?.calculateDimensions();
    }
  };
  getWidth = () => this.paddingLeft + this.paddingRight;
  getHeight = () => this.paddingTop + this.paddingBottom;
  calculateLayer = () => {};
  getComponent = (position: Vector3, _: () => void) => (
    <mesh key={`component_${this.id}`} position={position}></mesh>
  );
}

export class LayoutComponent extends UIBasicComponent {
  children: UIBasicComponent[] = [];
  calculateLayer = () => {
    this.layer = 1;
    this.children.forEach((child) => {
      if (child instanceof LayoutComponent && this.layer <= child.layer) {
        this.layer = child.layer + 1;
      }
    });
    this.children.forEach((child) => {
      child.parent = this;
    });
  };
}
