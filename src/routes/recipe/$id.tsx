import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getRecipeQueryOptions } from '@/features/recipe/api/get-one'
import DeleteRecipe from '@/features/recipe/delete-recipe'
import { RecipeSectionIngredients } from '@/features/recipe/recipe-section'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { EllipsisVerticalIcon, Loader2, PencilIcon } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
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

      <CardContent className="grid md:grid-cols-5 gap-4 md:gap-8">
        <Card className="shadow-none md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Ingrédients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recipe.sections.map((section) => (
                <Fragment key={section.id}>
                  {section.name && <h3 className="mb-1 text-md font-semibold">{section.name}</h3>}

                  <RecipeSectionIngredients sectionIngredients={section.sectionIngredients} />

                  {section.subRecipe && (
                    <RecipeSectionIngredients
                      sectionIngredients={section.subRecipe.sections[0].sectionIngredients}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-none">
          <CardHeader>
            <CardTitle className="text-xl">Préparation</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: recipe.steps }}
            />
          </CardContent>
        </Card>
      </CardContent>
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
