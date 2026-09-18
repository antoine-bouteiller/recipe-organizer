import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

import * as styles from '../input/input-surface.css'

export const root = style([styles.inputSurface, { alignItems: 'center', minWidth: theme.spacing(0) }])

export const input = style({
  backgroundColor: 'transparent',
  borderRadius: theme.radius.inherit,
  height: theme.spacing(9.5),
  lineHeight: '38px',
  minWidth: theme.spacing(0),
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2.75),
  transition: 'background-color 5000000s ease-in-out 0s',
  width: '100%',
  selectors: {
    '&::placeholder, &[data-placeholder]': {
      color: `color-mix(in srgb, ${theme.colors['muted-foreground']} 72%, transparent)`,
    },
  },
  '@media': {
    'screen and (min-width: 640px)': {
      height: theme.spacing(8.5),
      lineHeight: '34px',
    },
  },
})

export const addon = style({
  vars: {
    '--owner-icon-size': '18px',
  },
  alignItems: 'center',
  cursor: 'text',
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  order: -1,
  paddingLeft: theme.spacing(2.75),
  WebkitUserSelect: 'none',
  userSelect: 'none',
  '@media': {
    'screen and (min-width: 640px)': {
      vars: {
        '--owner-icon-size': '16px',
      },
    },
  },
})

export const text = style({
  display: 'flex',
  marginInline: theme.spacing(-0.5),
  opacity: 0.8,
})
