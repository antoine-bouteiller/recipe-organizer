import { AddIngredient } from '@/features/ingredients/add-ingredient'
import { DeleteIngredient } from '@/features/ingredients/delete-ingredient'
import { EditIngredient } from '@/features/ingredients/edit-ingredient'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const IngredientsManagement = () => {
  const { data: ingredients } = useSuspenseQuery(getIngredientListOptions())

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gestion des ingrédients</h2>
        <AddIngredient />
      </div>

      <div className="space-y-2">
        {ingredients.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun ingrédient trouvé. Ajoutez-en un pour commencer.
          </p>
        ) : (
          ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{ingredient.name}</p>
                <p className="text-sm text-muted-foreground">Catégorie: {ingredient.category}</p>
                {ingredient.allowedUnits && ingredient.allowedUnits.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Unités: {ingredient.allowedUnits.join(', ')}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <EditIngredient ingredient={ingredient} />
                <DeleteIngredient ingredientId={ingredient.id} ingredientName={ingredient.name} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const RouteComponent = () => <IngredientsManagement />

export const Route = createFileRoute('/settings/ingredients')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(getIngredientListOptions()),
})
