import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { XIcon } from '@phosphor-icons/react'
import { createContext, useContext } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/utils/cn'

type DrawerPosition = 'right' | 'left' | 'top' | 'bottom'

const DrawerContext: React.Context<{ position: DrawerPosition }> = createContext<{ position: DrawerPosition }>({
  position: 'bottom',
})

const directionMap: Record<DrawerPosition, DrawerPrimitive.Root.Props['swipeDirection']> = {
  bottom: 'down',
  left: 'left',
  right: 'right',
  top: 'up',
}

export const Drawer = ({
  swipeDirection,
  position = 'bottom',
  ...props
}: DrawerPrimitive.Root.Props & {
  position?: DrawerPosition
}): React.ReactElement => (
  <DrawerContext.Provider value={{ position }}>
    <DrawerPrimitive.Root swipeDirection={swipeDirection ?? directionMap[position]} {...props} />
  </DrawerContext.Provider>
)

const DrawerPortal: typeof DrawerPrimitive.Portal = DrawerPrimitive.Portal

export const DrawerTrigger = (props: DrawerPrimitive.Trigger.Props): React.ReactElement => (
  <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
)

export const DrawerClose = (props: DrawerPrimitive.Close.Props): React.ReactElement => <DrawerPrimitive.Close data-slot="drawer-close" {...props} />

const DrawerBackdrop = ({ className, ...props }: DrawerPrimitive.Backdrop.Props): React.ReactElement => (
  <DrawerPrimitive.Backdrop
    className={cn(
      'fixed inset-0 z-50 bg-black/32 opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-sm transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute',
      className
    )}
    data-slot="drawer-backdrop"
    {...props}
  />
)

const DrawerViewport = ({
  className: _className,
  position,
  variant = 'default',
  ...props
}: DrawerPrimitive.Viewport.Props & {
  position?: DrawerPosition
  variant?: 'default' | 'straight' | 'inset'
}): React.ReactElement => (
  <DrawerPrimitive.Viewport
    className={cn(
      'fixed inset-0 z-50 [--bleed:--spacing(12)] [--inset:--spacing(0)]',
      'touch-none',
      position === 'bottom' && 'grid grid-rows-[1fr_auto] pt-12',
      position === 'top' && 'grid grid-rows-[auto_1fr] pb-12',
      position === 'left' && 'flex justify-start',
      position === 'right' && 'flex justify-end',
      variant === 'inset' && 'px-(--inset) sm:[--inset:--spacing(4)]',
      variant === 'inset' && position !== 'bottom' && 'pt-(--inset)',
      variant === 'inset' && position !== 'top' && 'pb-(--inset)'
    )}
    data-slot="drawer-viewport"
    {...props}
  />
)

type DrawerVariant = 'default' | 'straight' | 'inset'

const getPopupPositionClasses = (position: DrawerPosition) =>
  cn(
    position === 'bottom' &&
      'transform-[translateY(calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))] data-ending-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)+var(--inset)))] data-starting-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)+var(--inset)))] row-start-2 -mb-[max(0px,calc(var(--drawer-snap-point-offset,0px)+clamp(0,1,var(--drawer-snap-point-offset,0px)/1px)*var(--drawer-swipe-movement-y,0px)))] border-t pb-[max(0px,calc(env(safe-area-inset-bottom,0px)+var(--drawer-snap-point-offset,0px)+clamp(0,1,var(--drawer-snap-point-offset,0px)/1px)*var(--drawer-swipe-movement-y,0px)))] not-data-starting-style:not-data-ending-style:transition-[transform,box-shadow,height,background-color,margin,padding] after:inset-x-0 after:top-full after:h-(--bleed) has-data-[slot=drawer-bar]:pt-2 data-ending-style:mb-0 data-starting-style:mb-0 data-ending-style:pb-0 data-starting-style:pb-0',
    position === 'top' &&
      'data-starting-style:transform-[translateY(calc(-100%-var(--inset)))] data-ending-style:transform-[translateY(calc(-100%-var(--inset)))] transform-[translateY(var(--drawer-swipe-movement-y))] border-b after:inset-x-0 after:bottom-full after:h-(--bleed) has-data-[slot=drawer-bar]:pb-2',
    position === 'left' &&
      'data-starting-style:transform-[translateX(calc(-100%-var(--inset)))] data-ending-style:transform-[translateX(calc(-100%-var(--inset)))] transform-[translateX(var(--drawer-swipe-movement-x))] w-[calc(100%-(--spacing(12)))] max-w-md border-e after:inset-y-0 after:end-full after:w-(--bleed) has-data-[slot=drawer-bar]:pe-2',
    position === 'right' &&
      'transform-[translateX(var(--drawer-swipe-movement-x))] data-ending-style:transform-[translateX(calc(100%+var(--inset)))] data-starting-style:transform-[translateX(calc(100%+var(--inset)))] col-start-2 w-[calc(100%-(--spacing(12)))] max-w-md border-s after:inset-y-0 after:start-full after:w-(--bleed) has-data-[slot=drawer-bar]:ps-2'
  )

