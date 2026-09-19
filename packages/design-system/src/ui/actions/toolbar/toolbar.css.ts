import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const toolbarGroup = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
})

export const toolbarSeparator = style({
  selectors: {
    '&[data-orientation=horizontal]': {
      height: '1px',
      marginBlock: theme.spacing(0.5),
      marginInline: theme.spacing(0),
      width: '100%',
    },
  },
  alignSelf: 'stretch',
  backgroundColor: theme.colors.border,
  flexShrink: 0,
  marginBlock: theme.spacing(1.5),
  width: '1px',
})
