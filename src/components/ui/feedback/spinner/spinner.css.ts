import { style } from '@vanilla-extract/css'

export const spinner = style({
  animation: 'spin 1s linear infinite reverse',
  vars: {
    '--owner-icon-size': '18px',
  },
})
