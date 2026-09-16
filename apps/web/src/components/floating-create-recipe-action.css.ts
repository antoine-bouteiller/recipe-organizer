import { style } from '@vanilla-extract/css'

export const container = style({
  bottom: 'var(--spacing-16)',
  position: 'fixed',
  right: 'var(--spacing-2)',
  vars: {
    '--transition-duration': '200ms',
    '--transition-prop': 'transform',
    '--transition-easing': 'ease-out',
  },
  transitionDuration: '200ms',
  transitionProperty: 'transform',
  transitionTimingFunction: 'ease-out',
  selectors: {
    '&:is(:active, [data-active])': {
      transform: 'scale(0.95)',
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          transform: 'translateY(-2px)',
        },
      },
    },
  },
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
})
