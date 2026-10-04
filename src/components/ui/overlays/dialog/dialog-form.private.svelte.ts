import { getContext, setContext } from 'svelte'
import type { Snippet } from 'svelte'

export interface DialogFormFrame {
  wrap?: Snippet<[Snippet]>
}

const dialogFormContext = Symbol('dialog-form-frame')

/** Call in the form-dialog owner during setup; wrap is read afresh on every render. */
export const provideDialogFormFrame = (frame: () => DialogFormFrame | null) =>
  setContext<DialogFormFrame>(dialogFormContext, {
    get wrap() {
      return frame()?.wrap
    },
  })

export const useDialogFormFrame = (): DialogFormFrame | null => getContext<DialogFormFrame | undefined>(dialogFormContext) ?? null
