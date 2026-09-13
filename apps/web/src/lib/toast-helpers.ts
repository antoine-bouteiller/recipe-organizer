import { toastManager } from '@client/components/ui/toast'
import * as z from 'zod'

export const toastError = (message: string, error?: unknown) => {
  if (error instanceof z.ZodError) {
    toastManager.add({
      description: z.prettifyError(error),
      title: message,
      type: 'error',
    })
  } else {
    toastManager.add({
      description: error instanceof Error ? error.message : undefined,
      title: message,
      type: 'error',
    })
  }
}
