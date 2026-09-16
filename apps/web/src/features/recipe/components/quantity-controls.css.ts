import { style } from '@vanilla-extract/css'

export const container = style({
  alignItems: 'center',
  WebkitBackdropFilter: 'blur(12px)',
  backdropFilter: 'blur(12px)',
  background: 'color-mix(in srgb, var(--colors-white) 15%, transparent)',
  borderRadius: 'var(--radii-xl)',
  display: 'flex',
  gap: 'var(--spacing-2-5)',
  justifyContent: 'center',
  padding: 'var(--spacing-1)',
  outline: '1',
  outlineColor: 'color-mix(in srgb, var(--colors-white) 20%, transparent)',
  width: 'var(--sizes-full)',
})

export const text = style({
  color: 'var(--colors-white)',
  fontSize: '13px',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 'var(--font-weights-bold)',
  minWidth: 'var(--sizes-18)',
  textAlign: 'center',
})

export const container2 = style({
  alignItems: 'center',
  background: 'var(--colors-card)',
  borderRadius: 'var(--radii-2xl)',
  borderWidth: '1px',
  display: 'flex',
  gap: 'var(--spacing-3)',
  justifyContent: 'space-between',
  padding: 'var(--spacing-2)',
  paddingLeft: 'var(--spacing-4)',
})

export const container3 = style({
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--spacing-3)',
})

export const text2 = style({
  fontSize: 'var(--font-sizes-sm)',
  fontWeight: 'var(--font-weights-bold)',
})

export const container4 = style({
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--spacing-2)',
})

export const text3 = style({
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 'var(--font-weights-bold)',
  minWidth: 'var(--sizes-5)',
  textAlign: 'center',
})
