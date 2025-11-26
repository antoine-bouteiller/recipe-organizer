import { Button } from '@/components/ui/button'
import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTrigger,
} from '@/components/ui/responsive-popover'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import { getRecipeDetailsOptions } from '@/features/recipe/api/get-one'
import DeleteRecipe from '@/features/recipe/components/delete-recipe'
import { RecipeIngredientsSections } from '@/features/recipe/components/recipe-section'
import { useIsInShoppingList } from '@/features/recipe/hooks/use-is-in-shopping-list'
import { useRecipeQuantities } from '@/features/recipe/hooks/use-recipe-quantities'
import { addToShoppingList, removeFromShoppingList } from '@/stores/shopping-list.store'
import { getFileUrl } from '@/utils/get-file-url'
import {
  ArrowLeftIcon,
  DotsThreeVerticalIcon,
  MinusIcon,
  PencilSimpleIcon,
  PlusIcon,
} from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound, useRouter } from '@tanstack/react-router'
import { z } from 'zod'

const RecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe, isLoading } = useQuery(getRecipeDetailsOptions(id))
  const { authUser } = Route.useRouteContext()
  const isInShoppingList = useIsInShoppingList(id)

  const router = useRouter()

  const { quantity, decrementQuantity, incrementQuantity } = useRecipeQuantities(
    recipe?.id,
    recipe?.quantity
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (!recipe) {
    return notFound()
  }

  return (
    <div className="flex w-full justify-center overflow-auto md:pb-4">
      <div className="md:max-w-5xl w-full relative md:shadow-sm md:bg-card md:border md:rounded-2xl h-fit">
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 left-4 rounded-full"
          onClick={() => router.history.back()}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        {authUser && (
          <ResponsivePopover>
            <ResponsivePopoverTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full"
                />
              }
            >
              <DotsThreeVerticalIcon className="size-4" weight="bold" />
            </ResponsivePopoverTrigger>
            <ResponsivePopoverContent
              className="w-auto flex flex-col gap-2 px-4 pb-4 md:pt-4 md:px-2 items-start"
              align="end"
            >
              <Button
                variant="ghost"
                render={<Link to="/recipe/edit/$id" params={{ id: recipe.id.toString() }} />}
              >
                <PencilSimpleIcon className="size-4" />
                Modifier la recette
              </Button>
              <DeleteRecipe recipeId={recipe.id} recipeName={recipe.name} />
            </ResponsivePopoverContent>
          </ResponsivePopover>
        )}
        <div className="p-0">
          <div className="mb-6 w-full overflow-hidden md:rounded-t-md flex items-center justify-center aspect-16/6">
            <img src={getFileUrl(recipe.image)} alt={recipe.name} className="object-cover w-full" />
          </div>
          <h1 className="px-6 font-semibold text-xl md:text-2xl">{recipe.name}</h1>
          <div className="flex items-center gap-2 justify-center w-full py-2 md:justify-start px-8">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity === 1}
            >
              <MinusIcon />
            </Button>
            {quantity}
            <Button variant="outline" size="icon" onClick={incrementQuantity}>
              <PlusIcon />
            </Button>
            <Button
              onClick={() =>
                isInShoppingList ? removeFromShoppingList(id) : addToShoppingList(id)
              }
              variant="outline"
            >
              {isInShoppingList ? 'Supprimer de la liste' : 'Ajouter à la liste'}
            </Button>
          </div>
        </div>

        <div className="flex-1 prose prose-sm max-w-none text-foreground flex flex-col">
          <div className="px-8 md:hidden">
            <Tabs defaultValue="ingredients" className="gap-0">
              <TabsList className="w-full">
                <TabsTab value="ingredients">Ingrédients</TabsTab>
                <TabsTab value="preparation">Préparation</TabsTab>
              </TabsList>
              <TabsPanel value="ingredients" className="px-2">
                <RecipeIngredientsSections
                  sections={recipe.sections}
                  quantity={quantity}
                  baseQuantity={recipe.quantity}
                />
              </TabsPanel>

              <TabsPanel value="preparation" className="px-2">
                <div dangerouslySetInnerHTML={{ __html: recipe.steps }} />
              </TabsPanel>
            </Tabs>
          </div>

          <div className="grid-cols-5 gap-8 hidden md:grid flex-1 p-4">
            <div className="col-span-2 border rounded-xl px-8">
              <h2>Ingrédients</h2>
              <RecipeIngredientsSections
                sections={recipe.sections}
                quantity={quantity}
                baseQuantity={recipe.quantity}
              />
            </div>

            <div className="col-span-3 border rounded-xl px-8">
              <h2>Préparation</h2>
              <div dangerouslySetInnerHTML={{ __html: recipe.steps }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/recipe/$id')({
  component: RecipePage,
  loader: async ({ params, context }) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(params)

    await context.queryClient.prefetchQuery(getRecipeDetailsOptions(id))

    return { id }
  },
})
