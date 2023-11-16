/* [Imports] */
import { Icon } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import React from 'react';
import { BP_ICON_COLOR, SA_TAB_BUTTON_WIDTH, SA_TAB_ICON_SIZE } from '../common/css_constants';
import type { HintProps } from './types';

/* [Main] */
export default class HoverControlHint extends React.Component<HintProps> {
  render() {
    return <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // Centre icon within hint's height
        justifyContent: 'center',

        height: SA_TAB_BUTTON_WIDTH,
      }}
    >
      <Tooltip2
        content={this.props.tooltipText}
        placement="left"
      >
        <Icon
          icon={this.props.iconName}
          size={SA_TAB_ICON_SIZE}
          color={BP_ICON_COLOR}
        />
      </Tooltip2>
    </div>;
  }
}
