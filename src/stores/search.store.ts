import { useDebounce } from '@/hooks/use-debounce'
import { createStore, useStore } from 'zustand'

interface SearchStore {
  search: string
}

interface SearchStoreActions {
  setSearch: (search: string) => void
}

const searchStore = createStore<SearchStore & SearchStoreActions>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
}))

export const useSearchStore = () => {
  const { search, setSearch } = useStore(searchStore)

  const debouncedSearch = useDebounce(search, 300)

  return {
    search,
    debouncedSearch,
    setSearch,
  }
}
