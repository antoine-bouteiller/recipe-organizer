import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addToShoppingList, removeFromShoppingList } from '@/stores/shopping-list.store'
import type { Recipe } from '@/types/recipe'
import { MinusIcon, PlusIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { useIsInShoppingList } from '../hooks/use-is-in-shopping-list'
import { useRecipeQuantities } from '../hooks/use-recipe-quantities'

interface RecipeCardProps {
  readonly recipe: Pick<Recipe, 'id' | 'name' | 'image' | 'quantity'>
}

const handleClick = (callback: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault()
  event.stopPropagation()
  callback()
}

export default function RecipeCard({ recipe }: Readonly<RecipeCardProps>) {
  const isInShoppingList = useIsInShoppingList(recipe.id)

  const { quantity, decrementQuantity, incrementQuantity } = useRecipeQuantities(
    recipe.id,
    recipe.quantity
  )

  return (
    <Link to="/recipe/$id" params={{ id: recipe.id.toString() }}>
      <Card key={recipe.id} className="cursor-pointer gap-2 pt-0 pb-2">
        <CardHeader className="relative p-0">
          <div className="relative h-36 w-full overflow-hidden rounded-t-2xl">
            <img src={recipe.image} alt={recipe.name} className="object-cover w-full h-full" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-2">
          <CardTitle className="mb-2 line-clamp-2 text-xl font-bold text-nowrap text-ellipsis">
            {recipe.name}
          </CardTitle>
          {isInShoppingList ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleClick(decrementQuantity)}
                disabled={quantity === 1}
                variant="outline"
                size="icon"
              >
                <MinusIcon />
              </Button>
              <span>{quantity}</span>
              <Button onClick={handleClick(incrementQuantity)} variant="outline" size="icon">
                <PlusIcon />
              </Button>
              <Button
                onClick={handleClick(() => removeFromShoppingList(recipe.id))}
                variant="outline"
              >
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
