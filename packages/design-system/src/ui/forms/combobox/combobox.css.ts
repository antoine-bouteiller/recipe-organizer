import { style } from '@vanilla-extract/css'

export const fallbackClassName = style({
  backgroundColor: 'var(--colors-background)',
  borderColor: 'var(--colors-input)',
  borderRadius: 'var(--radii-lg)',
  borderWidth: '1px',
  height: 'var(--sizes-9)',
  width: 'var(--sizes-full)',
})
