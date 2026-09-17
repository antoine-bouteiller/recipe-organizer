import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { Button } from '../../actions/button/button'
import { DefaultErrorComponent } from './default-error-component'

import * as styles from './default-error-component.stories.css'

const meta = {
  args: { action: <Button render={<a href="#retry" />}>Try again</Button> },
  component: DefaultErrorComponent,
  title: 'Feedback/Default Error Component',
} satisfies Meta<typeof DefaultErrorComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const defaultSection = canvas.getByRole('region', { name: 'Default' })
    await expect(within(defaultSection).getByRole('alert')).toBeVisible()
    await expect(defaultSection.querySelector('code')).not.toBeInTheDocument()
    const detailsSection = within(canvas.getByRole('region', { name: 'With Details' }))
    await expect(detailsSection.getByText('A caller-provided diagnostic message.')).toBeVisible()
  },
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
