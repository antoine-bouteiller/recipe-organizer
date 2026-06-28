import { MagnifyingGlassIcon } from '@phosphor-icons/react'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

interface InputProps {
  autoFocus?: boolean
  search: string
  setSearch: (value: string) => void
}

export const SearchInput = ({ autoFocus, search, setSearch }: InputProps) => (
  <InputGroup>
    <InputGroupInput
      autoFocus={autoFocus}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Rechercher une recette, un ingrédient…"
      size="lg"
      value={search}
    />
    <InputGroupAddon>
      <MagnifyingGlassIcon />
    </InputGroupAddon>
  </InputGroup>
)
