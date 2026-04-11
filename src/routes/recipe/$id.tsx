import { DotsThreeVerticalIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { ClientOnly, createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { z } from 'zod'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Editor, EditorContent } from '@/components/ui/editor'
import { ResponsivePopover, ResponsivePopoverContent, ResponsivePopoverTrigger } from '@/components/ui/responsive-popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs'
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
          <ResponsivePopover>
            <ResponsivePopoverTrigger render={<Button size="icon" variant="outline" />}>
              <DotsThreeVerticalIcon className="text-primary" weight="bold" />
            </ResponsivePopoverTrigger>
            <ResponsivePopoverContent>
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
            </ResponsivePopoverContent>
          </ResponsivePopover>
        )
      }
    >
      <h1 className="hidden px-4 py-2 font-heading text-3xl md:block">{recipe.name}</h1>
      <ClientOnly
        fallback={
          <div className="flex w-full items-center justify-center gap-2 px-8 py-2 md:justify-start">
            <Skeleton className="size-10" />
            <Skeleton className="h-6 w-8" />
            <Skeleton className="size-10" />
            <Skeleton className="h-10 w-48" />
          </div>
        }
      >
        <QuantityControls
          className="flex w-full items-center justify-center gap-2 px-8 py-2 md:justify-start"
          recipeId={id}
          servings={recipe.servings}
        />
      </ClientOnly>

      <div className="prose prose-sm flex min-h-0 max-w-none flex-1 flex-col text-foreground">
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 md:hidden">
          <Tabs className="flex min-h-0 flex-1 flex-col" onValueChange={(value) => goTo(value as 'ingredients' | 'preparation')} value={activeTab}>
            <TabsList className="w-full">
              <TabsTab value="ingredients">Ingrédients</TabsTab>
              <TabsTab value="preparation">Préparation</TabsTab>
            </TabsList>
            <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden">
              <motion.div className="flex h-full" onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} style={{ x: swipeX }}>
                <div className="min-w-full overflow-y-auto px-2">
                  <ClientOnly>
                    <RecipeIngredientGroups recipeId={recipe.id} baseServings={recipe.servings} ingredientGroups={ingredientGroups} />
                  </ClientOnly>
                </div>
                <div className="min-w-full overflow-y-auto p-2">
                  <ClientOnly>
                    <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
                      <EditorContent />
                    </Editor>
                  </ClientOnly>
                </div>
              </motion.div>
            </div>
          </Tabs>
        </div>

        <div className="hidden flex-1 grid-cols-5 gap-8 p-4 md:grid">
          <div className="col-span-2 rounded-xl border px-8 pb-8">
            <h2>Ingrédients</h2>
            <ClientOnly>
              <RecipeIngredientGroups recipeId={id} baseServings={recipe.servings} ingredientGroups={ingredientGroups} />
            </ClientOnly>
          </div>

          <div className="col-span-3 rounded-xl border px-8 pb-8">
            <h2>Préparation</h2>
            <ClientOnly>
              <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
                <EditorContent className="pb-4" />
              </Editor>
            </ClientOnly>
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
  headers: () => ({
    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
  }),
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
