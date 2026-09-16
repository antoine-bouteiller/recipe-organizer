import { recipe } from '@vanilla-extract/recipes'

export const inputRecipe = recipe({
  base: {
    selectors: {
      '&::-webkit-search-cancel-button, &::-webkit-search-decoration, &::-webkit-search-results-button, &::-webkit-search-results-decoration': {
        appearance: 'none',
        WebkitAppearance: 'none',
      },
      '&::file-selector-button': {
        backgroundColor: 'transparent',
        color: 'var(--colors-foreground)',
        fontSize: 'var(--font-sizes-sm)',
        fontWeight: 'var(--font-weights-medium)',
        marginInlineEnd: 'var(--spacing-3)',
      },
      '&[type=file]': {
        color: 'var(--colors-muted-foreground)',
      },
      '&::placeholder, &[data-placeholder]': {
        color: 'color-mix(in srgb, var(--colors-muted-foreground) 72%, transparent)',
      },
    },
    backgroundColor: 'transparent',
    borderRadius: 'inherit',
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
  },
  defaultVariants: {
    size: 'default',
  },
  variants: {
    size: {
      default: {},
      lg: {
        height: 'var(--sizes-9-5)',
        lineHeight: '38px',
        '@media': {
          'screen and (min-width: 640px)': {
            height: 'var(--sizes-8-5)',
            lineHeight: '34px',
          },
        },
      },
    },
  },
})
