import { getCookie, setCookie } from '@/utils/cookie'

type Theme = 'dark' | 'light'

const storageKey = 'ui-theme'

const systemTheme = (): Theme => (globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

export const getTheme = () => (getCookie(storageKey) as Theme) || systemTheme()

export const toggleTheme = () => {
  const currentTheme = getTheme()
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  setCookie(storageKey, newTheme)
}
