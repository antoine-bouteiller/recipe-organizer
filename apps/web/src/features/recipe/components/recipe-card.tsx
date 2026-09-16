import { type ReducedRecipe } from '@client/types/recipe'
import { staggerStyle } from '@client/utils/stagger'
import { Badge } from '@recipe-organizer/design-system/badge'
import { css, cx } from '@recipe-organizer/design-system/css'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@recipe-organizer/shared/recipe/constants'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { QuantityControls } from './quantity-controls'

export interface RecipeCardProps {
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
  const [isActive, setIsActive] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cx(
        css({
          _dark: { ringColor: 'white/10' },
          background: 'white/5',
          borderRadius: '30px',
          boxShadow: 'lg',
          padding: '3px',
          ring: '1',
          ringColor: 'black/5',
          shadowColor: 'primary/10',
          transitionDuration: '200ms',
          transitionProperty: 'transform',
          transitionTimingFunction: 'ease-out',
        }),
        isHovered && css({ transform: 'translateY(-0.125rem)' }),
        isActive && css({ transform: 'scale(0.99)' }),
        animate && 'stagger-in-35'
      )}
      onPointerDown={() => setIsActive(true)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsActive(false)
        setIsHovered(false)
      }}
      onPointerUp={() => setIsActive(false)}
      style={animate ? staggerStyle(index, 6) : undefined}
    >
      <article
        className={css({
          background: '#1b2426',
          borderRadius: '27px',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)',
          height: '60',
          overflow: 'hidden',
          position: 'relative',
        })}
        key={recipe.id}
      >
        <img
          src={recipe.image}
          alt={recipe.name}
          className={css({ height: 'full', inset: '0', objectFit: 'cover', position: 'absolute', width: 'full' })}
          decoding="async"
          loading={index < 6 ? 'eager' : 'lazy'}
        />
        <div
          className={css({
            background: 'linear-gradient(to top,rgba(8,14,14,0.93) 0%,rgba(8,14,14,0.34) 54%,rgba(8,14,14,0) 78%)',
            inset: '0',
            pointerEvents: 'none',
            position: 'absolute',
          })}
        />
        <div className={css({ display: 'flex', flexDirection: 'column', inset: '0', position: 'absolute' })}>
          <Link
            params={{ id: recipe.id.toString() }}
            to="/recipe/$id"
            viewTransition
            className={css({
              display: 'flex',
              flex: '1',
              flexDirection: 'column',
              gap: '2',
              justifyContent: 'flex-end',
              minHeight: '0',
              padding: '4.5',
              paddingBottom: '0',
            })}
          >
            <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
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
            <h2
              className={css({
                color: 'white',
                fontFamily: 'heading',
                fontSize: 'xl',
                fontWeight: 'normal',
                lineHeight: 'tight',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              })}
            >
              {recipe.name}
            </h2>
          </Link>
          <div className={css({ display: 'flex', flexDirection: 'column', paddingBottom: '4.5', paddingInline: '4.5', paddingTop: '2' })}>
            <QuantityControls recipeId={recipe.id} servings={recipe.servings} variant="card" />
          </div>
        </div>
      </article>
    </div>
  )
}
