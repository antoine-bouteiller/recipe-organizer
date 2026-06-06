import { useStore } from '@tanstack/react-form'
import { type ComponentPropsWithoutRef } from 'react'

import { withForm } from '@/hooks/use-app-form'
import { formatFormErrors } from '@/utils/format-form-errors'

import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { Form } from '../ui/form'

interface FormModalProps {
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  submitLabel: string
  title: string
  trigger: ComponentPropsWithoutRef<typeof Dialog.Trigger>['render']
}

export const getFormDialog = <TValues,>(defaultValues: TValues) =>
  withForm({
    defaultValues,
    props: {} as FormModalProps,
    render: ({ children, form, open, setOpen, submitLabel, title, trigger }) => {
      const errors = useStore(form.store, (state) => formatFormErrors(state.errors))

      return (
        <Dialog onOpenChange={setOpen} open={open}>
          <Dialog.Trigger render={trigger} />

          <Dialog.Popup>
            <Form
              className="contents"
              errors={errors}
              onSubmit={async (event) => {
                event.preventDefault()
                event.stopPropagation()
                await form.handleSubmit()
              }}
            >
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Panel className="flex flex-col gap-4">{children}</Dialog.Panel>
              <Dialog.Footer>
                <Dialog.Close render={<Button disabled={form.state.isSubmitting} variant="outline" />}>Annuler</Dialog.Close>
                <form.AppForm>
                  <form.FormSubmit label={submitLabel} />
                </form.AppForm>
              </Dialog.Footer>
            </Form>
          </Dialog.Popup>
        </Dialog>
      )
    },
  })
