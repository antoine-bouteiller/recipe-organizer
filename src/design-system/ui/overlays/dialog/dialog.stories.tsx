import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'

import type { TriggerProps } from '@/design-system/hooks/use-drawer'
import { Button } from '@/design-system/ui/actions/button/button'

import { Dialog } from './dialog'

import * as styles from './dialog.stories.css'

const dialogProps = {
  cancelLabel: 'Cancel',
  children: <p>Changes are saved only after you confirm this action.</p>,
  footer: <Button>Save changes</Button>,
  renderTrigger: (props: TriggerProps) => <Button {...props}>Edit recipe</Button>,
  title: 'Edit recipe',
}

const ResponsiveExample = (): React.ReactElement => <Dialog {...dialogProps} />

const BareExample = (): React.ReactElement => (
  <Dialog bare title="Search" renderTrigger={(props) => <Button {...props}>Open search</Button>}>
    <p>Children own the whole popup surface.</p>
  </Dialog>
)

const meta = { component: ResponsiveExample, title: 'Overlays/Dialog' } satisfies Meta<typeof ResponsiveExample>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
      <StorySection title="Responsive">
        <ResponsiveExample />
      </StorySection>
      <StorySection title="Bare">
        <BareExample />
      </StorySection>
    </div>
  ),
}

export const Mobile: Story = {
  ...Overview,
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
}
