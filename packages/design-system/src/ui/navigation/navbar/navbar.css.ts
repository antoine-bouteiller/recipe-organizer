import { style } from '@vanilla-extract/css'

export const container = style({
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--spacing-2)',
  height: 'var(--sizes-14)',
  paddingInline: 'var(--spacing-6)',
})

export const element = style({
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--spacing-1)',
})

export const container2 = style({
  alignItems: 'center',
  display: 'flex',
  flex: '1 1 0%',
  gap: 'var(--spacing-2)',
  justifyContent: 'flex-end',
})

export const navbarItemClassName = style({
  selectors: {
    '&[aria-current=page]': {
      color: 'var(--colors-foreground)',
    },
    '&[aria-current=page]::after': {
      backgroundColor: 'var(--colors-primary)',
      borderRadius: 'var(--radii-full)',
      bottom: 'calc(var(--spacing-0-5) * -1)',
      content: '""',
      height: 'var(--sizes-0-5)',
      insetInline: 'var(--spacing-2-5)',
      position: 'absolute',
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: 'var(--colors-accent)',
          color: 'var(--colors-foreground)',
        },
      },
    },
  },
  borderRadius: 'var(--radii-md)',
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-sm)',
  fontWeight: 'var(--font-weights-medium)',
  paddingBlock: 'var(--spacing-1)',
  paddingInline: 'var(--spacing-2-5)',
  position: 'relative',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
    '--transition-easing': 'var(--easings-in-out)',
  },
  transitionDuration: '150ms',
  transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  transitionTimingFunction: 'var(--easings-in-out)',
})
