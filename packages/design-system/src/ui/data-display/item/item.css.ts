import { globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const groupRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
  },
})

export const separatorRecipe = recipe({
  base: {
    backgroundColor: 'var(--colors-border)',
    height: '1px',
    width: 'var(--sizes-full)',
  },
})

export const itemRecipe = recipe({
  base: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 'var(--radii-md)',
    borderWidth: '1px',
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: 'var(--font-sizes-sm)',
    gap: 'var(--spacing-4)',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    padding: 'var(--spacing-4)',
    vars: {
      '--transition-duration': '100ms',
      '--transition-prop': 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
      '--transition-easing': 'var(--easings-in-out)',
    },
    transitionDuration: '100ms',
    transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
    transitionTimingFunction: 'var(--easings-in-out)',
    selectors: {
      '&:is(:focus-visible, [data-focus-visible])': {
        borderColor: 'var(--colors-ring)',
        boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-ring) 50%, transparent)',
      },
    },
  },
  defaultVariants: {
    layout: 'wrap',
    variant: 'default',
  },
  variants: {
    layout: {
      row: {
        flexWrap: 'nowrap',
      },
      wrap: {},
    },
    variant: {
      default: {
        backgroundColor: 'transparent',
      },
      outline: {
        borderColor: 'var(--colors-border)',
      },
    },
  },
})

export const mediaRecipe = recipe({
  base: {
    selectors: {
      '[data-slot=item]:has([data-slot=item-description]) &': {
        alignSelf: 'flex-start',
        transform: 'translateY(2px)',
      },
    },
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    gap: 'var(--spacing-2)',
    justifyContent: 'center',
  },
})

export const contentRecipe = recipe({
  base: {
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
  },
})

export const titleRecipe = recipe({
  base: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 'var(--font-sizes-sm)',
    fontWeight: 'var(--font-weights-medium)',
    gap: 'var(--spacing-2)',
    lineHeight: 'var(--line-heights-snug)',
    width: 'fit-content',
  },
})

export const descriptionRecipe = recipe({
  base: {
    alignItems: 'center',
    color: 'var(--colors-muted-foreground)',
    display: 'flex',
    fontSize: 'var(--font-sizes-sm)',
    fontWeight: 'var(--font-weights-normal)',
    gap: 'var(--spacing-1)',
    lineHeight: 'var(--line-heights-normal)',
    textWrap: 'balance',
  },
})

export const actionsRecipe = recipe({
  base: {
    alignItems: 'center',
    display: 'flex',
    gap: 'var(--spacing-2)',
  },
})

globalStyle(`.${descriptionRecipe.classNames.base} > a`, {
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
})

globalStyle(`.${descriptionRecipe.classNames.base} > a:hover`, {
  '@media': {
    '(hover: hover) and (pointer: fine)': {
      color: 'var(--colors-primary)',
    },
  },
})
