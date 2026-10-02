import { theme } from '@recipe-organizer/design-system/theme'
import { style, styleVariants } from '@vanilla-extract/css'

export const container = style(['stagger-in-45', { position: 'relative' }])
const cardBase = style({
  alignItems: 'center',
  background: theme.colors.card,
  borderRadius: theme.radius['2xl'],
  borderWidth: '1px',
  display: 'flex',
  gap: theme.spacing(3),
  padding: theme.spacing(2.5),
})
export const card = styleVariants({ withAction: [cardBase, { paddingRight: theme.spacing(14) }], withoutAction: [cardBase] })
export const image = style({ borderRadius: theme.radius.xl, flexShrink: 0, height: '60px', objectFit: 'cover', width: '60px' })
export const content = style({ display: 'flex', flex: '1', flexDirection: 'column', gap: theme.spacing(1.5), minWidth: 0 })
export const name = style({
  color: theme.colors.foreground,
  fontWeight: theme.fontWeights.bold,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const badges = style({ display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1.5) })
export const action = style({ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' })
