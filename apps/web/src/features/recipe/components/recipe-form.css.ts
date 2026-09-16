import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
})

export const container2 = style({
  display: 'flex',
  gap: 'var(--spacing-2)',
})

export const container3 = style({
  display: 'flex',
  flex: '1 1 0%',
  gap: 'var(--spacing-2)',
  overflow: 'hidden',
})

export const container4 = style({
  flex: '1 1 0%',
  overflow: 'hidden',
})

export const container5 = style({
  flexShrink: 0,
  width: 'var(--sizes-28)',
})

export const container6 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
  paddingTop: 'var(--spacing-2)',
})

export const container7 = style({
  borderRadius: 'var(--radii-xl)',
  borderWidth: '1px',
  padding: 'var(--spacing-4)',
  position: 'relative',
})

export const container8 = style({
  paddingTop: 'var(--spacing-2)',
})

export const container9 = style({
  position: 'absolute',
  right: 'var(--spacing-2)',
  top: 'var(--spacing-2)',
})
