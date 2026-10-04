import type { Option } from '@/components/ui/forms/combobox-field/options'

export type { Option } from '@/components/ui/forms/combobox-field/options'

interface OptionList<TValue = number | undefined> {
  readonly current: Option<TValue>[]
}

interface OptionsProps<TItem> {
  allowEmpty?: boolean
  filter?: (item: TItem) => boolean
}

/** Builds an options hook over a catalogue that a page provides through context. */
export const createOptionsHook = <TItem>(useItems: () => { readonly current: readonly TItem[] }, mapFn: (item: TItem) => Option) => {
  function useOptions(props?: () => OptionsProps<TItem> & { allowEmpty?: false }): OptionList<number>

  function useOptions(props: () => OptionsProps<TItem> & { allowEmpty: true }): OptionList

  /** Call during component setup; `props` is a getter so filters follow prop changes. */
  function useOptions(props: () => OptionsProps<TItem> = () => ({})): OptionList {
    const items = useItems()
    const options = $derived.by(() => {
      const { allowEmpty, filter = () => true } = props()
      const mapped: Option[] = items.current.filter(filter).map(mapFn)
      return allowEmpty ? [{ label: 'Aucune', value: undefined }, ...mapped] : mapped
    })
    return {
      get current() {
        return options
      },
    }
  }

  return useOptions
}
