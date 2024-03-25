import { Tooltip } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import ControlButton from '../ControlButton'

type Props = {
  onClick: () => void
}

export const ControlBarClearButton = (props: Props) => <Tooltip content="Clear the editor and context">
  <ControlButton
    label="Clear"
    icon={IconNames.Trash}
    onClick={props.onClick}
  />
</Tooltip>
