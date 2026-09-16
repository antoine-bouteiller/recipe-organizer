import { style, globalStyle } from '@vanilla-extract/css'

export const inputGroupClassName = style({
  selectors: {
    '&:has(:disabled)': {
      opacity: 0.64,
    },
  },
  color: 'var(--colors-foreground)',
  position: 'relative',
  width: 'var(--sizes-full)',
})

export const inputClassName = style({
  selectors: {
    '&:disabled': {
      opacity: 1,
    },
    '&:has(+ [data-slot="combobox-trigger"], + [data-slot="combobox-clear"])': {
      paddingInlineEnd: 'var(--spacing-7)',
    },
  },
  backgroundColor: 'transparent',
  height: 'var(--sizes-8-5)',
  lineHeight: '34px',
  minWidth: 'var(--sizes-0)',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingInline: 'calc(var(--spacing-3) - 1px)',
  transition: 'background-color 5000000s ease-in-out 0s',
  width: 'var(--sizes-full)',
  '@media': {
    'screen and (min-width: 640px)': {
      height: 'var(--sizes-7-5)',
      lineHeight: '30px',
    },
  },
})

export const actionClassName = style({
  selectors: {
    '&:has(+ [data-slot="combobox-clear"])': {
      display: 'none',
    },
    '&::after': {
      '@media': {
        '(pointer: coarse)': {
          content: '""',
          minHeight: 'var(--sizes-11)',
          minWidth: 'var(--sizes-11)',
          position: 'absolute',
        },
      },
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          opacity: 1,
        },
      },
    },
  },
  vars: {
    '--owner-icon-size': '18px',
    '--transition-duration': '150ms',
    '--transition-prop': 'opacity',
    '--transition-easing': 'var(--easings-in-out)',
  },
  alignItems: 'center',
  borderColor: 'transparent',
  borderRadius: 'var(--radii-md)',
  borderWidth: '1px',
  cursor: 'pointer',
  display: 'inline-flex',
  height: 'var(--sizes-8)',
  justifyContent: 'center',
  opacity: 0.8,
  outline: '2px solid transparent',
  outlineOffset: '2px',
  position: 'absolute',
  right: '.5',
  top: '50%',
  transform: 'translateY(-50%)',
  transitionDuration: '150ms',
  transitionProperty: 'opacity',
  transitionTimingFunction: 'var(--easings-in-out)',
  width: 'var(--sizes-8)',
  '@media': {
    'screen and (min-width: 640px)': {
      vars: {
        '--owner-icon-size': '16px',
      },
      height: 'var(--sizes-7)',
      width: 'var(--sizes-7)',
    },
  },
})

export const positionerClassName = style({
  WebkitUserSelect: 'none',
  userSelect: 'none',
  zIndex: 50,
})

export const frameClassName = style({
  selectors: {
    '&::before': {
      borderRadius: 'calc(var(--radii-lg) - 1px)',
      boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 4%, transparent)',
      content: '""',
      inset: 'var(--spacing-0)',
      pointerEvents: 'none',
      position: 'absolute',
    },
    '.dark &::before': {
      boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 6%, transparent)',
    },
  },
  backgroundClip: 'padding-box',
  WebkitBackgroundClip: 'padding-box',
  backgroundColor: 'var(--colors-popover)',
  borderRadius: 'var(--radii-lg)',
  borderWidth: '1px',
  boxShadow: 'var(--shadows-overlay)',
  display: 'flex',
  maxHeight: 'var(--sizes-full)',
  maxWidth: 'var(--available-width)',
  minWidth: 'var(--anchor-width)',
  position: 'relative',
  transformOrigin: 'var(--transform-origin)',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'scale, opacity',
    '--transition-easing': 'var(--easings-in-out)',
  },
  transitionDuration: '150ms',
  transitionProperty: 'scale, opacity',
  transitionTimingFunction: 'var(--easings-in-out)',
})

export const popupClassName = style({
  color: 'var(--colors-foreground)',
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  maxHeight: 'min(var(--available-height), 368px)',
})

export const itemClassName = style({
  selectors: {
    '&[data-disabled]': {
      opacity: 0.64,
      pointerEvents: 'none',
    },
    '&[data-highlighted]': {
      backgroundColor: 'var(--colors-accent)',
      color: 'var(--colors-accent-foreground)',
    },
  },
  vars: {
    '--owner-icon-size': '18px',
  },
  alignItems: 'center',
  borderRadius: 'var(--radii-sm)',
  cursor: 'default',
  display: 'grid',
  fontSize: 'var(--font-sizes-base)',
  gap: 'var(--spacing-2)',
  gridTemplateColumns: '16px 1fr',
  minHeight: 'var(--sizes-8)',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingBlock: 'var(--spacing-1)',
  paddingInlineEnd: 'var(--spacing-4)',
  paddingInlineStart: 'var(--spacing-2)',
  '@media': {
    'screen and (min-width: 640px)': {
      vars: {
        '--owner-icon-size': '16px',
      },
      fontSize: 'var(--font-sizes-sm)',
      minHeight: 'var(--sizes-7)',
    },
  },
})

export const separatorClassName = style({
  selectors: {
    '&:last-child': {
      display: 'none',
    },
  },
  backgroundColor: 'var(--colors-border)',
  height: 'var(--sizes-px)',
  marginBlock: 'var(--spacing-1)',
  marginInline: 'var(--spacing-2)',
})

export const emptyClassName = style({
  selectors: {
    '&:not(:empty)': {
      padding: 'var(--spacing-2)',
    },
  },
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-base)',
  textAlign: 'center',
  '@media': {
    'screen and (min-width: 640px)': {
      fontSize: 'var(--font-sizes-sm)',
    },
  },
})

export const listClassName = style({
  selectors: {
    '&:not(:empty)': {
      padding: 'var(--spacing-1)',
    },
    '&[data-has-overflow-y]': {
      paddingInlineEnd: 'var(--spacing-3)',
    },
  },
  scrollPaddingBlock: 'var(--spacing-1)',
})

export const addClassName = style({
  padding: 'var(--spacing-1)',
})

globalStyle(`.${actionClassName} svg`, {
  flexShrink: 0,
  pointerEvents: 'none',
})

globalStyle(`.${itemClassName} svg`, {
  flexShrink: 0,
  pointerEvents: 'none',
})
