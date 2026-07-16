import { type ErrorComponentProps, Link } from '@tanstack/solid-router'
import { Show } from 'solid-js'

import { Button } from '@/components/ui/button'

export const DefaultErrorComponent = (props: ErrorComponentProps) => (
  <div class="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4" role="alert">
    <h1 class="text-5xl font-semibold">Whoops!</h1>
    <div class="flex flex-col gap-2 text-center">
      <h2 class="text-3xl font-semibold">Une erreur est survenue</h2>
      <p>Une erreur est survenue lors du chargement de la page, nous vous suggérons de revenir à la page d'accueil.</p>
    </div>
    <Show when={import.meta.env.DEV && props.error.message}>
      <div class="rounded-sm border border-destructive p-1 text-sm text-destructive">
        <code>{props.error.message}</code>
      </div>
    </Show>
    <Button as={Link} size="lg" to="/">
      Retour à la page d'accueil
    </Button>
  </div>
)
