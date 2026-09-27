import { withRouter } from '@storybook-helpers/router'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { SwipeTabs, SwipeTabsPanel, SwipeTabsPanels, TabsList, TabsTab } from './tabs'

import * as styles from './tabs.stories.css'

const SwipeTabsExample = (): React.ReactElement => (
  <div className={styles.container}>
    <SwipeTabs>
      <TabsList aria-label="Recipe details">
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

const meta = { component: SwipeTabsExample, decorators: [withRouter], title: 'Navigation/Tabs' } satisfies Meta<typeof SwipeTabsExample>
export default meta
type Story = StoryObj<typeof meta>
export const Swipeable: Story = {}

export const Interaction: Story = {
  ...Swipeable,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const panel = canvas.getByRole('region', { name: 'Method' }).parentElement
    await userEvent.click(canvas.getByRole('link', { name: 'Method' }))
    // The selected panel is scrolled into view inside the snap container.
    await waitFor(() => expect(panel?.parentElement?.scrollLeft).toBe(panel?.offsetLeft))
  },
  tags: ['!dev'],
}
