import { type ReducedRecipe } from '@client/types/recipe'
import { staggerStyle } from '@client/utils/stagger'
import { Badge } from '@recipe-organizer/design-system/badge'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@recipe-organizer/shared/recipe/constants'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { QuantityControls } from './quantity-controls'

import * as styles from './recipe-card.css'

export interface RecipeCardProps {
  readonly recipe: ReducedRecipe
  readonly index?: number
}

const Tag = ({ children }: { readonly children: React.ReactNode }) => (
  <Badge size="sm" variant="secondary">
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
    <article className={animate ? styles.animatedCard : styles.card} style={animate ? staggerStyle(index, 6) : undefined}>
      <img src={recipe.image} alt={recipe.name} className={styles.image} decoding="async" loading={index < 6 ? 'eager' : 'lazy'} />
      <Link params={{ id: recipe.id.toString() }} to="/recipe/$id" viewTransition className={styles.recipeLink}>
        <div className={styles.tags}>
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
        <h2 className={styles.heading}>{recipe.name}</h2>
      </Link>
      <QuantityControls recipeId={recipe.id} servings={recipe.servings} variant="card" />
    </article>
  )
}
