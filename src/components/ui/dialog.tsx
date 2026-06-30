import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { XIcon } from '@phosphor-icons/react'
import { type ReactElement, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  Drawer as DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { cn } from '@/utils/cn'

const DialogRoot = DialogPrimitive.Root

const DialogPortal = DialogPrimitive.Portal

const DialogTrigger = (props: DialogPrimitive.Trigger.Props): ReactElement => <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />

const DialogClose = (props: DialogPrimitive.Close.Props): ReactElement => <DialogPrimitive.Close data-slot="dialog-close" {...props} />

const DialogBackdrop = ({ className, ...props }: DialogPrimitive.Backdrop.Props): ReactElement => (
  <DialogPrimitive.Backdrop
    className={cn(
      'fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0',
      className
    )}
    data-slot="dialog-backdrop"
    {...props}
  />
)

const DialogViewport = ({ className, ...props }: DialogPrimitive.Viewport.Props): ReactElement => (
  <DialogPrimitive.Viewport
    className={cn('fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4', className)}
    data-slot="dialog-viewport"
    {...props}
  />
)

const DialogPopup = ({
  className,
  children,
  showCloseButton = true,
  bottomStickOnMobile = true,
  closeProps,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
  bottomStickOnMobile?: boolean
  closeProps?: DialogPrimitive.Close.Props
}): ReactElement => (
  <DialogPortal>
    <DialogBackdrop />
    <DialogViewport className={cn(bottomStickOnMobile && 'max-sm:grid-rows-[1fr_auto] max-sm:p-0 max-sm:pt-12')}>
      <DialogPrimitive.Popup
        className={cn(
          'relative row-start-2 flex max-h-full min-h-0 w-full min-w-0 max-w-lg origin-center flex-col rounded-2xl border bg-popover not-dark:bg-clip-padding text-popover-foreground opacity-[calc(1-var(--nested-dialogs))] shadow-lg/5 outline-none transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:opacity-0 data-starting-style:opacity-0 sm:scale-[calc(1-0.1*var(--nested-dialogs))] sm:data-ending-style:scale-98 sm:data-starting-style:scale-98 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
          bottomStickOnMobile &&
            'max-sm:max-w-none max-sm:origin-bottom max-sm:rounded-none max-sm:border-x-0 max-sm:border-t max-sm:border-b-0 max-sm:data-ending-style:translate-y-4 max-sm:data-starting-style:translate-y-4 max-sm:before:hidden max-sm:before:rounded-none',
          className
        )}
        data-slot="dialog-popup"
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close aria-label="Close" className="absolute end-2 top-2" render={<Button size="icon" variant="ghost" />} {...closeProps}>
            <XIcon />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogViewport>
  </DialogPortal>
)

const DialogHeader = ({ className, render, ...props }: useRender.ComponentProps<'div'>): ReactElement => {
  const defaultProps = {
    className: cn('flex flex-col gap-2 p-6 in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pb-3 max-sm:pb-4', className),
    'data-slot': 'dialog-header',
  }

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, props),
    render,
  })
}

const DialogFooter = ({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'div'> & {
  variant?: 'default' | 'bare'
}): ReactElement => {
  const defaultProps = {
    className: cn(
      'flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end sm:rounded-b-[calc(var(--radius-2xl)-1px)]',
      variant === 'default' && 'border-t bg-muted/72 py-4',
      variant === 'bare' && 'in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pt-3 pt-4 pb-6',
      className
    ),
    'data-slot': 'dialog-footer',
  }

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, props),
    render,
  })
}

const DialogTitle = ({ className, ...props }: DialogPrimitive.Title.Props): ReactElement => (
  <DialogPrimitive.Title className={cn('font-heading font-semibold text-xl leading-none', className)} data-slot="dialog-title" {...props} />
)

const DialogPanel = ({
  className,
  scrollFade = true,
  render,
  ...props
}: useRender.ComponentProps<'div'> & {
  scrollFade?: boolean
}): ReactElement => {
  const defaultProps = {
    className: cn(
      'p-6 in-[[data-slot=dialog-popup]:has([data-slot=dialog-header])]:pt-1 in-[[data-slot=dialog-popup]:has([data-slot=dialog-footer]:not(.border-t))]:pb-1',
      className
    ),
    'data-slot': 'dialog-panel',
  }

  return (
    <ScrollArea scrollFade={scrollFade}>
      {useRender({
        defaultTagName: 'div',
        props: mergeProps<'div'>(defaultProps, props),
        render,
      })}
    </ScrollArea>
  )
}

interface DialogProps {
  title: string
  trigger?: ReactElement
  children: ReactNode
  cancelLabel?: string
  cancelDisabled?: boolean
  footer?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  contentRender?: (content: ReactNode) => ReactNode
  panelClassName?: string
}

export const Dialog = ({
  title,
  trigger,
  children,
  cancelLabel,
  cancelDisabled,
  footer,
  open,
  onOpenChange,
  contentRender,
  panelClassName,
}: DialogProps): ReactElement => {
  const isMobile = useIsMobile()
  const hasFooter = cancelLabel !== undefined || footer !== undefined
  const wrap = (body: ReactNode): ReactNode => (contentRender ? contentRender(body) : body)

  if (isMobile) {
    return (
      <DrawerRoot onOpenChange={onOpenChange} open={open}>
        {trigger !== undefined && <DrawerTrigger render={trigger} />}
        <DrawerPopup>
          {wrap(
            <>
              <DrawerHeader>
                <DrawerTitle>{title}</DrawerTitle>
              </DrawerHeader>
              <DrawerPanel className={panelClassName}>{children}</DrawerPanel>
              {hasFooter && (
                <DrawerFooter>
                  {cancelLabel !== undefined && (
                    <DrawerClose render={<Button disabled={cancelDisabled} variant="outline" />}>{cancelLabel}</DrawerClose>
                  )}
                  {footer}
                </DrawerFooter>
              )}
            </>
          )}
        </DrawerPopup>
      </DrawerRoot>
    )
  }

  return (
    <DialogRoot modal="trap-focus" onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined} open={open}>
      {trigger !== undefined && <DialogTrigger render={trigger} />}
      <DialogPopup>
        {wrap(
          <>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <DialogPanel className={panelClassName}>{children}</DialogPanel>
            {hasFooter && (
              <DialogFooter>
                {cancelLabel !== undefined && (
                  <DialogClose render={<Button disabled={cancelDisabled} variant="outline" />}>{cancelLabel}</DialogClose>
                )}
                {footer}
              </DialogFooter>
            )}
          </>
        )}
      </DialogPopup>
    </DialogRoot>
  )
}
