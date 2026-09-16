import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { cva } from '@recipe-organizer/design-system/css'
import { type ReactElement } from 'react'

import { type PopoverProps } from './popover'

const positionerClassName = cva({
  base: {
    '&[data-instant]': { transition: 'none' },
    height: 'var(--positioner-height)',
    maxWidth: 'var(--available-width)',
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'top, left, right, bottom, transform',
    transitionTimingFunction: 'in-out',
    width: 'var(--positioner-width)',
    zIndex: '50',
  },
})
const popupClassName = cva({
  base: {
    '&:has([data-slot=calendar])': { _before: { borderRadius: 'calc(token(radii.xl) - 1px)' }, borderRadius: 'xl' },
    '&[data-starting-style]': { opacity: '0', scale: '0.98' },
    _before: {
      borderRadius: 'calc(token(radii.lg) - 1px)',
      boxShadow: '0 1px color-mix(in oklab, token(colors.black) 4%, transparent)',
      content: '""',
      inset: '0',
      pointerEvents: 'none',
      position: 'absolute',
    },
    _dark: { _before: { boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 6%, transparent)' } },
    backgroundClip: 'padding-box',
    backgroundColor: 'popover',
    borderRadius: 'lg',
    borderWidth: '1px',
    boxShadow: 'overlay',
    color: 'popover-foreground',
    display: 'flex',
    height: 'var(--popup-height, auto)',
    outline: 'none',
    position: 'relative',
    transformOrigin: 'var(--transform-origin)',
    transitionDuration: '150ms',
    transitionProperty: 'width, height, scale, opacity',
    transitionTimingFunction: 'in-out',
    width: 'var(--popup-width, auto)',
  },
})
const viewportClassName = cva({
  base: {
    '& :is([data-current], [data-previous])': {
      opacity: '1',
      transition: 'opacity 150ms token(easings.in-out)',
      width: 'calc(var(--popup-width) - 2 * var(--viewport-inline-padding) - 2px)',
    },
    '& :is([data-current], [data-previous]):is([data-ending-style], [data-starting-style])': { opacity: '0' },
    '&:has([data-slot=calendar])': { padding: '2' },
    '&:not([data-transitioning])': { overflowY: 'auto' },
    '&[data-instant]': { transition: 'none' },
    '--viewport-inline-padding': 'token(spacing.4)',
    borderRadius: 'inherit',
    height: 'full',
    maxHeight: 'var(--available-height)',
    overflow: 'clip',
    paddingBlock: '4',
    paddingInline: 'var(--viewport-inline-padding)',
    position: 'relative',
  },
})

type TriggerProps = Pick<PopoverPrimitive.Trigger.Props, 'render'>

const PopoverTrigger = ({ render }: TriggerProps): ReactElement => <PopoverPrimitive.Trigger data-slot="popover-trigger" render={render} />
const PopoverContent = ({ children }: Pick<PopoverProps, 'children'>): ReactElement => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner align="center" className={positionerClassName()} data-slot="popover-positioner" side="bottom" sideOffset={4}>
      <PopoverPrimitive.Popup className={popupClassName()} data-slot="popover-popup">
        <PopoverPrimitive.Viewport className={viewportClassName()} data-slot="popover-viewport">
          {children}
        </PopoverPrimitive.Viewport>
      </PopoverPrimitive.Popup>
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
)
const PopoverBase = ({ trigger, children }: PopoverProps): ReactElement => (
  <PopoverPrimitive.Root>
    <PopoverTrigger render={trigger} />
    <PopoverContent>{children}</PopoverContent>
  </PopoverPrimitive.Root>
)
export default PopoverBase
