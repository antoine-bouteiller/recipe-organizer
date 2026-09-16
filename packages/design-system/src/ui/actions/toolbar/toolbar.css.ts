import { style } from '@vanilla-extract/css'

export const toolbarClassName = style({
  vars: {
    '--owner-icon-margin-inline': '0',
    '--owner-icon-opacity': '1',
  },
  backgroundColor: 'var(--colors-card)',
  borderRadius: 'var(--radii-xl)',
  borderWidth: '1px',
  color: 'var(--colors-card-foreground)',
  display: 'flex',
  gap: 'var(--spacing-2)',
  overflow: 'auto',
  padding: 'var(--spacing-1)',
  position: 'relative',
  width: 'var(--sizes-full)',
})

export const toolbarGroupClassName = style({
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--spacing-1)',
})

export const toolbarButtonClassName = style({
  vars: {
    '--owner-icon-margin-inline': '-2px',
    '--owner-icon-opacity': '0.8',
    '--owner-icon-size': '18px',
  },
  alignItems: 'center',
  borderColor: 'transparent',
  borderRadius: 'var(--radii-lg)',
  borderWidth: '1px',
  cursor: 'pointer',
  display: 'inline-flex',
  fontSize: 'var(--font-sizes-base)',
  fontWeight: 'var(--font-weights-medium)',
  gap: 'var(--spacing-2)',
  height: 'var(--sizes-9)',
  justifyContent: 'center',
  minWidth: 'var(--sizes-9)',
  paddingInline: 'calc(var(--spacing-2) - 1px)',
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
      inset: 'var(--spacing-0)',
      minHeight: 'var(--sizes-11)',
      minWidth: 'var(--sizes-11)',
      position: 'absolute',
    },
    '&:is(:focus-visible, [data-focus-visible])': {
      outline: '2px solid var(--colors-ring)',
      outlineOffset: '1px',
      zIndex: 10,
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: 'var(--colors-accent)',
        },
      },
    },
  },
  '@media': {
    'screen and (min-width: 640px)': {
      vars: {
        '--owner-icon-size': '16px',
      },
      fontSize: 'var(--font-sizes-sm)',
      height: 'var(--sizes-8)',
      minWidth: 'var(--sizes-8)',
    },
  },
})

export const toolbarSeparatorClassName = style({
  selectors: {
    '&[data-orientation=horizontal]': {
      height: '1px',
      marginBlock: 'var(--spacing-0-5)',
      marginInline: 'var(--spacing-0)',
      width: 'var(--sizes-full)',
    },
  },
  alignSelf: 'stretch',
  backgroundColor: 'var(--colors-border)',
  flexShrink: 0,
  marginBlock: 'var(--spacing-1-5)',
  width: '1px',
})