const getPopupVariantClasses = (position: DrawerPosition, variant: DrawerVariant) =>
  cn(
    variant !== 'straight' &&
      cn(
        position === 'bottom' && 'rounded-t-2xl',
        position === 'top' && 'rounded-b-2xl **:data-[slot=drawer-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]',
        position === 'left' && 'rounded-e-2xl **:data-[slot=drawer-footer]:rounded-ee-[calc(var(--radius-2xl)-1px)]',
        position === 'right' && 'rounded-s-2xl **:data-[slot=drawer-footer]:rounded-es-[calc(var(--radius-2xl)-1px)]'
      ),
    variant === 'default' &&
      cn(
        position === 'bottom' && 'before:rounded-t-[calc(var(--radius-2xl)-1px)]',
        position === 'top' && 'before:rounded-b-[calc(var(--radius-2xl)-1px)]',
        position === 'left' && 'before:rounded-e-[calc(var(--radius-2xl)-1px)]',
        position === 'right' && 'before:rounded-s-[calc(var(--radius-2xl)-1px)]'
      ),
    variant === 'inset' &&
      'before:hidden sm:rounded-2xl sm:border sm:after:bg-transparent sm:before:rounded-[calc(var(--radius-2xl)-1px)] sm:**:data-[slot=drawer-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]',
    variant === 'straight' && '[--stack-step:0]'
  )

const getPopupNestedClasses = (position: DrawerPosition) =>
  cn(
    (position === 'bottom' || position === 'top') &&
      'h-(--drawer-height,auto) [--height:max(0px,calc(var(--drawer-frontmost-height,var(--drawer-height))))] data-nested-drawer-open:h-(--height)',
    position === 'bottom' &&
      'data-nested-drawer-open:transform-[translateY(calc(var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--shrink)*var(--height))))_scale(var(--scale))] origin-[50%_calc(100%-var(--inset))]',
    position === 'top' &&
      'data-nested-drawer-open:transform-[translateY(calc(var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--shrink)*var(--height))))_scale(var(--scale))] origin-[50%_var(--inset)]',
    position === 'left' &&
      'data-nested-drawer-open:transform-[translateX(calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)))_scale(var(--scale))] origin-right',
    position === 'right' &&
      'data-nested-drawer-open:transform-[translateX(calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)))_scale(var(--scale))] origin-left'
  )

export const DrawerPopup = ({
  className,
  children,
  showCloseButton = false,
  position: positionProp,
  variant = 'default',
  ...props
}: DrawerPrimitive.Popup.Props & {
  showCloseButton?: boolean
  position?: DrawerPosition
  variant?: DrawerVariant
}): React.ReactElement => {
  const { position: contextPosition } = useContext(DrawerContext)
  const position = positionProp ?? contextPosition

  return (
    <DrawerPortal>
      <DrawerBackdrop />
      <DrawerViewport position={position} variant={variant}>
        <DrawerPrimitive.Popup
          className={cn(
            'relative flex max-h-full min-h-0 w-full min-w-0 flex-col bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 outline-none transition-[transform,box-shadow,height,background-color] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform [--peek:calc(--spacing(6)-1px)] [--scale-base:calc(max(0,1-(var(--nested-drawers)*var(--stack-step))))] [--scale:clamp(0,calc(var(--scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--shrink:calc(1-var(--scale))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-step:0.05] before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute after:bg-popover data-swiping:select-none data-nested-drawer-open:overflow-hidden data-nested-drawer-open:bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(2%*(var(--nested-drawers)-var(--stack-progress))))] data-ending-style:shadow-transparent data-starting-style:shadow-transparent data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] dark:data-nested-drawer-open:bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(6%*(var(--nested-drawers)-var(--stack-progress))))] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
            'touch-none',
            getPopupPositionClasses(position),
            getPopupVariantClasses(position, variant),
            getPopupNestedClasses(position),
            className
          )}
          data-slot="drawer-popup"
          {...props}
        >
          {children}
          {showCloseButton && (
            <DrawerPrimitive.Close aria-label="Close" className="absolute end-2 top-2" render={<Button size="icon" variant="ghost" />}>
              <XIcon />
            </DrawerPrimitive.Close>
          )}
          <DrawerBar />
        </DrawerPrimitive.Popup>
      </DrawerViewport>
    </DrawerPortal>
  )
}

