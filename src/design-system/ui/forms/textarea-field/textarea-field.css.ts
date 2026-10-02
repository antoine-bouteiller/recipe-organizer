import { style } from '@vanilla-extract/css'

import { theme } from '@/design-system/theme'

export const textarea = style({
  selectors: {
    '&::placeholder': {
      color: `color-mix(in srgb, ${theme.colors['muted-foreground']} 72%, transparent)`,
    },
  },
  backgroundColor: 'transparent',
  borderRadius: theme.radius.lg,
  fieldSizing: 'content',
  minHeight: theme.spacing(16),
  minWidth: theme.spacing(0),
  outline: 'none',
  paddingBlock: theme.spacing(1.5),
  paddingInline: theme.spacing(2.75),
  resize: 'vertical',
  width: '100%',
})
