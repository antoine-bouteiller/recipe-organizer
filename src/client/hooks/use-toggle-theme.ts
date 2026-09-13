import { toggleTheme } from '@client/lib/theme'
import { useRouter } from '@tanstack/react-router'

export const useToggleTheme = () => {
  const router = useRouter()

  return async () => {
    toggleTheme()
    await router.invalidate()
  }
}
