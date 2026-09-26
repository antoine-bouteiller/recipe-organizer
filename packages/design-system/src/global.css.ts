import { theme } from '@recipe-organizer/design-system/theme'
import { globalKeyframes, globalLayer, globalStyle } from '@vanilla-extract/css'
import type { CSSProperties } from '@vanilla-extract/css'

const resetLayer = globalLayer('reset')
const reset = (selector: string, rules: CSSProperties) => globalStyle(selector, { '@layer': { [resetLayer]: rules } })

reset('*, ::before, ::after', {
  boxSizing: 'border-box',
  margin: theme.spacing(0),
  padding: theme.spacing(0),
  border: '0 solid',
})

reset('html', {
  lineHeight: '1.5',
  WebkitTextSizeAdjust: '100%',
  tabSize: '4',
  fontFamily: theme.fonts.sans,
  WebkitTapHighlightColor: 'transparent',
})

reset('a', {
  color: 'inherit',
  textDecoration: 'inherit',
})

reset(':-moz-focusring', {
  outline: 'auto',
})

reset('ol, ul', {
  listStyle: 'none',
})

reset('img, svg', {
  display: 'block',
})

reset('img', {
  maxWidth: '100%',
  height: 'auto',
})

reset('button, input, textarea', {
  font: 'inherit',
  fontFeatureSettings: 'inherit',
  fontVariationSettings: 'inherit',
  letterSpacing: 'inherit',
  color: 'inherit',
  borderRadius: theme.radius.none,
  backgroundColor: 'transparent',
})

reset('::placeholder', {
  opacity: '1',
  color: 'color-mix(in oklab, currentColor 50%, transparent)',
})

reset(':-moz-ui-invalid', {
  boxShadow: theme.shadows.none,
})

reset("button, input:where([type='button'], [type='reset'], [type='submit'])", {
  appearance: 'button',
})

reset("[hidden]:where(:not([hidden='until-found']))", {
  display: 'none !important',
})

globalStyle(':root', {
  vars: { '--screen-header-height': `calc(${theme.safeArea.top} + ${theme.spacing(15)})` },
})

const base = globalLayer('base')

globalStyle('*', {
  '@layer': {
    [base]: {
      borderColor: theme.colors.border,
      outlineColor: `color-mix(in oklab, ${theme.colors.ring} 50%, transparent)`,
    },
  },
})

globalStyle('body', {
  '@layer': {
    [base]: {
      background: theme.colors.muted,
      color: theme.colors.foreground,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontOpticalSizing: 'auto',
    },
  },
})

globalStyle('html:has(body > #root)', {
  scrollBehavior: 'smooth',
  height: '100%',
  overflow: 'hidden',
})

globalStyle('body:has(> #root)', {
  position: 'fixed',
  top: 0,
  isolation: 'isolate',
  display: 'flex',
  height: '100dvh',
  width: '100vw',
  flexDirection: 'column',
  overflow: 'hidden',
})

globalStyle('#root', {
  display: 'flex',
  minHeight: 0,
  flex: '1 1 0%',
  flexDirection: 'column',
})

globalStyle('body:has(> #root) *', {
  '@media': {
    '(max-width: 767px)': { scrollbarWidth: 'none' },
  },
})

globalStyle('body:has(> #root) *::-webkit-scrollbar', {
  '@media': {
    '(max-width: 767px)': { display: 'none' },
  },
})

globalKeyframes('stagger-in', {
  from: { opacity: 0, transform: `translateY(${theme.spacing(2)})` },
})

globalKeyframes('slide-in-from-right', {
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' },
})

globalKeyframes('slide-out-to-right', {
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(100%)' },
})

globalKeyframes('scale-down-to-back', {
  from: { transform: 'scale(1)', opacity: 1 },
  to: { transform: 'scale(0.92)', opacity: 0.7 },
})

globalKeyframes('scale-up-from-back', {
  from: { transform: 'scale(0.92)', opacity: 0.7 },
  to: { transform: 'scale(1)', opacity: 1 },
})

globalStyle('::view-transition-old(root)', {
  '@media': {
    '(max-width: 767px)': { animation: 'scale-down-to-back 0.3s cubic-bezier(0.32, 0.72, 0, 1) both' },
  },
})

globalStyle('::view-transition-new(root)', {
  '@media': {
    '(max-width: 767px)': { animation: 'slide-in-from-right 0.3s cubic-bezier(0.32, 0.72, 0, 1) both' },
  },
})

globalStyle(':active-view-transition-type(back)::view-transition-old(root)', {
  '@media': {
    '(max-width: 767px)': {
      animation: 'slide-out-to-right 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
      zIndex: 1,
    },
  },
})

globalStyle(':active-view-transition-type(back)::view-transition-new(root)', {
  '@media': {
    '(max-width: 767px)': {
      animation: 'scale-up-from-back 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
      zIndex: 0,
    },
  },
})

globalStyle('::view-transition-old(root), ::view-transition-new(root)', {
  '@media': {
    '(min-width: 768px)': { animation: 'none' },
  },
})

globalStyle('*, *::before, *::after', {
  '@layer': {
    [base]: {
      '@media': {
        '(prefers-reduced-motion: reduce)': {
          animationDuration: '0.01ms !important',
          animationDelay: '0ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
        },
      },
    },
  },
})

globalStyle('::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*)', {
  '@layer': {
    [base]: {
      '@media': {
        '(prefers-reduced-motion: reduce)': {
          animation: 'none !important',
        },
      },
    },
  },
})
