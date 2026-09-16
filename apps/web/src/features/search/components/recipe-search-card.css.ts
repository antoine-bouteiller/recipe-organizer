import { theme } from '@recipe-organizer/design-system/theme'
import { style, styleVariants } from '@vanilla-extract/css'

export const container = style({ position: 'relative' })
export const card = style({
  alignItems: 'center',
  background: theme.colors.card,
  borderRadius: theme.radii['2xl'],
  borderStyle: 'solid',
  borderWidth: '1px',
  display: 'flex',
  gap: '12px',
  padding: '10px',
})
export const cardPadding = styleVariants({ withAction: { paddingRight: '56px' }, withoutAction: {} })
export const image = style({ borderRadius: theme.radii.xl, flexShrink: 0, height: '60px', objectFit: 'cover', width: '60px' })
export const content = style({ display: 'flex', flex: '1', flexDirection: 'column', gap: '6px', minWidth: 0 })
export const name = style({
  color: theme.colors.foreground,
  fontWeight: theme.fontWeights.bold,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const badges = style({ display: 'flex', flexWrap: 'wrap', gap: '6px' })
export const action = style({ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' })
