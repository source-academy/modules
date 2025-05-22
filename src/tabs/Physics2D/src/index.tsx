import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import DebugDrawCanvas from './DebugDrawCanvas';

/**
 * Debug draw visualization for the physics world.
 * @author Muhammad Fikri Bin Abdul Kalam
 * @author Yu Jiali
 */

export default defineTab({
  toSpawn: () => true,
  body(context) {
    const { context: { moduleContexts: { physics_2d: { state: { world } } } } } = context;

    return (
      <div>
        <DebugDrawCanvas world={world}/>
      </div>
    );
  },
  label: 'Physics 2D',
  iconName: 'wind'
});
