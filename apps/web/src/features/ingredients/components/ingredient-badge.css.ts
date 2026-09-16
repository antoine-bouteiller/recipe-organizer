import { style, styleVariants } from '@vanilla-extract/css'

const base = style({
  '@media': { '(min-width: 640px)': { fontSize: '12px', height: '18px', minWidth: '18px' } },
  alignItems: 'center',
  borderRadius: 'var(--radii-sm)',
  display: 'inline-flex',
  fontSize: '14px',
  fontWeight: 'var(--font-weights-medium)',
  height: '22px',
  justifyContent: 'center',
  minWidth: '22px',
  paddingInline: 'calc(var(--spacing-1) - 1px)',
})

export const badge = styleVariants({
  fish: [base, { backgroundColor: 'var(--colors-blue-200)', color: 'var(--colors-blue-600)' }],
  meat: [base, { backgroundColor: 'var(--colors-red-200)', color: 'var(--colors-red-600)' }],
  other: [base, { backgroundColor: 'var(--colors-zinc-200)', color: 'var(--colors-zinc-700)' }],
  spices: [base],
  vegetables: [base, { backgroundColor: 'var(--colors-emerald-100)', color: 'var(--colors-emerald-600)' }],
})
