import { style, globalStyle } from '@vanilla-extract/css'

export const element = style({
  alignItems: 'center',
  WebkitBackdropFilter: 'blur(24px)',
  backdropFilter: 'blur(24px)',
  backgroundColor: 'color-mix(in srgb, var(--colors-background) 80%, transparent)',
  borderColor: 'color-mix(in srgb, var(--colors-border) 60%, transparent)',
  borderTopWidth: '1px',
  bottom: 'var(--spacing-0)',
  display: 'flex',
  height: 'var(--sizes-14)',
  paddingInline: 'var(--spacing-4)',
  position: 'fixed',
  width: 'var(--sizes-full)',
  zIndex: 10,
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
})

export const tabBarItemClassName = style({
  selectors: {
    '&[aria-current=page]': {
      color: 'var(--colors-primary)',
    },
    '&:is(:active, [data-active])': {
      transform: 'scale(0.97)',
    },
  },
  alignItems: 'center',
  color: 'var(--colors-muted-foreground)',
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  fontSize: 'var(--font-sizes-xs)',
  fontWeight: 'var(--font-weights-semibold)',
  gap: 'var(--spacing-1)',
  height: 'var(--sizes-12)',
  justifyContent: 'center',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'color, transform',
    '--transition-easing': 'var(--easings-out-snappy)',
  },
  transitionDuration: '150ms',
  transitionProperty: 'color, transform',
  transitionTimingFunction: 'var(--easings-out-snappy)',
})

export const iconSlotClassName = style({
  vars: {
    '--owner-icon-size': '24px',
  },
})

export const activeIconSlotClassName = style({
  display: 'none',
})

globalStyle(`.${tabBarItemClassName}[aria-current=page] [data-slot=tab-bar-item-icon-active]`, {
  display: 'inline',
})

globalStyle(`.${tabBarItemClassName}[aria-current=page] [data-slot=tab-bar-item-icon-inactive]`, {
  display: 'none',
})
