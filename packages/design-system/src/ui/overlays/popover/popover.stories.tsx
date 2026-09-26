import { Button } from '@recipe-organizer/design-system/button'
import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'

import { Popover } from './popover'

import * as styles from './popover.stories.css'

const popoverProps = {
  children: (
    <div className={styles.container}>
      <h2 className={styles.heading}>Recipe actions</h2>
      <Button variant="ghost">Duplicate recipe</Button>
      <Button variant="ghost">Archive recipe</Button>
    </div>
  ),
  trigger: <Button variant="outline">Recipe actions</Button>,
}

const ResponsiveExample = (): React.ReactElement => <Popover {...popoverProps} />

const meta = { component: ResponsiveExample, title: 'Overlays/Popover' } satisfies Meta<typeof ResponsiveExample>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={styles.storyLayout}>
      <StorySection title="Responsive">
        <ResponsiveExample />
      </StorySection>
    </div>
  ),
}

export const Mobile: Story = {
  ...Overview,
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
}
