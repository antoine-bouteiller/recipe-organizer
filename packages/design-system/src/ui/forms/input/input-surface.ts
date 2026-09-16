import { cva } from '@recipe-organizer/design-system/css'

export const inputSurface = cva({
  base: {
    '&:has(:autofill)': { backgroundColor: 'foreground/4' },
    '&:has(:disabled)': { opacity: 0.64 },
    '&:has(:disabled, :focus-visible, [aria-invalid])': { '--control-shadow': '0 0 0 0 transparent' },
    '&:has(:focus-visible)': { '--control-ring': '0 0 0 3px color-mix(in oklab, token(colors.ring) 24%, transparent)', borderColor: 'ring' },
    '&:has(:focus-visible):has([aria-invalid=true])': {
      '--control-ring': '0 0 0 3px color-mix(in oklab, token(colors.destructive) 16%, transparent)',
      borderColor: 'destructive/64',
    },
    '&:has([aria-invalid=true])': { borderColor: 'destructive/36' },
    '&:not(:has(:disabled, :focus-visible, [aria-invalid=true]))::before': { boxShadow: '0 1px rgb(0 0 0 / 4%)' },
    '--control-ring': '0 0 0 0 transparent',
    '--control-shadow': '0 1px 2px 0 rgb(0 0 0 / 5%)',
    _before: { borderRadius: 'calc(token(radii.lg) - 1px)', content: '""', inset: 0, pointerEvents: 'none', position: 'absolute' },
    _dark: {
      '&:has(:autofill)': { backgroundColor: 'foreground/8' },
      '&:has(:focus-visible):has([aria-invalid=true])': {
        '--control-ring': '0 0 0 3px color-mix(in oklab, token(colors.destructive) 24%, transparent)',
      },
      '&:not(:has(:disabled, :focus-visible, [aria-invalid=true]))::before': { boxShadow: '0 -1px rgb(255 255 255 / 6%)' },
      backgroundClip: 'border-box',
    },
    backgroundClip: 'padding-box',
    borderColor: 'input',
    borderRadius: 'lg',
    borderWidth: '1px',
    boxShadow: 'var(--control-ring), var(--control-shadow)',
    color: 'foreground',
    display: 'inline-flex',
    fontSize: { base: 'base', sm: 'sm' },
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    transitionTimingFunction: 'in-out',
    width: 'full',
  },
  defaultVariants: { surface: 'default' },
  variants: {
    surface: {
      default: { backgroundColor: { _dark: 'input/32', base: 'background' } },
      glass: { alignItems: 'center', backdropFilter: 'blur(24px)', backgroundColor: { _dark: 'input/48', base: 'background/72' }, minWidth: 0 },
    },
  },
})
