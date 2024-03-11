import * as THREE from 'three';

import {
  mergeConfig,
  type RecursivePartial,
} from '../../../controllers/utils/mergeConfig';

type DebugArrowConfig = {
  color: THREE.Color;
  debug: boolean;
};

const defaultDebugArrowConfig = {
  color: new THREE.Color(0xff0000),
  debug: false,
};

export class DebugArrow {
  config: DebugArrowConfig;
  arrow: THREE.ArrowHelper;

  constructor(config?: RecursivePartial<DebugArrowConfig>) {
    this.config = mergeConfig(defaultDebugArrowConfig, config);
    this.arrow = new THREE.ArrowHelper();
    this.arrow.setColor(this.config.color);
  }

  getMesh(): THREE.ArrowHelper {
    return this.arrow;
  }

  update(
    position: THREE.Vector3,
    direction: THREE.Vector3,
    length: number,
    debug?: boolean,
  ): void {
    this.arrow.position.copy(position);
    this.arrow.setDirection(direction.normalize());
    this.arrow.setLength(length);
    if (debug) {
      this.arrow.visible = debug;
    }
  }
}
