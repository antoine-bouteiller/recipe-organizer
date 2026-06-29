import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'

export interface Option<TValue = number | undefined> {
  label: string
  value: TValue
}

export const createOptionsHook = <TQueryOptionData, TError, TData extends object[], TQueryKey extends QueryKey>(
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
