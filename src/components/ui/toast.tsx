import { Toast, toaster } from '@kobalte/core/toast'
import { type JSX, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import CheckCircle from '~icons/ph/check-circle'
import WarningCircle from '~icons/ph/warning-circle'

type ToastType = 'error' | 'success'

interface AddToastOptions {
  title: string
  description?: string
  type?: ToastType
}

const ICON_CLASS = 'in-data-[type=error]:text-destructive in-data-[type=success]:text-success'

const ICONS = { error: WarningCircle, success: CheckCircle }

const ToastIcon = (props: { type?: ToastType }) => (
  <Show when={props.type}>
    {(type) => (
      <div class="[&>svg]:h-lh [&>svg]:w-4" data-slot="toast-icon">
        <Dynamic component={ICONS[type()]} class={ICON_CLASS} />
      </div>
    )}
  </Show>
)

const ToastItem = (props: { toastId: number } & AddToastOptions) => (
  <Toast
    class="relative flex w-full items-center justify-between gap-1.5 rounded-lg border bg-popover px-3.5 py-3 text-sm text-popover-foreground shadow-lg/5 select-none not-dark:bg-clip-padding data-closed:animate-out data-closed:fade-out-0 data-opened:animate-in data-opened:fade-in-0 data-opened:slide-in-from-right-full"
    data-type={props.type}
    toastId={props.toastId}
  >
    <div class="flex gap-2">
      <ToastIcon type={props.type} />
      <div class="flex flex-col gap-0.5">
        <Toast.Title class="font-medium" data-slot="toast-title">
          {props.title}
        </Toast.Title>
        <Show when={props.description}>
          <Toast.Description class="text-muted-foreground" data-slot="toast-description">
            {props.description}
          </Toast.Description>
        </Show>
      </div>
    </div>
  </Toast>
)

export const toastManager = {
  add: (options: AddToastOptions): number => toaster.show((props) => <ToastItem toastId={props.toastId} {...options} />),
}

export const ToastProvider = (props: { children: JSX.Element }): JSX.Element => (
  <>
    {props.children}
    <Toast.Region>
      <Toast.List class="fixed right-4 bottom-4 z-60 flex w-90 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none" data-slot="toast-viewport" />
    </Toast.Region>
  </>
)
