import { Form as FormPrimitive } from '@base-ui/react/form'
import { css } from '@recipe-organizer/design-system/css'
import { useSelector } from '@tanstack/react-store'
import { type ReactElement, type ReactNode } from 'react'

import { withForm } from '../../../hooks/use-app-form'
import { formatFormErrors } from '../../../utils/format-form-errors'
import { Dialog } from '../dialog/dialog'
import { DialogFormProvider } from '../dialog/dialog-form.private'

interface FormModalProps {
  children: ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  submitLabel: string
  title: string
  trigger?: ReactElement
}

const formModalProps: FormModalProps = { children: null, open: false, setOpen: () => undefined, submitLabel: '', title: '' }
const formClassName = css({ display: 'contents' })
const fieldsClassName = css({ display: 'flex', flexDirection: 'column', gap: '4' })

export const getFormDialog = <TValues,>(defaultValues: TValues) =>
  withForm({
    defaultValues,
    props: formModalProps,
    render: ({ children, form, open, setOpen, submitLabel, title, trigger }) => {
      const errors = useSelector(form.store, (state) => formatFormErrors(state.errors))
      const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)
      return (
        <DialogFormProvider
          value={{
            wrap: (content) => (
              <FormPrimitive
                className={formClassName}
                errors={errors}
                onSubmit={async (event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  await form.handleSubmit()
                }}
              >
                {content}
              </FormPrimitive>
            ),
          }}
        >
          <Dialog
            cancelDisabled={isSubmitting}
            cancelLabel="Annuler"
            footer={
              <form.AppForm>
                <form.FormSubmit label={submitLabel} />
              </form.AppForm>
            }
            onOpenChange={setOpen}
            open={open}
            title={title}
            trigger={trigger}
          >
            <div className={fieldsClassName}>{children}</div>
          </Dialog>
        </DialogFormProvider>
      )
    },
  })
