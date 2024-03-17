import {
  type Material,
  MeshLambertMaterial,
  Texture,
  type Vector3,
} from 'three';
import { UIBasicItem, type PaddingType } from './UIItem';
import { useEffect, useState } from 'react';

type UIBase64ImageProps = {
  base64: string;
  imageWidth: number;
  imageHeight: number;
  padding?: number | PaddingType;
  id?: string;
};

const BASE64_IMAGE_UI_TYPE = 'UIBase64ImageItem';

/**
 * Subcomponent for InterfaceComponent that can display a Base64 encoded image.
 */
export default class UIBase64ImageItem extends UIBasicItem {
  base64: string;
  imageWidth: number;
  imageHeight: number;
  constructor(props: UIBase64ImageProps) {
    super(BASE64_IMAGE_UI_TYPE, props.padding, props.id);
    this.base64 = props.base64;
    this.imageWidth = props.imageWidth;
    this.imageHeight = props.imageHeight;
  }
  getWidth = () => this.imageWidth + this.paddingLeft + this.paddingRight;
  getHeight = () => this.imageHeight + this.paddingTop + this.paddingBottom;
  static parseJson(
    uiJson: any,
    id: string,
    paddingLeft: number | undefined,
    paddingRight: number | undefined,
    paddingTop: number | undefined,
    paddingBottom: number | undefined,
  ) {
    if (!uiJson || uiJson.type !== BASE64_IMAGE_UI_TYPE) return undefined;
    const base64 = uiJson.base64;
    const imageWidth = uiJson.imageWidth;
    const imageHeight = uiJson.imageHeight;
    if (
      typeof base64 === 'string' &&
      typeof imageWidth === 'number' &&
      typeof imageHeight === 'number'
    ) {
      return new UIBase64ImageItem({
        base64,
        imageWidth,
        imageHeight,
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
  getComponent = (position: Vector3, _: () => void) => (
    <Component key={this.id} component={this} position={position} />
  );
}

function Component(props: { component: UIBase64ImageItem; position: Vector3 }) {
  const [material, setMaterial] = useState<Material>();

  useEffect(() => {
    // Loads the image onto a texture, then use it on a plane
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
