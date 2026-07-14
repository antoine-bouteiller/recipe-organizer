import { useQuery } from '@tanstack/solid-query'
import { createFileRoute, Link } from '@tanstack/solid-router'
import { Show } from 'solid-js'
import * as v from 'valibot'
import DotsThreeVertical from '~icons/ph/dots-three-vertical-bold'
import PencilSimple from '~icons/ph/pencil-simple'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Popover } from '@/components/ui/popover'
import { SwipeTabs, SwipeTabsPanels, TabsList, TabsTab } from '@/components/ui/tabs'
import { getRecipeDetailsOptions } from '@/features/recipe/api/get-one'
import DeleteRecipe from '@/features/recipe/components/delete-recipe'
import { QuantityControls } from '@/features/recipe/components/quantity-controls'
import { RecipeIngredientGroups } from '@/features/recipe/components/recipe-section'
import { cn } from '@/utils/cn'

const InstructionsPlaceholder = () => (
  <div class="p-2 text-sm text-muted-foreground">Les instructions seront disponibles après la migration de l&apos;éditeur.</div>
)

const RecipePage = () => {
  const loaderData = Route.useLoaderData()
  const context = Route.useRouteContext()
  const recipeQuery = useQuery(() => getRecipeDetailsOptions(loaderData().id))

  return (
    <Show when={recipeQuery.data}>
      {(recipe) => {
        const ingredientGroups = () => [
          ...recipe().ingredientGroups,
          ...recipe().linkedRecipes.map(({ linkedRecipe }) => ({
            ...linkedRecipe.ingredientGroups[0],
            groupName: linkedRecipe.name,
            isDefault: false,
          })),
        ]

        return (
          <ScreenLayout
            backgroundImage={recipe().image}
            headerEndItem={
              context().authUser ? (
                <Popover
                  trigger={{
                    as: Button,
                    children: <DotsThreeVertical class="text-primary" />,
                    size: 'icon',
                    variant: 'outline',
                  }}
                >
                  <div class="flex flex-col items-start gap-2 p-4 md:p-0">
                    <Link
                      class={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start')}
                      params={{ id: recipe().id.toString() }}
                      to="/recipe/edit/$id"
                      viewTransition
                    >
                      <PencilSimple class="size-4" />
                      Modifier la recette
                    </Link>
                    <DeleteRecipe recipeId={recipe().id} recipeName={recipe().name} />
                  </div>
                </Popover>
              ) : undefined
            }
            title={recipe().name}
            withGoBack
          >
            <h1 class="hidden px-4 py-2 font-heading text-3xl md:block">{recipe().name}</h1>
            <QuantityControls class="my-2" recipeId={loaderData().id} servings={recipe().servings} />

            <div class="prose prose-sm flex min-h-0 max-w-none flex-1 flex-col text-foreground dark:prose-invert">
              <div class="flex min-h-0 flex-1 flex-col md:hidden">
                <SwipeTabs class="flex min-h-0 flex-1 flex-col" defaultTab="ingredients" tabs={['ingredients', 'preparation'] as const}>
                  <TabsList class="w-full">
                    <TabsTab value="ingredients">Ingrédients</TabsTab>
                    <TabsTab value="preparation">Préparation</TabsTab>
                  </TabsList>
                  <SwipeTabsPanels>
                    <div class="overflow-y-auto px-2">
                      <RecipeIngredientGroups baseServings={recipe().servings} ingredientGroups={ingredientGroups()} recipeId={recipe().id} />
                    </div>
                    <div class="overflow-y-auto p-2">
                      <InstructionsPlaceholder />
                    </div>
                  </SwipeTabsPanels>
                </SwipeTabs>
              </div>

              <div class="hidden grid-cols-5 items-stretch gap-8 pt-4 md:grid">
                <Card class="col-span-2 rounded-3xl border-0 px-8 pb-8 shadow-lg [&_ul]:rounded-none [&_ul]:border-0 [&_ul]:bg-transparent [&_ul]:px-0">
                  <h2>Ingrédients</h2>
                  <RecipeIngredientGroups baseServings={recipe().servings} ingredientGroups={ingredientGroups()} recipeId={loaderData().id} />
                </Card>

                <Card class="col-span-3 rounded-3xl border-0 px-8 pb-8 shadow-lg">
                  <h2>Préparation</h2>
                  <InstructionsPlaceholder />
                </Card>
              </div>
            </div>
          </ScreenLayout>
        )
      }}
    </Show>
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
