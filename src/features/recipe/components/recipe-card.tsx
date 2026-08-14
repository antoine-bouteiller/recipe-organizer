import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

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
  // oxlint-disable-next-line react/hook-use-state -- captured once at mount, never updated
  const [animate] = useState(() => !entrancePlayed)

  useEffect(() => {
    entrancePlayed = true
  }, [])

  return animate
}

export default function RecipeCard({ recipe, index = 0 }: Readonly<RecipeCardProps>) {
  const animate = useEntranceAnimation()

  return (
    <div
      style={animate ? ({ '--stagger': Math.min(index, 6) } as React.CSSProperties) : undefined}
      className={cn(
        'rounded-[30px] bg-white/5 p-[3px] shadow-lg ring-1 shadow-primary/10 ring-black/5 transition-transform duration-200 ease-out-snappy has-[a:hover]:-translate-y-0.5 has-[a:active]:scale-[0.99] dark:ring-white/10',
        animate &&
          'animate-in animation-duration-300 fill-mode-backwards [--tw-animation-delay:calc(var(--stagger)*35ms)] fade-in slide-in-from-bottom-2'
      )}
    >
      <Card className="h-60 overflow-hidden rounded-[27px] border-0 bg-[#1b2426] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]" key={recipe.id}>
        <img src={recipe.image} alt={recipe.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(8,14,14,0.93)_0%,rgba(8,14,14,0.34)_54%,rgba(8,14,14,0)_78%)]" />
        <div className="absolute inset-0 flex flex-col">
          <Link
            params={{ id: recipe.id.toString() }}
            to="/recipe/$id"
            viewTransition
            className="flex min-h-0 flex-1 flex-col justify-end gap-2 p-4.5 pb-0"
          >
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
          </Link>
          <div className="flex flex-col px-4.5 pt-2 pb-4.5">
            <QuantityControls recipeId={recipe.id} servings={recipe.servings} variant="card" />
          </div>
        </div>
      </Card>
    </div>
  )
}
