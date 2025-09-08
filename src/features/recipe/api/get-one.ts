import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { desc, eq } from 'drizzle-orm'
import { recipe } from '@/lib/db/schema'
import { getFileUrl } from '@/lib/r2'
import { notFound } from '@tanstack/react-router'
import { queryOptions } from '@tanstack/react-query'

const getRecipe = createServerFn({
  method: 'GET',
  response: 'data',
})
  .validator(z.number())
  .handler(async ({ data }) => {
    const result = await getDb().query.recipe.findFirst({
      where: eq(recipe.id, data),
      with: {
        sections: {
          with: {
            sectionIngredients: {
              with: {
                ingredient: true,
              },
            },
            subRecipe: {
              with: {
                sections: {
                  with: {
                    sectionIngredients: {
                      with: {
                        ingredient: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: (table) => [desc(table.isDefault)],
        },
      },
    })

    if (!result) {
      throw notFound()
    }

    return {
      ...result,
      image: getFileUrl(result.image),
    }
  })

export type Recipe = Awaited<ReturnType<typeof getRecipe>>
export type RecipeSection = Recipe['sections'][number]

const getRecipeQueryOptions = (id: string | number) =>
  queryOptions({
    queryKey: ['recipes', id.toString()],
    queryFn: () => getRecipe({ data: typeof id === 'string' ? Number.parseInt(id) : id }),
  })

export { getRecipe, getRecipeQueryOptions }
