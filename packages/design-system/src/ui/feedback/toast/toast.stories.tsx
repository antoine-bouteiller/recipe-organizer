import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'

import { Button } from '../../actions/button/button'
import { toastManager, ToastProvider } from './toast'

const ToastExample = (): React.ReactElement => (
  <ToastProvider>
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toastManager.add({ description: 'Your recipe has been saved.', title: 'Saved', type: 'success' })}>Success toast</Button>
      <Button
        onClick={() => toastManager.add({ description: 'Check the required fields and try again.', title: 'Could not save', type: 'error' })}
        variant="outline"
      >
        Error toast
      </Button>
    </div>
  </ToastProvider>
)

const meta = { component: ToastExample, title: 'Feedback/Toast' } satisfies Meta<typeof ToastExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
