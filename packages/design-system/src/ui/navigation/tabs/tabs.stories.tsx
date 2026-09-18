import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { SwipeTabs, SwipeTabsPanel, SwipeTabsPanels, TabsList, TabsTab } from './tabs'

import * as styles from './tabs.stories.css'

const tabs = ['ingredients', 'method'] as const

const SwipeTabsExample = (): React.ReactElement => (
  <div className={styles.container}>
    <SwipeTabs defaultTab="ingredients" tabs={tabs}>
      <TabsList aria-label="Recipe details" width="full">
        <TabsTab value="ingredients">Ingredients</TabsTab>
        <TabsTab value="method">Method</TabsTab>
      </TabsList>
      <SwipeTabsPanels>
        <SwipeTabsPanel value="ingredients">
          <section aria-label="Ingredients" className={styles.section}>
            <h2>Ingredients</h2>
            <p>2 tomatoes and fresh basil.</p>
          </section>
        </SwipeTabsPanel>
        <SwipeTabsPanel value="method">
          <section aria-label="Method" className={styles.methodPanel}>
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
    const ingredients = canvas.getByRole('tab', { name: 'Ingredients' })
    const method = canvas.getByRole('tab', { name: 'Method' })
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
