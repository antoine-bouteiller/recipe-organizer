import { recipe } from '@vanilla-extract/recipes'

export const spinner = recipe({
  base: {
    animation: 'spin 1s linear infinite',
  },
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: {
        vars: {
          '--owner-icon-size': '32px',
        },
      },
      md: {
        vars: {
          '--owner-icon-size': '18px',
        },
      },
      sm: {
        vars: {
          '--owner-icon-size': '16px',
        },
      },
    },
  },
})
