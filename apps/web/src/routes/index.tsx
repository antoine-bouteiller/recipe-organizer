import { FloatingCreateRecipeAction } from '@client/components/floating-create-recipe-action'
import { ScreenLayout } from '@client/components/layout/screen-layout'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import RecipeCard from '@client/features/recipe/components/recipe-card'
import { Button } from '@recipe-organizer/design-system/button'
import { css } from '@recipe-organizer/design-system/css'
import { BookIcon } from '@recipe-organizer/design-system/icons/book'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { Skeleton } from '@recipe-organizer/design-system/skeleton'
import { incrementalArray } from '@recipe-organizer/shared/utils/array'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import * as z from 'zod'

const searchSchema = z.object({
  search: z.boolean().optional(),
})

const RecipeListSkeleton = () => (
  <ScreenLayout title="Recettes" pageKey="/">
    <div
      className={css({
        display: 'grid',
        gap: { base: '4', sm: '6' },
        gridTemplateColumns: { base: 'repeat(1, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))', sm: 'repeat(2, minmax(0, 1fr))' },
      })}
    >
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
        <div
          className={css({
            alignItems: 'center',
            display: 'flex',
            flex: '1',
            flexDirection: 'column',
            gap: '4',
            justifyContent: 'center',
            padding: '8',
            textAlign: 'center',
          })}
        >
          <div
            className={css({
              alignItems: 'center',
              background: 'accent',
              borderRadius: 'full',
              color: 'primary',
              display: 'flex',
              height: '16',
              justifyContent: 'center',
              width: '16',
            })}
          >
            <BookIcon size="xl" />
          </div>
          <p className={css({ color: 'muted-foreground', textWrap: 'balance' })}>Aucune recette</p>
          {authUser && (
            <Button render={<Link to="/recipe/new" viewTransition />}>
              <PlusIcon size="sm" />
              Ajouter une recette
            </Button>
          )}
        </div>
      ) : (
        <div
          className={css({
            display: 'grid',
            gap: { base: '4', sm: '6' },
            gridTemplateColumns: { base: 'repeat(1, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))', sm: 'repeat(2, minmax(0, 1fr))' },
          })}
        >
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
