import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { type RecipeVariants } from '@vanilla-extract/recipes'
import type React from 'react'

import { buttonRecipe } from './button.css'

export type ButtonProps = Pick<
  useRender.ComponentProps<'button'>,
  'aria-label' | 'aria-pressed' | 'children' | 'disabled' | 'onClick' | 'render' | 'type'
> &
  RecipeVariants<typeof buttonRecipe>

export const Button = ({ align, render, size, type, variant, width, ...props }: ButtonProps): React.ReactElement => {
  const mergedProps = mergeProps<'button'>(
    { className: buttonRecipe({ align, size, variant, width }), type: type ?? (render ? undefined : 'button') },
    props
  )

  return useRender({ defaultTagName: 'button', props: { ...mergedProps, 'data-slot': 'button' }, render })
}
