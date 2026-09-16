import { style } from '@vanilla-extract/css'

export const subrecipeContentInset = style({
  paddingInlineStart: 'var(--spacing-4)',
})

export const subrecipeLoading = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  paddingBlock: 'var(--spacing-4)',
})

export const subrecipeTrigger = style({
  backgroundColor: 'color-mix(in oklab, var(--colors-muted) 30%, transparent)',
  borderColor: 'color-mix(in oklab, var(--colors-muted-foreground) 50%, transparent)',
  borderRadius: 'var(--radii-lg)',
  borderStyle: 'dashed',
  borderWidth: '2px',
  cursor: 'pointer',
  padding: 'var(--spacing-4)',
  textAlign: 'start',
  width: 'var(--sizes-full)',
})
