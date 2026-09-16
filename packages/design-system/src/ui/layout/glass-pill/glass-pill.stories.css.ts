import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const container = style({
  background: `linear-gradient(to bottom right, color-mix(in srgb, ${theme.colors.primary} 30%, transparent), ${theme.colors.background}, ${theme.colors.muted})`,
  borderRadius: theme.radii.xl,
  padding: theme.spacing(6),
})

export const container2 = style({
  paddingBlock: theme.spacing(2),
  paddingInline: theme.spacing(4),
  width: 'fit-content',
})

export const text = style({
  fontWeight: theme.fontWeights.medium,
})

globalStyle(`.${container} > * + *`, {
  marginTop: theme.spacing(3),
})
