import { style } from '@vanilla-extract/css'

export const container = style({
  marginTop: 'var(--spacing-3)',
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-3)',
  paddingTop: 'var(--spacing-5)',
})

export const container3 = style({
  alignItems: 'center',
  display: 'flex',
  height: '100vh',
  justifyContent: 'center',
})

export const container4 = style({
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
  padding: 'var(--spacing-4)',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 'var(--spacing-0)',
    },
  },
})

export const heading = style({
  display: 'none',
  fontFamily: 'var(--fonts-heading)',
  fontSize: 'var(--font-sizes-3xl)',
  fontWeight: 'var(--font-weights-bold)',
  letterSpacing: 'var(--letter-spacings-tight)',
  paddingBlock: 'var(--spacing-2)',
  paddingInline: 'var(--spacing-4)',
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
  gap: 'var(--spacing-1-5)',
  paddingInline: 'var(--spacing-1)',
  paddingTop: 'var(--spacing-1)',
})

export const container6 = style({
  marginBlock: 'var(--spacing-2)',
})

export const container7 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  minHeight: 'var(--sizes-0)',
})

export const container8 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  marginBottom: 'calc(var(--spacing-4) * -1)',
  minHeight: 'var(--sizes-0)',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
})

export const container9 = style({
  height: 'var(--sizes-full)',
  overflowY: 'auto',
  paddingBottom: 'var(--spacing-4)',
  paddingInline: 'var(--spacing-2)',
})

export const container10 = style({
  height: 'var(--sizes-full)',
  overflowY: 'auto',
  padding: 'var(--spacing-2)',
  paddingBottom: 'var(--spacing-4)',
})

export const container11 = style({
  alignItems: 'stretch',
  display: 'none',
  gap: 'var(--spacing-8)',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  paddingTop: 'var(--spacing-4)',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'grid',
    },
  },
})

export const section = style({
  background: 'var(--colors-card)',
  borderRadius: 'var(--radii-3xl)',
  boxShadow: 'var(--shadows-lg)',
  gridColumn: 'span 2 / span 2',
  paddingBottom: 'var(--spacing-8)',
  paddingInline: 'var(--spacing-8)',
})

export const heading2 = style({
  fontSize: 'var(--font-sizes-xl)',
  fontWeight: 'var(--font-weights-bold)',
  lineHeight: '28px',
  marginBottom: 'var(--spacing-4)',
  marginTop: 'var(--spacing-8)',
})

export const section2 = style({
  background: 'var(--colors-card)',
  borderRadius: 'var(--radii-3xl)',
  boxShadow: 'var(--shadows-lg)',
  gridColumn: 'span 3 / span 3',
  paddingBottom: 'var(--spacing-8)',
  paddingInline: 'var(--spacing-8)',
})

export const heading3 = style({
  fontSize: 'var(--font-sizes-xl)',
  fontWeight: 'var(--font-weights-bold)',
  lineHeight: '28px',
  marginBottom: 'var(--spacing-4)',
  marginTop: 'var(--spacing-8)',
})

export const container12 = style({
  paddingBottom: 'var(--spacing-4)',
})
