import { Button } from '@recipe-organizer/design-system/button'
import { CaretLeftIcon } from '@recipe-organizer/design-system/icons/caret-left'
import { NotFound as NotFoundView } from '@recipe-organizer/design-system/not-found'
import { Link } from '@tanstack/react-router'

export const NotFound = () => (
  <NotFoundView
    action={
      <Button render={<Link to="/" />} size="lg">
        <CaretLeftIcon />
        Retour à l&apos;accueil
      </Button>
    }
  />
)
