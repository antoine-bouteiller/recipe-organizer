import { useId, useState } from 'react'

import { useFieldContext } from '@/design-system/hooks/use-form-context'
import { Button } from '@/design-system/ui/actions/button/button'
import { MinusIcon, PlusIcon } from '@/design-system/ui/data-display/icons'

import { Field, FieldError } from '../field/field'
import { Label } from '../label/label'

import * as styles from './number-field.css'

export interface NumberFieldProps {
  disabled?: boolean
  label?: string
  max?: number
  min?: number
  placeholder?: string
}

const parse = (text: string): number | undefined => {
  const value = Number(text.replace(',', '.'))
  return text.trim() === '' || Number.isNaN(value) ? undefined : value
}

export const NumberField = ({ disabled, label, max = Infinity, min = -Infinity, placeholder }: NumberFieldProps) => {
  const field = useFieldContext<number | undefined>()
  const id = useId()
  const [text, setText] = useState('')
  const { value } = field.state
  const clamp = (next: number) => Math.min(max, Math.max(min, next))
  const commit = (next: number) => {
    setText(String(next))
    field.handleChange(next)
  }

  return (
    <Field invalid={!field.state.meta.isValid} name={field.name}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className={styles.group} data-disabled={disabled || undefined} data-slot="number-field-group">
        <Button
          aria-label="Decrease"
          disabled={disabled || (value ?? 0) <= min}
          onClick={() => commit(clamp((value ?? 0) - 1))}
          size="stretch"
          type="button"
          variant="ghost"
        >
          <MinusIcon />
        </Button>
        <input
          aria-invalid={!field.state.meta.isValid || undefined}
          autoComplete="off"
          className={styles.input}
          data-slot="number-field-input"
          disabled={disabled}
          id={id}
          inputMode="decimal"
          onBlur={() => {
            field.handleBlur()
            if (value !== undefined) {
              commit(clamp(value))
            }
          }}
          onChange={(event) => {
            if (!/^-?\d*[.,]?\d*$/.test(event.target.value)) {
              return
            }
            setText(event.target.value)
            field.handleChange(parse(event.target.value))
          }}
          placeholder={placeholder}
          value={parse(text) === value ? text : String(value ?? '')}
        />
        <Button
          aria-label="Increase"
          disabled={disabled || (value ?? 0) >= max}
          onClick={() => commit(clamp((value ?? 0) + 1))}
          size="stretch"
          type="button"
          variant="ghost"
        >
          <PlusIcon />
        </Button>
      </div>
      <FieldError />
    </Field>
  )
}
