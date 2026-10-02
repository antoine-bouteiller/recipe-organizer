import { useSelector } from '@tanstack/react-store'
import type { ReactNode } from 'react'

import { FormErrorsContext } from '@/components/ui/forms/form/form'
import { withForm } from '@/hooks/use-app-form'
import { formatFormErrors } from '@/utils/format-form-errors'

import { Dialog } from '../dialog/dialog'
import type { DialogProps } from '../dialog/dialog'
import { DialogFormProvider } from '../dialog/dialog-form.private'

import * as styles from './form-dialog.css'

interface FormModalProps {
  children: ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  submitLabel: string
  title: string
  renderTrigger?: DialogProps['renderTrigger']
}

const formModalProps: FormModalProps = { children: null, open: false, setOpen: () => undefined, submitLabel: '', title: '' }

export const getFormDialog = <TValues,>(defaultValues: TValues) =>
  withForm({
    defaultValues,
    props: formModalProps,
    render: ({ children, form, open, setOpen, submitLabel, title, renderTrigger }) => {
      const errors = useSelector(form.store, (state) => formatFormErrors(state.errors))
      const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)
      return (
        <DialogFormProvider
          value={{
            wrap: (content) => (
              <form
                className={styles.form}
                noValidate
                onSubmit={async (event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  await form.handleSubmit()
                }}
              >
                <FormErrorsContext value={errors}>{content}</FormErrorsContext>
              </form>
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
            renderTrigger={renderTrigger}
          >
            <div className={styles.fields}>{children}</div>
          </Dialog>
        </DialogFormProvider>
      )
    },
  })
