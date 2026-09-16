import { style, globalStyle } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-8)',
  minWidth: 'var(--sizes-0)',
  width: 'var(--sizes-full)',
})

export const container2 = style({
  borderColor: 'var(--colors-border)',
  borderRadius: 'var(--radii-2xl)',
  borderWidth: '1px',
  padding: 'var(--spacing-4)',
  width: 'var(--sizes-80)',
})

globalStyle(`.${container2} > * + *`, {
  marginTop: 'var(--spacing-3)',
})
