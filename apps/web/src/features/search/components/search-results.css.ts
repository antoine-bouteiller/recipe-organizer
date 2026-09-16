import { style } from '@vanilla-extract/css'

export const text = style({
  alignItems: 'center',
  background: 'var(--colors-accent)',
  borderRadius: 'var(--radii-full)',
  color: 'var(--colors-primary)',
  display: 'flex',
  flexShrink: 0,
  height: 'var(--sizes-9)',
  justifyContent: 'center',
  width: 'var(--sizes-9)',
})

export const text2 = style({
  vars: {
    '--owner-icon-size': '16px',
  },
  flexShrink: 0,
})

export const container = style({
  alignItems: 'center',
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: 'var(--spacing-4)',
  justifyContent: 'center',
  padding: 'var(--spacing-8)',
  textAlign: 'center',
})

export const container2 = style({
  alignItems: 'center',
  background: 'var(--colors-accent)',
  borderRadius: 'var(--radii-full)',
  color: 'var(--colors-primary)',
  display: 'flex',
  height: 'var(--sizes-16)',
  justifyContent: 'center',
  width: 'var(--sizes-16)',
})

export const text3 = style({
  color: 'var(--colors-muted-foreground)',
  textWrap: 'balance',
})

export const container3 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: 'var(--spacing-2-5)',
})

export const container4 = style({
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-xs)',
  fontWeight: 'var(--font-weights-semibold)',
})
