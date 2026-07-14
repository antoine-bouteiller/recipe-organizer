import { type PolymorphicProps } from '@kobalte/core/polymorphic'
import { Separator as SeparatorPrimitive, type SeparatorRootProps } from '@kobalte/core/separator'
import { splitProps, type ValidComponent } from 'solid-js'

import { cn } from '@/utils/cn'

export const Separator = <T extends ValidComponent = 'hr'>(props: PolymorphicProps<T, SeparatorRootProps<T>>) => {
  const [local, rest] = splitProps(props as PolymorphicProps<'hr', SeparatorRootProps>, ['class', 'orientation'])
  return (
    <SeparatorPrimitive
      class={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch",
        local.class
      )}
      data-slot="separator"
      orientation={local.orientation ?? 'horizontal'}
      {...rest}
    />
  )
}
