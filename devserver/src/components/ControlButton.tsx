import { AnchorButton, Button, Icon, Intent, Tooltip, type IconProps } from '@blueprintjs/core';
import type { FC } from 'react';

interface ButtonOptions {
  className: string;
  fullWidth: boolean;
  iconColor?: string;
  iconOnRight: boolean;
  intent: Intent;
  minimal: boolean;
  type?: 'button' | 'reset' | 'submit';
};

interface ControlButtonProps {
  label?: string;
  icon?: IconProps['icon'];
  onClick?: () => void;
  options?: Partial<ButtonOptions>;
  isDisabled?: boolean;
  tooltip?: string;
};

const defaultOptions = {
  className: '',
  fullWidth: false,
  iconOnRight: false,
  intent: Intent.NONE,
  minimal: true
};

const ControlButton: FC<ControlButtonProps> = ({
  label = '',
  icon,
  onClick,
  options = {},
  isDisabled = false,
  tooltip
}) => {
  const buttonOptions: ButtonOptions = {
    ...defaultOptions,
    ...options
  };
  const iconElement = icon && <Icon icon={icon} color={buttonOptions.iconColor} />;
  // Refer to #2417 and #2422 for why we conditionally
  // set the button component. See also:
  // https://blueprintjs.com/docs/#core/components/button
  const ButtonComponent = isDisabled ? AnchorButton : Button;

  const button = <ButtonComponent
    disabled={isDisabled}
    fill={buttonOptions.fullWidth}
    intent={buttonOptions.intent}
    minimal={buttonOptions.minimal}
    className={buttonOptions.className}
    type={buttonOptions.type}
    onClick={onClick}
    icon={!buttonOptions.iconOnRight && iconElement}
    rightIcon={buttonOptions.iconOnRight && iconElement}
  >
    {label}
  </ButtonComponent>;

  return tooltip ? (
    <Tooltip content={tooltip} position='top'>
      {button}
    </Tooltip>) : button;
};

export default ControlButton;
