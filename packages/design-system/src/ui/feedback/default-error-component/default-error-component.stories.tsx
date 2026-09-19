import { withRouter } from '@storybook-helpers/router'
import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { DefaultErrorComponent } from './default-error-component'

import * as styles from './default-error-component.stories.css'

const meta = {
  component: DefaultErrorComponent,
  decorators: [withRouter],
  title: 'Feedback/Default Error Component',
} satisfies Meta<typeof DefaultErrorComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (args) => (
    <div className={styles.container}>
      <StorySection title="Default">
        <DefaultErrorComponent {...args} />
      </StorySection>
      <StorySection title="With Details">
        <DefaultErrorComponent {...args} details="A caller-provided diagnostic message." />
      </StorySection>
    </div>
  ),
}

export const ErrorDetails: Story = {
  ...Overview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const defaultSection = canvas.getByRole('region', { name: 'Default' })
    await expect(within(defaultSection).getByRole('alert')).toBeVisible()
    await expect(within(defaultSection).getByRole('link', { name: "Retour à la page d'accueil" })).toHaveAttribute('href', '/')
    await expect(defaultSection.querySelector('code')).not.toBeInTheDocument()
    const detailsSection = within(canvas.getByRole('region', { name: 'With Details' }))
    await expect(detailsSection.getByText('A caller-provided diagnostic message.')).toBeVisible()
  },
  tags: ['!dev'],
}
