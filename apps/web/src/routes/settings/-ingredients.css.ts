import { style } from '@vanilla-extract/css'

export const container = style({
  alignItems: 'center',
  display: 'flex',
  flexShrink: 0,
  gap: 'var(--spacing-4)',
  paddingBottom: 'var(--spacing-2)',
  position: 'sticky',
  top: 'var(--screen-header-height)',
  zIndex: 10,
  '@media': {
    'screen and (min-width: 768px)': {
      background: 'var(--colors-muted)',
      top: 'var(--spacing-0)',
    },
  },
})

export const text = style({
  color: 'var(--colors-muted-foreground)',
  paddingBlock: 'var(--spacing-8)',
  textAlign: 'center',
})

export const text2 = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const text3 = style({
  aspectRatio: '1 / 1',
  '@media': {
    'screen and (min-width: 768px)': {
      aspectRatio: 'auto',
    },
  },
})

export const text4 = style({
  display: 'none',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
})
