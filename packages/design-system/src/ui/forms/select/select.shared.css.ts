import { globalStyle, style, styleVariants } from '@vanilla-extract/css'

export const selectTrigger = style({
  vars: { '--owner-icon-opacity': '0.8', '--owner-icon-size': '18px' },
  '@media': {
    '(min-width: 640px)': { vars: { '--owner-icon-size': '16px' }, fontSize: '14px', minHeight: '32px' },
    '(pointer: coarse)': { selectors: { '&::after': { content: '', inset: 0, minHeight: '44px', position: 'absolute' } } },
  },
  alignItems: 'center',
  backgroundClip: 'padding-box',
  backgroundColor: 'var(--colors-background)',
  borderColor: 'var(--colors-input)',
  borderRadius: 'var(--radii-lg)',
  borderStyle: 'solid',
  borderWidth: '1px',
  color: 'var(--colors-foreground)',
  display: 'inline-flex',
  fontSize: '16px',
  gap: '8px',
  justifyContent: 'space-between',
  minHeight: '36px',
  minWidth: '144px',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingInline: 'calc(var(--spacing-3) - 1px)',
  position: 'relative',
  selectors: {
    '&::before': { borderRadius: 'calc(var(--radii-lg) - 1px)', content: '', inset: 0, pointerEvents: 'none', position: 'absolute' },
    '&:focus-visible': { borderColor: 'var(--colors-ring)', boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-ring) 24%, transparent)' },
    '&:focus-visible[aria-invalid]': {
      borderColor: 'color-mix(in srgb, var(--colors-destructive) 64%, transparent)',
      boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-destructive) 16%, transparent)',
    },
    '&:not([data-disabled], :focus-visible, [aria-invalid], [data-pressed])::before': {
      boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 4%, transparent)',
    },
    '&[aria-invalid]': { borderColor: 'color-mix(in srgb, var(--colors-destructive) 36%, transparent)', boxShadow: 'none' },
    '&[data-disabled]': { opacity: 0.64, pointerEvents: 'none' },
    '&[data-pressed]': { boxShadow: 'none' },
    '.dark &': { backgroundColor: 'color-mix(in srgb, var(--colors-input) 32%, transparent)' },
    '.dark &:focus-visible[aria-invalid]': { boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-destructive) 24%, transparent)' },
    '.dark &:not([data-disabled], :focus-visible, [aria-invalid], [data-pressed])::before': {
      boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 6%, transparent)',
    },
  },
  textAlign: 'left',
  transitionDuration: '150ms',
  transitionProperty: 'box-shadow',
  transitionTimingFunction: 'var(--easings-in-out)',
  userSelect: 'none',
  width: '100%',
})

globalStyle(`.${selectTrigger} svg`, { flexShrink: 0, pointerEvents: 'none' })

export const selectTriggerIcon = style({ marginInlineEnd: '-4px', opacity: 0.8 })
export const selectText = style({ flex: '1', overflow: 'hidden', textAlign: 'left', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })
export const selectTextState = styleVariants({ empty: { color: 'var(--colors-muted-foreground)' }, selected: {} })
