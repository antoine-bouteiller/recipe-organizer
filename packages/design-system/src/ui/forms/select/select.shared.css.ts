import { theme } from '@recipe-organizer/design-system/theme'
import { globalStyle, style, styleVariants } from '@vanilla-extract/css'

export const selectTrigger = style({
  vars: { '--owner-icon-opacity': '0.8', '--owner-icon-size': '18px' },
  '@media': {
    '(min-width: 640px)': { vars: { '--owner-icon-size': '16px' }, fontSize: theme.fontSizes.sm, minHeight: '32px' },
    '(pointer: coarse)': { selectors: { '&::after': { content: '', inset: 0, minHeight: '44px', position: 'absolute' } } },
  },
  alignItems: 'center',
  backgroundClip: 'padding-box',
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.input,
  borderRadius: theme.radius.lg,
  borderWidth: '1px',
  color: theme.colors.foreground,
  display: 'inline-flex',
  fontSize: theme.fontSizes.base,
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  minHeight: '36px',
  minWidth: '144px',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingInline: theme.spacing(2.75),
  position: 'relative',
  selectors: {
    '&::before': { borderRadius: theme.radius.lg, content: '', inset: 0, pointerEvents: 'none', position: 'absolute' },
    '&:focus-visible': { borderColor: theme.colors.ring, boxShadow: theme.shadows.focus },
    '&:focus-visible[aria-invalid]': {
      borderColor: `color-mix(in srgb, ${theme.colors.destructive} 64%, transparent)`,
      boxShadow: theme.shadows.invalid,
    },
    '&:not([data-disabled], :focus-visible, [aria-invalid], [data-pressed])::before': {
      boxShadow: theme.shadows.edge,
    },
    '&[aria-invalid]': { borderColor: `color-mix(in srgb, ${theme.colors.destructive} 36%, transparent)`, boxShadow: theme.shadows.none },
    '&[data-disabled]': { opacity: 0.64, pointerEvents: 'none' },
    '&[data-pressed]': { boxShadow: theme.shadows.none },
    '.dark &': { backgroundColor: `color-mix(in srgb, ${theme.colors.input} 32%, transparent)` },
    '.dark &:focus-visible[aria-invalid]': { boxShadow: theme.shadows.invalid },
  },
  textAlign: 'left',
  transitionDuration: '150ms',
  transitionProperty: 'box-shadow',
  transitionTimingFunction: theme.easings['in-out'],
  userSelect: 'none',
  width: '100%',
})

globalStyle(`.${selectTrigger} svg`, { flexShrink: 0, pointerEvents: 'none' })

export const selectTriggerIcon = style({ marginInlineEnd: theme.spacing(-1), opacity: 0.8 })
export const selectText = style({ flex: '1', overflow: 'hidden', textAlign: 'left', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })
export const selectTextState = styleVariants({ empty: { color: theme.colors['muted-foreground'] }, selected: {} })
