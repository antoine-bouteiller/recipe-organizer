import { theme } from '@recipe-organizer/design-system/theme'
import { style, styleVariants, globalStyle } from '@vanilla-extract/css'

export const editorUnderline = style({
  textDecoration: 'underline',
})

const editorContentBase = style({
  color: 'oklch(0.373 0.034 259.733)',
  fontFamily: theme.fonts.sans,
  fontSize: theme.fontSizes.sm,
  lineHeight: '24px',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  selectors: {
    '.dark &': {
      color: 'oklch(0.872 0.01 258.338)',
    },
  },
})

export const editorChecklist = style({
  listStyleType: 'none',
  paddingInlineStart: theme.spacing(0),
})

export const editorCheckedListItem = style({
  textDecoration: 'line-through',
})

export const editorContent = styleVariants({
  full: [editorContentBase, { width: '100%' }],
  reading: [editorContentBase, { maxWidth: '65ch', width: '100%' }],
})

const editable = style({
  selectors: {
    '&[aria-disabled=true]': {
      opacity: '64%',
    },
    '.dark &': {
      backgroundColor: `color-mix(in oklab, ${theme.colors.input} 32%, transparent)`,
    },
    '&[data-invalid], &[aria-invalid=true]': {
      borderColor: `color-mix(in oklab, ${theme.colors.destructive} 36%, transparent)`,
    },
    '&:is(:focus-visible, [data-focus-visible])': {
      borderColor: theme.colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklab, ${theme.colors.ring} 24%, transparent)`,
    },
  },
  backgroundClip: 'padding-box',
  WebkitBackgroundClip: 'padding-box',
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.input,
  borderRadius: theme.radii.lg,
  borderWidth: '1px',
  padding: theme.spacing(4),
  boxShadow: theme.shadows.xs,
  transition: 'box-shadow 150ms',
})

export const editorContentEditable = styleVariants({
  full: [editorContent.full, editable],
  reading: [editorContent.reading, editable],
})

globalStyle(`.${editorContentBase} > :not([data-editor-decorator]) :where(a)`, {
  color: 'oklch(0.446 0.043 257.281)',
  textDecoration: 'underline',
})

globalStyle(`.${editorContentBase} > :not([data-editor-decorator]) :where(b, strong)`, {
  fontWeight: 700,
})

globalStyle(`.${editorContentBase} > :not([data-editor-decorator]) :where(em, i)`, {
  fontStyle: 'italic',
})

globalStyle(`.${editorContentBase} > :not([data-editor-decorator]) :where(li)`, {
  marginBottom: '4px',
  marginTop: '4px',
  paddingInlineStart: '6px',
})

globalStyle(`.${editorContentBase} > :where(h1)`, {
  fontSize: '30px',
  lineHeight: '36px',
  marginBottom: '24px',
  marginTop: '0px',
})

globalStyle(`.${editorContentBase} > :where(h1, h2, h3, h4)`, {
  color: 'oklch(0.21 0.034 264.665)',
  fontWeight: 700,
})

globalStyle(`.${editorContentBase} > :where(h2)`, {
  fontSize: '20px',
  lineHeight: '28px',
  marginBottom: '16px',
  marginTop: '32px',
})

globalStyle(`.${editorContentBase} > :where(h3)`, {
  fontSize: '18px',
  lineHeight: '28px',
  marginBottom: '8px',
  marginTop: '24px',
})

globalStyle(`.${editorContentBase} > :where(h4)`, {
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '8px',
  marginTop: '20px',
})

globalStyle(`.${editorContentBase} > :where(ol, ul)`, {
  marginBottom: '12px',
  marginTop: '12px',
  paddingInlineStart: '22px',
})

globalStyle(`.${editorContentBase} > :where(p)`, {
  marginBottom: '0px',
  marginTop: '0px',
})

globalStyle(`.dark .${editorContentBase} > :not([data-editor-decorator]) :where(a)`, {
  color: 'oklch(0.707 0.022 261.325)',
})

globalStyle(`.dark .${editorContentBase} > :where(h1, h2, h3, h4)`, {
  color: theme.colors['inverse-foreground'],
})
