import { Button, Menu, MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Select, type ItemListRenderer, type ItemRenderer } from '@blueprintjs/select';

interface ControlBarSelectItem {
  name: string;
  id: string;
}

interface ControlBarSelectProps<T extends ControlBarSelectItem> {
  items: T[];
  selected?: string | null;
  onChange: (item: T) => void;
  disabled?: boolean;
};

export default function ControlBarSelect<T extends ControlBarSelectItem>({
  items,
  selected,
  onChange,
  disabled = false,
}: ControlBarSelectProps<T>) {
  const evaluatorListRenderer: ItemListRenderer<T> = ({
    itemsParentRef,
    renderItem,
    items,
  }) => (
    <Menu ulRef={itemsParentRef} style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map(renderItem)}
    </Menu>
  );

  const evaluatorRenderer: ItemRenderer<T> = (evaluator, { handleClick }) => (
    <MenuItem key={evaluator.id} onClick={handleClick} text={evaluator.name} />
  );

  const selectedItem = items.find(({ id }) => id === selected);

  return (
    <Select<T>
      items={items}
      onItemSelect={onChange}
      itemRenderer={evaluatorRenderer}
      itemListRenderer={evaluatorListRenderer}
      filterable={false}
      disabled={disabled}
    >
      <Button
        variant="minimal"
        text={selectedItem?.name ?? '-'}
        endIcon={disabled ? null : IconNames.DOUBLE_CARET_VERTICAL}
        data-testid="ControlBarEvaluatorSelect"
        disabled={disabled}
      />
    </Select>
  );
}
