/* [Imports] */
import { Switch } from '@blueprintjs/core';
import React from 'react';
import { type AutoLoopSwitchProps } from './types';



/* [Main] */
export default class AutoLoopSwitch extends React.Component<AutoLoopSwitchProps> {
  render() {
    return <Switch
      style={{
      // Remove default bottom margin
        marginBottom: '0px',

        // Prevent label from wrapping at every letter when width is small
        whiteSpace: 'nowrap',
      }}

      label="Auto Loop"
      checked={ this.props.isAutoLooping }

      onChange={ this.props.onChangeCallback }
    />;
  }
}
