import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field'
import { MinusIcon } from '@recipe-organizer/design-system/icons/minus'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import React from 'react'

import { Label } from '../label/label'

import * as styles from './number-input.css'

const CursorGrowIcon = (): React.ReactElement => (
  <svg aria-hidden="true" fill="black" height="14" stroke="white" viewBox="0 0 24 14" width="26" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
  </svg>
)

export interface NumberInputProps {
  'aria-invalid'?: boolean
  defaultValue?: number
  disabled?: boolean
  id?: string
  label?: string
  max?: number
  min?: number
  onValueChange?: (value: number | null, eventDetails: NumberFieldPrimitive.Root.ChangeEventDetails) => void
  placeholder?: string
  step?: number | 'any'
  value?: number
}
export const NumberInput = ({
  'aria-invalid': ariaInvalid,
  defaultValue,
  disabled,
  id,
  label,
  max,
  min,
  onValueChange,
  placeholder,
  step,
  value,
}: NumberInputProps): React.ReactElement => {
  const generatedId = React.useId()
  const fieldId = id ?? generatedId

  return (
    <NumberFieldPrimitive.Root
      aria-invalid={ariaInvalid}
      className={styles.root}
      data-slot="number-field"
      defaultValue={defaultValue}
      disabled={disabled}
      id={fieldId}
      max={max}
      min={min}
      onValueChange={onValueChange}
      step={step}
      value={value}
    >
      {label && (
        <NumberFieldPrimitive.ScrubArea className={styles.scrubArea} data-slot="number-field-scrub-area">
          <Label htmlFor={fieldId}>{label}</Label>
          <NumberFieldPrimitive.ScrubAreaCursor className={styles.cursor}>
            <CursorGrowIcon />
          </NumberFieldPrimitive.ScrubAreaCursor>
        </NumberFieldPrimitive.ScrubArea>
      )}
      <NumberFieldPrimitive.Group className={styles.group} data-slot="number-field-group">
        <NumberFieldPrimitive.Decrement className={styles.decrement} data-slot="number-field-decrement">
          <MinusIcon />
        </NumberFieldPrimitive.Decrement>
        <NumberFieldPrimitive.Input className={styles.input} data-slot="number-field-input" placeholder={placeholder} />
        <NumberFieldPrimitive.Increment className={styles.increment} data-slot="number-field-increment">
          <PlusIcon />
        </NumberFieldPrimitive.Increment>
      </NumberFieldPrimitive.Group>
    </NumberFieldPrimitive.Root>
  )
}
