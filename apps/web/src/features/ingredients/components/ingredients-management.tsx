import { ingredientCategoryIcons, ingredientCategoryLabels } from '@client/components/ingredient-category'
import { getIngredientListOptions } from '@client/features/ingredients/api/get-all'
import { AddIngredient } from '@client/features/ingredients/components/add-ingredient'
import { DeleteIngredient } from '@client/features/ingredients/components/delete-ingredient'
import { EditIngredient } from '@client/features/ingredients/components/edit-ingredient'
import { Badge } from '@recipe-organizer/design-system/badge'
import type { BadgeProps } from '@recipe-organizer/design-system/badge'
import { Button } from '@recipe-organizer/design-system/button'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { Item, ItemGroup, ItemSeparator } from '@recipe-organizer/design-system/item'
import { SearchInput } from '@recipe-organizer/design-system/search-input'
import type { IngredientCategory } from '@recipe-organizer/shared/ingredients/categories'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

import * as styles from './ingredients-management.css'

interface IngredientsManagementProps {
  readonly isAdmin: boolean
}

const categoryBadgeVariants = {
  fish: 'info-subtle',
  meat: 'destructive-subtle',
  other: 'neutral-subtle',
  spices: 'warning-subtle',
  vegetables: 'success-subtle',
} as const satisfies Record<IngredientCategory, NonNullable<BadgeProps['variant']>>

export const IngredientsManagement = ({ isAdmin }: IngredientsManagementProps) => {
  const { data: ingredients } = useSuspenseQuery(getIngredientListOptions())
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  const filteredIngredients = ingredients.filter(
    (ingredient) => ingredient.name.toLowerCase().includes(query) || ingredient.category.toLowerCase().includes(query)
  )

  return (
    <>
      <div className={styles.searchBar}>
        <SearchInput placeholder="Rechercher une recette, un ingrédient…" search={search} setSearch={setSearch} />
        <AddIngredient>
          <Button aria-label="Ajouter un ingrédient" size="icon-lg" variant="outline">
            <PlusIcon />
          </Button>
        </AddIngredient>
      </div>
      {filteredIngredients.length === 0 ? (
        <p className={styles.emptyState}>
          {search ? 'Aucun ingrédient trouvé pour cette recherche.' : 'Aucun ingrédient trouvé. Ajoutez-en un pour commencer.'}
        </p>
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
                    <span className={styles.ingredientName}>{ingredient.name}</span>
                    <span className={styles.categoryBadge}>
                      <Badge variant={categoryBadgeVariants[ingredient.category]}>
                        {ingredientCategoryIcons[ingredient.category]}
                        <span className={styles.categoryLabel}>{ingredientCategoryLabels[ingredient.category]}</span>
                      </Badge>
                    </span>
                  </>
                }
              />
              {index !== filteredIngredients.length - 1 && <ItemSeparator />}
            </React.Fragment>
          ))}
        </ItemGroup>
      )}
    </>
  )
}
