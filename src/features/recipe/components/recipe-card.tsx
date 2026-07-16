import { Link } from '@tanstack/solid-router'
import { For, type JSX, Show } from 'solid-js'

import { Card } from '@/components/ui/card'
import { type ReducedRecipe } from '@/types/recipe'

import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '../utils/constants'
import { QuantityControls } from './quantity-controls'

interface RecipeCardProps {
  readonly recipe: ReducedRecipe
}

const Tag = (props: { readonly children: JSX.Element }) => (
  <span class="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">{props.children}</span>
)

export default function RecipeCard(props: RecipeCardProps) {
  return (
    <Link params={{ id: props.recipe.id.toString() }} to="/recipe/$id" viewTransition>
      <Card class="h-60 cursor-pointer overflow-hidden rounded-[28px] border-0 bg-[#1b2426] shadow-lg">
        <img alt={props.recipe.name} class="absolute inset-0 h-full w-full object-cover" src={props.recipe.image} />
        <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(8,14,14,0.93)_0%,rgba(8,14,14,0.34)_54%,rgba(8,14,14,0)_78%)]" />
        <div class="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4.5">
          <div class="flex flex-wrap gap-2">
            <Show when={props.recipe.isVegetarian}>
              <Tag>{VEGETARIAN_LABEL}</Tag>
            </Show>
            <Show when={props.recipe.isMagimix}>
              <Tag>{MAGIMIX_LABEL}</Tag>
            </Show>
            <Show when={props.recipe.isSpice}>
              <Tag>{SPICE_LABEL}</Tag>
            </Show>
            <For each={props.recipe.meals}>{(meal) => <Tag>{MEAL_LABELS[meal]}</Tag>}</For>
            <For each={props.recipe.cuisineTypes}>{(cuisineType) => <Tag>{CUISINE_TYPE_LABELS[cuisineType]}</Tag>}</For>
          </div>
          <h2 class="overflow-hidden font-heading text-xl leading-tight font-normal text-nowrap text-ellipsis text-white">{props.recipe.name}</h2>
          <QuantityControls
            class="flex w-full items-center justify-center gap-2.5"
            recipeId={props.recipe.id}
            servings={props.recipe.servings}
            variant="card"
          />
        </div>
      </Card>
    </Link>
  )
}
