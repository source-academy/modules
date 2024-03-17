import { type Vector3 } from 'three';
import { UIBasicItem, type PaddingType } from './UIItem';
import { Image } from '@react-three/drei';

type UIImageProps = {
  src: string;
  imageWidth: number;
  imageHeight: number;
  padding?: number | PaddingType;
  id?: string;
};

const IMAGE_UI_TYPE = 'UIImageItem';

/**
 * Subcomponent for InterfaceComponent that can display an image from a link.
 */
export default class UIImageItem extends UIBasicItem {
  src: string;
  imageWidth: number;
  imageHeight: number;
  constructor(props: UIImageProps) {
    super(IMAGE_UI_TYPE, props.padding, props.id);
    this.src = props.src;
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
    if (!uiJson || uiJson.type !== IMAGE_UI_TYPE) return undefined;
    const src = uiJson.src;
    const imageWidth = uiJson.imageWidth;
    const imageHeight = uiJson.imageHeight;
    if (
      typeof src === 'string' &&
      typeof imageWidth === 'number' &&
      typeof imageHeight === 'number'
    ) {
      return new UIImageItem({
        src,
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

function Component(props: { component: UIImageItem; position: Vector3 }) {
  const { component, position } = props;
  return (
    <mesh key={`component_${component.id}`} position={position}>
      <Image
        url={component.src}
        scale={[component.getWidth(), component.getHeight()]}
      />
    </mesh>
  );
}
