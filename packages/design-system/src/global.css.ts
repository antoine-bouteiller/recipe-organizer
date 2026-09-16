import { theme } from '@recipe-organizer/design-system/theme'
import { type CSSProperties, globalKeyframes, globalLayer, globalStyle } from '@vanilla-extract/css'

const resetLayer = globalLayer('reset')
// Preserve the legacy Safari shorthand, which is absent from csstype.
const reset = (selector: string, rules: CSSProperties & { WebkitTextDecoration?: 'inherit' }) =>
  globalStyle(selector, { '@layer': { [resetLayer]: rules } })

reset('*, ::before, ::after, ::backdrop, ::file-selector-button', {
  boxSizing: 'border-box',
  margin: '0',
  padding: '0',
  border: '0 solid',
})

reset('html, :host', {
  lineHeight: '1.5',
  WebkitTextSizeAdjust: '100%',
  tabSize: '4',
  fontFamily: theme.fonts.sans,
  fontFeatureSettings: 'normal',
  fontVariationSettings: 'normal',
  WebkitTapHighlightColor: 'transparent',
})

reset('hr', {
  height: '0',
  color: 'inherit',
  borderTopWidth: '1px',
})

reset('abbr:where([title])', {
  textDecoration: 'underline dotted',
})

reset('h1, h2, h3, h4, h5, h6', {
  fontSize: 'inherit',
  fontWeight: 'inherit',
})

reset('a', {
  color: 'inherit',
  WebkitTextDecoration: 'inherit',
  textDecoration: 'inherit',
})

reset('b, strong', {
  fontWeight: 'bolder',
})

reset('code, kbd, samp, pre', {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  fontFeatureSettings: 'normal',
  fontVariationSettings: 'normal',
  fontSize: '1em',
})

reset('small', {
  fontSize: '80%',
})

reset('sub, sup', {
  fontSize: '75%',
  lineHeight: '0',
  position: 'relative',
  verticalAlign: 'baseline',
})

reset('sub', {
  bottom: '-0.25em',
})

reset('sup', {
  top: '-0.5em',
})

reset('table', {
  textIndent: '0',
  borderColor: 'inherit',
  borderCollapse: 'collapse',
})

reset(':-moz-focusring', {
  outline: 'auto',
})

reset('progress', {
  verticalAlign: 'baseline',
})

reset('summary', {
  display: 'list-item',
})

reset('ol, ul, menu', {
  listStyle: 'none',
})

reset('img, svg, video, canvas, audio, iframe, embed, object', {
  display: 'block',
  verticalAlign: 'middle',
})

reset('img, video', {
  maxWidth: '100%',
  height: 'auto',
})

reset('button, input, select, optgroup, textarea, ::file-selector-button', {
  font: 'inherit',
  fontFeatureSettings: 'inherit',
  fontVariationSettings: 'inherit',
  letterSpacing: 'inherit',
  color: 'inherit',
  borderRadius: '0',
  backgroundColor: 'transparent',
  opacity: '1',
})

reset(':where(select:is([multiple], [size])) optgroup', {
  fontWeight: 'bolder',
})

reset(':where(select:is([multiple], [size])) optgroup option', {
  paddingInlineStart: '20px',
})

reset('::file-selector-button', {
  marginInlineEnd: '4px',
})

reset('::placeholder', {
  opacity: '1',
  color: 'color-mix(in oklab, currentColor 50%, transparent)',
})

reset('textarea', {
  resize: 'vertical',
})

reset('::-webkit-search-decoration', {
  WebkitAppearance: 'none',
})

reset('::-webkit-date-and-time-value', {
  minHeight: '1lh',
  textAlign: 'inherit',
})

reset('::-webkit-datetime-edit', {
  display: 'inline-flex',
  paddingBlock: '0',
})

reset('::-webkit-datetime-edit-fields-wrapper', {
  padding: '0',
})

reset(
  '::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field',
  {
    paddingBlock: '0',
  }
)

reset('::-webkit-calendar-picker-indicator', {
  lineHeight: '1',
})

reset(':-moz-ui-invalid', {
  boxShadow: 'none',
})

reset("button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-button", {
  appearance: 'button',
})

reset('::-webkit-inner-spin-button, ::-webkit-outer-spin-button', {
  height: 'auto',
})

reset("[hidden]:where(:not([hidden='until-found']))", {
  display: 'none !important',
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
