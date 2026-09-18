import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field'
import { MinusIcon } from '@recipe-organizer/design-system/icons/minus'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import React from 'react'

import { Label } from '../label/label'

import * as styles from './number-input.css'

const NumberInputContext = React.createContext<{ fieldId: string } | null>(null)
const NumberInputRoot = ({ id, ...props }: NumberFieldPrimitive.Root.Props): React.ReactElement => {
  const generatedId = React.useId()
  const fieldId = id ?? generatedId
  return (
    <NumberInputContext.Provider value={{ fieldId }}>
      <NumberFieldPrimitive.Root {...props} className={styles.root} data-slot="number-field" id={fieldId} />
    </NumberInputContext.Provider>
  )
}
const NumberInputGroup = ({ placeholder }: { placeholder?: string }): React.ReactElement => (
  <NumberFieldPrimitive.Group className={styles.group} data-slot="number-field-group">
    <NumberFieldPrimitive.Decrement className={styles.decrement} data-slot="number-field-decrement">
      <MinusIcon />
    </NumberFieldPrimitive.Decrement>
    <NumberFieldPrimitive.Input className={styles.input} data-slot="number-field-input" placeholder={placeholder} />
    <NumberFieldPrimitive.Increment className={styles.increment} data-slot="number-field-increment">
      <PlusIcon />
    </NumberFieldPrimitive.Increment>
  </NumberFieldPrimitive.Group>
)
const NumberInputScrubArea = ({ label }: { label: string }): React.ReactElement => {
  const context = React.useContext(NumberInputContext)
  if (!context) {
    throw new Error('NumberFieldScrubArea must be used within a NumberField component for accessibility.')
  }
  return (
    <NumberFieldPrimitive.ScrubArea className={styles.scrubArea} data-slot="number-field-scrub-area">
      <Label htmlFor={context.fieldId}>{label}</Label>
      <NumberFieldPrimitive.ScrubAreaCursor className={styles.cursor}>
        <CursorGrowIcon />
      </NumberFieldPrimitive.ScrubAreaCursor>
    </NumberFieldPrimitive.ScrubArea>
  )
}
const CursorGrowIcon = (props: React.ComponentProps<'svg'>): React.ReactElement => (
  <svg aria-hidden="true" fill="black" height="14" stroke="white" viewBox="0 0 24 14" width="26" xmlns="http://www.w3.org/2000/svg" {...props}>
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
}: NumberInputProps): React.ReactElement => (
  <NumberInputRoot
    aria-invalid={ariaInvalid}
    defaultValue={defaultValue}
    disabled={disabled}
    id={id}
    max={max}
    min={min}
    onValueChange={onValueChange}
    step={step}
    value={value}
  >
    {label && <NumberInputScrubArea label={label} />}
    <NumberInputGroup placeholder={placeholder} />
  </NumberInputRoot>
)
