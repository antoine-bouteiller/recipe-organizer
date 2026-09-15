import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'

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

const meta = { component: ResponsiveExample, tags: ['autodocs'], title: 'Overlays/Dialog' } satisfies Meta<typeof ResponsiveExample>
export default meta
type Story = StoryObj<typeof meta>
export const Responsive: Story = { render: () => <ResponsiveExample /> }
export const DesktopImplementation: Story = { render: () => <DesktopExample /> }
export const DrawerImplementation: Story = { render: () => <DrawerExample /> }
