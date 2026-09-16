import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field'
import { css } from '@recipe-organizer/design-system/css'
import React from 'react'

import { MinusIcon } from '../../data-display/icons/minus'
import { PlusIcon } from '../../data-display/icons/plus'
import { Label } from '../label/label'

const rootClassName = css({ alignItems: 'flex-start', display: 'flex', flexDirection: 'column', gap: '2', width: 'full' })
const groupClassName = css({
  '& svg': { flexShrink: 0, pointerEvents: 'none' },
  '&:focus-within': { borderColor: 'ring', boxShadow: '0 0 0 3px color-mix(in oklab, token(colors.ring) 24%, transparent)' },
  '&:focus-within:has([aria-invalid])': {
    borderColor: 'destructive/64',
    boxShadow: '0 0 0 3px color-mix(in oklab, token(colors.destructive) 48%, transparent)',
  },
  '&:has([aria-invalid])': { borderColor: 'destructive/36' },
  '&:has(input:-webkit-autofill)': { backgroundColor: 'foreground/4' },
  '&:not([data-disabled], :focus-within, [aria-invalid])::before': { boxShadow: '0 1px color-mix(in oklab, token(colors.black) 4%, transparent)' },
  '&[data-disabled]': { opacity: 0.64, pointerEvents: 'none' },
  '--owner-icon-size': { base: '1.125rem', sm: '1rem' },
  _before: { borderRadius: 'calc(token(radii.lg) - 1px)', content: '""', inset: '0', pointerEvents: 'none', position: 'absolute' },
  _dark: {
    '&:focus-within:has([aria-invalid])': { boxShadow: '0 0 0 3px color-mix(in oklab, token(colors.destructive) 24%, transparent)' },
    '&:has(input:-webkit-autofill)': { backgroundColor: 'foreground/8' },
    '&:not([data-disabled], :focus-within, [aria-invalid])::before': { boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 6%, transparent)' },
  },
  backgroundClip: 'padding-box',
  backgroundColor: { _dark: 'input/32', base: 'background' },
  borderColor: 'input',
  borderRadius: 'lg',
  borderWidth: '1px',
  color: 'foreground',
  display: 'flex',
  fontSize: { base: 'base', sm: 'sm' },
  justifyContent: 'space-between',
  position: 'relative',
  ringColor: 'ring/24',
  transitionDuration: '150ms',
  transitionProperty: 'box-shadow',
  transitionTimingFunction: 'in-out',
  width: 'full',
})
const decrementClassName = css({
  '@media (pointer: coarse)': { _after: { content: '""', inset: '0', minHeight: '11', minWidth: '11', position: 'absolute' } },
  _hover: { backgroundColor: 'accent' },
  alignItems: 'center',
  borderEndStartRadius: 'calc(token(radii.lg) - 1px)',
  borderStartStartRadius: 'calc(token(radii.lg) - 1px)',
  cursor: 'pointer',
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'center',
  paddingInline: 'calc(token(spacing.3) - 1px)',
  position: 'relative',
  transitionDuration: '150ms',
  transitionProperty: 'background-color',
  transitionTimingFunction: 'in-out',
})
const incrementClassName = css({
  '@media (pointer: coarse)': { _after: { content: '""', inset: '0', minHeight: '11', minWidth: '11', position: 'absolute' } },
  _hover: { backgroundColor: 'accent' },
  alignItems: 'center',
  borderEndEndRadius: 'calc(token(radii.lg) - 1px)',
  borderStartEndRadius: 'calc(token(radii.lg) - 1px)',
  cursor: 'pointer',
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'center',
  paddingInline: 'calc(token(spacing.3) - 1px)',
  position: 'relative',
  transitionDuration: '150ms',
  transitionProperty: 'background-color',
  transitionTimingFunction: 'in-out',
})
const inputClassName = css({
  backgroundColor: 'transparent',
  flexGrow: 1,
  fontVariantNumeric: 'tabular-nums',
  height: { base: '8.5', sm: '7.5' },
  lineHeight: { base: '2.125rem', sm: '1.875rem' },
  minWidth: 0,
  outline: 'none',
  paddingInline: 'calc(token(spacing.3) - 1px)',
  textAlign: 'center',
  transition: 'background-color 5000000s ease-in-out 0s',
  width: 'full',
})
const scrubAreaClassName = css({ cursor: 'ew-resize', display: 'flex' })
const cursorClassName = css({ filter: 'drop-shadow(0 1px 1px #0008)' })

const NumberInputContext = React.createContext<{ fieldId: string } | null>(null)
const NumberInputRoot = ({ id, ...props }: NumberFieldPrimitive.Root.Props): React.ReactElement => {
  const generatedId = React.useId()
  const fieldId = id ?? generatedId
  return (
    <NumberInputContext.Provider value={{ fieldId }}>
      <NumberFieldPrimitive.Root {...props} className={rootClassName} data-slot="number-field" id={fieldId} />
    </NumberInputContext.Provider>
  )
}
const NumberInputGroup = ({ placeholder }: { placeholder?: string }): React.ReactElement => (
  <NumberFieldPrimitive.Group className={groupClassName} data-slot="number-field-group">
    <NumberFieldPrimitive.Decrement className={decrementClassName} data-slot="number-field-decrement">
      <MinusIcon />
    </NumberFieldPrimitive.Decrement>
    <NumberFieldPrimitive.Input className={inputClassName} data-slot="number-field-input" placeholder={placeholder} />
    <NumberFieldPrimitive.Increment className={incrementClassName} data-slot="number-field-increment">
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
    <NumberFieldPrimitive.ScrubArea className={scrubAreaClassName} data-slot="number-field-scrub-area">
      <Label htmlFor={context.fieldId}>{label}</Label>
      <NumberFieldPrimitive.ScrubAreaCursor className={cursorClassName}>
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
