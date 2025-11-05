/* [Imports] */
import { Icon, Tooltip } from '@blueprintjs/core';
import { BP_ICON_COLOR, SA_TAB_BUTTON_WIDTH, SA_TAB_ICON_SIZE } from '@sourceacademy/modules-lib/tabs/css_constants';
import type { HintProps } from './types';

/* [Main] */
export default function HoverControlHint(props: HintProps) {
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
      content={props.tooltipText}
      placement="left"
    >
      <Icon
        icon={props.iconName}
        size={SA_TAB_ICON_SIZE}
        color={BP_ICON_COLOR}
      />
    </Tooltip>
  </div>;
}
