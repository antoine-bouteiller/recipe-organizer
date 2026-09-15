import { useToggleTheme } from '@client/hooks/use-toggle-theme'
import { Button } from '@recipe-organizer/design-system/button'
import { ThemeIcon } from '@recipe-organizer/design-system/icons/theme'
import { Navbar as NavbarPresentation, NavbarItem } from '@recipe-organizer/design-system/navbar'
import { Link } from '@tanstack/react-router'
import { type ReactNode } from 'react'

import { menuItems } from './constants'

const navItems = menuItems.filter((item) => item.display !== 'mobile')

export const Navbar = ({ search }: { search: ReactNode }) => {
  const toggleTheme = useToggleTheme()

  return (
    <NavbarPresentation
      actions={
        <>
          {search}
          <Button onClick={toggleTheme} size="icon" variant="ghost">
            <ThemeIcon className="size-6" />
          </Button>
        </>
      }
    >
      {navItems.map((item) => (
        <NavbarItem
          key={item.linkProps.to}
          render={<Link {...item.linkProps} activeOptions={item.linkProps.to === '/' ? { exact: true } : undefined} />}
        >
          {item.label}
        </NavbarItem>
      ))}
    </NavbarPresentation>
  )
}
