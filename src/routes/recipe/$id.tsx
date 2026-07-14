import { createFileRoute } from '@tanstack/solid-router'
import { DotsThreeVerticalIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/solid-router'
import * as v from 'valibot'

import { Editor, EditorContent } from '@/components/common/editor'
import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Popover } from '@/components/ui/popover'
import { SwipeTabs, SwipeTabsPanels, TabsList, TabsTab } from '@/components/ui/tabs'
import { getRecipeDetailsOptions } from '@/features/recipe/api/get-one'
import DeleteRecipe from '@/features/recipe/components/delete-recipe'
import { recipeNodes } from '@/features/recipe/components/editor/extensions'
import { QuantityControls } from '@/features/recipe/components/quantity-controls'
import { RecipeIngredientGroups } from '@/features/recipe/components/recipe-section'

const RecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe } = useQuery(getRecipeDetailsOptions(id))
  const { authUser } = Route.useRouteContext()

  if (!recipe) {
    return null
  }

  const ingredientGroups = [
    ...recipe.ingredientGroups,
    ...recipe.linkedRecipes.map(({ linkedRecipe }) => ({
      ...linkedRecipe.ingredientGroups[0],
      groupName: linkedRecipe.name,
      isDefault: false,
    })),
  ]

  return (
    <ScreenLayout
      title={recipe.name}
      withGoBack
      backgroundImage={recipe.image}
      headerEndItem={
        authUser && (
          <Popover
            trigger={
              <Button size="icon" variant="outline">
                <DotsThreeVerticalIcon className="text-primary" weight="bold" />
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
      <h1 className="hidden px-4 py-2 font-heading text-3xl md:block">{recipe.name}</h1>
      <QuantityControls className="my-2" recipeId={id} servings={recipe.servings} />

      <div className="prose prose-sm flex min-h-0 max-w-none flex-1 flex-col text-foreground dark:prose-invert">
        <div className="flex min-h-0 flex-1 flex-col md:hidden">
          <SwipeTabs className="flex min-h-0 flex-1 flex-col" defaultTab="ingredients" tabs={['ingredients', 'preparation'] as const}>
            <TabsList className="w-full">
              <TabsTab value="ingredients">Ingrédients</TabsTab>
              <TabsTab value="preparation">Préparation</TabsTab>
            </TabsList>
            <SwipeTabsPanels>
              <div className="overflow-y-auto px-2">
                <RecipeIngredientGroups recipeId={recipe.id} baseServings={recipe.servings} ingredientGroups={ingredientGroups} />
              </div>
              <div className="overflow-y-auto p-2">
                <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
                  <EditorContent />
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
              <EditorContent className="pb-4" />
            </Editor>
          </Card>
        </div>
      </div>
    </ScreenLayout>
  )
}

const paramsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.transform((str) => Number.parseInt(str, 10))
  ),
})

export const Route = createFileRoute('/recipe/$id')({
  component: RecipePage,
  loader: async ({ context, params }) => {
    const result = v.safeParse(paramsSchema, params)
    if (!result.success) {
      throw new Error(result.issues[0]?.message ?? 'Invalid id')
    }
    const { id } = result.output

    await context.queryClient.ensureQueryData(getRecipeDetailsOptions(id))

    return { id }
  },
  ssr: 'data-only',
})
