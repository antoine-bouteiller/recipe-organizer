import { style } from '@vanilla-extract/css'

export const text = style({
  color: 'var(--colors-muted-foreground)',
  paddingBlock: 'var(--spacing-8)',
  textAlign: 'center',
})

export const text2 = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const container = style({
  alignItems: 'center',
  background: 'var(--colors-muted)',
  display: 'flex',
  flexShrink: 0,
  gap: 'var(--spacing-4)',
  paddingBottom: 'var(--spacing-2)',
})

export const container2 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  marginBottom: 'calc(var(--spacing-4) * -1)',
  minHeight: 'var(--sizes-0)',
})

export const container3 = style({
  height: 'var(--sizes-full)',
  overflowY: 'auto',
  paddingBottom: 'var(--spacing-4)',
})

export const container4 = style({
  height: 'var(--sizes-full)',
  overflowY: 'auto',
  paddingBottom: 'var(--spacing-4)',
})

export const container5 = style({
  height: 'var(--sizes-full)',
  overflowY: 'auto',
  paddingBottom: 'var(--spacing-4)',
})
