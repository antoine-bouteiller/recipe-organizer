import { theme } from '@recipe-organizer/design-system/theme'
import { style, styleVariants } from '@vanilla-extract/css'

const base = style({
  '@media': { '(min-width: 640px)': { fontSize: theme.fontSizes.xs, height: '18px', minWidth: '18px' } },
  alignItems: 'center',
  borderRadius: theme.radius.sm,
  display: 'inline-flex',
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
  height: '22px',
  justifyContent: 'center',
  minWidth: '22px',
  paddingInline: theme.spacing(0.75),
})

export const badge = styleVariants({
  fish: [base, { backgroundColor: theme.colors['info-subtle'], color: theme.colors['info-subtle-foreground'] }],
  meat: [base, { backgroundColor: theme.colors['destructive-subtle'], color: theme.colors['destructive-subtle-foreground'] }],
  other: [base, { backgroundColor: theme.colors['neutral-subtle'], color: theme.colors['neutral-subtle-foreground'] }],
  spices: [base, { backgroundColor: theme.colors['warning-subtle'], color: theme.colors['warning-subtle-foreground'] }],
  vegetables: [base, { backgroundColor: theme.colors['success-subtle'], color: theme.colors['success-subtle-foreground'] }],
})
