import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const themeToggle = style({
  display: 'block',
  marginBottom: theme.spacing(4),
  width: '100%',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
})

export const sections = style({
  display: 'grid',
  gap: theme.spacing(4),
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
})

export const sectionLink = style({
  cursor: 'pointer',
  height: '100%',
})

export const sectionCard = style({
  alignItems: 'flex-start',
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(4),
})

export const sectionContent = style({
  alignItems: 'flex-start',
  display: 'flex',
  flex: '1 1 0%',
  gap: theme.spacing(3),
})

export const sectionIcon = style({
  background: `color-mix(in srgb, ${theme.colors.primary} 10%, transparent)`,
  borderRadius: theme.radius.lg,
  color: theme.colors.primary,
  padding: theme.spacing(2),
})

export const sectionDetails = style({
  flex: '1 1 0%',
})

export const sectionTitle = style({
  fontWeight: theme.fontWeights.semibold,
})

export const sectionDescription = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.sm,
  marginTop: theme.spacing(1),
})

export const sectionCaret = style({
  color: theme.colors['muted-foreground'],
  flexShrink: 0,
})
