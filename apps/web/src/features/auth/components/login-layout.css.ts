import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'grid',
  flex: '1 1 0%',
  padding: theme.spacing(4),
  placeItems: 'center',
})

export const formContainer = style({
  maxWidth: theme.spacing(96),
  width: '100%',
})

export const signInButtonContainer = style({
  paddingBottom: theme.spacing(6),
  paddingInline: theme.spacing(6),
})

export const image = style({
  height: theme.spacing(4),
})

export const backLinkContainer = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: theme.spacing(6),
  paddingInline: theme.spacing(6),
})
