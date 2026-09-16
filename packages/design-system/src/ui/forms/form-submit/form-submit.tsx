import { useFormContext } from '../../../hooks/use-form-context'
import { Button } from '../../actions/button/button'
import { Spinner } from '../../feedback/spinner/spinner'

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
