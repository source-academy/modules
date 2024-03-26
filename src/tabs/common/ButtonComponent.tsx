import { AnchorButton, Button, Intent } from '@blueprintjs/core';
import type { MouseEventHandler, ReactNode } from 'react';

const defaultOptions = {
  className: '',
  fullWidth: false,
  iconOnRight: false,
  intent: Intent.NONE,
  minimal: true
};

type Props = {
  onClick?: MouseEventHandler<HTMLElement>,
  disabled?: boolean,
  children?: ReactNode,
};

const ButtonComponent = (props: Props) => {
  const buttonProps = {
    ...defaultOptions,
    ...props
  };
  return props.disabled
    ? (
      <AnchorButton {...buttonProps} />
    )
    : (
      <Button {...buttonProps} />
    );
};
export default ButtonComponent;
