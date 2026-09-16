import { Button } from '@recipe-organizer/design-system/button'
import { css } from '@recipe-organizer/design-system/css'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { Link } from '@tanstack/react-router'

/** Owns the mobile-only placement and motion of the recipe creation affordance. */
export const FloatingCreateRecipeAction = () => (
  <div
    className={css({
      _active: { transform: 'scale(0.95)' },
      _hover: { transform: 'translateY(-0.125rem)' },
      bottom: '16',
      display: { md: 'none' },
      position: 'fixed',
      right: '2',
      transitionDuration: '200ms',
      transitionProperty: 'transform',
      transitionTimingFunction: 'ease-out',
    })}
  >
    <Button aria-label="Ajouter une recette" render={<Link to="/recipe/new" viewTransition />} size="icon-xl">
      <PlusIcon size="xl" />
    </Button>
  </div>
)
