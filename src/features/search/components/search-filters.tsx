import { FunnelSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'

import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { type RecipeTag } from '@/features/recipe/utils/constants'

import { CategorySelect } from './category-select'

interface SearchFiltersProps {
  query: string
  setQuery: (value: string) => void
  tags: RecipeTag[]
  onTagsChange: (tags: RecipeTag[]) => void
}

export const SearchFilters = ({ query, setQuery, tags, onTagsChange }: SearchFiltersProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible onOpenChange={setOpen} open={open}>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchInput autoFocus search={query} setSearch={setQuery} />
        </div>
        <CollapsibleTrigger render={<Button aria-label="Filtrer par catégorie" size="icon-lg" variant={tags.length > 0 ? 'default' : 'outline'} />}>
          <FunnelSimpleIcon />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="pt-2">
        <CategorySelect onTagsChange={onTagsChange} tags={tags} />
      </CollapsibleContent>
    </Collapsible>
  )
}
