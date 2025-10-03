import { setTheme } from '@/features/theme/api/theme'
import { useRouter } from '@tanstack/react-router'
import { createContext, useContext } from 'react'

export type Theme = 'dark' | 'light'

interface ThemeProviderProps {
  children: React.ReactNode
  theme: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  toggleTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  toggleTheme: () => undefined,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export const ThemeProvider = ({ children, theme, ...props }: ThemeProviderProps) => {
  const router = useRouter()

  const value = {
    theme,
    toggleTheme: async () => {
      await setTheme({ data: theme === 'dark' ? 'light' : 'dark' })
      await router.invalidate()
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
