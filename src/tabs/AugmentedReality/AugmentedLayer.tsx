import type { ARState } from '../../bundles/ar/AR';
import { PlayAreaContext } from '../../bundles/ar/libraries/calibration_library/PlayAreaContext';
import { ControlsContext } from '../../bundles/ar/libraries/controls_library/ControlsContext';
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
