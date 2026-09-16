import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  position: 'sticky',
  top: 'var(--screen-header-height)',
  zIndex: 10,
  '@media': {
    'screen and (min-width: 768px)': {
      background: theme.colors.muted,
      top: theme.spacing(0),
    },
  },
})

export const container2 = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(2),
})

export const container3 = style({
  flex: '1 1 0%',
})

export const element = style({
  selectors: {
    '&[data-ending-style]': {
      height: theme.spacing(0),
    },
    '&[data-starting-style]': {
      height: theme.spacing(0),
    },
  },
  display: 'grid',
  gap: theme.spacing(2.5),
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  height: 'var(--collapsible-panel-height)',
  overflow: 'hidden',
  paddingTop: theme.spacing(2),
  vars: {
    '--transition-duration': '200ms',
    '--transition-prop': 'height',
  },
  transitionDuration: '200ms',
  transitionProperty: 'height',
})

export const container4 = style({
  width: '100%',
})

export const container5 = style({
  width: '100%',
})

export const container6 = style({
  gridColumn: 'span 2 / span 2',
})

export const container7 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  paddingTop: theme.spacing(2),
})
