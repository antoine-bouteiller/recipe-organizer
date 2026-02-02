import { Link } from '@tanstack/react-router'

import { Button } from '../ui/button'

export const DefaultErrorComponent = () => (
  <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4" role="alert">
    <h1 className="text-5xl font-semibold">Whoops!</h1>
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-3xl font-semibold">Une erreur est survenue</h2>
      <p>La page que vous recherchez n'existe pas, nous vous suggérons de revenir à la page d'accueil.</p>
    </div>
    <Button render={<Link to="/" />} size="lg">
      Rerour à la page d'accueil
    </Button>
  </div>
)
