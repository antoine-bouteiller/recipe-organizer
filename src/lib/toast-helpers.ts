import * as z from 'zod'

import { toastManager } from '@/components/ui/toast'

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
