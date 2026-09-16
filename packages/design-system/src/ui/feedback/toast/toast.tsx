import { Toast } from '@base-ui/react/toast'
import { css, cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

import { CheckCircleIcon } from '../../data-display/icons/check-circle'
import { WarningCircleIcon } from '../../data-display/icons/warning-circle'

const viewportRecipe = cva({
  base: {
    '--toast-inset': { base: 'token(spacing.4)', sm: 'token(spacing.8)' },
    bottom: 'var(--toast-inset)',
    display: 'flex',
    marginInline: 'auto',
    maxWidth: '90',
    position: 'fixed',
    right: 'var(--toast-inset)',
    width: 'calc(100% - var(--toast-inset) * 2)',
    zIndex: '60',
  },
})
const rootRecipe = cva({
  base: {
    '&[data-ending-style]': { opacity: '0' },
    '&[data-ending-style]:not([data-limited]):not([data-swipe-direction])': { transform: 'translateY(calc(100% + var(--toast-inset)))' },
    '&[data-ending-style][data-swipe-direction=down]': { transform: 'translateY(calc(var(--toast-swipe-movement-y) + 100% + var(--toast-inset)))' },
    '&[data-ending-style][data-swipe-direction=right]': {
      transform: 'translateX(calc(var(--toast-swipe-movement-x) + 100% + var(--toast-inset))) translateY(var(--toast-calc-offset-y))',
    },
    '&[data-expanded]': {
      backgroundColor: 'popover',
      height: 'var(--toast-height)',
      transform: 'translateX(var(--toast-swipe-movement-x)) translateY(var(--toast-calc-offset-y))',
    },
    '&[data-limited]': { opacity: '0' },
    '&[data-starting-style]': { transform: 'translateY(calc(100% + var(--toast-inset)))' },
    '&[data-type=error] [data-slot=toast-icon]': { color: 'destructive' },
    '&[data-type=success] [data-slot=toast-icon]': { color: 'success' },
    '--toast-calc-height': 'var(--toast-frontmost-height, var(--toast-height))',
    '--toast-calc-offset-y': 'calc(var(--toast-offset-y) * -1 + var(--toast-index) * var(--toast-gap) * -1 + var(--toast-swipe-movement-y))',
    '--toast-gap': 'token(spacing.3)',
    '--toast-peek': 'token(spacing.3)',
    '--toast-scale': 'calc(max(0, 1 - (var(--toast-index) * .1)))',
    '--toast-shrink': 'calc(1 - var(--toast-scale))',
    _after: { bottom: '100%', content: '""', height: 'calc(var(--toast-gap) + 1px)', left: 0, position: 'absolute', width: 'full' },
    _before: {
      borderRadius: 'calc(token(radii.lg) - 1px)',
      boxShadow: '0 1px rgb(0 0 0 / 4%)',
      content: '""',
      inset: 0,
      pointerEvents: 'none',
      position: 'absolute',
    },
    _dark: {
      '&[data-expanded]': { backgroundColor: 'popover' },
      _before: { boxShadow: '0 -1px rgb(255 255 255 / 6%)' },
      backgroundClip: 'border-box',
      backgroundColor: 'color-mix(in srgb, token(colors.popover), black calc(6% * max(0, var(--toast-index, 0))))',
    },
    backgroundClip: 'padding-box',
    backgroundColor: 'color-mix(in srgb, token(colors.popover), black calc(1% * max(0, var(--toast-index, 0))))',
    borderRadius: 'lg',
    borderWidth: '1px',
    bottom: '0',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 5%), 0 4px 6px -4px rgb(0 0 0 / 5%)',
    color: 'popover-foreground',
    height: 'var(--toast-calc-height)',
    position: 'absolute',
    right: '0',
    transform:
      'translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) - (var(--toast-index) * var(--toast-peek)) - (var(--toast-shrink) * var(--toast-calc-height)))) scale(var(--toast-scale))',
    transformOrigin: 'bottom',
    transition: 'transform .5s cubic-bezier(.22,1,.36,1), opacity .5s, height .15s, background-color .5s',
    userSelect: 'none',
    width: 'full',
    zIndex: 'calc(9999 - var(--toast-index))',
  },
})
const contentRecipe = cva({
  base: {
    '&[data-behind]': { opacity: '0' },
    '&[data-behind]:not([data-expanded])': { pointerEvents: 'none' },
    '&[data-expanded]': { opacity: '1' },
    alignItems: 'center',
    display: 'flex',
    fontSize: 'sm',
    gap: '1.5',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingInline: '3.5',
    paddingY: '3',
    pointerEvents: 'auto',
    transition: 'opacity 250ms',
  },
})
const iconRecipe = cva({ base: { display: 'flex', flexShrink: '0', gap: '2' } })
const textRecipe = cva({
  base: {
    '& [data-slot=toast-description]': { color: 'muted-foreground' },
    '& [data-slot=toast-title]': { fontWeight: 'medium' },
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5',
  },
})
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
                    <div
                      className={css({ '--owner-icon-size': '1rem', alignItems: 'center', display: 'flex', height: '1lh' })}
                      data-slot="toast-icon"
                    >
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
