import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'

import { StorySection } from '../../../../.storybook/story-section'
import { Button } from '../../actions/button/button'
import { Dialog } from './dialog'
import DialogBase from './dialog.base'
import DialogDrawer from './dialog.drawer'

const dialogProps = {
  cancelLabel: 'Cancel',
  children: <p>Changes are saved only after you confirm this action.</p>,
  footer: <Button>Save changes</Button>,
  title: 'Edit recipe',
  trigger: <Button>Edit recipe</Button>,
}

const ResponsiveExample = (): React.ReactElement => <Dialog {...dialogProps} />
const DesktopExample = (): React.ReactElement => <DialogBase {...dialogProps} />
const DrawerExample = (): React.ReactElement => <DialogDrawer {...dialogProps} />

const meta = { component: ResponsiveExample, title: 'Overlays/Dialog' } satisfies Meta<typeof ResponsiveExample>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Responsive">
        <ResponsiveExample />
      </StorySection>
      <StorySection title="Desktop Implementation">
        <DesktopExample />
      </StorySection>
      <StorySection title="Drawer Implementation">
        <DrawerExample />
      </StorySection>
    </div>
  ),
}
