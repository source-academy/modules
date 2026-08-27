import { Switch, type SwitchProps } from '@blueprintjs/core';

export type AutoLoopSwitchProps = Omit<SwitchProps, 'checked' | 'style'> & {
  isAutoLooping: boolean;
};

/**
 * A {@link Switch|Switch} component designed to be used as a toggle for auto playing
 * @category Components
 */
export default function AutoLoopSwitch({ isAutoLooping, ...props }: AutoLoopSwitchProps) {
  return <Switch
    style={{
      // Remove default bottom margin
      marginBottom: '0px',

      // Prevent label from wrapping at every letter when width is small
      whiteSpace: 'nowrap'
    }}
    label="Auto Loop"
    checked={isAutoLooping}
    {...props}
  />;
}
