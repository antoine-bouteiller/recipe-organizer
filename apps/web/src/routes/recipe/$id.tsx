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
import { css } from '@recipe-organizer/design-system/css'
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

const RecipeDetailsSkeleton = () => {
  const { id } = Route.useParams()
  const recipes = useQueryClient().getQueryData(getRecipeListOptions().queryKey)
  const recipe = recipes?.find((item) => item.id === Number(id))

  return (
    <ScreenLayout title={recipe?.name ?? ''} withGoBack backgroundImage={recipe?.image}>
      <div className={css({ marginTop: '3' })}>
        <Skeleton preset="recipe-details-title" />
      </div>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '3', paddingTop: '5' })}>
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
      <div className={css({ alignItems: 'center', display: 'flex', height: '100vh', justifyContent: 'center' })}>
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
              <Button size="icon" variant="media-overlay-header">
                <DotsThreeVerticalIcon weight="bold" />
              </Button>
            }
          >
            <div className={css({ alignItems: 'flex-start', display: 'flex', flexDirection: 'column', gap: '2', padding: { base: '4', md: '0' } })}>
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
      <h1
        className={css({
          display: { base: 'none', md: 'block' },
          fontFamily: 'heading',
          fontSize: '3xl',
          fontWeight: 'bold',
          letterSpacing: 'tight',
          paddingBlock: '2',
          paddingInline: '4',
          textWrap: 'balance',
        })}
      >
        {recipe.name}
      </h1>
      {metaTags.length > 0 && (
        <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '1.5', paddingInline: '1', paddingTop: '1' })}>
          {metaTags.map((label) => (
            <Badge key={label} size="sm" variant="eyebrow">
              {label}
            </Badge>
          ))}
        </div>
      )}
      <div className={css({ marginBlock: '2' })}>
        <QuantityControls recipeId={id} servings={recipe.servings} />
      </div>

      <div className={css({ display: 'flex', flex: '1', flexDirection: 'column', minHeight: '0' })}>
        <div className={css({ display: { base: 'flex', md: 'none' }, flex: '1', flexDirection: 'column', marginBottom: '-4', minHeight: '0' })}>
          <SwipeTabs defaultTab="ingredients" tabs={['ingredients', 'preparation'] as const}>
            <TabsList width="full">
              <TabsTab value="ingredients">Ingrédients</TabsTab>
              <TabsTab value="preparation">Préparation</TabsTab>
            </TabsList>
            <SwipeTabsPanels>
              <SwipeTabsPanel value="ingredients">
                <div className={css({ height: 'full', overflowY: 'auto', paddingBottom: '4', paddingInline: '2' })}>
                  <RecipeIngredientGroups
                    recipeId={recipe.id}
                    baseServings={recipe.servings}
                    ingredientGroups={ingredientGroups}
                    presentation="standalone"
                  />
                </div>
              </SwipeTabsPanel>
              <SwipeTabsPanel value="preparation">
                <div className={css({ height: 'full', overflowY: 'auto', padding: '2', paddingBottom: '4' })}>
                  <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
                    <EditorContent width="reading" />
                  </Editor>
                </div>
              </SwipeTabsPanel>
            </SwipeTabsPanels>
          </SwipeTabs>
        </div>

        <div
          className={css({
            alignItems: 'stretch',
            display: { base: 'none', md: 'grid' },
            gap: '8',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            paddingTop: '4',
          })}
        >
          <section
            className={css({
              background: 'card',
              borderRadius: '3xl',
              boxShadow: 'lg',
              gridColumn: 'span 2 / span 2',
              paddingBottom: '8',
              paddingInline: '8',
            })}
          >
            <h2 className={css({ fontSize: 'xl', fontWeight: 'bold', lineHeight: '1.75rem', marginBottom: '4', marginTop: '8' })}>Ingrédients</h2>
            <RecipeIngredientGroups recipeId={id} baseServings={recipe.servings} ingredientGroups={ingredientGroups} presentation="embedded" />
          </section>

          <section
            className={css({
              background: 'card',
              borderRadius: '3xl',
              boxShadow: 'lg',
              gridColumn: 'span 3 / span 3',
              paddingBottom: '8',
              paddingInline: '8',
            })}
          >
            <h2 className={css({ fontSize: 'xl', fontWeight: 'bold', lineHeight: '1.75rem', marginBottom: '4', marginTop: '8' })}>Préparation</h2>
            <div className={css({ paddingBottom: '4' })}>
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
