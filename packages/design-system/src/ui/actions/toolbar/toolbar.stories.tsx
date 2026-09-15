import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'

import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from './toolbar'

const ToolbarExample = (): React.ReactElement => (
  <Toolbar aria-label="Text formatting tools">
    <ToolbarGroup aria-label="History">
      <ToolbarButton aria-label="Undo">Undo</ToolbarButton>
      <ToolbarButton aria-label="Redo">Redo</ToolbarButton>
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup aria-label="Formatting">
      <ToolbarButton aria-label="Bold">
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton aria-label="Italic">
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton aria-label="Underline">
        <u>U</u>
      </ToolbarButton>
    </ToolbarGroup>
  </Toolbar>
)

const meta = { component: ToolbarExample, title: 'Actions/Toolbar' } satisfies Meta<typeof ToolbarExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
