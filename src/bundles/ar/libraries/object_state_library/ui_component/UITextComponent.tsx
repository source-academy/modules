import { Color, Mesh, Vector3 } from "three";
import { UIBasicComponent, type PaddingType } from "./UIComponent";
import { Text } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

type UITextProps = {
  text: string;
  textSize: number;
  textWidth: number;
  textAlign?: number;
  color?: Color;
  padding?: number | PaddingType;
  id?: string;
};

export default class UITextComponent extends UIBasicComponent {
  text: string;
  textSize: number;
  textWidth: number;
  textHeight = 0;
  textAlign: number;
  color: Color;
  constructor(props: UITextProps) {
    super(props.padding, props.id);
    this.text = props.text;
    this.textSize = props.textSize;
    this.textWidth = props.textWidth;
    this.textAlign = props.textAlign ?? 0;
    this.color = props.color ?? new Color(0x000000);
  }
  getWidth = () => {
    return this.textWidth + this.paddingTop + this.paddingBottom;
  };
  getHeight = () => {
    return this.textHeight + this.paddingTop + this.paddingBottom;
  };
  updateHeight = (newHeight: number) => {
    if (newHeight === 0) {
      return;
    }
    this.textHeight = newHeight;
    this.height = this.textHeight + this.paddingTop + this.paddingBottom;
    let parent = this.parent;
    while (parent) {
      parent.calculateDimensions();
      parent = parent.parent;
    }
  };
  getComponent = (position: Vector3, updateParent: () => void) => {
    return TextUIComponent(this, position, updateParent);
  };
}

function TextUIComponent(
  component: UITextComponent,
  position: Vector3,
  updateParent: () => void
) {
  const [offsetX, setOffsetX] = useState(0);
  let ref = useRef<Mesh>(null);

  useEffect(() => {
    if (ref) {
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
          component.updateHeight(textHeight);
          updateParent();
          let offsetMagnitude = (component.textWidth - textWidth) / 2;
          if (offsetMagnitude <= 0) return;
          if (component.textAlign == 0) {
            setOffsetX(-offsetMagnitude);
          } else if (component.textAlign == 2) {
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

  function getTextAlign(index: number) {
    switch (index) {
      case 1:
        return "left";
      case 2:
        return "right";
    }
    return "center";
  }

  return (
    <mesh key={"component_" + component.id} position={position}>
      <Text
        position={new Vector3(offsetX, 0, 0)}
        ref={ref}
        fontSize={component.textSize}
        maxWidth={component.textWidth}
        textAlign={getTextAlign(component.textAlign)}
        color={component.color}
        overflowWrap="normal"
      >
        {component.text}
      </Text>
    </mesh>
  );
}

