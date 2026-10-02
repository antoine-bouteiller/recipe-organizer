import { Button } from '@recipe-organizer/design-system/button'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { ReactElement } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { DeleteDialog } from './delete-dialog'

import * as styles from './delete-dialog.stories.css'

const DeleteDialogExample = (): ReactElement => {
  const [deleted, setDeleted] = useState(false)

  const handleDelete = async (): Promise<void> => {
    await Promise.resolve()
    setDeleted(true)
  }

  return (
    <div className={styles.container}>
      <DeleteDialog
        deleteButtonLabel="Delete recipe"
        description="This removes Tomato soup from your saved recipes. This action cannot be undone."
        onDelete={handleDelete}
        title="Delete Tomato soup?"
        renderTrigger={(props) => <Button {...props} aria-label="Delete Tomato soup" variant="destructive" />}
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

export const Confirmation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Delete Tomato soup' }))
    const dialog = within(document.body)
    await userEvent.click(await dialog.findByRole('button', { name: 'Supprimer' }))
    await expect(await canvas.findByRole('status')).toHaveTextContent('Tomato soup was deleted.')
    await waitFor(() => expect(dialog.queryByRole('dialog')).not.toBeInTheDocument())
  },
}
