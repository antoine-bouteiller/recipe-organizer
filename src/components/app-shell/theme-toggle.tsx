import { Button } from '@/design-system/ui/actions/button/button'
import { ThemeIcon } from '@/design-system/ui/data-display/icons'
import { toggleTheme } from '@/lib/client/theme'

export const ThemeToggle = () => (
  <Button aria-label="Changer de thème" onClick={toggleTheme} size="icon" variant="ghost">
    <ThemeIcon size="lg" />
  </Button>
)
