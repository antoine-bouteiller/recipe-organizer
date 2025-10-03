import type { Theme } from '@/features/theme/theme-provider'
import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'

const storageKey = 'ui-theme'

export const getTheme = createServerFn().handler(() => (getCookie(storageKey) || 'light') as Theme)

export const setTheme = createServerFn({ method: 'POST' })
  .inputValidator((data) => {
    if (typeof data !== 'string' || (data !== 'dark' && data !== 'light')) {
      throw new Error('Invalid theme provided')
    }
    return data as Theme
  })
  .handler(({ data }) => {
    setCookie(storageKey, data)
  })
