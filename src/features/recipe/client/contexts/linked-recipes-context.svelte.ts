import { getContext, setContext } from 'svelte'

const key = Symbol('linked-recipes')

export const provideLinkedRecipes = (ids: () => readonly number[]) =>
  setContext(key, {
    get current() {
      return ids()
    },
  })
export const useLinkedRecipes = () => getContext<{ readonly current: readonly number[] } | undefined>(key) ?? { current: [] }
