import { DotsThreeVerticalIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import * as z from 'zod'

import { Editor, EditorContent } from '@/components/common/editor'
import { NotFound } from '@/components/error/not-found'
import { ScreenLayout } from '@/components/layout/screen-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Popover } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { SwipeTabs, SwipeTabsPanels, TabsList, TabsTab } from '@/components/ui/tabs'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { getRecipeDetailsOptions } from '@/features/recipe/api/get-one'
import DeleteRecipe from '@/features/recipe/components/delete-recipe'
import { recipeNodes } from '@/features/recipe/components/editor/extensions'
import { QuantityControls } from '@/features/recipe/components/quantity-controls'
import { RecipeIngredientGroups } from '@/features/recipe/components/recipe-section'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, VEGETARIAN_LABEL } from '@/features/recipe/utils/constants'
import { incrementalArray } from '@/utils/array'

const RecipeDetailsSkeleton = () => {
  const { id } = Route.useParams()
  const recipes = useQueryClient().getQueryData(getRecipeListOptions().queryKey)
  const recipe = recipes?.find((item) => item.id === Number(id))

  return (
    <ScreenLayout title={recipe?.name ?? ''} withGoBack backgroundImage={recipe?.image}>
      <Skeleton className="mt-3 h-10 w-full rounded-lg" />
      <div className="flex flex-col gap-3 pt-5">
        {incrementalArray({ length: 6 }).map((index) => (
          <Skeleton className="h-5 w-full" key={index} />
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
      <div className="flex h-screen items-center justify-center">
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
              <Button
                className="border-white/20 bg-white/15 text-white backdrop-blur-md hover:bg-white/25 data-pressed:bg-white/25 dark:bg-white/15 dark:hover:bg-white/25 dark:data-pressed:bg-white/25"
                size="icon"
                variant="outline"
              >
                <DotsThreeVerticalIcon weight="bold" />
              </Button>
            }
          >
            <div className="flex flex-col items-start gap-2 p-4 md:p-0">
              <Button
                className="w-full justify-start"
                render={<Link params={{ id: recipe.id.toString() }} to="/recipe/edit/$id" viewTransition />}
                variant="ghost"
              >
                <PencilSimpleIcon className="size-4" />
                Modifier la recette
              </Button>
              <DeleteRecipe recipeId={recipe.id} recipeName={recipe.name} />
            </div>
          </Popover>
        )
      }
    >
      <h1 className="hidden px-4 py-2 font-heading text-3xl font-bold tracking-tight text-balance md:block">{recipe.name}</h1>
      {metaTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-1 pt-1">
          {metaTags.map((label) => (
            <Badge key={label} size="sm" variant="eyebrow">
              {label}
            </Badge>
          ))}
        </div>
      )}
      <QuantityControls className="my-2" recipeId={id} servings={recipe.servings} />

      <div className="prose prose-sm flex min-h-0 max-w-none flex-1 flex-col text-foreground dark:prose-invert">
        <div className="-mb-4 flex min-h-0 flex-1 flex-col md:hidden">
          <SwipeTabs className="flex min-h-0 flex-1 flex-col" defaultTab="ingredients" tabs={['ingredients', 'preparation'] as const}>
            <TabsList className="w-full">
              <TabsTab value="ingredients">Ingrédients</TabsTab>
              <TabsTab value="preparation">Préparation</TabsTab>
            </TabsList>
            <SwipeTabsPanels>
              <div className="overflow-y-auto px-2 pb-4">
                <RecipeIngredientGroups recipeId={recipe.id} baseServings={recipe.servings} ingredientGroups={ingredientGroups} />
              </div>
              <div className="overflow-y-auto p-2 pb-4">
                <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
                  <EditorContent className="max-w-[65ch]" />
                </Editor>
              </div>
            </SwipeTabsPanels>
          </SwipeTabs>
        </div>

        <div className="hidden grid-cols-5 items-stretch gap-8 pt-4 md:grid">
          <Card className="col-span-2 rounded-3xl border-0 px-8 pb-8 shadow-lg [&_ul]:rounded-none [&_ul]:border-0 [&_ul]:bg-transparent [&_ul]:px-0">
            <h2>Ingrédients</h2>
            <RecipeIngredientGroups recipeId={id} baseServings={recipe.servings} ingredientGroups={ingredientGroups} />
          </Card>

          <Card className="col-span-3 rounded-3xl border-0 px-8 pb-8 shadow-lg">
            <h2>Préparation</h2>
            <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
              <EditorContent className="max-w-[65ch] pb-4" />
            </Editor>
          </Card>
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

    await context.queryClient.ensureQueryData(getRecipeDetailsOptions(id))

    return { id }
  },
  pendingComponent: RecipeDetailsSkeleton,
  ssr: 'data-only',
})
