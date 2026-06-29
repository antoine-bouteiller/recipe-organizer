import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { type ReducedRecipe } from '@/types/recipe'

import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '../utils/constants'
import { QuantityControls } from './quantity-controls'

interface RecipeCardProps {
  readonly recipe: ReducedRecipe
}

export default function RecipeCard({ recipe }: Readonly<RecipeCardProps>) {
  return (
    <Link params={{ id: recipe.id.toString() }} to="/recipe/$id" viewTransition>
      <Card className="relative min-h-60 cursor-pointer justify-end gap-2 overflow-hidden bg-center py-4" key={recipe.id}>
        <img src={recipe.image} alt={recipe.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4/5 rounded-b-2xl bg-white/30 mask-[linear-gradient(to_bottom,transparent,black_40%)] backdrop-blur-sm" />
        <CardHeader className="relative px-4 py-2">
          <CardTitle className="flex items-center gap-2 overflow-hidden font-heading">
            <h2 className="overflow-hidden text-2xl font-semibold text-nowrap text-ellipsis text-white">{recipe.name}</h2>
          </CardTitle>
          <CardDescription className="flex flex-wrap gap-2">
            {recipe.isVegetarian && (
              <Badge variant="outline" className="bg-emerald-100 text-emerald-600">
                {VEGETARIAN_LABEL}
              </Badge>
            )}
            {recipe.isMagimix && <Badge variant="outline">{MAGIMIX_LABEL}</Badge>}
            {recipe.isSpice && <Badge variant="outline">{SPICE_LABEL}</Badge>}
            {recipe.meals.map((meal) => (
              <Badge key={meal} variant="outline">
                {MEAL_LABELS[meal]}
              </Badge>
            ))}
            {recipe.cuisineTypes.map((cuisineType) => (
              <Badge key={cuisineType} variant="outline">
                {CUISINE_TYPE_LABELS[cuisineType]}
              </Badge>
            ))}
          </CardDescription>
        </CardHeader>
        <CardFooter className="relative flex-none px-4 py-0">
          <QuantityControls
            className="flex w-full items-center justify-between gap-2"
            recipeId={recipe.id}
            servings={recipe.servings}
            variant="card"
          />
        </CardFooter>
      </Card>
    </Link>
  )
}
