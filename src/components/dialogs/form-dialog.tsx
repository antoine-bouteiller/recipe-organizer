import { useStore } from '@tanstack/react-form'
import { type ComponentPropsWithoutRef } from 'react'

import { withForm } from '@/hooks/use-app-form'
import { formatFormErrors } from '@/utils/format-form-errors'

import { Button } from '../ui/button'
import { type DialogTrigger } from '../ui/dialog'
import { Form } from '../ui/form'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogPanel,
  ResponsiveDialogPopup,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '../ui/responsive-dialog'

interface FormModalProps {
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  submitLabel: string
  title: string
  trigger: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
}

export const getFormDialog = <T,>(defaultValues: T) =>
  withForm({
    defaultValues,
    props: {} as FormModalProps,
    render: function Render({ children, form, open, setOpen, submitLabel, title, trigger }) {
      const errors = useStore(form.store, (state) => formatFormErrors(state.errors))

      return (
        <ResponsiveDialog onOpenChange={setOpen} open={open}>
          <ResponsiveDialogTrigger render={trigger} />

          <ResponsiveDialogPopup>
            <Form
              className="contents"
              errors={errors}
              onSubmit={async (event) => {
                event.preventDefault()
                event.stopPropagation()
                await form.handleSubmit()
              }}
            >
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
              </ResponsiveDialogHeader>
              <ResponsiveDialogPanel className="flex flex-col gap-4">{children}</ResponsiveDialogPanel>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose render={<Button disabled={form.state.isSubmitting} variant="outline" />}>Annuler</ResponsiveDialogClose>
                <form.AppForm>
                  <form.FormSubmit label={submitLabel} />
                </form.AppForm>
              </ResponsiveDialogFooter>
            </Form>
          </ResponsiveDialogPopup>
        </ResponsiveDialog>
      )
    },
  })
