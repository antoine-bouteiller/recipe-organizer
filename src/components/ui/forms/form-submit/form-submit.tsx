import { Button } from '@/components/ui/actions/button/button'
import { Spinner } from '@/components/ui/feedback/spinner/spinner'

export interface FormSubmitProps {
  label: string
  pending: boolean
}

export const FormSubmit = ({ label, pending }: FormSubmitProps) => (
  <Button disabled={pending} type="submit">
    {pending && <Spinner />}
    {label}
  </Button>
)
