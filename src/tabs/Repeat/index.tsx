import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import React from 'react';

const Repeat: React.FC = () => {
  return <div>This is spawned from the repeat package</div>;
};

export default defineTab({
  toSpawn: () => true,
  body: () => <Repeat />,
  label: 'Repeat Test Tab',
  iconName: 'build'
});
