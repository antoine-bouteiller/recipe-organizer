import { Input as InputPrimitive } from '@base-ui/react/input'
import { type RecipeVariants } from '@vanilla-extract/recipes'
import type React from 'react'

import * as surface from './input-surface.css'
import * as styles from './input.css'

export type InputProps = Pick<
  InputPrimitive.Props,
  'aria-invalid' | 'aria-label' | 'defaultValue' | 'disabled' | 'onChange' | 'placeholder' | 'type' | 'value'
> &
  RecipeVariants<typeof styles.input>

export const Input = ({
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel,
  defaultValue,
  disabled,
  onChange,
  placeholder,
  size,
  type,
  value,
}: InputProps): React.ReactElement => (
  <span className={surface.inputSurface} data-slot="input-control">
    <InputPrimitive
      aria-invalid={ariaInvalid}
      aria-label={ariaLabel}
      className={styles.input({ size })}
      data-slot="input"
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  </span>
)
