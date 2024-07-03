import { useEffect } from 'react';
import { ARButton } from 'saar/libraries/misc';
import { useScreenState } from 'saar/libraries/screen_state_library/ScreenStateContext';
import type { ARState } from '../../bundles/ar/AR';
import { AugmentedLayer } from './AugmentedLayer';
import { Overlay } from './Overlay';

/**
 * Toggle to start AR context, for tab.
 */
export function StartButton(props: ARState) {
  const screenState = useScreenState();

  useEffect(() => {
    screenState.setState(<AugmentedLayer {...props} />, <Overlay />);
  }, []);

  return (
    <div style={{ height: '50vh' }}>
      <ARButton
        enterOnly
        sessionInit={{
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: screenState.domOverlay,
        }}
      />
      {screenState.component}
    </div>
  );
}
