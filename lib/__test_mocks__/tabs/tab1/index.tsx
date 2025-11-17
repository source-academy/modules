import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';

export default defineTab({
  toSpawn: () => true,
  body: () => <p>Nothing</p>,
  label: 'SomeTab',
  iconName: 'add'
});
