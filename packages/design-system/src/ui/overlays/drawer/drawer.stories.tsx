import { Button } from '@recipe-organizer/design-system/button'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'

import { Drawer, DrawerClose, DrawerFooter, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from './drawer'

const DrawerExample = (): React.ReactElement => (
  <Drawer>
    <DrawerTrigger render={<Button />}>Edit recipe</DrawerTrigger>
    <DrawerPopup>
      <DrawerHeader>
        <DrawerTitle>Edit recipe</DrawerTitle>
      </DrawerHeader>
      <DrawerPanel>
        <p>Update the recipe details, then save your changes.</p>
      </DrawerPanel>
      <DrawerFooter>
        <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
        <DrawerClose render={<Button />}>Save changes</DrawerClose>
      </DrawerFooter>
    </DrawerPopup>
  </Drawer>
)

const meta = { component: DrawerExample, title: 'Overlays/Drawer' } satisfies Meta<typeof DrawerExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
