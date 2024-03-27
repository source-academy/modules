/* [Imports] */
import { Switch, type SwitchProps } from '@blueprintjs/core';
import React from 'react';

export type AutoLoopSwitchProps = Omit<SwitchProps, 'checked' | 'style'> & {
  isAutoLooping: boolean;
};

/* [Main] */
export default class AutoLoopSwitch extends React.Component<AutoLoopSwitchProps> {
  render() {
    return (
      <Switch
        style={{
          // Remove default bottom margin
          marginBottom: '0px',

          // Prevent label from wrapping at every letter when width is small
          whiteSpace: 'nowrap'
        }}
        label="Auto Loop"
        checked={this.props.isAutoLooping}
        {...this.props}
      />
    );
  }
}
