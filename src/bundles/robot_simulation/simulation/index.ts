import context from 'js-slang/context';
import { World } from './world';

console.log('World is being initialized');

const contextState = context.moduleContexts.robot_simulation.state?.world;

if (contextState === undefined) {
  context.moduleContexts.robot_simulation.state = {
    ...context.moduleContexts.robot_simulation.state,
    world: new World(),
  };
  console.log('world is being set to initial state');
}

export const getWorld = (): World => context.moduleContexts.robot_simulation.state.world;
