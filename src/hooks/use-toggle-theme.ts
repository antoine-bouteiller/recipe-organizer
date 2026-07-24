import { useRouter } from '@tanstack/react-router'

import { toggleTheme } from '@/lib/theme'

export const useToggleTheme = () => {
  const router = useRouter()

  return async () => {
    toggleTheme()
    await router.invalidate()
  }
}
