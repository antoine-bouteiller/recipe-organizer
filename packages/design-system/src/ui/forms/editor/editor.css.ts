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
      boxShadow: theme.shadows.focus,
    },
  },
  backgroundClip: 'padding-box',
  WebkitBackgroundClip: 'padding-box',
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.input,
  borderRadius: theme.radius.lg,
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
  fontWeight: theme.fontWeights.bold,
})

globalStyle(`.${editorContentBase} > :not([data-editor-decorator]) :where(em, i)`, {
  fontStyle: 'italic',
})

globalStyle(`.${editorContentBase} > :not([data-editor-decorator]) :where(li)`, {
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  paddingInlineStart: theme.spacing(1.5),
})

globalStyle(`.${editorContentBase} > :where(h1)`, {
  fontSize: theme.fontSizes['3xl'],
  lineHeight: '36px',
  marginBottom: theme.spacing(6),
  marginTop: theme.spacing(0),
})

globalStyle(`.${editorContentBase} > :where(h1, h2, h3, h4)`, {
  color: 'oklch(0.21 0.034 264.665)',
  fontWeight: theme.fontWeights.bold,
})

globalStyle(`.${editorContentBase} > :where(h2)`, {
  fontSize: theme.fontSizes.xl,
  lineHeight: '28px',
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(8),
})

globalStyle(`.${editorContentBase} > :where(h3)`, {
  fontSize: theme.fontSizes.lg,
  lineHeight: '28px',
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(6),
})

globalStyle(`.${editorContentBase} > :where(h4)`, {
  fontSize: theme.fontSizes.base,
  lineHeight: '24px',
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(5),
})

globalStyle(`.${editorContentBase} > :where(ol, ul)`, {
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(3),
  paddingInlineStart: theme.spacing(5.5),
})

globalStyle(`.${editorContentBase} > :where(p)`, {
  marginBottom: theme.spacing(0),
  marginTop: theme.spacing(0),
})

globalStyle(`.dark .${editorContentBase} > :not([data-editor-decorator]) :where(a)`, {
  color: 'oklch(0.707 0.022 261.325)',
})

globalStyle(`.dark .${editorContentBase} > :where(h1, h2, h3, h4)`, {
  color: theme.colors['inverse-foreground'],
})
