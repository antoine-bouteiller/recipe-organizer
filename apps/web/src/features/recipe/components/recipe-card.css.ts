import { style } from '@vanilla-extract/css'

export const container = style({
  background: 'color-mix(in srgb, var(--colors-white) 5%, transparent)',
  borderRadius: '30px',
  boxShadow: 'var(--shadows-lg)',
  padding: '3px',
  outline: '1',
  outlineColor: 'color-mix(in srgb, var(--colors-black) 5%, transparent)',
  vars: {
    '--shadow-color': 'color-mix(in srgb, var(--colors-primary) 10%, transparent)',
    '--transition-duration': '200ms',
    '--transition-prop': 'transform',
    '--transition-easing': 'ease-out',
  },
  transitionDuration: '200ms',
  transitionProperty: 'transform',
  transitionTimingFunction: 'ease-out',
  selectors: {
    '.dark &': {
      outlineColor: 'color-mix(in srgb, var(--colors-white) 10%, transparent)',
    },
  },
})

export const container2 = style({
  transform: 'translateY(-2px)',
})

export const container3 = style({
  transform: 'scale(0.99)',
})

export const element = style({
  background: '#1b2426',
  borderRadius: '27px',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)',
  height: 'var(--sizes-60)',
  overflow: 'hidden',
  position: 'relative',
})

export const image = style({
  height: 'var(--sizes-full)',
  inset: 'var(--spacing-0)',
  objectFit: 'cover',
  position: 'absolute',
  width: 'var(--sizes-full)',
})

export const container4 = style({
  background: 'linear-gradient(to top,rgba(8,14,14,0.93) 0%,rgba(8,14,14,0.34) 54%,rgba(8,14,14,0) 78%)',
  inset: 'var(--spacing-0)',
  pointerEvents: 'none',
  position: 'absolute',
})

export const container5 = style({
  display: 'flex',
  flexDirection: 'column',
  inset: 'var(--spacing-0)',
  position: 'absolute',
})

export const element2 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
  justifyContent: 'flex-end',
  minHeight: 'var(--sizes-0)',
  padding: 'var(--spacing-4-5)',
  paddingBottom: 'var(--spacing-0)',
})

export const container6 = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--spacing-2)',
})

export const heading = style({
  color: 'var(--colors-white)',
  fontFamily: 'var(--fonts-heading)',
  fontSize: 'var(--font-sizes-xl)',
  fontWeight: 'var(--font-weights-normal)',
  lineHeight: 'var(--line-heights-tight)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const container7 = style({
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: 'var(--spacing-4-5)',
  paddingInline: 'var(--spacing-4-5)',
  paddingTop: 'var(--spacing-2)',
})
