import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { GearIcon, HouseIcon, MagnifyingGlassIcon, ShoppingCartSimpleIcon } from '@/design-system/ui/data-display/icons'

import { TabBar } from './tabbar'

import * as styles from './tabbar.stories.css'

const TabBarExample = (): React.ReactElement => {
  const [currentPath, setCurrentPath] = useState('/')
  return (
    <div className={styles.container}>
      <main className={styles.appSurface}>
        <span>App surface</span>
        <section className={styles.contentSurface}>Content surface</section>
      </main>
      {/* Stands in for page navigation inside the story frame. */}
      <div
        onClickCapture={(event) => {
          const link = event.target instanceof Element ? event.target.closest('a') : null
          if (link) {
            event.preventDefault()
            setCurrentPath(new URL(link.href).pathname)
          }
        }}
      >
        <TabBar
          currentPath={currentPath}
          items={[
            { activeIcon: <HouseIcon weight="fill" />, href: '/', icon: <HouseIcon />, label: 'Home' },
            { activeIcon: <ShoppingCartSimpleIcon weight="fill" />, href: '/shopping-list', icon: <ShoppingCartSimpleIcon />, label: 'Shopping' },
            { activeIcon: <MagnifyingGlassIcon weight="bold" />, href: '/search', icon: <MagnifyingGlassIcon />, label: 'Search' },
            { activeIcon: <GearIcon weight="fill" />, href: '/settings', icon: <GearIcon />, label: 'Settings' },
          ]}
        />
      </div>
    </div>
  )
}

const meta = { component: TabBarExample, title: 'Navigation/TabBar' } satisfies Meta<typeof TabBarExample>

export default meta
type Story = StoryObj<typeof meta>

export const Mobile: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  parameters: { layout: 'fullscreen' },
}

export const Interaction: Story = {
  ...Mobile,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const activeLink = canvas.getByRole('link', { name: 'Home' })
    const shoppingLink = canvas.getByRole('link', { name: 'Shopping' })

    await expect(activeLink).toHaveAttribute('aria-current', 'page')
    await userEvent.tab()
    await expect(activeLink).toHaveFocus()

    await userEvent.click(shoppingLink)
    await expect(shoppingLink).toHaveAttribute('aria-current', 'page')

    await userEvent.click(activeLink)
    await expect(activeLink).toHaveAttribute('aria-current', 'page')
  },
  tags: ['!dev'],
}
