import { Button } from '@/components/ui/actions/button/button'
import { Spinner } from '@/components/ui/feedback/spinner/spinner'
import { useFormContext } from '@/hooks/use-form-context'

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
