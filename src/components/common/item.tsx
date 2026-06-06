import { Item as ItemRoot, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from '@/components/ui/item'

const Item = Object.assign(ItemRoot, {
  Actions: ItemActions,
  Content: ItemContent,
  Description: ItemDescription,
  Group: ItemGroup,
  Media: ItemMedia,
  Separator: ItemSeparator,
  Title: ItemTitle,
})

export { Item }
