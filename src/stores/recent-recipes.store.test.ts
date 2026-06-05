import { beforeEach, describe, expect, it } from 'vite-plus/test'

import { useRecentRecipesStore } from './recent-recipes.store'

const add = (id: number) => useRecentRecipesStore.getState().addRecentRecipe(id)
const ids = () => useRecentRecipesStore.getState().recentRecipeIds

describe('useRecentRecipesStore.addRecentRecipe', () => {
  beforeEach(() => {
    useRecentRecipesStore.setState({ recentRecipeIds: [] })
  })

  it('prepends recipes most-recent-first', () => {
    add(2)
    add(1)
    expect(ids()).toEqual([1, 2])
  })

  it('moves an existing id to the front without duplicating it', () => {
    add(2)
    add(1)
    add(2)
    expect(ids()).toEqual([2, 1])
  })

  it('caps the list at 10 entries, dropping the oldest', () => {
    for (let id = 1; id <= 11; id++) {
      add(id)
    }
    const result = ids()
    expect(result).toHaveLength(10)
    expect(result[0]).toBe(11)
    expect(result).not.toContain(1)
  })
})
