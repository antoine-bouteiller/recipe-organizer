import { style } from '@vanilla-extract/css'

export const columnClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
})

export const optionsClassName = style({
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'var(--sizes-64)',
  overflowY: 'auto',
})

export const emptyClassName = style({
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-sm)',
  paddingBlock: 'var(--spacing-4)',
  textAlign: 'center',
})

export const itemClassName = style({
  alignItems: 'center',
  borderRadius: 'var(--radii-sm)',
  cursor: 'default',
  display: 'flex',
  fontSize: 'var(--font-sizes-base)',
  gap: 'var(--spacing-2)',
  justifyContent: 'space-between',
  minHeight: 'var(--sizes-10)',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingBlock: 'var(--spacing-1-5)',
  paddingInline: 'var(--spacing-2)',
  width: 'var(--sizes-full)',
  selectors: {
    '&:is(:active, [data-active])': {
      backgroundColor: 'var(--colors-accent)',
      color: 'var(--colors-accent-foreground)',
    },
  },
})

export const truncateClassName = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const iconClassName = style({
  flexShrink: 0,
})
