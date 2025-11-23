import { withForm } from '@/hooks/use-app-form'
import { formatFormErrors } from '@/utils/format-form-errors'
import { useStore } from '@tanstack/react-form'
import { type ComponentPropsWithoutRef } from 'react'
import { Button } from '../ui/button'
import type { DialogTrigger } from '../ui/dialog'
import { Form } from '../ui/form'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '../ui/responsive-dialog'

interface FormModalProps {
  children: React.ReactNode
  title: string
  submitLabel: string
  trigger: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
  open: boolean
  setOpen: (open: boolean) => void
}

export const getFormDialog = <T,>(defaultValues: T) =>
  withForm({
    defaultValues,
    props: {} as FormModalProps,
    render: ({ form, children, title, submitLabel, trigger, open, setOpen }) => {
      const errors = useStore(form.store, (state) => formatFormErrors(state.errors))

      return (
        <ResponsiveDialog open={open} onOpenChange={setOpen}>
          <ResponsiveDialogTrigger render={trigger} />

          <ResponsiveDialogContent>
            <Form
              onSubmit={async (event) => {
                event.preventDefault()
                event.stopPropagation()
                await form.handleSubmit()
              }}
              errors={errors}
            >
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
              </ResponsiveDialogHeader>
              <div className="flex flex-col gap-2 px-4 md:px-0 md:py-4">{children}</div>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline" disabled={form.state.isSubmitting} />}
                >
                  Annuler
                </ResponsiveDialogClose>
                <form.AppForm>
                  <form.FormSubmit label={submitLabel} />
                </form.AppForm>
              </ResponsiveDialogFooter>
            </Form>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      )
    },
  })
