import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '@/components/ui/actions/button/button'
import { TextField } from '@/components/ui/forms/text-field/text-field'

import { FormDialog } from './form-dialog'

import * as styles from './form-dialog.stories.css'

const defaultValues = { title: 'Tomato soup' }

const FormDialogExample = (): ReactElement => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(defaultValues.title)

  return (
    <>
      <FormDialog
        pending={false}
        onSubmit={(event) => {
          event.preventDefault()
          setOpen(false)
        }}
        open={open}
        setOpen={setOpen}
        submitLabel="Save recipe"
        title="Edit recipe"
        renderTrigger={(props) => <Button {...props}>Edit recipe</Button>}
      >
        <TextField name="title" value={title} onChange={setTitle} label="Recipe title" />
      </FormDialog>
    </>
  )
}

const RegressionExample = (): ReactElement => {
  const [open, setOpen] = useState(false)
  const resolveSubmit = useRef<(() => void) | null>(null)
  const [title, setTitle] = useState(defaultValues.title)
  const [pending, setPending] = useState(false)
  const submit = () => {
    setPending(true)
    resolveSubmit.current = () => {
      setPending(false)
      setOpen(false)
    }
  }

  return (
    <>
      <FormDialog
        pending={pending}
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        open={open}
        setOpen={setOpen}
        submitLabel="Save recipe"
        title="Edit recipe"
        renderTrigger={(props) => <Button {...props}>Edit recipe</Button>}
      >
        <TextField name="title" value={title} onChange={setTitle} label="Recipe title" />
        <div className={styles.container}>
          {Array.from({ length: 20 }, (_item, index) => (
            <p key={index}>Long form content {index + 1}</p>
          ))}
        </div>
        <Button onClick={() => resolveSubmit.current?.()} type="button" variant="outline">
          Complete save
        </Button>
      </FormDialog>
    </>
  )
}

const meta = { component: FormDialogExample, title: 'Overlays/FormDialog' } satisfies Meta<typeof FormDialogExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <FormDialogExample /> }

export const Mobile: Story = {
  ...Default,
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
}

export const SubmitOnEnter: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Edit recipe' }))
    const dialog = within(document.body)
    const field = await dialog.findByLabelText('Recipe title')
    await expect(field).toBeVisible()
    await userEvent.clear(field)
    await userEvent.type(field, 'Vegetable soup{Enter}')
    await waitFor(() => expect(dialog.queryByRole('dialog')).not.toBeInTheDocument())
  },
  tags: ['!dev'],
}
export const PendingDismissalRegression: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { expanded: false, name: 'Edit recipe' }))
    const dialog = within(document.body)
    await userEvent.click(await dialog.findByRole('button', { name: 'Save recipe' }))
    await waitFor(() => expect(dialog.getByRole('button', { name: 'Annuler' })).toBeDisabled())
    await userEvent.keyboard('{Escape}')
    await expect(dialog.getByRole('dialog')).toBeVisible()
    await userEvent.click(document.body)
    await expect(dialog.getByRole('dialog')).toBeVisible()
    await userEvent.click(dialog.getByRole('button', { name: 'Complete save' }))
    await waitFor(() => expect(dialog.queryByRole('dialog')).not.toBeInTheDocument())
    await userEvent.click(canvas.getByRole('button', { name: 'Edit recipe' }))
    await userEvent.click(dialog.getByLabelText('Recipe title'))
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(dialog.getByRole('button', { name: 'Loading Save recipe' })).toBeDisabled())
    await userEvent.click(dialog.getByRole('button', { name: 'Complete save' }))
    await waitFor(() => expect(dialog.queryByRole('dialog')).not.toBeInTheDocument())
  },
  render: () => <RegressionExample />,
  tags: ['!dev'],
}
