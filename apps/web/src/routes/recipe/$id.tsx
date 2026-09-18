import { NotFound } from '@client/components/error/not-found'
import { ScreenLayout } from '@client/components/layout/screen-layout'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { getRecipeDetailsOptions } from '@client/features/recipe/api/get-one'
import DeleteRecipe from '@client/features/recipe/components/delete-recipe'
import { recipeNodes } from '@client/features/recipe/components/editor/extensions'
import { QuantityControls } from '@client/features/recipe/components/quantity-controls'
import { RecipeIngredientGroups } from '@client/features/recipe/components/recipe-section'
import { Badge } from '@recipe-organizer/design-system/badge'
import { Button } from '@recipe-organizer/design-system/button'
import { Editor, EditorContent } from '@recipe-organizer/design-system/editor'
import { DotsThreeVerticalIcon } from '@recipe-organizer/design-system/icons/dots-three-vertical'
import { PencilSimpleIcon } from '@recipe-organizer/design-system/icons/pencil-simple'
import { Popover } from '@recipe-organizer/design-system/popover'
import { Skeleton } from '@recipe-organizer/design-system/skeleton'
import { Spinner } from '@recipe-organizer/design-system/spinner'
import { SwipeTabs, SwipeTabsPanel, SwipeTabsPanels, TabsList, TabsTab } from '@recipe-organizer/design-system/tabs'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, VEGETARIAN_LABEL } from '@recipe-organizer/shared/recipe/constants'
import { incrementalArray } from '@recipe-organizer/shared/utils/array'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import * as z from 'zod'

import * as styles from './$id.css'

const RecipeDetailsSkeleton = () => {
  const { id } = Route.useParams()
  const recipes = useQueryClient().getQueryData(getRecipeListOptions().queryKey)
  const recipe = recipes?.find((item) => item.id === Number(id))

  return (
    <ScreenLayout title={recipe?.name ?? ''} withGoBack backgroundImage={recipe?.image}>
      <div className={styles.container}>
        <Skeleton preset="recipe-details-title" />
      </div>
      <div className={styles.container2}>
        {incrementalArray({ length: 6 }).map((index) => (
          <Skeleton preset="recipe-details-text" key={index} />
        ))}
      </div>
    </ScreenLayout>
  )
}

const RecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe, isLoading } = useSuspenseQuery(getRecipeDetailsOptions(id))
  const { authUser } = Route.useRouteContext()

  if (isLoading) {
    return (
      <div className={styles.container3}>
        <Spinner />
      </div>
    )
  }

  if (!recipe) {
    return <NotFound />
  }

  const ingredientGroups = [
    ...recipe.ingredientGroups,
    ...recipe.linkedRecipes.map(({ linkedRecipe }) => ({
      ...linkedRecipe.ingredientGroups[0],
      groupName: linkedRecipe.name,
      isDefault: false,
    })),
  ]

  const metaTags = [
    recipe.isVegetarian && VEGETARIAN_LABEL,
    recipe.isMagimix && MAGIMIX_LABEL,
    ...recipe.meals.map((meal) => MEAL_LABELS[meal]),
    ...recipe.cuisineTypes.map((cuisineType) => CUISINE_TYPE_LABELS[cuisineType]),
  ].filter((tag) => tag !== false)

  return (
    <ScreenLayout
      title={recipe.name}
      withGoBack
      backgroundImage={recipe.image}
      headerEndItem={
        authUser && (
          <Popover
            trigger={
              <Button size="icon" variant="ghost">
                <DotsThreeVerticalIcon weight="bold" />
              </Button>
            }
          >
            <div className={styles.container4}>
              <Button
                align="start"
                render={<Link params={{ id: recipe.id.toString() }} to="/recipe/edit/$id" viewTransition />}
                variant="list-action"
                width="full"
              >
                <PencilSimpleIcon size="sm" />
                Modifier la recette
              </Button>
              <DeleteRecipe recipeId={recipe.id} recipeName={recipe.name} />
            </div>
          </Popover>
        )
      }
    >
      <h1 className={styles.heading}>{recipe.name}</h1>
      {metaTags.length > 0 && (
        <div className={styles.container5}>
          {metaTags.map((label) => (
            <Badge key={label} size="sm" variant="secondary">
              {label}
            </Badge>
          ))}
        </div>
      )}
      <div className={styles.container6}>
        <QuantityControls recipeId={id} servings={recipe.servings} />
      </div>

      <div className={styles.container7}>
        <div className={styles.container8}>
          <SwipeTabs defaultTab="ingredients" tabs={['ingredients', 'preparation'] as const}>
            <TabsList width="full">
              <TabsTab value="ingredients">Ingrédients</TabsTab>
              <TabsTab value="preparation">Préparation</TabsTab>
            </TabsList>
            <SwipeTabsPanels>
              <SwipeTabsPanel value="ingredients">
                <div className={styles.container9}>
                  <RecipeIngredientGroups
                    recipeId={recipe.id}
                    baseServings={recipe.servings}
                    ingredientGroups={ingredientGroups}
                    presentation="standalone"
                  />
                </div>
              </SwipeTabsPanel>
              <SwipeTabsPanel value="preparation">
                <div className={styles.container10}>
                  <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
                    <EditorContent width="reading" />
                  </Editor>
                </div>
              </SwipeTabsPanel>
            </SwipeTabsPanels>
          </SwipeTabs>
        </div>

        <div className={styles.container11}>
          <section className={styles.section}>
            <h2 className={styles.heading2}>Ingrédients</h2>
            <RecipeIngredientGroups recipeId={id} baseServings={recipe.servings} ingredientGroups={ingredientGroups} presentation="embedded" />
          </section>

          <section className={styles.section2}>
            <h2 className={styles.heading3}>Préparation</h2>
            <div className={styles.container12}>
              <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
                <EditorContent width="reading" />
              </Editor>
            </div>
          </section>
        </div>
      </div>
    </ScreenLayout>
  )
}

const paramsSchema = z.object({
  id: z.string().transform((str) => Number.parseInt(str, 10)),
})

export const Route = createFileRoute('/recipe/$id')({
  component: RecipePage,
  loader: async ({ context, params }) => {
    const result = paramsSchema.safeParse(params)
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message ?? 'Invalid id')
    }
    const { id } = result.data

    await context.queryClient.query({ ...getRecipeDetailsOptions(id), staleTime: 'static' })

    return { id }
  },
  pendingComponent: RecipeDetailsSkeleton,
})
