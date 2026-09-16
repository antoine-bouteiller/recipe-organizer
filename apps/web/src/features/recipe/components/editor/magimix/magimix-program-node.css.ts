import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const magimixItemWidth = style({
  width: '100%',
})

export const magimixImage = style({
  height: theme.spacing(10),
  width: theme.spacing(10),
})

export const magimixTrigger = style({
  textAlign: 'start',
  width: '100%',
})
