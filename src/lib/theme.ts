import { setCookie } from '@client/utils/cookie'

// The inline head script in void.config.ts applies the stored theme before first paint.
export const toggleTheme = () => {
  const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
  setCookie('ui-theme', newTheme)
  document.documentElement.className = newTheme
}
