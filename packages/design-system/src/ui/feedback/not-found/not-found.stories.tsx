import { withRouter } from '@storybook-helpers/router'
import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { NotFound } from './not-found'

import * as styles from './not-found.stories.css'

const meta = {
  component: NotFound,
  decorators: [withRouter],
  title: 'Feedback/Not Found',
} satisfies Meta<typeof NotFound>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const defaultSection = within(canvas.getByRole('region', { name: 'Default' }))
    await expect(defaultSection.getByRole('link', { name: "Retour à l'accueil" })).toHaveAttribute('href', '/')
    await expect(within(canvas.getByRole('region', { name: 'Without Action' })).queryByRole('link')).not.toBeInTheDocument()
  },
  render: (args) => (
    <div className={styles.container}>
      <StorySection title="Default">
        <NotFound {...args} />
      </StorySection>
      <StorySection title="Without Action">
        <NotFound {...args} action={null} />
      </StorySection>
    </div>
  ),
}
