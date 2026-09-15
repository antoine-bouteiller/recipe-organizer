import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

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

const meta = { component: FormDialogExample, tags: ['autodocs'], title: 'Overlays/FormDialog' } satisfies Meta<typeof FormDialogExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <FormDialogExample /> }
