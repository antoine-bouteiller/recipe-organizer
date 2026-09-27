import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field'
import { useFieldContext } from '@design-system/hooks/use-form-context'
import { MinusIcon } from '@recipe-organizer/design-system/icons/minus'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import React from 'react'

import { Field, FieldError } from '../field/field'
import { Label } from '../label/label'

import * as styles from './number-field.css'

const CursorGrowIcon = (): React.ReactElement => (
  <svg aria-hidden="true" fill="black" height="14" stroke="white" viewBox="0 0 24 14" width="26" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
  </svg>
)

export interface NumberFieldProps {
  disabled?: boolean
  label?: string
  max?: number
  min?: number
  placeholder?: string
}

export const NumberField = ({ disabled, label, max, min, placeholder }: NumberFieldProps) => {
  const field = useFieldContext<number | undefined>()
  const id = React.useId()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      <NumberFieldPrimitive.Root
        className={styles.root}
        data-slot="number-field"
        disabled={disabled}
        id={id}
        max={max}
        min={min}
        onValueChange={(value) => field.handleChange(value ?? undefined)}
        step="any"
        value={field.state.value}
      >
        {label && (
          <NumberFieldPrimitive.ScrubArea className={styles.scrubArea} data-slot="number-field-scrub-area">
            <Label htmlFor={id}>{label}</Label>
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
      <FieldError />
    </Field>
  )
}
