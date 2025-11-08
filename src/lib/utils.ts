import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getFileUrl = (key: string) => `/api/image/${key}`

/**
 * No-operation function that does nothing.
 * Used as a safe fallback for optional callbacks.
 */
export const noop = () => {
  // Intentionally empty
}
