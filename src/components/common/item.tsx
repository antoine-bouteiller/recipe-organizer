import { type ComponentProps, type ReactElement, type ReactNode } from 'react'

import { Item as ItemRoot, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'

type ItemRootProps = ComponentProps<typeof ItemRoot>

interface ItemProps {
  media?: ReactNode
  title?: ReactNode
  description?: ReactNode
  content?: ReactNode
  actions?: ReactNode
  variant?: ItemRootProps['variant']
  size?: ItemRootProps['size']
  className?: string
  render?: ItemRootProps['render']
  onClick?: ItemRootProps['onClick']
}

export const Item = ({ media, title, description, content, actions, variant, size, className, render, onClick }: ItemProps): ReactElement => {
  const hasContent = title !== undefined || description !== undefined || content !== undefined

  return (
    <ItemRoot className={className} onClick={onClick} render={render} size={size} variant={variant}>
      {media !== undefined && <ItemMedia>{media}</ItemMedia>}
      {hasContent && (
        <ItemContent>
          {title !== undefined && <ItemTitle>{title}</ItemTitle>}
          {description !== undefined && <ItemDescription>{description}</ItemDescription>}
          {content}
        </ItemContent>
      )}
      {actions !== undefined && <ItemActions>{actions}</ItemActions>}
    </ItemRoot>
  )
}
