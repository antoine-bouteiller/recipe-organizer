import { globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const inputGroupClassName = recipe({
  base: {
    selectors: {
      '&:has(:disabled)': {
        opacity: 0.64,
      },
      '&:not(:has(> [data-width=full]))': {
        width: 'fit-content',
      },
    },
    color: 'var(--colors-foreground)',
    position: 'relative',
    width: 'var(--sizes-full)',
  },
})

export const inputClassName = recipe({
  base: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    boxShadow: 'none',
    color: 'var(--colors-foreground)',
    fontSize: 'var(--font-sizes-base)',
    height: 'var(--sizes-9-5)',
    lineHeight: '38px',
    minWidth: 'var(--sizes-0)',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    paddingInlineEnd: 'var(--spacing-3)',
    paddingInlineStart: 'calc(34px - 1px)',
    transition: 'background-color 5000000s ease-in-out 0s',
    width: 'var(--sizes-full)',
    selectors: {
      '&::placeholder, &[data-placeholder]': {
        color: 'color-mix(in srgb, var(--colors-muted-foreground) 72%, transparent)',
      },
    },
    '@media': {
      'screen and (min-width: 640px)': {
        fontSize: 'var(--font-sizes-sm)',
        height: 'var(--sizes-8-5)',
        lineHeight: '34px',
        paddingInlineStart: 'calc(var(--spacing-8) - 1px)',
      },
    },
  },
})

export const addonClassName = recipe({
  base: {
    alignItems: 'center',
    display: 'flex',
    insetBlock: 'var(--spacing-0)',
    insetInlineStart: '1px',
    opacity: 0.8,
    paddingInlineStart: 'calc(var(--spacing-3) - 1px)',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 10,
  },
})

export const itemClassName = recipe({
  base: {
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
    alignItems: 'center',
    borderRadius: 'var(--radii-sm)',
    cursor: 'default',
    display: 'flex',
    fontSize: 'var(--font-sizes-base)',
    minHeight: 'var(--sizes-8)',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    paddingBlock: 'var(--spacing-1-5)',
    paddingInline: 'var(--spacing-2)',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    '@media': {
      'screen and (min-width: 640px)': {
        fontSize: 'var(--font-sizes-sm)',
        minHeight: 'var(--sizes-7)',
      },
    },
  },
})

