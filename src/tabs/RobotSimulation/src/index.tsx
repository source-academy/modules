import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import { Main } from './components/Main';

/**
 * Robot Simulation
 * @author Joel Chan
 */

export default defineTab({
  toSpawn(context) {
    const worldState =
      context.context.moduleContexts.robot_simulation.state?.world?.state;
    return worldState !== undefined;
  },
  body: context => <Main context={context} />,
  label: 'Robot Simulation Tab',
  iconName: 'build',
});
