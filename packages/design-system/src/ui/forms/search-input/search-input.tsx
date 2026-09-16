import { css } from '@recipe-organizer/design-system/css'

import { MagnifyingGlassIcon } from '../../data-display/icons/magnifying-glass'
import { inputSurface } from '../input/input-surface'

const inputClassName = css({
  _placeholder: { color: 'muted-foreground/72' },
  backgroundColor: 'transparent',
  borderRadius: 'inherit',
  height: { base: '9.5', sm: '8.5' },
  lineHeight: { base: '2.375rem', sm: '2.125rem' },
  minWidth: '0',
  outline: 'none',
  paddingLeft: '2',
  paddingRight: 'calc(token(spacing.3) - 1px)',
  transition: 'background-color 5000000s ease-in-out 0s',
  width: 'full',
})
const addonClassName = css({
  '--owner-icon-size': { base: '1.125rem', sm: '1rem' },
  alignItems: 'center',
  cursor: 'text',
  display: 'flex',
  gap: '2',
  justifyContent: 'center',
  order: -1,
  paddingLeft: 'calc(token(spacing.3) - 1px)',
  userSelect: 'none',
})

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
      <span className={css({ display: 'flex', marginInline: '-0.5', opacity: 0.8 })}>
        <MagnifyingGlassIcon />
      </span>
    </div>
  </div>
)
