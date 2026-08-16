import { getCookie, setCookie } from '@/utils/cookie'

type Theme = 'dark' | 'light'

const storageKey = 'ui-theme'

const systemTheme = (): Theme => (globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

export const getTheme = (): Theme => {
  const stored = getCookie(storageKey)
  return stored === 'dark' || stored === 'light' ? stored : systemTheme()
}

export const toggleTheme = () => {
  const currentTheme = getTheme()
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  setCookie(storageKey, newTheme)
}
