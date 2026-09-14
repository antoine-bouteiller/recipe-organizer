import { QueryClient } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { getRecipeDetailsOptions } from './get-one'

const queryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })
const recipe = (instructions: string) => ({ instructions })

afterEach(() => vi.unstubAllGlobals())

describe('getRecipeDetailsOptions', () => {
  it('starts unique subrecipe instruction prefetches before mount without delaying the parent result', async () => {
    const fetch = vi.fn().mockImplementation((url: string) => {
      if (url === '/api/recipes/1') {
        return Promise.resolve(
          Response.json({
            ...recipe(
              JSON.stringify({
                root: {
                  children: [
                    { recipeId: 2, type: 'subrecipe' },
                    { children: [{ recipeId: 3, type: 'subrecipe' }], type: 'list' },
                    { recipeId: 2, type: 'subrecipe' },
                  ],
                },
              })
            ),
            linkedRecipes: [{ linkedRecipe: { id: 4 } }],
          })
        )
      }

      return new Promise<Response>(() => undefined)
    })
    vi.stubGlobal('fetch', fetch)

    await queryClient().query(getRecipeDetailsOptions(1))

    expect(fetch).toHaveBeenCalledTimes(3)
    expect(fetch).toHaveBeenCalledWith('/api/recipes/2/instructions', expect.any(Object))
    expect(fetch).toHaveBeenCalledWith('/api/recipes/3/instructions', expect.any(Object))
  })

  it.each(['{', JSON.stringify({ root: { children: [{ type: 'paragraph' }] } })])(
    'returns normally without prefetching malformed or unreferenced instructions',
    async (instructions) => {
      const fetch = vi.fn().mockResolvedValue(Response.json(recipe(instructions)))
      vi.stubGlobal('fetch', fetch)

      await expect(queryClient().query(getRecipeDetailsOptions(1))).resolves.toEqual(recipe(instructions))

      expect(fetch).toHaveBeenCalledOnce()
    }
  )
})
