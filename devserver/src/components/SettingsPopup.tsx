import { Card, EditableText, Switch, Tooltip } from '@blueprintjs/core';
import { useState } from 'react';

type SettingsPopupProps = {
  backend: string
  useCompiledForTabs: boolean
  onUseCompiledChange?: (newValue: boolean) => void
  onBackendChange?: (newValue: string) => void
};

export default function SettingsPopup(props: SettingsPopupProps) {
  const [backendText, setBackendText] = useState(props.backend);

  return <Card>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <h3>Development Server Settings</h3>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <p>Modules Backend:  </p>
        <EditableText value={backendText}
          alwaysRenderInput
          onChange={setBackendText}
          onConfirm={v => {
            if (props.onBackendChange) props.onBackendChange(v);
          }}
          onCancel={() => setBackendText(props.backend)}
        />
      </div>
      <br/>
      <Tooltip content="Load compiled tabs instead of the raw Typescript">
        <Switch
          checked={props.useCompiledForTabs}
          onChange={() => {
            if (props.onUseCompiledChange) {
              props.onUseCompiledChange(!props.useCompiledForTabs);
            }
          }}
          label="Use compiled tabs"
        />
      </Tooltip>
    </div>
  </Card>;
}
