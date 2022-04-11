/* [Imports] */
import { Icon } from '@blueprintjs/core';
import React from 'react';
import { HintProps, HintState } from './types';

/* [Main] */

// [CSS Values]
// Source Academy
let sideContentMarginBottom = '0.4rem';

// Manually extracted from BlueprintJS
let defaultIconSize = 20;
let iconGrey = '#a7b6c2';

let tooltipPadding = '10px 12px';
let tooltipBorderRadius = '3px';
let tooltipTextDarkGrey = '#394b59';
let tooltipBackgroundLightGrey = '#e1e8ed';

//TODO use true BlueprintJS Components by passing React down in index.tsx
//TODO separate into ControlHint, with HoverControlHint & new ClickableControlHint
export default class HoverControlHint extends React.Component<
  HintProps,
  HintState
> {
  public constructor(props: HintProps) {
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
          size={defaultIconSize}
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
