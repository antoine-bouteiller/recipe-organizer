import { getCookie, setCookie } from '@/utils/cookie'

type Theme = 'dark' | 'light'

const storageKey = 'ui-theme'

export const getTheme = () => (getCookie(storageKey) || 'light') as Theme

export const toggleTheme = () => {
  const currentTheme = getTheme()
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  setCookie(storageKey, newTheme)
}
