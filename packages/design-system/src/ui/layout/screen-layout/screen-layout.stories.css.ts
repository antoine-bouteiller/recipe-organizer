import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const section = style({
  paddingBlock: theme.spacing(4),
})

export const heading = style({
  fontSize: theme.fontSizes.xl,
  fontWeight: theme.fontWeights.semibold,
})

export const container = style({
  borderColor: theme.colors.border,
  borderRadius: theme.radius.lg,
  borderWidth: '1px',
  display: 'flex',
  flexDirection: 'column',
  height: theme.spacing(96),
  overflow: 'hidden',
  position: 'relative',
  transform: 'translateZ(0)',
})

export const storyLayout = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

export const text = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.sm,
})

export const element = style({
  alignItems: 'center',
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.border,
  borderTopWidth: '1px',
  bottom: theme.spacing(0),
  display: 'flex',
  height: theme.spacing(14),
  justifyContent: 'center',
  position: 'fixed',
  width: '100%',
})

globalStyle(`.${section} > * + *`, {
  marginTop: theme.spacing(4),
})