export const emptyClassName = recipe({
  base: {
    selectors: {
      '&:not(:empty)': {
        paddingBlock: 'var(--spacing-6)',
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
  },
})

export const listClassName = recipe({
  base: {
    selectors: {
      '&:not(:empty)': {
        padding: 'var(--spacing-2)',
        scrollPaddingBlock: 'var(--spacing-2)',
      },
      '&[data-has-overflow-y]': {
        paddingInlineEnd: 'var(--spacing-3)',
      },
    },
  },
})

export const backdropClassName = recipe({
  base: {
    selectors: {
      '&[data-ending-style], &[data-starting-style]': {
        opacity: 0,
      },
    },
    WebkitBackdropFilter: 'blur(4px)',
    backdropFilter: 'blur(4px)',
    backgroundColor: 'color-mix(in srgb, var(--colors-black) 32%, transparent)',
    inset: 'var(--spacing-0)',
    position: 'fixed',
    transition: 'opacity 200ms',
    zIndex: 50,
  },
})

export const viewportClassName = recipe({
  base: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inset: 'var(--spacing-0)',
    paddingBlock: 'max(var(--spacing-4), 4vh)',
    paddingInline: 'var(--spacing-4)',
    position: 'fixed',
    zIndex: 50,
    '@media': {
      'screen and (min-width: 640px)': {
        paddingBlock: '10vh',
      },
    },
  },
})

export const popupClassName = recipe({
  base: {
    selectors: {
      '&[data-ending-style], &[data-starting-style]': {
        opacity: 0,
        scale: '0.98',
      },
      '&[data-nested-dialog-open]': {
        transformOrigin: 'top',
      },
      '&[data-nested][data-ending-style], &[data-nested][data-starting-style]': {
        translate: '0 32px',
      },
      '&::before': {
        backgroundColor: 'color-mix(in srgb, var(--colors-muted) 72%, transparent)',
        borderRadius: 'calc(var(--radii-2xl) - 1px)',
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
    borderRadius: 'var(--radii-2xl)',
    borderWidth: '1px',
    boxShadow: 'var(--shadows-overlay)',
    color: 'var(--colors-popover-foreground)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '420px',
    maxWidth: 'var(--sizes-xl)',
    minHeight: 'var(--sizes-0)',
    minWidth: 'var(--sizes-0)',
    opacity: 'calc(1 - 0.1 * var(--nested-dialogs))',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    position: 'relative',
    scale: 'calc(1 - 0.1 * var(--nested-dialogs))',
    vars: {
      '--transition-duration': '200ms',
      '--transition-prop': 'scale, opacity, translate',
      '--transition-easing': 'var(--easings-in-out)',
    },
    transitionDuration: '200ms',
    transitionProperty: 'scale, opacity, translate',
    transitionTimingFunction: 'var(--easings-in-out)',
    translate: '0 calc(-20px * var(--nested-dialogs))',
    width: 'var(--sizes-full)',
  },
})

export const panelClassName = recipe({
  base: {
    selectors: {
      '&:not(:has(+ [data-slot=command-footer]))': {
        borderBottomLeftRadius: 'var(--radii-2xl)',
        borderBottomRightRadius: 'var(--radii-2xl)',
        clipPath: 'inset(0 1px 1px 1px round 0 0 calc(var(--radii-2xl) - 1px) calc(var(--radii-2xl) - 1px))',
        WebkitClipPath: 'inset(0 1px 1px 1px round 0 0 calc(var(--radii-2xl) - 1px) calc(var(--radii-2xl) - 1px))',
        marginBottom: '-1px',
      },
      '&::before': {
        borderTopLeftRadius: 'calc(var(--radii-xl) - 1px)',
        borderTopRightRadius: 'calc(var(--radii-xl) - 1px)',
        content: '""',
        inset: 'var(--spacing-0)',
        pointerEvents: 'none',
        position: 'absolute',
      },
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: 'var(--colors-popover)',
    borderBottomWidth: '0',
    borderTopLeftRadius: 'var(--radii-xl)',
    borderTopRightRadius: 'var(--radii-xl)',
    borderWidth: '1px',
    boxShadow: 'var(--shadows-xs)',
    clipPath: 'inset(0 1px)',
    WebkitClipPath: 'inset(0 1px)',
    marginInline: '-1px',
    minHeight: 'var(--sizes-0)',
    position: 'relative',
  },
})

export const footerClassName = recipe({
  base: {
    alignItems: 'center',
    borderBottomLeftRadius: 'calc(var(--radii-2xl) - 1px)',
    borderBottomRightRadius: 'calc(var(--radii-2xl) - 1px)',
    borderTopWidth: '1px',
    color: 'var(--colors-muted-foreground)',
    display: 'flex',
    fontSize: 'var(--font-sizes-xs)',
    gap: 'var(--spacing-2)',
    justifyContent: 'space-between',
    paddingBlock: 'var(--spacing-3)',
    paddingInline: 'var(--spacing-5)',
    position: 'relative',
  },
})

export const container = recipe({
  base: {
    paddingBlock: 'var(--spacing-1-5)',
    paddingInline: 'var(--spacing-2-5)',
  },
})

globalStyle(`.${addonClassName.classNames.base} svg:not([data-size])`, {
  height: '18px',
  width: '18px',
})

globalStyle(`.${addonClassName.classNames.base} svg`, {
  marginInline: '-2px',
})

globalStyle(`.${addonClassName.classNames.base} svg:not([data-size])`, {
  '@media': {
    'screen and (min-width: 640px)': {
      height: '16px',
      width: '16px',
    },
  },
})
