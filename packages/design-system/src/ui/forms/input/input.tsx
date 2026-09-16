import { Input as InputPrimitive } from '@base-ui/react/input'
import { cva, type RecipeVariantProps } from '@recipe-organizer/design-system/css'
import type React from 'react'

import { inputSurface } from './input-surface'

const inputRecipe = cva({
  base: {
    '&::-webkit-search-cancel-button, &::-webkit-search-decoration, &::-webkit-search-results-button, &::-webkit-search-results-decoration': {
      appearance: 'none',
    },
    '&::file-selector-button': { backgroundColor: 'transparent', color: 'foreground', fontSize: 'sm', fontWeight: 'medium', marginInlineEnd: '3' },
    '&[type=file]': { color: 'muted-foreground' },
    _placeholder: { color: 'muted-foreground/72' },
    backgroundColor: 'transparent',
    borderRadius: 'inherit',
    height: { base: '8.5', sm: '7.5' },
    lineHeight: { base: '2.125rem', sm: '1.875rem' },
    minWidth: '0',
    outline: 'none',
    paddingInline: 'calc(token(spacing.3) - 1px)',
    transition: 'background-color 5000000s ease-in-out 0s',
    width: 'full',
  },
  defaultVariants: { size: 'default' },
  variants: { size: { default: {}, lg: { height: { base: '9.5', sm: '8.5' }, lineHeight: { base: '2.375rem', sm: '2.125rem' } } } },
})

export type InputProps = Pick<
  InputPrimitive.Props,
  'aria-invalid' | 'aria-label' | 'defaultValue' | 'disabled' | 'onChange' | 'placeholder' | 'type' | 'value'
> &
  RecipeVariantProps<typeof inputRecipe>

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
