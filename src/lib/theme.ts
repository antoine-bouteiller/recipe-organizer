import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'

export type Theme = 'dark' | 'light'

const storageKey = 'ui-theme'

export const getTheme = createServerFn().handler(() => (getCookie(storageKey) || 'light') as Theme)

export const toggleTheme = createServerFn({ method: 'POST' }).handler(async () => {
  const currentTheme = await getTheme()
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  setCookie(storageKey, newTheme)
})
