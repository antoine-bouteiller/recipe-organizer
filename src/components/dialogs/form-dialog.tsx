import { useSelector } from '@tanstack/react-store'
import { type ReactElement, type ReactNode } from 'react'

import { Dialog } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { withForm } from '@/hooks/use-app-form'
import { formatFormErrors } from '@/utils/format-form-errors'

interface FormModalProps {
  children: ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  submitLabel: string
  title: string
  trigger?: ReactElement
}

export const getFormDialog = <TValues,>(defaultValues: TValues) =>
  withForm({
    defaultValues,
    props: {} as FormModalProps,
    render: ({ children, form, open, setOpen, submitLabel, title, trigger }) => {
      const errors = useSelector(form.store, (state) => formatFormErrors(state.errors))

      return (
        <Dialog
          cancelDisabled={form.state.isSubmitting}
          cancelLabel="Annuler"
          contentRender={(content) => (
            <Form
              className="contents"
              errors={errors}
              onSubmit={async (event) => {
                event.preventDefault()
                event.stopPropagation()
                await form.handleSubmit()
              }}
            >
              {content}
            </Form>
          )}
          footer={
            <form.AppForm>
              <form.FormSubmit label={submitLabel} />
            </form.AppForm>
          }
          onOpenChange={setOpen}
          open={open}
          panelClassName="flex flex-col gap-4"
          title={title}
          trigger={trigger}
        >
          {children}
        </Dialog>
      )
    },
  })
