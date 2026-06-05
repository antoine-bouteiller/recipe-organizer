import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { ResponsivePopover, ResponsivePopoverContent, ResponsivePopoverTrigger } from '@/components/ui/responsive-popover'
import { AUTO_TAGS, RECIPE_TAGS, RECIPE_TAG_LABELS, type RecipeTag } from '@/features/recipe/utils/constants'
import { cn } from '@/utils/cn'

const categoryItems = [...RECIPE_TAGS, ...AUTO_TAGS].map((tag) => ({
  label: RECIPE_TAG_LABELS[tag],
  value: tag,
}))

interface CategorySelectProps {
  tags: RecipeTag[]
  onTagsChange: (tags: RecipeTag[]) => void
}

export const CategorySelect = ({ tags, onTagsChange }: CategorySelectProps) => {
  const [open, setOpen] = useState(false)

  const toggleTag = (tag: RecipeTag) => {
    onTagsChange(tags.includes(tag) ? tags.filter((value) => value !== tag) : [...tags, tag])
  }

  const label = tags.length > 0 ? `Catégories (${tags.length})` : 'Catégories'

  return (
    <ResponsivePopover onOpenChange={setOpen} open={open}>
      <ResponsivePopoverTrigger render={<Badge render={<button type="button" />} size="lg" variant={tags.length > 0 ? 'default' : 'outline'} />}>
        {label}
        <CaretDownIcon />
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent className="min-w-48">
        <div className="flex flex-col gap-0.5 p-2 sm:p-0">
          {categoryItems.map(({ label: itemLabel, value }) => {
            const selected = tags.includes(value)
            return (
              <button
                className={cn(
                  'flex min-h-10 w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-base outline-none hover:bg-accent hover:text-accent-foreground sm:min-h-8 sm:text-sm',
                  selected && 'bg-accent/50'
                )}
                key={value}
                onClick={() => toggleTag(value)}
                type="button"
              >
                <span className="truncate">{itemLabel}</span>
                {selected && <CheckIcon className="size-4 shrink-0" />}
              </button>
            )
          })}
        </div>
      </ResponsivePopoverContent>
    </ResponsivePopover>
  )
}
