import {
  type Material,
  MeshLambertMaterial,
  Texture,
  type Vector3,
} from 'three';
import { UIBasicComponent, type PaddingType } from './UIComponent';
import { useEffect, useState } from 'react';

type UIBase64ImageProps = {
  base64: string;
  imageWidth: number;
  imageHeight: number;
  padding?: number | PaddingType;
  id?: string;
};

export default class UIBase64ImageComponent extends UIBasicComponent {
  base64: string;
  imageWidth: number;
  imageHeight: number;
  constructor(props: UIBase64ImageProps) {
    super(props.padding, props.id);
    this.base64 = props.base64;
    this.imageWidth = props.imageWidth;
    this.imageHeight = props.imageHeight;
  }
  getWidth = () => this.imageWidth + this.paddingLeft + this.paddingRight;
  getHeight = () => this.imageHeight + this.paddingTop + this.paddingBottom;
  getComponent = (position: Vector3, _: () => void) => (
    <ImageUIComponent key={this.id} component={this} position={position} />
  );
}

function ImageUIComponent(props: {
  component: UIBase64ImageComponent;
  position: Vector3;
}) {
  const [material, setMaterial] = useState<Material>();

  useEffect(() => {
    const image = new Image();
    image.src = props.component.base64;
    const texture = new Texture();
    texture.image = image;
    image.onload = () => {
      texture.needsUpdate = true;
    };
    const newMaterial = new MeshLambertMaterial({ map: texture });
    setMaterial(newMaterial);
  }, [props.component.base64]);

  return (
    <mesh
      key={`component_${props.component.id}`}
      position={props.position}
      material={material}
    >
      <planeGeometry
        args={[props.component.imageWidth, props.component.imageHeight]}
      />
    </mesh>
  );
}
