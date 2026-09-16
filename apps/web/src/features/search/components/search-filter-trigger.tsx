import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'
import { css } from '@recipe-organizer/design-system/css'
import { FunnelSimpleIcon } from '@recipe-organizer/design-system/icons/funnel-simple'

/** Private Collapsible trigger: Base UI owns its state, handlers, and ref composition. */
export const SearchFilterTrigger = () => (
  <CollapsiblePrimitive.Trigger
    aria-label="Filtrer par catégorie"
    render={
      <button
        className={css({
          _dark: { background: 'input/48' },
          _focusVisible: { outlineColor: 'ring', outlineOffset: '1px', outlineWidth: '2px' },
          _hover: { background: 'accent/50' },
          alignItems: 'center',
          backdropFilter: 'blur(24px)',
          background: 'background/72',
          borderColor: 'input',
          borderRadius: 'lg',
          borderWidth: '1px',
          boxShadow: 'xs',
          color: 'foreground',
          display: 'inline-flex',
          height: '10',
          justifyContent: 'center',
          transitionProperty: 'colors',
          width: '10',
        })}
        type="button"
      />
    }
  >
    <FunnelSimpleIcon />
  </CollapsiblePrimitive.Trigger>
)
