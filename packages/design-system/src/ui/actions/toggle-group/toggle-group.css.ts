import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const wrapperClassName = style({
  maxWidth: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
})

export const groupClassName = style({
  vars: {
    '--toggle-hit-min-width': 'auto',
  },
  display: 'flex',
  gap: theme.spacing(0.5),
  width: 'fit-content',
})

export const itemClassName = style({
  flexShrink: 0,
})
