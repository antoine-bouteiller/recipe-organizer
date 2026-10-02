import React, { useState } from 'react'

import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/components/ingredient-category'
import { Button } from '@/components/ui/actions/button/button'
import { Badge } from '@/components/ui/data-display/badge/badge'
import type { BadgeProps } from '@/components/ui/data-display/badge/badge'
import { PlusIcon } from '@/components/ui/data-display/icons'
import { Item, ItemGroup, ItemSeparator } from '@/components/ui/data-display/item/item'
import { SearchInput } from '@/components/ui/forms/search-input/search-input'
import type { IngredientCategory } from '@/features/ingredients/categories'
import { AddIngredient } from '@/features/ingredients/client/components/add-ingredient'
import { DeleteIngredient } from '@/features/ingredients/client/components/delete-ingredient'
import { EditIngredient } from '@/features/ingredients/client/components/edit-ingredient'
import { useIngredientCatalog } from '@/features/ingredients/client/contexts/ingredient-catalog-context'

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
  const ingredients = useIngredientCatalog()
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  const filteredIngredients = ingredients.filter(
    (ingredient) => ingredient.name.toLowerCase().includes(query) || ingredient.category.toLowerCase().includes(query)
  )

  return (
    <>
      <div className={styles.searchBar}>
        <SearchInput placeholder="Rechercher une recette, un ingrédient…" search={search} setSearch={setSearch} />
        <AddIngredient
          renderTrigger={(props) => (
            <Button {...props} aria-label="Ajouter un ingrédient" size="icon-lg" variant="outline">
              <PlusIcon />
            </Button>
          )}
        />
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
