import { Toast, toaster } from '@kobalte/core/toast'
import { CheckCircle, Info, SpinnerGap, Warning, WarningCircle } from 'phosphor-solid'
import { type JSX, Show } from 'solid-js'

type ToastType = 'error' | 'info' | 'loading' | 'success' | 'warning'

interface AddToastOptions {
  title: string
  description?: string
  type?: ToastType
}

const ICON_CLASS =
  'in-data-[type=error]:text-destructive in-data-[type=info]:text-info in-data-[type=loading]:animate-spin in-data-[type=loading]:opacity-80 in-data-[type=success]:text-success in-data-[type=warning]:text-warning'

const ToastIcon = (props: { type?: ToastType }) => (
  <Show when={props.type}>
    <div class="[&>svg]:h-lh [&>svg]:w-4" data-slot="toast-icon">
      <Show when={props.type === 'error'}>
        <WarningCircle class={ICON_CLASS} />
      </Show>
      <Show when={props.type === 'info'}>
        <Info class={ICON_CLASS} />
      </Show>
      <Show when={props.type === 'loading'}>
        <SpinnerGap class={ICON_CLASS} />
      </Show>
      <Show when={props.type === 'success'}>
        <CheckCircle class={ICON_CLASS} />
      </Show>
      <Show when={props.type === 'warning'}>
        <Warning class={ICON_CLASS} />
      </Show>
    </div>
  </Show>
)

const ToastItem = (props: { toastId: number } & AddToastOptions) => (
  <Toast
    class="relative flex w-full select-none items-center justify-between gap-1.5 rounded-lg border bg-popover px-3.5 py-3 not-dark:bg-clip-padding text-popover-foreground text-sm shadow-lg/5 data-opened:animate-in data-opened:fade-in-0 data-opened:slide-in-from-right-full data-closed:animate-out data-closed:fade-out-0"
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
