import { cva, type RecipeVariantProps } from '@recipe-organizer/design-system/css'
import type React from 'react'

const badgeRecipe = cva({
  base: {
    '--owner-icon-size': { base: '0.875rem', sm: '0.75rem' },
    _disabled: { opacity: 0.64, pointerEvents: 'none' },
    _focusVisible: { outline: '2px solid token(colors.ring)', outlineOffset: '1px' },
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 'sm',
    borderWidth: '1px',
    display: 'inline-flex',
    flexShrink: 0,
    fontWeight: 'medium',
    gap: '1',
    justifyContent: 'center',
    outline: 'none',
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    transitionTimingFunction: 'in-out',
    whiteSpace: 'nowrap',
  },
  defaultVariants: { size: 'default', variant: 'default' },
  variants: {
    size: {
      default: {
        fontSize: { base: 'sm', sm: 'xs' },
        height: { base: '5.5', sm: '4.5' },
        minWidth: { base: '5.5', sm: '4.5' },
        paddingInline: 'calc(token(spacing.1) - 1px)',
      },
      sm: {
        borderRadius: '4px',
        fontSize: { base: 'xs', sm: '10px' },
        height: { base: '5', sm: '4' },
        minWidth: { base: '5', sm: '4' },
        paddingInline: 'calc(token(spacing.1) - 1px)',
      },
    },
    variant: {
      accent: { backgroundColor: 'accent', borderRadius: 'full', color: 'accent-foreground', fontWeight: 'semibold' },
      default: { backgroundColor: 'primary', color: 'primary-foreground' },
      eyebrow: {
        backgroundColor: 'secondary',
        borderRadius: 'full',
        color: 'secondary-foreground',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      },
      overlay: { backdropFilter: 'blur(4px)', backgroundColor: 'white/20', borderRadius: 'full', color: 'white', fontWeight: 'semibold' },
      secondary: { backgroundColor: 'secondary', color: 'secondary-foreground' },
    },
  },
})

export type BadgeProps = Pick<React.ComponentProps<'span'>, 'children'> & RecipeVariantProps<typeof badgeRecipe>

export const Badge = ({ children, size, variant }: BadgeProps): React.ReactElement => (
  <span className={badgeRecipe({ size, variant })} data-slot="badge">
    {children}
  </span>
)
