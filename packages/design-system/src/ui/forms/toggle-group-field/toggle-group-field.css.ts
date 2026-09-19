import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const wrapper = style({
  maxWidth: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
})

export const group = style({
  vars: {
    '--toggle-hit-min-width': 'auto',
  },
  display: 'flex',
  gap: theme.spacing(0.5),
  width: 'fit-content',
})

export const item = style({
  flexShrink: 0,
})
