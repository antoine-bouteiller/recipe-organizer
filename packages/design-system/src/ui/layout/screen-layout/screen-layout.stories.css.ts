import { style, globalStyle } from '@vanilla-extract/css'

export const section = style({
  paddingBlock: 'var(--spacing-4)',
})

export const heading = style({
  fontSize: 'var(--font-sizes-xl)',
  fontWeight: 'var(--font-weights-semibold)',
})

export const container = style({
  borderColor: 'var(--colors-border)',
  borderRadius: 'var(--radii-lg)',
  borderWidth: '1px',
  display: 'flex',
  flexDirection: 'column',
  height: 'var(--sizes-96)',
  overflow: 'hidden',
  position: 'relative',
  transform: 'translateZ(0)',
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-8)',
  minWidth: 'var(--sizes-0)',
  width: 'var(--sizes-full)',
})

export const text = style({
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-sm)',
})

export const element = style({
  alignItems: 'center',
  backgroundColor: 'var(--colors-background)',
  borderColor: 'var(--colors-border)',
  borderTopWidth: '1px',
  bottom: 'var(--spacing-0)',
  display: 'flex',
  height: 'var(--sizes-14)',
  justifyContent: 'center',
  position: 'fixed',
  width: 'var(--sizes-full)',
})

globalStyle(`.${section} > * + *`, {
  marginTop: 'var(--spacing-4)',
})
