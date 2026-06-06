import { Collapsible as CollapsibleRoot, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const Collapsible = Object.assign(CollapsibleRoot, {
  Content: CollapsibleContent,
  Trigger: CollapsibleTrigger,
})

export { Collapsible }
