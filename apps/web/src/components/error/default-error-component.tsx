import { Button } from '@recipe-organizer/design-system/button'
import { DefaultErrorComponent as ErrorView } from '@recipe-organizer/design-system/default-error-component'
import { Link, type ErrorComponentProps } from '@tanstack/react-router'

export const DefaultErrorComponent = ({ error }: ErrorComponentProps) => (
  <ErrorView
    description="Une erreur est survenue lors du chargement de la page, nous vous suggérons de revenir à la page d'accueil."
    action={
      <Button render={<Link to="/" />} size="lg">
        Retour à la page d'accueil
      </Button>
    }
    details={import.meta.env.DEV && error instanceof Error ? error.message : undefined}
  />
)
