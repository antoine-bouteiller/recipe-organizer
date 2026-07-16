import { Show } from 'solid-js'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useFormContext } from '@/hooks/use-form-context'

export const FormSubmit = (props: { label: string }) => {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button disabled={isSubmitting()} type="submit">
          <Show when={isSubmitting()}>
            <Spinner />
          </Show>
          {props.label}
        </Button>
      )}
    </form.Subscribe>
  )
}
