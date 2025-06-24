import { AnchorButton, type AnchorButtonProps, Button, type ButtonProps, Intent } from '@blueprintjs/core';

const defaultOptions = {
  className: '',
  fullWidth: false,
  iconOnRight: false,
  intent: Intent.NONE,
  minimal: true
};

/**
 * Refer to {@link https://blueprintjs.com/docs/#core/components/buttons.anchorbutton|this link} for more details
 */
export type ButtonComponentProps = AnchorButtonProps & ButtonProps;

/**
 * Button Component that retains interactability even when disabled. Refer to
 * {@link https://blueprintjs.com/docs/#core/components/buttons.anchorbutton|this} for more information
 */
export default function ButtonComponent(props: ButtonComponentProps) {
  const buttonProps = {
    ...defaultOptions,
    ...props
  };
  return props.disabled
    ? <AnchorButton {...buttonProps} />
    : <Button {...buttonProps} />;
};
