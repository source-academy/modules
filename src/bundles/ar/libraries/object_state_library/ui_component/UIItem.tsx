import { type Vector3 } from 'three';
import uniqid from 'uniqid';

export type PaddingType = {
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
};

/**
 * Base class for a subcomponent in InterfaceComponent.
 */
export class UIBasicItem {
  type: string;
  paddingLeft = 0;
  paddingRight = 0;
  paddingTop = 0;
  paddingBottom = 0;
  id = '';
  layer = 1;
  parent?: UIBasicItem = undefined;
  constructor(type: string, padding?: number | PaddingType, id?: string) {
    this.type = type;
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
    delete object.layer;
    delete object.parent;
    return object;
  };
  getWidth = () => this.paddingLeft + this.paddingRight;
  getHeight = () => this.paddingTop + this.paddingBottom;
  calculateLayer = () => {};
  getComponent = (position: Vector3, _: () => void) => (
    <mesh key={`component_${this.id}`} position={position}></mesh>
  );
}

/**
 * Class for a layout subcomponent in InterfaceComponent.
 */
export class UILayoutItem extends UIBasicItem {
  children: UIBasicItem[] = [];
  calculateLayer = () => {
    this.layer = 1;
    this.children.forEach((child) => {
      if (child instanceof UILayoutItem && this.layer <= child.layer) {
        this.layer = child.layer + 1;
      }
    });
    this.children.forEach((child) => {
      child.parent = this;
    });
  };
}
