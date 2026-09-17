import { FloatingCreateRecipeAction } from '@client/components/floating-create-recipe-action'
import { ScreenLayout } from '@client/components/layout/screen-layout'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import RecipeCard from '@client/features/recipe/components/recipe-card'
import { Button } from '@recipe-organizer/design-system/button'
import { BookIcon } from '@recipe-organizer/design-system/icons/book'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { Skeleton } from '@recipe-organizer/design-system/skeleton'
import { incrementalArray } from '@recipe-organizer/shared/utils/array'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import * as z from 'zod'

import * as styles from './index.css'

const searchSchema = z.object({
  search: z.boolean().optional(),
})

const RecipeListSkeleton = () => (
  <ScreenLayout title="Recettes" pageKey="/">
    <div className={styles.container}>
      {incrementalArray({ length: 6 }).map((index) => (
        <Skeleton preset="recipe-card" key={index} />
      ))}
    </div>
  </ScreenLayout>
)

const RecipeList = () => {
  const { authUser } = Route.useRouteContext()
  const { data: recipes } = useSuspenseQuery(getRecipeListOptions())

  const visibleRecipes = recipes.filter((recipe) => !recipe.isSpice)

  return (
    <ScreenLayout title="Recettes" pageKey="/">
      {visibleRecipes.length === 0 ? (
        <div className={styles.container2}>
          <div className={styles.container3}>
            <BookIcon size="xl" />
          </div>
          <p className={styles.text}>Aucune recette</p>
          {authUser && (
            <Button render={<Link to="/recipe/new" viewTransition />}>
              <PlusIcon size="sm" />
              Ajouter une recette
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.container4}>
          {visibleRecipes.map((recipe, index) => (
            <RecipeCard recipe={recipe} index={index} key={recipe.id} />
          ))}
        </div>
      )}
      {authUser && <FloatingCreateRecipeAction />}
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/')({
  component: RecipeList,
  loader: async ({ context }) => {
    await context.queryClient.query({ ...getRecipeListOptions(), staleTime: 'static' })
  },
  pendingComponent: RecipeListSkeleton,
  validateSearch: (search) => {
    const result = searchSchema.safeParse(search)
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message ?? 'Invalid search params')
    }
    return result.data
  },
})
