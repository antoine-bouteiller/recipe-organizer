import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'

import { Button } from '../../actions/button/button'
import { Popover } from './popover'
import PopoverBase from './popover.base'
import PopoverDrawer from './popover.drawer'

const popoverProps = {
  children: (
    <div className="flex w-56 flex-col gap-2">
      <h2 className="font-medium">Recipe actions</h2>
      <Button variant="ghost">Duplicate recipe</Button>
      <Button variant="ghost">Archive recipe</Button>
    </div>
  ),
  trigger: <Button variant="outline">Recipe actions</Button>,
}

const ResponsiveExample = (): React.ReactElement => <Popover {...popoverProps} />
const DesktopExample = (): React.ReactElement => <PopoverBase {...popoverProps} />
const DrawerExample = (): React.ReactElement => <PopoverDrawer {...popoverProps} />

const meta = { component: ResponsiveExample, tags: ['autodocs'], title: 'Overlays/Popover' } satisfies Meta<typeof ResponsiveExample>
export default meta
type Story = StoryObj<typeof meta>
export const Responsive: Story = { render: () => <ResponsiveExample /> }
export const DesktopImplementation: Story = { render: () => <DesktopExample /> }
export const DrawerImplementation: Story = { render: () => <DrawerExample /> }
