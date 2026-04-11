import { Link, type ErrorComponentProps } from '@tanstack/react-router'

import { Button } from '../ui/button'

export const DefaultErrorComponent = ({ error }: ErrorComponentProps) => (
  <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4" role="alert">
    <h1 className="text-5xl font-semibold">Whoops!</h1>
    <div className="flex flex-col gap-2 text-center">
      <h2 className="text-3xl font-semibold">Une erreur est survenue</h2>
      <p>Une erreur est survenue lors du chargement de la page, nous vous suggérons de revenir à la page d'accueil.</p>
    </div>
    {import.meta.env.DEV && (
      <div className="rounded-sm border border-destructive p-1 text-sm text-destructive">{error.message ? <code>{error.message}</code> : null}</div>
    )}
    <Button render={<Link to="/" />} size="lg">
      Retour à la page d'accueil
    </Button>
  </div>
)
