import { DotsThreeVerticalIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { z } from 'zod'

import { Button } from '@/components/common/button'
import { Editor, EditorContent } from '@/components/common/editor'
import { Popover } from '@/components/common/popover'
import { Tabs } from '@/components/common/tabs'
import { ScreenLayout } from '@/components/layout/screen-layout'
import { getRecipeDetailsOptions } from '@/features/recipe/api/get-one'
import DeleteRecipe from '@/features/recipe/components/delete-recipe'
import { recipeNodes } from '@/features/recipe/components/editor/extensions'
import { QuantityControls } from '@/features/recipe/components/quantity-controls'
import { RecipeIngredientGroups } from '@/features/recipe/components/recipe-section'
import { useSwipeTabs } from '@/hooks/use-swipe-tabs'

const RecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe } = useQuery(getRecipeDetailsOptions(id))
  const { authUser } = Route.useRouteContext()

  const { activeTab, containerRef, swipeX, goTo, onTouchStart, onTouchMove, onTouchEnd } = useSwipeTabs(
    ['ingredients', 'preparation'] as const,
    'ingredients'
  )

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
          <Popover>
            <Popover.Trigger render={<Button size="icon" variant="outline" />}>
              <DotsThreeVerticalIcon className="text-primary" weight="bold" />
            </Popover.Trigger>
            <Popover.Content>
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
            </Popover.Content>
          </Popover>
        )
      }
    >
      <h1 className="hidden px-4 py-2 font-heading text-3xl md:block">{recipe.name}</h1>
      <QuantityControls
        className="flex w-full items-center justify-center gap-2 px-8 py-2 md:justify-start"
        recipeId={id}
        servings={recipe.servings}
      />

      <div className="prose prose-sm flex min-h-0 max-w-none flex-1 flex-col text-foreground">
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 md:hidden">
          <Tabs className="flex min-h-0 flex-1 flex-col" onValueChange={(value) => goTo(value as 'ingredients' | 'preparation')} value={activeTab}>
            <Tabs.List className="w-full">
              <Tabs.Tab value="ingredients">Ingrédients</Tabs.Tab>
              <Tabs.Tab value="preparation">Préparation</Tabs.Tab>
            </Tabs.List>
            <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden">
              <motion.div className="flex h-full" onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} style={{ x: swipeX }}>
                <div className="min-w-full overflow-y-auto px-2">
                  <RecipeIngredientGroups recipeId={recipe.id} baseServings={recipe.servings} ingredientGroups={ingredientGroups} />
                </div>
                <div className="min-w-full overflow-y-auto p-2">
                  <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
                    <EditorContent />
                  </Editor>
                </div>
              </motion.div>
            </div>
          </Tabs>
        </div>

        <div className="hidden flex-1 grid-cols-5 gap-8 p-4 md:grid">
          <div className="col-span-2 rounded-xl border px-8 pb-8">
            <h2>Ingrédients</h2>
            <RecipeIngredientGroups recipeId={id} baseServings={recipe.servings} ingredientGroups={ingredientGroups} />
          </div>

          <div className="col-span-3 rounded-xl border px-8 pb-8">
            <h2>Préparation</h2>
            <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
              <EditorContent className="pb-4" />
            </Editor>
          </div>
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
      throw new Error(result.error?.issues[0]?.message ?? 'Invalid id')
    }
    const { id } = result.data

    await context.queryClient.ensureQueryData(getRecipeDetailsOptions(id))

    return { id }
  },
})
