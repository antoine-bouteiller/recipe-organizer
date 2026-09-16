import { style, styleVariants } from '@vanilla-extract/css'

export const ingredients = styleVariants({
  embedded: { listStyle: 'none', margin: 0 },
  standalone: {
    background: 'var(--colors-card)',
    borderRadius: 'var(--radii-2xl)',
    borderStyle: 'solid',
    borderWidth: '1px',
    listStyle: 'none',
    margin: 0,
    overflow: 'hidden',
    paddingInline: '14px',
  },
})
export const ingredient = style({
  borderBottomWidth: '1px',
  fontSize: '14px',
  lineHeight: '24px',
  margin: 0,
  paddingBlock: '12px',
  selectors: { '&:last-child': { borderBottomWidth: 0 } },
})
export const ingredientLine = style({
  alignItems: 'center',
  display: 'flex',
  gap: '12px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const bullet = style({ background: 'var(--colors-primary)', borderRadius: 'var(--radii-full)', flexShrink: 0, height: '6px', width: '6px' })
export const ingredientName = style({ flex: '1' })
export const quantity = style({
  color: 'var(--colors-muted-foreground)',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 'var(--font-weights-semibold)',
})
export const group = style({ marginBottom: '16px', selectors: { '&:last-child': { marginBottom: 0 } } })
export const groupName = style({ fontWeight: 'var(--font-weights-semibold)', marginBottom: '8px', paddingInline: '4px' })
