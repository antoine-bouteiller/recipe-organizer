import { Select } from '@/components/common/select'
import { AUTO_TAGS, RECIPE_TAGS, RECIPE_TAG_LABELS, type RecipeTag } from '@/features/recipe/utils/constants'

const categoryItems = [...RECIPE_TAGS, ...AUTO_TAGS].map((tag) => ({
  label: RECIPE_TAG_LABELS[tag],
  value: tag,
}))

interface CategorySelectProps {
  tags: RecipeTag[]
  onTagsChange: (tags: RecipeTag[]) => void
}

export const CategorySelect = ({ tags, onTagsChange }: CategorySelectProps) => (
  <Select items={categoryItems} multiple onValueChange={(value) => onTagsChange(value)} placeholder="Catégories" title="Catégories" value={tags} />
)
