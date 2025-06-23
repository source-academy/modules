import { AnchorButton, Button, Intent } from '@blueprintjs/core';
import type { MouseEventHandler, ReactNode } from 'react';

const defaultOptions = {
  className: '',
  fullWidth: false,
  iconOnRight: false,
  intent: Intent.NONE,
  minimal: true
};

export type ButtonComponentProps = {
  onClick?: MouseEventHandler<HTMLElement>,
  disabled?: boolean,
  children?: ReactNode,
};

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
