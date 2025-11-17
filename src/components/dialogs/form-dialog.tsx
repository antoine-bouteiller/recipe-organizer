import { withForm } from '@/hooks/use-app-form'
import { useState, type ComponentPropsWithoutRef } from 'react'
import { Button } from '../ui/button'
import type { DialogTrigger } from '../ui/dialog'
import {
  ResponsiveDialog,
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
}

export const getFormDialog = <T,>(defaultValues: T) =>
  withForm({
    defaultValues,
    props: {} as FormModalProps,
    render: function Render({ form, children, title, submitLabel, trigger }) {
      const [isOpen, setIsOpen] = useState(false)

      return (
        <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
          <ResponsiveDialogTrigger render={trigger} />
          <form
            onSubmit={async (event) => {
              event.preventDefault()
              await form.handleSubmit()
              form.reset()
              setIsOpen(false)
            }}
          >
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
              </ResponsiveDialogHeader>
              <div className="flex flex-col gap-4 px-4 md:px-0">{children}</div>
              <ResponsiveDialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={form.state.isSubmitting}
                >
                  Annuler
                </Button>
                <form.AppForm>
                  <form.FormSubmit label={submitLabel} />
                </form.AppForm>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </form>
        </ResponsiveDialog>
      )
    },
  })
