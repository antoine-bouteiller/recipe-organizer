import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const emptyState = style({ color: theme.colors['muted-foreground'], paddingBlock: theme.spacing(8), textAlign: 'center' })
export const userEmail = style({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })
export const searchBar = style({
  alignItems: 'center',
  background: theme.colors.muted,
  display: 'flex',
  flexShrink: 0,
  gap: theme.spacing(4),
  paddingBottom: theme.spacing(2),
})
export const tabs = style({ display: 'flex', flex: '1 1 0%', flexDirection: 'column', marginBottom: theme.spacing(-4), minHeight: theme.spacing(0) })
export const panel = style({ height: '100%', overflowY: 'auto', paddingBottom: theme.spacing(4) })
