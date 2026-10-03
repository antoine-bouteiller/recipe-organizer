import type { ReactNode, ComponentProps } from 'react'

import { FormSubmit } from '@/components/ui/forms/form-submit/form-submit'
import { FormErrorsContext } from '@/components/ui/forms/form/form'

import { Dialog } from '../dialog/dialog'
import type { DialogProps } from '../dialog/dialog'
import { DialogFormProvider } from '../dialog/dialog-form.private'

import * as styles from './form-dialog.css'

interface FormDialogProps {
  children: ReactNode
  errors?: Record<string, string>
  pending: boolean
  action?: ComponentProps<'form'>['action']
  onSubmit?: ComponentProps<'form'>['onSubmit']
  open: boolean
  setOpen: (open: boolean) => void
  submitLabel: string
  title: string
  renderTrigger?: DialogProps['renderTrigger']
}

export const FormDialog = ({ children, errors, pending, action, onSubmit, open, setOpen, submitLabel, title, renderTrigger }: FormDialogProps) => (
  <DialogFormProvider
    value={{
      // oxlint-disable-next-line react/no-unstable-nested-components -- Private callback is invoked, not mounted as a component.
      wrap(content) {
        return (
          <form
            action={action}
            className={styles.form}
            noValidate
            onSubmit={(event) => {
              event.stopPropagation()
              onSubmit?.(event)
            }}
          >
            <FormErrorsContext value={errors ?? {}}>{content}</FormErrorsContext>
          </form>
        )
      },
    }}
  >
    <Dialog
      cancelDisabled={pending}
      cancelLabel="Annuler"
      footer={<FormSubmit label={submitLabel} pending={pending} />}
      onOpenChange={setOpen}
      open={open}
      title={title}
      renderTrigger={renderTrigger}
    >
      <div className={styles.fields}>{children}</div>
    </Dialog>
  </DialogFormProvider>
)
