import { Button } from '@/components/ui/button'
import { CardContent, CardHeader } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getRecipeQueryOptions } from '@/features/recipe/api/get-one'
import DeleteRecipe from '@/features/recipe/delete-recipe'
import { RecipeSections } from '@/features/recipe/recipe-section'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { EllipsisVerticalIcon, Loader2, PencilIcon } from 'lucide-react'
import { z } from 'zod'

const RecipePage = () => {
  const { id } = Route.useParams()
  const { data: recipe, isLoading } = useQuery(getRecipeQueryOptions(id))
  const { authUser } = Route.useRouteContext()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    )
  }

  if (!recipe) {
    return notFound()
  }

  return (
    <>
      {authUser && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="absolute top-4 right-4 rounded-full">
              <EllipsisVerticalIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto flex flex-col gap-2 p-2">
            <Button variant="ghost" asChild>
              <Link to="/recipe/edit/$id" params={{ id: recipe.id.toString() }}>
                <PencilIcon className="w-4 h-4" />
                Modifier
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <DeleteRecipe recipeId={recipe.id} />
            </Button>
          </PopoverContent>
        </Popover>
      )}
      <CardHeader className="p-0">
        <div className="mb-6 w-full overflow-hidden md:rounded-t-lg flex items-center justify-center aspect-16/6">
          <img src={recipe.image} alt={recipe.name} className="object-cover w-full" />
        </div>
        <div className="px-6">
          <h1 className="text-3xl font-bold md:text-4xl">{recipe.name}</h1>
        </div>
      </CardHeader>

      <div className="h-full prose prose-sm max-w-none text-foreground">
        <CardContent className="px-8 md:hidden">
          <Tabs defaultValue="ingredients" className="gap-0">
            <TabsList className="w-full">
              <TabsTrigger value="ingredients">Ingrédients</TabsTrigger>
              <TabsTrigger value="preparation">Préparation</TabsTrigger>
            </TabsList>
            <TabsContent value="ingredients" className=" px-2">
              <RecipeSections sections={recipe.sections} />
            </TabsContent>

            <TabsContent value="preparation" className="px-2">
              <div dangerouslySetInnerHTML={{ __html: recipe.steps }} />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardContent className="grid-cols-5 gap-8 hidden md:grid h-full">
          <div className="col-span-2 border rounded-xl p-8">
            <div className="text-xl font-semibold">Ingrédients</div>
            <div className="space-y-3">
              <RecipeSections sections={recipe.sections} />
            </div>
          </div>

          <div className="col-span-3 border rounded-xl p-8">
            <div className="text-xl font-semibold">Préparation</div>
            <div dangerouslySetInnerHTML={{ __html: recipe.steps }} />
          </div>
        </CardContent>
      </div>
    </>
  )
}

export const Route = createFileRoute('/recipe/$id')({
  component: RecipePage,
  loader: async ({ params, context }) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(params)

    await context.queryClient.prefetchQuery(getRecipeQueryOptions(id))

    return context.authUser
  },
})
