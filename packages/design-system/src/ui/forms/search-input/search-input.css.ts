import { style } from '@vanilla-extract/css'

export const inputClassName = style({
  backgroundColor: 'transparent',
  borderRadius: 'inherit',
  height: 'var(--sizes-9-5)',
  lineHeight: '38px',
  minWidth: 'var(--sizes-0)',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingLeft: 'var(--spacing-2)',
  paddingRight: 'calc(var(--spacing-3) - 1px)',
  transition: 'background-color 5000000s ease-in-out 0s',
  width: 'var(--sizes-full)',
  selectors: {
    '&::placeholder, &[data-placeholder]': {
      color: 'color-mix(in srgb, var(--colors-muted-foreground) 72%, transparent)',
    },
  },
  '@media': {
    'screen and (min-width: 640px)': {
      height: 'var(--sizes-8-5)',
      lineHeight: '34px',
    },
  },
})

export const addonClassName = style({
  vars: {
    '--owner-icon-size': '18px',
  },
  alignItems: 'center',
  cursor: 'text',
  display: 'flex',
  gap: 'var(--spacing-2)',
  justifyContent: 'center',
  order: -1,
  paddingLeft: 'calc(var(--spacing-3) - 1px)',
  WebkitUserSelect: 'none',
  userSelect: 'none',
  '@media': {
    'screen and (min-width: 640px)': {
      vars: {
        '--owner-icon-size': '16px',
      },
    },
  },
})

export const text = style({
  display: 'flex',
  marginInline: 'calc(var(--spacing-0-5) * -1)',
  opacity: 0.8,
})
