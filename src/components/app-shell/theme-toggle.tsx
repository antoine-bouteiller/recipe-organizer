import { toggleTheme } from '@client/lib/theme'
import { Button } from '@recipe-organizer/design-system/button'
import { ThemeIcon } from '@recipe-organizer/design-system/icons'

export const ThemeToggle = () => (
  <Button aria-label="Changer de thème" onClick={toggleTheme} size="icon" variant="ghost">
    <ThemeIcon size="lg" />
  </Button>
)
