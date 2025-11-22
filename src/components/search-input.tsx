import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'

interface InputProps {
  search: string
  setSearch: (value: string) => void
}

export const SearchInput = ({ search, setSearch }: InputProps) => (
  <InputGroup>
    <InputGroupInput
      placeholder="Search recipes..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      size="lg"
      autoFocus
    />
    <InputGroupAddon>
      <MagnifyingGlassIcon />
    </InputGroupAddon>
  </InputGroup>
)
