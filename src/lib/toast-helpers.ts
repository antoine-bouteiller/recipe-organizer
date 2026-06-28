import { ValiError } from 'valibot'

import { toastManager } from '@/components/ui/toast'

export const toastError = (message: string, error?: unknown) => {
  if (error instanceof ValiError) {
    toastManager.add({
      description: error.message,
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
