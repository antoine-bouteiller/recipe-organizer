import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Label } from './label'

import * as styles from './label.stories.css'

const meta = {
  component: Label,
  title: 'Forms/Label',
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { children: 'Email address', htmlFor: 'email' },
  render: (args) => (
    <div className={styles.container}>
      <StorySection title="Default">
        <div className={styles.container2}>
          <Label {...args} />
          <input className={styles.element} id="email" placeholder="name@example.com" type="email" />
        </div>
      </StorySection>
      <StorySection title="Disabled">
        <div className={styles.container3}>
          <Label htmlFor="disabled-email">Email address</Label>
          <input className={styles.element2} disabled id="disabled-email" value="name@example.com" />
        </div>
      </StorySection>
    </div>
  ),
}
