import { Link } from '@tanstack/react-router'

import { Card } from '@/components/ui/card'
import { type ReducedRecipe } from '@/types/recipe'

import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '../utils/constants'
import { QuantityControls } from './quantity-controls'

interface RecipeCardProps {
  readonly recipe: ReducedRecipe
}

const Tag = ({ children }: { readonly children: React.ReactNode }) => (
  <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">{children}</span>
)

export default function RecipeCard({ recipe }: Readonly<RecipeCardProps>) {
  return (
    <Link params={{ id: recipe.id.toString() }} to="/recipe/$id" viewTransition>
      <Card className="h-60 cursor-pointer overflow-hidden rounded-[28px] border-0 bg-[#1b2426] shadow-lg" key={recipe.id}>
        <img src={recipe.image} alt={recipe.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(8,14,14,0.93)_0%,rgba(8,14,14,0.34)_54%,rgba(8,14,14,0)_78%)]" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4.5">
          <div className="flex flex-wrap gap-2">
            {recipe.isVegetarian && <Tag>{VEGETARIAN_LABEL}</Tag>}
            {recipe.isMagimix && <Tag>{MAGIMIX_LABEL}</Tag>}
            {recipe.isSpice && <Tag>{SPICE_LABEL}</Tag>}
            {recipe.meals.map((meal) => (
              <Tag key={meal}>{MEAL_LABELS[meal]}</Tag>
            ))}
            {recipe.cuisineTypes.map((cuisineType) => (
              <Tag key={cuisineType}>{CUISINE_TYPE_LABELS[cuisineType]}</Tag>
            ))}
          </div>
          <h2 className="overflow-hidden font-heading text-xl leading-tight font-normal text-nowrap text-ellipsis text-white">{recipe.name}</h2>
          <QuantityControls
            className="flex w-full items-center justify-center gap-2.5"
            recipeId={recipe.id}
            servings={recipe.servings}
            variant="card"
          />
        </div>
      </Card>
    </Link>
  )
}
