import { Link, useLocation, useRouter } from '@tanstack/react-router'

import { Tabs } from '@/components/common/tabs'
import { ThemeIcon } from '@/components/icons/theme'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/features/recipe/components/search-bar'
import { toggleTheme } from '@/lib/theme'

import { menuItems } from './constants'

export const Navbar = () => {
  const router = useRouter()

  const location = useLocation()

  return (
    <div className="flex h-14 items-center gap-2 px-6">
      <Tabs
        items={menuItems
          .filter((item) => item.display !== 'mobile')
          .map((item) => ({
            label: item.label,
            nativeButton: false,
            render: <Link {...item.linkProps} />,
            value: item.linkProps.to,
          }))}
        value={location.href}
        variant="underline"
      />
      <div className="flex flex-1 items-center justify-end gap-2">
        <SearchBar />
        <Button
          onClick={async () => {
            toggleTheme()
            await router.invalidate()
          }}
          size="icon"
          variant="ghost"
        >
          <ThemeIcon className="size-6" />
        </Button>
      </div>
    </div>
  )
}
