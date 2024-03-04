import { MeshLambertMaterial, Texture, type Vector3 } from 'three';
import { UIBasicComponent, type PaddingType } from './UIComponent';

type UIBase64ImageProps = {
  base64: string;
  imageWidth: number;
  imageHeight: number;
  padding?: number | PaddingType;
  id?: string;
};

export default class UIImageComponent extends UIBasicComponent {
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
  component: UIImageComponent;
  position: Vector3;
}) {
  let { component, position } = props;

  let image = new Image();
  image.src = component.base64;
  let texture = new Texture();
  texture.image = image;
  image.onload = () => {
    console.log('Loaded');
    texture.needsUpdate = true;
  };
  let material = new MeshLambertMaterial({ map: texture });

  return (
    <mesh
      key={`component_${component.id}`}
      position={position}
      material={material}
    >
      <planeGeometry
        args={[props.component.imageWidth, props.component.imageHeight]}
      />
    </mesh>
  );
}
