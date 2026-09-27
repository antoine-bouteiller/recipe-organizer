import { theme } from '@recipe-organizer/design-system/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const wrapper = style({ display: 'flex', position: 'relative', width: '100%' })

export const select = style({
  appearance: 'none',
  cursor: 'pointer',
  paddingInlineEnd: theme.spacing(8),
  selectors: { '&:disabled': { opacity: 0.64, pointerEvents: 'none' } },
})

globalStyle(`.${select} option`, { color: theme.colors.foreground })

export const icon = style({
  vars: { '--owner-icon-size': '16px' },
  alignItems: 'center',
  display: 'flex',
  insetBlock: 0,
  insetInlineEnd: theme.spacing(2),
  opacity: 0.8,
  pointerEvents: 'none',
  position: 'absolute',
})
