import { style, globalStyle } from '@vanilla-extract/css'

export const section = style({
  selectors: {
    '&:last-child': {
      borderBottomWidth: '0',
      paddingBottom: 'var(--spacing-0)',
    },
  },
  borderBottomWidth: '1px',
  borderColor: 'var(--colors-border)',
  paddingBottom: 'var(--spacing-8)',
})

export const heading = style({
  fontSize: 'var(--font-sizes-lg)',
  fontWeight: 'var(--font-weights-semibold)',
})

globalStyle(`.${section} > * + *`, {
  marginTop: 'var(--spacing-4)',
})
