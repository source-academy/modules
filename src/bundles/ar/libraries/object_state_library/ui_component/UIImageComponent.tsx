import { Vector3 } from "three";
import { UIBasicComponent, type PaddingType } from "./UIComponent";
import { Image } from "@react-three/drei";
import { useEffect } from "react";

type UIImageProps = {
  src: string;
  imageWidth: number;
  imageHeight: number;
  padding?: number | PaddingType;
  id?: string;
};

export default class UIImageComponent extends UIBasicComponent {
  src: string;
  imageWidth: number;
  imageHeight: number;
  constructor(props: UIImageProps) {
    super(props.padding, props.id);
    this.src = props.src;
    this.imageWidth = props.imageWidth;
    this.imageHeight = props.imageHeight;
  }
  getWidth = () => {
    return this.imageWidth + this.paddingTop + this.paddingBottom;
  };
  getHeight = () => {
    return this.imageHeight + this.paddingTop + this.paddingBottom;
  };
  getComponent = (position: Vector3, updateParent: () => void) => {
    return ImageUIComponent(this, position);
  };
}

function ImageUIComponent(component: UIImageComponent, position: Vector3) {
  return (
    <mesh key={"component_" + component.id} position={position}>
      <Image
        url={component.src}
        scale={[component.getWidth(), component.getHeight()]}
      />
    </mesh>
  );
}
