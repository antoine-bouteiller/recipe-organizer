import { Collapsible as CollapsibleRoot, CollapsibleContent, CollapsibleTrigger } from './primitive/collapsible'

const Collapsible = Object.assign(CollapsibleRoot, {
  Content: CollapsibleContent,
  Trigger: CollapsibleTrigger,
})

export { Collapsible }
