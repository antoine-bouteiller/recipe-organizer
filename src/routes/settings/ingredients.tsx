import { PlusIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { useState } from 'react'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemGroup, ItemSeparator, ItemTitle } from '@/components/ui/item'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { AddIngredient } from '@/features/ingredients/components/add-ingredient'
import { DeleteIngredient } from '@/features/ingredients/components/delete-ingredient'
import { EditIngredient } from '@/features/ingredients/components/edit-ingredient'
import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/features/ingredients/utils/ingredient-category'

const IngredientsManagement = () => {
  const { data: ingredients } = useSuspenseQuery(getIngredientListOptions())
  const [search, setSearch] = useState('')

  const { isAdmin } = Route.useRouteContext()

  const query = search.trim().toLowerCase()
  const filteredIngredients = ingredients.filter(
    (ingredient) => ingredient.name.toLowerCase().includes(query) || ingredient.category.toLowerCase().includes(query)
  )

  return (
    <ScreenLayout title="Ingrédients" withGoBack>
      <div className="sticky top-0 z-10 flex items-center gap-4 bg-background px-4 pt-4 pb-2">
        <SearchInput search={search} setSearch={setSearch} />
        <AddIngredient>
          <Button size="icon-lg" variant="outline">
            <PlusIcon />
          </Button>
        </AddIngredient>
      </div>

      <div className="px-4">
        {filteredIngredients.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            {search ? 'Aucun ingrédient trouvé pour cette recherche.' : 'Aucun ingrédient trouvé. Ajoutez-en un pour commencer.'}
          </p>
        ) : (
          <ItemGroup>
            {filteredIngredients.map((ingredient, index) => (
              <React.Fragment key={ingredient.id}>
                <Item className="flex-nowrap">
                  <ItemContent>
                    <ItemTitle>
                      <span className="text-nowrap text-ellipsis">{ingredient.name}</span>
                      <Badge className="aspect-square md:aspect-auto" variant={ingredient.category}>
                        {ingredientCategoryIcons[ingredient.category]}
                        <span className="hidden md:block">{ingredientCategoryLabels[ingredient.category]}</span>
                      </Badge>
                    </ItemTitle>
                  </ItemContent>
                  {isAdmin && (
                    <ItemActions>
                      <EditIngredient ingredient={ingredient} />
                      <DeleteIngredient ingredientId={ingredient.id} ingredientName={ingredient.name} />
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
