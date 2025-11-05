import { Button } from '@/components/ui/button'
import { AddIngredient } from '@/features/ingredients/add-ingredient'
import { DeleteIngredient } from '@/features/ingredients/delete-ingredient'
import { EditIngredient } from '@/features/ingredients/edit-ingredient'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

const IngredientsManagement = () => {
  const { data: ingredients } = useSuspenseQuery(getIngredientListOptions())

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Ingrédients</h1>
          <p className="text-muted-foreground text-sm">
            Gérez la liste des ingrédients disponibles
          </p>
        </div>
        <AddIngredient />
      </div>

      {ingredients.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          Aucun ingrédient trouvé. Ajoutez-en un pour commencer.
        </p>
      ) : (
        <ItemGroup>
          {ingredients.map((ingredient, index) => (
            <Fragment key={ingredient.id}>
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>{ingredient.name}</ItemTitle>
                  <ItemDescription>
                    Catégorie: {ingredient.category}
                    {ingredient.allowedUnits && ingredient.allowedUnits.length > 0 && (
                      <> • Unités: {ingredient.allowedUnits.join(', ')}</>
                    )}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <EditIngredient ingredient={ingredient} />
                  <DeleteIngredient ingredientId={ingredient.id} ingredientName={ingredient.name} />
                </ItemActions>
              </Item>
              {index !== ingredients.length - 1 && <ItemSeparator />}
            </Fragment>
          ))}
        </ItemGroup>
      )}
    </div>
  )
}

const RouteComponent = () => <IngredientsManagement />

export const Route = createFileRoute('/settings/ingredients')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(getIngredientListOptions()),
})
