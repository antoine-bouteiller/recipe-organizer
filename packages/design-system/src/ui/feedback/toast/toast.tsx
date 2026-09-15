import { Toast } from '@base-ui/react/toast'
import { cn } from 'cn'
import type React from 'react'

import { CheckCircleIcon } from '../../data-display/icons/check-circle'
import { WarningCircleIcon } from '../../data-display/icons/warning-circle'

const Toasts = (): React.ReactElement => {
  const { toasts } = Toast.useToastManager()
  return (
    <Toast.Portal data-slot="toast-portal">
      <Toast.Viewport
        className={cn(
          'fixed z-60 mx-auto flex w-[calc(100%-var(--toast-inset)*2)] max-w-90 [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(8)]',
          'bottom-(--toast-inset) right-(--toast-inset)'
        )}
        data-slot="toast-viewport"
      >
        {toasts.map((toast) => {
          let Icon: React.ElementType | null = null
          if (toast.type === 'error') {
            Icon = WarningCircleIcon
          } else if (toast.type === 'success') {
            Icon = CheckCircleIcon
          }

          return (
            <Toast.Root
              className={cn(
                'absolute z-[calc(9999-var(--toast-index))] h-(--toast-calc-height) w-full select-none rounded-lg border bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(1%*max(0,var(--toast-index,0))))] not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 [transition:transform_.5s_cubic-bezier(.22,1,.36,1),opacity_.5s,height_.15s,background-color_.5s] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-expanded:bg-popover dark:bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(6%*max(0,var(--toast-index,0))))] dark:data-expanded:bg-popover dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
                'right-0 bottom-0 origin-bottom',
                // Gap fill for hover
                'after:absolute after:left-0 after:h-[calc(var(--toast-gap)+1px)] after:w-full',
                'after:bottom-full',
                // Define some variables
                '[--toast-calc-height:var(--toast-frontmost-height,var(--toast-height))] [--toast-gap:--spacing(3)] [--toast-peek:--spacing(3)] [--toast-scale:calc(max(0,1-(var(--toast-index)*.1)))] [--toast-shrink:calc(1-var(--toast-scale))]',
                '[--toast-calc-offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--toast-gap)*-1+var(--toast-swipe-movement-y))]',
                'transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]',
                // Limited state
                'data-limited:opacity-0',
                // Expanded state
                'data-expanded:h-(--toast-height)',
                'data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]',
                // Starting and ending animations
                'data-starting-style:transform-[translateY(calc(100%+var(--toast-inset)))]',
                'data-ending-style:opacity-0',
                // Ending animations (direction-aware)
                'data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateY(calc(100%+var(--toast-inset)))]',
                'data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]',
                'data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]',
                // Ending animations (expanded)
                'data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]',
                'data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]'
              )}
              key={toast.id}
              swipeDirection={['right', 'down']}
              toast={toast}
            >
              <Toast.Content className="pointer-events-auto flex items-center justify-between gap-1.5 overflow-hidden px-3.5 py-3 text-sm transition-opacity duration-250 data-behind:opacity-0 data-behind:not-data-expanded:pointer-events-none data-expanded:opacity-100">
                <div className="flex gap-2">
                  {Icon && (
                    <div className="[&_svg]:pointer-events-none [&_svg]:shrink-0 [&>svg]:h-lh [&>svg]:w-4" data-slot="toast-icon">
                      <Icon className="in-data-[type=error]:text-destructive in-data-[type=success]:text-success" />
                    </div>
                  )}

                  <div className="flex flex-col gap-0.5">
                    <Toast.Title className="font-medium" data-slot="toast-title" />
                    <Toast.Description className="text-muted-foreground" data-slot="toast-description" />
                  </div>
                </div>
              </Toast.Content>
            </Toast.Root>
          )
        })}
      </Toast.Viewport>
    </Toast.Portal>
  )
}

export const toastManager: ReturnType<typeof Toast.createToastManager> = Toast.createToastManager()

export type ToastProviderProps = Toast.Provider.Props

export const ToastProvider = ({ children, ...props }: ToastProviderProps): React.ReactElement => (
  <Toast.Provider toastManager={toastManager} {...props}>
    {children}
    <Toasts />
  </Toast.Provider>
)
