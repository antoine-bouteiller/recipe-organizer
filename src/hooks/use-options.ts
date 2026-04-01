import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'

import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { getUnitsListOptions } from '@/features/units/api/get-all'

export interface Option<TValue = number | undefined> {
  label: string
  value: TValue
}

const createOptionsHook = <TQueryOptionData, TError, TData extends object[], TQueryKey extends QueryKey>(
  getQueryOptions: () => UseQueryOptions<TQueryOptionData, TError, TData, TQueryKey>,
  mapFn: (item: TData[number]) => Option
) => {
  function useOptions(props?: { allowEmpty?: false; filter?: (item: TData[number]) => boolean }): Option<number>[]

  function useOptions(props: { allowEmpty: true; filter?: (item: TData[number]) => boolean }): Option[]

  function useOptions({
    allowEmpty,
    filter = () => true,
  }: {
    allowEmpty?: boolean
    filter?: (item: TData[number]) => boolean
  } = {}): Option[] {
    const { data } = useQuery(getQueryOptions())

    const items = data ?? []
    const options: Option[] = items.filter(filter).map(mapFn)

    if (allowEmpty) {
      options.unshift({ label: 'Aucune', value: undefined })
    }

    return options
  }

  return useOptions
}

export const useIngredientOptions = createOptionsHook(getIngredientListOptions, (item) => ({
  label: item.name,
  value: item.id,
}))

export const useUnitOptions = createOptionsHook(getUnitsListOptions, (item) => ({
  label: item.name,
  value: item.id,
}))

export const useRecipeOptions = createOptionsHook(getRecipeListOptions, (item) => ({
  label: item.name,
  value: item.id,
}))
