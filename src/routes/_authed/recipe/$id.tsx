import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getRecipeQueryOptions } from '@/features/recipe/api/get-one'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

export const Route = createFileRoute('/_authed/recipe/$id')({
  component: RecipePage,
  loader: async ({ params, context }) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(params)

    await context.queryClient.prefetchQuery(getRecipeQueryOptions(id))
  },
})

export default function RecipePage() {
  const { id } = Route.useParams()
  const { data: recipe, isLoading } = useQuery(getRecipeQueryOptions(id))

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
      <CardHeader className="p-0">
        <div className="mb-6 w-full overflow-hidden md:rounded-t-lg flex items-center justify-center aspect-16/6">
          <img src={recipe.image} alt={recipe.name} className="object-cover w-full" />
        </div>
        <div className="px-6">
          <h1 className="text-3xl font-bold md:text-4xl">{recipe.name}</h1>
        </div>
      </CardHeader>

      <CardContent className="grid md:grid-cols-3 gap-4 md:gap-8">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-xl">Ingrédients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recipe.sections.map((section) => (
                <div key={section.id}>
                  {section.name && <h3 className="mb-3 text-lg font-semibold">{section.name}</h3>}

                  {section.sectionIngredients.length > 0 && (
                    <ul className="space-y-2">
                      {section.sectionIngredients.map((sectionIngredient) => (
                        <li
                          key={sectionIngredient.id}
                          className="flex items-center gap-2 justify-between"
                        >
                          <div>{sectionIngredient.ingredient.name}</div>
                          <div className="font-medium">
                            {sectionIngredient.quantity}
                            {sectionIngredient.unit && ` ${sectionIngredient.unit}`}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.subRecipe && (
                    <div className="mt-3 rounded-md bg-muted p-3">
                      <span className="text-sm font-medium">Sous-recette :</span>
                      <div className="mt-1">
                        <span className="text-sm">{section.subRecipe.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-none">
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
