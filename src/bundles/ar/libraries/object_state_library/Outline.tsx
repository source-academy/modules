import { Outlines } from '@react-three/drei';
import { Color } from 'three';

type Props = {
  isSelected: boolean;
  isInFront: boolean;
};

/**
 * Outline for ARObject.
 * Currently only works with UI and shape objects.
 */
export function Outline(props: Props) {
  function getColor() {
    if (props.isSelected && props.isInFront) {
      return new Color(0x00ff73);
    }
    if (props.isSelected) {
      return new Color(0xff5900);
    }
    return new Color(0xffa500);
  }

  return (
    <Outlines
      visible={props.isInFront || props.isSelected}
      thickness={10}
      color={getColor()}
      screenspace={true}
      opacity={1}
      transparent={false}
      angle={0}
    />
  );
}
