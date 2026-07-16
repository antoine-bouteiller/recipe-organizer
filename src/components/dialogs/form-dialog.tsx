import { useSelector } from '@tanstack/solid-store'
import { type JSX } from 'solid-js'

import { Dialog, type TriggerRender } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { withForm } from '@/hooks/use-app-form'
import { formatFormErrors } from '@/utils/format-form-errors'

interface FormModalProps extends Record<string, unknown> {
  children: JSX.Element
  open: boolean
  setOpen: (open: boolean) => void
  submitLabel: string
  title: string
  trigger?: TriggerRender
}

export const getFormDialog = <TValues,>(defaultValues: TValues) =>
  withForm({
    defaultValues,
    props: {} as FormModalProps,
    render: (props) => {
      const { form } = props
      const errors = useSelector(form.store, (state) => formatFormErrors(state.errors))
      const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

      return (
        <Dialog
          cancelDisabled={isSubmitting()}
          cancelLabel="Annuler"
          contentRender={(content) => (
            <Form
              class="contents"
              errors={errors()}
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
              <form.FormSubmit label={props.submitLabel} />
            </form.AppForm>
          }
          onOpenChange={props.setOpen}
          open={props.open}
          panelClassName="flex flex-col gap-4"
          title={props.title}
          trigger={props.trigger}
        >
          {props.children}
        </Dialog>
      )
    },
  })
