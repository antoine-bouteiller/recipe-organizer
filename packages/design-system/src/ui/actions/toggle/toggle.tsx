import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

const toggleRecipe = cva({
  base: {
    '&[data-pressed]': { backgroundColor: 'input/64', color: 'accent-foreground' },
    '--owner-icon-margin-inline': '-0.125rem',
    '--owner-icon-opacity': '0.8',
    '--owner-icon-size': { base: '1.125rem', sm: '1rem' },
    '@media (pointer: coarse)': { _after: { display: 'block' } },
    _after: { content: '""', display: 'none', inset: '0', minHeight: '11', minWidth: 'var(--toggle-hit-min-width, 44px)', position: 'absolute' },
    _disabled: { opacity: 0.64, pointerEvents: 'none' },
    _focusVisible: { outline: '2px solid token(colors.ring)', outlineOffset: '1px', zIndex: '10' },
    _hover: { backgroundColor: 'accent' },
    alignItems: 'center',
    borderRadius: 'lg',
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: { base: 'base', sm: 'sm' },
    fontWeight: 'medium',
    gap: '2',
    height: { base: '9', sm: '8' },
    justifyContent: 'center',
    minWidth: { base: '9', sm: '8' },
    paddingInline: 'calc(token(spacing.2) - 1px)',
    position: 'relative',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  defaultVariants: { presentation: 'default', variant: 'default' },
  variants: {
    presentation: { default: {}, filter: { '&[data-pressed]': { backgroundColor: 'primary/12', borderColor: 'primary', color: 'primary' } } },
    variant: {
      default: { borderColor: 'transparent' },
      outline: {
        '&[data-pressed]': { backgroundColor: 'input/64' },
        _active: { boxShadow: 'none' },
        _before: {
          borderRadius: 'calc(token(radii.lg) - 1px)',
          boxShadow: '0 1px color-mix(in oklab, token(colors.black) 4%, transparent)',
          content: '""',
          inset: '0',
          pointerEvents: 'none',
          position: 'absolute',
        },
        _dark: {
          '&[data-pressed]': { backgroundColor: 'input' },
          _before: { boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 6%, transparent)' },
          _hover: { backgroundColor: 'input/64' },
          backgroundColor: 'input/32',
        },
        _disabled: { boxShadow: 'none' },
        _hover: { backgroundColor: 'accent' },
        backgroundClip: 'padding-box',
        backgroundColor: 'background',
        borderColor: 'input',
        boxShadow: 'xs',
      },
    },
  },
})

export type ToggleProps = Pick<
  TogglePrimitive.Props,
  'aria-label' | 'children' | 'defaultPressed' | 'disabled' | 'onClick' | 'onPressedChange' | 'pressed' | 'value'
> & {
  presentation?: 'default' | 'filter'
  variant?: 'default' | 'outline'
}

export const Toggle = ({ presentation, variant, ...props }: ToggleProps): React.ReactElement => (
  <TogglePrimitive {...props} className={toggleRecipe({ presentation, variant })} data-slot="toggle" />
)
