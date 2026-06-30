import { type Icon, type IconProps } from '@phosphor-icons/react'
import { type ComponentProps, type ReactElement, type ReactNode } from 'react'

import { TabsList, TabsPanel, Tabs as TabsRoot, TabsTab } from '@/components/ui/tabs'

type TabsListVariant = ComponentProps<typeof TabsList>['variant']
type TabsTabProps = ComponentProps<typeof TabsTab>

interface TabItem {
  value: TabsTabProps['value']
  label?: ReactNode
  icon?: Icon
  iconProps?: IconProps
  content?: ReactNode
  className?: string
  render?: TabsTabProps['render']
  nativeButton?: TabsTabProps['nativeButton']
}

interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant?: TabsListVariant
  className?: string
  listClassName?: string
  indicatorLayoutId?: string
}

export const Tabs = ({
  items,
  value,
  defaultValue,
  onValueChange,
  variant,
  className,
  listClassName,
  indicatorLayoutId,
}: TabsProps): ReactElement => (
  <TabsRoot
    className={className}
    defaultValue={defaultValue}
    onValueChange={onValueChange ? (next) => onValueChange(next as string) : undefined}
    value={value}
  >
    <TabsList className={listClassName} indicatorLayoutId={indicatorLayoutId} variant={variant}>
      {items.map((item) => (
        <TabsTab className={item.className} key={item.value} nativeButton={item.nativeButton} render={item.render} value={item.value}>
          {item.icon && <item.icon className="size-6" {...(item.iconProps ?? {})} />}
          {item.label}
        </TabsTab>
      ))}
    </TabsList>
    {items
      .filter((item) => item.content !== undefined)
      .map((item) => (
        <TabsPanel key={item.value} value={item.value}>
          {item.content}
        </TabsPanel>
      ))}
  </TabsRoot>
)
