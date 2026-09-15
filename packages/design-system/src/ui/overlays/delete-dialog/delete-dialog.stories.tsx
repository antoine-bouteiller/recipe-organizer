import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { Button } from '../../actions/button/button'
import { DeleteDialog } from './delete-dialog'

const DeleteDialogExample = (): ReactElement => {
  const [deleted, setDeleted] = useState(false)

  const handleDelete = async (): Promise<void> => {
    await Promise.resolve()
    setDeleted(true)
  }

  return (
    <div className="space-y-3">
      <DeleteDialog
        deleteButtonLabel="Delete recipe"
        description="This removes Tomato soup from your saved recipes. This action cannot be undone."
        onDelete={handleDelete}
        title="Delete Tomato soup?"
        trigger={<Button aria-label="Delete Tomato soup" variant="destructive" />}
      />
      {deleted && <p role="status">Tomato soup was deleted.</p>}
    </div>
  )
}

const meta = {
  component: DeleteDialogExample,
  title: 'Overlays/DeleteDialog',
} satisfies Meta<typeof DeleteDialogExample>

export default meta
type Story = StoryObj<typeof meta>

export const Confirmation: Story = {}
