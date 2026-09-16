import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const subrecipeContentInset = style({
  paddingInlineStart: theme.spacing(4),
})

export const subrecipeLoading = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  paddingBlock: theme.spacing(4),
})

export const subrecipeTrigger = style({
  backgroundColor: `color-mix(in oklab, ${theme.colors.muted} 30%, transparent)`,
  borderColor: `color-mix(in oklab, ${theme.colors['muted-foreground']} 50%, transparent)`,
  borderRadius: theme.radii.lg,
  borderStyle: 'dashed',
  borderWidth: '2px',
  cursor: 'pointer',
  padding: theme.spacing(4),
  textAlign: 'start',
  width: '100%',
})
