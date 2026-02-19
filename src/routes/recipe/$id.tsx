import { ArrowLeftIcon, DotsThreeVerticalIcon, MinusIcon, PencilSimpleIcon, PlusIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import * as v from 'valibot'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { ResponsivePopover, ResponsivePopoverContent, ResponsivePopoverTrigger } from '@/components/ui/responsive-popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import { Tiptap, TiptapContent } from '@/components/ui/tiptap'
import { getRecipeDetailsOptions } from '@/features/recipe/api/get-one'
import DeleteRecipe from '@/features/recipe/components/delete-recipe'
import { RecipeIngredientGroups } from '@/features/recipe/components/recipe-section'
import { useIsInShoppingList } from '@/features/recipe/hooks/use-is-in-shopping-list'
import { useRecipeQuantities } from '@/features/recipe/hooks/use-recipe-quantities'
import { useShoppingListStore } from '@/stores/shopping-list.store'

const RecipeDetailPending = () => {
  const router = useRouter()

  return (
    <div className="flex w-full justify-center overflow-auto md:pb-4">
      <div className="relative h-fit w-full md:max-w-5xl md:rounded-2xl md:border md:bg-card md:shadow-sm">
        <Button className="absolute top-4 left-4 rounded-full" onClick={() => router.history.back()} size="icon" variant="outline">
          <ArrowLeftIcon className="size-4" />
        </Button>

        <div className="p-0">
          <div className="mb-6 flex aspect-16/6 w-full items-center justify-center overflow-hidden md:rounded-t-md">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="px-6">
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="flex w-full items-center justify-center gap-2 px-8 py-2 md:justify-start">
            <Skeleton className="size-10" />
            <Skeleton className="h-6 w-8" />
            <Skeleton className="size-10" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>

        <div className="prose prose-sm flex max-w-none flex-1 flex-col text-foreground">
          <div className="px-4 pb-4 md:hidden">
            <Skeleton className="mb-4 h-10 w-full" />
            <div className="flex flex-col gap-3 px-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
            </div>
          </div>

          <div className="hidden flex-1 grid-cols-5 gap-8 p-4 md:grid">
            <div className="col-span-2 flex flex-col gap-4 rounded-xl border px-8 py-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
            </div>

            <div className="col-span-3 flex flex-col gap-4 rounded-xl border px-8 py-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-11/12" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-10/12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const RecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe } = useSuspenseQuery(getRecipeDetailsOptions(id))
  const { authUser } = Route.useRouteContext()
  const isInShoppingList = useIsInShoppingList(id)

  const { decrementQuantity, incrementQuantity, quantity } = useRecipeQuantities(recipe?.id, recipe?.servings)
  const addToShoppingList = useShoppingListStore((state) => state.addToShoppingList)
  const removeFromShoppingList = useShoppingListStore((state) => state.removeFromShoppingList)

  const ingredientGroups = recipe
    ? [
        ...recipe.ingredientGroups,
        ...(recipe.linkedRecipes ?? []).map(({ linkedRecipe }) => ({
          ...linkedRecipe.ingredientGroups[0],
          groupName: linkedRecipe.name,
          isDefault: false,
        })),
      ]
    : []

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
            <ResponsivePopoverContent align="end">
              <div className="flex flex-col items-start gap-2 p-4 md:p-0">
                <Button
                  className="w-full justify-start"
                  render={<Link params={{ id: recipe.id.toString() }} to="/recipe/edit/$id" />}
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
      <div className="flex w-full items-center justify-center gap-2 px-8 py-2 md:justify-start">
        <Button disabled={quantity === 1} onClick={decrementQuantity} size="icon" variant="outline">
          <MinusIcon />
        </Button>
        {quantity}
        <Button onClick={incrementQuantity} size="icon" variant="outline">
          <PlusIcon />
        </Button>
        <Button onClick={() => (isInShoppingList ? removeFromShoppingList(id) : addToShoppingList(id))} variant="outline">
          {isInShoppingList ? 'Supprimer de la liste' : 'Ajouter à la liste'}
        </Button>
      </div>

      <div className="prose prose-sm flex max-w-none flex-1 flex-col text-foreground">
        <div className="px-4 pb-4 md:hidden">
          <Tabs defaultValue="ingredients">
            <TabsList className="w-full">
              <TabsTab value="ingredients">Ingrédients</TabsTab>
              <TabsTab value="preparation">Préparation</TabsTab>
            </TabsList>
            <TabsPanel className="px-2" value="ingredients">
              <RecipeIngredientGroups baseServings={recipe.servings} ingredientGroups={ingredientGroups} servings={quantity} />
            </TabsPanel>

            <TabsPanel className="p-2" value="preparation">
              <Tiptap content={recipe.instructions} readOnly>
                <TiptapContent />
              </Tiptap>
            </TabsPanel>
          </Tabs>
        </div>

        <div className="hidden flex-1 grid-cols-5 gap-8 p-4 md:grid">
          <div className="col-span-2 rounded-xl border px-8">
            <h2>Ingrédients</h2>
            <RecipeIngredientGroups baseServings={recipe.servings} ingredientGroups={ingredientGroups} servings={quantity} />
          </div>

          <div className="col-span-3 rounded-xl border px-8">
            <h2>Préparation</h2>
            <Tiptap content={recipe.instructions} readOnly>
              <TiptapContent className="pb-4" />
            </Tiptap>
          </div>
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
  pendingComponent: RecipeDetailPending,
  loader: async ({ context, params }) => {
    const result = v.safeParse(paramsSchema, params)
    if (!result.success) {
      throw new Error(result.issues[0]?.message ?? 'Invalid id')
    }
    const { id } = result.output

    await context.queryClient.ensureQueryData(getRecipeDetailsOptions(id))

    return { id }
  },
})
