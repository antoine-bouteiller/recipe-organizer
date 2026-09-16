import { style } from '@vanilla-extract/css'

export const storyStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-3)',
})

export const storyOutput = style({
  backgroundColor: 'var(--colors-muted)',
  borderRadius: 'var(--radii-md)',
  display: 'block',
  fontSize: 'var(--font-sizes-xs)',
  padding: 'var(--spacing-3)',
})

export const storySections = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-8)',
  minWidth: 'var(--sizes-0)',
  width: 'var(--sizes-full)',
})
