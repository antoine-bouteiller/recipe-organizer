import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useShopingListStore } from '@/stores/shoping-cart.store'
import type { Recipe } from '@/types/recipe'
import { Link } from '@tanstack/react-router'
import { MinusIcon, PlusIcon } from 'lucide-react'

interface RecipeCardProps {
  recipe: Pick<Recipe, 'id' | 'name' | 'image' | 'quantity'>
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { setRecipesQuantities, recipesQuantities } = useShopingListStore()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setRecipesQuantities(recipe.id, recipe.quantity)
  }

  const handleIncrement = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setRecipesQuantities(recipe.id, recipesQuantities[recipe.id] + 1)
  }

  const handleDecrement = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setRecipesQuantities(recipe.id, recipesQuantities[recipe.id] - 1)
  }

  const isInShoppingCart = recipesQuantities[recipe.id]

  return (
    <Link to="/recipe/$id" params={{ id: recipe.id.toString() }}>
      <Card
        key={recipe.id}
        className="cursor-pointer gap-2 pt-0 pb-2 transition-all duration-300 hover:scale-105 hover:shadow-lg "
      >
        <CardHeader className="relative p-0">
          <div className="relative h-36 w-full overflow-hidden">
            <img src={recipe.image} alt={recipe.name} className="object-cover w-full h-full" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-2">
          <CardTitle className="mb-2 line-clamp-2 text-xl font-bold text-nowrap text-ellipsis">
            {recipe.name}
          </CardTitle>
          {isInShoppingCart ? (
            <div className="flex items-center gap-2">
              <Button onClick={handleDecrement} variant="outline" size="icon">
                <MinusIcon />
              </Button>
              <span>{recipesQuantities[recipe.id]}</span>
              <Button onClick={handleIncrement} variant="outline" size="icon">
                <PlusIcon />
              </Button>
            </div>
          ) : (
            <Button onClick={handleClick} variant="outline">
              Ajouter à la liste de courses
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
