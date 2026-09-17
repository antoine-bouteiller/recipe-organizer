import { Button } from '@recipe-organizer/design-system/button'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { Link } from '@tanstack/react-router'

import * as styles from './floating-create-recipe-action.css'

/** Owns the mobile-only placement and motion of the recipe creation affordance. */
export const FloatingCreateRecipeAction = () => (
  <div className={styles.container}>
    <Button aria-label="Ajouter une recette" render={<Link to="/recipe/new" viewTransition />} size="icon-xl">
      <PlusIcon size="xl" />
    </Button>
  </div>
)
