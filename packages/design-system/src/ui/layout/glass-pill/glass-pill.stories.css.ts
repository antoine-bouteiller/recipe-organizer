import { style, globalStyle } from '@vanilla-extract/css'

export const container = style({
  background:
    'linear-gradient(to bottom right, color-mix(in srgb, var(--colors-primary) 30%, transparent), var(--colors-background), var(--colors-muted))',
  borderRadius: 'var(--radii-xl)',
  padding: 'var(--spacing-6)',
})

export const container2 = style({
  paddingBlock: 'var(--spacing-2)',
  paddingInline: 'var(--spacing-4)',
  width: 'fit-content',
})

export const text = style({
  fontWeight: 'var(--font-weights-medium)',
})

globalStyle(`.${container} > * + *`, {
  marginTop: 'var(--spacing-3)',
})
