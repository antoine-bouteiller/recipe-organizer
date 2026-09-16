import { theme } from '@recipe-organizer/design-system/theme'
import { style, styleVariants } from '@vanilla-extract/css'

const base = style({
  '@media': { '(min-width: 640px)': { fontSize: '12px', height: '18px', minWidth: '18px' } },
  alignItems: 'center',
  borderRadius: theme.radii.sm,
  display: 'inline-flex',
  fontSize: '14px',
  fontWeight: theme.fontWeights.medium,
  height: '22px',
  justifyContent: 'center',
  minWidth: '22px',
  paddingInline: `calc(${theme.spacing(1)} - 1px)`,
})

export const badge = styleVariants({
  fish: [base, { backgroundColor: theme.colors['info-subtle'], color: theme.colors['info-subtle-foreground'] }],
  meat: [base, { backgroundColor: theme.colors['destructive-subtle'], color: theme.colors['destructive-subtle-foreground'] }],
  other: [base, { backgroundColor: theme.colors['neutral-subtle'], color: theme.colors['neutral-subtle-foreground'] }],
  spices: [base],
  vegetables: [base, { backgroundColor: theme.colors['success-subtle'], color: theme.colors['success-subtle-foreground'] }],
})
