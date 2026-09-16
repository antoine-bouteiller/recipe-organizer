import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const toolbarClassName = style({
  vars: {
    '--owner-icon-margin-inline': '0',
    '--owner-icon-opacity': '1',
  },
  backgroundColor: theme.colors.card,
  borderRadius: theme.radii.xl,
  borderWidth: '1px',
  color: theme.colors['card-foreground'],
  display: 'flex',
  gap: theme.spacing(2),
  overflow: 'auto',
  padding: theme.spacing(1),
  position: 'relative',
  width: '100%',
})

export const toolbarGroupClassName = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
})

export const toolbarButtonClassName = style({
  vars: {
    '--owner-icon-margin-inline': '-2px',
    '--owner-icon-opacity': '0.8',
    '--owner-icon-size': '18px',
  },
  alignItems: 'center',
  borderColor: 'transparent',
  borderRadius: theme.radii.lg,
  borderWidth: '1px',
  cursor: 'pointer',
  display: 'inline-flex',
  fontSize: theme.fontSizes.base,
  fontWeight: theme.fontWeights.medium,
  gap: theme.spacing(2),
  height: theme.spacing(9),
  justifyContent: 'center',
  minWidth: theme.spacing(9),
  paddingInline: `calc(${theme.spacing(2)} - 1px)`,
  position: 'relative',
  WebkitUserSelect: 'none',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  selectors: {
    '&[data-disabled], &:disabled': {
      opacity: 0.64,
      pointerEvents: 'none',
    },
    '&::after': {
      '@media': {
        '(pointer: coarse)': {
          display: 'block',
        },
      },
      content: '""',
      display: 'none',
      inset: theme.spacing(0),
      minHeight: theme.spacing(11),
      minWidth: theme.spacing(11),
      position: 'absolute',
    },
    '&:is(:focus-visible, [data-focus-visible])': {
      outline: `2px solid ${theme.colors.ring}`,
      outlineOffset: '1px',
      zIndex: 10,
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: theme.colors.accent,
        },
      },
    },
  },
  '@media': {
    'screen and (min-width: 640px)': {
      vars: {
        '--owner-icon-size': '16px',
      },
      fontSize: theme.fontSizes.sm,
      height: theme.spacing(8),
      minWidth: theme.spacing(8),
    },
  },
})

export const toolbarSeparatorClassName = style({
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
