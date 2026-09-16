import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'

import { StorySection } from '../../../../.storybook/story-section'
import { Button } from '../../actions/button/button'
import { Popover } from './popover'
import PopoverBase from './popover.base'
import PopoverDrawer from './popover.drawer'

const popoverProps = {
  children: (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '2', width: '56' })}>
      <h2 className={css({ fontWeight: 'medium' })}>Recipe actions</h2>
      <Button variant="ghost">Duplicate recipe</Button>
      <Button variant="ghost">Archive recipe</Button>
    </div>
  ),
  trigger: <Button variant="outline">Recipe actions</Button>,
}

const ResponsiveExample = (): React.ReactElement => <Popover {...popoverProps} />
const DesktopExample = (): React.ReactElement => <PopoverBase {...popoverProps} />
const DrawerExample = (): React.ReactElement => <PopoverDrawer {...popoverProps} />

const meta = { component: ResponsiveExample, title: 'Overlays/Popover' } satisfies Meta<typeof ResponsiveExample>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })}>
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
