import { ingredientCategoryIcons, ingredientCategoryLabels } from '@client/components/ingredient-category'
import { ScreenLayout } from '@client/components/layout/screen-layout'
import { getIngredientListOptions } from '@client/features/ingredients/api/get-all'
import { AddIngredient } from '@client/features/ingredients/components/add-ingredient'
import { DeleteIngredient } from '@client/features/ingredients/components/delete-ingredient'
import { EditIngredient } from '@client/features/ingredients/components/edit-ingredient'
import { IngredientBadge } from '@client/features/ingredients/components/ingredient-badge'
import { Button } from '@recipe-organizer/design-system/button'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { Item, ItemGroup, ItemSeparator } from '@recipe-organizer/design-system/item'
import { SearchInput } from '@recipe-organizer/design-system/search-input'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'

import { container, text, text2, text3, text4 } from './-ingredients.css'

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
      <div className={container}>
        <SearchInput placeholder="Rechercher une recette, un ingrédient…" search={search} setSearch={setSearch} />
        <AddIngredient>
          <Button aria-label="Ajouter un ingrédient" size="icon-lg" variant="outline">
            <PlusIcon />
          </Button>
        </AddIngredient>
      </div>

      {filteredIngredients.length === 0 ? (
        <p className={text}>{search ? 'Aucun ingrédient trouvé pour cette recherche.' : 'Aucun ingrédient trouvé. Ajoutez-en un pour commencer.'}</p>
      ) : (
        <ItemGroup>
          {filteredIngredients.map((ingredient, index) => (
            <React.Fragment key={ingredient.id}>
              <Item
                layout="row"
                actions={
                  isAdmin ? (
                    <>
                      <EditIngredient ingredient={ingredient} />
                      <DeleteIngredient ingredientId={ingredient.id} ingredientName={ingredient.name} />
                    </>
                  ) : undefined
                }
                title={
                  <>
                    <span className={text2}>{ingredient.name}</span>
                    <span className={text3}>
                      <IngredientBadge category={ingredient.category}>
                        {ingredientCategoryIcons[ingredient.category]}
                        <span className={text4}>{ingredientCategoryLabels[ingredient.category]}</span>
                      </IngredientBadge>
                    </span>
                  </>
                }
              />
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
  loader: ({ context }) => context.queryClient.query({ ...getIngredientListOptions(), staleTime: 'static' }),
})
