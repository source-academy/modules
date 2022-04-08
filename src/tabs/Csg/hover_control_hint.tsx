/* [Imports] */
import { Icon } from '@blueprintjs/core';
import React from 'react';
import { ControlProps, ControlState } from './types';

/* [Main] */

// [CSS Values]
// Source Academy
const sideContentMarginBottom = '0.4rem';

// Manually extracted from BlueprintJS
const defaultIconSize = 20;
const iconGrey = '#a7b6c2';

const tooltipPadding = '10px 12px';
const tooltipBorderRadius = '3px';
const tooltipTextDarkGrey = '#394b59';
const tooltipBackgroundLightGrey = '#e1e8ed';

//TODO use true BlueprintJS Components by passing React down in index.tsx
//TODO separate into ControlHint, with HoverControlHint & new ClickableControlHint
export default class HoverControlHint extends React.Component<
  ControlProps,
  ControlState
> {
  public constructor(props: ControlProps) {
    super(props);

    this.state = {
      showTooltip: false,
    };
  }

  public render() {
    return (
      <div
        style={{
          margin: `calc(${sideContentMarginBottom} * 1.5)`,
        }}
      >
        <Icon
          icon={this.props.iconName}
          size={defaultIconSize * 1.5}
          color={iconGrey}
          onMouseEnter={() => this.setState({ showTooltip: true })}
          onMouseLeave={() => this.setState({ showTooltip: false })}
        />
        <span
          style={{
            display: this.state.showTooltip ? 'inline' : 'none',
            position: 'absolute',
            zIndex: 1,

            padding: tooltipPadding,
            borderRadius: tooltipBorderRadius,

            color: tooltipTextDarkGrey,
            backgroundColor: tooltipBackgroundLightGrey,
          }}
        >
          {this.props.tooltipText}
        </span>
      </div>
    );
  }
}
