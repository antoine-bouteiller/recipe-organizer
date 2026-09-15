import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { SwipeTabs, SwipeTabsPanels, TabsList, TabsTab } from './tabs'

const tabs = ['ingredients', 'method'] as const

const SwipeTabsExample = (): React.ReactElement => (
  <SwipeTabs className="h-64 w-full" defaultTab="ingredients" tabs={tabs}>
    <TabsList aria-label="Recipe details" className="w-full">
      <TabsTab value="ingredients">Ingredients</TabsTab>
      <TabsTab value="method">Method</TabsTab>
    </TabsList>
    <SwipeTabsPanels>
      <section aria-label="Ingredients" className="p-4">
        <h2>Ingredients</h2>
        <p>2 tomatoes and fresh basil.</p>
      </section>
      <section aria-label="Method" className="p-4">
        <h2>Method</h2>
        <p>Simmer for 20 minutes.</p>
      </section>
    </SwipeTabsPanels>
  </SwipeTabs>
)

const meta = { component: SwipeTabsExample, tags: ['autodocs'], title: 'Navigation/Tabs' } satisfies Meta<typeof SwipeTabsExample>
export default meta
type Story = StoryObj<typeof meta>
export const Swipeable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Method' }))
    await expect(canvas.getByRole('tab', { name: 'Method' })).toHaveAttribute('data-active')
  },
}
