import { Color, type Mesh, Vector3 } from 'three';
import { UIBasicItem, type PaddingType } from './UIItem';
import { Text as ThreeText } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { HorizontalAlignment } from './UIColumnItem';

type UITextProps = {
  text: string;
  textSize: number;
  textWidth: number;
  textAlign?: HorizontalAlignment;
  color?: number;
  padding?: number | PaddingType;
  id?: string;
};

const TEXT_UI_TYPE = 'UITextItem';

/**
 * Subcomponent for InterfaceComponent that can display text.
 */
export default class UITextItem extends UIBasicItem {
  text: string;
  textSize: number;
  textWidth: number;
  textHeight = 0;
  textAlign: HorizontalAlignment;
  color: number;
  constructor(props: UITextProps) {
    super(TEXT_UI_TYPE, props.padding, props.id);
    this.text = props.text;
    this.textSize = props.textSize;
    this.textWidth = props.textWidth;
    this.textAlign = props.textAlign ?? HorizontalAlignment.Left;
    this.color = props.color ?? 0;
  }
  getWidth = () => this.textWidth + this.paddingLeft + this.paddingRight;
  getHeight = () => this.textHeight + this.paddingTop + this.paddingBottom;
  updateHeight = (newTextHeight: number): boolean => {
    // Returns whether height changed
    const oldHeight = this.getHeight();
    this.textHeight = newTextHeight;
    const newHeight = this.getHeight();
    if (oldHeight !== newHeight) {
      return true;
    }
    return false;
  };
  static parseJson(
    uiJson: any,
    id: string,
    paddingLeft: number | undefined,
    paddingRight: number | undefined,
    paddingTop: number | undefined,
    paddingBottom: number | undefined,
  ) {
    if (!uiJson || uiJson.type !== TEXT_UI_TYPE) return undefined;
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
      return new UITextItem({
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
  component: UITextItem;
  position: Vector3;
  updateParent: () => void;
}) {
  let { component, position, updateParent } = props;

  const [offsetX, setOffsetX] = useState(0);
  const ref = useRef<Mesh>();

  useEffect(() => {
    if (ref.current) {
      getSize();
    }
  }, [ref]);

  /**
   * Obtains the actual size of text.
   * Size is 0 until text is loaded.
   */
  async function getSize() {
    if (ref.current) {
      const geometry = ref.current.geometry;
      geometry.computeBoundingBox();
      if (geometry.boundingBox) {
        const minY = geometry.boundingBox.min.y;
        const maxY = geometry.boundingBox.max.y;
        const textHeight = maxY - minY;
        const minX = geometry.boundingBox.min.x;
        const maxX = geometry.boundingBox.max.x;
        const textWidth = maxX - minX;
        if (Number.isFinite(textHeight) && Number.isFinite(textWidth)) {
          if (component.updateHeight(textHeight)) {
            updateParent();
          }
          const offsetMagnitude = (component.textWidth - textWidth) / 2;
          if (offsetMagnitude <= 0) return;
          if (component.textAlign === HorizontalAlignment.Left) {
            setOffsetX(-offsetMagnitude);
          } else if (component.textAlign === HorizontalAlignment.Right) {
            setOffsetX(offsetMagnitude);
          }
        } else {
          setTimeout(() => {
            getSize();
          }, 100);
        }
      } else {
        setTimeout(() => {
          getSize();
        }, 100);
      }
    }
  }

  /**
   * Converts alignment to equibalent text alignment string.
   */
  function getTextAlign(alignment: HorizontalAlignment) {
    switch (alignment) {
      case HorizontalAlignment.Left:
        return 'left';
      case HorizontalAlignment.Right:
        return 'right';
    }
    return 'center';
  }

  return (
    <mesh key={`component_${component.id}`} position={position}>
      <ThreeText
        position={new Vector3(offsetX, 0, 0)}
        ref={ref}
        fontSize={component.textSize}
        maxWidth={component.textWidth}
        textAlign={getTextAlign(component.textAlign)}
        color={new Color(component.color)}
        overflowWrap="normal"
      >
        {component.text}
      </ThreeText>
    </mesh>
  );
}