export const DrawerHeader = ({
  className,
  allowSelection = false,
  render,
  ...props
}: useRender.ComponentProps<'div'> & {
  allowSelection?: boolean
}): React.ReactElement => {
  const defaultProps = {
    className: cn(
      'flex flex-col gap-2 p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pb-3 max-sm:pb-4',
      !allowSelection && 'cursor-default',
      className
    ),
    'data-slot': 'drawer-header',
  }

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, props),
    render: allowSelection ? <DrawerContent render={render} /> : render,
  })
}

export const DrawerFooter = ({
  className,
  variant = 'default',
  allowSelection = true,
  render,
  ...props
}: useRender.ComponentProps<'div'> & {
  variant?: 'default' | 'bare'
  allowSelection?: boolean
}): React.ReactElement => {
  const defaultProps = {
    className: cn(
      'flex flex-col-reverse gap-2 px-6 pb-(--safe-area-inset-bottom,0px) sm:flex-row sm:justify-end',
      !allowSelection && 'cursor-default',
      variant === 'default' && 'border-t bg-muted/72 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+--spacing(4))]',
      variant === 'bare' &&
        'in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pt-3 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+--spacing(6))]',
      className
    ),
    'data-slot': 'drawer-footer',
  }

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, props),
    render: allowSelection ? <DrawerContent render={render} /> : render,
  })
}

export const DrawerTitle = ({ className, ...props }: DrawerPrimitive.Title.Props): React.ReactElement => (
  <DrawerPrimitive.Title className={cn('font-heading font-semibold text-xl leading-none', className)} data-slot="drawer-title" {...props} />
)

export const DrawerPanel = ({
  className,
  scrollFade = true,
  scrollable = true,
  allowSelection = true,
  render,
  ...props
}: useRender.ComponentProps<'div'> & {
  scrollFade?: boolean
  scrollable?: boolean
  allowSelection?: boolean
}): React.ReactElement => {
  const defaultProps = {
    className: cn(
      'p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-header])]:pt-1 in-[[data-slot=drawer-popup]:has([data-slot=drawer-footer]:not(.border-t))]:pb-1',
      !allowSelection && 'cursor-default',
      className
    ),
    'data-slot': 'drawer-panel',
  }

  const content = useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, props),
    render: allowSelection ? <DrawerContent render={render} /> : render,
  })

  if (scrollable) {
    return (
      <ScrollArea className="touch-auto" scrollFade={scrollFade}>
        {content}
      </ScrollArea>
    )
  }

  return content
}

const DrawerBar = ({
  className,
  position: positionProp,
  render,
  ...props
}: useRender.ComponentProps<'div'> & {
  position?: DrawerPosition
}): React.ReactElement => {
  const { position: contextPosition } = useContext(DrawerContext)
  const position = positionProp ?? contextPosition
  const horizontal = position === 'left' || position === 'right'
  const defaultProps = {
    'aria-hidden': true as const,
    className: cn(
      'absolute flex touch-none items-center justify-center p-3 before:rounded-full before:bg-input',
      horizontal ? 'inset-y-0 before:h-12 before:w-1' : 'inset-x-0 before:h-1 before:w-12',
      position === 'top' && 'bottom-0',
      position === 'bottom' && 'top-0',
      position === 'left' && 'right-0',
      position === 'right' && 'left-0',
      className
    ),
    'data-slot': 'drawer-bar',
  }

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, props),
    render,
  })
}

const DrawerContent: typeof DrawerPrimitive.Content = DrawerPrimitive.Content
