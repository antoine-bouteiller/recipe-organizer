import { Input as InputPrimitive } from '@base-ui/react/input'
import { type RecipeVariants } from '@vanilla-extract/recipes'
import type React from 'react'

import { inputSurface } from './input-surface.css'
import { inputRecipe } from './input.css'

export type InputProps = Pick<
  InputPrimitive.Props,
  'aria-invalid' | 'aria-label' | 'defaultValue' | 'disabled' | 'onChange' | 'placeholder' | 'type' | 'value'
> &
  RecipeVariants<typeof inputRecipe>

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
  <span className={inputSurface()} data-slot="input-control">
    <InputPrimitive
      aria-invalid={ariaInvalid}
      aria-label={ariaLabel}
      className={inputRecipe({ size })}
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
