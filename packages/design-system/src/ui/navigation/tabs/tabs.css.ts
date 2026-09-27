import { theme } from '@recipe-organizer/design-system/theme'
import { globalStyle, keyframes } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

// Named on the panels scroller and hoisted to the root so the tab list can read it.
const timeline = '--swipe-tabs'
const listPadding = theme.spacing(0.5)
const listGap = theme.spacing(0.5)
// The indicator is the list's last child, so it is excluded from the tab count.
const tabCount = 'calc(sibling-count() - 1)'

const slide = keyframes({
  to: { translate: `calc((${tabCount} - 1) * (100% + ${listGap}))` },
})

const activeLabel = keyframes({
  'from, to': { color: theme.colors['card-foreground'] },
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
    zIndex: 0,
  },
})

export const indicator = recipe({
  base: {
    animationDuration: 'auto',
    animationFillMode: 'both',
    animationName: slide,
    animationTimeline: timeline,
    animationTimingFunction: 'linear',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    bottom: listPadding,
    boxShadow: theme.shadows.sm,
    left: listPadding,
    position: 'absolute',
    top: listPadding,
    width: `calc((100% - 2 * ${listPadding} - (${tabCount} - 1) * ${listGap}) / ${tabCount})`,
    zIndex: -1,
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
    // Active while the scroll position is within half a panel of this tab's panel.
    animationDuration: 'auto',
    animationName: activeLabel,
    animationRange: `calc((sibling-index() - 1.5) / (${tabCount} - 1) * 100%) calc((sibling-index() - 0.5) / (${tabCount} - 1) * 100%)`,
    animationTimeline: timeline,
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
