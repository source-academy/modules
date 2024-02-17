import { AnchorButton, Button, Intent } from '@blueprintjs/core';

const defaultOptions = {
  className: '',
  fullWidth: false,
  iconOnRight: false,
  intent: Intent.NONE,
  minimal: true,
};

type Props = {
  onClick?: React.MouseEventHandler<HTMLElement>,
  disabled?: boolean,
};

const ButtonComponent = (props: Props) => {
  const buttonProps = {
    ...defaultOptions,
    ...props,
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
