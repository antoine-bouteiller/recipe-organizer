import { ScreenLayout } from '@/components/screen-layout'
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { DeleteIngredient } from '@/features/ingredients/delete-ingredient'
import { EditIngredient } from '@/features/ingredients/edit-ingredient'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { useMemo, useState } from 'react'

const IngredientsManagement = () => {
  const { data: ingredients } = useSuspenseQuery(getIngredientListOptions())
  const [searchQuery, setSearchQuery] = useState('')

  const { isAdmin } = Route.useRouteContext()

  const filteredIngredients = useMemo(() => {
    if (!searchQuery.trim()) {
      return ingredients
    }

    const query = searchQuery.toLowerCase()
    return ingredients.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(query) ||
        ingredient.category.toLowerCase().includes(query)
    )
  }, [ingredients, searchQuery])

  return (
    <ScreenLayout title="Ingrédients" withGoBack>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher un ingrédient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredIngredients.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          {searchQuery
            ? 'Aucun ingrédient trouvé pour cette recherche.'
            : 'Aucun ingrédient trouvé. Ajoutez-en un pour commencer.'}
        </p>
      ) : (
        <ItemGroup>
          {filteredIngredients.map((ingredient, index) => (
            <React.Fragment key={ingredient.id}>
              <Item>
                <ItemContent>
                  <ItemTitle>{ingredient.name}</ItemTitle>
                  <ItemDescription>Catégorie: {ingredient.category}</ItemDescription>
                </ItemContent>
                {isAdmin && (
                  <ItemActions>
                    <EditIngredient ingredient={ingredient} />
                    <DeleteIngredient
                      ingredientId={ingredient.id}
                      ingredientName={ingredient.name}
                    />
                  </ItemActions>
                )}
              </Item>
              {index !== filteredIngredients.length - 1 && <ItemSeparator />}
            </React.Fragment>
          ))}
        </ItemGroup>
      )}
    </ScreenLayout>
  )
}

const RouteComponent = () => <IngredientsManagement />

export const Route = createFileRoute('/settings/ingredients')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(getIngredientListOptions()),
})
