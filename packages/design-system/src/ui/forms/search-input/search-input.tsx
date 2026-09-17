import { MagnifyingGlassIcon } from '../../data-display/icons/magnifying-glass'

import * as styles from './search-input.css'

export interface SearchInputProps {
  autoFocus?: boolean
  placeholder?: string
  search: string
  setSearch: (value: string) => void
}

export const SearchInput = ({ autoFocus, placeholder = 'Rechercher…', search, setSearch }: SearchInputProps) => (
  <div className={styles.root} data-slot="input-group" role="group">
    <input
      aria-label={placeholder}
      autoFocus={autoFocus}
      className={styles.input}
      data-slot="input"
      onChange={(event) => setSearch(event.target.value)}
      placeholder={placeholder}
      value={search}
    />
    <div
      className={styles.addon}
      data-slot="input-group-addon"
      onMouseDown={(event) => {
        event.preventDefault()
        event.currentTarget.parentElement?.querySelector<HTMLInputElement>('input')?.focus()
      }}
    >
      <span className={styles.text}>
        <MagnifyingGlassIcon />
      </span>
    </div>
  </div>
)
