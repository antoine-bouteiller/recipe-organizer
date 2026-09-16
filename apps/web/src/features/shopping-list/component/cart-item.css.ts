import { style, styleVariants } from '@vanilla-extract/css'

export const item = style({
  alignItems: 'center',
  borderBottomWidth: '1px',
  display: 'flex',
  gap: '12px',
  paddingBlock: '12px',
  selectors: { '&:last-child': { borderBottomWidth: 0 } },
  textAlign: 'left',
  width: '100%',
})
export const check = style({
  alignItems: 'center',
  borderColor: 'color-mix(in srgb, var(--colors-muted-foreground) 40%, transparent)',
  borderRadius: 'var(--radii-full)',
  borderStyle: 'solid',
  borderWidth: '2px',
  display: 'flex',
  flexShrink: 0,
  height: '22px',
  justifyContent: 'center',
  width: '22px',
})
export const checkState = styleVariants({
  checked: { background: 'var(--colors-primary)', borderColor: 'var(--colors-primary)', color: 'var(--colors-white)' },
  unchecked: {},
})
export const details = style({ alignItems: 'center', display: 'flex', flex: '1', gap: '8px', justifyContent: 'space-between' })
export const detailsState = styleVariants({ checked: { color: 'var(--colors-muted-foreground)', textDecoration: 'line-through' }, unchecked: {} })
export const quantities = style({
  alignItems: 'flex-end',
  color: 'var(--colors-muted-foreground)',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '14px',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 'var(--font-weights-semibold)',
})
export const fallbackQuantity = style({ fontSize: '12px' })
