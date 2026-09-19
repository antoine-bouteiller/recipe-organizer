import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const toolbar = style({
  vars: {
    '--owner-icon-margin-inline': '0',
    '--owner-icon-opacity': '1',
  },
  backgroundColor: theme.colors.card,
  borderRadius: theme.radius.xl,
  borderWidth: '1px',
  color: theme.colors['card-foreground'],
  display: 'flex',
  gap: theme.spacing(2),
  overflow: 'auto',
  padding: theme.spacing(1),
  position: 'relative',
  width: '100%',
})
