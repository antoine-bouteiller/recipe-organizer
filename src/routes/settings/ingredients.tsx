import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { AddIngredient } from '@/features/ingredients/add-ingredient'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { DeleteIngredient } from '@/features/ingredients/delete-ingredient'
import { EditIngredient } from '@/features/ingredients/edit-ingredient'
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

const IngredientsManagement = () => {
  const { data: ingredients } = useSuspenseQuery(getIngredientListOptions())
  const [searchQuery, setSearchQuery] = useState('')

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
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Ingrédients</h1>
        </div>
        <AddIngredient />
      </div>

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
        <ItemGroup className="gap-4">
          {filteredIngredients.map((ingredient) => (
            <Item key={ingredient.id} variant="outline">
              <ItemContent>
                <ItemTitle>{ingredient.name}</ItemTitle>
                <ItemDescription>Catégorie: {ingredient.category}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <EditIngredient ingredient={ingredient} />
                <DeleteIngredient ingredientId={ingredient.id} ingredientName={ingredient.name} />
              </ItemActions>
            </Item>
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
