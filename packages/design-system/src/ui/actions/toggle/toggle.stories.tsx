import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Toggle } from './toggle'

import * as styles from './toggle.stories.css'

const meta = {
  args: { 'aria-label': 'Bold text', children: 'Bold' },
  component: Toggle,
  title: 'Actions/Toggle',
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const CheckRow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByRole('button', { name: 'Tomatoes' })
    const disabledRow = canvas.getByRole('button', { name: 'Unavailable item' })

    await userEvent.tab()
    await expect(row).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(row).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(row)
    await expect(row).toHaveAttribute('aria-pressed', 'false')
    await expect(disabledRow).toBeDisabled()
    await expect(disabledRow).toHaveAttribute('aria-pressed', 'false')
  },
  render: () => (
    <div className={styles.container}>
      <Toggle presentation="check-row">Tomatoes</Toggle>
      <Toggle disabled presentation="check-row">
        Unavailable item
      </Toggle>
    </div>
  ),
  tags: ['!dev'],
}

export const Overview: Story = {
  render: (args) => (
    <div className={styles.container}>
      <StorySection title="Default">
        <Toggle {...args} />
      </StorySection>
      <StorySection title="Pressed">
        <Toggle {...args} defaultPressed />
      </StorySection>
      <StorySection title="Outline">
        <Toggle {...args} variant="outline" />
      </StorySection>
      <StorySection title="Filter">
        <Toggle {...args} aria-label="Filter recipes" defaultPressed presentation="filter">
          Filter recipes
        </Toggle>
      </StorySection>
      <StorySection title="Disabled">
        <Toggle {...args} disabled />
      </StorySection>
    </div>
  ),
}
