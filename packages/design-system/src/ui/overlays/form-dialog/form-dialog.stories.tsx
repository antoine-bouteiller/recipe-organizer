import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useRef, useState, type ReactElement } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { useAppForm } from '../../../hooks/use-app-form'
import { Button } from '../../actions/button/button'
import { getFormDialog } from './form-dialog'

const defaultValues = { title: 'Tomato soup' }
const FormDialog = getFormDialog(defaultValues)

const FormDialogExample = (): ReactElement => {
  const [open, setOpen] = useState(false)
  const form = useAppForm({ defaultValues, onSubmit: async () => setOpen(false) })

  return (
    <form.AppForm>
      <FormDialog form={form} open={open} setOpen={setOpen} submitLabel="Save recipe" title="Edit recipe" trigger={<Button>Edit recipe</Button>}>
        <form.AppField name="title">{({ TextField }) => <TextField label="Recipe title" />}</form.AppField>
      </FormDialog>
    </form.AppForm>
  )
}

const RegressionExample = (): ReactElement => {
  const [open, setOpen] = useState(false)
  const resolveSubmit = useRef<(() => void) | null>(null)
  const form = useAppForm({
    defaultValues,
    onSubmit: async () =>
      new Promise<void>((resolve) => {
        resolveSubmit.current = () => {
          resolve()
          setOpen(false)
        }
      }),
  })

  return (
    <form.AppForm>
      <FormDialog form={form} open={open} setOpen={setOpen} submitLabel="Save recipe" title="Edit recipe" trigger={<Button>Edit recipe</Button>}>
        <form.AppField name="title">{({ TextField }) => <TextField label="Recipe title" />}</form.AppField>
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
          {Array.from({ length: 20 }, (_item, index) => (
            <p key={index}>Long form content {index + 1}</p>
          ))}
        </div>
        <Button onClick={() => resolveSubmit.current?.()} type="button" variant="outline">
          Complete save
        </Button>
      </FormDialog>
    </form.AppForm>
  )
}

const meta = { component: FormDialogExample, title: 'Overlays/FormDialog' } satisfies Meta<typeof FormDialogExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <FormDialogExample /> }
export const PendingDismissalRegression: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Edit recipe' }))
    const dialog = within(document.body)
    await userEvent.click(dialog.getByRole('button', { name: 'Save recipe' }))
    await waitFor(() => expect(dialog.getByRole('button', { name: 'Annuler' })).toBeDisabled())
    await userEvent.keyboard('{Escape}')
    await expect(dialog.getByRole('dialog')).toBeVisible()
    await userEvent.click(dialog.getByRole('button', { name: 'Annuler' }))
    await expect(dialog.getByRole('dialog')).toBeVisible()
    await userEvent.click(document.body)
    await expect(dialog.getByRole('dialog')).toBeVisible()
    await userEvent.click(dialog.getByRole('button', { name: 'Complete save' }))
    await waitFor(() => expect(dialog.queryByRole('dialog')).not.toBeInTheDocument())
    await userEvent.click(canvas.getByRole('button', { name: 'Edit recipe' }))
    await userEvent.click(dialog.getByLabelText('Recipe title'))
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(dialog.getByRole('button', { name: 'Save recipe' })).toBeDisabled())
    await userEvent.click(dialog.getByRole('button', { name: 'Complete save' }))
    await waitFor(() => expect(dialog.queryByRole('dialog')).not.toBeInTheDocument())
  },
  render: () => <RegressionExample />,
}
