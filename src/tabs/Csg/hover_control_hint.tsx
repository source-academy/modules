/* [Imports] */
import { Icon } from '@blueprintjs/core';
import React from 'react';
import {
  BP_BORDER_RADIUS,
  BP_ICON_COLOR,
  BP_TOOLTIP_BACKGROUND_COLOR,
  BP_TOOLTIP_PADDING,
  BP_TOOLTIP_TEXT_COLOR,
  SA_TAB_BUTTON_WIDTH,
  SA_TAB_ICON_SIZE,
} from '../../bundles/csg/constants.js';
import type { HintProps, HintState } from './types';

/* [Main] */

// [CSS Values]
export default class HoverControlHint extends React.Component<
HintProps,
HintState
> {
  constructor(props: HintProps) {
    super(props);

    this.state = {
      showTooltip: false,
    };
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // Centre icon within hint's height
          justifyContent: 'center',

          height: SA_TAB_BUTTON_WIDTH,
        }}
        onMouseEnter={() => this.setState({ showTooltip: true })}
        onMouseLeave={() => this.setState({ showTooltip: false })}
      >
        <Icon
          icon={this.props.iconName}
          size={SA_TAB_ICON_SIZE}
          color={BP_ICON_COLOR}
        />
        <span
          style={{
            display: this.state.showTooltip ? 'inline' : 'none',
            position: 'absolute',
            left: `${SA_TAB_ICON_SIZE * 4}px`,
            zIndex: 1,

            padding: BP_TOOLTIP_PADDING,
            borderRadius: BP_BORDER_RADIUS,

            color: BP_TOOLTIP_TEXT_COLOR,
            backgroundColor: BP_TOOLTIP_BACKGROUND_COLOR,
          }}
        >
          {this.props.tooltipText}
        </span>
      </div>
    );
  }
}
