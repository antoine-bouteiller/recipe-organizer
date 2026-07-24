import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { type ReducedRecipe } from '@/types/recipe'
import { cn } from '@/utils/cn'

import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '../utils/constants'
import { QuantityControls } from './quantity-controls'

interface RecipeCardProps {
  readonly recipe: ReducedRecipe
  readonly index?: number
}

const Tag = ({ children }: { readonly children: React.ReactNode }) => (
  <Badge size="sm" variant="overlay">
    {children}
  </Badge>
)

// Module flag — the staggered entrance plays once per app load, not on every navigation back to the list
let entrancePlayed = false

const useEntranceAnimation = () => {
  const animate = useRef(!entrancePlayed)

  useEffect(() => {
    entrancePlayed = true
  }, [])

  return animate.current
}

export default function RecipeCard({ recipe, index = 0 }: Readonly<RecipeCardProps>) {
  const animate = useEntranceAnimation()

  return (
    <Link
      params={{ id: recipe.id.toString() }}
      to="/recipe/$id"
      viewTransition
      style={animate ? ({ '--stagger': Math.min(index, 6) } as React.CSSProperties) : undefined}
      className={cn(
        'block rounded-[30px] bg-white/5 p-[3px] shadow-lg ring-1 shadow-primary/10 ring-black/5 transition-transform duration-200 ease-out-snappy hover:-translate-y-0.5 active:scale-[0.99] dark:ring-white/10',
        animate &&
          'animate-in animation-duration-300 fill-mode-backwards [--tw-animation-delay:calc(var(--stagger)*35ms)] fade-in slide-in-from-bottom-2'
      )}
    >
      <Card
        className="h-60 cursor-pointer overflow-hidden rounded-[27px] border-0 bg-[#1b2426] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]"
        key={recipe.id}
      >
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
