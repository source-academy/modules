import { ARButton } from '@react-three/xr';

type Props = {
  domOverlay: XRDOMOverlayInit | undefined;
};

/**
 * An AR button with features specified, to allow hit testing.
 */
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
