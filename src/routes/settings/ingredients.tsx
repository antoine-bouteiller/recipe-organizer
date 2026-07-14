import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { createMemo, createSignal, For, Show } from 'solid-js'
import Plus from '~icons/ph/plus'

import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/components/ingredient-category'
import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { Item, ItemGroup, ItemSeparator } from '@/components/ui/item'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { AddIngredient } from '@/features/ingredients/components/add-ingredient'
import { DeleteIngredient } from '@/features/ingredients/components/delete-ingredient'
import { EditIngredient } from '@/features/ingredients/components/edit-ingredient'
import { IngredientBadge } from '@/features/ingredients/components/ingredient-badge'

const IngredientsManagement = () => {
  const ingredientsQuery = useQuery(() => getIngredientListOptions())
  const [search, setSearch] = createSignal('')

  const context = Route.useRouteContext()

  const filteredIngredients = createMemo(() => {
    const query = search().trim().toLowerCase()
    return (ingredientsQuery.data ?? []).filter(
      (ingredient) => ingredient.name.toLowerCase().includes(query) || ingredient.category.toLowerCase().includes(query)
    )
  })

  return (
    <ScreenLayout title="Ingrédients" withGoBack>
      <div class="sticky top-0 z-10 flex items-center gap-4 bg-muted pb-2">
        <SearchInput search={search()} setSearch={setSearch} />
        <AddIngredient trigger={{ as: Button, children: <Plus />, size: 'icon-lg', variant: 'outline' }} />
      </div>

      <Show
        when={filteredIngredients().length > 0}
        fallback={
          <p class="py-8 text-center text-muted-foreground">
            {search() ? 'Aucun ingrédient trouvé pour cette recherche.' : 'Aucun ingrédient trouvé. Ajoutez-en un pour commencer.'}
          </p>
        }
      >
        <ItemGroup>
          <For each={filteredIngredients()}>
            {(ingredient, index) => (
              <>
                <Item
                  actions={
                    context().isAdmin ? (
                      <>
                        <EditIngredient ingredient={ingredient} />
                        <DeleteIngredient ingredientId={ingredient.id} ingredientName={ingredient.name} />
                      </>
                    ) : undefined
                  }
                  class="flex-nowrap"
                  title={
                    <>
                      <span class="text-nowrap text-ellipsis">{ingredient.name}</span>
                      <IngredientBadge category={ingredient.category} class="aspect-square md:aspect-auto">
                        {ingredientCategoryIcons[ingredient.category]}
                        <span class="hidden md:block">{ingredientCategoryLabels[ingredient.category]}</span>
                      </IngredientBadge>
                    </>
                  }
                />
                <Show when={index() !== filteredIngredients().length - 1}>
                  <ItemSeparator />
                </Show>
              </>
            )}
          </For>
        </ItemGroup>
      </Show>
    </ScreenLayout>
  )
}

const RouteComponent = () => <IngredientsManagement />

export const Route = createFileRoute('/settings/ingredients')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(getIngredientListOptions()),
})
