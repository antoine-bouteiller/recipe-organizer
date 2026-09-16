import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type RecipeVariantProps } from '@recipe-organizer/design-system/css'
import type React from 'react'

const buttonRecipe = cva({
  base: {
    '&[data-pressed]': { transform: 'scale(0.97)' },
    '--owner-icon-margin-inline': '0',
    '--owner-icon-opacity': '0.8',
    '--owner-icon-size': { base: '1.125rem', sm: '1rem' },
    '@media (pointer: coarse)': { _after: { display: 'block' } },
    _active: { transform: 'scale(0.97)' },
    _after: { content: '""', display: 'none', inset: '0', minHeight: '11', minWidth: '11', position: 'absolute' },
    _before: { borderRadius: 'calc(token(radii.lg) - 1px)', content: '""', inset: '0', pointerEvents: 'none', position: 'absolute' },
    _disabled: { opacity: 0.64, pointerEvents: 'none' },
    _focusVisible: { outline: '2px solid token(colors.ring)', outlineOffset: '1px' },
    alignItems: 'center',
    borderRadius: 'lg',
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: { base: 'base', sm: 'sm' },
    fontWeight: 'medium',
    gap: '2',
    justifyContent: 'center',
    position: 'relative',
    transition: 'box-shadow 150ms token(easings.out-snappy), transform 150ms token(easings.out-snappy)',
    whiteSpace: 'nowrap',
  },
  defaultVariants: { align: 'center', size: 'default', variant: 'default', width: 'auto' },
  variants: {
    align: { center: {}, start: { justifyContent: 'flex-start' } },
    size: {
      default: { height: { base: '9', sm: '8' }, paddingInline: 'calc(token(spacing.3) - 1px)' },
      icon: { height: { base: '9', sm: '8' }, width: { base: '9', sm: '8' } },
      'icon-lg': { height: { base: '10', sm: '9' }, width: { base: '10', sm: '9' } },
      'icon-sm': { height: { base: '8', sm: '7' }, width: { base: '8', sm: '7' } },
      'icon-xl': { '--owner-icon-size': { base: '1.25rem', sm: '1.125rem' }, height: { base: '11', sm: '10' }, width: { base: '11', sm: '10' } },
      'icon-xs': {
        '--owner-icon-size': { base: '1rem', sm: '0.875rem' },
        _before: { borderRadius: 'calc(token(radii.md) - 1px)' },
        borderRadius: 'md',
        height: { base: '7', sm: '6' },
        width: { base: '7', sm: '6' },
      },
      lg: { height: { base: '10', sm: '9' }, paddingInline: 'calc(0.875rem - 1px)' },
      sm: { gap: '1.5', height: { base: '8', sm: '7' }, paddingInline: 'calc(0.625rem - 1px)' },
    },
    variant: {
      default: {
        '&[data-pressed]': {
          _before: { boxShadow: '0 1px color-mix(in oklab, token(colors.black) 8%, transparent) inset' },
          backgroundColor: 'primary/90',
          boxShadow: 'none',
        },
        _active: { _before: { boxShadow: '0 1px color-mix(in oklab, token(colors.black) 8%, transparent) inset' }, boxShadow: 'none' },
        _before: { boxShadow: '0 1px color-mix(in oklab, token(colors.white) 16%, transparent) inset' },
        _disabled: { _before: { boxShadow: 'none' }, boxShadow: 'none' },
        _hover: { backgroundColor: 'primary/90' },
        backgroundColor: 'primary',
        borderColor: 'primary',
        boxShadow: '0 1px 2px 0 color-mix(in oklab, token(colors.primary) 24%, transparent)',
        color: 'primary-foreground',
      },
      destructive: {
        '&[data-pressed]': {
          _before: { boxShadow: '0 1px color-mix(in oklab, token(colors.black) 8%, transparent) inset' },
          backgroundColor: 'destructive/90',
          boxShadow: 'none',
        },
        _active: { _before: { boxShadow: '0 1px color-mix(in oklab, token(colors.black) 8%, transparent) inset' }, boxShadow: 'none' },
        _before: { boxShadow: '0 1px color-mix(in oklab, token(colors.white) 16%, transparent) inset' },
        _disabled: { _before: { boxShadow: 'none' }, boxShadow: 'none' },
        _hover: { backgroundColor: 'destructive/90' },
        backgroundColor: 'destructive',
        borderColor: 'destructive',
        boxShadow: '0 1px 2px 0 color-mix(in oklab, token(colors.destructive) 24%, transparent)',
        color: 'white',
      },
      'destructive-ghost': {
        _hover: { backgroundColor: 'destructive/8' },
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: 'destructive-foreground',
      },
      'destructive-outline': {
        '&[data-pressed]': { _before: { boxShadow: 'none' }, backgroundColor: 'destructive/4', borderColor: 'destructive/32', boxShadow: 'none' },
        _active: { _before: { boxShadow: 'none' }, boxShadow: 'none' },
        _before: { boxShadow: '0 1px color-mix(in oklab, token(colors.black) 4%, transparent)' },
        _dark: {
          '&:not(:disabled):not(:active):not([data-pressed])': {
            _before: { boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 6%, transparent)' },
          },
          _before: { boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 2%, transparent)' },
          _hover: { backgroundColor: 'input/64' },
          backgroundColor: 'input/32',
        },
        _disabled: { _before: { boxShadow: 'none' }, boxShadow: 'none' },
        _hover: { backgroundColor: 'destructive/4', borderColor: 'destructive/32' },
        backgroundClip: 'padding-box',
        backgroundColor: 'popover',
        borderColor: 'input',
        boxShadow: 'xs',
        color: 'destructive-foreground',
      },
      ghost: { _hover: { backgroundColor: 'accent' }, backgroundColor: 'transparent', borderColor: 'transparent', color: 'foreground' },
      'list-action': {
        _hover: { backgroundColor: 'accent' },
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: 'foreground',
        justifyContent: 'flex-start',
        width: 'full',
      },
      'media-overlay-card': { _hover: { backgroundColor: 'white/20' }, backgroundColor: 'white/12', borderColor: 'transparent', color: 'white' },
      'media-overlay-header': {
        '&[data-pressed]': { _before: { boxShadow: 'none' }, backgroundColor: 'white/25', boxShadow: 'none' },
        _active: { _before: { boxShadow: 'none' }, boxShadow: 'none' },
        _before: { boxShadow: '0 1px color-mix(in oklab, token(colors.black) 4%, transparent)' },
        _dark: { _before: { boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 6%, transparent)' } },
        _hover: { backgroundColor: 'white/25' },
        backdropFilter: 'blur(12px)',
        backgroundColor: 'white/15',
        borderColor: 'white/20',
        boxShadow: 'xs',
        color: 'white',
      },
      outline: {
        '&[data-pressed]': { _before: { boxShadow: 'none' }, backgroundColor: 'accent/50', boxShadow: 'none' },
        _active: { _before: { boxShadow: 'none' }, boxShadow: 'none' },
        _before: { boxShadow: '0 1px color-mix(in oklab, token(colors.black) 4%, transparent)' },
        _dark: {
          '&:not(:disabled):not(:active):not([data-pressed])': {
            _before: { boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 6%, transparent)' },
          },
          _before: { boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 2%, transparent)' },
          _hover: { backgroundColor: 'input/64' },
          backgroundColor: 'input/32',
        },
        _disabled: { _before: { boxShadow: 'none' }, boxShadow: 'none' },
        _hover: { backgroundColor: 'accent/50' },
        backgroundClip: 'padding-box',
        backgroundColor: 'popover',
        borderColor: 'input',
        boxShadow: 'xs',
        color: 'foreground',
      },
      'search-trigger': {
        _dark: { backgroundColor: 'input/48' },
        backdropFilter: 'blur(24px)',
        backgroundColor: 'background/72',
        borderColor: 'input',
        boxShadow: 'none',
        color: 'foreground',
      },
      secondary: {
        _active: { backgroundColor: 'secondary/80' },
        _hover: { backgroundColor: 'secondary/90' },
        backgroundColor: 'secondary',
        borderColor: 'transparent',
        color: 'secondary-foreground',
      },
    },
    width: { auto: {}, full: { width: 'full' } },
  },
})

export type ButtonProps = Pick<
  useRender.ComponentProps<'button'>,
  'aria-label' | 'aria-pressed' | 'children' | 'disabled' | 'onClick' | 'render' | 'type'
> &
  RecipeVariantProps<typeof buttonRecipe>

export const Button = ({ align, render, size, type, variant, width, ...props }: ButtonProps): React.ReactElement => {
  const mergedProps = mergeProps<'button'>(
    { className: buttonRecipe({ align, size, variant, width }), type: type ?? (render ? undefined : 'button') },
    props
  )

  return useRender({ defaultTagName: 'button', props: { ...mergedProps, 'data-slot': 'button' }, render })
}
