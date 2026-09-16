import { MagnifyingGlassIcon } from '../../data-display/icons/magnifying-glass'

import { inputSurface } from '../input/input-surface.css'
import { inputClassName, addonClassName, text } from './search-input.css'

export interface SearchInputProps {
  autoFocus?: boolean
  placeholder?: string
  search: string
  setSearch: (value: string) => void
}

export const SearchInput = ({ autoFocus, placeholder = 'Rechercher…', search, setSearch }: SearchInputProps) => (
  <div className={inputSurface({ surface: 'glass' })} data-slot="input-group" role="group">
    <input
      aria-label={placeholder}
      autoFocus={autoFocus}
      className={inputClassName}
      data-slot="input"
      onChange={(event) => setSearch(event.target.value)}
      placeholder={placeholder}
      value={search}
    />
    <div
      className={addonClassName}
      data-slot="input-group-addon"
      onMouseDown={(event) => {
        event.preventDefault()
        event.currentTarget.parentElement?.querySelector<HTMLInputElement>('input')?.focus()
      }}
    >
      <span className={text}>
        <MagnifyingGlassIcon />
      </span>
    </div>
  </div>
)
