import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: 'var(--spacing-2-5)',
})

export const container2 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
})

export const container3 = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: 'var(--spacing-1)',
  paddingTop: 'var(--spacing-2)',
})

export const heading = style({
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-xs)',
  fontWeight: 'var(--font-weights-semibold)',
  letterSpacing: 'var(--letter-spacings-wider)',
  textTransform: 'uppercase',
})

export const element = style({
  color: 'var(--colors-primary)',
  fontSize: 'var(--font-sizes-sm)',
  fontWeight: 'var(--font-weights-semibold)',
})
