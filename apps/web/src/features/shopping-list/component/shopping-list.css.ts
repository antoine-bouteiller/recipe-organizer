import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
})

export const container3 = style({
  alignItems: 'center',
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: 'var(--spacing-3)',
  justifyContent: 'center',
  padding: 'var(--spacing-8)',
  textAlign: 'center',
})

export const container4 = style({
  alignItems: 'center',
  background: 'var(--colors-accent)',
  borderRadius: 'var(--radii-full)',
  color: 'var(--colors-primary)',
  display: 'flex',
  height: 'var(--sizes-16)',
  justifyContent: 'center',
  width: 'var(--sizes-16)',
})

export const text = style({
  fontWeight: 'var(--font-weights-medium)',
  textWrap: 'balance',
})

export const text2 = style({
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-sm)',
  textWrap: 'balance',
})

export const heading = style({
  alignItems: 'center',
  color: 'var(--colors-primary)',
  display: 'flex',
  fontSize: '11px',
  fontWeight: 'var(--font-weights-semibold)',
  gap: 'var(--spacing-1-5)',
  letterSpacing: 'var(--letter-spacings-wider)',
  marginBottom: 'var(--spacing-2)',
  paddingInline: 'var(--spacing-1)',
  textTransform: 'uppercase',
})

export const container5 = style({
  background: 'var(--colors-card)',
  borderRadius: 'var(--radii-2xl)',
  borderWidth: '1px',
  overflow: 'hidden',
  paddingInline: 'var(--spacing-3-5)',
})
