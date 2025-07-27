import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';

type Props = {
  children?: never;
  className?: string;
  debuggerContext?: any;
};

function Repeat(_props: Props) {
  return <div>This is spawned from the repeat package</div>;
}

export default defineTab({
  toSpawn: () => true,
  body: (debuggerContext: any) => <Repeat debuggerContext={debuggerContext} />,
  label: 'Repeat Test Tab',
  iconName: 'build'
});
