import { describe, expect, it } from 'vite-plus/test'

import { pushRecentRecipe } from './push-recent-recipe'

const pushAll = (...ids: number[]) => ids.reduce<number[]>(pushRecentRecipe, [])

describe('pushRecentRecipe', () => {
  it('prepends recipes most-recent-first', () => {
    expect(pushAll(2, 1)).toEqual([1, 2])
  })

  it('moves an existing id to the front without duplicating it', () => {
    expect(pushAll(2, 1, 2)).toEqual([2, 1])
  })

  it('caps the list at 10 entries, dropping the oldest', () => {
    const result = pushAll(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)
    expect(result).toHaveLength(10)
    expect(result[0]).toBe(11)
    expect(result).not.toContain(1)
  })
})
