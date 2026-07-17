import { Card, Switch, Tooltip } from '@blueprintjs/core';

type SettingsPopupProps = {
  useCompiled: boolean;
  onUseCompiledChange?: (newValue: boolean) => void;
};

export default function SettingsPopup(props: SettingsPopupProps) {
  return <Card>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <h3>Development Server Settings</h3>
      <Tooltip content="Load compiled assets instead of the raw Typescript">
        <Switch
          checked={props.useCompiled}
          onChange={() => {
            if (props.onUseCompiledChange) {
              props.onUseCompiledChange(!props.useCompiled);
            }
          }}
          label="Use compiled"
        />
      </Tooltip>
    </div>
  </Card>;
}
