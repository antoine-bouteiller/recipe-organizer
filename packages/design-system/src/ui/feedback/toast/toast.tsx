import { Toast } from '@base-ui/react/toast'
import type React from 'react'

import { CheckCircleIcon } from '../../data-display/icons/check-circle'
import { WarningCircleIcon } from '../../data-display/icons/warning-circle'

import { viewportRecipe, rootRecipe, contentRecipe, iconRecipe, textRecipe, container } from './toast.css'

const Toasts = (): React.ReactElement => {
  const { toasts } = Toast.useToastManager()
  return (
    <Toast.Portal data-slot="toast-portal">
      <Toast.Viewport className={viewportRecipe()} data-slot="toast-viewport">
        {toasts.map((toast) => {
          let Icon: React.ElementType | null = null
          if (toast.type === 'error') {
            Icon = WarningCircleIcon
          } else if (toast.type === 'success') {
            Icon = CheckCircleIcon
          }

          return (
            <Toast.Root className={rootRecipe()} key={toast.id} swipeDirection={['right', 'down']} toast={toast}>
              <Toast.Content className={contentRecipe()}>
                <div className={iconRecipe()}>
                  {Icon && (
                    <div className={container} data-slot="toast-icon">
                      <Icon size="sm" />
                    </div>
                  )}

                  <div className={textRecipe()}>
                    <Toast.Title data-slot="toast-title" />
                    <Toast.Description data-slot="toast-description" />
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

export type ToastProviderProps = Pick<Toast.Provider.Props, 'children'>

export const ToastProvider = ({ children }: ToastProviderProps): React.ReactElement => (
  <Toast.Provider toastManager={toastManager}>
    {children}
    <Toasts />
  </Toast.Provider>
)
