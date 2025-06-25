/* [Imports] */
import { Icon, Tooltip } from '@blueprintjs/core';
import { BP_ICON_COLOR, SA_TAB_BUTTON_WIDTH, SA_TAB_ICON_SIZE } from '@sourceacademy/modules-lib/tabs';
import React from 'react';
import type { HintProps } from '../types';

/* [Main] */
export default class HoverControlHint extends React.Component<HintProps> {
  render() {
    return <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // Centre icon within hint's height
        justifyContent: 'center',

        height: SA_TAB_BUTTON_WIDTH
      }}
    >
      <Tooltip
        content={this.props.tooltipText}
        placement="left"
      >
        <Icon
          icon={this.props.iconName}
          size={SA_TAB_ICON_SIZE}
          color={BP_ICON_COLOR}
        />
      </Tooltip>
    </div>;
  }
}
