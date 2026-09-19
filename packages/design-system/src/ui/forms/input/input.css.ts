import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const input = recipe({
  base: {
    selectors: {
      '&::-webkit-search-cancel-button, &::-webkit-search-decoration, &::-webkit-search-results-button, &::-webkit-search-results-decoration': {
        appearance: 'none',
        WebkitAppearance: 'none',
      },
      '&::file-selector-button': {
        backgroundColor: 'transparent',
        color: theme.colors.foreground,
        fontSize: theme.fontSizes.sm,
        fontWeight: theme.fontWeights.medium,
        marginInlineEnd: theme.spacing(3),
      },
      '&[type=file]': {
        color: theme.colors['muted-foreground'],
      },
      '&::placeholder, &[data-placeholder]': {
        color: `color-mix(in srgb, ${theme.colors['muted-foreground']} 72%, transparent)`,
      },
    },
    backgroundColor: 'transparent',
    borderRadius: theme.radius.lg,
    height: theme.spacing(8.5),
    lineHeight: '34px',
    minWidth: theme.spacing(0),
    outline: 'none',
    paddingInline: theme.spacing(2.75),
    transition: 'background-color 5000000s ease-in-out 0s',
    width: '100%',
    '@media': {
      'screen and (min-width: 640px)': {
        height: theme.spacing(7.5),
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
        height: theme.spacing(9.5),
        lineHeight: '38px',
        '@media': {
          'screen and (min-width: 640px)': {
            height: theme.spacing(8.5),
            lineHeight: '34px',
          },
        },
      },
    },
  },
})
