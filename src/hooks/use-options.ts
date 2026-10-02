import type { Option } from '@/design-system/ui/forms/combobox-field/options'

export type { Option } from '@/design-system/ui/forms/combobox-field/options'

/** Builds an options hook over a catalogue that a page provides through context. */
export const createOptionsHook = <TItem>(useItems: () => readonly TItem[], mapFn: (item: TItem) => Option) => {
  function useOptions(props?: { allowEmpty?: false; filter?: (item: TItem) => boolean }): Option<number>[]

  function useOptions(props: { allowEmpty: true; filter?: (item: TItem) => boolean }): Option[]

  function useOptions({
    allowEmpty,
    filter = () => true,
  }: {
    allowEmpty?: boolean
    filter?: (item: TItem) => boolean
  } = {}): Option[] {
    const options: Option[] = useItems().filter(filter).map(mapFn)

    if (allowEmpty) {
      options.unshift({ label: 'Aucune', value: undefined })
    }

    return options
  }

  return useOptions
}
