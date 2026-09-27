import { withRouter } from '@storybook-helpers/router'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Tabs } from './tabs'

import * as styles from './tabs.stories.css'

const TabsExample = (): React.ReactElement => (
  <div className={styles.container}>
    <Tabs
      aria-label="Recipe details"
      items={[
        {
          content: (
            <section aria-label="Ingredients" className={styles.section}>
              <h2>Ingredients</h2>
              <p>2 tomatoes and fresh basil.</p>
            </section>
          ),
          label: 'Ingredients',
          value: 'ingredients',
        },
        {
          content: (
            <section aria-label="Method" className={styles.section}>
              <h2>Method</h2>
              <p>Simmer for 20 minutes.</p>
            </section>
          ),
          label: 'Method',
          value: 'method',
        },
      ]}
    />
  </div>
)

const meta = { component: TabsExample, decorators: [withRouter], title: 'Navigation/Tabs' } satisfies Meta<typeof TabsExample>
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
