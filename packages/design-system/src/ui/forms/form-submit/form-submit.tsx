import { useFormContext } from '@design-system/hooks/use-form-context'
import { Button } from '@recipe-organizer/design-system/button'
import { Spinner } from '@recipe-organizer/design-system/spinner'

export interface FormSubmitProps {
  label: string
}

export const FormSubmit = ({ label }: FormSubmitProps) => {
  const form = useFormContext()
  return (
    <form.Subscribe>
      {({ isSubmitting }) => (
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Spinner />}
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}
