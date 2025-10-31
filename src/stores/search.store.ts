import { useDebounce } from '@/hooks/use-debounce'
import { Store, useStore } from '@tanstack/react-store'

const searchStore = new Store({
  search: '',
})

export const useSearchStore = () => {
  const { search } = useStore(searchStore)

  const setSearch = (newSearch: string) => {
    searchStore.setState({ search: newSearch })
  }

  const debouncedSearch = useDebounce(search, 300)

  return {
    search,
    debouncedSearch,
    setSearch,
  }
}
