import { CardLayout } from '@/components/card-layout'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader } from '@/components/ui/card'
import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTrigger,
} from '@/components/ui/responsive-popover'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getRecipeDetailsOptions } from '@/features/recipe/api/get-one'
import DeleteRecipe from '@/features/recipe/delete-recipe'
import { RecipeIngredientsSections } from '@/features/recipe/recipe-section'
import { getFileUrl } from '@/lib/utils'
import {
  ArrowLeftIcon,
  DotsThreeVerticalIcon,
  MinusIcon,
  PencilSimpleIcon,
  PlusIcon,
} from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

const RecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe, isLoading } = useQuery(getRecipeDetailsOptions(id))
  const { authUser } = Route.useRouteContext()

  const router = useRouter()

  const [quantity, setQuantity] = useState(recipe?.quantity ?? 0)

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
    <CardLayout>
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
            className="w-auto flex flex-col gap-2 p-2 items-start"
            align="end"
          >
            <Button
              variant="ghost"
              render={<Link to="/recipe/edit/$id" params={{ id: recipe.id.toString() }} />}
            >
              <PencilSimpleIcon className="size-4" />
              Modifier
            </Button>
            <DeleteRecipe recipeId={recipe.id} />
          </ResponsivePopoverContent>
        </ResponsivePopover>
      )}
      <CardHeader className="p-0">
        <div className="mb-6 w-full overflow-hidden md:rounded-t-lg flex items-center justify-center aspect-16/6">
          <img src={getFileUrl(recipe.image)} alt={recipe.name} className="object-cover w-full" />
        </div>
        <div className="px-6">
          <h1 className="text-3xl font-bold md:text-4xl">{recipe.name}</h1>
        </div>
      </CardHeader>

      <div className="flex items-center gap-2 justify-center w-full py-2 md:justify-start px-8">
        <Button variant="outline" size="icon" onClick={() => setQuantity(quantity - 1)}>
          <MinusIcon />
        </Button>
        {quantity}
        <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
          <PlusIcon />
        </Button>
      </div>
      <div className="flex-1 prose prose-sm max-w-none text-foreground flex flex-col">
        <CardContent className="px-8 md:hidden">
          <Tabs defaultValue="ingredients" className="gap-0">
            <TabsList className="w-full">
              <TabsTrigger value="ingredients">Ingrédients</TabsTrigger>
              <TabsTrigger value="preparation">Préparation</TabsTrigger>
            </TabsList>
            <TabsContent value="ingredients" className="px-2">
              <RecipeIngredientsSections
                sections={recipe.sections}
                quantity={quantity}
                baseQuantity={recipe.quantity}
              />
            </TabsContent>

            <TabsContent value="preparation" className="px-2">
              <div dangerouslySetInnerHTML={{ __html: recipe.steps }} />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardContent className="grid-cols-5 gap-8 hidden md:grid flex-1">
          <div className="col-span-2 border rounded-xl p-8">
            <div className="text-xl font-semibold">Ingrédients</div>
            <div className="space-y-3">
              <RecipeIngredientsSections
                sections={recipe.sections}
                quantity={quantity}
                baseQuantity={recipe.quantity}
              />
            </div>
          </div>

          <div className="col-span-3 border rounded-xl p-8">
            <div className="text-xl font-semibold">Préparation</div>
            <div dangerouslySetInnerHTML={{ __html: recipe.steps }} />
          </div>
        </CardContent>
      </div>
    </CardLayout>
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
