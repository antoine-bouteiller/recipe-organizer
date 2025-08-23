import { ImageField } from '@/components/forms/image-field'
import { TextField } from '@/components/forms/text-field'
import TiptapField from '@/components/forms/tiptap-field'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { FormLabel } from '@/components/ui/form'
import AddExistingRecipe from '@/features/recipe/add-existing-recipe'
import { recipeSchema, type RecipeFormValues, createRecipe } from '@/features/recipe/api/create'
import RecipeSection from '@/features/recipe/recipe-section'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { PlusIcon, Loader2 } from 'lucide-react'
import { useTransition, useCallback } from 'react'
import { useForm, useFieldArray, Form } from 'react-hook-form'
import { toast } from 'sonner'

const EditRecipePage = () => {
  const router = useRouter()
  const [isLoading, startTransition] = useTransition()

  const form = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      steps: '',
      sections: [
        {
          ingredients: [
            {
              id: undefined,
              quantity: 0,
              unit: undefined,
            },
          ],
        },
      ],
    },
  })

  const onSubmit = useCallback(
    (data: RecipeFormValues) => {
      startTransition(async () => {
        try {
          const formData = new FormData()
          formData.append('image', data.image)
          formData.append('name', data.name)
          formData.append('steps', data.steps)
          formData.append('sections', JSON.stringify(data.sections))
          await createRecipe({ data: formData })

          router.navigate({ to: '/' })
        } catch (error) {
          toast.error('Une erreur est survenue lors de la création de la recette', {
            description: error instanceof Error ? error.message : JSON.stringify(error),
          })
        }
      })
    },
    [router]
  )

  const {
    fields: sectionFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'sections',
  })

  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Nouvelle Recette</CardTitle>
        <CardDescription className="text-lg">
          Ajoutez votre délicieuse recette à la collection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TextField
              control={form.control}
              name="name"
              label="Nom de la recette"
              disabled={isLoading}
            />
            <ImageField
              control={form.control}
              name="image"
              label="Photo de la recette"
              disabled={isLoading}
            />

            <div className="flex flex-col gap-2 pt-2">
              <FormLabel className="text-base font-semibold">Ingrédients</FormLabel>
              {sectionFields.map((field, index) => (
                <RecipeSection
                  key={field.id}
                  form={form}
                  index={index}
                  canAddName={index !== 0}
                  onDelete={index === 0 ? undefined : () => remove(index)}
                />
              ))}
              <div className="flex w-full gap-2 md:flex-row flex-col">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    append({
                      recipeId: undefined,
                      name: undefined,
                      ratio: 1,
                    })
                  }}
                  size="sm"
                  className="md:flex-1"
                >
                  Ajouter une section <PlusIcon className="h-4 w-4" />
                </Button>
                <AddExistingRecipe
                  onSelect={(selectedRecipe) => {
                    append({
                      recipeId: selectedRecipe.recipeId,
                      name: selectedRecipe.name,
                      ratio: 1,
                    })
                  }}
                />
              </div>
            </div>

            <TiptapField control={form.control} name="steps" label="Étapes" disabled={isLoading} />

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.navigate({ to: '/' })}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  'Créer la recette'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export const Route = createFileRoute('/_authed/recipe/edit/$id')({
  component: EditRecipePage,
})
