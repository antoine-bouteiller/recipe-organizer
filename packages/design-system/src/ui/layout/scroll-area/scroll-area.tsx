import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'
import { cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

const rootRecipe = cva({ base: { height: 'full', minHeight: '0', width: 'full' } })
const viewportRecipe = cva({
  base: {
    '&[data-has-overflow-x]': { overscrollBehaviorX: 'contain' },
    '&[data-has-overflow-y]': { overscrollBehaviorY: 'contain' },
    _focusVisible: { outline: '2px solid token(colors.ring)', outlineOffset: '1px' },
    borderRadius: 'inherit',
    height: 'full',
    outline: 'none',
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    transitionTimingFunction: 'in-out',
  },
  defaultVariants: { scrollFade: false, scrollbarGutter: false },
  variants: {
    scrollFade: {
      true: {
        '--fade-size': '1.5rem',
        maskImage:
          'linear-gradient(to bottom, transparent calc(100% - min(var(--fade-size), var(--scroll-area-overflow-y-start))), black 0, black calc(100% - min(var(--fade-size), var(--scroll-area-overflow-y-end))), transparent 0)',
      },
    },
    scrollbarGutter: {
      compact: { '&[data-has-overflow-x]': { paddingBottom: '2.5' }, '&[data-has-overflow-y]': { paddingEnd: '1' } },
      true: { '&[data-has-overflow-x]': { paddingBottom: '2.5' }, '&[data-has-overflow-y]': { paddingEnd: '2.5' } },
    },
  },
})
const scrollbarRecipe = cva({
  base: {
    '&[data-hovering], &[data-scrolling]': { opacity: 1, transitionDelay: '0ms', transitionDuration: '100ms' },
    display: 'flex',
    margin: '1',
    opacity: 0,
    transition: 'opacity 150ms',
    transitionDelay: '300ms',
  },
  defaultVariants: { orientation: 'vertical' },
  variants: {
    compact: { true: { marginTop: '2' } },
    orientation: { horizontal: { flexDirection: 'column', height: '1.5' }, vertical: { width: '1.5' } },
  },
})
const thumbRecipe = cva({ base: { backgroundColor: 'foreground/20', borderRadius: 'full', flex: '1', position: 'relative' } })

export type ScrollAreaProps = Pick<ScrollAreaPrimitive.Root.Props, 'aria-label' | 'children'> & {
  scrollFade?: boolean
  scrollbarGutter?: boolean | 'compact'
}

export const ScrollArea = ({
  'aria-label': ariaLabel,
  children,
  scrollFade = false,
  scrollbarGutter = false,
}: ScrollAreaProps): React.ReactElement => (
  <ScrollAreaPrimitive.Root aria-label={ariaLabel} className={rootRecipe()} data-slot="scroll-area">
    <ScrollAreaPrimitive.Viewport className={viewportRecipe({ scrollFade, scrollbarGutter })} data-slot="scroll-area-viewport">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar compact={scrollbarGutter === 'compact'} orientation="vertical" />
    <ScrollBar compact={scrollbarGutter === 'compact'} orientation="horizontal" />
    <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
  </ScrollAreaPrimitive.Root>
)

const ScrollBar = ({ compact, orientation }: { compact: boolean; orientation: 'horizontal' | 'vertical' }): React.ReactElement => (
  <ScrollAreaPrimitive.Scrollbar className={scrollbarRecipe({ compact, orientation })} data-slot="scroll-area-scrollbar" orientation={orientation}>
    <ScrollAreaPrimitive.Thumb className={thumbRecipe()} data-slot="scroll-area-thumb" />
  </ScrollAreaPrimitive.Scrollbar>
)
