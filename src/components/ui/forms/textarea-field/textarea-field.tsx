import { useId } from 'react'
import type React from 'react'

import { Field, FieldError, FieldLabel, useFieldInvalid } from '../field/field'

import * as surface from '../input/input-surface.css'
import * as styles from './textarea-field.css'

export type TextareaFieldProps = Pick<React.ComponentProps<'textarea'>, 'aria-label' | 'disabled' | 'onKeyDown' | 'placeholder' | 'ref'> & {
  name: string
  value: string
  onChange: (value: string) => void
  label?: string
}

export const TextareaField = ({
  name,
  value,
  onChange,
  disabled,
  label,
  onKeyDown,
  placeholder,
  ref,
  'aria-label': ariaLabel,
}: TextareaFieldProps) => {
  const invalid = useFieldInvalid(name)
  const id = useId()

  return (
    <Field name={name}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <span className={surface.inputSurface} data-slot="textarea-control">
        <textarea
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          className={styles.textarea}
          data-slot="textarea"
          disabled={disabled}
          id={id}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          ref={ref}
          value={value}
        />
      </span>
      <FieldError />
    </Field>
  )
}
