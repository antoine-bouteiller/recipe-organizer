import { MinusIcon, PlusIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { addToShoppingList, removeFromShoppingList } from '@/stores/shopping-list.store'

import type { ReducedRecipe } from '../api/get-all'

import { useIsInShoppingList } from '../hooks/use-is-in-shopping-list'
import { useRecipeQuantities } from '../hooks/use-recipe-quantities'
import { RECIPE_TAG_LABELS, type RecipeTag } from '../utils/constants'

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
      <Card className="relative min-h-60 cursor-pointer justify-end gap-2 overflow-hidden bg-center py-4" key={recipe.id}>
        <img src={recipe.image} alt={recipe.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4/5 rounded-b-2xl bg-white/30 mask-[linear-gradient(to_bottom,transparent,black_40%)] backdrop-blur-sm" />
        <CardHeader className="relative px-4">
          <CardTitle className="flex items-center gap-2 overflow-hidden font-heading">
            <h2 className="overflow-hidden text-2xl font-semibold text-nowrap text-ellipsis text-white">{recipe.name}</h2>
          </CardTitle>
          <CardDescription className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant={tag === 'vegetarian' ? 'success' : 'outline'}>
                {RECIPE_TAG_LABELS[tag as RecipeTag]}
              </Badge>
            ))}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative px-4">
          {isInShoppingList ? (
            <div className="flex w-full items-center justify-between gap-2">
              <Button disabled={quantity === 1} onClick={handleClick(decrementQuantity)} size="icon" variant="outline">
                <MinusIcon />
              </Button>
              <span className="text-white">{quantity}</span>
              <Button onClick={handleClick(incrementQuantity)} size="icon" variant="outline">
                <PlusIcon />
              </Button>
              <Button onClick={handleClick(() => removeFromShoppingList(recipe.id))} variant="outline">
                Supprimer de la liste
              </Button>
            </div>
          ) : (
            <Button onClick={handleClick(() => addToShoppingList(recipe.id))} variant="outline" className="w-full">
              Ajouter à la liste de courses
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
