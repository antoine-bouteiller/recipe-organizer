import { LeafIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addToShoppingList, removeFromShoppingList } from '@/stores/shopping-list.store'

import type { ReducedRecipe } from '../api/get-all'

import { useIsInShoppingList } from '../hooks/use-is-in-shopping-list'
import { useRecipeQuantities } from '../hooks/use-recipe-quantities'

interface RecipeCardProps {
  readonly recipe: ReducedRecipe
}

const handleClick = (callback: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault()
  event.stopPropagation()
  callback()
}

export default function RecipeCard({ recipe }: Readonly<RecipeCardProps>) {
  const isInShoppingList = useIsInShoppingList(recipe.id)

  const { decrementQuantity, incrementQuantity, quantity } = useRecipeQuantities(recipe.id, recipe.servings)

  return (
    <Link params={{ id: recipe.id.toString() }} to="/recipe/$id">
      <Card className="cursor-pointer gap-2 pt-0 pb-2" key={recipe.id}>
        <CardHeader className="relative p-0">
          <div className="relative h-36 w-full overflow-hidden rounded-t-2xl">
            <img alt={recipe.name} className="h-full w-full object-cover" src={recipe.image} />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-2">
          <CardTitle className="flex items-center gap-2 pb-1">
            <h2
              className={`
                overflow-hidden text-lg font-semibold text-nowrap text-ellipsis
              `}
            >
              {recipe.name}
            </h2>

            {recipe.isVegetarian && (
              <LeafIcon
                className={`
              size-5 text-emerald-700
            `}
              />
            )}
            {recipe.isMagimix && <Badge variant="outline">Magimix</Badge>}
          </CardTitle>
          {isInShoppingList ? (
            <div className="flex items-center gap-2">
              <Button disabled={quantity === 1} onClick={handleClick(decrementQuantity)} size="icon" variant="outline">
                <MinusIcon />
              </Button>
              <span>{quantity}</span>
              <Button onClick={handleClick(incrementQuantity)} size="icon" variant="outline">
                <PlusIcon />
              </Button>
              <Button onClick={handleClick(() => removeFromShoppingList(recipe.id))} variant="outline">
                Supprimer de la liste
              </Button>
            </div>
          ) : (
            <Button onClick={handleClick(() => addToShoppingList(recipe.id))} variant="outline">
              Ajouter à la liste de courses
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
