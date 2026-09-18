import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  marginTop: theme.spacing(3),
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  paddingTop: theme.spacing(5),
})

export const container4 = style({
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(4),
  '@media': {
    'screen and (min-width: 768px)': {
      padding: theme.spacing(0),
    },
  },
})

export const heading = style({
  display: 'none',
  fontFamily: theme.fonts.heading,
  fontSize: theme.fontSizes['3xl'],
  fontWeight: theme.fontWeights.bold,
  letterSpacing: theme.letterSpacings.tight,
  paddingBlock: theme.spacing(2),
  paddingInline: theme.spacing(4),
  textWrap: 'balance',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
})

export const container5 = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  paddingInline: theme.spacing(1),
  paddingTop: theme.spacing(1),
})

export const container6 = style({
  marginBlock: theme.spacing(2),
})

export const container7 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  minHeight: theme.spacing(0),
})

export const container8 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  marginBottom: theme.spacing(-4),
  minHeight: theme.spacing(0),
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
})

export const container9 = style({
  height: '100%',
  overflowY: 'auto',
  paddingBottom: theme.spacing(4),
  paddingInline: theme.spacing(2),
})

export const container10 = style({
  height: '100%',
  overflowY: 'auto',
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(4),
})

export const container11 = style({
  alignItems: 'stretch',
  display: 'none',
  gap: theme.spacing(8),
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  paddingTop: theme.spacing(4),
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'grid',
    },
  },
})

export const section = style({
  background: theme.colors.card,
  borderRadius: theme.radius['3xl'],
  boxShadow: theme.shadows.lg,
  gridColumn: 'span 2 / span 2',
  paddingBottom: theme.spacing(8),
  paddingInline: theme.spacing(8),
})

export const heading2 = style({
  fontSize: theme.fontSizes.xl,
  fontWeight: theme.fontWeights.bold,
  lineHeight: '28px',
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(8),
})

export const section2 = style({
  background: theme.colors.card,
  borderRadius: theme.radius['3xl'],
  boxShadow: theme.shadows.lg,
  gridColumn: 'span 3 / span 3',
  paddingBottom: theme.spacing(8),
  paddingInline: theme.spacing(8),
})

export const heading3 = style({
  fontSize: theme.fontSizes.xl,
  fontWeight: theme.fontWeights.bold,
  lineHeight: '28px',
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(8),
})

export const container12 = style({
  paddingBottom: theme.spacing(4),
})
