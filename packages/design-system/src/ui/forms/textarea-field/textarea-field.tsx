import { useFieldContext } from '@design-system/hooks/use-form-context'
import { useId } from 'react'
import type React from 'react'

import { Field, FieldError, FieldLabel } from '../field/field'

import * as surface from '../input/input-surface.css'
import * as styles from './textarea-field.css'

export type TextareaFieldProps = Pick<React.ComponentProps<'textarea'>, 'aria-label' | 'disabled' | 'onKeyDown' | 'placeholder' | 'ref'> & {
  label?: string
}

export const TextareaField = ({ disabled, label, onKeyDown, placeholder, ref, 'aria-label': ariaLabel }: TextareaFieldProps) => {
  const field = useFieldContext<string>()
  const id = useId()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <span className={surface.inputSurface} data-slot="textarea-control">
        <textarea
          aria-invalid={!field.state.meta.isValid || undefined}
          aria-label={ariaLabel}
          className={styles.textarea}
          data-slot="textarea"
          disabled={disabled}
          id={id}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          ref={ref}
          value={field.state.value}
        />
      </span>
      <FieldError />
    </Field>
  )
}
