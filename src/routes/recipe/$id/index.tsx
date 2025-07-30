import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getRecipe } from '@/features/recipe/api/get-one'
import { getFileUrl } from '@/lib/s3.client'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/recipe/$id/')({
  component: RecipePage,
  loader: async ({ params }) => {
    const { id } = z.object({ id: z.coerce.number() }).parse(params)

    const recipe = await getRecipe({ data: id })

    return { recipe }
  },
})

export default function RecipePage() {
  const { recipe } = Route.useLoaderData()

  if (!recipe) {
    return notFound()
  }

  return (
    <>
      <div className="mb-8 w-full">
        <div className="mb-6 h-64 w-full overflow-hidden rounded-lg md:h-80 flex items-center justify-center">
          <img src={getFileUrl(recipe.image)} alt={recipe.name} className="object-cover w-full " />
        </div>
        <h1 className="text-center text-3xl font-bold md:text-4xl">{recipe.name}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card>
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
                        <li key={sectionIngredient.id} className="flex items-center gap-2">
                          <span className="font-medium">
                            {sectionIngredient.quantity}
                            {sectionIngredient.unit && ` ${sectionIngredient.unit}`}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span>{sectionIngredient.ingredient.name}</span>
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

        <Card className="md:col-span-2">
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
      </div>
    </>
  )
}
