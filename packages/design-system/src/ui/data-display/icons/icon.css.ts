import { theme } from '@recipe-organizer/design-system/theme'
import { fallbackVar, style } from '@vanilla-extract/css'

export const element = style({
  color: 'currentColor',
  flexShrink: 0,
  height: 'var(--owner-icon-size, 1em)',
  marginInline: fallbackVar('var(--owner-icon-margin-inline)', theme.spacing(0)),
  opacity: 'var(--owner-icon-opacity, 1)',
  width: 'var(--owner-icon-size, 1em)',
})

export const element2 = style({
  color: 'currentColor',
  flexShrink: 0,
  height: 'var(--owner-icon-size, 20px)',
  marginInline: fallbackVar('var(--owner-icon-margin-inline)', theme.spacing(0)),
  opacity: 'var(--owner-icon-opacity, 1)',
  width: 'var(--owner-icon-size, 20px)',
})

export const element3 = style({
  color: 'currentColor',
  flexShrink: 0,
  height: 'var(--owner-icon-size, 18px)',
  marginInline: fallbackVar('var(--owner-icon-margin-inline)', theme.spacing(0)),
  opacity: 'var(--owner-icon-opacity, 1)',
  width: 'var(--owner-icon-size, 18px)',
})

export const element4 = style({
  color: 'currentColor',
  flexShrink: 0,
  height: 'var(--owner-icon-size, 16px)',
  marginInline: fallbackVar('var(--owner-icon-margin-inline)', theme.spacing(0)),
  opacity: 'var(--owner-icon-opacity, 1)',
  width: 'var(--owner-icon-size, 16px)',
})

export const element5 = style({
  color: 'currentColor',
  flexShrink: 0,
  height: 'var(--owner-icon-size, 28px)',
  marginInline: fallbackVar('var(--owner-icon-margin-inline)', theme.spacing(0)),
  opacity: 'var(--owner-icon-opacity, 1)',
  width: 'var(--owner-icon-size, 28px)',
})

export const element6 = style({
  color: 'currentColor',
  flexShrink: 0,
  height: 'var(--owner-icon-size, 12px)',
  marginInline: fallbackVar('var(--owner-icon-margin-inline)', theme.spacing(0)),
  opacity: 'var(--owner-icon-opacity, 1)',
  width: 'var(--owner-icon-size, 12px)',
})
