import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Button } from '../../actions/button/button'
import { NotFound } from './not-found'

const meta = {
  args: { action: <Button render={<a href="#home" />}>Return home</Button> },
  component: NotFound,
  tags: ['autodocs'],
  title: 'Feedback/Not Found',
} satisfies Meta<typeof NotFound>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithoutAction: Story = { args: { action: undefined } }
