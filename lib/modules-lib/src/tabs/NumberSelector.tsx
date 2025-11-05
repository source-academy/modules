import { EditableText, type EditableTextProps } from '@blueprintjs/core';
import clamp from 'lodash/clamp';
import { useState } from 'react';

export type NumberSelectorProps = {
  /**
   * Current value of the selector
   */
  value: number;
  /**
   * Maximum value that the selector is allowed to take on
   */
  maxValue: number;
  /**
   * Minimum value that the selector is allowed to take on
   */
  minValue: number;
  /**
   * Callback that is called with the value that the selector is changing to
   */
  onValueChanged?: (newValue: number) => void;
} & Omit<EditableTextProps, 'alwaysRenderInput' | 'value' | 'type' | 'isEditing'>;

/**
 * React component for wrapping around a {@link EditableText} to provide automatic
 * validation for number values
 */
export default function NumberSelector({
  value,
  maxValue,
  minValue,
  onValueChanged,
  onCancel,
  onEdit,
  onConfirm,
  customInputAttributes,
  ...props
}: NumberSelectorProps) {
  const [text, setText] = useState<string | null>(null);

  const maxTextLength = maxValue === 0 ? 1 : Math.floor(Math.log10(maxValue)) + 2;

  return <EditableText
    {...props}
    alwaysRenderInput
    customInputAttributes={
      customInputAttributes === undefined ? {
        max: maxValue, min: minValue,
      } : {
        ...customInputAttributes,
        max: maxValue, min: minValue,
      }
    }
    type="number"
    value={text ?? value.toString()}
    isEditing={text !== null}
    onChange={textValue => {
      if (textValue.length === maxTextLength) return;

      if (text !== null) {
        setText(textValue);
        return;
      }

      const newValue = parseFloat(textValue);
      if (!Number.isNaN(newValue) && onValueChanged) {
        onValueChanged(clamp(newValue, minValue, maxValue));
      }
    }}
    onEdit={editValue => {
      setText(value.toString());
      if (onEdit) onEdit(editValue);
    }}
    onCancel={value => {
      setText(null);

      if (onCancel) onCancel(value);
    }}
    onConfirm={textValue => {
      const newValue = parseFloat(textValue);
      if (!Number.isNaN(newValue) && onValueChanged) {
        onValueChanged(clamp(newValue, minValue, maxValue));
      }

      if (onConfirm) onConfirm(textValue);

      setText(null);
    }}
  />;
}
