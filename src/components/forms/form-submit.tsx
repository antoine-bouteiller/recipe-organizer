import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useFormContext } from '@/hooks/use-form-context'

export const FormSubmit = ({ label }: { label: string }) => {
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
