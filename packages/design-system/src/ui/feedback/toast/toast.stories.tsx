import { Button } from '@recipe-organizer/design-system/button'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'

import { toastManager, ToastProvider } from './toast'

import * as styles from './toast.stories.css'

const ToastExample = (): React.ReactElement => (
  <ToastProvider>
    <div className={styles.container}>
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
