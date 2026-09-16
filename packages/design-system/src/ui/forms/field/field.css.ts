import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const field = style({ alignItems: 'flex-start', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' })

const dropzone = {
  borderColor: theme.colors.input,
  borderRadius: theme.radii.xl,
  borderStyle: 'dashed',
  borderWidth: '1px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: '16px',
  position: 'relative',
  selectors: {
    '&:has(input:disabled)': { opacity: 0.5, pointerEvents: 'none' },
    '&:has(input:focus)': { borderColor: theme.colors.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${theme.colors.ring} 50%, transparent)` },
    '&:hover': { backgroundColor: `color-mix(in srgb, ${theme.colors.accent} 50%, transparent)` },
    '&[data-invalid]': { borderColor: theme.colors.destructive },
  },
  transitionDuration: '150ms',
  transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  transitionTimingFunction: theme.easings['in-out'],
  width: '100%',
} as const

export const label = recipe({
  base: {
    '@media': { '(min-width: 640px)': { fontSize: '14px', lineHeight: '16px' } },
    alignItems: 'center',
    color: theme.colors.foreground,
    display: 'inline-flex',
    fontSize: '16px',
    fontWeight: theme.fontWeights.medium,
    gap: '8px',
    lineHeight: '18px',
  },
  variants: {
    presentation: {
      'dropzone-image': { ...dropzone, minHeight: '208px', selectors: { ...dropzone.selectors, '&:has(img)': { borderStyle: 'none' } } },
      'dropzone-video': { ...dropzone, minHeight: '128px' },
    },
  },
})
export const error = style({ color: theme.colors['destructive-foreground'], fontSize: '12px' })
