import { style, globalStyle } from '@vanilla-extract/css'

export const container = style({})

globalStyle(`.${container} > * + *`, {
  marginTop: 'var(--spacing-3)',
})
