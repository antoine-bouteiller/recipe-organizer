import { theme } from '@recipe-organizer/design-system/theme'
import { createVar, globalStyle, keyframes } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

// Named on the panels scroller and hoisted to the root so the tab list can read it.
const timeline = '--swipe-tabs'
const listPadding = theme.spacing(0.5)
const listGap = theme.spacing(0.5)
// Registered so sibling-count() resolves on the indicator (the list's last child, excluded from the count), not on the pill that inherits it.
const tabCount = createVar({ inherits: true, initialValue: '1', syntax: '<integer>' })

const tabWidth = `calc((100% - 2 * ${listPadding} - (${tabCount} - 1) * ${listGap}) / ${tabCount})`
// Clipping a full-width copy of the labels keeps the active label color exactly within the sliding pill.
const slide = keyframes({
  from: { clipPath: `inset(${listPadding} calc(100% - ${listPadding} - ${tabWidth}) ${listPadding} ${listPadding} round ${theme.radius.md})` },
  to: { clipPath: `inset(${listPadding} ${listPadding} ${listPadding} calc(100% - ${listPadding} - ${tabWidth}) round ${theme.radius.md})` },
})

export const list = recipe({
  base: {
    alignItems: 'center',
    // The app background is already muted, so darken it slightly (mixing with foreground also works in dark mode).
    backgroundColor: `color-mix(in srgb, ${theme.colors.foreground} 6%, ${theme.colors.muted})`,
    borderRadius: theme.radius.lg,
    color: theme.colors['muted-foreground'],
    display: 'flex',
    gap: theme.spacing(0.5),
    justifyContent: 'center',
    padding: theme.spacing(0.5),
    position: 'relative',
    width: '100%',
  },
})

// The shadow lives on an unclipped wrapper because clip-path would cut it off.
export const indicator = recipe({
  base: {
    vars: {
      [tabCount]: 'calc(sibling-count() - 1)',
    },
    filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))',
    inset: theme.spacing(0),
    pointerEvents: 'none',
    position: 'absolute',
  },
})

export const indicatorPill = recipe({
  base: {
    selectors: {
      '.dark &': {
        backgroundColor: theme.colors.secondary,
        color: theme.colors['secondary-foreground'],
      },
    },
    alignItems: 'center',
    animationDuration: 'auto',
    animationFillMode: 'both',
    animationName: slide,
    animationTimeline: timeline,
    animationTimingFunction: 'linear',
    backgroundColor: theme.colors.card,
    color: theme.colors['card-foreground'],
    display: 'flex',
    gap: theme.spacing(0.5),
    height: '100%',
    justifyContent: 'center',
    padding: theme.spacing(0.5),
  },
})

export const tab = recipe({
  base: {
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${theme.colors.ring}`,
        outlineOffset: '1px',
      },
    },
    vars: {
      '--owner-icon-margin-inline': '-2px',
      '--owner-icon-size': '18px',
    },
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: theme.radius.md,
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'flex',
    flex: '1 1 0%',
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontWeights.medium,
    gap: theme.spacing(1.5),
    height: theme.spacing(9),
    justifyContent: 'center',
    paddingInline: theme.spacing(2.25),
    position: 'relative',
    whiteSpace: 'nowrap',
    '@media': {
      'screen and (min-width: 640px)': {
        vars: {
          '--owner-icon-size': '16px',
        },
        fontSize: theme.fontSizes.sm,
        height: theme.spacing(8),
      },
    },
  },
})

export const root = recipe({
  base: {
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minHeight: theme.spacing(0),
    timelineScope: timeline,
  },
})

export const panels = recipe({
  base: {
    display: 'flex',
    flex: '1 1 0%',
    minHeight: theme.spacing(0),
    overflowX: 'auto',
    overflowY: 'hidden',
    overscrollBehaviorX: 'contain',
    scrollBehavior: 'smooth',
    scrollSnapType: 'x mandatory',
    scrollTimeline: `${timeline} x`,
    scrollbarWidth: 'none',
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        scrollBehavior: 'auto',
      },
    },
  },
})

export const panel = recipe({
  base: {
    flex: '0 0 100%',
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
  },
})

globalStyle(`.${tab.classNames.base} svg`, {
  flexShrink: 0,
  pointerEvents: 'none',
})
