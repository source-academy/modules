import { AnchorButton, Button, type ButtonProps } from '@blueprintjs/core';

const ButtonComponent = (props: Omit<ButtonProps, 'elementRef'>) => (props.disabled ? <AnchorButton {...props} /> : <Button {...props} />);
export default ButtonComponent;
