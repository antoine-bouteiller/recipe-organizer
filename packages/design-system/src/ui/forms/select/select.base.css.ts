import { style, globalStyle } from '@vanilla-extract/css'

export const positionerClassName = style({
  WebkitUserSelect: 'none',
  userSelect: 'none',
  zIndex: 50,
})

export const popupClassName = style({
  color: 'var(--colors-foreground)',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  transformOrigin: 'var(--transform-origin)',
})

export const popupFrameClassName = style({
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
  height: 'var(--sizes-full)',
  minWidth: 'var(--anchor-width)',
  position: 'relative',
})

export const listClassName = style({
  maxHeight: 'var(--available-height)',
  overflowY: 'auto',
  padding: 'var(--spacing-1)',
})

export const arrowClassName = style({
  alignItems: 'center',
  cursor: 'default',
  display: 'flex',
  height: 'var(--sizes-6)',
  justifyContent: 'center',
  position: 'relative',
  width: 'var(--sizes-full)',
  zIndex: 50,
})

export const scrollUpArrowClassName = style({
  selectors: {
    '&::before': {
      backgroundImage: 'linear-gradient(to bottom, var(--colors-popover) 50%, transparent)',
      borderStartEndRadius: 'calc(var(--radii-lg) - 1px)',
      borderStartStartRadius: 'calc(var(--radii-lg) - 1px)',
      content: '""',
      height: '200%',
      insetInline: '1px',
      pointerEvents: 'none',
      position: 'absolute',
      top: '1px',
    },
  },
})

export const scrollDownArrowClassName = style({
  selectors: {
    '&::before': {
      backgroundImage: 'linear-gradient(to top, var(--colors-popover) 50%, transparent)',
      borderEndEndRadius: 'calc(var(--radii-lg) - 1px)',
      borderEndStartRadius: 'calc(var(--radii-lg) - 1px)',
      bottom: '1px',
      content: '""',
      height: '200%',
      insetInline: '1px',
      pointerEvents: 'none',
      position: 'absolute',
    },
  },
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
    '&[data-side="none"]': {
      minWidth: 'calc(var(--anchor-width) + 20px)',
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

export const iconClassName = style({
  height: 'var(--sizes-4-5)',
  position: 'relative',
  width: 'var(--sizes-4-5)',
  '@media': {
    'screen and (min-width: 640px)': {
      height: 'var(--sizes-4)',
      width: 'var(--sizes-4)',
    },
  },
})

export const indicatorClassName = style({
  gridColumnStart: '1',
})

export const itemTextClassName = style({
  gridColumnStart: '2',
  minWidth: 'var(--sizes-0)',
})

globalStyle(`.${itemClassName} svg`, {
  flexShrink: 0,
  pointerEvents: 'none',
})
