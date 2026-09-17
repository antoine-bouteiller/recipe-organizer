import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { SwipeTabs, SwipeTabsPanel, SwipeTabsPanels, TabsList, TabsTab } from './tabs'

import { cardForeground, cardSurface, container, mutedForeground, mutedSurface, roleMap, section, section2 } from './tabs.stories.css'

const tabs = ['ingredients', 'method'] as const

const SwipeTabsExample = (): React.ReactElement => (
  <div className={container}>
    <div aria-label="Tab color roles" className={roleMap}>
      <span className={mutedSurface} data-slot="muted-surface">
        Muted surface
      </span>
      <span className={mutedForeground} data-slot="muted-foreground">
        Muted foreground
      </span>
      <span className={cardSurface} data-slot="card-surface">
        Card surface
      </span>
      <span className={cardForeground} data-slot="card-foreground">
        Card foreground
      </span>
    </div>
    <SwipeTabs defaultTab="ingredients" tabs={tabs}>
      <TabsList aria-label="Recipe details" width="full">
        <TabsTab value="ingredients">Ingredients</TabsTab>
        <TabsTab value="method">Method</TabsTab>
      </TabsList>
      <SwipeTabsPanels>
        <SwipeTabsPanel value="ingredients">
          <section aria-label="Ingredients" className={section}>
            <h2>Ingredients</h2>
            <p>2 tomatoes and fresh basil.</p>
          </section>
        </SwipeTabsPanel>
        <SwipeTabsPanel value="method">
          <section aria-label="Method" className={section2}>
            <h2>Method</h2>
            <p>Simmer for 20 minutes.</p>
          </section>
        </SwipeTabsPanel>
      </SwipeTabsPanels>
    </SwipeTabs>
  </div>
)

const meta = { component: SwipeTabsExample, title: 'Navigation/Tabs' } satisfies Meta<typeof SwipeTabsExample>
export default meta
type Story = StoryObj<typeof meta>
export const Swipeable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('tablist')
    const ingredients = canvas.getByRole('tab', { name: 'Ingredients' })
    const method = canvas.getByRole('tab', { name: 'Method' })
    const mutedSurfaceProbe = canvas.getByText('Muted surface')
    const mutedForegroundProbe = canvas.getByText('Muted foreground')
    const cardSurfaceProbe = canvas.getByText('Card surface')
    const cardForegroundProbe = canvas.getByText('Card foreground')
    const indicator = canvasElement.querySelector<HTMLElement>('[data-slot=tab-indicator]')
    if (!indicator) {
      throw new Error('Tabs requires its moving indicator')
    }

    await expect(getComputedStyle(list).backgroundColor).toBe(getComputedStyle(mutedSurfaceProbe).backgroundColor)
    await waitFor(() => expect(getComputedStyle(method).color).toBe(getComputedStyle(mutedForegroundProbe).color))
    await waitFor(() => expect(getComputedStyle(ingredients).color).toBe(getComputedStyle(cardForegroundProbe).color))
    await expect(getComputedStyle(indicator).backgroundColor).toBe(getComputedStyle(cardSurfaceProbe).backgroundColor)
    await userEvent.click(method)
    await expect(method).toHaveAttribute('data-active')
    await expect(ingredients).not.toHaveAttribute('data-active')
  },
}

export const FitList: Story = {
  render: () => (
    <SwipeTabs defaultTab="ingredients" tabs={tabs}>
      <TabsList aria-label="Compact recipe details" width="fit">
        <TabsTab value="ingredients">Ingredients</TabsTab>
        <TabsTab value="method">Method</TabsTab>
      </TabsList>
      <SwipeTabsPanels>
        <SwipeTabsPanel value="ingredients">Ingredients</SwipeTabsPanel>
        <SwipeTabsPanel value="method">Method</SwipeTabsPanel>
      </SwipeTabsPanels>
    </SwipeTabs>
  ),
}
