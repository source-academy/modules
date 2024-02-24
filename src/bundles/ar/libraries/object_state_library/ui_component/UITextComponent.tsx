import { Color, type Mesh, Vector3 } from 'three';
import { UIBasicComponent, type PaddingType } from './UIComponent';
import { Text } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { HorizontalAlignment } from './UIColumnComponent';

type UITextProps = {
  text: string;
  textSize: number;
  textWidth: number;
  textAlign?: HorizontalAlignment;
  color?: number;
  padding?: number | PaddingType;
  id?: string;
};

export default class UITextComponent extends UIBasicComponent {
  text: string;
  textSize: number;
  textWidth: number;
  textHeight = 0;
  textAlign: HorizontalAlignment;
  color: number;
  constructor(props: UITextProps) {
    super(props.padding, props.id);
    this.text = props.text;
    this.textSize = props.textSize;
    this.textWidth = props.textWidth;
    this.textAlign = props.textAlign ?? HorizontalAlignment.Center;
    this.color = props.color ?? 0;
  }
  getWidth = () => this.textWidth + this.paddingTop + this.paddingBottom;
  getHeight = () => this.textHeight + this.paddingTop + this.paddingBottom;
  updateHeight = (newTextHeight: number): boolean => {
    if (newTextHeight === 0) {
      return false;
    }
    this.textHeight = newTextHeight;
    let newHeight = this.getHeight();
    if (this.height !== newHeight) {
      this.height = newHeight;
      let parent = this.parent;
      while (parent) {
        parent.calculateDimensions();
        parent = parent.parent;
      }
      return true;
    }
    return false;
  };
  getComponent = (position: Vector3, updateParent: () => void) => (
    <TextUIComponent
      key={this.id}
      component={this}
      position={position}
      updateParent={updateParent}
    />
  );
}

function TextUIComponent(props: {
  component: UITextComponent;
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

  async function getSize() {
    if (ref.current) {
      let geometry = ref.current.geometry;
      geometry.computeBoundingBox();
      if (geometry.boundingBox) {
        let minY = geometry.boundingBox.min.y;
        let maxY = geometry.boundingBox.max.y;
        let textHeight = maxY - minY;
        let minX = geometry.boundingBox.min.x;
        let maxX = geometry.boundingBox.max.x;
        let textWidth = maxX - minX;
        if (Number.isFinite(textHeight) && Number.isFinite(textWidth)) {
          if (component.updateHeight(textHeight)) {
            updateParent();
          }
          let offsetMagnitude = (component.textWidth - textWidth) / 2;
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
      <Text
        position={new Vector3(offsetX, 0, 0)}
        ref={ref}
        fontSize={component.textSize}
        maxWidth={component.textWidth}
        textAlign={getTextAlign(component.textAlign)}
        color={new Color(component.color)}
        overflowWrap="normal"
      >
        {component.text}
      </Text>
    </mesh>
  );
}
