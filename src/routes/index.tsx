import { useQuery } from '@tanstack/solid-query'
import { createFileRoute, Link } from '@tanstack/solid-router'
import { Book, Plus } from 'phosphor-solid'
import { For, Show } from 'solid-js'
import * as v from 'valibot'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import RecipeCard from '@/features/recipe/components/recipe-card'

const searchSchema = v.object({
  search: v.optional(v.boolean()),
})

const RecipeList = () => {
  const context = Route.useRouteContext()
  const recipesQuery = useQuery(() => getRecipeListOptions())

  return (
    <ScreenLayout pageKey="/" title="Recettes">
      <div class="flex flex-col gap-8 sm:grid-cols-2 md:grid lg:grid-cols-3">
        <For each={(recipesQuery.data ?? []).filter((recipe) => !recipe.isSpice)}>{(recipe) => <RecipeCard recipe={recipe} />}</For>
      </div>
      <Show when={context().authUser}>
        <Button as={Link} class="fixed right-2 bottom-16 md:hidden" size="icon-xl" to="/recipe/new" viewTransition>
          <Book class="size-5" />
          <div class="absolute right-1.75 bottom-1.75 rounded-full border border-primary-foreground bg-primary p-0.5">
            <Plus class="size-1.5" />
          </div>
        </Button>
      </Show>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/')({
  component: RecipeList,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRecipeListOptions())
  },
  ssr: 'data-only',
  validateSearch: (search) => {
    const result = v.safeParse(searchSchema, search)
    if (!result.success) {
      throw new Error(result.issues[0]?.message ?? 'Invalid search params')
    }
    return result.output
  },
})
