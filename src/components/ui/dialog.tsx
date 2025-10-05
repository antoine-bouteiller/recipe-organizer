import type { ComponentProps } from 'react'
import {
  Root as DialogRoot,
  Trigger as DialogTriggerPrimitive,
  Portal as DialogPortalPrimitive,
  Close as DialogClosePrimitive,
  Overlay as DialogOverlayPrimitive,
  Content as DialogContentPrimitive,
  Title as DialogTitlePrimitive,
  Description as DialogDescriptionPrimitive,
} from '@radix-ui/react-dialog'
import { XIcon } from '@phosphor-icons/react'

import { cn } from '@/lib/utils'

const Dialog = ({ ...props }: ComponentProps<typeof DialogRoot>) => (
  <DialogRoot data-slot="dialog" {...props} />
)

const DialogTrigger = ({ ...props }: ComponentProps<typeof DialogTriggerPrimitive>) => (
  <DialogTriggerPrimitive data-slot="dialog-trigger" {...props} />
)

const DialogPortal = ({ ...props }: ComponentProps<typeof DialogPortalPrimitive>) => (
  <DialogPortalPrimitive data-slot="dialog-portal" {...props} />
)

const DialogClose = ({ ...props }: ComponentProps<typeof DialogClosePrimitive>) => (
  <DialogClosePrimitive data-slot="dialog-close" {...props} />
)

const DialogOverlay = ({ className, ...props }: ComponentProps<typeof DialogOverlayPrimitive>) => (
  <DialogOverlayPrimitive
    data-slot="dialog-overlay"
    className={cn(
      'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
)

const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof DialogContentPrimitive> & {
  showCloseButton?: boolean
}) => (
  <DialogPortal data-slot="dialog-portal">
    <DialogOverlay />
    <DialogContentPrimitive
      data-slot="dialog-content"
      className={cn(
        'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg',
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogClosePrimitive
          data-slot="dialog-close"
          className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogClosePrimitive>
      )}
    </DialogContentPrimitive>
  </DialogPortal>
)

const DialogHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="dialog-header"
    className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
    {...props}
  />
)

const DialogFooter = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="dialog-footer"
    className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    {...props}
  />
)

const DialogTitle = ({ className, ...props }: ComponentProps<typeof DialogTitlePrimitive>) => (
  <DialogTitlePrimitive
    data-slot="dialog-title"
    className={cn('text-lg leading-none font-semibold', className)}
    {...props}
  />
)

const DialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof DialogDescriptionPrimitive>) => (
  <DialogDescriptionPrimitive
    data-slot="dialog-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
)

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
