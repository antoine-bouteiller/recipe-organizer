import { type ReactNode } from 'react'

export const DefaultErrorComponent = ({
  action,
  description = 'Une erreur est survenue lors du chargement de la page.',
  details,
}: {
  action?: ReactNode
  description?: ReactNode
  details?: string
}) => (
  <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4" role="alert">
    <h1 className="text-5xl font-semibold">Whoops!</h1>
    <div className="flex flex-col gap-2 text-center">
      <h2 className="text-3xl font-semibold">Une erreur est survenue</h2>
      <p>{description}</p>
    </div>
    {details && (
      <div className="rounded-sm border border-destructive p-1 text-sm text-destructive">
        <code>{details}</code>
      </div>
    )}
    {action}
  </div>
)
