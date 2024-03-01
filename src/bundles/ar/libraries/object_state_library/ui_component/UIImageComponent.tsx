import { type Vector3 } from 'three';
import { UIBasicComponent, type PaddingType } from './UIComponent';
import { Image } from '@react-three/drei';

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
  return (
    <mesh key={`component_${component.id}`} position={position}>
      <Image
        url={component.src}
        scale={[component.getWidth(), component.getHeight()]}
      />
    </mesh>
  );
}
