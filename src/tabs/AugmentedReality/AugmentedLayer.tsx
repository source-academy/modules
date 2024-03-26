import { PlayAreaContext } from 'saar/libraries/calibration_library/PlayAreaContext';
import { ControlsContext } from 'saar/libraries/controls_library/ControlsContext';
import type { ARState } from '../../bundles/ar/AR';
import { AugmentedContent } from './AugmentedContent';

/**
 * Component for AR layer.
 * Wraps AugmentedContext with required contexts.
 */
export function AugmentedLayer(props: ARState) {
  return (
    <PlayAreaContext>
      <ControlsContext>
        <AugmentedContent {...props} />
      </ControlsContext>
    </PlayAreaContext>
  );
}
