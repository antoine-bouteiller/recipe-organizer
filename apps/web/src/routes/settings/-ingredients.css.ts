import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  alignItems: 'center',
  background: theme.colors.muted,
  display: 'flex',
  flexShrink: 0,
  gap: theme.spacing(4),
  paddingBottom: theme.spacing(2),
  position: 'sticky',
  top: 'var(--screen-header-height)',
  zIndex: 10,
  '@media': {
    'screen and (min-width: 768px)': {
      top: theme.spacing(0),
    },
  },
})

export const text = style({
  color: theme.colors['muted-foreground'],
  paddingBlock: theme.spacing(8),
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
