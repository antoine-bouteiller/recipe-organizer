import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

import { inputSurface } from '../input/input-surface.css'

export const root = style([inputSurface(), { alignItems: 'center', minWidth: theme.spacing(0) }])

export const inputClassName = style({
  backgroundColor: 'transparent',
  borderRadius: 'inherit',
  height: theme.spacing(9.5),
  lineHeight: '38px',
  minWidth: theme.spacing(0),
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingLeft: theme.spacing(2),
  paddingRight: `calc(${theme.spacing(3)} - 1px)`,
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

export const addonClassName = style({
  vars: {
    '--owner-icon-size': '18px',
  },
  alignItems: 'center',
  cursor: 'text',
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  order: -1,
  paddingLeft: `calc(${theme.spacing(3)} - 1px)`,
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
  marginInline: `calc(${theme.spacing(0.5)} * -1)`,
  opacity: 0.8,
})
