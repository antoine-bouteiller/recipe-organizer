import { Form as FormPrimitive } from '@base-ui/react/form'
import { withForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { formatFormErrors } from '@recipe-organizer/design-system/utils/format-form-errors'
import { useSelector } from '@tanstack/react-store'
import { type ReactElement, type ReactNode } from 'react'

import { Dialog } from '../dialog/dialog'
import { DialogFormProvider } from '../dialog/dialog-form.private'

import * as styles from './form-dialog.css'

interface FormModalProps {
  children: ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  submitLabel: string
  title: string
  trigger?: ReactElement
}

const formModalProps: FormModalProps = { children: null, open: false, setOpen: () => undefined, submitLabel: '', title: '' }

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
                className={styles.form}
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
            <div className={styles.fields}>{children}</div>
          </Dialog>
        </DialogFormProvider>
      )
    },
  })
