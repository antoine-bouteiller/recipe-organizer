import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { AddIngredient } from '@/features/ingredients/components/add-ingredient'
import { DeleteIngredient } from '@/features/ingredients/components/delete-ingredient'
import { EditIngredient } from '@/features/ingredients/components/edit-ingredient'
import {
  ingredientCategoryIcons,
  ingredientCategoryLabels,
} from '@/features/ingredients/utils/ingredient-category'
import { PlusIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { useMemo, useState } from 'react'

const IngredientsManagement = () => {
  const { data: ingredients } = useSuspenseQuery(getIngredientListOptions())
  const [search, setSearch] = useState('')

  const { isAdmin } = Route.useRouteContext()

  const filteredIngredients = useMemo(() => {
    if (!search.trim()) {
      return ingredients
    }

    const query = search.toLowerCase()
    return ingredients.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(query) ||
        ingredient.category.toLowerCase().includes(query)
    )
  }, [ingredients, search])

  return (
    <ScreenLayout title="Ingrédients" withGoBack>
      <div className="sticky top-0 bg-background px-4 pt-4 z-10 flex items-center gap-4">
        <SearchInput search={search} setSearch={setSearch} />
        <AddIngredient>
          <Button size="icon-lg" variant="outline">
            <PlusIcon />
          </Button>
        </AddIngredient>
      </div>

      <div className="p-4">
        {filteredIngredients.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {search
              ? 'Aucun ingrédient trouvé pour cette recherche.'
              : 'Aucun ingrédient trouvé. Ajoutez-en un pour commencer.'}
          </p>
        ) : (
          <ItemGroup>
            {filteredIngredients.map((ingredient, index) => (
              <React.Fragment key={ingredient.id}>
                <Item>
                  <ItemContent>
                    <ItemTitle>
                      {ingredient.name}
                      <Badge variant={ingredient.category}>
                        {ingredientCategoryIcons[ingredient.category]}
                        {ingredientCategoryLabels[ingredient.category]}
                      </Badge>
                    </ItemTitle>
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
      </div>
    </ScreenLayout>
  )
}

const RouteComponent = () => <IngredientsManagement />

export const Route = createFileRoute('/settings/ingredients')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(getIngredientListOptions()),
})
