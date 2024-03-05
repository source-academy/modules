import { ARButton } from '@react-three/xr';

type Props = {
  domOverlay: XRDOMOverlayInit | undefined;
};

export function SimplifiedARButton(props: Props) {
  return (
    <ARButton
      sessionInit={{
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: props.domOverlay,
      }}
    />
  );
}
