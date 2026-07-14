import { type QueryKey, useQuery } from '@tanstack/solid-query'

export interface Option<TValue = number | undefined> {
  label: string
  value: TValue
}

export const createOptionsHook = <TItem>(getQueryOptions: () => { queryFn?: unknown; queryKey: QueryKey }, mapFn: (item: TItem) => Option) => {
  function useOptions(props?: { allowEmpty?: false; filter?: (item: TItem) => boolean }): Option<number>[]

  function useOptions(props: { allowEmpty: true; filter?: (item: TItem) => boolean }): Option[]

  function useOptions({
    allowEmpty,
    filter = () => true,
  }: {
    allowEmpty?: boolean
    filter?: (item: TItem) => boolean
  } = {}): Option[] {
    const query = useQuery(getQueryOptions as never)

    const items = (query.data ?? []) as TItem[]
    const options: Option[] = items.filter(filter).map(mapFn)

    if (allowEmpty) {
      options.unshift({ label: 'Aucune', value: undefined })
    }

    return options
  }

  return useOptions
}
