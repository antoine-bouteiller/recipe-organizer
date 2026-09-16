import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const field = style({ alignItems: 'flex-start', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' })

const dropzone = {
  borderColor: 'var(--colors-input)',
  borderRadius: 'var(--radii-xl)',
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
    '&:has(input:focus)': { borderColor: 'var(--colors-ring)', boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-ring) 50%, transparent)' },
    '&:hover': { backgroundColor: 'color-mix(in srgb, var(--colors-accent) 50%, transparent)' },
    '&[data-invalid]': { borderColor: 'var(--colors-destructive)' },
  },
  transitionDuration: '150ms',
  transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  transitionTimingFunction: 'var(--easings-in-out)',
  width: '100%',
} as const

export const label = recipe({
  base: {
    '@media': { '(min-width: 640px)': { fontSize: '14px', lineHeight: '16px' } },
    alignItems: 'center',
    color: 'var(--colors-foreground)',
    display: 'inline-flex',
    fontSize: '16px',
    fontWeight: 'var(--font-weights-medium)',
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
export const error = style({ color: 'var(--colors-destructive-foreground)', fontSize: '12px' })
