import { ArrowLeftIcon, DotsThreeVerticalIcon, MinusIcon, PencilSimpleIcon, PlusIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound, useRouter } from '@tanstack/react-router'
import { type } from 'arktype'

import { Button } from '@/components/ui/button'
import { ResponsivePopover, ResponsivePopoverContent, ResponsivePopoverTrigger } from '@/components/ui/responsive-popover'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import { Tiptap, TiptapContent } from '@/components/ui/tiptap'
import { getRecipeDetailsOptions } from '@/features/recipe/api/get-one'
import DeleteRecipe from '@/features/recipe/components/delete-recipe'
import { RecipeIngredientGroups } from '@/features/recipe/components/recipe-section'
import { useIsInShoppingList } from '@/features/recipe/hooks/use-is-in-shopping-list'
import { useRecipeQuantities } from '@/features/recipe/hooks/use-recipe-quantities'
import { addToShoppingList, removeFromShoppingList } from '@/stores/shopping-list.store'
import { getFileUrl } from '@/utils/get-file-url'

const RecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe, isLoading } = useQuery(getRecipeDetailsOptions(id))
  const { authUser } = Route.useRouteContext()
  const isInShoppingList = useIsInShoppingList(id)

  const router = useRouter()

  const { decrementQuantity, incrementQuantity, quantity } = useRecipeQuantities(recipe?.id, recipe?.servings)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!recipe) {
    return notFound()
  }

  return (
    <div
      className={`
        flex w-full justify-center overflow-auto
        md:pb-4
      `}
    >
      <div
        className={`
          relative h-fit w-full
          md:max-w-5xl md:rounded-2xl md:border md:bg-card md:shadow-sm
        `}
      >
        <Button className="absolute top-4 left-4 rounded-full" onClick={() => router.history.back()} size="icon" variant="outline">
          <ArrowLeftIcon className="size-4" />
        </Button>
        {authUser && (
          <ResponsivePopover>
            <ResponsivePopoverTrigger render={<Button className="absolute top-4 right-4 rounded-full" size="icon" variant="outline" />}>
              <DotsThreeVerticalIcon className="size-4" weight="bold" />
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
        )}
        <div className="p-0">
          <div
            className={`
              mb-6 flex aspect-16/6 w-full items-center justify-center
              overflow-hidden
              md:rounded-t-md
            `}
          >
            <img alt={recipe.name} className="w-full object-cover" src={getFileUrl(recipe.image)} />
          </div>
          <h1
            className={`
              px-6 text-xl font-semibold
              md:text-2xl
            `}
          >
            {recipe.name}
          </h1>
          <div
            className={`
              flex w-full items-center justify-center gap-2 px-8 py-2
              md:justify-start
            `}
          >
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
        </div>

        <div
          className={`
            prose prose-sm flex max-w-none flex-1 flex-col text-foreground
          `}
        >
          <div
            className={`
              px-4 pb-4
              md:hidden
            `}
          >
            <Tabs defaultValue="ingredients">
              <TabsList className="w-full">
                <TabsTab value="ingredients">Ingrédients</TabsTab>
                <TabsTab value="preparation">Préparation</TabsTab>
              </TabsList>
              <TabsPanel className="px-2" value="ingredients">
                <RecipeIngredientGroups baseServings={recipe.servings} ingredientGroups={recipe.ingredientGroups} servings={quantity} />
              </TabsPanel>

              <TabsPanel className="p-2" value="preparation">
                <Tiptap content={recipe.instructions} readOnly>
                  <TiptapContent />
                </Tiptap>
              </TabsPanel>
            </Tabs>
          </div>

          <div
            className={`
              hidden flex-1 grid-cols-5 gap-8 p-4
              md:grid
            `}
          >
            <div className="col-span-2 rounded-xl border px-8">
              <h2>Ingrédients</h2>
              <RecipeIngredientGroups baseServings={recipe.servings} ingredientGroups={recipe.ingredientGroups} servings={quantity} />
            </div>

            <div className="col-span-3 rounded-xl border px-8">
              <h2>Préparation</h2>
              <Tiptap content={recipe.instructions} readOnly>
                <TiptapContent className="pb-4" />
              </Tiptap>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const paramsSchema = type({ id: 'string.integer.parse' })

export const Route = createFileRoute('/recipe/$id')({
  component: RecipePage,
  loader: async ({ context, params }) => {
    const validated = paramsSchema(params)
    if (validated instanceof type.errors) {
      throw new Error(validated.summary)
    }
    const { id } = validated

    await context.queryClient.prefetchQuery(getRecipeDetailsOptions(id))

    return { id }
  },
})
