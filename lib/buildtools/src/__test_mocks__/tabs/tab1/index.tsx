import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';

export default defineTab({
  toSpawn: () => true,
  body: context => context,
  label: 'SomeTab',
  icon: 'SomeIcon'
});
