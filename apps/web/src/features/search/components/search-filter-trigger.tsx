import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'
import { FunnelSimpleIcon } from '@recipe-organizer/design-system/icons/funnel-simple'

import { element } from './search-filter-trigger.css'

/** Private Collapsible trigger: Base UI owns its state, handlers, and ref composition. */
export const SearchFilterTrigger = () => (
  <CollapsiblePrimitive.Trigger aria-label="Filtrer par catégorie" render={<button className={element} type="button" />}>
    <FunnelSimpleIcon />
  </CollapsiblePrimitive.Trigger>
)
