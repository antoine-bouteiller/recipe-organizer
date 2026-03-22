import { ArrowUUpLeftIcon, ArrowUUpRightIcon, ListBulletsIcon, TextBolderIcon, TextItalicIcon, TextUnderlineIcon } from '@phosphor-icons/react'
import type { AnyExtension } from '@tiptap/react'
import type { ReactNode } from 'react'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Tiptap, TiptapButton, TiptapContent } from '@/components/ui/tiptap'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/ui/toolbar'
import { useFieldContext } from '@/hooks/use-form-context'

interface TiptapFieldProps {
  disabled?: boolean
  extensions?: AnyExtension[]
  extraToolbar?: ReactNode
  label?: string
}

const TiptapField = ({ disabled, extensions, extraToolbar, label }: TiptapFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      <FieldLabel>{label}</FieldLabel>
      <Tiptap content={field.state.value} extensions={extensions} onChange={field.handleChange}>
        <Toolbar>
          <ToolbarGroup>
            <TiptapButton command="undo">
              <ArrowUUpLeftIcon />
            </TiptapButton>
            <TiptapButton command="redo">
              <ArrowUUpRightIcon />
            </TiptapButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <TiptapButton command="bold">
              <TextBolderIcon />
            </TiptapButton>
            <TiptapButton command="italic">
              <TextItalicIcon />
            </TiptapButton>
            <TiptapButton command="underline">
              <TextUnderlineIcon />
            </TiptapButton>
            <TiptapButton command="bulletList">
              <ListBulletsIcon />
            </TiptapButton>
          </ToolbarGroup>
          {extraToolbar}
        </Toolbar>
        <TiptapContent disabled={disabled} />
      </Tiptap>
      <FieldError />
    </Field>
  )
}

export default TiptapField
