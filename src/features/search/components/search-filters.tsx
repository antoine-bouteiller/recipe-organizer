import { FunnelSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'

import { ToggleGroup } from '@/components/common/toggle-group'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { AUTO_TAGS, RECIPE_TAG_LABELS, type RecipeTag } from '@/features/recipe/utils/constants'

import { CategorySelect } from './category-select'

const autoTagItems = AUTO_TAGS.map((tag) => ({ label: RECIPE_TAG_LABELS[tag], value: tag }))

const isAutoTag = (tag: RecipeTag): tag is (typeof AUTO_TAGS)[number] => AUTO_TAGS.includes(tag as (typeof AUTO_TAGS)[number])

interface SearchFiltersProps {
  query: string
  setQuery: (value: string) => void
  tags: RecipeTag[]
  onTagsChange: (tags: RecipeTag[]) => void
}

export const SearchFilters = ({ query, setQuery, tags, onTagsChange }: SearchFiltersProps) => {
  const [open, setOpen] = useState(false)

  const categoryTags = tags.filter((tag) => !isAutoTag(tag))
  const autoTags = tags.filter(isAutoTag)

  const handleCategoryChange = (nextCategories: RecipeTag[]) => onTagsChange([...nextCategories, ...autoTags])
  const handleAutoTagsChange = (nextAutoTags: string[]) => onTagsChange([...categoryTags, ...(nextAutoTags as RecipeTag[])])

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
      <CollapsibleContent className="flex items-center gap-2 pt-2">
        <CategorySelect onTagsChange={handleCategoryChange} tags={categoryTags} />
        <ToggleGroup items={autoTagItems} onValueChange={handleAutoTagsChange} value={autoTags} />
      </CollapsibleContent>
    </Collapsible>
  )
}
